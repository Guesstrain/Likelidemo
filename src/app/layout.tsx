import type { Metadata } from 'next';
import type { ReactNode } from 'react';
import './globals.css';
import AppProviders from './providers';

export const metadata: Metadata = {
  title: 'Likeli.io',
  description: "World's first leveraged prediction market",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body className="antialiased">
        <AppProviders>{children}</AppProviders>
      </body>
    </html>
  );
}
