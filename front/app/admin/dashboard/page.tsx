"use client";

import { useEffect, useState } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import { Users, FileText, AlertTriangle, Activity } from 'lucide-react';
import { API_URL } from '@/lib/config';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

export default function AdminDashboard() {
    const [stats, setStats] = useState<any>(null);

    useEffect(() => {
        fetch(`${API_URL}/admin/stats`)
            .then(res => res.json())
            .then(data => {
                if (data.success) setStats(data.data);
            });
    }, []);

    if (!stats) return <div className="p-8">Yükleniyor...</div>;


    const chartData = stats.riskStats.map((item: any, index: number) => ({
        name: item.riskLevel,
        value: item._count.riskLevel
    }));

    if (chartData.length === 0) {
        chartData.push({ name: 'Temiz', value: 1 });
    }

    return (
        <div>
            <h1 className="text-3xl font-bold mb-6">Yönetim Paneli</h1>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="bg-white dark:bg-zinc-800 p-6 rounded-xl shadow-sm border border-gray-100 flex items-center gap-4">
                    <div className="p-4 bg-blue-100 text-blue-600 rounded-full"><Users size={24} /></div>
                    <div>
                        <p className="text-sm text-gray-500">Toplam Akademisyen</p>
                        <h3 className="text-2xl font-bold">{stats.totalAcademics}</h3>
                    </div>
                </div>
                <div className="bg-white dark:bg-zinc-800 p-6 rounded-xl shadow-sm border border-gray-100 flex items-center gap-4">
                    <div className="p-4 bg-green-100 text-green-600 rounded-full"><FileText size={24} /></div>
                    <div>
                        <p className="text-sm text-gray-500">Toplam Talep</p>
                        <h3 className="text-2xl font-bold">{stats.totalRequests}</h3>
                        <p className="text-xs text-gray-400">{stats.pendingRequests} Beklemede</p>
                    </div>
                </div>
                <div className="bg-white dark:bg-zinc-800 p-6 rounded-xl shadow-sm border border-gray-100 flex items-center gap-4">
                    <div className="p-4 bg-red-100 text-red-600 rounded-full"><AlertTriangle size={24} /></div>
                    <div>
                        <p className="text-sm text-gray-500">Riskli İşlemler</p>
                        <h3 className="text-2xl font-bold">{chartData.length}</h3>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="bg-white dark:bg-zinc-800 p-6 rounded-xl shadow-sm border border-gray-100">
                    <h3 className="font-bold mb-4 flex items-center gap-2"><Activity size={20} /> Risk Analizi Dağılımı</h3>
                    <div className="h-64">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={chartData}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={60}
                                    outerRadius={80}
                                    fill="#8884d8"
                                    paddingAngle={5}
                                    dataKey="value"
                                >
                                    {chartData.map((entry: any, index: number) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                    ))}
                                </Pie>
                                <Tooltip />
                                <Legend />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                <div className="bg-white dark:bg-zinc-800 p-6 rounded-xl shadow-sm border border-gray-100">
                    <h3 className="font-bold mb-4">Son Gelen Talepler</h3>
                    <div className="space-y-4">
                        {stats.recentRequests.map((req: any) => (
                            <div key={req.id} className="flex justify-between items-center border-b border-gray-50 dark:border-zinc-700 pb-2">
                                <div>
                                    <p className="font-medium text-sm">{req.student.ipAddress || 'Bilinmiyor'}</p>
                                    <p className="text-xs text-gray-500">Alıcı: {req.academic.name}</p>
                                </div>
                                <div className="text-right">
                                    <span className={`text-xs px-2 py-1 rounded ${req.status === 'PENDING' ? 'bg-yellow-100 text-yellow-700' : 'bg-green-100 text-green-700'}`}>
                                        {req.status}
                                    </span>
                                    <p className="text-[10px] text-gray-400 mt-1">{new Date(req.createdAt).toLocaleDateString()}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
