/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  experimental: {
    serverActions: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    domains: [], // falls du externe Logos oder Bilder nutzt
  },
};

module.exports = nextConfig;
