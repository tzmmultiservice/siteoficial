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
      <section className="relative pt-32 pb-20 bg-dark-bg overflow-hidden">
        <img
          src="https://images.unsplash.com/photo-1487754180451-c456f719a1fc?auto=format&fit=crop&w=2200&q=80"
          alt="Peças automotivas"
          className="absolute inset-0 h-full w-full object-cover"
          loading="eager"
        />
        <div className="absolute inset-0 bg-black/75" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_15%,_rgba(230,92,0,0.35),_transparent_45%)]" />

        <div className="relative max-w-5xl mx-auto px-4 text-center">
          <span className="inline-flex rounded-full border border-primary-orange/40 bg-primary-orange/12 px-4 py-2 text-xs font-semibold tracking-widest uppercase text-primary-gold mb-5">
            Lançamento em preparação
          </span>
          <h1 className="text-4xl sm:text-6xl font-black text-white mb-4">Catálogo de peças premium</h1>
          <p className="text-gray-200 text-lg max-w-3xl mx-auto">
            Em breve você poderá comprar peças selecionadas com rastreabilidade e orientação técnica.
          </p>
        </div>
      </section>

      <section className="py-16 sm:py-24 bg-dark-bg">
        <div className="max-w-3xl mx-auto px-4">
          <div className="glass-card rounded-2xl p-8 sm:p-10 border border-dark-border-light text-center">
            {!submitted ? (
              <>
                <h2 className="text-3xl font-bold text-white mb-3">Entre na lista VIP</h2>
                <p className="text-gray-300 mb-7">
                  Receba em primeira mão o acesso ao catálogo de peças com ofertas exclusivas.
                </p>
                <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3">
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="seu@email.com"
                    required
                    className="input-dark flex-1"
                    title="Seu email"
                    aria-label="Seu email"
                  />
                  <button type="submit" className="btn-primary whitespace-nowrap">
                    Quero acesso
                  </button>
                </form>
              </>
            ) : (
              <>
                <h2 className="text-3xl font-bold text-white mb-3">Cadastro confirmado</h2>
                <p className="text-gray-200">
                  Assim que o catálogo estiver no ar, você receberá a notificação no email cadastrado.
                </p>
              </>
            )}
          </div>
        </div>
      </section>
    </>
  );
}
