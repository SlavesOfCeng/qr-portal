"use client";

import { useEffect, useState } from "react";
import FingerprintJS from "@fingerprintjs/fingerprintjs";
import { Send, Calendar } from "lucide-react";
import { API_URL } from "@/lib/config";

interface RequestFormProps {
    academicId: string;
}

export default function RequestForm({ academicId }: RequestFormProps) {
    const [activeTab, setActiveTab] = useState<"MESSAGE" | "APPOINTMENT">("MESSAGE");
    const [content, setContent] = useState("");
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState("");
    const [fingerprint, setFingerprint] = useState("");

    useEffect(() => {
        const setFp = async () => {
            const fp = await FingerprintJS.load();
            const { visitorId } = await fp.get();
            setFingerprint(visitorId);
        };
        setFp();
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError("");
        setSuccess(false);

        try {
            if (!fingerprint) {
                throw new Error("Kimlik doğrulaması başlatılamadı (Fingerprint).");
            }

            const res = await fetch(`${API_URL}/student/request`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    academicId,
                    type: activeTab,
                    content,
                    fingerprintId: fingerprint,
                    userAgent: navigator.userAgent,
                }),
            });

            const data = await res.json();
            if (data.success) {
                setSuccess(true);
                setContent("");
            } else {
                setError(data.message || "İşlem başarısız.");
            }
        } catch (err) {
            setError("Bir hata oluştu.");
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="bg-white dark:bg-zinc-800 rounded-xl shadow-sm border border-gray-100 dark:border-zinc-700 p-6">
            <h3 className="text-lg font-bold mb-4">İletişime Geç</h3>

            <div className="flex gap-2 mb-4 p-1 bg-gray-100 dark:bg-zinc-700 rounded-lg">
                <button
                    onClick={() => { setActiveTab("MESSAGE"); setSuccess(false); setError(""); }}
                    className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-md text-sm font-medium transition-all ${activeTab === "MESSAGE" ? "bg-white dark:bg-zinc-600 shadow-sm text-blue-600 dark:text-blue-400" : "text-gray-500 dark:text-gray-400 hover:text-gray-700"}`}
                >
                    <Send size={16} /> Mesaj Bırak
                </button>
                <button
                    onClick={() => { setActiveTab("APPOINTMENT"); setSuccess(false); setError(""); }}
                    className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-md text-sm font-medium transition-all ${activeTab === "APPOINTMENT" ? "bg-white dark:bg-zinc-600 shadow-sm text-blue-600 dark:text-blue-400" : "text-gray-500 dark:text-gray-400 hover:text-gray-700"}`}
                >
                    <Calendar size={16} /> Randevu İste
                </button>
            </div>

            {success ? (
                <div className="bg-green-50 text-green-600 p-4 rounded-lg text-center">
                    <p className="font-bold">Gönderildi!</p>
                    <p className="text-sm">Talebiniz başarıyla iletildi.</p>
                    <button onClick={() => setSuccess(false)} className="text-sm underline mt-2">Yeni talep</button>
                </div>
            ) : (
                <form onSubmit={handleSubmit} className="space-y-3">
                    {activeTab === "MESSAGE" ? (
                        <div>
                            <label className="block text-sm text-gray-500 mb-1">Mesajınız</label>
                            <textarea
                                required
                                className="w-full p-3 rounded-lg border dark:bg-zinc-900 dark:border-zinc-600 min-h-[120px]"
                                placeholder="Sayın hocam..."
                                value={content}
                                onChange={(e) => setContent(e.target.value)}
                            />
                        </div>
                    ) : (
                        <div>
                            <label className="block text-sm text-gray-500 mb-1">Randevu Talebi Notu</label>
                            <textarea
                                required
                                className="w-full p-3 rounded-lg border dark:bg-zinc-900 dark:border-zinc-600 min-h-[120px]"
                                placeholder="Hangi konu hakkında görüşmek istiyorsunuz? Tercih ettiğiniz saatler..."
                                value={content}
                                onChange={(e) => setContent(e.target.value)}
                            />
                            <p className="text-xs text-gray-400 mt-1">*Hocanın ofis saatlerini kontrol etmeyi unutmayın.</p>
                        </div>
                    )}

                    {error && <div className="text-red-500 text-sm">{error}</div>}

                    <button
                        type="submit"
                        disabled={loading || !fingerprint}
                        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2.5 rounded-lg transition-colors flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
                    >
                        {loading ? "Gönderiliyor..." : "Gönder"}
                    </button>
                    <p className="text-[10px] text-gray-400 text-center">Bu işlem sırasında cihaz kimliğiniz (fingerprint) güvenlik amacıyla kaydedilecektir.</p>
                </form>
            )}
        </div>
    );
}
