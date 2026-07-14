import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { EnquiryProvider } from '@/context/EnquiryContext';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: {
    template: '%s | PS Laboratories',
    default: 'PS Laboratories — Pharmaceutical Reference Standards & Custom Synthesis',
  },
  description:
    'PS Laboratories is an ISO 9001:2015 manufacturer of pharmaceutical reference standards, impurities, and custom-synthesized compounds in Gujarat, India.',
  metadataBase: new URL('https://pslaboratories.in'),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: 'PS Laboratories',
    description:
      'Manufacturer of pharmaceutical reference standards, impurities, and custom-synthesized compounds.',
    siteName: 'PS Laboratories',
    locale: 'en_IN',
    type: 'website',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-white text-gray-900">
        <EnquiryProvider>
          <Header />
          <main className="flex-1">{children}</main>
          <Footer />
        </EnquiryProvider>
      </body>
    </html>
  );
}
