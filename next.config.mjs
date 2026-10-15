/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
  experimental: {
    typedRoutes: false,
  },
  async redirects() {
    return [
      {
        source: '/telemetry',
        destination: '/beers',
        permanent: true,
      },
    ]
  },
}

export default nextConfig
