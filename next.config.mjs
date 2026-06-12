/** @type {import('next').NextConfig} */
const nextConfig = {
  reactCompiler: false,
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
  },
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: `${process.env.NEXT_PUBLIC_API_URL || 'https://ideavault-server.onrender.com'}/api/:path*`,
      },
    ];
  },
};

export default nextConfig;