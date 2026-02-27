"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { User, Building2, Clock, MapPin, Mail } from "lucide-react";
import RequestForm from "@/components/RequestForm";
import { API_URL } from "@/lib/config";

interface AcademicProfile {
    id: string;
    name: string;
    title?: string;
    bio?: string;
    avatarUrl?: string;
    email?: string;
    schedules: {
        day: number;
        startTime: string;
        endTime: string;
        location?: string;
        isOfficeHour: boolean;
    }[];
    department?: {
        name: string;
        faculty: {
            name: string;
        };
    };
}

const DAYS = ["Pazar", "Pazartesi", "Salı", "Çarşamba", "Perşembe", "Cuma", "Cumartesi"];

export default function ProfilePage() {
    const { slug } = useParams();
    const [profile, setProfile] = useState<AcademicProfile | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (slug) {
            fetch(`${API_URL}/academic/${slug}`)
                .then(res => res.json())
                .then(data => {
                    if (data.success) setProfile(data.data);
                })
                .catch(err => console.error(err))
                .finally(() => setLoading(false));
        }
    }, [slug]);

    if (loading) return <div className="min-h-screen flex items-center justify-center">Yükleniyor...</div>;
    if (!profile) return <div className="min-h-screen flex items-center justify-center">Profil bulunamadı.</div>;

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-zinc-900 text-gray-900 dark:text-gray-100 py-12 px-4">
            <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">

                <div className="md:col-span-2 space-y-6">
                    <div className="bg-white dark:bg-zinc-800 rounded-2xl p-8 shadow-sm border border-gray-100 dark:border-zinc-700 text-center md:text-left">
                        <div className="flex flex-col md:flex-row items-center gap-6">
                            <div className="w-32 h-32 rounded-full bg-gray-100 dark:bg-zinc-700 flex items-center justify-center overflow-hidden border-4 border-white dark:border-zinc-600 shadow-sm">
                                {profile.avatarUrl ? (
                                    <img src={profile.avatarUrl} alt={profile.name} className="w-full h-full object-cover" />
                                ) : (
                                    <User className="w-12 h-12 text-gray-400" />
                                )}
                            </div>
                            <div>
                                <h1 className="text-3xl font-bold">{profile.title} {profile.name}</h1>
                                <p className="text-blue-600 font-medium mt-1">{profile.department?.name}</p>
                                <p className="text-gray-500 text-sm">{profile.department?.faculty.name}</p>
                            </div>
                        </div>

                        <div className="mt-8 space-y-4 text-left">
                            {profile.bio && (
                                <div className="prose dark:prose-invert max-w-none">
                                    <h3 className="font-semibold text-lg mb-2">Hakkında</h3>
                                    <p className="text-gray-600 dark:text-gray-300">{profile.bio}</p>
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="bg-white dark:bg-zinc-800 rounded-2xl p-8 shadow-sm border border-gray-100 dark:border-zinc-700">
                        <h3 className="font-semibold text-lg mb-6 flex items-center gap-2">
                            <Clock className="text-blue-600" /> Ders ve Ofis Saatleri
                        </h3>

                        {profile.schedules && profile.schedules.length > 0 ? (
                            <div className="grid gap-4">
                                {profile.schedules.map((s, idx) => (
                                    <div key={idx} className="flex flex-col sm:flex-row sm:items-center justify-between p-4 rounded-xl bg-gray-50 dark:bg-zinc-900 border border-gray-100 dark:border-zinc-700">
                                        <div className="flex items-center gap-3">
                                            <span className="font-bold w-24">{DAYS[s.day]}</span>
                                            <span className={`px-2 py-1 rounded text-xs font-medium ${s.isOfficeHour ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-700'}`}>
                                                {s.isOfficeHour ? 'Ofis Saati' : 'Ders'}
                                            </span>
                                        </div>
                                        <div className="flex items-center gap-4 mt-2 sm:mt-0 text-sm text-gray-600 dark:text-gray-300">
                                            <span>{s.startTime} - {s.endTime}</span>
                                            {s.location && <span className="flex items-center gap-1 text-gray-400"><MapPin size={14} /> {s.location}</span>}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <p className="text-gray-500 italic">Program bilgisi girilmemiş.</p>
                        )}
                    </div>
                </div>

                <div className="space-y-6">
                    <RequestForm academicId={profile.id} />

                    <div className="bg-blue-50 dark:bg-zinc-800/50 p-6 rounded-xl border border-blue-100 dark:border-zinc-700">
                        <h4 className="font-bold text-blue-900 dark:text-blue-100 mb-2">Güvenlik Uyarısı</h4>
                        <p className="text-sm text-blue-800 dark:text-blue-200">
                            Gönderdiğiniz mesaj ve randevu talepleri, akademik personel tarafından görüntülenmeden önce moderatör onayından geçer. IP adresiniz güvenlik nedeniyle kayıt altındadır.
                        </p>
                    </div>
                </div>

            </div>
        </div>
    );
}
