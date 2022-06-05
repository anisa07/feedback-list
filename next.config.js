/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  distDir: 'out',
  env: {
    URL_API: process.env.URL_API,
    FEEDBACK_USER_KEY: process.env.FEEDBACK_USER_KEY,
  }
}

module.exports = nextConfig
