/** @type {import('next').NextConfig} */
const nextConfig = {
  env: {
    NEXT_PUBLIC_AZURE_OPENAI_KEY: process.env.AZURE_OPENAI_KEY,
    NEXT_PUBLIC_AZURE_OPENAI_ENDPOINT: process.env.AZURE_OPENAI_ENDPOINT,
    NEXT_PUBLIC_AZURE_OPENAI_DEPLOYMENT_NAME: process.env.AZURE_OPENAI_DEPLOYMENT_NAME,
  }
}

module.exports = nextConfig 