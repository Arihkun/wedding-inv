import type { Metadata, Viewport } from "next";
import { Cormorant_Garamond, DM_Sans } from "next/font/google";
import "./globals.css";

const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  variable: "--font-cormorant",
  weight: ["400", "500", "600", "700"],
  style: ["normal", "italic"],
  display: "swap",
});

const dmSans = DM_Sans({
  subsets: ["latin"],
  variable: "--font-dm-sans",
  weight: ["400", "500", "700"],
  display: "swap",
});

const siteUrl = new URL(
  process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"
);

export const metadata: Metadata = {
  metadataBase: siteUrl,
  title: "Kinar & Oki Wedding Invitation",
  description: "Undangan Pernikahan Resmi Kinar & Oki. Merayakan hari bahagia dan awal perjalanan baru bersama keluarga dan sahabat terkasih.",
  openGraph: {
    title: "Kinar & Oki Wedding Invitation",
    description: "Undangan Pernikahan Resmi Kinar & Oki.",
    url: "/",
    siteName: "Kinar & Oki Wedding",
    locale: "id_ID",
    type: "website",
    images: [
      {
        url: "/images/og.png",
        width: 1200,
        height: 630,
        alt: "Undangan Pernikahan Kinar & Oki",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Kinar & Oki Wedding Invitation",
    description: "Undangan Pernikahan Resmi Kinar & Oki.",
    images: ["/images/og.png"],
  },
  robots: {
    index: true,
    follow: true,
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  themeColor: "#1C2E24",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id" className={`${cormorant.variable} ${dmSans.variable}`}>
      <body className="bg-ivory text-forest antialiased min-h-screen selection:bg-gold selection:text-forest">
        {children}
      </body>
    </html>
  );
}
