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
  metadataBase: new URL("https://raga.space"),
  title: "Raga – Building Afghanistan’s Tech Future",
  description:
    "Raga is a hub for ambitious minds in Afghanistan to create technology, collaborate, and innovate.",
  keywords: [
    "Afghanistan tech",
    "startup hub",
    "Raga",
    "innovation",
    "entrepreneurs",
    "software",
    "design",
    "startups",
  ],
  authors: [{ name: "Raga Team" }],
  openGraph: {
    title: "Raga – Building Afghanistan’s Tech Future",
    description:
      "Raga is a hub for ambitious minds in Afghanistan to create technology, collaborate, and innovate.",
    type: "website",
    url: "https://raga.space",
    images: [
      {
        url: "/images/og-image.jpg",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Raga – Building Afghanistan’s Tech Future",
    description:
      "Raga is a hub for ambitious minds in Afghanistan to create technology, collaborate, and innovate.",
    images: ["/images/og-image.jpg"],
    site: "@raga_space",
  },
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
