/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'umdoztccetipomspexag.supabase.co',
        port: '',
        pathname: '/storage/**',
      },
    ],
  },
  experimental: {
    workerThreads: false,
    cpus: 4,
  },
};

module.exports = nextConfig;
