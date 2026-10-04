import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Bibliothèque — Book Library",
  description:
    "A beautiful artistic digital book library.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}