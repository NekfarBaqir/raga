import type { Metadata } from "next";
import { Inter, Poppins } from "next/font/google";
import NextTopLoader from "nextjs-toploader";

import "./globals.css";

const geistSans = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const geistMono = Poppins({
  variable: "--font-poppins",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "Raga",
  description: "The Pathway for Afghanistan’s Tech Builders",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <NextTopLoader
          color="#B71C1C"
          initialPosition={0.08}
          crawlSpeed={200}
          height={3}
          crawl={true}
          showSpinner={true}
          easing="easeinout"
          speed={200}
          shadow="0 0 10px #B71C1C,0 0 5px #B71C1C"
        />

        {children}
      </body>
    </html>
  );
}
