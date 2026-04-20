import Link from "next/link";
import Image from "next/image";
import { COMPANY, PLACEHOLDER_SERVICES } from "@/lib/constants";
import { formatCurrency } from "@/lib/utils";

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

const FEATURED_SCENES = [
  {
    title: "Diagnostico Avancado",
    description: "Scanner, leitura de falhas e plano de acao tecnico antes da troca de pecas.",
    image:
      "https://images.unsplash.com/photo-1619642751034-765dfdf7c58e?auto=format&fit=crop&w=1400&q=80",
  },
  {
    title: "Equipe Tecnica Especializada",
    description: "Mecanicos com processo padronizado para reduzir retrabalho e aumentar confianca.",
    image:
      "https://images.unsplash.com/photo-1625047509168-a7026f36de04?auto=format&fit=crop&w=1400&q=80",
  },
  {
    title: "Controle de Qualidade",
    description: "Checklist visual, testes finais e entrega transparente com orientacao ao cliente.",
    image:
      "https://images.unsplash.com/photo-1632823471565-1ecdf3b01d9b?auto=format&fit=crop&w=1400&q=80",
  },
] as const;

const HERO_SERVICE_IMAGES = [
  {
    title: "Diagnostico de performance",
    image:
      "https://images.unsplash.com/photo-1542362567-b07e54358753?auto=format&fit=crop&w=1600&q=80",
  },
  {
    title: "Inspecao visual e check-up",
    image:
      "https://images.unsplash.com/photo-1486006920555-c77dcf18193c?auto=format&fit=crop&w=1600&q=80",
  },
  {
    title: "Servico de pecas e componentes",
    image:
      "https://images.unsplash.com/photo-1487754180451-c456f719a1fc?auto=format&fit=crop&w=1600&q=80",
  },
  {
    title: "Entrega com padrao premium",
    image:
      "https://images.unsplash.com/photo-1580273916550-e323be2ae537?auto=format&fit=crop&w=1600&q=80",
  },
] as const;

export default function Home() {
  return (
    <>
      <section className="relative min-h-screen bg-dark-bg overflow-hidden flex items-center">
        <img
          src="https://images.unsplash.com/photo-1486006920555-c77dcf18193c?auto=format&fit=crop&w=2200&q=80"
          alt="Oficina automotiva profissional"
          className="absolute inset-0 h-full w-full object-cover"
          loading="eager"
        />
        <div className="absolute inset-0 bg-black/65" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_10%,_rgba(230,92,0,0.45),_transparent_42%)]" />
        <div className="absolute inset-0 bg-[linear-gradient(120deg,rgba(0,0,0,0.85)_5%,rgba(0,0,0,0.52)_52%,rgba(0,0,0,0.92)_100%)]" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-28 pb-16 w-full">
          <div className="grid grid-cols-1 xl:grid-cols-[1.05fr_0.95fr] gap-8 items-center">
            <div className="max-w-4xl">
              <div className="mb-6 inline-flex items-center gap-4 rounded-2xl border border-white/20 bg-black/45 px-4 py-3 shadow-[0_10px_40px_rgba(0,0,0,0.45)]">
                <Image
                  src="/images/logo-light.jpeg"
                  alt={COMPANY.fullName}
                  width={58}
                  height={58}
                  className="rounded-xl ring-2 ring-primary-gold/30"
                />
                <div>
                  <p className="text-xl sm:text-2xl font-black text-white leading-tight">TZM Multi Service</p>
                  <p className="text-xs sm:text-sm font-semibold tracking-wider uppercase text-primary-gold">Mecanica Automotiva</p>
                </div>
              </div>

              <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black text-white leading-[0.95] mb-5">
                Mecanica premium para quem nao aceita servico comum.
              </h1>

              <p className="text-lg sm:text-xl text-gray-200 max-w-2xl mb-8 leading-relaxed">
                Atendimento profissional, previsibilidade de prazo e acompanhamento em tempo real.
                Seu carro entra em fluxo tecnico, nao em improviso.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 mb-10">
                <Link href="/agendar" className="btn-primary text-base sm:text-lg !py-3 !px-8">
                  Agendar agora
                </Link>
                <a
                  href={COMPANY.whatsappLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-secondary !border-green-500 !text-green-300 hover:!bg-green-500 hover:!text-white text-base sm:text-lg !py-3 !px-8"
                >
                  Falar com especialista
                </a>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 max-w-3xl">
                {[
                  { label: "Carros atendidos", value: "2.000+" },
                  { label: "Taxa de retorno", value: "72%" },
                  { label: "Satisfacao media", value: "4.9/5" },
                ].map((item) => (
                  <div key={item.label} className="glass rounded-xl px-4 py-4">
                    <p className="text-2xl font-extrabold text-primary-gold">{item.value}</p>
                    <p className="text-xs sm:text-sm text-gray-200">{item.label}</p>
                  </div>
                ))}
              </div>
            </div>

            <aside className="w-full xl:justify-self-end">
              <div className="glass rounded-2xl p-4 sm:p-5 border border-white/20 shadow-[0_20px_70px_rgba(0,0,0,0.55)]">
                <div className="flex items-center justify-between mb-4">
                  <p className="text-xs tracking-wider uppercase text-primary-gold font-semibold">Quadro de servicos</p>
                  <div className="flex items-center gap-2 text-[11px] text-gray-200">
                    <Image
                      src="/images/logo-dark.jpeg"
                      alt={COMPANY.name}
                      width={20}
                      height={20}
                      className="rounded"
                    />
                    TZM Multi Service
                  </div>
                </div>

                <div className="hero-slider rounded-xl border border-dark-border-light h-[300px] sm:h-[340px]">
                  {HERO_SERVICE_IMAGES.map((item, index) => (
                    <figure
                      key={item.title}
                      className={`hero-slide hero-slide-${index + 1}`}
                    >
                      <img
                        src={item.image}
                        alt={item.title}
                        className="h-full w-full object-cover"
                        loading={index === 0 ? "eager" : "lazy"}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/25 to-black/10" />
                      <figcaption className="absolute left-4 right-4 bottom-4 text-white text-sm sm:text-base font-semibold">
                        {item.title}
                      </figcaption>
                    </figure>
                  ))}
                </div>
              </div>
            </aside>
          </div>
        </div>
      </section>

      <section className="bg-dark-bg py-16 sm:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-end justify-between gap-4 mb-8">
            <div>
              <p className="text-primary-gold text-xs sm:text-sm font-semibold tracking-widest uppercase mb-2">
                Estrutura
              </p>
              <h2 className="text-3xl sm:text-4xl font-bold text-white">Uma oficina que parece empresa de verdade</h2>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {FEATURED_SCENES.map((item) => (
              <article key={item.title} className="group relative rounded-2xl overflow-hidden border border-dark-border-light">
                <img
                  src={item.image}
                  alt={item.title}
                  className="h-72 w-full object-cover transition-transform duration-700 group-hover:scale-110"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/45 to-black/15" />
                <div className="absolute bottom-0 p-5">
                  <h3 className="text-xl font-semibold text-white mb-2">{item.title}</h3>
                  <p className="text-sm text-gray-200 leading-relaxed">{item.description}</p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="relative py-16 sm:py-24 bg-dark-bg overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_85%_15%,_rgba(255,184,0,0.09),_transparent_35%)]" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="text-center mb-12">
            <p className="text-primary-gold text-xs sm:text-sm font-semibold tracking-widest uppercase mb-2">
              Servicos
            </p>
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
              Especialidades da <span className="gradient-text">TZM Multi Service</span>
            </h2>
            <p className="text-gray-300 max-w-2xl mx-auto">
              Cada atendimento segue checklists tecnicos e rastreabilidade por etapa no painel interno.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {PLACEHOLDER_SERVICES.slice(0, 8).map((service) => (
              <article key={service.name} className="glass-card rounded-2xl p-5 border border-dark-border">
                <div className="w-12 h-12 rounded-lg gradient-brand flex items-center justify-center text-white mb-4">
                  {ICON_MAP[service.icon] || ICON_MAP.settings}
                </div>
                <h3 className="font-semibold text-white text-lg mb-1">{service.name}</h3>
                <p className="text-sm text-gray-300 leading-relaxed mb-4">{service.description}</p>
                <p className="text-primary-gold font-bold">A partir de {formatCurrency(service.price_estimate)}</p>
              </article>
            ))}
          </div>

          <div className="text-center mt-10">
            <Link href="/servicos" className="btn-secondary text-gray-100">
              Ver catalogo completo
            </Link>
          </div>
        </div>
      </section>

      <section className="bg-dark-bg pb-16 sm:pb-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="glass rounded-3xl border border-primary-orange/20 p-8 sm:p-12 relative overflow-hidden">
            <div className="absolute -right-20 -top-20 w-72 h-72 rounded-full bg-primary-orange/10 blur-3xl" />
            <div className="relative grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
              <div>
                <p className="text-primary-gold text-xs sm:text-sm font-semibold tracking-widest uppercase mb-2">
                  Processo
                </p>
                <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
                  Fluxo pensado para velocidade e confianca
                </h2>
                <p className="text-gray-300 leading-relaxed mb-6">
                  Do agendamento ao veiculo pronto, voce acompanha etapa por etapa sem ruído.
                </p>
                <Link href="/agendar" className="btn-primary">
                  Iniciar agendamento
                </Link>
              </div>

              <div className="space-y-3">
                {[
                  "1. Recepcao tecnica e diagnostico inicial",
                  "2. Orcamento aprovado com transparência",
                  "3. Execucao por mecanico responsavel",
                  "4. Teste final e entrega orientada",
                ].map((item) => (
                  <div key={item} className="bg-black/30 border border-dark-border-light rounded-xl px-4 py-3 text-gray-100">
                    {item}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="relative py-16 sm:py-24 overflow-hidden">
        <img
          src="https://images.unsplash.com/photo-1580273916550-e323be2ae537?auto=format&fit=crop&w=2200&q=80"
          alt="Equipe de mecanica automotiva"
          className="absolute inset-0 h-full w-full object-cover"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-black/70" />
        <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(0,0,0,0.95),rgba(0,0,0,0.65),rgba(0,0,0,0.95))]" />

        <div className="relative max-w-5xl mx-auto px-4 text-center">
          <Image
            src="/images/logo-dark.jpeg"
            alt={COMPANY.fullName}
            width={88}
            height={88}
            className="mx-auto rounded-2xl ring-1 ring-white/15 mb-5"
          />
          <h2 className="text-3xl sm:text-5xl font-extrabold text-white mb-4">
            Seu carro merece um atendimento de nivel enterprise.
          </h2>
          <p className="text-gray-200 text-lg max-w-3xl mx-auto mb-8">
            Estrutura, metodo e tecnologia para voce ter seguranca do inicio ao fim.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/agendar" className="btn-primary text-lg !py-3 !px-8">Agendar servico</Link>
            <a href={COMPANY.whatsappLink} target="_blank" rel="noopener noreferrer" className="btn-secondary text-lg !py-3 !px-8">
              Falar no WhatsApp
            </a>
          </div>
        </div>
      </section>
    </>
  );
}
