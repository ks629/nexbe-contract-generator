import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "sonner";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Generator Umów | NEXBE",
  description: "Generator umów na rozbudowę instalacji fotowoltaicznej o magazyn energii z falownikiem hybrydowym",
  icons: { icon: "/favicon.png" },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pl">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <div className="energy-orb energy-orb-1" />
        <div className="energy-orb energy-orb-2" />
        <div className="relative z-10 min-h-screen">
          {children}
        </div>
        <Toaster richColors position="top-right" />
      </body>
    </html>
  );
}
