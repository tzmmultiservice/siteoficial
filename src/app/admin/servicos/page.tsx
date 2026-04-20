"use client";

import { useState } from "react";
import Link from "next/link";
import { PLACEHOLDER_SERVICES } from "@/lib/constants";
import { formatCurrency } from "@/lib/utils";

interface ServiceForm {
  name: string;
  description: string;
  price_estimate: number;
  duration_minutes: number;
  active: boolean;
}

export default function AdminServicosPage() {
  const [services, setServices] = useState<ServiceForm[]>(
    PLACEHOLDER_SERVICES.map((s) => ({
      name: s.name,
      description: s.description,
      price_estimate: s.price_estimate,
      duration_minutes: s.duration_minutes,
      active: s.active,
    }))
  );
  const [editingIdx, setEditingIdx] = useState<number | null>(null);

  const toggleActive = (idx: number) => {
    setServices((prev) =>
      prev.map((s, i) => (i === idx ? { ...s, active: !s.active } : s))
    );
  };

  return (
    <div className="min-h-screen bg-surface">
      {/* Admin Header */}
      <header className="bg-dark-bg border-b border-gray-800 px-4 sm:px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <h1 className="text-white text-xl font-bold">
              TZM <span className="gradient-text">Admin</span>
            </h1>
          </div>
          <nav className="flex items-center gap-6">
            <Link href="/admin" className="text-gray-400 hover:text-white text-sm transition-colors">
              Dashboard
            </Link>
            <Link href="/admin/agendamentos" className="text-gray-400 hover:text-white text-sm transition-colors">
              Agendamentos
            </Link>
            <Link href="/admin/servicos" className="text-primary-orange text-sm font-medium">
              Serviços
            </Link>
            <Link href="/admin/login" className="text-gray-500 hover:text-red-400 text-sm transition-colors">
              Sair
            </Link>
          </nav>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 sm:px-6 py-8">
        <h2 className="text-2xl font-bold text-dark mb-6">Gerenciar Serviços</h2>

        <div className="space-y-4">
          {services.map((service, idx) => {
            const isEditing = editingIdx === idx;
            return (
              <div
                key={idx}
                className={`bg-white rounded-xl shadow-sm p-5 transition-opacity ${
                  !service.active ? "opacity-60" : ""
                }`}
              >
                {isEditing ? (
                  <div className="space-y-3">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Nome</label>
                        <input
                          type="text"
                          value={service.name}
                          onChange={(e) =>
                            setServices((p) =>
                              p.map((s, i) => (i === idx ? { ...s, name: e.target.value } : s))
                            )
                          }
                          className="w-full border border-gray-300 rounded-lg px-4 py-2 text-sm focus:ring-2 focus:ring-primary-orange focus:border-transparent outline-none"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Preço Estimado (R$)</label>
                        <input
                          type="number"
                          value={service.price_estimate}
                          onChange={(e) =>
                            setServices((p) =>
                              p.map((s, i) =>
                                i === idx ? { ...s, price_estimate: Number(e.target.value) } : s
                              )
                            )
                          }
                          className="w-full border border-gray-300 rounded-lg px-4 py-2 text-sm focus:ring-2 focus:ring-primary-orange focus:border-transparent outline-none"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Descrição</label>
                      <textarea
                        value={service.description}
                        onChange={(e) =>
                          setServices((p) =>
                            p.map((s, i) => (i === idx ? { ...s, description: e.target.value } : s))
                          )
                        }
                        rows={2}
                        className="w-full border border-gray-300 rounded-lg px-4 py-2 text-sm focus:ring-2 focus:ring-primary-orange focus:border-transparent outline-none resize-none"
                      />
                    </div>
                    <div className="w-48">
                      <label className="block text-sm font-medium text-gray-700 mb-1">Duração (min)</label>
                      <input
                        type="number"
                        value={service.duration_minutes}
                        onChange={(e) =>
                          setServices((p) =>
                            p.map((s, i) =>
                              i === idx ? { ...s, duration_minutes: Number(e.target.value) } : s
                            )
                          )
                        }
                        className="w-full border border-gray-300 rounded-lg px-4 py-2 text-sm focus:ring-2 focus:ring-primary-orange focus:border-transparent outline-none"
                      />
                    </div>
                    <div className="flex gap-2 pt-2">
                      <button
                        onClick={() => setEditingIdx(null)}
                        className="bg-green-500 text-white text-sm font-medium px-4 py-2 rounded-lg hover:bg-green-600 transition-colors"
                      >
                        💾 Salvar
                      </button>
                      <button
                        onClick={() => setEditingIdx(null)}
                        className="text-sm text-gray-500 hover:text-gray-700 px-3 py-2 transition-colors"
                      >
                        Cancelar
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-bold text-dark">{service.name}</h3>
                        {!service.active && (
                          <span className="text-xs bg-red-100 text-red-600 px-2 py-0.5 rounded-full">Inativo</span>
                        )}
                      </div>
                      <p className="text-sm text-gray-500">{service.description}</p>
                      <p className="text-sm text-gray-400 mt-1">
                        {formatCurrency(service.price_estimate)} · ~{service.duration_minutes}min
                      </p>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <button
                        onClick={() => setEditingIdx(idx)}
                        className="text-sm bg-gray-100 text-gray-700 hover:bg-gray-200 px-3 py-2 rounded-lg transition-colors"
                      >
                        ✏️ Editar
                      </button>
                      <button
                        onClick={() => toggleActive(idx)}
                        className={`text-sm px-3 py-2 rounded-lg transition-colors ${
                          service.active
                            ? "bg-red-50 text-red-600 hover:bg-red-100"
                            : "bg-green-50 text-green-600 hover:bg-green-100"
                        }`}
                      >
                        {service.active ? "Desativar" : "Ativar"}
                      </button>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </main>
    </div>
  );
}
