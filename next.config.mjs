// Force new build
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        net: false,
        tls: false,
        crypto: false,
        process: false,
      };
      config.resolve.alias['pino'] = false;
      config.resolve.alias['thread-stream'] = false;
      config.resolve.alias['pino-file'] = false;
    }
    return config;
  },
};

export default nextConfig;
