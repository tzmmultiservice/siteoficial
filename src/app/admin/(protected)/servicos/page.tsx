"use client";

import { useEffect, useState } from "react";
import { formatCurrency } from "@/lib/utils";
import { fetchAllServices, updateService } from "@/lib/api";
import type { Service } from "@/lib/types";

export default function AdminServicosPage() {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState({ name: "", description: "", price_estimate: 0, duration_minutes: 0 });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchAllServices()
      .then(setServices)
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const toggleActive = async (service: Service) => {
    setSaving(true);
    try {
      await updateService(service.id, { active: !service.active });
      setServices((prev) =>
        prev.map((s) => (s.id === service.id ? { ...s, active: !s.active } : s))
      );
    } catch {
      // silently fail
    }
    setSaving(false);
  };

  const startEditing = (s: Service) => {
    setEditingId(s.id);
    setEditForm({
      name: s.name,
      description: s.description,
      price_estimate: s.price_estimate,
      duration_minutes: s.duration_minutes,
    });
  };

  const saveEditing = async (id: string) => {
    setSaving(true);
    try {
      await updateService(id, editForm);
      setServices((prev) =>
        prev.map((s) => (s.id === id ? { ...s, ...editForm } : s))
      );
    } catch {
      // silently fail
    }
    setEditingId(null);
    setSaving(false);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="animate-spin w-10 h-10 border-4 border-primary-orange border-t-transparent rounded-full" />
      </div>
    );
  }

  return (
    <main className="max-w-5xl mx-auto px-4 sm:px-6 py-8">
      <h2 className="text-2xl font-bold text-white mb-6">Gerenciar Serviços</h2>

      <div className="space-y-4">
        {services.map((service) => {
          const isEditing = editingId === service.id;
          return (
            <div
              key={service.id}
              className={`glass-card rounded-xl p-5 transition-opacity ${
                !service.active ? "opacity-60" : ""
              }`}
            >
              {isEditing ? (
                <div className="space-y-3">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-sm font-medium text-gray-400 mb-1">Nome</label>
                      <input
                        type="text"
                        value={editForm.name}
                        onChange={(e) => setEditForm((p) => ({ ...p, name: e.target.value }))}
                        className="input-dark text-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-400 mb-1">Preço Estimado (R$)</label>
                      <input
                        type="number"
                        value={editForm.price_estimate}
                        onChange={(e) => setEditForm((p) => ({ ...p, price_estimate: Number(e.target.value) }))}
                        className="input-dark text-sm"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-1">Descrição</label>
                    <textarea
                      value={editForm.description}
                      onChange={(e) => setEditForm((p) => ({ ...p, description: e.target.value }))}
                      rows={2}
                      className="input-dark text-sm resize-none"
                    />
                  </div>
                  <div className="w-48">
                    <label className="block text-sm font-medium text-gray-400 mb-1">Duração (min)</label>
                    <input
                      type="number"
                      value={editForm.duration_minutes}
                      onChange={(e) => setEditForm((p) => ({ ...p, duration_minutes: Number(e.target.value) }))}
                      className="input-dark text-sm"
                    />
                  </div>
                  <div className="flex gap-2 pt-2">
                    <button
                      onClick={() => saveEditing(service.id)}
                      disabled={saving}
                      className="bg-green-500 text-white text-sm font-medium px-4 py-2 rounded-lg hover:bg-green-600 transition-colors disabled:opacity-50"
                    >
                      💾 Salvar
                    </button>
                    <button
                      onClick={() => setEditingId(null)}
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
                      <h3 className="font-bold text-white">{service.name}</h3>
                      {!service.active && (
                        <span className="text-xs bg-red-500/15 text-red-400 px-2 py-0.5 rounded-full">Inativo</span>
                      )}
                    </div>
                    <p className="text-sm text-gray-500">{service.description}</p>
                    <p className="text-sm text-gray-400 mt-1">
                      {formatCurrency(service.price_estimate)} · ~{service.duration_minutes}min
                    </p>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      onClick={() => startEditing(service)}
                      className="text-sm bg-white/5 text-gray-400 hover:bg-white/10 border border-dark-border-light px-3 py-2 rounded-lg transition-colors"
                    >
                      ✏️ Editar
                    </button>
                    <button
                      onClick={() => toggleActive(service)}
                      disabled={saving}
                      className={`text-sm px-3 py-2 rounded-lg transition-colors ${
                        service.active
                          ? "bg-red-500/15 text-red-400 hover:bg-red-500/25"
                          : "bg-green-500/15 text-green-400 hover:bg-green-500/25"
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
  );
}
