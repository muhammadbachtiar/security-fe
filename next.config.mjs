/** @type {import('next').NextConfig} */
const nextConfig = {
  async rewrites() {
    return [
      {
        source: "/api/:path*",
        destination: `${process.env.NEXT_PUBLIC_API_BASE_URL}/:path*`,
      },
      {
        source: "/wms/:path*",
        destination: `${process.env.NEXT_PUBLIC_API_BASE_URL_WMS}/:path*`,
      },
      {
        source: "/api-core/:path*",
        destination: `${process.env.NEXT_PUBLIC_API_BASE_URL_CORE}/:path*`,
      },
    ];
  },
};

export default nextConfig;
