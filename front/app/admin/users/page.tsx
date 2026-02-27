"use client";

import { useEffect, useState } from 'react';
import { UserPlus, Edit2, Trash2, Shield, User, GraduationCap, Search, Mail } from 'lucide-react';
import { API_URL } from '@/lib/config';
import AdminUserModal from '@/components/AdminUserModal';

export default function UsersPage() {
    const [users, setUsers] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedUser, setSelectedUser] = useState<any>(null);
    const [searchQuery, setSearchQuery] = useState("");
    const [roleFilter, setRoleFilter] = useState("ALL");

    const fetchUsers = async () => {
        setLoading(true);
        const token = localStorage.getItem('token');
        try {
            const res = await fetch(`${API_URL}/admin/users`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            const data = await res.json();
            if (data.success) setUsers(data.data);
        } catch (error) {
            console.error(error);
        }
        setLoading(false);
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    const handleDelete = async (id: string) => {
        if (!confirm('Bu kullanıcıyı silmek istediğinize emin misiniz? Bu işlem geri alınamaz.')) return;

        const token = localStorage.getItem('token');
        try {
            const res = await fetch(`${API_URL}/admin/users/${id}`, {
                method: 'DELETE',
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (res.ok) fetchUsers();
        } catch (error) {
            console.error(error);
        }
    };

    const filteredUsers = users.filter(u => {
        const matchesSearch = u.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            u.email.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesRole = roleFilter === "ALL" || u.role === roleFilter;
        return matchesSearch && matchesRole;
    });

    const getRoleBadge = (role: string) => {
        switch (role) {
            case 'ADMIN': return <span className="px-2 py-1 rounded-md text-[10px] font-bold bg-red-100 text-red-700 border border-red-200 uppercase tracking-wider">Admin</span>;
            case 'MODERATOR': return <span className="px-2 py-1 rounded-md text-[10px] font-bold bg-purple-100 text-purple-700 border border-purple-200 uppercase tracking-wider">Moderatör</span>;
            default: return <span className="px-2 py-1 rounded-md text-[10px] font-bold bg-blue-100 text-blue-700 border border-blue-200 uppercase tracking-wider">Akademisyen</span>;
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white dark:bg-zinc-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-zinc-700">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Kullanıcı Yönetimi</h1>
                    <p className="text-gray-500 text-sm mt-1">Sistemdeki tüm admin, moderatör ve akademisyenleri yönetin.</p>
                </div>
                <button
                    onClick={() => { setSelectedUser(null); setIsModalOpen(true); }}
                    className="flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl font-semibold shadow-lg shadow-blue-500/20 transition-all active:scale-95"
                >
                    <UserPlus size={20} />
                    Yeni Kullanıcı
                </button>
            </div>

            <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1 relative">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                    <input
                        type="text"
                        placeholder="İsim veya email ile ara..."
                        className="w-full pl-12 pr-4 py-3 rounded-xl border border-gray-100 dark:bg-zinc-800 dark:border-zinc-700 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none transition"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>
                <select
                    className="px-4 py-3 rounded-xl border border-gray-100 dark:bg-zinc-800 dark:border-zinc-700 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none transition"
                    value={roleFilter}
                    onChange={(e) => setRoleFilter(e.target.value)}
                >
                    <option value="ALL">Tüm Roller</option>
                    <option value="ADMIN">Admin</option>
                    <option value="MODERATOR">Moderatör</option>
                    <option value="ACADEMIC">Akademisyen</option>
                </select>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {loading ? (
                    <div className="col-span-full text-center py-20 text-gray-500">Yükleniyor...</div>
                ) : filteredUsers.length === 0 ? (
                    <div className="col-span-full text-center py-20 text-gray-500">Kullanıcı bulunamadı.</div>
                ) : (
                    filteredUsers.map((user) => (
                        <div key={user.id} className="bg-white dark:bg-zinc-800 rounded-2xl shadow-sm border border-gray-100 dark:border-zinc-700 p-6 hover:shadow-md transition-shadow group relative overflow-hidden">
                            <div className="absolute top-0 right-0 p-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                <button
                                    onClick={() => { setSelectedUser(user); setIsModalOpen(true); }}
                                    className="p-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition"
                                >
                                    <Edit2 size={16} />
                                </button>
                                <button
                                    onClick={() => handleDelete(user.id)}
                                    className="p-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition"
                                >
                                    <Trash2 size={16} />
                                </button>
                            </div>

                            <div className="flex items-start gap-4 mb-4">
                                <div className="w-12 h-12 bg-gray-100 dark:bg-zinc-700 rounded-xl flex items-center justify-center text-gray-400">
                                    {user.role === 'ADMIN' ? <Shield size={24} /> : user.role === 'MODERATOR' ? <Shield size={24} className="text-purple-400" /> : <GraduationCap size={24} />}
                                </div>
                                <div>
                                    <h3 className="font-bold text-gray-900 dark:text-white leading-tight">{user.name}</h3>
                                    <p className="text-xs text-gray-400 mt-1 uppercase tracking-tighter">{user.role}</p>
                                </div>
                            </div>

                            <div className="space-y-3">
                                <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                                    <Mail size={14} className="text-gray-400" />
                                    <span className="truncate">{user.email}</span>
                                </div>
                                {user.role === 'ACADEMIC' && (
                                    <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                                        <GraduationCap size={14} className="text-gray-400" />
                                        <span>{user.title || 'Unvan Belirtilmemiş'}</span>
                                    </div>
                                )}
                            </div>

                            <div className="mt-6 pt-4 border-t border-gray-50 dark:border-zinc-700 flex justify-between items-center">
                                {getRoleBadge(user.role)}
                                <span className="text-[10px] text-gray-400">Katılım: {new Date(user.createdAt).toLocaleDateString('tr-TR')}</span>
                            </div>
                        </div>
                    ))
                )}
            </div>

            {isModalOpen && (
                <AdminUserModal
                    user={selectedUser}
                    onClose={() => setIsModalOpen(false)}
                    onSuccess={() => { setIsModalOpen(false); fetchUsers(); }}
                />
            )}
        </div>
    );
}
