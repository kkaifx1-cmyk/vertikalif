import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { AnimatedBackground } from "@/components/animated-background";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Survei 7 Karakter Utama (7 KAIH) — SMAIT Ihsanul Fikri Magelang",
  description:
    "Platform instrumen survei refleksi mandiri evaluasi 7 Karakter Utama Ihsanul Fikri (7 KAIH) santri SMAIT Ihsanul Fikri Kabupaten Magelang secara objektif dan terukur.",
  icons: {
    icon: "/logo-ihsanul-fikri.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="id"
      className={`${inter.variable} h-full antialiased`}
    >
      <body className={`${inter.className} relative min-h-full flex flex-col bg-transparent text-slate-900 selection:bg-emerald-600 selection:text-white`}>
        <AnimatedBackground />
        <Navbar />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
