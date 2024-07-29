/** @type {import('next').NextConfig} */
const nextConfig = {
  publicRuntimeConfig: {
    apiBaseUrl: process.env.NEXT_PUBLIC_API_BASE_URL,
  },
  images: {
    domains: ['cloudflare-ipfs.com'],
  },
};

export default nextConfig;
