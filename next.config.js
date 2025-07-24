/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: ["lucide-react"],
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
}

module.exports = nextConfig
