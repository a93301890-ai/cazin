/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
  // Clean build - Neon PostgreSQL
  experimental: {
    serverComponentsExternalPackages: ["@neondatabase/serverless", "bcryptjs"],
  },
}

export default nextConfig
