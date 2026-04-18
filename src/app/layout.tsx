import type { Metadata } from "next";
import "./globals.css";
import { Navbar } from "@/components/layout/Navbar";

export const metadata: Metadata = {
  title: "London Cuts — One City, Three Cuts",
  description:
    "An AI-native urban storytelling platform. Upload a London memory, receive a story, a postcard, and a place on the atlas.",
  openGraph: {
    title: "London Cuts",
    description: "One City, Three Cuts.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="bg-void text-chalk antialiased">
        <Navbar />
        <main>{children}</main>
      </body>
    </html>
  );
}
