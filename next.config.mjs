/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    optimizePackageImports: ['@coinbase/onchainkit']
  }
}

export default nextConfig
