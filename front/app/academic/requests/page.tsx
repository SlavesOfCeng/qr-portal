"use client";

import { useEffect, useState } from 'react';
import { Trash2, AlertOctagon } from 'lucide-react';
import { API_URL } from '@/lib/config';

export default function AcademicRequestsPage() {
    const [requests, setRequests] = useState<any[]>([]);

    useEffect(() => {
        fetchRequests();
    }, []);

    const fetchRequests = async () => {
        const token = localStorage.getItem('token');
        const res = await fetch(`${API_URL}/academic/requests/approved`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        const data = await res.json();
        if (data.success) setRequests(data.data);
    };

    const handleDelete = async (id: string) => {
        if (!confirm('Bu talebi silmek istediğinize emin misiniz?')) return;

        const token = localStorage.getItem('token');
        await fetch(`${API_URL}/academic/requests/${id}`, {
            method: 'DELETE',
            headers: { 'Authorization': `Bearer ${token}` }
        });
        fetchRequests();
    };

    return (
        <div>
            <h1 className="text-3xl font-bold mb-6">Onaylı Mesajlar & Randevular</h1>

            <div className="grid gap-4">
                {requests.length === 0 && <p className="text-gray-500">Henüz onaylanmış talep yok.</p>}
                {requests.map((req) => (
                    <div key={req.id} className="bg-white dark:bg-zinc-800 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-zinc-700">
                        <div className="flex items-center gap-2 mb-2">
                            <span className={`px-2 py-1 rounded text-xs font-bold ${req.type === 'MESSAGE' ? 'bg-purple-100 text-purple-700' : 'bg-orange-100 text-orange-700'}`}>
                                {req.type === 'MESSAGE' ? 'MESAJ' : 'RANDEVU'}
                            </span>
                            <span className="text-sm text-gray-500">
                                {new Date(req.createdAt).toLocaleString('tr-TR')}
                            </span>
                        </div>
                        <p className="text-lg text-gray-800 dark:text-gray-200">{req.content}</p>

                        <div className="mt-4 pt-4 border-t border-gray-100 dark:border-zinc-700 flex justify-between items-end">
                            <div>
                                <h4 className="font-bold text-sm mb-1 flex items-center gap-2">
                                    Öğrenci Bilgileri
                                    {req.student.blocked && <span className="text-red-600 text-xs flex items-center gap-1"><AlertOctagon size={12} /> BLOKLU</span>}
                                </h4>
                                <p className="text-xs text-gray-500 font-mono">ID: {req.student.fingerprintId}</p>
                                <p className="text-xs text-gray-500">IP: {req.student.ipAddress}</p>
                            </div>
                            <button
                                onClick={() => handleDelete(req.id)}
                                className="flex items-center gap-1 text-red-500 hover:text-red-700 text-sm font-medium px-3 py-1.5 rounded hover:bg-red-50 transition"
                            >
                                <Trash2 size={16} /> Sil
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
