import type { Metadata } from "next";
import { Playfair_Display, Lato } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

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

export const metadata: Metadata = {
  title: "FAJE - Premium Modern Fashion",
  description: "FAJÉ delivers fashion that feels modern, confident, premium, and attainable. Luxury should feel personal and possible.",
  keywords: ["fashion", "premium clothing", "modern attire", "co-ord sets", "accessible luxury", "FAJE"],
  authors: [{ name: "FAJE Team" }],
  icons: {
    icon: "/logo.png",
    shortcut: "/logo.png",
    apple: "/logo.png",
  },
  openGraph: {
    title: "FAJE - Premium Modern Fashion",
    description: "FAJÉ delivers fashion that feels modern, confident, premium, and attainable. You can own this now.",
    siteName: "FAJE",
    images: [
      {
        url: "/logo.png",
        width: 1200,
        height: 630,
        alt: "FAJE Logo",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "FAJE - Premium Modern Fashion",
    description: "Premium yet accessible luxury fashion for modern individuals.",
    images: ["/logo.png"],
  },
};

import { CartProvider } from "./context/CartContext";

// ...

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${playfair.variable} ${lato.variable}`}>
        <CartProvider>
          <Navbar />
          <main>{children}</main>
          <Footer />
        </CartProvider>
      </body>
    </html>
  );
}
