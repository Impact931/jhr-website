/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'jhr-website-images.s3.us-east-1.amazonaws.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'd2kcvv1z8cjmc8.cloudfront.net',
        pathname: '/**',
      },
    ],
  },
};

export default nextConfig;
