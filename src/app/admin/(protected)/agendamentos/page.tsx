"use client";

import { useEffect, useMemo, useState } from "react";
import { STATUS_CONFIG } from "@/lib/constants";
import { formatCurrency, formatDate, getWhatsAppLink } from "@/lib/utils";
import {
  fetchAppointments,
  updateAppointmentDetails,
  updateAppointmentStatus,
} from "@/lib/api";
import type { Appointment, AppointmentStatus } from "@/lib/types";

const KANBAN_COLUMNS: AppointmentStatus[] = ["pending", "confirmed", "in_progress", "done", "cancelled"];

const FLOW: AppointmentStatus[] = ["pending", "confirmed", "in_progress", "done"];

const STATUS_CLASS: Record<AppointmentStatus, { text: string; button: string }> = {
  pending: { text: "text-yellow-400", button: "bg-yellow-600 hover:bg-yellow-500" },
  confirmed: { text: "text-blue-400", button: "bg-blue-600 hover:bg-blue-500" },
  in_progress: { text: "text-orange-400", button: "bg-orange-600 hover:bg-orange-500" },
  done: { text: "text-green-400", button: "bg-green-600 hover:bg-green-500" },
  cancelled: { text: "text-red-400", button: "bg-red-600 hover:bg-red-500" },
};

function getNextStatus(current: AppointmentStatus): AppointmentStatus | null {
  const idx = FLOW.indexOf(current);
  if (idx === -1 || idx === FLOW.length - 1) return null;
  return FLOW[idx + 1];
}

function getPreviousStatus(current: AppointmentStatus): AppointmentStatus | null {
  const idx = FLOW.indexOf(current);
  if (idx <= 0) return null;
  return FLOW[idx - 1];
}

export default function AdminAgendamentosPage() {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedYard, setSelectedYard] = useState("all");
  const [searchMechanic, setSearchMechanic] = useState("");
  const [savingId, setSavingId] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState({ total_value: "", admin_notes: "", client_notes: "" });

  useEffect(() => {
    fetchAppointments()
      .then(setAppointments)
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const yardOptions = useMemo(() => {
    const set = new Set<string>();
    for (const appointment of appointments) {
      set.add(appointment.yard_name || "Pátio Principal");
    }
    return Array.from(set).sort();
  }, [appointments]);

  const filteredAppointments = useMemo(() => {
    return appointments.filter((appointment) => {
      const byYard = selectedYard === "all" || (appointment.yard_name || "Pátio Principal") === selectedYard;
      const byMechanic =
        !searchMechanic.trim() ||
        (appointment.responsible_mechanic || "")
          .toLowerCase()
          .includes(searchMechanic.trim().toLowerCase());
      return byYard && byMechanic;
    });
  }, [appointments, searchMechanic, selectedYard]);

  const grouped = useMemo(() => {
    return KANBAN_COLUMNS.reduce<Record<AppointmentStatus, Appointment[]>>((acc, status) => {
      acc[status] = filteredAppointments
        .filter((item) => item.status === status)
        .sort((a, b) => {
          if (a.appointment_date !== b.appointment_date) {
            return a.appointment_date.localeCompare(b.appointment_date);
          }
          return a.time_slot.localeCompare(b.time_slot);
        });
      return acc;
    }, { pending: [], confirmed: [], in_progress: [], done: [], cancelled: [] });
  }, [filteredAppointments]);

  const applyStatus = async (appointment: Appointment, status: AppointmentStatus) => {
    setSavingId(appointment.id);
    try {
      await updateAppointmentStatus(appointment.id, status);
      let progress = appointment.progress_percent ?? 0;
      if (status === "pending") progress = 10;
      if (status === "confirmed") progress = Math.max(progress, 25);
      if (status === "in_progress") progress = Math.max(progress, 60);
      if (status === "done") progress = 100;
      if (status === "cancelled") progress = 0;
      await updateAppointmentDetails(appointment.id, { progress_percent: progress });

      setAppointments((prev) =>
        prev.map((item) =>
          item.id === appointment.id ? { ...item, status, progress_percent: progress } : item
        )
      );
    } catch {
      // silently fail
    }
    setSavingId(null);
  };

  const saveMetaField = async (
    appointment: Appointment,
    updates: {
      responsible_mechanic?: string | null;
      yard_name?: string | null;
      progress_percent?: number;
    }
  ) => {
    setSavingId(appointment.id);
    try {
      await updateAppointmentDetails(appointment.id, updates);
      setAppointments((prev) =>
        prev.map((item) => (item.id === appointment.id ? { ...item, ...updates } : item))
      );
    } catch {
      // silently fail
    }
    setSavingId(null);
  };

  const startEditing = (appointment: Appointment) => {
    setEditingId(appointment.id);
    setEditForm({
      total_value: appointment.total_value ? String(appointment.total_value) : "",
      admin_notes: appointment.admin_notes || "",
      client_notes: appointment.client_notes || "",
    });
  };

  const saveEditing = async (id: string) => {
    setSavingId(id);
    try {
      const payload = {
        total_value: editForm.total_value ? Number(editForm.total_value) : null,
        admin_notes: editForm.admin_notes || null,
        client_notes: editForm.client_notes || null,
      };
      await updateAppointmentDetails(id, payload);
      setAppointments((prev) => prev.map((item) => (item.id === id ? { ...item, ...payload } : item)));
      setEditingId(null);
    } catch {
      // silently fail
    }
    setSavingId(null);
  };

  const getWhatsAppNotifyLink = (appointment: Appointment) => {
    const statusLabel = STATUS_CONFIG[appointment.status].label;
    const serviceName = appointment.service?.name || "Serviço";
    const progress = appointment.progress_percent ?? 0;

    let msg =
      `Olá ${appointment.customer_name}! Atualização da TZM Multi Service:\n\n` +
      `Serviço: ${serviceName}\n` +
      `Status: ${STATUS_CONFIG[appointment.status].emoji} ${statusLabel}\n` +
      `Progresso: ${progress}%\n`;

    if (appointment.total_value) msg += `Valor: ${formatCurrency(appointment.total_value)}\n`;
    if (appointment.client_notes) msg += `\nObs: ${appointment.client_notes}\n`;

    msg += `\nAcompanhe: ${typeof window !== "undefined" ? window.location.origin : ""}/acompanhar/${appointment.tracking_id}`;
    return getWhatsAppLink(appointment.customer_phone, msg);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="animate-spin w-10 h-10 border-4 border-primary-orange border-t-transparent rounded-full" />
      </div>
    );
  }

  return (
    <main className="max-w-[1800px] mx-auto px-4 sm:px-6 py-8">
      <section className="relative overflow-hidden rounded-2xl border border-dark-border-light bg-black/25 p-6 sm:p-8 mb-6">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_8%_12%,_rgba(230,92,0,0.2),_transparent_48%)]" />
        <div className="relative flex flex-col xl:flex-row xl:items-end xl:justify-between gap-4">
          <div>
            <p className="text-primary-gold text-xs font-semibold tracking-widest uppercase mb-2">CRM da oficina</p>
            <h2 className="text-3xl font-black text-white">Kanban de Serviços</h2>
            <p className="text-gray-300 text-sm mt-1">
              Fluxo operacional por etapa, responsável, pátio e progresso técnico.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            <select
              value={selectedYard}
              onChange={(e) => setSelectedYard(e.target.value)}
              className="input-dark text-sm !py-2 min-w-44"
              title="Filtro por pátio"
              aria-label="Filtro por pátio"
            >
              <option value="all">Todos os pátios</option>
              {yardOptions.map((yard) => (
                <option key={yard} value={yard}>
                  {yard}
                </option>
              ))}
            </select>

            <input
              value={searchMechanic}
              onChange={(e) => setSearchMechanic(e.target.value)}
              placeholder="Filtrar por mecânico"
              className="input-dark text-sm !py-2 min-w-52"
              title="Filtro por mecânico"
              aria-label="Filtro por mecânico"
            />
          </div>
        </div>
      </section>

      <div className="flex flex-col xl:flex-row xl:items-end xl:justify-between gap-4 mb-6">
        <div>
          <h3 className="text-lg font-semibold text-white">Visão por Etapa</h3>
          <p className="text-gray-400 text-sm mt-1">
            Arraste o trabalho com botões de etapa e mantenha o time alinhado.
          </p>
        </div>

        <span className="text-xs text-gray-500 uppercase tracking-wider">Atualização em tempo real</span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 2xl:grid-cols-5 gap-4">
        {KANBAN_COLUMNS.map((status) => {
          const config = STATUS_CONFIG[status];
          const statusClass = STATUS_CLASS[status];
          const cards = grouped[status];

          return (
            <section key={status} className="glass-card rounded-2xl p-3 md:p-4">
              <header className="flex items-center justify-between mb-3 pb-2 border-b border-dark-border">
                <h3 className={`text-sm font-semibold ${statusClass.text}`}>
                  {config.emoji} {config.label}
                </h3>
                <span className="text-xs text-gray-400">{cards.length}</span>
              </header>

              <div className="space-y-3 max-h-[76vh] overflow-y-auto pr-1">
                {cards.map((appointment) => {
                  const isEditing = editingId === appointment.id;
                  const progress = appointment.progress_percent ?? 0;
                  const nextStatus = getNextStatus(appointment.status);
                  const previousStatus = getPreviousStatus(appointment.status);

                  return (
                    <article key={appointment.id} className="bg-dark-card/85 rounded-xl border border-dark-border p-3">
                      <div className="flex items-start justify-between gap-2 mb-2">
                        <div>
                          <h4 className="font-semibold text-white text-sm">{appointment.customer_name}</h4>
                          <p className="text-xs text-gray-500">
                            {appointment.car_brand} {appointment.car_model} {appointment.car_year}
                          </p>
                        </div>
                        {appointment.total_value ? (
                          <span className="text-xs font-semibold text-primary-gold">
                            {formatCurrency(appointment.total_value)}
                          </span>
                        ) : null}
                      </div>

                      <p className="text-xs text-gray-400 mb-1">{appointment.service?.name || "Serviço"}</p>
                      <p className="text-xs text-gray-500 mb-3">
                        {formatDate(appointment.appointment_date)} • {appointment.time_slot}
                      </p>

                      <div className="space-y-2 mb-3">
                        <label className="block text-[11px] text-gray-500">Mecânico responsável</label>
                        <input
                          value={appointment.responsible_mechanic || ""}
                          onChange={(e) =>
                            setAppointments((prev) =>
                              prev.map((item) =>
                                item.id === appointment.id
                                  ? { ...item, responsible_mechanic: e.target.value }
                                  : item
                              )
                            )
                          }
                          onBlur={(e) =>
                            saveMetaField(appointment, {
                              responsible_mechanic: e.target.value || null,
                            })
                          }
                          placeholder="Ex: João Silva"
                          className="input-dark !py-2 text-xs"
                          title="Mecânico responsável"
                          aria-label="Mecânico responsável"
                        />

                        <label className="block text-[11px] text-gray-500">Pátio</label>
                        <input
                          value={appointment.yard_name || "Pátio Principal"}
                          onChange={(e) =>
                            setAppointments((prev) =>
                              prev.map((item) =>
                                item.id === appointment.id
                                  ? { ...item, yard_name: e.target.value }
                                  : item
                              )
                            )
                          }
                          onBlur={(e) =>
                            saveMetaField(appointment, {
                              yard_name: e.target.value || "Pátio Principal",
                            })
                          }
                          className="input-dark !py-2 text-xs"
                          title="Pátio"
                          placeholder="Ex: Pátio Principal"
                          aria-label="Pátio"
                        />

                        <div>
                          <div className="flex items-center justify-between text-[11px] text-gray-500 mb-1">
                            <span>Progresso do serviço</span>
                            <span>{progress}%</span>
                          </div>
                          <input
                            type="range"
                            min={0}
                            max={100}
                            step={5}
                            value={progress}
                            onChange={(e) => {
                              const value = Number(e.target.value);
                              setAppointments((prev) =>
                                prev.map((item) =>
                                  item.id === appointment.id ? { ...item, progress_percent: value } : item
                                )
                              );
                            }}
                            onMouseUp={(e) =>
                              saveMetaField(appointment, {
                                progress_percent: Number((e.target as HTMLInputElement).value),
                              })
                            }
                            onTouchEnd={(e) =>
                              saveMetaField(appointment, {
                                progress_percent: Number((e.target as HTMLInputElement).value),
                              })
                            }
                            className="w-full accent-primary-orange"
                            title="Progresso do serviço"
                            aria-label="Progresso do serviço"
                          />
                        </div>
                      </div>

                      <div className="flex flex-wrap gap-2 mb-2">
                        <button
                          onClick={() => setEditingId(isEditing ? null : appointment.id)}
                          className="text-[11px] bg-white/5 text-gray-300 hover:bg-white/10 border border-dark-border-light px-2.5 py-1.5 rounded-lg"
                        >
                          {isEditing ? "Fechar edição" : "Editar notas/valor"}
                        </button>
                        <a
                          href={getWhatsAppNotifyLink(appointment)}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-[11px] bg-green-500/15 text-green-400 hover:bg-green-500/25 border border-green-500/20 px-2.5 py-1.5 rounded-lg"
                        >
                          WhatsApp
                        </a>
                      </div>

                      {isEditing ? (
                        <div className="space-y-2 p-2 bg-black/20 rounded-lg border border-dark-border mb-2">
                          <input
                            type="number"
                            value={editForm.total_value}
                            onChange={(e) => setEditForm((prev) => ({ ...prev, total_value: e.target.value }))}
                            placeholder="Valor final"
                            className="input-dark !py-2 text-xs"
                            title="Valor final"
                            aria-label="Valor final"
                          />
                          <textarea
                            rows={2}
                            value={editForm.admin_notes}
                            onChange={(e) => setEditForm((prev) => ({ ...prev, admin_notes: e.target.value }))}
                            placeholder="Notas internas"
                            className="input-dark !py-2 text-xs resize-none"
                            title="Notas internas"
                            aria-label="Notas internas"
                          />
                          <textarea
                            rows={2}
                            value={editForm.client_notes}
                            onChange={(e) => setEditForm((prev) => ({ ...prev, client_notes: e.target.value }))}
                            placeholder="Notas visíveis para o cliente"
                            className="input-dark !py-2 text-xs resize-none"
                            title="Notas para o cliente"
                            aria-label="Notas para o cliente"
                          />
                          <button
                            onClick={() => saveEditing(appointment.id)}
                            className="w-full text-xs bg-green-500 hover:bg-green-600 text-white py-2 rounded-lg"
                          >
                            Salvar edição
                          </button>
                        </div>
                      ) : null}

                      <div className="flex items-center gap-2 mt-2">
                        <button
                          disabled={!previousStatus || savingId === appointment.id}
                          onClick={() => previousStatus && applyStatus(appointment, previousStatus)}
                          className="flex-1 text-[11px] bg-white/5 text-gray-300 disabled:opacity-40 hover:bg-white/10 border border-dark-border-light py-1.5 rounded-lg"
                        >
                          Voltar etapa
                        </button>
                        <button
                          disabled={!nextStatus || savingId === appointment.id}
                          onClick={() => nextStatus && applyStatus(appointment, nextStatus)}
                          className={`flex-1 text-[11px] text-white py-1.5 rounded-lg disabled:opacity-40 ${statusClass.button}`}
                        >
                          Avançar etapa
                        </button>
                      </div>
                    </article>
                  );
                })}

                {cards.length === 0 ? (
                  <div className="text-center py-8 text-xs text-gray-500 border border-dashed border-dark-border rounded-lg">
                    Nenhum card nesta etapa.
                  </div>
                ) : null}
              </div>
            </section>
          );
        })}
      </div>
    </main>
  );
}
