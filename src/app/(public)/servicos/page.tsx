import Link from "next/link";
import { PLACEHOLDER_SERVICES } from "@/lib/constants";
import { formatCurrency } from "@/lib/utils";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Serviços — TZM Multi Service",
  description: "Conheça nossos serviços mecânicos: troca de óleo, revisão, suspensão, freios, alinhamento e mais.",
};

const ICON_MAP: Record<string, React.ReactNode> = {
  droplets: <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 21c-4.97 0-9-4.03-9-9 0-4.632 8.1-11.2 8.44-11.48a.75.75 0 011.12 0C12.9.8 21 7.368 21 12c0 4.97-4.03 9-9 9z" /></svg>,
  "clipboard-check": <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" /></svg>,
  car: <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 17h.01M16 17h.01M3 11l1.5-5A2 2 0 016.4 4.5h11.2a2 2 0 011.9 1.5L21 11M3 11v6a1 1 0 001 1h1m16-7v6a1 1 0 01-1 1h-1M3 11h18" /></svg>,
  "shield-check": <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>,
  crosshair: <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" strokeWidth={1.5} /><path strokeLinecap="round" strokeWidth={1.5} d="M12 2v4m0 12v4M2 12h4m12 0h4" /></svg>,
  cpu: <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><rect x="4" y="4" width="16" height="16" rx="2" strokeWidth={1.5} /><rect x="9" y="9" width="6" height="6" strokeWidth={1.5} /><path strokeWidth={1.5} d="M9 1v3m6-3v3M9 20v3m6-3v3M1 9h3m16 0h3M1 15h3m16 0h3" /></svg>,
  wind: <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.59 4.59A2 2 0 1111 8H2m10.59 11.41A2 2 0 1014 16H2m15.73-8.27A2.5 2.5 0 1119.5 12H2" /></svg>,
  settings: <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.066 2.573c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.573 1.066c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.066-2.573c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" /><circle cx="12" cy="12" r="3" strokeWidth={1.5} /></svg>,
};

export default function ServicosPage() {
  return (
    <>
      {/* Header */}
      <section className="bg-dark-bg py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl sm:text-5xl font-bold text-white mb-4">
            Nossos <span className="gradient-text">Serviços</span>
          </h1>
          <p className="text-gray-400 max-w-2xl mx-auto text-lg">
            Manutenção completa para o seu veículo com profissionais experientes e peças de qualidade.
          </p>
        </div>
      </section>

      {/* Grid de Serviços */}
      <section className="py-16 bg-surface">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {PLACEHOLDER_SERVICES.map((service) => (
              <div
                key={service.name}
                className="bg-white rounded-xl p-8 shadow-sm card-hover border border-gray-100 flex gap-6"
              >
                <div className="w-16 h-16 rounded-xl gradient-brand flex items-center justify-center text-white shrink-0">
                  {ICON_MAP[service.icon] || ICON_MAP.settings}
                </div>
                <div className="flex-1">
                  <h3 className="font-bold text-dark text-xl mb-2">{service.name}</h3>
                  <p className="text-gray-500 text-sm mb-4 leading-relaxed">
                    {service.description}
                  </p>
                  <div className="flex items-center justify-between flex-wrap gap-2">
                    <div className="flex items-center gap-4">
                      <span className="text-primary-orange font-bold text-lg">
                        A partir de {formatCurrency(service.price_estimate)}
                      </span>
                      <span className="text-gray-400 text-sm">
                        ~{service.duration_minutes} min
                      </span>
                    </div>
                    <Link href="/agendar" className="text-primary-orange hover:text-primary-red font-semibold text-sm transition-colors">
                      Agendar →
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 gradient-brand">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">
            Pronto para agendar?
          </h2>
          <p className="text-white/80 mb-8">
            Escolha o serviço, selecione o melhor horário e acompanhe tudo online.
          </p>
          <Link
            href="/agendar"
            className="inline-flex items-center gap-2 bg-white text-primary-orange font-bold py-3 px-8 rounded-lg hover:bg-gray-100 transition-colors"
          >
            Agendar Agora
          </Link>
        </div>
      </section>
    </>
  );
}
