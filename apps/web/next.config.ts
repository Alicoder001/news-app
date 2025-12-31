import type { NextConfig } from "next";
import createNextIntlPlugin from 'next-intl/plugin';

const withNextIntl = createNextIntlPlugin('./src/i18n/request.ts');

const nextConfig: NextConfig = {
  /* config options here */
  reactCompiler: true,
  images: {
    remotePatterns: [
      // Stock Images
      { protocol: 'https', hostname: 'images.unsplash.com' },
      { protocol: 'https', hostname: '*.pexels.com' },
      // News Sources
      { protocol: 'https', hostname: '*.techcrunch.com' },
      { protocol: 'https', hostname: '*.theverge.com' },
      { protocol: 'https', hostname: '*.wired.com' },
      { protocol: 'https', hostname: '*.arstechnica.com' },
      { protocol: 'https', hostname: '*.cnet.com' },
      // CDNs
      { protocol: 'https', hostname: '*.cloudinary.com' },
      { protocol: 'https', hostname: '*.imgix.net' },
      { protocol: 'https', hostname: 'cdn.*.com' },
    ],
  },
};

export default withNextIntl(nextConfig);
