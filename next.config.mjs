/** @type {import('next').NextConfig} */
const nextConfig = {
  // 👇 Enable Turbopack explicitly
  turbopack: {},
   async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'X-Frame-Options',
            value: 'SAMEORIGIN', // Prevents clickjacking - can't embed your site in iframes
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff', // Prevents MIME sniffing attacks
          },
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin', // Doesn't leak sensitive URLs
          },
          {
            key: 'Permissions-Policy',
            value: 'geolocation=(), microphone=(), camera=()', // Blocks unnecessary browser features
          },
          {
            key: 'Strict-Transport-Security',
            value: 'max-age=31536000; includeSubDomains', // Forces HTTPS (production only)
          },
        ],
      },
    ];
  },
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

