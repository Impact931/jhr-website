'use client';

import { LucideIcon } from 'lucide-react';

interface TrendIndicator {
  icon: LucideIcon;
  text: string;
  variant?: 'positive' | 'neutral' | 'negative';
}

interface StatCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  iconColor?: string;
  trend?: TrendIndicator;
}

const trendVariantStyles = {
  positive: 'text-green-400',
  neutral: 'text-jhr-white-dim',
  negative: 'text-red-400',
};

export default function StatCard({
  title,
  value,
  icon: Icon,
  iconColor = 'jhr-gold',
  trend,
}: StatCardProps) {
  return (
    <div className="bg-jhr-black-light rounded-xl border border-jhr-black-lighter p-6">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-body-sm text-jhr-white-dim">{title}</p>
          <p className="mt-2 text-display-sm font-display font-bold text-jhr-white">
            {value}
          </p>
        </div>
        <div className={`p-3 rounded-lg bg-${iconColor}/10`}>
          <Icon className={`w-6 h-6 text-${iconColor}`} />
        </div>
      </div>
      {trend && (
        <div className="mt-4 flex items-center gap-2 text-body-sm">
          <trend.icon
            className={`w-4 h-4 ${trendVariantStyles[trend.variant || 'neutral']}`}
          />
          <span className={trendVariantStyles[trend.variant || 'neutral']}>
            {trend.text}
          </span>
        </div>
      )}
    </div>
  );
}
