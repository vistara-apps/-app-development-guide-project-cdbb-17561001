import "./globals.css";
import "@coinbase/onchainkit/styles.css";
import type { Metadata, Viewport } from "next";
import { type ReactNode } from "react";
import { Providers } from "./providers";

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
};

export const metadata: Metadata = {
  title: "StatementSage",
  description: "Transform bank statements into smart financial insights, effortlessly.",
  other: {
    "fc:frame": JSON.stringify({
      version: "next",
      imageUrl: "/api/og",
      button: {
        title: "Launch StatementSage",
        action: {
          type: "launch_frame",
          name: "StatementSage",
          url: process.env.NEXT_PUBLIC_URL || "http://localhost:3000",
          splashImageUrl: "/splash.png",
          splashBackgroundColor: "#f8fafc",
        },
      },
    }),
  },
};

export default function RootLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-bg text-text">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
