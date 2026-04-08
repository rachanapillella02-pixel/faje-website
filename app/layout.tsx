import type { Metadata } from "next";
import { Playfair_Display, Lato } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { CartProvider } from "./context/CartContext";

const playfair = Playfair_Display({
  variable: "--font-serif",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

const lato = Lato({
  variable: "--font-sans",
  subsets: ["latin"],
  weight: ["300", "400", "700"],
  display: "swap",
});

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://thefaje.com';

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: "FAJE - Premium Modern Fashion",
  description: "FAJÉ delivers fashion that feels modern, confident, premium, and attainable. Luxury should feel personal and possible.",
  keywords: ["fashion", "premium clothing", "modern attire", "co-ord sets", "accessible luxury", "FAJE"],
  authors: [{ name: "FAJE Team" }],
  openGraph: {
    title: "FAJE - Premium Modern Fashion",
    description: "FAJÉ delivers fashion that feels modern, confident, premium, and attainable. You can own this now.",
    siteName: "FAJE",
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "FAJE - Premium Modern Fashion",
    description: "Premium yet accessible luxury fashion for modern individuals.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${playfair.variable} ${lato.variable}`}>
        <CartProvider>
          <div className="top-promo-banner">
            <span className="promo-msg">Use code <strong style={{color: '#D4AF37'}}>FAJE10</strong> for 10% off your first purchase!</span>
            <span className="top-promo-separator">|</span>
            <span className="promo-msg">Free shipping on orders above ₹2,999</span>
          </div>
          <Navbar />
          <main>{children}</main>
          <Footer />
        </CartProvider>
      </body>
    </html>
  );
}
