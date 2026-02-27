"use client";

import { useEffect, useState } from 'react';
import { FileText, Clock, CheckCircle } from 'lucide-react';
import { API_URL } from '@/lib/config';

export default function AcademicDashboard() {
    const [stats, setStats] = useState<any>(null);

    useEffect(() => {
        const token = localStorage.getItem('token');
        fetch(`${API_URL}/academic/stats`, {
            headers: { 'Authorization': `Bearer ${token}` }
        })
            .then(res => res.json())
            .then(data => {
                if (data.success) setStats(data.data);
            });
    }, []);

    if (!stats) return <div className="p-8">Yükleniyor...</div>;

    return (
        <div className="space-y-6">
            <h1 className="text-3xl font-bold">Hoşgeldiniz</h1>
            <p className="text-gray-500">Profilinizi, ders programınızı ve gelen randevu/mesajları buradan yönetebilirsiniz.</p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white dark:bg-zinc-800 p-6 rounded-xl shadow-sm border border-gray-100 flex items-center gap-4">
                    <div className="p-3 bg-blue-100 text-blue-600 rounded-lg"><FileText size={20} /></div>
                    <div>
                        <h4 className="text-gray-500 text-sm">Toplam İstek</h4>
                        <p className="text-2xl font-bold">{stats.totalRequests}</p>
                    </div>
                </div>
                <div className="bg-white dark:bg-zinc-800 p-6 rounded-xl shadow-sm border border-gray-100 flex items-center gap-4">
                    <div className="p-3 bg-yellow-100 text-yellow-600 rounded-lg"><Clock size={20} /></div>
                    <div>
                        <h4 className="text-gray-500 text-sm">Bekleyen Onay</h4>
                        <p className="text-2xl font-bold">{stats.pendingRequests}</p>
                    </div>
                </div>
                <div className="bg-white dark:bg-zinc-800 p-6 rounded-xl shadow-sm border border-gray-100 flex items-center gap-4">
                    <div className="p-3 bg-green-100 text-green-600 rounded-lg"><CheckCircle size={20} /></div>
                    <div>
                        <h4 className="text-gray-500 text-sm">Onaylanmış</h4>
                        <p className="text-2xl font-bold">{stats.approvedRequests}</p>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
                <a href="/academic/profile" className="p-6 bg-white dark:bg-zinc-800 rounded-xl shadow-sm border border-gray-100 hover:border-blue-500 transition group">
                    <h3 className="text-xl font-bold group-hover:text-blue-600">Profilini Düzenle</h3>
                    <p className="text-gray-500 mt-2">Biyografi, unvan ve ofis saatlerini güncelle.</p>
                </a>
                <a href="/academic/requests" className="p-6 bg-white dark:bg-zinc-800 rounded-xl shadow-sm border border-gray-100 hover:border-emerald-500 transition group">
                    <h3 className="text-xl font-bold group-hover:text-emerald-600">Gelen Talepler</h3>
                    <p className="text-gray-500 mt-2">Öğrencilerden gelen mesajları ve randevuları gör.</p>
                </a>
            </div>
        </div>
    );
}
