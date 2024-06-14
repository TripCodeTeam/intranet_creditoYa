require("next-ws/server").verifyPatch();

/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ["res.cloudinary.com"],
    unoptimized: true,
  },
};

module.exports = nextConfig;
