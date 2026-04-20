"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  PLACEHOLDER_SERVICES,
  CAR_BRANDS,
  TIME_SLOTS_WEEKDAY,
  TIME_SLOTS_SATURDAY,
  COMPANY,
} from "@/lib/constants";
import { formatCurrency, isSaturday, isSunday } from "@/lib/utils";
import { fetchServices, createAppointment, fetchBookedSlots } from "@/lib/api";
import type { BookingFormData, Service } from "@/lib/types";

const STEPS = ["Seus Dados", "Seu Veículo", "Serviço", "Data e Horário", "Confirmação"];

function getMinDate(): string {
  const d = new Date();
  d.setDate(d.getDate() + 1);
  return d.toISOString().split("T")[0];
}

export default function AgendarPage() {
  const [step, setStep] = useState(0);
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [trackingId, setTrackingId] = useState("");
  const [services, setServices] = useState<Service[]>([]);
  const [bookedSlots, setBookedSlots] = useState<string[]>([]);
  const [form, setForm] = useState<BookingFormData>({
    customer_name: "",
    customer_phone: "",
    customer_email: "",
    car_brand: "",
    car_model: "",
    car_year: "",
    car_plate: "",
    service_id: "",
    appointment_date: "",
    time_slot: "",
  });

  useEffect(() => {
    fetchServices().then(setServices).catch(() => {});
  }, []);

  useEffect(() => {
    if (form.appointment_date) {
      fetchBookedSlots(form.appointment_date).then(setBookedSlots).catch(() => setBookedSlots([]));
    }
  }, [form.appointment_date]);

  const displayServices = services.length > 0
    ? services
    : PLACEHOLDER_SERVICES.map((s, i) => ({ ...s, id: String(i), created_at: "" }));

  const update = (field: keyof BookingFormData, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const selectedService = displayServices.find((s) => s.id === form.service_id);

  const timeSlots = form.appointment_date
    ? isSaturday(form.appointment_date) ? TIME_SLOTS_SATURDAY : TIME_SLOTS_WEEKDAY
    : [];

  const canNext = (): boolean => {
    switch (step) {
      case 0: return form.customer_name.trim().length >= 3 && form.customer_phone.replace(/\D/g, "").length >= 10;
      case 1: return form.car_brand !== "" && form.car_model.trim().length >= 2 && form.car_year.length === 4;
      case 2: return form.service_id !== "";
      case 3: return form.appointment_date !== "" && form.time_slot !== "";
      default: return false;
    }
  };

  const handleSubmit = async () => {
    setSubmitting(true);
    setError("");
    try {
      const appointment = await createAppointment(form);
      setTrackingId(appointment.tracking_id);
      setSubmitted(true);
    } catch (err: unknown) {
      if (err instanceof Error && err.message === "SLOT_TAKEN") {
        setError("Este horário já foi reservado. Por favor, escolha outro.");
        setStep(3);
      } else {
        setError("Erro ao agendar. Tente novamente ou entre em contato pelo WhatsApp.");
      }
    } finally {
      setSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <section className="pt-28 pb-20">
        <div className="max-w-lg mx-auto px-4 text-center">
          <div className="w-20 h-20 rounded-full bg-green-500/15 flex items-center justify-center mx-auto mb-6 ring-1 ring-green-500/30">
            <svg className="w-10 h-10 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h1 className="text-3xl font-bold text-white mb-4">Agendamento Enviado!</h1>
          <p className="text-gray-500 mb-6">
            Seu agendamento foi recebido. Entraremos em contato pelo WhatsApp para confirmar.
          </p>
          <div className="glass-card rounded-2xl p-6 text-left mb-8">
            <h3 className="font-semibold text-white mb-3">Resumo:</h3>
            <ul className="space-y-2 text-sm text-gray-400">
              <li><span className="font-medium text-gray-300">Nome:</span> {form.customer_name}</li>
              <li><span className="font-medium text-gray-300">WhatsApp:</span> {form.customer_phone}</li>
              <li><span className="font-medium text-gray-300">Veículo:</span> {form.car_brand} {form.car_model} {form.car_year}</li>
              <li><span className="font-medium text-gray-300">Serviço:</span> {selectedService?.name}</li>
              <li><span className="font-medium text-gray-300">Data:</span> {new Date(form.appointment_date + "T12:00:00").toLocaleDateString("pt-BR", { weekday: "long", day: "2-digit", month: "long", year: "numeric" })}</li>
              <li><span className="font-medium text-gray-300">Horário:</span> {form.time_slot}</li>
            </ul>
          </div>
          {trackingId && (
            <div className="glass-card rounded-2xl p-5 mb-6 border-primary-orange/20">
              <p className="text-sm font-medium text-gray-400 mb-1">Acompanhe seu serviço:</p>
              <Link href={`/acompanhar/${trackingId}`} className="text-primary-gold font-bold hover:text-primary-orange transition-colors">
                Abrir página de acompanhamento →
              </Link>
            </div>
          )}
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link href="/" className="btn-secondary text-sm">Voltar ao Início</Link>
            <a href={COMPANY.whatsappLink} target="_blank" rel="noopener noreferrer" className="btn-primary text-sm !bg-green-500 hover:!shadow-[0_0_30px_rgba(34,197,94,0.3)]">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" /></svg>
              Falar no WhatsApp
            </a>
          </div>
        </div>
      </section>
    );
  }

  return (
    <>
      <section className="pt-32 pb-8 relative">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_rgba(230,92,0,0.06)_0%,_transparent_60%)]" />
        <div className="relative max-w-3xl mx-auto px-4 text-center">
          <h1 className="text-3xl sm:text-4xl font-bold text-white mb-2">
            Agendar <span className="gradient-text">Serviço</span>
          </h1>
          <p className="text-gray-500">Preencha os dados abaixo para agendar seu serviço.</p>
        </div>
      </section>

      <section className="py-10">
        <div className="max-w-2xl mx-auto px-4">
          {/* Stepper */}
          <div className="flex items-center justify-between mb-10">
            {STEPS.map((label, i) => (
              <div key={label} className="flex items-center">
                <div className="flex flex-col items-center">
                  <div className={`w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold transition-all duration-300 ${
                    i <= step ? "gradient-brand text-white shadow-[0_0_15px_rgba(230,92,0,0.3)]" : "bg-dark-card border border-dark-border-light text-gray-600"
                  }`}>
                    {i < step ? (
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>
                    ) : (i + 1)}
                  </div>
                  <span className="text-xs mt-1.5 text-gray-600 hidden sm:block">{label}</span>
                </div>
                {i < STEPS.length - 1 && (
                  <div className={`w-8 sm:w-16 h-0.5 mx-1 transition-colors duration-300 ${i < step ? "bg-primary-orange" : "bg-dark-border"}`} />
                )}
              </div>
            ))}
          </div>

          {/* Form Card */}
          <div className="glass-card rounded-2xl p-6 sm:p-8">
            {step === 0 && (
              <div className="space-y-5">
                <h2 className="text-xl font-bold text-white mb-4">Seus Dados</h2>
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-1.5">Nome Completo *</label>
                  <input type="text" value={form.customer_name} onChange={(e) => update("customer_name", e.target.value)} placeholder="Seu nome completo" className="input-dark" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-1.5">WhatsApp *</label>
                  <input type="tel" value={form.customer_phone} onChange={(e) => update("customer_phone", e.target.value)} placeholder="(74) 99999-9999" className="input-dark" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-1.5">Email <span className="text-gray-600">(opcional)</span></label>
                  <input type="email" value={form.customer_email} onChange={(e) => update("customer_email", e.target.value)} placeholder="seu@email.com" className="input-dark" />
                </div>
              </div>
            )}

            {step === 1 && (
              <div className="space-y-5">
                <h2 className="text-xl font-bold text-white mb-4">Seu Veículo</h2>
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-1.5">Marca *</label>
                  <select value={form.car_brand} onChange={(e) => update("car_brand", e.target.value)} className="input-dark">
                    <option value="">Selecione a marca</option>
                    {CAR_BRANDS.map((brand) => (<option key={brand} value={brand}>{brand}</option>))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-1.5">Modelo *</label>
                  <input type="text" value={form.car_model} onChange={(e) => update("car_model", e.target.value)} placeholder="Ex: Onix, Gol, HB20..." className="input-dark" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-1.5">Ano *</label>
                    <input type="text" value={form.car_year} onChange={(e) => update("car_year", e.target.value.replace(/\D/g, "").slice(0, 4))} placeholder="2024" className="input-dark" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-1.5">Placa <span className="text-gray-600">(opc.)</span></label>
                    <input type="text" value={form.car_plate} onChange={(e) => update("car_plate", e.target.value.toUpperCase().slice(0, 7))} placeholder="ABC1D23" className="input-dark" />
                  </div>
                </div>
              </div>
            )}

            {step === 2 && (
              <div>
                <h2 className="text-xl font-bold text-white mb-4">Escolha o Serviço</h2>
                <div className="space-y-3">
                  {displayServices.map((service) => (
                    <label key={service.id} className={`flex items-center gap-4 p-4 rounded-xl cursor-pointer transition-all duration-300 border ${
                      form.service_id === service.id
                        ? "border-primary-orange/50 bg-primary-orange/5 shadow-[0_0_20px_rgba(230,92,0,0.1)]"
                        : "border-dark-border hover:border-dark-border-light bg-dark-card/50"
                    }`}>
                      <input type="radio" name="service" value={service.id} checked={form.service_id === service.id} onChange={(e) => update("service_id", e.target.value)} className="sr-only" />
                      <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-colors ${
                        form.service_id === service.id ? "border-primary-orange" : "border-gray-600"
                      }`}>
                        {form.service_id === service.id && <div className="w-3 h-3 rounded-full gradient-brand" />}
                      </div>
                      <div className="flex-1">
                        <p className="font-semibold text-white">{service.name}</p>
                        <p className="text-xs text-gray-500">{service.description}</p>
                      </div>
                      <div className="text-right shrink-0">
                        <p className="font-bold text-primary-gold">{formatCurrency(service.price_estimate)}</p>
                        <p className="text-xs text-gray-600">~{service.duration_minutes}min</p>
                      </div>
                    </label>
                  ))}
                </div>
              </div>
            )}

            {step === 3 && (
              <div className="space-y-6">
                <h2 className="text-xl font-bold text-white mb-4">Data e Horário</h2>
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-1.5">Data *</label>
                  <input type="date" value={form.appointment_date} onChange={(e) => { const val = e.target.value; if (val && isSunday(val)) return; update("appointment_date", val); update("time_slot", ""); }} min={getMinDate()} className="input-dark" />
                  <p className="text-xs text-gray-600 mt-1.5">Não atendemos aos domingos.</p>
                </div>
                {form.appointment_date && (
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-2">Horário Disponível *</label>
                    <div className="grid grid-cols-3 sm:grid-cols-5 gap-2">
                      {timeSlots.map((slot) => {
                        const taken = bookedSlots.includes(slot);
                        return (
                          <button key={slot} type="button" disabled={taken} onClick={() => update("time_slot", slot)} className={`py-3 px-2 rounded-xl text-sm font-medium transition-all duration-300 ${
                            taken
                              ? "bg-red-500/10 text-red-400/40 cursor-not-allowed line-through border border-red-500/10"
                              : form.time_slot === slot
                              ? "gradient-brand text-white shadow-[0_0_15px_rgba(230,92,0,0.3)]"
                              : "bg-dark-card border border-dark-border-light text-gray-400 hover:border-primary-orange/30 hover:text-white"
                          }`}>
                            {slot}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            )}

            {step === 4 && (
              <div>
                <h2 className="text-xl font-bold text-white mb-6">Confirme seu Agendamento</h2>
                <div className="space-y-4">
                  {[
                    { title: "DADOS PESSOAIS", lines: [form.customer_name, form.customer_phone, form.customer_email].filter(Boolean) },
                    { title: "VEÍCULO", lines: [`${form.car_brand} ${form.car_model} ${form.car_year}`, form.car_plate ? `Placa: ${form.car_plate}` : ""].filter(Boolean) },
                    { title: "SERVIÇO", lines: [selectedService?.name || "", selectedService ? `A partir de ${formatCurrency(selectedService.price_estimate)}` : ""] },
                    { title: "DATA E HORÁRIO", lines: [form.appointment_date ? new Date(form.appointment_date + "T12:00:00").toLocaleDateString("pt-BR", { weekday: "long", day: "2-digit", month: "long", year: "numeric" }) : "", form.time_slot] },
                  ].map((block) => (
                    <div key={block.title} className="bg-dark-card/80 rounded-xl p-4 border border-dark-border">
                      <h3 className="font-semibold text-xs text-gray-600 mb-2 tracking-wider">{block.title}</h3>
                      {block.lines.map((line, i) => (
                        <p key={i} className={i === 0 ? "text-white font-medium" : "text-gray-400 text-sm"}>{line}</p>
                      ))}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Navigation */}
            <div className="flex justify-between mt-8 pt-6 border-t border-dark-border">
              {step > 0 ? (
                <button onClick={() => setStep(step - 1)} className="text-gray-500 hover:text-white font-medium transition-colors">← Voltar</button>
              ) : (
                <Link href="/" className="text-gray-500 hover:text-white font-medium transition-colors">← Início</Link>
              )}
              {step < 4 ? (
                <button onClick={() => setStep(step + 1)} disabled={!canNext()} className="btn-primary disabled:opacity-30 disabled:cursor-not-allowed disabled:transform-none disabled:shadow-none">Próximo →</button>
              ) : (
                <button onClick={handleSubmit} disabled={submitting} className="btn-primary !bg-green-500 hover:!shadow-[0_0_30px_rgba(34,197,94,0.3)] disabled:opacity-50">
                  {submitting ? "Enviando..." : "✓ Confirmar Agendamento"}
                </button>
              )}
            </div>
            {error && <p className="text-red-400 text-sm mt-3 text-center">{error}</p>}
          </div>
        </div>
      </section>
    </>
  );
}
