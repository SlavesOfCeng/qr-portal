'use client';

import { useState, useEffect } from 'react';
import { API_URL } from '../../lib/config';
import { Check, X } from 'lucide-react';

export default function AdminPage() {
    const [requests, setRequests] = useState<any[]>([]);

    const fetchRequests = async () => {
        const res = await fetch(`${API_URL}/admin/requests`);
        const json = await res.json();
        if (json.success) setRequests(json.data);
    };

    useEffect(() => {
        fetchRequests();
    }, []);

    const handleAction = async (id: string, status: 'APPROVED' | 'REJECTED') => {
        await fetch(`${API_URL}/admin/requests/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ status })
        });
        fetchRequests();
    };

    return (
        <div className="p-8 max-w-4xl mx-auto">
            <h1 className="text-3xl font-bold mb-6">Moderator Dashboard (Academic)</h1>

            <div className="bg-white rounded-lg shadow overflow-hidden">
                <table className="w-full">
                    <thead className="bg-gray-50 border-b">
                        <tr>
                            <th className="text-left p-4 text-sm text-gray-500">Time</th>
                            <th className="text-left p-4 text-sm text-gray-500">Student (FP)</th>
                            <th className="text-left p-4 text-sm text-gray-500">To (Academic)</th>
                            <th className="text-left p-4 text-sm text-gray-500">Type</th>
                            <th className="text-left p-4 text-sm text-gray-500">Content</th>
                            <th className="text-left p-4 text-sm text-gray-500">Action</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y">
                        {requests.map(req => (
                            <tr key={req.id} className={req.isRisk ? 'bg-red-50' : ''}>
                                <td className="p-4 text-sm">{new Date(req.createdAt).toLocaleTimeString()}</td>
                                <td className="p-4 text-sm font-mono text-xs">{req.student?.fingerprintId?.substring(0, 8)}...</td>
                                <td className="p-4 text-sm">{req.academic?.name}</td>
                                <td className="p-4 text-sm"><span className="px-2 py-1 bg-gray-100 rounded text-xs font-bold">{req.type}</span></td>
                                <td className="p-4 text-sm">{req.content}</td>
                                <td className="p-4 flex space-x-2">
                                    <button onClick={() => handleAction(req.id, 'APPROVED')} className="p-2 bg-green-100 text-green-700 rounded hover:bg-green-200"><Check size={16} /></button>
                                    <button onClick={() => handleAction(req.id, 'REJECTED')} className="p-2 bg-red-100 text-red-700 rounded hover:bg-red-200"><X size={16} /></button>
                                </td>
                            </tr>
                        ))}
                        {requests.length === 0 && <tr><td colSpan={6} className="p-4 text-center text-gray-500">No pending requests.</td></tr>}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
