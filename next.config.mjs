/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  images: {
    formats: ['image/avif', 'image/webp'],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'jhr-website-images.s3.us-east-1.amazonaws.com',
      },
      {
        protocol: 'https',
        hostname: '*.amazonaws.com',
      },
      {
        protocol: 'https',
        hostname: '*.cloudfront.net',
      },
      {
        protocol: 'https',
        hostname: 'placehold.co',
      },
    ],
  },
  async headers() {
    const securityHeaders = [
      {
        key: 'Strict-Transport-Security',
        value: 'max-age=31536000; includeSubDomains',
      },
      {
        key: 'X-Content-Type-Options',
        value: 'nosniff',
      },
      {
        key: 'X-Frame-Options',
        value: 'DENY',
      },
      {
        key: 'Referrer-Policy',
        value: 'strict-origin-when-cross-origin',
      },
    ];

    return [
      {
        // All pages: cache + security headers
        source: '/((?!api|_next/static|_next/image|favicon.ico).*)',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, s-maxage=60, stale-while-revalidate=300',
          },
          ...securityHeaders,
        ],
      },
      {
        // API routes: security headers only
        source: '/api/:path*',
        headers: securityHeaders,
      },
    ];
  },
  async redirects() {
    return [
      // Internal redirect
      {
        source: '/services/corporate-headshot-program',
        destination: '/services/executive-imaging',
        permanent: true,
      },

      // ============================================================
      // Legacy WordPress → New Next.js URL redirects
      // Preserves SEO equity from old site indexed by Google
      // ============================================================

      // Service pages
      {
        source: '/event-photography',
        destination: '/services/corporate-event-coverage',
        permanent: true,
      },
      {
        source: '/event-photography/:path*',
        destination: '/services/corporate-event-coverage',
        permanent: true,
      },
      {
        source: '/corporate-team-headshots',
        destination: '/services/headshot-activation',
        permanent: true,
      },
      {
        source: '/corporate-team-headshots/:path*',
        destination: '/services/headshot-activation',
        permanent: true,
      },
      {
        source: '/business-portrait',
        destination: '/services/executive-imaging',
        permanent: true,
      },
      {
        source: '/business-portrait/:path*',
        destination: '/services/executive-imaging',
        permanent: true,
      },
      {
        source: '/conference-tradeshow-headshot-experience',
        destination: '/services/headshot-activation',
        permanent: true,
      },
      {
        source: '/conference-tradeshow-headshot-experience/:path*',
        destination: '/services/headshot-activation',
        permanent: true,
      },
      {
        source: '/what-type-of-headshot',
        destination: '/services/executive-imaging',
        permanent: true,
      },
      {
        source: '/what-type-of-headshot/:path*',
        destination: '/services/executive-imaging',
        permanent: true,
      },
      {
        source: '/personal-branding',
        destination: '/services/executive-imaging',
        permanent: true,
      },
      {
        source: '/personal-branding/:path*',
        destination: '/services/executive-imaging',
        permanent: true,
      },
      {
        source: '/senior-portraits',
        destination: '/services',
        permanent: true,
      },
      {
        source: '/senior-portraits/:path*',
        destination: '/services',
        permanent: true,
      },
      {
        source: '/events',
        destination: '/services/corporate-event-coverage',
        permanent: true,
      },
      {
        source: '/events/:path*',
        destination: '/services/corporate-event-coverage',
        permanent: true,
      },

      // Contact & about
      {
        source: '/contact-us',
        destination: '/contact',
        permanent: true,
      },
      {
        source: '/contact-us/:path*',
        destination: '/contact',
        permanent: true,
      },
      {
        source: '/about-us',
        destination: '/about',
        permanent: true,
      },
      {
        source: '/about-us/:path*',
        destination: '/about',
        permanent: true,
      },

      // Blog & content
      {
        source: '/the-jhr-photography-blog',
        destination: '/blog',
        permanent: true,
      },
      {
        source: '/the-jhr-photography-blog/:path*',
        destination: '/blog',
        permanent: true,
      },
      {
        source: '/boutique-styled',
        destination: '/blog',
        permanent: true,
      },
      {
        source: '/boutique-styled/:path*',
        destination: '/blog',
        permanent: true,
      },
      {
        source: '/professional-headshot-10-ways',
        destination: '/blog',
        permanent: true,
      },
      {
        source: '/professional-headshot-10-ways/:path*',
        destination: '/blog',
        permanent: true,
      },
      {
        source: '/7-things-i-learned-in-my-first-year-as-a-headshot-photographer',
        destination: '/blog',
        permanent: true,
      },
      {
        source: '/business-headshot-branding',
        destination: '/blog',
        permanent: true,
      },
      {
        source: '/professional-headshot-success',
        destination: '/blog',
        permanent: true,
      },
      {
        source: '/5-things-business-headshots',
        destination: '/blog',
        permanent: true,
      },
      {
        source: '/professional-headshot-for-business',
        destination: '/blog',
        permanent: true,
      },

      // Legal
      {
        source: '/cookie-policy',
        destination: '/privacy',
        permanent: true,
      },
      {
        source: '/terms-of-service',
        destination: '/terms',
        permanent: true,
      },

      // Misc WordPress pages
      {
        source: '/google-review-request',
        destination: '/',
        permanent: true,
      },
      {
        source: '/thank-you-video',
        destination: '/',
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
