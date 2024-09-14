import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './_styles/globals.css';
import { AuthProvider } from '../src/context/AuthProvider';
import { AppProvider } from '@/src/context/AppProvider';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Blvckpixel',
  description: 'Blvckpixel description',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const pageTitle = 'BLVCKPIXEL';
  return (
    <AuthProvider>
      <html lang="en">
        <head>
          <link rel="icon" href="/favicon.png" type="image/png" />
        </head>
        <body className={inter.className}>
          <AppProvider>{children}</AppProvider>
        </body>
      </html>
    </AuthProvider>
  );
}
