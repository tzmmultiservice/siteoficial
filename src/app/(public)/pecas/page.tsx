"use client";

import { useState } from "react";
import { createPieceInterest } from "@/lib/api";

export default function PecasPage() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.includes("@")) return;
    try {
      await createPieceInterest(email);
    } catch {
      // silently continue
    }
    setSubmitted(true);
  };

  return (
    <>
      <section className="pt-32 pb-16 relative">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_rgba(230,92,0,0.06)_0%,_transparent_60%)]" />
        <div className="relative max-w-3xl mx-auto px-4 text-center">
          <span className="inline-block bg-primary-orange/15 text-primary-gold text-sm font-semibold px-5 py-1.5 rounded-full mb-6 tracking-wider uppercase">
            Em Breve
          </span>
          <h1 className="text-4xl sm:text-5xl font-bold text-white mb-4">
            Catálogo de <span className="gradient-text">Peças</span>
          </h1>
          <p className="text-gray-500 text-lg">
            Estamos montando nosso catálogo online com as melhores peças automotivas.
          </p>
        </div>
      </section>

      <section className="pb-20">
        <div className="max-w-lg mx-auto px-4 text-center">
          <div className="glass-card rounded-2xl p-8">
            <div className="w-20 h-20 rounded-2xl bg-primary-orange/10 flex items-center justify-center mx-auto mb-6 ring-1 ring-primary-orange/20">
              <svg className="w-10 h-10 text-primary-orange" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
              </svg>
            </div>

            {submitted ? (
              <>
                <h2 className="text-2xl font-bold text-white mb-3">Obrigado!</h2>
                <p className="text-gray-500">
                  Você será avisado assim que nosso catálogo de peças estiver disponível.
                </p>
              </>
            ) : (
              <>
                <h2 className="text-2xl font-bold text-white mb-3">
                  Seja o Primeiro a Saber
                </h2>
                <p className="text-gray-500 mb-6">
                  Deixe seu email e avisaremos assim que o catálogo de peças
                  estiver disponível para compra online.
                </p>
                <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3">
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="seu@email.com"
                    required
                    className="input-dark flex-1"
                  />
                  <button type="submit" className="btn-primary whitespace-nowrap">
                    Me Avise
                  </button>
                </form>
              </>
            )}
          </div>

          <div className="mt-12 grid grid-cols-1 sm:grid-cols-3 gap-5">
            {[
              { icon: "🔧", title: "Peças Originais", desc: "Trabalharemos apenas com peças de qualidade comprovada." },
              { icon: "🚚", title: "Entrega Rápida", desc: "Retire na loja ou receba em casa com agilidade." },
              { icon: "💰", title: "Preços Justos", desc: "Os melhores preços da região para peças automotivas." },
            ].map((item) => (
              <div key={item.title} className="glass-card rounded-2xl p-6 text-center">
                <span className="text-3xl mb-3 block">{item.icon}</span>
                <h3 className="font-bold text-white mb-1">{item.title}</h3>
                <p className="text-gray-500 text-sm">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
