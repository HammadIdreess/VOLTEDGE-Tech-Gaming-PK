import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';
import { CartProvider } from '@/context/CartContext';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import CartDrawer from '@/components/cart/CartDrawer';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'VoltEdge — Premier PC Hardware, Gaming Peripherals & Tech in Pakistan',
  description:
    'Shop genuine graphics cards, processors, DDR5 RAM, gaming monitors, mechanical keyboards, and esports accessories in Pakistan with official warranty and express delivery.',
  keywords: [
    'PC hardware Pakistan',
    'graphics card price in Pakistan',
    'gaming PC components',
    'RTX 4080 Pakistan',
    'AMD Ryzen 7800X3D',
    'gaming keyboards',
    'esports mice',
    'VoltEdge',
  ],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col bg-[#080c14] text-slate-100 selection:bg-blue-600 selection:text-white">
        <CartProvider>
          <Navbar />
          <CartDrawer />
          <main className="flex-1">{children}</main>
          <Footer />
        </CartProvider>
      </body>
    </html>
  );
}
