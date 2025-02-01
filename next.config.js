/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "export",
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: { unoptimized: true },
  basePath:
    process.env.NODE_ENV === "production"
      ? "https://ronak99.github.io/portfolio"
      : undefined,
};

module.exports = nextConfig;
