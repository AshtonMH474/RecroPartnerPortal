/** @type {import('next').NextConfig} */
const nextConfig = {
  // 👇 Enable Turbopack explicitly
  turbopack: {},

  reactStrictMode: true,

  // Transpile ESM packages
  transpilePackages: ['tinacms-gitprovider-github'],

  async rewrites() {
    return [
      {
        source: '/admin',
        destination: '/admin/index.html',
      },
    ];
  },
};

export default nextConfig;

