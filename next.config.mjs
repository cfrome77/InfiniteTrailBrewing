/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    unoptimized: true,
  },
  typedRoutes: false,
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
