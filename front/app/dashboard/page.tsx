'use client';

import { useState, useEffect } from 'react';
import { API_URL } from '../../lib/config';
import { User, Calendar, MessageSquare } from 'lucide-react';

export default function Dashboard() {
    const [slug, setSlug] = useState('ahmet-yilmaz');
    const [academic, setAcademic] = useState<any>(null);
    const [requests, setRequests] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);

    const fetchData = async () => {
        setLoading(true);
        try {
            const res = await fetch(`${API_URL}/academic/${slug}`);
            const json = await res.json();
            if (json.success) {
                setAcademic(json.data);
                if (json.data.id) {
                    const reqRes = await fetch(`${API_URL}/academic/requests/approved?id=${json.data.id}`);
                    const reqJson = await reqRes.json();
                    if (reqJson.success) setRequests(reqJson.data);
                }
            } else {
                alert('Academic not found');
                setAcademic(null);
            }
        } catch (e) {
            console.error(e);
        }
        setLoading(false);
    };

    useEffect(() => {
        if (slug) fetchData();
    }, []);

    if (!academic && !loading) {
        return <div className="p-10 text-center"><p>Loading or not found...</p></div>;
    }

    return (
        <div className="min-h-screen bg-gray-50 p-8">
            <div className="max-w-5xl mx-auto">
                <header className="flex justify-between items-center mb-8">
                    <h1 className="text-3xl font-bold text-gray-900">Academic Dashboard</h1>
                    <div className="flex items-center space-x-2">
                        <span className="text-sm text-gray-500">Logged in as:</span>
                        <span className="font-mono bg-white px-2 py-1 rounded border">{slug}</span>
                    </div>
                </header>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="md:col-span-1 bg-white p-6 rounded-xl shadow-sm">
                        <div className="flex flex-col items-center">
                            <div className="w-24 h-24 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 mb-4">
                                <User size={40} />
                            </div>
                            <h2 className="text-xl font-bold">{academic?.name}</h2>
                            <p className="text-gray-500 text-sm text-center mt-2">{academic?.bio}</p>
                            <div className="mt-4 w-full">
                                <h3 className="text-sm font-semibold text-gray-400 uppercase mb-2">Schedule</h3>
                                <div className="space-y-1">
                                    {academic?.schedules?.map((s: any, i: number) => (
                                        <div key={i} className="text-xs p-2 bg-gray-50 rounded">
                                            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'][s.day]} {s.startTime}-{s.endTime}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="md:col-span-2 space-y-6">
                        <div className="bg-white p-6 rounded-xl shadow-sm">
                            <h2 className="text-xl font-bold mb-4 flex items-center">
                                <MessageSquare className="mr-2" /> Approved Requests
                            </h2>
                            <div className="space-y-4">
                                {requests.length === 0 && <p className="text-gray-400">No new messages.</p>}
                                {requests.map(req => (
                                    <div key={req.id} className="border p-4 rounded-lg hover:shadow-md transition">
                                        <div className="flex justify-between items-start mb-2">
                                            <span className={`px-2 py-1 rounded text-xs font-bold ${req.type === 'MESSAGE' ? 'bg-blue-100 text-blue-700' : 'bg-purple-100 text-purple-700'}`}>
                                                {req.type}
                                            </span>
                                            <span className="text-xs text-gray-400">{new Date(req.createdAt).toLocaleString()}</span>
                                        </div>
                                        <p className="text-gray-800">{req.content}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
