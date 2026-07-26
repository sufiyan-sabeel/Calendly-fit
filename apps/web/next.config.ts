import type { NextConfig } from 'next';

const isExport = process.env.EXPORT_MODE === 'true';

const nextConfig: NextConfig = {
  ...(isExport
    ? { output: 'export', images: { unoptimized: true } }
    : {
        images: {
          remotePatterns: [
            { protocol: 'https', hostname: '*.supabase.co' },
            { protocol: 'https', hostname: '*.googleusercontent.com' },
          ],
        },
      }),
  basePath: isExport ? '/Calendly-fit' : undefined,
  transpilePackages: ['@calendy/api', '@calendy/config', '@calendy/types', '@calendy/utils', '@calendy/hooks'],
  experimental: {
    optimizePackageImports: ['lucide-react', '@radix-ui/react-*'],
  },
};

export default nextConfig;
