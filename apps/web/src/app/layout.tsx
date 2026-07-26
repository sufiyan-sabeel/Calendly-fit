import type { Metadata } from 'next';
import { Barlow, Barlow_Condensed } from 'next/font/google';
import './globals.css';
import { Providers } from './providers';

const barlow = Barlow({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
  variable: '--font-barlow',
});

const barlowCondensed = Barlow_Condensed({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-barlow-condensed',
});

export const metadata: Metadata = {
  title: 'Calendy Fit | Premium Fitness Scheduling',
  description: 'Premium appointment scheduling and client management for fitness professionals.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="dark">
      <body className={`${barlow.variable} ${barlowCondensed.variable} font-sans antialiased`}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
