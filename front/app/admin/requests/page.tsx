"use client";

import { useEffect, useState } from 'react';
import { Check, X, AlertTriangle } from 'lucide-react';
import { API_URL } from '@/lib/config';

export default function RequestsPage() {
    const [requests, setRequests] = useState<any[]>([]);

    useEffect(() => {
        fetchRequests();
    }, []);

    const fetchRequests = async () => {
        const res = await fetch(`${API_URL}/admin/requests`);
        const data = await res.json();
        if (data.success) setRequests(data.data);
    };

    const handleStatus = async (id: string, status: 'APPROVED' | 'REJECTED') => {
        await fetch(`${API_URL}/admin/requests/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ status })
        });
        fetchRequests();
    };

    return (
        <div>
            <h1 className="text-3xl font-bold mb-6">Gelen Talepler</h1>

            <div className="grid gap-4">
                {requests.length === 0 && <p className="text-gray-500">Bekleyen talep yok.</p>}

                {requests.map((req) => (
                    <div key={req.id} className="bg-white dark:bg-zinc-800 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-zinc-700 flex flex-col md:flex-row justify-between gap-4">
                        <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                                <span className={`px-2 py-1 rounded text-xs font-bold ${req.type === 'MESSAGE' ? 'bg-purple-100 text-purple-700' : 'bg-orange-100 text-orange-700'}`}>
                                    {req.type === 'MESSAGE' ? 'MESAJ' : 'RANDEVU'}
                                </span>
                                <span className="text-sm text-gray-500">
                                    Alıcı: <span className="font-semibold text-gray-700 dark:text-gray-300">{req.academic?.name}</span>
                                </span>
                                {req.isRisk && (
                                    <span className="flex items-center gap-1 text-red-600 text-xs font-bold bg-red-50 px-2 py-1 rounded">
                                        <AlertTriangle size={12} /> RİSKLİ İÇERİK
                                    </span>
                                )}
                            </div>
                            <p className="text-gray-800 dark:text-gray-200 text-lg mb-2">{req.content}</p>
                            <div className="text-xs text-gray-400">
                                Gönderen ID: {req.student?.fingerprintId?.substring(0, 8)}... • {new Date(req.createdAt).toLocaleString('tr-TR')}
                            </div>
                        </div>

                        <div className="flex items-center gap-2">
                            <button
                                onClick={() => handleStatus(req.id, 'APPROVED')}
                                className="p-2 bg-green-100 text-green-700 rounded-lg hover:bg-green-200 transition" title="Onayla"
                            >
                                <Check size={20} />
                            </button>
                            <button
                                onClick={() => handleStatus(req.id, 'REJECTED')}
                                className="p-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition" title="Reddet"
                            >
                                <X size={20} />
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
