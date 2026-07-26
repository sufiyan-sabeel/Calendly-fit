import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  transpilePackages: ['@calendy/api', '@calendy/config', '@calendy/types', '@calendy/utils', '@calendy/hooks'],
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: '*.supabase.co' },
      { protocol: 'https', hostname: '*.googleusercontent.com' },
    ],
  },
  experimental: {
    optimizePackageImports: ['lucide-react', '@radix-ui/react-*'],
  },
};

export default nextConfig;
