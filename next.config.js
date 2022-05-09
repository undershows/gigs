const isProd = process.env.NODE_ENV === "production";

/** @type {import('next').NextConfig} */
module.exports = {
  reactStrictMode: true,
  eslint: {
    dirs: ["src/"],
  },
  images: {
    loader: "custom",
  },
  assetPrefix: isProd ? "/gigs/" : "",
  basePath: isProd ? "/gigs" : "",
};
