'use client';

import { useEffect, useState, useMemo } from 'react';
import { Loader2, ExternalLink, ChevronDown, ChevronUp, Heart, MessageCircle, Eye, ThumbsUp, Play, Users } from 'lucide-react';

/* ------------------------------------------------------------------ */
/* Types                                                               */
/* ------------------------------------------------------------------ */

interface MetaData {
  connected: boolean;
  platform: string;
  account?: {
    name: string;
    username?: string;
    followersCount: number;
    mediaCount: number;
    profilePictureUrl?: string;
  };
  insights?: {
    reach: number;
    impressions: number;
    profileViews: number;
    websiteClicks: number;
  };
  recentMedia?: {
    id: string;
    caption?: string;
    mediaType: string;
    mediaUrl: string;
    thumbnailUrl?: string;
    permalink: string;
    timestamp: string;
    likeCount: number;
    commentsCount: number;
  }[];
}

interface YouTubeData {
  connected: boolean;
  platform: string;
  channel?: {
    title: string;
    thumbnailUrl: string;
    customUrl?: string;
  };
  statistics?: {
    subscriberCount: number;
    viewCount: number;
    videoCount: number;
  };
  recentVideos?: {
    id: string;
    title: string;
    thumbnailUrl: string;
    publishedAt: string;
    viewCount: number;
    likeCount: number;
    commentCount: number;
  }[];
}

/* ------------------------------------------------------------------ */
/* Platform SVG Icons                                                   */
/* ------------------------------------------------------------------ */

function InstagramIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none">
      <defs>
        <linearGradient id="ig-gradient" x1="0%" y1="100%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#FD5" />
          <stop offset="25%" stopColor="#FF543E" />
          <stop offset="50%" stopColor="#C837AB" />
          <stop offset="100%" stopColor="#5B51D8" />
        </linearGradient>
      </defs>
      <rect x="2" y="2" width="20" height="20" rx="5" stroke="url(#ig-gradient)" strokeWidth="2" />
      <circle cx="12" cy="12" r="5" stroke="url(#ig-gradient)" strokeWidth="2" />
      <circle cx="17.5" cy="6.5" r="1.5" fill="url(#ig-gradient)" />
    </svg>
  );
}

function FacebookIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 2.04c-5.5 0-10 4.49-10 10.02 0 5 3.66 9.15 8.44 9.9v-7H7.9v-2.9h2.54V9.85c0-2.52 1.49-3.93 3.78-3.93 1.09 0 2.23.2 2.23.2v2.46h-1.26c-1.24 0-1.63.77-1.63 1.56v1.88h2.78l-.45 2.9h-2.33v7a10 10 0 0 0 8.44-9.9c0-5.53-4.5-10.02-10-10.02z" />
    </svg>
  );
}

function YouTubeIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
    </svg>
  );
}

/* ------------------------------------------------------------------ */
/* Status Badge                                                        */
/* ------------------------------------------------------------------ */

function StatusBadge({ connected }: { connected: boolean }) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${
        connected
          ? 'bg-green-500/10 text-green-400 border border-green-500/20'
          : 'bg-gray-500/10 text-gray-400 border border-gray-500/20'
      }`}
    >
      <span className={`w-1.5 h-1.5 rounded-full ${connected ? 'bg-green-400' : 'bg-gray-400'}`} />
      {connected ? 'Connected' : 'Not Connected'}
    </span>
  );
}

/* ------------------------------------------------------------------ */
/* Setup Guide (expandable)                                            */
/* ------------------------------------------------------------------ */

function SetupGuide({
  title,
  envVars,
  steps,
}: {
  title: string;
  envVars: { name: string; description: string }[];
  steps: string[];
}) {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="mt-4">
      <button
        onClick={() => setExpanded(!expanded)}
        className="flex items-center gap-2 text-sm font-medium text-jhr-gold hover:text-jhr-gold/80 transition-colors"
      >
        {expanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        Setup Guide
      </button>

      {expanded && (
        <div className="mt-4 space-y-4">
          <div>
            <h4 className="text-sm font-medium text-jhr-white mb-2">Required Environment Variables</h4>
            <div className="space-y-2">
              {envVars.map((v) => (
                <div key={v.name} className="flex items-start gap-2">
                  <code className="text-xs bg-jhr-black px-2 py-1 rounded text-jhr-gold font-mono whitespace-nowrap">
                    {v.name}
                  </code>
                  <span className="text-xs text-jhr-white-dim">{v.description}</span>
                </div>
              ))}
            </div>
          </div>

          <div>
            <h4 className="text-sm font-medium text-jhr-white mb-2">{title}</h4>
            <ol className="space-y-2">
              {steps.map((step, i) => (
                <li key={i} className="flex items-start gap-2 text-sm text-jhr-white-dim">
                  <span className="flex-shrink-0 w-5 h-5 rounded-full bg-jhr-black flex items-center justify-center text-xs text-jhr-gold font-medium">
                    {i + 1}
                  </span>
                  {step}
                </li>
              ))}
            </ol>
          </div>
        </div>
      )}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Not Connected Card                                                  */
/* ------------------------------------------------------------------ */

function NotConnectedCard({
  icon,
  title,
  description,
  envVars,
  setupSteps,
  setupTitle,
  accentColor,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
  envVars: { name: string; description: string }[];
  setupSteps: string[];
  setupTitle: string;
  accentColor: string;
}) {
  return (
    <div className="bg-jhr-black-light rounded-xl border border-jhr-black-lighter p-6">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className={`p-3 rounded-lg ${accentColor}`}>
            {icon}
          </div>
          <div>
            <h3 className="text-lg font-semibold text-jhr-white">{title}</h3>
            <StatusBadge connected={false} />
          </div>
        </div>
      </div>

      <p className="text-sm text-jhr-white-dim mb-4">{description}</p>

      <SetupGuide title={setupTitle} envVars={envVars} steps={setupSteps} />
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Metric Card                                                         */
/* ------------------------------------------------------------------ */

function MetricCard({
  label,
  value,
  icon,
}: {
  label: string;
  value: string | number;
  icon: React.ReactNode;
}) {
  return (
    <div className="bg-jhr-black rounded-lg border border-jhr-black-lighter p-4">
      <div className="flex items-center gap-2 mb-1">
        {icon}
        <span className="text-xs text-jhr-white-dim uppercase tracking-wide">{label}</span>
      </div>
      <p className="text-2xl font-bold text-jhr-white">{typeof value === 'number' ? value.toLocaleString() : value}</p>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Summary Card (top row)                                              */
/* ------------------------------------------------------------------ */

function SummaryCard({
  icon,
  platformName,
  metricLabel,
  metricValue,
  connected,
}: {
  icon: React.ReactNode;
  platformName: string;
  metricLabel: string;
  metricValue?: number;
  connected: boolean;
}) {
  return (
    <div className="bg-jhr-black-light rounded-xl border border-jhr-black-lighter p-6">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-3">
          {icon}
          <span className="text-sm font-medium text-jhr-white">{platformName}</span>
        </div>
        <StatusBadge connected={connected} />
      </div>
      <div>
        <p className="text-xs text-jhr-white-dim uppercase tracking-wide mb-1">{metricLabel}</p>
        <p className="text-3xl font-bold text-jhr-white">
          {connected && metricValue !== undefined ? metricValue.toLocaleString() : '--'}
        </p>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Recent Posts Grid (small thumbnails + show more)                     */
/* ------------------------------------------------------------------ */

function RecentPostsGrid({
  posts,
}: {
  posts: NonNullable<MetaData['recentMedia']>;
}) {
  const INITIAL_COUNT = 8;
  const [showAll, setShowAll] = useState(false);
  const visiblePosts = useMemo(
    () => (showAll ? posts : posts.slice(0, INITIAL_COUNT)),
    [posts, showAll]
  );
  const hasMore = posts.length > INITIAL_COUNT;

  return (
    <div>
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-medium text-jhr-white-dim">
          Recent Posts ({posts.length})
        </h3>
        {hasMore && (
          <button
            onClick={() => setShowAll(!showAll)}
            className="flex items-center gap-1 text-xs text-jhr-gold hover:text-jhr-gold/80 transition-colors"
          >
            {showAll ? (
              <>
                Show less <ChevronUp className="w-3 h-3" />
              </>
            ) : (
              <>
                Show all {posts.length} <ChevronDown className="w-3 h-3" />
              </>
            )}
          </button>
        )}
      </div>
      <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 gap-2">
        {visiblePosts.map((post) => (
          <a
            key={post.id}
            href={post.permalink}
            target="_blank"
            rel="noopener noreferrer"
            className="group relative aspect-square bg-jhr-black rounded-md overflow-hidden border border-jhr-black-lighter hover:border-jhr-gold/30 transition-colors"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={post.thumbnailUrl || post.mediaUrl}
              alt={post.caption?.slice(0, 60) || 'Instagram post'}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
              <span className="flex items-center gap-0.5 text-[10px] text-white">
                <Heart className="w-3 h-3" /> {post.likeCount}
              </span>
              <span className="flex items-center gap-0.5 text-[10px] text-white">
                <MessageCircle className="w-3 h-3" /> {post.commentsCount}
              </span>
            </div>
          </a>
        ))}
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Main Page                                                           */
/* ------------------------------------------------------------------ */

export default function AdminSocialPage() {
  const [metaData, setMetaData] = useState<MetaData | null>(null);
  const [youtubeData, setYoutubeData] = useState<YouTubeData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const [metaRes, ytRes] = await Promise.all([
          fetch('/api/admin/social/meta'),
          fetch('/api/admin/social/youtube'),
        ]);

        if (metaRes.ok) {
          setMetaData(await metaRes.json());
        } else {
          setMetaData({ connected: false, platform: 'instagram' });
        }

        if (ytRes.ok) {
          setYoutubeData(await ytRes.json());
        } else {
          setYoutubeData({ connected: false, platform: 'youtube' });
        }
      } catch {
        setMetaData({ connected: false, platform: 'instagram' });
        setYoutubeData({ connected: false, platform: 'youtube' });
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="w-8 h-8 text-jhr-gold animate-spin" />
        <span className="ml-3 text-body-md text-jhr-white-dim">Loading social media data...</span>
      </div>
    );
  }

  const igConnected = metaData?.connected ?? false;
  const fbConnected = metaData?.connected ?? false; // Same Meta token covers both IG and FB
  const ytConnected = youtubeData?.connected ?? false;

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-display-sm font-display font-bold text-jhr-white">Social Media</h1>
        <p className="mt-2 text-body-md text-jhr-white-dim">
          Monitor your social media presence across Instagram, Facebook, and YouTube.
        </p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <SummaryCard
          icon={<InstagramIcon className="w-6 h-6" />}
          platformName="Instagram"
          metricLabel="Followers"
          metricValue={metaData?.account?.followersCount}
          connected={igConnected}
        />
        <SummaryCard
          icon={<FacebookIcon className="w-6 h-6 text-blue-500" />}
          platformName="Facebook"
          metricLabel="Page Reach"
          connected={fbConnected}
        />
        <SummaryCard
          icon={<YouTubeIcon className="w-6 h-6 text-red-500" />}
          platformName="YouTube"
          metricLabel="Subscribers"
          metricValue={youtubeData?.statistics?.subscriberCount}
          connected={ytConnected}
        />
      </div>

      {/* Instagram Panel */}
      <div>
        <h2 className="text-lg font-display font-semibold text-jhr-white mb-4 flex items-center gap-2">
          <InstagramIcon className="w-5 h-5" />
          Instagram
        </h2>
        {igConnected && metaData?.account ? (
          <div className="space-y-4">
            {/* Metrics */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <MetricCard
                label="Followers"
                value={metaData.account.followersCount}
                icon={<Users className="w-4 h-4 text-jhr-white-dim" />}
              />
              <MetricCard
                label="Reach (7d)"
                value={metaData.insights?.reach ?? 0}
                icon={<Eye className="w-4 h-4 text-jhr-white-dim" />}
              />
              <MetricCard
                label="Profile Views (7d)"
                value={metaData.insights?.profileViews ?? 0}
                icon={<Eye className="w-4 h-4 text-jhr-white-dim" />}
              />
              <MetricCard
                label="Website Clicks (7d)"
                value={metaData.insights?.websiteClicks ?? 0}
                icon={<ExternalLink className="w-4 h-4 text-jhr-white-dim" />}
              />
            </div>

            {/* Recent posts grid — small thumbnails */}
            {metaData.recentMedia && metaData.recentMedia.length > 0 && (
              <RecentPostsGrid posts={metaData.recentMedia} />
            )}
          </div>
        ) : (
          <NotConnectedCard
            icon={<InstagramIcon className="w-6 h-6" />}
            title="Connect Instagram"
            description="Connect your Instagram Business account to view follower analytics, post engagement, and profile insights directly in your dashboard."
            accentColor="bg-pink-500/10"
            setupTitle="How to connect Instagram"
            envVars={[
              { name: 'META_PAGE_ACCESS_TOKEN', description: 'Long-lived Page Access Token from Meta Developer Console' },
              { name: 'IG_BUSINESS_USER_ID', description: 'Instagram Business Account ID (numeric)' },
              { name: 'META_APP_ID', description: 'Meta App ID from developer.facebook.com' },
              { name: 'META_APP_SECRET', description: 'Meta App Secret (keep secure)' },
            ]}
            setupSteps={[
              'Create a Meta App at developers.facebook.com',
              'Add the Instagram Graph API product to your app',
              'Connect your Instagram Business or Creator account to a Facebook Page',
              'Generate a Page Access Token with instagram_basic, instagram_manage_insights, and pages_show_list permissions',
              'Exchange the short-lived token for a long-lived token (60 days)',
              'Find your IG Business User ID via the /me/accounts endpoint',
              'Add all credentials to your environment variables and redeploy',
            ]}
          />
        )}
      </div>

      {/* Facebook Panel */}
      <div>
        <h2 className="text-lg font-display font-semibold text-jhr-white mb-4 flex items-center gap-2">
          <FacebookIcon className="w-5 h-5 text-blue-500" />
          Facebook
        </h2>
        {fbConnected ? (
          <div className="bg-jhr-black-light rounded-xl border border-jhr-black-lighter p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-3 rounded-lg bg-blue-500/10">
                <FacebookIcon className="w-6 h-6 text-blue-500" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-jhr-white">
                  {metaData?.account?.name || 'JHR Photography'}
                </h3>
                <StatusBadge connected={true} />
              </div>
            </div>
            <p className="text-sm text-jhr-white-dim">
              Facebook Page is linked via the same Meta Business token as Instagram.
              Detailed Facebook Page analytics will be available in a future update.
            </p>
          </div>
        ) : (
          <NotConnectedCard
            icon={<FacebookIcon className="w-6 h-6 text-blue-500" />}
            title="Connect Facebook"
            description="Connect your Facebook Business Page to monitor page reach, post engagement, and audience demographics."
            accentColor="bg-blue-500/10"
            setupTitle="How to connect Facebook"
            envVars={[
              { name: 'META_PAGE_ACCESS_TOKEN', description: 'Long-lived Page Access Token (same as Instagram if using the same Page)' },
              { name: 'FB_PAGE_ID', description: 'Facebook Page ID' },
              { name: 'META_APP_ID', description: 'Meta App ID from developer.facebook.com' },
              { name: 'META_APP_SECRET', description: 'Meta App Secret (keep secure)' },
            ]}
            setupSteps={[
              'Create or use an existing Meta App at developers.facebook.com',
              'Add the Pages API product to your app',
              'Generate a Page Access Token with pages_show_list and read_insights permissions',
              'Exchange for a long-lived token (60 days)',
              'Find your Page ID from your Facebook Page settings or the /me/accounts endpoint',
              'Add credentials to your environment variables and redeploy',
            ]}
          />
        )}
      </div>

      {/* YouTube Panel */}
      <div>
        <h2 className="text-lg font-display font-semibold text-jhr-white mb-4 flex items-center gap-2">
          <YouTubeIcon className="w-5 h-5 text-red-500" />
          YouTube
        </h2>
        {ytConnected && youtubeData?.channel ? (
          <div className="space-y-4">
            {/* Channel info */}
            <div className="bg-jhr-black-light rounded-xl border border-jhr-black-lighter p-6">
              <div className="flex items-center gap-4 mb-4">
                {youtubeData.channel.thumbnailUrl && (
                  /* eslint-disable-next-line @next/next/no-img-element */
                  <img
                    src={youtubeData.channel.thumbnailUrl}
                    alt={youtubeData.channel.title}
                    className="w-12 h-12 rounded-full"
                  />
                )}
                <div>
                  <h3 className="text-lg font-semibold text-jhr-white">{youtubeData.channel.title}</h3>
                  {youtubeData.channel.customUrl && (
                    <a
                      href={`https://youtube.com/${youtubeData.channel.customUrl}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-red-400 hover:text-red-300 transition-colors flex items-center gap-1"
                    >
                      {youtubeData.channel.customUrl}
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  )}
                </div>
                <div className="ml-auto">
                  <StatusBadge connected={true} />
                </div>
              </div>

              {/* Metrics */}
              <div className="grid grid-cols-3 gap-4">
                <MetricCard
                  label="Subscribers"
                  value={youtubeData.statistics?.subscriberCount ?? 0}
                  icon={<Users className="w-4 h-4 text-jhr-white-dim" />}
                />
                <MetricCard
                  label="Total Views"
                  value={youtubeData.statistics?.viewCount ?? 0}
                  icon={<Eye className="w-4 h-4 text-jhr-white-dim" />}
                />
                <MetricCard
                  label="Videos"
                  value={youtubeData.statistics?.videoCount ?? 0}
                  icon={<Play className="w-4 h-4 text-jhr-white-dim" />}
                />
              </div>
            </div>

            {/* Recent videos */}
            {youtubeData.recentVideos && youtubeData.recentVideos.length > 0 && (
              <div>
                <h3 className="text-sm font-medium text-jhr-white-dim mb-3">Recent Videos</h3>
                <div className="space-y-3">
                  {youtubeData.recentVideos.map((video) => (
                    <a
                      key={video.id}
                      href={`https://youtube.com/watch?v=${video.id}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-start gap-4 bg-jhr-black-light rounded-xl border border-jhr-black-lighter p-4 hover:border-jhr-gold/30 transition-colors group"
                    >
                      <div className="relative flex-shrink-0 w-40 aspect-video rounded-lg overflow-hidden bg-jhr-black">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={video.thumbnailUrl}
                          alt={video.title}
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 flex items-center justify-center">
                          <div className="w-10 h-10 rounded-full bg-red-600/90 flex items-center justify-center group-hover:bg-red-500 transition-colors">
                            <Play className="w-5 h-5 text-white ml-0.5" />
                          </div>
                        </div>
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="text-sm font-medium text-jhr-white group-hover:text-jhr-gold transition-colors line-clamp-2">
                          {video.title}
                        </h4>
                        <p className="text-xs text-jhr-white-dim mt-1">
                          {new Date(video.publishedAt).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'short',
                            day: 'numeric',
                          })}
                        </p>
                        <div className="flex items-center gap-4 mt-2 text-xs text-jhr-white-dim">
                          <span className="flex items-center gap-1 font-medium text-jhr-white">
                            <Eye className="w-3 h-3 text-jhr-white-dim" /> {video.viewCount.toLocaleString()} views
                          </span>
                          <span className="flex items-center gap-1">
                            <ThumbsUp className="w-3 h-3" /> {video.likeCount.toLocaleString()} likes
                          </span>
                          <span className="flex items-center gap-1">
                            <MessageCircle className="w-3 h-3" /> {video.commentCount.toLocaleString()}
                          </span>
                        </div>
                      </div>
                    </a>
                  ))}
                </div>
              </div>
            )}
          </div>
        ) : (
          <NotConnectedCard
            icon={<YouTubeIcon className="w-6 h-6 text-red-500" />}
            title="Connect YouTube"
            description="Connect your YouTube channel to track subscriber growth, video performance, and audience engagement metrics."
            accentColor="bg-red-500/10"
            setupTitle="How to connect YouTube"
            envVars={[
              { name: 'YOUTUBE_CHANNEL_ID', description: 'Your YouTube Channel ID (starts with UC...)' },
              { name: 'YOUTUBE_API_KEY', description: 'YouTube Data API v3 key from Google Cloud Console (or GOOGLE_API_KEY)' },
            ]}
            setupSteps={[
              'Go to console.cloud.google.com and create or select a project',
              'Enable the YouTube Data API v3',
              'Create an API key under Credentials',
              'Find your Channel ID from YouTube Studio > Settings > Channel > Advanced settings',
              'Add YOUTUBE_CHANNEL_ID and YOUTUBE_API_KEY to your environment variables',
              'Redeploy your application',
            ]}
          />
        )}
      </div>
    </div>
  );
}
