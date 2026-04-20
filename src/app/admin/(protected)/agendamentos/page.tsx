"use client";

import { useEffect, useState } from "react";
import { STATUS_CONFIG } from "@/lib/constants";
import { formatCurrency, getWhatsAppLink, formatDate } from "@/lib/utils";
import { fetchAppointments, updateAppointmentStatus, updateAppointmentDetails } from "@/lib/api";
import type { Appointment, AppointmentStatus } from "@/lib/types";

const STATUS_OPTIONS: AppointmentStatus[] = ["pending", "confirmed", "in_progress", "done", "cancelled"];

export default function AdminAgendamentosPage() {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState({ total_value: "", admin_notes: "", client_notes: "" });
  const [saving, setSaving] = useState<string | null>(null);

  useEffect(() => {
    fetchAppointments()
      .then(setAppointments)
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const filtered = filterStatus === "all"
    ? appointments
    : appointments.filter((a) => a.status === filterStatus);

  const updateStatus = async (id: string, newStatus: AppointmentStatus) => {
    setSaving(id);
    try {
      await updateAppointmentStatus(id, newStatus);
      setAppointments((prev) =>
        prev.map((a) => (a.id === id ? { ...a, status: newStatus } : a))
      );
    } catch {
      // silently fail
    }
    setSaving(null);
  };

  const startEditing = (a: Appointment) => {
    setEditingId(a.id);
    setEditForm({
      total_value: a.total_value ? String(a.total_value) : "",
      admin_notes: a.admin_notes || "",
      client_notes: a.client_notes || "",
    });
  };

  const saveEditing = async (id: string) => {
    setSaving(id);
    try {
      await updateAppointmentDetails(id, {
        total_value: editForm.total_value ? Number(editForm.total_value) : null,
        admin_notes: editForm.admin_notes || null,
        client_notes: editForm.client_notes || null,
      });
      setAppointments((prev) =>
        prev.map((a) =>
          a.id === id
            ? {
                ...a,
                total_value: editForm.total_value ? Number(editForm.total_value) : null,
                admin_notes: editForm.admin_notes || null,
                client_notes: editForm.client_notes || null,
              }
            : a
        )
      );
    } catch {
      // silently fail
    }
    setEditingId(null);
    setSaving(null);
  };

  const getWhatsAppNotifyLink = (a: Appointment) => {
    const statusLabel = STATUS_CONFIG[a.status].label;
    const serviceName = a.service?.name || "Serviço";
    let msg = `Olá ${a.customer_name}! Seu agendamento na TZM Multi Service:\n\n` +
      `Serviço: ${serviceName}\n` +
      `Status: ${STATUS_CONFIG[a.status].emoji} ${statusLabel}\n`;
    if (a.total_value) msg += `Valor: ${formatCurrency(a.total_value)}\n`;
    if (a.client_notes) msg += `\nObs: ${a.client_notes}\n`;
    msg += `\nAcompanhe: ${typeof window !== "undefined" ? window.location.origin : ""}/acompanhar/${a.tracking_id}`;
    return getWhatsAppLink(a.customer_phone, msg);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="animate-spin w-10 h-10 border-4 border-primary-orange border-t-transparent rounded-full" />
      </div>
    );
  }

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-dark">Agendamentos</h2>
          <div className="flex items-center gap-2">
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="border border-gray-300 rounded-lg px-3 py-2 text-sm bg-white"
            >
              <option value="all">Todos</option>
              {STATUS_OPTIONS.map((s) => (
                <option key={s} value={s}>
                  {STATUS_CONFIG[s].emoji} {STATUS_CONFIG[s].label}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="space-y-4">
          {filtered.map((a) => {
            const config = STATUS_CONFIG[a.status];
            const isEditing = editingId === a.id;

            return (
              <div key={a.id} className="bg-white rounded-xl shadow-sm overflow-hidden">
                {/* Card Header */}
                <div className="p-5 border-b border-gray-100">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <div className="flex items-center gap-3 mb-1">
                        <h3 className="font-bold text-dark text-lg">{a.customer_name}</h3>
                        <span
                          className="text-xs font-semibold px-3 py-1 rounded-full"
                          style={{ backgroundColor: config.color + "20", color: config.color }}
                        >
                          {config.emoji} {config.label}
                        </span>
                      </div>
                      <p className="text-sm text-gray-500">
                        {a.car_brand} {a.car_model} {a.car_year}
                        {a.car_plate && ` · ${a.car_plate}`}
                      {" · "}{a.service?.name}
                      </p>
                      <p className="text-sm text-gray-400 mt-1">
                        📅 {formatDate(a.appointment_date)} às {a.time_slot} · ID: {a.tracking_id}
                      </p>
                    </div>
                    {a.total_value && (
                      <p className="text-xl font-bold text-primary-orange shrink-0">
                        {formatCurrency(a.total_value)}
                      </p>
                    )}
                  </div>
                </div>

                {/* Actions */}
                <div className="p-5">
                  <div className="flex flex-wrap items-center gap-2 mb-4">
                    <span className="text-sm text-gray-500 mr-2">Status:</span>
                    {STATUS_OPTIONS.map((s) => (
                      <button
                        key={s}
                        onClick={() => updateStatus(a.id, s)}
                        className={`text-xs px-3 py-1.5 rounded-lg font-medium transition-all ${
                          a.status === s
                            ? "ring-2 ring-offset-1"
                            : "opacity-60 hover:opacity-100"
                        }`}
                        style={{
                          backgroundColor: STATUS_CONFIG[s].color + "15",
                          color: STATUS_CONFIG[s].color,
                          ...(a.status === s ? { ringColor: STATUS_CONFIG[s].color } : {}),
                        }}
                      >
                        {STATUS_CONFIG[s].emoji} {STATUS_CONFIG[s].label}
                      </button>
                    ))}
                  </div>

                  {/* WhatsApp + Edit buttons */}
                  <div className="flex flex-wrap gap-2">
                    <a
                      href={getWhatsAppNotifyLink(a)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 bg-green-500 hover:bg-green-600 text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors"
                    >
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                      </svg>
                      Notificar no WhatsApp
                    </a>
                    <button
                      onClick={() => isEditing ? saveEditing(a.id) : startEditing(a)}
                      className={`text-sm font-medium px-4 py-2 rounded-lg transition-colors ${
                        isEditing
                          ? "bg-green-500 text-white hover:bg-green-600"
                          : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                      }`}
                    >
                      {isEditing ? "💾 Salvar" : "✏️ Editar Notas/Valor"}
                    </button>
                    {isEditing && (
                      <button
                        onClick={() => setEditingId(null)}
                        className="text-sm text-gray-500 hover:text-gray-700 px-3 py-2 transition-colors"
                      >
                        Cancelar
                      </button>
                    )}
                  </div>

                  {/* Edit form */}
                  {isEditing && (
                    <div className="mt-4 p-4 bg-surface rounded-lg space-y-3">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Valor do Serviço (R$)</label>
                        <input
                          type="number"
                          value={editForm.total_value}
                          onChange={(e) => setEditForm((p) => ({ ...p, total_value: e.target.value }))}
                          placeholder="Ex: 250.00"
                          className="w-full border border-gray-300 rounded-lg px-4 py-2 text-sm focus:ring-2 focus:ring-primary-orange focus:border-transparent outline-none"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Notas Internas <span className="text-gray-400">(só admin vê)</span>
                        </label>
                        <textarea
                          value={editForm.admin_notes}
                          onChange={(e) => setEditForm((p) => ({ ...p, admin_notes: e.target.value }))}
                          rows={2}
                          placeholder="Observações internas..."
                          className="w-full border border-gray-300 rounded-lg px-4 py-2 text-sm focus:ring-2 focus:ring-primary-orange focus:border-transparent outline-none resize-none"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Notas para o Cliente <span className="text-gray-400">(visível na página de acompanhamento)</span>
                        </label>
                        <textarea
                          value={editForm.client_notes}
                          onChange={(e) => setEditForm((p) => ({ ...p, client_notes: e.target.value }))}
                          rows={2}
                          placeholder="Ex: Trocamos pastilhas e discos. Recomendamos revisão em 6 meses."
                          className="w-full border border-gray-300 rounded-lg px-4 py-2 text-sm focus:ring-2 focus:ring-primary-orange focus:border-transparent outline-none resize-none"
                        />
                      </div>
                    </div>
                  )}

                  {/* Show notes if not editing */}
                  {!isEditing && (a.admin_notes || a.client_notes) && (
                    <div className="mt-4 space-y-2">
                      {a.admin_notes && (
                        <div className="p-3 bg-yellow-50 rounded-lg border border-yellow-100">
                          <p className="text-xs font-semibold text-yellow-700 mb-1">🔒 Nota Interna</p>
                          <p className="text-sm text-yellow-800">{a.admin_notes}</p>
                        </div>
                      )}
                      {a.client_notes && (
                        <div className="p-3 bg-blue-50 rounded-lg border border-blue-100">
                          <p className="text-xs font-semibold text-blue-700 mb-1">👁️ Nota para o Cliente</p>
                          <p className="text-sm text-blue-800">{a.client_notes}</p>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            );
          })}

          {filtered.length === 0 && (
            <div className="text-center py-12 text-gray-400">
              <p className="text-lg">Nenhum agendamento encontrado.</p>
            </div>
          )}
      </div>
    </main>
  );
}


