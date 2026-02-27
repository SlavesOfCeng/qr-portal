"use client";

import { useEffect, useState } from "react";
import { Save, Plus, Trash2 } from "lucide-react";
import { API_URL } from "@/lib/config";

const DAYS = ["Pazar", "Pazartesi", "Salı", "Çarşamba", "Perşembe", "Cuma", "Cumartesi"];

export default function AcademicProfileEdit() {
    const [profile, setProfile] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [msg, setMsg] = useState("");

    useEffect(() => {
        fetchProfile();
    }, []);

    const fetchProfile = async () => {
        const token = localStorage.getItem('token');
        try {
            const res = await fetch(`${API_URL}/academic`);
            const data = await res.json();
            if (data.success) {
                if (token) {
                    const payload = JSON.parse(atob(token.split('.')[1]));
                    const me = data.data.find((u: any) => u.id === payload.id);
                    setProfile(me || {});
                }
            }
        } catch (e) { console.error(e); }
        setLoading(false);
    };

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        const token = localStorage.getItem('token');

        const res = await fetch(`${API_URL}/academic`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            },
            body: JSON.stringify(profile)
        });

        const data = await res.json();
        if (data.success) setMsg("Profil güncellendi!");
        else setMsg("Hata: " + data.message);
    };

    if (loading) return <div>Yükleniyor...</div>;
    if (!profile) return <div>Profil bulunamadı.</div>;

    return (
        <div className="max-w-2xl mx-auto bg-white dark:bg-zinc-800 p-8 rounded-xl shadow-sm">
            <h1 className="text-2xl font-bold mb-6">Profil Düzenle</h1>
            {msg && <div className="bg-blue-100 text-blue-700 p-3 rounded mb-4">{msg}</div>}

            <form onSubmit={handleSave} className="space-y-6">
                <div>
                    <label className="block text-sm font-medium mb-1">Ad Soyad</label>
                    <input
                        className="w-full p-2 border rounded dark:bg-zinc-700 dark:border-zinc-600"
                        value={profile.name || ''}
                        onChange={e => setProfile({ ...profile, name: e.target.value })}
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium mb-1">Unvan</label>
                    <input
                        className="w-full p-2 border rounded dark:bg-zinc-700 dark:border-zinc-600"
                        value={profile.title || ''}
                        onChange={e => setProfile({ ...profile, title: e.target.value })}
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium mb-1">Profil Fotoğrafı URL</label>
                    <input
                        className="w-full p-2 border rounded dark:bg-zinc-700 dark:border-zinc-600 text-sm"
                        placeholder="https://example.com/photo.jpg"
                        value={profile.avatarUrl || ''}
                        onChange={e => setProfile({ ...profile, avatarUrl: e.target.value })}
                    />
                    {profile.avatarUrl && <img src={profile.avatarUrl} alt="Preview" className="w-16 h-16 rounded-full mt-2 object-cover border" />}
                </div>
                <div>
                    <label className="block text-sm font-medium mb-1">Biyografi</label>
                    <textarea
                        className="w-full p-2 border rounded dark:bg-zinc-700 dark:border-zinc-600 h-32"
                        value={profile.bio || ''}
                        onChange={e => setProfile({ ...profile, bio: e.target.value })}
                    />
                </div>

                <div>
                    <div className="flex justify-between items-center mb-2">
                        <label className="block text-sm font-medium">Ders/Ofis Programı</label>
                        <button type="button" onClick={() => {
                            const newSchedule = [...(profile.schedules || []), { day: 1, startTime: "09:00", endTime: "10:00", isOfficeHour: true }];
                            setProfile({ ...profile, schedules: newSchedule });
                        }} className="text-sm text-blue-600 hover:underline">+ Ekle</button>
                    </div>

                    <div className="space-y-3">
                        {profile.schedules?.map((s: any, i: number) => (
                            <div key={i} className="flex gap-2 items-center bg-gray-50 dark:bg-zinc-900 p-3 rounded">
                                <select
                                    value={s.day}
                                    onChange={e => {
                                        const newS = [...profile.schedules]; newS[i].day = parseInt(e.target.value);
                                        setProfile({ ...profile, schedules: newS });
                                    }}
                                    className="p-1 border rounded"
                                >
                                    {DAYS.map((d, idx) => <option key={idx} value={idx}>{d}</option>)}
                                </select>
                                <input type="time" value={s.startTime} onChange={e => { const newS = [...profile.schedules]; newS[i].startTime = e.target.value; setProfile({ ...profile, schedules: newS }); }} className="p-1 border rounded" />
                                <span>-</span>
                                <input type="time" value={s.endTime} onChange={e => { const newS = [...profile.schedules]; newS[i].endTime = e.target.value; setProfile({ ...profile, schedules: newS }); }} className="p-1 border rounded" />

                                <label className="flex items-center gap-1 text-sm">
                                    <input type="checkbox" checked={s.isOfficeHour} onChange={e => { const newS = [...profile.schedules]; newS[i].isOfficeHour = e.target.checked; setProfile({ ...profile, schedules: newS }); }} />
                                    Ofis
                                </label>

                                <button type="button" onClick={() => {
                                    const newS = profile.schedules.filter((_: any, idx: number) => idx !== i);
                                    setProfile({ ...profile, schedules: newS });
                                }} className="text-red-500 hover:text-red-700"><Trash2 size={16} /></button>
                            </div>
                        ))}
                    </div>
                </div>

                <button type="submit" className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700">Kaydet</button>
            </form>
        </div>
    );
}
