import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      { hostname: 'localhost', protocol: 'http' },
      { hostname: 'a0.muscache.com', protocol: 'https' },
      { hostname: 'res.cloudinary.com', protocol: 'https' },
    ],
  },
  reactStrictMode: false,
  // webpack: (config) => {
  //   config.externals.push({
  //     leaflet: 'L',
  //   });
  //   return config;
  // },
};

export default nextConfig;
