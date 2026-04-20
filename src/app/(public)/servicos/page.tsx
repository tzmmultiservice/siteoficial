import Link from "next/link";
import { PLACEHOLDER_SERVICES } from "@/lib/constants";
import { formatCurrency } from "@/lib/utils";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Serviços — TZM Multi Service",
  description: "Serviços automotivos com padrão técnico: revisão, freios, suspensão, eletrônica e mais.",
};

const ICON_MAP: Record<string, React.ReactNode> = {
  droplets: <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.6} d="M12 21c-4.97 0-9-4.03-9-9 0-4.632 8.1-11.2 8.44-11.48a.75.75 0 011.12 0C12.9.8 21 7.368 21 12c0 4.97-4.03 9-9 9z" /></svg>,
  "clipboard-check": <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.6} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2m-6 9l2 2 4-4" /></svg>,
  car: <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.6} d="M8 17h.01M16 17h.01M3 11l1.5-5A2 2 0 016.4 4.5h11.2a2 2 0 011.9 1.5L21 11M3 11v6a1 1 0 001 1h1m16-7v6a1 1 0 01-1 1h-1M3 11h18" /></svg>,
  "shield-check": <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.6} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>,
  crosshair: <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" strokeWidth={1.6} /><path strokeLinecap="round" strokeWidth={1.6} d="M12 2v4m0 12v4M2 12h4m12 0h4" /></svg>,
  cpu: <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24"><rect x="4" y="4" width="16" height="16" rx="2" strokeWidth={1.6} /><rect x="9" y="9" width="6" height="6" strokeWidth={1.6} /><path strokeWidth={1.6} d="M9 1v3m6-3v3M9 20v3m6-3v3M1 9h3m16 0h3M1 15h3m16 0h3" /></svg>,
  wind: <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.6} d="M9.59 4.59A2 2 0 1111 8H2m10.59 11.41A2 2 0 1014 16H2m15.73-8.27A2.5 2.5 0 1119.5 12H2" /></svg>,
  settings: <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.6} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.066 2.573c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.573 1.066c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.066-2.573c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" /><circle cx="12" cy="12" r="3" strokeWidth={1.6} /></svg>,
};

export default function ServicosPage() {
  return (
    <>
      <section className="relative pt-32 pb-20 overflow-hidden bg-dark-bg">
        <img
          src="https://images.unsplash.com/photo-1542362567-b07e54358753?auto=format&fit=crop&w=2200&q=80"
          alt="Servicos automotivos"
          className="absolute inset-0 h-full w-full object-cover"
          loading="eager"
        />
        <div className="absolute inset-0 bg-black/72" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_25%_10%,_rgba(230,92,0,0.38),_transparent_45%)]" />

        <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <span className="inline-flex rounded-full border border-primary-orange/40 bg-primary-orange/12 px-4 py-2 text-xs font-semibold tracking-wider uppercase text-primary-gold mb-5">
            Portfólio técnico
          </span>
          <h1 className="text-4xl sm:text-6xl font-black text-white mb-4 leading-tight">
            Serviços que entregam confiabilidade, não surpresa.
          </h1>
          <p className="text-lg sm:text-xl text-gray-200 max-w-3xl mx-auto">
            Diagnóstico, execução e validação final com padrão profissional para seu veículo rodar seguro.
          </p>
        </div>
      </section>

      <section className="py-16 sm:py-24 bg-dark-bg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {PLACEHOLDER_SERVICES.map((service) => (
              <article key={service.name} className="glass-card rounded-2xl p-6 border border-dark-border">
                <div className="flex gap-4">
                  <div className="w-12 h-12 rounded-lg gradient-brand flex items-center justify-center text-white shrink-0">
                    {ICON_MAP[service.icon] || ICON_MAP.settings}
                  </div>
                  <div className="flex-1">
                    <h2 className="text-xl font-semibold text-white mb-2">{service.name}</h2>
                    <p className="text-sm text-gray-300 mb-4 leading-relaxed">{service.description}</p>
                    <div className="flex items-center justify-between gap-3 flex-wrap">
                      <p className="text-primary-gold font-bold">A partir de {formatCurrency(service.price_estimate)}</p>
                      <p className="text-sm text-gray-400">Tempo medio: {service.duration_minutes} min</p>
                    </div>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="pb-20 bg-dark-bg">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <div className="glass rounded-2xl p-10 border border-primary-orange/20">
            <h3 className="text-3xl font-bold text-white mb-3">Quer resolver seu problema hoje?</h3>
            <p className="text-gray-200 mb-8">Agende em poucos minutos e acompanhe o andamento do serviço online.</p>
            <Link href="/agendar" className="btn-primary text-lg !py-3 !px-8">Agendar serviço</Link>
          </div>
        </div>
      </section>
    </>
  );
}
