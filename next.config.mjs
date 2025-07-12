/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: false,
  },
  typescript: {
    ignoreBuildErrors: false,
  },
  images: {
    unoptimized: true,
  },
  experimental: {
    typedRoutes: false,
    serverActions: {
      bodySizeLimit: "3mb",
    },
  },
};

export default nextConfig;
