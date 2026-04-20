import Link from "next/link";
import Image from "next/image";
import { COMPANY, PLACEHOLDER_SERVICES } from "@/lib/constants";
import { formatCurrency } from "@/lib/utils";

const ICON_MAP: Record<string, React.ReactNode> = {
  droplets: <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 21c-4.97 0-9-4.03-9-9 0-4.632 8.1-11.2 8.44-11.48a.75.75 0 011.12 0C12.9.8 21 7.368 21 12c0 4.97-4.03 9-9 9z" /></svg>,
  "clipboard-check": <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" /></svg>,
  car: <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 17h.01M16 17h.01M3 11l1.5-5A2 2 0 016.4 4.5h11.2a2 2 0 011.9 1.5L21 11M3 11v6a1 1 0 001 1h1m16-7v6a1 1 0 01-1 1h-1M3 11h18" /></svg>,
  "shield-check": <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>,
  crosshair: <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" strokeWidth={1.5} /><path strokeLinecap="round" strokeWidth={1.5} d="M12 2v4m0 12v4M2 12h4m12 0h4" /></svg>,
  cpu: <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24"><rect x="4" y="4" width="16" height="16" rx="2" strokeWidth={1.5} /><rect x="9" y="9" width="6" height="6" strokeWidth={1.5} /><path strokeWidth={1.5} d="M9 1v3m6-3v3M9 20v3m6-3v3M1 9h3m16 0h3M1 15h3m16 0h3" /></svg>,
  wind: <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.59 4.59A2 2 0 1111 8H2m10.59 11.41A2 2 0 1014 16H2m15.73-8.27A2.5 2.5 0 1119.5 12H2" /></svg>,
  settings: <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.066 2.573c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.573 1.066c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.066-2.573c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" /><circle cx="12" cy="12" r="3" strokeWidth={1.5} /></svg>,
};

export default function Home() {
  return (
    <>
      {/* Hero */}
      <section className="relative min-h-[100vh] flex items-center justify-center overflow-hidden">
        {/* Background layers */}
        <div className="absolute inset-0 bg-dark-bg" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_rgba(230,92,0,0.08)_0%,_transparent_70%)]" />
        <div className="absolute top-1/4 -left-32 w-96 h-96 rounded-full bg-primary-orange/5 blur-[120px]" />
        <div className="absolute bottom-1/4 -right-32 w-96 h-96 rounded-full bg-primary-gold/5 blur-[120px]" />

        {/* Content */}
        <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 pt-24 pb-20 text-center">
          <div className="animate-fade-in-up">
            <Image
              src="/images/logo-dark.jpeg"
              alt={COMPANY.fullName}
              width={130}
              height={130}
              className="mx-auto rounded-2xl mb-10 shadow-2xl ring-1 ring-white/10"
              priority
            />
          </div>

          <h1 className="animate-fade-in-up stagger-1 opacity-0 text-5xl sm:text-6xl lg:text-7xl font-extrabold text-white mb-5 tracking-tight">
            <span className="gradient-text">{COMPANY.name}</span>
          </h1>

          <p className="animate-fade-in-up stagger-2 opacity-0 text-xl sm:text-2xl text-primary-gold/80 font-medium mb-3 tracking-wide uppercase">
            {COMPANY.tagline}
          </p>

          <p className="animate-fade-in-up stagger-3 opacity-0 text-gray-400 text-lg sm:text-xl max-w-2xl mx-auto mb-12 leading-relaxed">
            Serviços mecânicos de qualidade com preços justos em São Gabriel, BA.
            Agende online e acompanhe em tempo real.
          </p>

          <div className="animate-fade-in-up stagger-4 opacity-0 flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/agendar" className="btn-primary text-lg !py-3.5 !px-10">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              Agendar Serviço
            </Link>
            <a
              href={COMPANY.whatsappLink}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-secondary !border-green-500/50 !text-green-400 hover:!bg-green-500/10 hover:!border-green-400 text-lg !py-3.5 !px-10"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
              </svg>
              Falar com a Equipe
            </a>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-float">
          <div className="w-6 h-10 rounded-full border-2 border-white/20 flex items-start justify-center p-1.5">
            <div className="w-1.5 h-3 rounded-full bg-primary-orange/60 animate-pulse" />
          </div>
        </div>
      </section>

      {/* Serviços */}
      <section className="py-20 sm:py-28 relative section-divider">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_rgba(230,92,0,0.04)_0%,_transparent_60%)]" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <p className="text-primary-orange text-sm font-semibold tracking-widest uppercase mb-3">O que fazemos</p>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-4">
              Nossos <span className="gradient-text">Serviços</span>
            </h2>
            <p className="text-gray-500 max-w-2xl mx-auto text-lg">
              Manutenção completa para o seu veículo com profissionais qualificados
              e peças de qualidade.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {PLACEHOLDER_SERVICES.slice(0, 8).map((service, i) => (
              <div
                key={service.name}
                className={`glass-card rounded-2xl p-6 opacity-0 animate-fade-in-up stagger-${i + 1}`}
              >
                <div className="w-12 h-12 rounded-xl gradient-brand flex items-center justify-center text-white mb-5">
                  {ICON_MAP[service.icon] || ICON_MAP.settings}
                </div>
                <h3 className="font-bold text-white text-lg mb-2">{service.name}</h3>
                <p className="text-gray-500 text-sm mb-4 leading-relaxed">
                  {service.description}
                </p>
                <span className="text-primary-gold font-bold text-sm">
                  A partir de {formatCurrency(service.price_estimate)}
                </span>
              </div>
            ))}
          </div>

          <div className="text-center mt-12">
            <Link href="/servicos" className="btn-secondary">
              Ver Todos os Serviços
            </Link>
          </div>
        </div>
      </section>

      {/* Peças - Em Breve */}
      <section className="py-20 sm:py-28 section-divider">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="glass-card rounded-3xl p-10 sm:p-16 text-center relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 rounded-full bg-primary-orange/5 blur-[80px] -translate-y-1/2 translate-x-1/2" />
            <div className="relative">
              <span className="inline-block bg-primary-orange/15 text-primary-gold text-sm font-semibold px-5 py-1.5 rounded-full mb-6 tracking-wider uppercase">
                Em Breve
              </span>
              <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
                Catálogo de <span className="gradient-text">Peças</span>
              </h2>
              <p className="text-gray-500 max-w-xl mx-auto mb-8 text-lg">
                Estamos preparando nosso catálogo online de peças automotivas.
                Deixe seu email e seja o primeiro a saber!
              </p>
              <Link href="/pecas" className="btn-primary">
                Quero Ser Avisado
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Localização */}
      <section className="py-20 sm:py-28 section-divider">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <p className="text-primary-orange text-sm font-semibold tracking-widest uppercase mb-3">Localização</p>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white">
              Onde <span className="gradient-text">Estamos</span>
            </h2>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-stretch">
            <div className="glass-card rounded-2xl p-8">
              <h3 className="font-bold text-xl text-white mb-8">Informações</h3>
              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="w-11 h-11 rounded-xl gradient-brand flex items-center justify-center text-white shrink-0">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                  </div>
                  <div>
                    <p className="font-semibold text-white">Endereço</p>
                    <p className="text-gray-500 text-sm">{COMPANY.address}</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="w-11 h-11 rounded-xl gradient-brand flex items-center justify-center text-white shrink-0">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div>
                    <p className="font-semibold text-white">Horário</p>
                    <p className="text-gray-500 text-sm">
                      {COMPANY.hours.weekdays}<br />
                      {COMPANY.hours.saturday}<br />
                      {COMPANY.hours.sunday}
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="w-11 h-11 rounded-xl bg-green-500/20 flex items-center justify-center text-green-400 shrink-0">
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                    </svg>
                  </div>
                  <div>
                    <p className="font-semibold text-white">WhatsApp</p>
                    <a href={COMPANY.whatsappLink} target="_blank" rel="noopener noreferrer" className="text-green-400 hover:text-green-300 text-sm font-medium transition-colors">
                      {COMPANY.phone}
                    </a>
                  </div>
                </div>
              </div>
            </div>
            <div className="rounded-2xl overflow-hidden ring-1 ring-white/5 h-80 lg:h-auto lg:min-h-[380px]">
              <iframe
                src={COMPANY.googleMapsEmbed}
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="Localização TZM Multi Service"
              />
            </div>
          </div>
        </div>
      </section>

      {/* CTA Final */}
      <section className="relative py-20 sm:py-28 overflow-hidden">
        <div className="absolute inset-0 gradient-brand opacity-90" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_rgba(255,255,255,0.1)_0%,_transparent_70%)]" />
        <div className="relative max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-5">
            Precisa de um serviço mecânico?
          </h2>
          <p className="text-white/80 text-lg sm:text-xl mb-10 max-w-2xl mx-auto">
            Agende agora e acompanhe em tempo real pelo nosso site.
          </p>
          <Link
            href="/agendar"
            className="inline-flex items-center gap-2.5 bg-white/95 hover:bg-white text-gray-900 font-bold py-3.5 px-10 rounded-xl transition-all duration-300 hover:shadow-[0_10px_40px_rgba(0,0,0,0.3)] text-lg"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            Agendar Agora
          </Link>
        </div>
      </section>
    </>
  );
}
