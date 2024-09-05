import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "./context/AuthProvider";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Blvckpixel",
  description: "",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const pageTitle = "BLVCKPIXEL";
  return (
    <AuthProvider>
    <html lang="en">
      <head>
        <title>{pageTitle}</title>
        <link rel="icon" href="/favicon.png" type="image/png" />
        
      </head>
      <body className={inter.className}>{children}</body>
    </html>
    </AuthProvider>
  );
}
