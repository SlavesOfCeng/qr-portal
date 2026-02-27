import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Toaster } from 'react-hot-toast';
import Link from 'next/link';

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Kampüs Portal | MAKU",
  description: "Mehmet Akif Ersoy Üniversitesi QR Portal Sistemi",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="tr">
      <body className={`${inter.className} bg-gray-50 text-gray-900 antialiased`}>
        <Toaster position="top-right" />

        <nav className="bg-blue-900 text-white shadow-lg sticky top-0 z-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
            <Link href="/" className="flex items-center gap-4 group">
              <div className="flex flex-col">
                <span className="font-bold text-xl md:text-2xl leading-tight tracking-wide">
                  MEHMET AKİF ERSOY ÜNİVERSİTESİ
                </span>
                <span className="text-xs md:text-sm text-blue-200 font-medium tracking-wider">
                  ÖĞRENCİ-AKADEMİSYEN QR PORTAL SİSTEMİ
                </span>
              </div>
            </Link>

            <div className="flex items-center gap-6">
              <a href="/" className="hidden md:block text-sm font-medium text-blue-100 hover:text-white transition">Ana Sayfa</a>
              <Link
                href="/admin/login"
                className="bg-amber-500 hover:bg-amber-600 text-white text-sm font-bold px-5 py-2.5 rounded-full transition-all shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
              >
                Giriş Yap
              </Link>
            </div>
          </div>
        </nav>
        {children}
      </body>
    </html>
  );
}
