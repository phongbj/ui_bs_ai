import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  allowedDevOrigins: ['chatbox.bacsi.com'],
  output: 'standalone', 
  webpack: (config) => {
    config.resolve = {
      ...config.resolve,
      fallback: {
        ...(config.resolve?.fallback || {}),
        canvas: false,
      },
    };
    config.cache = false;
    return config;
  },
};

export default nextConfig;
