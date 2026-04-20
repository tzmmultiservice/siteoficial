"use client";

import { useEffect, useState } from "react";
import { COMPANY, STATUS_CONFIG } from "@/lib/constants";
import { formatCurrency } from "@/lib/utils";
import { fetchAppointmentByTracking, subscribeToAppointment } from "@/lib/api";
import type { Appointment } from "@/lib/types";

const TIMELINE_STEPS = [
  { status: "pending", label: "Agendado" },
  { status: "confirmed", label: "Confirmado" },
  { status: "in_progress", label: "Em atendimento" },
  { status: "done", label: "Pronto" },
];

function getStepIndex(status: string): number {
  const idx = TIMELINE_STEPS.findIndex((s) => s.status === status);
  return idx >= 0 ? idx : 0;
}

export default function TrackingClient({ id }: { id: string }) {
  const [appointment, setAppointment] = useState<Appointment | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    fetchAppointmentByTracking(id)
      .then((data) => {
        if (!data) setNotFound(true);
        else setAppointment(data);
      })
      .catch(() => setNotFound(true))
      .finally(() => setLoading(false));
  }, [id]);

  useEffect(() => {
    if (!id || id === "demo") return;
    const channel = subscribeToAppointment(id, (updated) => {
      setAppointment(updated);
    });
    return () => {
      channel.unsubscribe();
    };
  }, [id]);

  if (loading) {
    return (
      <section className="py-32 text-center bg-dark-bg min-h-[70vh]">
        <div className="animate-spin w-10 h-10 border-4 border-primary-orange border-t-transparent rounded-full mx-auto mb-4" />
        <p className="text-gray-300">Carregando andamento do serviço...</p>
      </section>
    );
  }

  if (notFound || !appointment) {
    return (
      <section className="py-32 text-center bg-dark-bg min-h-[70vh]">
        <h1 className="text-3xl font-bold text-white mb-3">Agendamento não encontrado</h1>
        <p className="text-gray-300 mb-8">Confira o código informado e tente novamente.</p>
        <a href={COMPANY.whatsappLink} target="_blank" rel="noopener noreferrer" className="btn-primary !bg-green-500">
          Falar no WhatsApp
        </a>
      </section>
    );
  }

  const currentStep = getStepIndex(appointment.status);
  const isDone = appointment.status === "done";
  const isCancelled = appointment.status === "cancelled";
  const serviceName = appointment.service?.name || "Serviço";

  return (
    <>
      <section className="pt-32 pb-8 relative bg-dark-bg">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_rgba(230,92,0,0.12)_0%,_transparent_60%)]" />
        <div className="relative max-w-4xl mx-auto px-4 text-center">
          <h1 className="text-3xl sm:text-4xl font-bold text-white mb-2">
            Acompanhar <span className="gradient-text">Serviço</span>
          </h1>
          <p className="text-gray-300">Atualização em tempo real do status do seu veículo.</p>
        </div>
      </section>

      <section className="py-10 bg-dark-bg">
        <div className="max-w-3xl mx-auto px-4">
          {isDone && (
            <div className="bg-green-500/10 border border-green-500/35 rounded-2xl p-6 mb-6 text-center">
              <h2 className="text-2xl font-bold text-white mb-1">Serviço concluído</h2>
              <p className="text-green-300">
                Veículo pronto para retirada. {appointment.total_value ? `Valor final: ${formatCurrency(appointment.total_value)}` : ""}
              </p>
            </div>
          )}

          {isCancelled && (
            <div className="bg-red-500/10 border border-red-500/35 rounded-2xl p-6 mb-6 text-center">
              <h2 className="text-2xl font-bold text-white mb-1">Agendamento cancelado</h2>
              <p className="text-red-300">Fale com a oficina para reagendar.</p>
            </div>
          )}

          {!isCancelled && (
            <div className="glass-card rounded-2xl p-6 sm:p-8 mb-6 border border-dark-border-light">
              <h3 className="font-bold text-white text-xl mb-6">Linha do tempo</h3>
              <div className="space-y-0">
                {TIMELINE_STEPS.map((step, i) => {
                  const isActive = i <= currentStep;
                  const isCurrent = i === currentStep;
                  const config = STATUS_CONFIG[step.status];
                  return (
                    <div key={step.status} className="flex items-start gap-4">
                      <div className="flex flex-col items-center">
                        <div
                          className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold shrink-0 ${
                            isCurrent
                              ? "gradient-brand text-white ring-4 ring-primary-orange/20"
                              : isActive
                              ? "bg-green-500/20 text-green-300 border border-green-500/40"
                              : "bg-dark-card text-gray-500 border border-dark-border-light"
                          }`}
                        >
                          {isActive && !isCurrent ? "OK" : config.emoji}
                        </div>
                        {i < TIMELINE_STEPS.length - 1 && (
                          <div className={`w-0.5 h-12 ${i < currentStep ? "bg-green-500/30" : "bg-dark-border"}`} />
                        )}
                      </div>
                      <div className="pt-2 pb-6">
                        <p className={`${isCurrent ? "text-primary-gold" : "text-white"} font-semibold`}>{step.label}</p>
                        {isCurrent && (
                          <p className="text-sm text-gray-300 mt-1">
                            {step.status === "pending" && "Aguardando validação da oficina."}
                            {step.status === "confirmed" && "Horário confirmado no nosso painel interno."}
                            {step.status === "in_progress" && "Execução técnica em andamento pela equipe."}
                            {step.status === "done" && "Serviço finalizado e liberado para retirada."}
                          </p>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          <div className="glass-card rounded-2xl p-6 sm:p-8 mb-6 border border-dark-border-light">
            <h3 className="font-bold text-white text-xl mb-4">Dados do atendimento</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-gray-400">Veículo</p>
                <p className="font-semibold text-white">{appointment.car_brand} {appointment.car_model} {appointment.car_year}</p>
              </div>
              <div>
                <p className="text-gray-400">Serviço</p>
                <p className="font-semibold text-white">{serviceName}</p>
              </div>
              <div>
                <p className="text-gray-400">Data</p>
                <p className="font-semibold text-white">
                  {new Date(appointment.appointment_date + "T12:00:00").toLocaleDateString("pt-BR", {
                    weekday: "short",
                    day: "2-digit",
                    month: "short",
                    year: "numeric",
                  })}
                </p>
              </div>
              <div>
                <p className="text-gray-400">Horário</p>
                <p className="font-semibold text-white">{appointment.time_slot}</p>
              </div>
              {appointment.total_value ? (
                <div className="sm:col-span-2">
                  <p className="text-gray-400">Valor do serviço</p>
                  <p className="font-bold text-primary-gold text-xl">{formatCurrency(appointment.total_value)}</p>
                </div>
              ) : null}
            </div>
          </div>

          {appointment.client_notes ? (
            <div className="glass-card rounded-2xl p-6 sm:p-8 mb-6 border border-dark-border-light">
              <h3 className="font-bold text-white text-xl mb-3">Observações da equipe</h3>
              <p className="text-gray-200 whitespace-pre-line leading-relaxed">{appointment.client_notes}</p>
            </div>
          ) : null}

          <div className="text-center">
            <a
              href={COMPANY.whatsappLink}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-primary !bg-green-500 hover:!shadow-[0_0_30px_rgba(34,197,94,0.3)] inline-flex"
            >
              Falar com a oficina
            </a>
          </div>
        </div>
      </section>
    </>
  );
}
