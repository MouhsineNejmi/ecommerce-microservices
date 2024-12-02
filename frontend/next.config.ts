import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    remotePatterns: [
      { hostname: 'localhost', protocol: 'http' },
      { hostname: 'a0.muscache.com', protocol: 'https' },
      { hostname: 'res.cloudinary.com', protocol: 'https' },
    ],
  },
};

export default nextConfig;
