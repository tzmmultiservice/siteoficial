"use client";

import { COMPANY, STATUS_CONFIG } from "@/lib/constants";
import { formatCurrency } from "@/lib/utils";

type AppointmentStatus = "pending" | "confirmed" | "in_progress" | "done" | "cancelled";

interface TrackingData {
  tracking_id: string;
  customer_name: string;
  car_brand: string;
  car_model: string;
  car_year: number;
  service_name: string;
  appointment_date: string;
  time_slot: string;
  status: AppointmentStatus;
  total_value: number | null;
  client_notes: string | null;
}

// Mock data for static demo — will be replaced with Supabase query
const MOCK_APPOINTMENT: TrackingData = {
  tracking_id: "demo",
  customer_name: "Cliente Exemplo",
  car_brand: "Chevrolet",
  car_model: "Onix",
  car_year: 2022,
  service_name: "Revisão Completa",
  appointment_date: "2026-04-22",
  time_slot: "10:00",
  status: "pending",
  total_value: null,
  client_notes: null,
};

const TIMELINE_STEPS = [
  { status: "pending", label: "Agendado" },
  { status: "confirmed", label: "Confirmado" },
  { status: "in_progress", label: "Em Atendimento" },
  { status: "done", label: "Pronto" },
];

function getStepIndex(status: string): number {
  const idx = TIMELINE_STEPS.findIndex((s) => s.status === status);
  return idx >= 0 ? idx : 0;
}

export default function TrackingClient({ id }: { id: string }) {
  // In production: fetch appointment by tracking_id from Supabase + Realtime subscription
  const appointment = MOCK_APPOINTMENT;
  const currentStep = getStepIndex(appointment.status);
  const isDone = appointment.status === "done";
  const isCancelled = appointment.status === "cancelled";

  return (
    <>
      <section className="bg-dark-bg py-12">
        <div className="max-w-3xl mx-auto px-4 text-center">
          <h1 className="text-3xl sm:text-4xl font-bold text-white mb-2">
            Acompanhar <span className="gradient-text">Serviço</span>
          </h1>
          <p className="text-gray-400">Acompanhe o status do seu serviço em tempo real.</p>
        </div>
      </section>

      <section className="py-12 bg-surface">
        <div className="max-w-2xl mx-auto px-4">
          {isDone && (
            <div className="bg-green-500 text-white rounded-xl p-6 mb-6 text-center animate-pulse">
              <div className="text-4xl mb-2">✅</div>
              <h2 className="text-2xl font-bold mb-1">SEU VEÍCULO ESTÁ PRONTO!</h2>
              <p className="text-green-100">
                Pode retirar na oficina. {appointment.total_value && `Valor: ${formatCurrency(appointment.total_value)}`}
              </p>
            </div>
          )}

          {isCancelled && (
            <div className="bg-red-500 text-white rounded-xl p-6 mb-6 text-center">
              <div className="text-4xl mb-2">❌</div>
              <h2 className="text-2xl font-bold mb-1">Agendamento Cancelado</h2>
              <p className="text-red-100">Entre em contato para remarcar.</p>
            </div>
          )}

          {!isCancelled && (
            <div className="bg-white rounded-xl p-6 sm:p-8 shadow-sm mb-6">
              <h3 className="font-bold text-dark text-lg mb-6">Status do Serviço</h3>
              <div className="space-y-0">
                {TIMELINE_STEPS.map((step, i) => {
                  const isActive = i <= currentStep;
                  const isCurrent = i === currentStep;
                  const config = STATUS_CONFIG[step.status];
                  return (
                    <div key={step.status} className="flex items-start gap-4">
                      <div className="flex flex-col items-center">
                        <div
                          className={`w-10 h-10 rounded-full flex items-center justify-center text-lg shrink-0 ${
                            isCurrent
                              ? "gradient-brand text-white ring-4 ring-orange-200"
                              : isActive
                              ? "bg-green-500 text-white"
                              : "bg-gray-200 text-gray-400"
                          }`}
                        >
                          {isActive && !isCurrent ? "✓" : config.emoji}
                        </div>
                        {i < TIMELINE_STEPS.length - 1 && (
                          <div className={`w-0.5 h-12 ${i < currentStep ? "bg-green-500" : "bg-gray-200"}`} />
                        )}
                      </div>
                      <div className="pt-2 pb-6">
                        <p className={`font-semibold ${isCurrent ? "text-primary-orange" : isActive ? "text-dark" : "text-gray-400"}`}>
                          {step.label}
                        </p>
                        {isCurrent && (
                          <p className="text-sm text-gray-500 mt-1">
                            {step.status === "pending" && "Aguardando confirmação da oficina"}
                            {step.status === "confirmed" && "A oficina confirmou seu agendamento"}
                            {step.status === "in_progress" && "Seu veículo está sendo atendido"}
                            {step.status === "done" && "Serviço concluído com sucesso"}
                          </p>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          <div className="bg-white rounded-xl p-6 sm:p-8 shadow-sm mb-6">
            <h3 className="font-bold text-dark text-lg mb-4">Detalhes do Agendamento</h3>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-gray-500">Veículo</p>
                <p className="font-medium text-dark">{appointment.car_brand} {appointment.car_model} {appointment.car_year}</p>
              </div>
              <div>
                <p className="text-gray-500">Serviço</p>
                <p className="font-medium text-dark">{appointment.service_name}</p>
              </div>
              <div>
                <p className="text-gray-500">Data</p>
                <p className="font-medium text-dark">
                  {new Date(appointment.appointment_date + "T12:00:00").toLocaleDateString("pt-BR", {
                    weekday: "short",
                    day: "2-digit",
                    month: "short",
                    year: "numeric",
                  })}
                </p>
              </div>
              <div>
                <p className="text-gray-500">Horário</p>
                <p className="font-medium text-dark">{appointment.time_slot}</p>
              </div>
              {appointment.total_value && (
                <div className="col-span-2">
                  <p className="text-gray-500">Valor do Serviço</p>
                  <p className="font-bold text-primary-orange text-lg">{formatCurrency(appointment.total_value)}</p>
                </div>
              )}
            </div>
          </div>

          {appointment.client_notes && (
            <div className="bg-white rounded-xl p-6 sm:p-8 shadow-sm mb-6">
              <h3 className="font-bold text-dark text-lg mb-3">Observações do Mecânico</h3>
              <p className="text-gray-600 whitespace-pre-line">{appointment.client_notes}</p>
            </div>
          )}

          <div className="text-center">
            <a
              href={COMPANY.whatsappLink}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-primary !bg-green-500 hover:!bg-green-600 inline-flex"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
              </svg>
              Falar com a Oficina
            </a>
          </div>
        </div>
      </section>
    </>
  );
}
