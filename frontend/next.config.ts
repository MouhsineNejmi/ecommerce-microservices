import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      { hostname: 'localhost', protocol: 'http' },
      { hostname: 'a0.muscache.com', protocol: 'https' },
      { hostname: 'res.cloudinary.com', protocol: 'https' },
      { hostname: 'github.com', protocol: 'https' },
      { hostname: 'via.placeholder.com', protocol: 'https' },
    ],
  },
  reactStrictMode: false,
};

export default nextConfig;
