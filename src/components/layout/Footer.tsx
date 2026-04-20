import Link from "next/link";
import Image from "next/image";
import { COMPANY, NAV_LINKS } from "@/lib/constants";

export default function Footer() {
  return (
    <footer className="relative mt-auto border-t border-dark-border">
      {/* Glow line */}
      <div className="glow-line" />

      <div className="bg-dark-bg/80 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            {/* Brand */}
            <div>
              <div className="flex items-center gap-3 mb-5">
                <Image
                  src="/images/logo-dark.jpeg"
                  alt={COMPANY.fullName}
                  width={40}
                  height={40}
                  className="rounded-lg"
                />
                <div>
                  <p className="text-white font-bold tracking-tight">{COMPANY.name}</p>
                  <p className="text-primary-gold/70 text-xs font-medium tracking-wider uppercase">
                    {COMPANY.tagline}
                  </p>
                </div>
              </div>
              <p className="text-gray-500 text-sm leading-relaxed">
                Mecânica de confiança em São Gabriel, BA. Serviços de qualidade
                com preços justos para o seu veículo.
              </p>
            </div>

            {/* Links */}
            <div>
              <h3 className="text-white font-semibold mb-4 text-sm tracking-wider uppercase">
                Navegação
              </h3>
              <ul className="space-y-2">
                {NAV_LINKS.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-gray-500 text-sm hover:text-primary-gold transition-colors duration-300"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Contato */}
            <div>
              <h3 className="text-white font-semibold mb-4 text-sm tracking-wider uppercase">
                Contato
              </h3>
              <ul className="space-y-3 text-sm">
                <li className="flex items-start gap-2.5 text-gray-500">
                  <svg className="w-4 h-4 mt-0.5 text-primary-orange shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  {COMPANY.address}
                </li>
                <li className="flex items-center gap-2.5">
                  <svg className="w-4 h-4 text-primary-orange shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                  <a href={`tel:${COMPANY.phone}`} className="text-gray-500 hover:text-primary-gold transition-colors duration-300">
                    {COMPANY.phone}
                  </a>
                </li>
                <li className="flex items-center gap-2.5">
                  <svg className="w-4 h-4 text-primary-orange shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  <a href={`mailto:${COMPANY.email}`} className="text-gray-500 hover:text-primary-gold transition-colors duration-300">
                    {COMPANY.email}
                  </a>
                </li>
                <li className="pt-2">
                  <p className="text-xs text-gray-600">
                    {COMPANY.hours.weekdays}<br />
                    {COMPANY.hours.saturday}<br />
                    {COMPANY.hours.sunday}
                  </p>
                </li>
              </ul>
            </div>
          </div>

          <div className="glow-line mt-10 mb-6" />

          <div className="text-center text-xs text-gray-600 space-y-1">
            <p>
              &copy; {new Date().getFullYear()} {COMPANY.fullName}. Todos os direitos reservados.
              <span className="mx-1.5 text-dark-border-light">·</span>
              <Link href="/admin/login" className="hover:text-gray-400 transition-colors">
                Painel
              </Link>
            </p>
            <p>
              Desenvolvido por{" "}
              <a
                href="https://www.insumma.com.br"
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary-gold/60 hover:text-primary-gold transition-colors duration-300"
              >
                Insumma
              </a>
              {" "}— Desenvolvimento de softwares sob demanda
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
