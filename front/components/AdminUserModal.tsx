"use client";

import { useState, useEffect } from "react";
import { X, Save, User, Shield, Info, GraduationCap } from "lucide-react";
import { API_URL } from "@/lib/config";

interface UserModalProps {
    user?: any;
    onClose: () => void;
    onSuccess: () => void;
}

export default function UserModal({ user, onClose, onSuccess }: UserModalProps) {
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        password: "",
        role: "ACADEMIC",
        title: "",
        bio: "",
        departmentId: ""
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    useEffect(() => {
        if (user) {
            setFormData({
                name: user.name || "",
                email: user.email || "",
                password: "", // Keep password empty unless changing
                role: user.role || "ACADEMIC",
                title: user.title || "",
                bio: user.bio || "",
                departmentId: user.departmentId || ""
            });
        }
    }, [user]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError("");

        const token = localStorage.getItem("token");
        const method = user ? "PUT" : "POST";
        const url = user ? `${API_URL}/admin/users/${user.id}` : `${API_URL}/admin/users`;

        try {
            const res = await fetch(url, {
                method,
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify(formData)
            });

            const data = await res.json();
            if (data.success) {
                onSuccess();
            } else {
                setError(data.message || "Bir hata oluştu");
            }
        } catch (err) {
            setError("Bağlantı hatası oluştu");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-white dark:bg-zinc-800 rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
                <div className="p-6 border-b border-gray-100 dark:border-zinc-700 flex justify-between items-center sticky top-0 bg-white dark:bg-zinc-800 z-10">
                    <h2 className="text-xl font-bold flex items-center gap-2">
                        {user ? <Save size={20} className="text-blue-600" /> : <User size={20} className="text-blue-600" />}
                        {user ? "Kullanıcıyı Düzenle" : "Yeni Kullanıcı Ekle"}
                    </h2>
                    <button onClick={onClose} className="p-2 hover:bg-gray-100 dark:hover:bg-zinc-700 rounded-full transition">
                        <X size={20} />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-6">
                    {error && <div className="bg-red-50 text-red-600 p-4 rounded-xl text-sm border border-red-100">{error}</div>}

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-1">
                            <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">Ad Soyad</label>
                            <input
                                required
                                className="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:bg-zinc-900 dark:border-zinc-700 dark:text-white"
                                value={formData.name}
                                onChange={e => setFormData({ ...formData, name: e.target.value })}
                            />
                        </div>
                        <div className="space-y-1">
                            <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">Email</label>
                            <input
                                required
                                type="email"
                                className="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:bg-zinc-900 dark:border-zinc-700 dark:text-white"
                                value={formData.email}
                                onChange={e => setFormData({ ...formData, email: e.target.value })}
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-1">
                            <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">Rol</label>
                            <select
                                className="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:bg-zinc-900 dark:border-zinc-700 dark:text-white"
                                value={formData.role}
                                onChange={e => setFormData({ ...formData, role: e.target.value })}
                            >
                                <option value="ACADEMIC">Akademisyen</option>
                                <option value="MODERATOR">Moderatör</option>
                                <option value="ADMIN">Admin</option>
                            </select>
                        </div>
                        <div className="space-y-1">
                            <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                                {user ? "Şifre (Boş bırakılırsa değişmez)" : "Şifre"}
                            </label>
                            <input
                                type="password"
                                required={!user}
                                className="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:bg-zinc-900 dark:border-zinc-700 dark:text-white"
                                value={formData.password}
                                onChange={e => setFormData({ ...formData, password: e.target.value })}
                            />
                        </div>
                    </div>

                    {formData.role === "ACADEMIC" && (
                        <div className="p-4 bg-gray-50 dark:bg-zinc-900/50 rounded-2xl border border-gray-100 dark:border-zinc-700 space-y-4">
                            <div className="flex items-center gap-2 text-blue-600 dark:text-blue-400 font-bold text-sm">
                                <GraduationCap size={18} />
                                Akademisyen Bilgileri
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-1">
                                    <label className="text-xs font-semibold uppercase tracking-wider text-gray-500">Unvan</label>
                                    <input
                                        placeholder="Prof. Dr."
                                        className="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:bg-zinc-900 dark:border-zinc-700 dark:text-white"
                                        value={formData.title}
                                        onChange={e => setFormData({ ...formData, title: e.target.value })}
                                    />
                                </div>
                                <div className="space-y-1">
                                    <label className="text-xs font-semibold uppercase tracking-wider text-gray-500">Bölüm ID (Opsiyonel)</label>
                                    <input
                                        placeholder="Departman ID"
                                        className="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:bg-zinc-900 dark:border-zinc-700 dark:text-white"
                                        value={formData.departmentId}
                                        onChange={e => setFormData({ ...formData, departmentId: e.target.value })}
                                    />
                                </div>
                            </div>
                            <div className="space-y-1">
                                <label className="text-xs font-semibold uppercase tracking-wider text-gray-500">Biyografi</label>
                                <textarea
                                    className="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:bg-zinc-900 dark:border-zinc-700 dark:text-white h-24"
                                    value={formData.bio}
                                    onChange={e => setFormData({ ...formData, bio: e.target.value })}
                                />
                            </div>
                        </div>
                    )}

                    <div className="flex items-center gap-2 text-xs text-gray-500 bg-blue-50 dark:bg-blue-900/10 p-3 rounded-lg">
                        <Info size={14} className="text-blue-600" />
                        Adminler tüm kullanıcı profillerini ve yetkilerini yönetebilir.
                    </div>

                    <div className="flex gap-3 pt-4">
                        <button
                            type="button"
                            onClick={onClose}
                            className="flex-1 px-6 py-3 rounded-xl border border-gray-200 dark:border-zinc-700 font-semibold hover:bg-gray-50 dark:hover:bg-zinc-700 transition"
                        >
                            İptal
                        </button>
                        <button
                            type="submit"
                            disabled={loading}
                            className="flex-1 px-6 py-3 rounded-xl bg-blue-600 text-white font-semibold hover:bg-blue-700 transition disabled:opacity-50 flex items-center justify-center gap-2"
                        >
                            {loading ? "Kaydediliyor..." : <><Save size={18} /> Kaydet</>}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
