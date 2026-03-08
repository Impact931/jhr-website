import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { putItem, queryItems, deleteItem, scanItemsByPkPrefix, getItem } from '@/lib/dynamodb';

/**
 * GET /api/admin/alerts — returns active alerts from DynamoDB
 * POST /api/admin/alerts — evaluate thresholds (called by cron endpoint)
 * DELETE /api/admin/alerts?id={alertId} — dismiss/resolve an alert
 *
 * Alert record: pk=ALERT#{uuid}, sk=active
 * Fields: alert_type, metric_name, threshold_value, actual_value, triggered_at, severity
 */

interface AlertRecord {
  pk: string;
  sk: string;
  alert_type: string;
  metric_name: string;
  threshold_value: number;
  actual_value: number;
  triggered_at: string;
  severity: 'critical' | 'warning';
  message: string;
}

interface SnapshotRecord {
  pk: string;
  sk: string;
  [key: string]: unknown;
}

// Default thresholds
const THRESHOLDS = {
  psiDesktopWarning: 85,
  psiDesktopCritical: 70,
  noLeadsDaysWarning: 5,
  geoScoreDropWarning: 10,
};

function generateAlertId(): string {
  return `${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
}

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    // Scan for all active alerts (pk starts with ALERT#)
    const alerts = await scanItemsByPkPrefix<AlertRecord>('ALERT#');
    // Filter to only active alerts
    const activeAlerts = alerts.filter((a) => a.sk === 'active');

    // Sort by triggered_at descending
    activeAlerts.sort(
      (a, b) =>
        new Date(b.triggered_at).getTime() - new Date(a.triggered_at).getTime()
    );

    return NextResponse.json({ alerts: activeAlerts, count: activeAlerts.length });
  } catch (error) {
    console.error('Error fetching alerts:', error);
    return NextResponse.json(
      { error: 'Failed to fetch alerts' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Allow cron endpoint to call this with CRON_SECRET
    const cronSecret = request.headers.get('x-cron-secret');
    const expectedSecret = process.env.CRON_SECRET;
    const session = await getServerSession(authOptions);

    const isAuthorized =
      session ||
      (cronSecret && expectedSecret && cronSecret === expectedSecret);

    if (!isAuthorized) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    if (body.action !== 'evaluate') {
      return NextResponse.json({ error: 'Unknown action' }, { status: 400 });
    }

    // Clear existing active alerts before re-evaluating
    const existingAlerts = await scanItemsByPkPrefix<AlertRecord>('ALERT#');
    const activeAlerts = existingAlerts.filter((a) => a.sk === 'active');
    for (const alert of activeAlerts) {
      await deleteItem(alert.pk, alert.sk);
    }

    const newAlerts: AlertRecord[] = [];
    const todayStr = new Date().toISOString().split('T')[0];

    // 1. Check PSI Desktop score
    const psiSnapshot = await getItem<SnapshotRecord>(`SNAPSHOT#${todayStr}`, 'psi-desktop');
    if (psiSnapshot && typeof psiSnapshot.performanceScore === 'number') {
      const score = psiSnapshot.performanceScore as number;
      if (score < THRESHOLDS.psiDesktopCritical) {
        newAlerts.push({
          pk: `ALERT#${generateAlertId()}`,
          sk: 'active',
          alert_type: 'threshold_breach',
          metric_name: 'PSI Desktop Score',
          threshold_value: THRESHOLDS.psiDesktopCritical,
          actual_value: score,
          triggered_at: new Date().toISOString(),
          severity: 'critical',
          message: `PSI desktop score is ${score}/100, below critical threshold of ${THRESHOLDS.psiDesktopCritical}.`,
        });
      } else if (score < THRESHOLDS.psiDesktopWarning) {
        newAlerts.push({
          pk: `ALERT#${generateAlertId()}`,
          sk: 'active',
          alert_type: 'threshold_breach',
          metric_name: 'PSI Desktop Score',
          threshold_value: THRESHOLDS.psiDesktopWarning,
          actual_value: score,
          triggered_at: new Date().toISOString(),
          severity: 'warning',
          message: `PSI desktop score is ${score}/100, below warning threshold of ${THRESHOLDS.psiDesktopWarning}.`,
        });
      }
    }

    // 2. Check no leads in 5 days
    try {
      const leads = await scanItemsByPkPrefix<{
        pk: string;
        sk: string;
        submittedAt: string;
      }>('LEAD#');
      if (leads.length > 0) {
        leads.sort(
          (a, b) =>
            new Date(b.submittedAt).getTime() -
            new Date(a.submittedAt).getTime()
        );
        const lastLeadDate = new Date(leads[0].submittedAt);
        const daysSinceLastLead = Math.floor(
          (Date.now() - lastLeadDate.getTime()) / (1000 * 60 * 60 * 24)
        );
        if (daysSinceLastLead >= THRESHOLDS.noLeadsDaysWarning) {
          newAlerts.push({
            pk: `ALERT#${generateAlertId()}`,
            sk: 'active',
            alert_type: 'no_activity',
            metric_name: 'Lead Activity',
            threshold_value: THRESHOLDS.noLeadsDaysWarning,
            actual_value: daysSinceLastLead,
            triggered_at: new Date().toISOString(),
            severity: 'warning',
            message: `No new leads in ${daysSinceLastLead} days. Last lead was on ${leads[0].submittedAt.split('T')[0]}.`,
          });
        }
      }
    } catch {
      // Lead check failed
    }

    // 3. Check GEO score drop
    const geoSnapshot = await getItem<SnapshotRecord>(`SNAPSHOT#${todayStr}`, 'geo-score');
    if (geoSnapshot && typeof geoSnapshot.score === 'number') {
      // Check yesterday's snapshot for comparison
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      const yesterdayStr = yesterday.toISOString().split('T')[0];
      const prevGeo = await getItem<SnapshotRecord>(`SNAPSHOT#${yesterdayStr}`, 'geo-score');

      if (prevGeo && typeof prevGeo.score === 'number') {
        const drop = (prevGeo.score as number) - (geoSnapshot.score as number);
        if (drop >= THRESHOLDS.geoScoreDropWarning) {
          newAlerts.push({
            pk: `ALERT#${generateAlertId()}`,
            sk: 'active',
            alert_type: 'score_drop',
            metric_name: 'GEO Score',
            threshold_value: THRESHOLDS.geoScoreDropWarning,
            actual_value: drop,
            triggered_at: new Date().toISOString(),
            severity: 'warning',
            message: `GEO score dropped ${drop} points (from ${prevGeo.score} to ${geoSnapshot.score}).`,
          });
        }
      }
    }

    // Store new alerts
    for (const alert of newAlerts) {
      await putItem(alert);
    }

    return NextResponse.json({
      success: true,
      alertsCreated: newAlerts.length,
      alerts: newAlerts,
    });
  } catch (error) {
    console.error('Alert evaluation error:', error);
    return NextResponse.json(
      { error: 'Failed to evaluate alerts' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const alertId = searchParams.get('id');

  if (!alertId) {
    return NextResponse.json({ error: 'Alert ID required' }, { status: 400 });
  }

  try {
    await deleteItem(`ALERT#${alertId}`, 'active');
    return NextResponse.json({ success: true, dismissed: alertId });
  } catch (error) {
    console.error('Error dismissing alert:', error);
    return NextResponse.json(
      { error: 'Failed to dismiss alert' },
      { status: 500 }
    );
  }
}
