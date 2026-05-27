import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      {
        source: "/:path*",
        has: [{ type: "host", value: "mouthpiece.vercel.app" }],
        destination: "https://public-wire.vercel.app/:path*",
        permanent: true,
      },
      {
        source: "/:path*",
        has: [{ type: "host", value: "locallens-silk.vercel.app" }],
        destination: "https://public-wire.vercel.app/:path*",
        permanent: true,
      },
      {
        source: "/:path*",
        has: [{ type: "host", value: "locallens-3u0d86swd-advik-bhatt.vercel.app" }],
        destination: "https://public-wire.vercel.app/:path*",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
