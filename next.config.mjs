/** @type {import('next').NextConfig} */
const nextConfig = {
  // 👇 Enable Turbopack explicitly
  turbopack: {},

  reactStrictMode: true,

  // Transpile ESM packages
  transpilePackages: ['tinacms-gitprovider-github', 'next-tinacms-s3'],

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

