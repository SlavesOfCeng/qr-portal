"use client";

import { useEffect } from 'react';
import { io } from 'socket.io-client';
import toast from 'react-hot-toast';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { LayoutDashboard, Users, MessageSquare, Settings, LogOut } from 'lucide-react';

export default function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const pathname = usePathname();
    const isLoginPage = pathname === '/admin/login';

    useEffect(() => {
        if (isLoginPage) return;

        const socket = io('http://localhost:5005');
        socket.on('new_request', (data: any) => {
            toast(`Yeni Talep: ${data.content.substring(0, 30)}...`, {
                icon: '🔔',
                duration: 5000
            });
        });
        return () => { socket.disconnect(); };
    }, [isLoginPage]);

    if (isLoginPage) {
        return <div className="min-h-screen bg-gray-50 flex items-center justify-center">{children}</div>;
    }

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-zinc-900 flex">
            <aside className="w-64 bg-white dark:bg-zinc-800 border-r border-gray-200 dark:border-zinc-700 hidden md:flex flex-col">
                <div className="p-6 border-b border-gray-100 dark:border-zinc-700">
                    <h2 className="text-lg font-bold text-blue-900 dark:text-white">Yönetim Paneli</h2>
                    <p className="text-xs text-gray-400 mt-1">MAKU Portal v1.0</p>
                </div>

                <nav className="flex-1 p-4 space-y-1">
                    <NavLink href="/admin/dashboard" icon={<LayoutDashboard size={18} />} label="Genel Bakış" active={pathname === '/admin/dashboard'} />
                    <NavLink href="/admin/users" icon={<Users size={18} />} label="Kullanıcı Yönetimi" active={pathname === '/admin/users'} />
                    <NavLink href="/admin/academics" icon={<Users size={18} />} label="Akademisyenler (Hızlı)" active={pathname === '/admin/academics'} />
                    <NavLink href="/admin/requests" icon={<MessageSquare size={18} />} label="Talepler" active={pathname === '/admin/requests'} />
                    <NavLink href="/admin/archives" icon={<MessageSquare size={18} />} label="Arşiv" active={pathname === '/admin/archives'} />
                    <NavLink href="/admin/settings" icon={<Settings size={18} />} label="Ayarlar" active={pathname === '/admin/settings'} />
                </nav>

                <div className="p-4 border-t border-gray-100 dark:border-zinc-700">
                    <Link href="/admin/login" onClick={() => localStorage.removeItem('token')} className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-red-600 hover:bg-red-50 rounded-lg transition">
                        <LogOut size={18} /> Çıkış Yap
                    </Link>
                </div>
            </aside>

            <main className="flex-1 p-8 overflow-y-auto">
                {children}
            </main>
        </div>
    );
}

function NavLink({ href, icon, label, active }: any) {
    return (
        <Link
            href={href}
            className={`flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium transition-colors ${active
                ? 'bg-blue-50 text-blue-700 dark:bg-blue-900/20 dark:text-blue-400'
                : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-zinc-800'
                }`}
        >
            {icon}
            {label}
        </Link>
    );
}
