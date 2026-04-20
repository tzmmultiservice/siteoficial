import { COMPANY } from "@/lib/constants";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contato — TZM Multi Service",
  description: "Entre em contato com a TZM Multi Service por WhatsApp, telefone, email ou presencialmente.",
};

export default function ContatoPage() {
  return (
    <>
      <section className="relative pt-32 pb-20 bg-dark-bg overflow-hidden">
        <img
          src="https://images.unsplash.com/photo-1486006920555-c77dcf18193c?auto=format&fit=crop&w=2200&q=80"
          alt="Contato oficina mecanica"
          className="absolute inset-0 h-full w-full object-cover"
          loading="eager"
        />
        <div className="absolute inset-0 bg-black/74" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_65%_15%,_rgba(230,92,0,0.3),_transparent_42%)]" />

        <div className="relative max-w-5xl mx-auto px-4 text-center">
          <p className="text-primary-gold text-xs sm:text-sm font-semibold tracking-widest uppercase mb-3">Atendimento</p>
          <h1 className="text-4xl sm:text-6xl font-black text-white mb-4">Vamos falar sobre seu carro?</h1>
          <p className="text-gray-200 text-lg max-w-3xl mx-auto">
            Atendimento humano, resposta rápida e direcionamento técnico para resolver seu problema.
          </p>
        </div>
      </section>

      <section className="py-16 sm:py-24 bg-dark-bg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="space-y-5">
            <a
              href={COMPANY.whatsappLink}
              target="_blank"
              rel="noopener noreferrer"
              className="glass-card rounded-2xl p-6 border border-green-500/25 block hover:border-green-500/45"
            >
              <p className="text-sm text-green-300 mb-1">WhatsApp direto</p>
              <p className="text-2xl font-bold text-white">{COMPANY.phone}</p>
              <p className="text-sm text-gray-300 mt-2">Clique para iniciar conversa com nossa equipe.</p>
            </a>

            <a href={`tel:${COMPANY.phone}`} className="glass-card rounded-2xl p-6 border border-dark-border-light block">
              <p className="text-sm text-primary-gold mb-1">Telefone</p>
              <p className="text-2xl font-bold text-white">{COMPANY.phone}</p>
            </a>

            <a href={`mailto:${COMPANY.email}`} className="glass-card rounded-2xl p-6 border border-dark-border-light block">
              <p className="text-sm text-primary-gold mb-1">Email</p>
              <p className="text-lg font-semibold text-white break-all">{COMPANY.email}</p>
            </a>

            <div className="glass-card rounded-2xl p-6 border border-dark-border-light">
              <p className="text-sm text-primary-gold mb-1">Endereço</p>
              <p className="text-gray-200">{COMPANY.address}</p>
              <div className="mt-4 text-sm text-gray-300">
                <p>{COMPANY.hours.weekdays}</p>
                <p>{COMPANY.hours.saturday}</p>
                <p>{COMPANY.hours.sunday}</p>
              </div>
            </div>
          </div>

          <div className="rounded-2xl overflow-hidden border border-dark-border-light min-h-[420px]">
            <iframe
              src={COMPANY.googleMapsEmbed}
              width="100%"
              height="100%"
              className="border-0"
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="Localização TZM Multi Service"
            />
          </div>
        </div>
      </section>
    </>
  );
}
