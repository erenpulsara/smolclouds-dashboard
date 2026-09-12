import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Without this Turbopack walks up to the home directory looking for a
  // lockfile and infers the wrong project root.
  turbopack: { root: import.meta.dirname },
};

export default nextConfig;
