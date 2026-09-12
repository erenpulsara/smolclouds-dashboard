import type { Metadata } from "next";
import { JetBrains_Mono } from "next/font/google";
import { ClerkProvider } from "@clerk/nextjs";
import "./globals.css";

const jetbrains = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-jetbrains",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "SmolClouds Console",
    template: "%s · SmolClouds",
  },
  description: "Control plane for apps running on SmolClouds.",
  robots: { index: false, follow: false },
};

/** Clerk's own UI, restated in the console's language: black, mono, square. */
const clerkAppearance = {
  variables: {
    colorBackground: "#000000",
    colorForeground: "#ffffff",
    colorPrimary: "#ffffff",
    colorPrimaryForeground: "#000000",
    colorMuted: "#08090a",
    colorMutedForeground: "#888888",
    colorInput: "#0e1011",
    colorInputForeground: "#ffffff",
    colorBorder: "#1c1f21",
    colorNeutral: "#ffffff",
    colorDanger: "#ffffff",
    colorSuccess: "#ffffff",
    borderRadius: "0px",
    fontFamily: "var(--font-jetbrains), ui-monospace, monospace",
    fontFamilyButtons: "var(--font-jetbrains), ui-monospace, monospace",
  },
} as const;

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${jetbrains.variable} h-full`}>
      <body className="grain min-h-full bg-bg text-text">
        <ClerkProvider appearance={clerkAppearance}>{children}</ClerkProvider>
      </body>
    </html>
  );
}
