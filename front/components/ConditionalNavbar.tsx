"use client";

import { usePathname } from 'next/navigation';
import Link from 'next/link';

export default function ConditionalNavbar() {
    const pathname = usePathname();

    if (pathname.startsWith('/admin')) {
        return null;
    }

    return (
        <nav className="bg-white border-b border-gray-200 sticky top-0 z-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
                <Link href="/" className="flex items-center gap-4 group">
                    <div className="flex items-center gap-3">
                        <div className="flex flex-col">
                            <span className="font-bold text-lg md:text-xl text-blue-950 leading-tight">
                                MEHMET AKİF ERSOY
                            </span>
                            <span className="text-xs md:text-sm text-gray-500 font-medium tracking-[0.1em]">
                                ÜNİVERSİTESİ
                            </span>
                        </div>
                    </div>
                </Link>

                <div className="flex items-center gap-4">
                    <Link
                        href="/admin/login"
                        className="text-sm font-semibold text-gray-600 hover:text-blue-900 transition-colors px-4 py-2"
                    >
                        Akademisyen / Yönetici
                    </Link>
                </div>
            </div>
        </nav>
    );
}
