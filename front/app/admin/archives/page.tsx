"use client";

import { useEffect, useState } from 'react';
import { Trash2, AlertOctagon, ChevronLeft, ChevronRight } from 'lucide-react';
import { API_URL } from '@/lib/config';

export default function ArchivesPage() {
    const [requests, setRequests] = useState<any[]>([]);
    const [pagination, setPagination] = useState({ page: 1, totalPages: 1 });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchArchives(1);
    }, []);

    const fetchArchives = async (page: number) => {
        setLoading(true);
        const token = localStorage.getItem('token');
        try {
            const res = await fetch(`${API_URL}/admin/requests/archive?page=${page}&limit=20`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            const data = await res.json();
            if (data.success) {
                setRequests(data.data);
                setPagination(data.pagination);
            }
        } catch (e) { console.error(e); }
        setLoading(false);
    };

    const handleHardDelete = async (id: string) => {
        if (!confirm('DİKKAT! Bu işlem geri alınamaz. Kayıt tamamen silinecek. Emin misiniz?')) return;

        const token = localStorage.getItem('token');
        await fetch(`${API_URL}/admin/requests/${id}`, {
            method: 'DELETE',
            headers: { 'Authorization': `Bearer ${token}` }
        });
        fetchArchives(pagination.page);
    };

    return (
        <div>
            <h1 className="text-3xl font-bold mb-6">Tüm Talepler Arşivi</h1>

            <div className="bg-white dark:bg-zinc-800 rounded-xl shadow-sm border border-gray-100 dark:border-zinc-700 overflow-hidden">
                <table className="w-full text-sm text-left">
                    <thead className="bg-gray-50 dark:bg-zinc-900 text-gray-500 font-medium border-b dark:border-zinc-700">
                        <tr>
                            <th className="p-4">Tarih</th>
                            <th className="p-4">Öğrenci / IP</th>
                            <th className="p-4">Alıcı Hoca</th>
                            <th className="p-4">İçerik</th>
                            <th className="p-4">Durum</th>
                            <th className="p-4 text-right">İşlem</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y dark:divide-zinc-700">
                        {requests.map(req => (
                            <tr key={req.id} className="hover:bg-gray-50 dark:hover:bg-zinc-750">
                                <td className="p-4 whitespace-nowrap text-gray-500">
                                    {new Date(req.createdAt).toLocaleString('tr-TR')}
                                </td>
                                <td className="p-4">
                                    <div className="font-medium text-gray-900 dark:text-gray-200">
                                        {req.student.fingerprintId.substring(0, 8)}...
                                    </div>
                                    <div className="text-xs text-gray-400">{req.student.ipAddress}</div>
                                </td>
                                <td className="p-4 text-gray-600">{req.academic.name}</td>
                                <td className="p-4 max-w-xs truncate" title={req.content}>
                                    {req.content}
                                    {req.isRisk && <span className="ml-2 text-xs bg-red-100 text-red-600 px-1 rounded font-bold">RİSKLİ</span>}
                                </td>
                                <td className="p-4">
                                    <span className={`px-2 py-1 rounded text-xs font-bold ${req.status === 'APPROVED' ? 'bg-green-100 text-green-700' :
                                        req.status === 'REJECTED' ? 'bg-red-100 text-red-700' :
                                            'bg-yellow-100 text-yellow-700'
                                        }`}>
                                        {req.status}
                                    </span>
                                </td>
                                <td className="p-4 text-right">
                                    <button
                                        onClick={() => handleHardDelete(req.id)}
                                        className="p-2 text-red-500 hover:bg-red-50 rounded transition"
                                        title="Kalıcı Olarak Sil"
                                    >
                                        <Trash2 size={16} />
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>

                <div className="p-4 border-t dark:border-zinc-700 flex justify-between items-center">
                    <button
                        disabled={pagination.page <= 1}
                        onClick={() => fetchArchives(pagination.page - 1)}
                        className="flex items-center gap-1 text-gray-600 disabled:opacity-50"
                    >
                        <ChevronLeft size={16} /> Önceki
                    </button>
                    <span className="text-sm text-gray-500">
                        Sayfa {pagination.page} / {pagination.totalPages}
                    </span>
                    <button
                        disabled={pagination.page >= pagination.totalPages}
                        onClick={() => fetchArchives(pagination.page + 1)}
                        className="flex items-center gap-1 text-gray-600 disabled:opacity-50"
                    >
                        Sonraki <ChevronRight size={16} />
                    </button>
                </div>
            </div>
        </div>
    );
}
