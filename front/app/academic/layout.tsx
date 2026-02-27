"use client";

export default function AcademicLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="min-h-screen bg-gray-50 dark:bg-zinc-900 flex">
            <aside className="w-64 bg-white dark:bg-zinc-800 border-r border-gray-200 dark:border-zinc-700 hidden md:block">
                <div className="p-6">
                    <h2 className="text-xl font-bold text-gray-800 dark:text-white">Akademik Panel</h2>
                </div>
                <nav className="px-4 space-y-2">
                    <a href="/academic/dashboard" className="block px-4 py-2 rounded-lg text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-zinc-700">Ana Sayfa</a>
                    <a href="/academic/profile" className="block px-4 py-2 rounded-lg text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-zinc-700">Profil Düzenle</a>
                    <a href="/academic/requests" className="block px-4 py-2 rounded-lg text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-zinc-700">Onaylı Talepler</a>
                    <a href="/admin/login" onClick={() => localStorage.removeItem('token')} className="block px-4 py-2 rounded-lg text-red-600 hover:bg-red-50 mt-8">Çıkış Yap</a>
                </nav>
            </aside>

            <main className="flex-1 p-8">
                {children}
            </main>
        </div>
    );
}
