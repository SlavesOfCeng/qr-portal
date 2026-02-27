'use client';

import { useState, useEffect } from 'react';
import FingerprintJS from '@fingerprintjs/fingerprintjs';
import { createRequest } from '../lib/api';
import { User, MessageSquare, Calendar } from 'lucide-react';

interface Schedule {
    day: number;
    startTime: string;
    endTime: string;
    isOfficeHour: boolean;
    location?: string;
    courseCode?: string;
}

interface Academic {
    id: string;
    name: string;
    bio?: string;
    schedules: Schedule[];
}

export default function ProfileView({ academic }: { academic: Academic }) {
    const [visitorId, setVisitorId] = useState<string>('');
    const [activeTab, setActiveTab] = useState<'MESSAGE' | 'APPOINTMENT'>('MESSAGE');
    const [content, setContent] = useState('');
    const [status, setStatus] = useState<string>('');

    useEffect(() => {
        const setFp = async () => {
            const fp = await FingerprintJS.load();
            const result = await fp.get();
            setVisitorId(result.visitorId);
        };
        setFp();
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!content) return;
        setStatus('Sending...');

        try {
            await createRequest({
                academicId: academic.id,
                type: activeTab,
                content,
                fingerprintId: visitorId,
                userAgent: navigator.userAgent
            });
            setStatus('Sent successfully!');
            setContent('');
        } catch (err) {
            setStatus('Failed to send.');
        }
    };

    return (
        <div className="max-w-md mx-auto p-4 bg-white shadow-lg rounded-xl min-h-screen">
            <div className="text-center mb-6">
                <div className="w-24 h-24 bg-gray-200 rounded-full mx-auto flex items-center justify-center mb-4">
                    <User size={48} className="text-gray-500" />
                </div>
                <h1 className="text-2xl font-bold text-gray-800">{academic.name}</h1>
                <p className="text-gray-600">{academic.bio}</p>
            </div>

            <div className="mb-6">
                <h2 className="text-lg font-semibold mb-2">Schedule</h2>
                <div className="space-y-2">
                    {academic.schedules.map((s, i) => (
                        <div key={i} className={`p-2 rounded text-sm ${s.isOfficeHour ? 'bg-green-100 text-green-800' : 'bg-blue-50 text-blue-800'}`}>
                            <span className="font-bold">{['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'][s.day]}</span>: {s.startTime}-{s.endTime}
                            {s.location && ` @ ${s.location}`}
                            {s.isOfficeHour && ' (Office Hour)'}
                        </div>
                    ))}
                    {academic.schedules.length === 0 && <p className="text-gray-500 text-sm">No schedule available.</p>}
                </div>
            </div>

            <div className="mb-4 flex space-x-2">
                <button
                    onClick={() => setActiveTab('MESSAGE')}
                    className={`flex-1 py-2 flex items-center justify-center space-x-2 rounded-lg ${activeTab === 'MESSAGE' ? 'bg-blue-600 text-white' : 'bg-gray-100'}`}
                >
                    <MessageSquare size={18} />
                    <span>Mesaj</span>
                </button>
                <button
                    onClick={() => setActiveTab('APPOINTMENT')}
                    className={`flex-1 py-2 flex items-center justify-center space-x-2 rounded-lg ${activeTab === 'APPOINTMENT' ? 'bg-blue-600 text-white' : 'bg-gray-100'}`}
                >
                    <Calendar size={18} />
                    <span>Randevu</span>
                </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
                <textarea
                    className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                    rows={4}
                    placeholder={activeTab === 'MESSAGE' ? "Leave a note..." : "Request appointment time..."}
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                />
                <button type="submit" className="w-full bg-black text-white py-3 rounded-lg font-medium hover:bg-gray-800 transition">
                    Gönder
                </button>
                {status && <p className="text-center text-sm font-medium">{status}</p>}
            </form>
        </div>
    );
}
