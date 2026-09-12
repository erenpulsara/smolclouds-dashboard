export const site = {
  name: "SmolClouds",
  console: "app.smolclouds.com",
  apiBase: process.env.SMOLCLOUDS_API_BASE ?? "https://api.smolclouds.com",
  marketing: "https://www.smolclouds.com",
  support: "support@smolclouds.com",
} as const;

export const nav = [
  { label: "apps", href: "/apps" },
  { label: "token", href: "/token" },
  { label: "usage", href: "/usage" },
] as const;
