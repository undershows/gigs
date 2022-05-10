/** @type {import('next').NextConfig} */
module.exports = {
  reactStrictMode: true,
  eslint: {
    dirs: ["src/"],
  },
  images: {
    loader: "custom",
  },
  assetPrefix: process.env.ASSET_PREFIX,
};
