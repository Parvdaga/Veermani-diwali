/** @type {import('next').NextConfig} */
const nextConfig = {
  // The "output: 'export'," line has been removed.
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: { unoptimized: true },
};

module.exports = nextConfig;