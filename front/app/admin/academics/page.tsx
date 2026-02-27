"use client";

import { useEffect, useState } from 'react';
import { Trash2, QrCode, Plus, X } from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';
import { API_URL } from '@/lib/config';

export default function AcademicsPage() {
    const [academics, setAcademics] = useState<any[]>([]);
    const [showModal, setShowModal] = useState(false);
    const [showQRModal, setShowQRModal] = useState<string | null>(null);
    const [formData, setFormData] = useState({ name: '', email: '', password: '', title: '', bio: '' });

    useEffect(() => {
        fetchAcademics();
    }, []);

    const fetchAcademics = async () => {
        const res = await fetch(`${API_URL}/academic`);
        const data = await res.json();
        if (data.success) setAcademics(data.data);
    };

    const handleDelete = async (id: string) => {
        if (!confirm('Bu akademisyeni silmek istediğinize emin misiniz?')) return;

        await fetch(`${API_URL}/admin/academic/${id}`, { method: 'DELETE' });
        fetchAcademics();
    };

    const handleCreate = async (e: React.FormEvent) => {
        e.preventDefault();
        await fetch(`${API_URL}/admin/academic`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(formData)
        });
        setShowModal(false);
        setFormData({ name: '', email: '', password: '', title: '', bio: '' });
        fetchAcademics();
    };

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold">Akademisyen Yönetimi</h1>
                <button
                    onClick={() => setShowModal(true)}
                    className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                >
                    <Plus size={20} /> Yeni Ekle
                </button>
            </div>

            <div className="bg-white dark:bg-zinc-800 rounded-xl shadow overflow-hidden">
                <table className="w-full text-left">
                    <thead className="bg-gray-50 dark:bg-zinc-700">
                        <tr>
                            <th className="p-4">Ad Soyad</th>
                            <th className="p-4">Unvan</th>
                            <th className="p-4">Email</th>
                            <th className="p-4">İşlemler</th>
                        </tr>
                    </thead>
                    <tbody>
                        {academics.map((acc) => (
                            <tr key={acc.id} className="border-t border-gray-100 dark:border-zinc-700 hover:bg-gray-50 dark:hover:bg-zinc-700/50">
                                <td className="p-4 font-medium">{acc.name}</td>
                                <td className="p-4 text-gray-500">{acc.title || '-'}</td>
                                <td className="p-4 text-gray-500">{acc.email}</td>
                                <td className="p-4 flex gap-2">
                                    <button
                                        onClick={() => setShowQRModal(acc.slug)}
                                        className="p-2 text-blue-600 hover:bg-blue-50 rounded" title="QR Kod"
                                    >
                                        <QrCode size={20} />
                                    </button>
                                    <button
                                        onClick={() => handleDelete(acc.id)}
                                        className="p-2 text-red-600 hover:bg-red-50 rounded" title="Sil"
                                    >
                                        <Trash2 size={20} />
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {showModal && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
                    <div className="bg-white dark:bg-zinc-800 rounded-xl p-6 w-full max-w-lg relative">
                        <button onClick={() => setShowModal(false)} className="absolute right-4 top-4 text-gray-500 hover:text-gray-700"><X /></button>
                        <h2 className="text-xl font-bold mb-4">Yeni Akademisyen Ekle</h2>
                        <form onSubmit={handleCreate} className="space-y-4">
                            <input placeholder="Ad Soyad" className="w-full p-2 border rounded dark:bg-zinc-700 dark:border-zinc-600" value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} required />
                            <input placeholder="Unvan (Örn: Prof. Dr.)" className="w-full p-2 border rounded dark:bg-zinc-700 dark:border-zinc-600" value={formData.title} onChange={e => setFormData({ ...formData, title: e.target.value })} />
                            <input placeholder="Email" type="email" className="w-full p-2 border rounded dark:bg-zinc-700 dark:border-zinc-600" value={formData.email} onChange={e => setFormData({ ...formData, email: e.target.value })} required />
                            <input placeholder="Şifre" type="password" className="w-full p-2 border rounded dark:bg-zinc-700 dark:border-zinc-600" value={formData.password} onChange={e => setFormData({ ...formData, password: e.target.value })} required />
                            <textarea placeholder="Biyografi" className="w-full p-2 border rounded dark:bg-zinc-700 dark:border-zinc-600" value={formData.bio} onChange={e => setFormData({ ...formData, bio: e.target.value })} />
                            <button type="submit" className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700">Kaydet</button>
                        </form>
                    </div>
                </div>
            )}

            {showQRModal && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
                    <div className="bg-white p-8 rounded-xl flex flex-col items-center gap-4 relative">
                        <button onClick={() => setShowQRModal(null)} className="absolute right-2 top-2 text-gray-500"><X /></button>
                        <h3 className="font-bold text-lg text-black">Profil QR Kodu</h3>
                        <QRCodeSVG value={`http://localhost:3000/profile/${showQRModal}`} size={256} />
                        <p className="text-sm text-gray-500">{`http://localhost:3000/profile/${showQRModal}`}</p>
                        <button onClick={() => window.print()} className="text-blue-600 hover:underline">Yazdır</button>
                    </div>
                </div>
            )}
        </div>
    );
}
