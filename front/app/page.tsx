"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Search, Building2, User, ChevronRight, GraduationCap } from "lucide-react";
import { API_URL } from "@/lib/config";

interface Academic {
  id: string;
  name: string;
  title?: string;
  slug: string;
  avatarUrl?: string;
  department?: {
    name: string;
    faculty: {
      name: string;
    }
  }
}

export default function Home() {
  const [academics, setAcademics] = useState<Academic[]>([]);
  const [filteredAcademics, setFilteredAcademics] = useState<Academic[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [selectedFaculty, setSelectedFaculty] = useState("Tümü");

  useEffect(() => {
    fetch(`${API_URL}/academic`)
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setAcademics(data.data);
          setFilteredAcademics(data.data);
        }
      })
      .catch((err) => console.error("Failed to fetch academics:", err))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    let result = academics;

    if (selectedFaculty !== "Tümü") {
      result = result.filter(a => a.department?.faculty.name === selectedFaculty);
    }

    if (search) {
      result = result.filter(a => a.name.toLowerCase().includes(search.toLowerCase()));
    }

    setFilteredAcademics(result);
  }, [search, selectedFaculty, academics]);

  // @ts-ignore
  const faculties = ["Tümü", ...new Set(academics.map(a => a.department?.faculty.name).filter(Boolean))];

  return (
    <div className="min-h-screen bg-white">

      <div className="bg-gray-50 border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-20">
          <div className="max-w-3xl">
            <h1 className="text-3xl md:text-5xl font-bold text-blue-900 mb-6 tracking-tight">
              Akademik Kadro
            </h1>
            <p className="text-gray-600 text-lg mb-8 leading-relaxed">
              Mehmet Akif Ersoy Üniversitesi akademik personeline ulaşmak, ofis saatlerini öğrenmek ve randevu oluşturmak için aşağıdan arama yapabilirsiniz.
            </p>

            <div className="relative max-w-xl">
              <input
                type="text"
                placeholder="İsim, unvan veya bölüm ara..."
                className="w-full pl-12 pr-4 py-4 rounded-lg bg-white border border-gray-300 shadow-sm focus:ring-2 focus:ring-blue-900 focus:border-blue-900 transition-all font-medium placeholder-gray-400 text-gray-900"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
              <Search className="absolute left-4 top-4.5 text-gray-400 w-5 h-5 pointer-events-none" />
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">

        <div className="mb-10 overflow-x-auto pb-2 no-scrollbar">
          <div className="flex gap-2">
            {faculties.map((f: any) => (
              <button
                key={f}
                onClick={() => setSelectedFaculty(f)}
                className={`px-5 py-2 rounded-md text-sm font-semibold transition-all whitespace-nowrap border ${selectedFaculty === f
                  ? "bg-blue-900 text-white border-blue-900 shadow-md"
                  : "bg-white text-gray-600 border-gray-200 hover:border-blue-300 hover:text-blue-900"
                  }`}
              >
                {f}
              </button>
            ))}
          </div>
        </div>

        {loading ? (
          <div className="py-20 text-center">
            <div className="inline-block w-8 h-8 border-2 border-blue-900 border-t-transparent rounded-full animate-spin"></div>
            <p className="mt-4 text-gray-500 font-medium">Akademisyenler yükleniyor...</p>
          </div>
        ) : filteredAcademics.length === 0 ? (
          <div className="py-20 text-center bg-gray-50 rounded-xl border border-dashed border-gray-300">
            <p className="text-gray-500">Aradığınız kriterlere uygun kayıt bulunamadı.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredAcademics.map((academic) => (
              <Link href={`/profile/${academic.slug}`} key={academic.id} className="group block bg-white rounded-lg border border-gray-200 hover:border-blue-900 hover:shadow-lg transition-all duration-300 p-5">
                <div className="flex items-start gap-5">
                  <div className="w-20 h-20 rounded-full bg-gray-100 overflow-hidden flex-shrink-0 border border-gray-100">
                    {academic.avatarUrl ? (
                      <img src={academic.avatarUrl} alt={academic.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-300">
                        <User size={32} />
                      </div>
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-bold text-blue-900 uppercase tracking-wide mb-1">
                      {academic.department?.faculty.name.split(' ')[0]} FAk.
                    </p>
                    <h3 className="text-lg font-bold text-gray-900 truncate group-hover:text-blue-700">
                      {academic.title} {academic.name}
                    </h3>
                    <p className="text-sm text-gray-500 mt-1 flex items-center gap-1">
                      <Building2 size={12} className="text-gray-400" />
                      {academic.department?.name}
                    </p>

                    <div className="mt-4 flex items-center text-sm font-semibold text-blue-900 opacity-60 group-hover:opacity-100 transition-opacity">
                      Profil ve Randevu <ChevronRight size={16} className="ml-1" />
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
