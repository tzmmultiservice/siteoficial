"use client";

import { useState } from "react";
import Link from "next/link";
import {
  PLACEHOLDER_SERVICES,
  CAR_BRANDS,
  TIME_SLOTS_WEEKDAY,
  TIME_SLOTS_SATURDAY,
  COMPANY,
} from "@/lib/constants";
import { formatCurrency, isSaturday, isSunday } from "@/lib/utils";
import type { BookingFormData } from "@/lib/types";

const STEPS = ["Seus Dados", "Seu Veículo", "Serviço", "Data e Horário", "Confirmação"];

function getMinDate(): string {
  const d = new Date();
  d.setDate(d.getDate() + 1);
  return d.toISOString().split("T")[0];
}

export default function AgendarPage() {
  const [step, setStep] = useState(0);
  const [submitted, setSubmitted] = useState(false);
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

  const update = (field: keyof BookingFormData, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const selectedService = PLACEHOLDER_SERVICES.find((_, i) => String(i) === form.service_id);

  const timeSlots = form.appointment_date
    ? isSaturday(form.appointment_date)
      ? TIME_SLOTS_SATURDAY
      : TIME_SLOTS_WEEKDAY
    : [];

  const canNext = (): boolean => {
    switch (step) {
      case 0:
        return form.customer_name.trim().length >= 3 && form.customer_phone.replace(/\D/g, "").length >= 10;
      case 1:
        return form.car_brand !== "" && form.car_model.trim().length >= 2 && form.car_year.length === 4;
      case 2:
        return form.service_id !== "";
      case 3:
        return form.appointment_date !== "" && form.time_slot !== "";
      default:
        return false;
    }
  };

  const handleSubmit = () => {
    // In production, this will INSERT into Supabase
    console.log("Agendamento:", form);
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <section className="py-20">
        <div className="max-w-lg mx-auto px-4 text-center">
          <div className="w-20 h-20 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-6">
            <svg className="w-10 h-10 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h1 className="text-3xl font-bold text-dark mb-4">Agendamento Enviado!</h1>
          <p className="text-gray-500 mb-6">
            Seu agendamento foi recebido com sucesso. Entraremos em contato pelo WhatsApp para confirmar.
          </p>
          <div className="bg-surface rounded-xl p-6 text-left mb-8">
            <h3 className="font-semibold text-dark mb-3">Resumo:</h3>
            <ul className="space-y-2 text-sm text-gray-600">
              <li><span className="font-medium text-dark">Nome:</span> {form.customer_name}</li>
              <li><span className="font-medium text-dark">WhatsApp:</span> {form.customer_phone}</li>
              <li><span className="font-medium text-dark">Veículo:</span> {form.car_brand} {form.car_model} {form.car_year}</li>
              <li><span className="font-medium text-dark">Serviço:</span> {selectedService?.name}</li>
              <li><span className="font-medium text-dark">Data:</span> {new Date(form.appointment_date + "T12:00:00").toLocaleDateString("pt-BR", { weekday: "long", day: "2-digit", month: "long", year: "numeric" })}</li>
              <li><span className="font-medium text-dark">Horário:</span> {form.time_slot}</li>
            </ul>
          </div>
          <p className="text-sm text-gray-400 mb-6">
            Você receberá um link para acompanhar o status do seu serviço em tempo real.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link href="/" className="btn-secondary text-sm">
              Voltar ao Início
            </Link>
            <a
              href={`${COMPANY.whatsappLink}`}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-primary text-sm !bg-green-500 hover:!bg-green-600"
            >
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
              </svg>
              Falar no WhatsApp
            </a>
          </div>
        </div>
      </section>
    );
  }

  return (
    <>
      <section className="bg-dark-bg py-12">
        <div className="max-w-3xl mx-auto px-4 text-center">
          <h1 className="text-3xl sm:text-4xl font-bold text-white mb-2">
            Agendar <span className="gradient-text">Serviço</span>
          </h1>
          <p className="text-gray-400">Preencha os dados abaixo para agendar seu serviço.</p>
        </div>
      </section>

      <section className="py-12 bg-surface">
        <div className="max-w-2xl mx-auto px-4">
          {/* Step Indicator */}
          <div className="flex items-center justify-between mb-10">
            {STEPS.map((label, i) => (
              <div key={label} className="flex items-center">
                <div className="flex flex-col items-center">
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-all ${
                      i <= step
                        ? "gradient-brand text-white"
                        : "bg-gray-200 text-gray-400"
                    }`}
                  >
                    {i < step ? (
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                      </svg>
                    ) : (
                      i + 1
                    )}
                  </div>
                  <span className="text-xs mt-1 text-gray-500 hidden sm:block">{label}</span>
                </div>
                {i < STEPS.length - 1 && (
                  <div
                    className={`w-8 sm:w-16 h-0.5 mx-1 ${
                      i < step ? "bg-primary-orange" : "bg-gray-200"
                    }`}
                  />
                )}
              </div>
            ))}
          </div>

          <div className="bg-white rounded-xl p-6 sm:p-8 shadow-sm">
            {/* Step 0: Dados pessoais */}
            {step === 0 && (
              <div className="space-y-4">
                <h2 className="text-xl font-bold text-dark mb-4">Seus Dados</h2>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Nome Completo *
                  </label>
                  <input
                    type="text"
                    value={form.customer_name}
                    onChange={(e) => update("customer_name", e.target.value)}
                    placeholder="Seu nome completo"
                    className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-primary-orange focus:border-transparent outline-none transition-all"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    WhatsApp *
                  </label>
                  <input
                    type="tel"
                    value={form.customer_phone}
                    onChange={(e) => update("customer_phone", e.target.value)}
                    placeholder="(74) 99999-9999"
                    className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-primary-orange focus:border-transparent outline-none transition-all"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Email <span className="text-gray-400">(opcional)</span>
                  </label>
                  <input
                    type="email"
                    value={form.customer_email}
                    onChange={(e) => update("customer_email", e.target.value)}
                    placeholder="seu@email.com"
                    className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-primary-orange focus:border-transparent outline-none transition-all"
                  />
                </div>
              </div>
            )}

            {/* Step 1: Dados do veículo */}
            {step === 1 && (
              <div className="space-y-4">
                <h2 className="text-xl font-bold text-dark mb-4">Seu Veículo</h2>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Marca *
                  </label>
                  <select
                    value={form.car_brand}
                    onChange={(e) => update("car_brand", e.target.value)}
                    className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-primary-orange focus:border-transparent outline-none transition-all bg-white"
                  >
                    <option value="">Selecione a marca</option>
                    {CAR_BRANDS.map((brand) => (
                      <option key={brand} value={brand}>{brand}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Modelo *
                  </label>
                  <input
                    type="text"
                    value={form.car_model}
                    onChange={(e) => update("car_model", e.target.value)}
                    placeholder="Ex: Onix, Gol, HB20..."
                    className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-primary-orange focus:border-transparent outline-none transition-all"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Ano *
                    </label>
                    <input
                      type="number"
                      value={form.car_year}
                      onChange={(e) => update("car_year", e.target.value.slice(0, 4))}
                      placeholder="2020"
                      min="1990"
                      max={new Date().getFullYear() + 1}
                      className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-primary-orange focus:border-transparent outline-none transition-all"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Placa <span className="text-gray-400">(opc.)</span>
                    </label>
                    <input
                      type="text"
                      value={form.car_plate}
                      onChange={(e) => update("car_plate", e.target.value.toUpperCase().slice(0, 7))}
                      placeholder="ABC1D23"
                      className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-primary-orange focus:border-transparent outline-none transition-all"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Step 2: Escolha do serviço */}
            {step === 2 && (
              <div>
                <h2 className="text-xl font-bold text-dark mb-4">Escolha o Serviço</h2>
                <div className="space-y-3">
                  {PLACEHOLDER_SERVICES.map((service, i) => (
                    <label
                      key={service.name}
                      className={`flex items-center gap-4 p-4 rounded-lg border-2 cursor-pointer transition-all ${
                        form.service_id === String(i)
                          ? "border-primary-orange bg-orange-50"
                          : "border-gray-200 hover:border-gray-300"
                      }`}
                    >
                      <input
                        type="radio"
                        name="service"
                        value={String(i)}
                        checked={form.service_id === String(i)}
                        onChange={(e) => update("service_id", e.target.value)}
                        className="sr-only"
                      />
                      <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                        form.service_id === String(i) ? "border-primary-orange" : "border-gray-300"
                      }`}>
                        {form.service_id === String(i) && (
                          <div className="w-3 h-3 rounded-full gradient-brand" />
                        )}
                      </div>
                      <div className="flex-1">
                        <p className="font-semibold text-dark">{service.name}</p>
                        <p className="text-xs text-gray-500">{service.description}</p>
                      </div>
                      <div className="text-right shrink-0">
                        <p className="font-bold text-primary-orange">{formatCurrency(service.price_estimate)}</p>
                        <p className="text-xs text-gray-400">~{service.duration_minutes}min</p>
                      </div>
                    </label>
                  ))}
                </div>
              </div>
            )}

            {/* Step 3: Data e horário */}
            {step === 3 && (
              <div className="space-y-6">
                <h2 className="text-xl font-bold text-dark mb-4">Data e Horário</h2>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Data *
                  </label>
                  <input
                    type="date"
                    value={form.appointment_date}
                    onChange={(e) => {
                      const val = e.target.value;
                      if (val && isSunday(val)) return;
                      update("appointment_date", val);
                      update("time_slot", "");
                    }}
                    min={getMinDate()}
                    className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-primary-orange focus:border-transparent outline-none transition-all"
                  />
                  <p className="text-xs text-gray-400 mt-1">Não atendemos aos domingos.</p>
                </div>

                {form.appointment_date && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Horário Disponível *
                    </label>
                    <div className="grid grid-cols-3 sm:grid-cols-5 gap-2">
                      {timeSlots.map((slot) => (
                        <button
                          key={slot}
                          type="button"
                          onClick={() => update("time_slot", slot)}
                          className={`py-3 px-2 rounded-lg text-sm font-medium transition-all ${
                            form.time_slot === slot
                              ? "gradient-brand text-white"
                              : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                          }`}
                        >
                          {slot}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Step 4: Confirmação */}
            {step === 4 && (
              <div>
                <h2 className="text-xl font-bold text-dark mb-6">Confirme seu Agendamento</h2>
                <div className="space-y-4">
                  <div className="bg-surface rounded-lg p-4">
                    <h3 className="font-semibold text-sm text-gray-500 mb-2">DADOS PESSOAIS</h3>
                    <p className="text-dark font-medium">{form.customer_name}</p>
                    <p className="text-gray-600 text-sm">{form.customer_phone}</p>
                    {form.customer_email && <p className="text-gray-600 text-sm">{form.customer_email}</p>}
                  </div>
                  <div className="bg-surface rounded-lg p-4">
                    <h3 className="font-semibold text-sm text-gray-500 mb-2">VEÍCULO</h3>
                    <p className="text-dark font-medium">{form.car_brand} {form.car_model} {form.car_year}</p>
                    {form.car_plate && <p className="text-gray-600 text-sm">Placa: {form.car_plate}</p>}
                  </div>
                  <div className="bg-surface rounded-lg p-4">
                    <h3 className="font-semibold text-sm text-gray-500 mb-2">SERVIÇO</h3>
                    <p className="text-dark font-medium">{selectedService?.name}</p>
                    <p className="text-primary-orange font-bold">
                      A partir de {selectedService && formatCurrency(selectedService.price_estimate)}
                    </p>
                  </div>
                  <div className="bg-surface rounded-lg p-4">
                    <h3 className="font-semibold text-sm text-gray-500 mb-2">DATA E HORÁRIO</h3>
                    <p className="text-dark font-medium">
                      {new Date(form.appointment_date + "T12:00:00").toLocaleDateString("pt-BR", {
                        weekday: "long",
                        day: "2-digit",
                        month: "long",
                        year: "numeric",
                      })}
                    </p>
                    <p className="text-primary-orange font-bold text-lg">{form.time_slot}</p>
                  </div>
                </div>
              </div>
            )}

            {/* Navigation */}
            <div className="flex justify-between mt-8 pt-6 border-t border-gray-100">
              {step > 0 ? (
                <button
                  onClick={() => setStep(step - 1)}
                  className="text-gray-500 hover:text-gray-700 font-medium transition-colors"
                >
                  ← Voltar
                </button>
              ) : (
                <Link href="/" className="text-gray-500 hover:text-gray-700 font-medium transition-colors">
                  ← Início
                </Link>
              )}

              {step < 4 ? (
                <button
                  onClick={() => setStep(step + 1)}
                  disabled={!canNext()}
                  className="btn-primary disabled:opacity-40 disabled:cursor-not-allowed disabled:transform-none"
                >
                  Próximo →
                </button>
              ) : (
                <button onClick={handleSubmit} className="btn-primary !bg-green-500 hover:!bg-green-600">
                  ✓ Confirmar Agendamento
                </button>
              )}
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
