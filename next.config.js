const basePath = process.env.BASE_PATH;
const assetPrefix = process.env.ASSET_PREFIX;

/** @type {import('next').NextConfig} */
module.exports = {
  reactStrictMode: true,
  eslint: {
    dirs: ["src/"],
  },
  images: {
    loader: "custom",
  },
  assetPrefix,
  basePath,
};
