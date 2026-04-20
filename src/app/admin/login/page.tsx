"use client";

import { useState } from "react";
import Image from "next/image";
import { COMPANY } from "@/lib/constants";
import { signIn } from "@/lib/auth";

export default function AdminLoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    const { error: authError } = await signIn(email, password);
    if (authError) {
      setError("Email ou senha inválidos.");
      setLoading(false);
    } else {
      window.location.href = "/admin";
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 relative overflow-hidden bg-dark-bg">
      <img
        src="https://images.unsplash.com/photo-1613214149922-f1809c99b414?auto=format&fit=crop&w=2200&q=80"
        alt="Painel de oficina"
        className="absolute inset-0 h-full w-full object-cover"
        loading="eager"
      />
      <div className="absolute inset-0 bg-black/78" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_25%_10%,_rgba(230,92,0,0.35),_transparent_45%)]" />

      <div className="w-full max-w-5xl relative grid grid-cols-1 lg:grid-cols-2 gap-6 items-stretch">
        <div className="hidden lg:flex flex-col justify-end rounded-2xl p-10 border border-dark-border-light bg-black/25">
          <span className="inline-flex w-max rounded-full border border-primary-orange/40 bg-primary-orange/15 px-3 py-1 text-xs font-semibold tracking-wider uppercase text-primary-gold mb-4">
            Workspace TZM
          </span>
          <h1 className="text-4xl font-black text-white leading-tight mb-3">
            Painel operacional da oficina.
          </h1>
          <p className="text-gray-200 leading-relaxed">
            Controle de fluxo, produtividade e acompanhamento em tempo real de todos os servicos.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="glass-card rounded-2xl p-8 border border-dark-border-light">
          <div className="text-center mb-8">
            <Image
              src="/images/logo-light.jpeg"
              alt={COMPANY.fullName}
              width={84}
              height={84}
              className="mx-auto rounded-xl mb-4 ring-1 ring-white/15"
            />
            <h2 className="text-2xl font-bold text-white">Painel Administrativo</h2>
            <p className="text-gray-300 text-sm mt-1">Acesso restrito ao time autorizado</p>
          </div>

          {error && (
            <div className="bg-red-500/10 border border-red-500/30 text-red-400 text-sm rounded-xl p-3 mb-4">
              {error}
            </div>
          )}

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-200 mb-1.5">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="input-dark"
                placeholder="admin@email.com"
                title="Email"
                aria-label="Email"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-200 mb-1.5">Senha</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="input-dark"
                placeholder="••••••••"
                title="Senha"
                aria-label="Senha"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full btn-primary justify-center mt-6 disabled:opacity-50"
          >
            {loading ? "Entrando..." : "Entrar"}
          </button>

          <p className="text-center text-xs text-gray-400 mt-5">
            Ambiente interno com monitoramento de operacoes.
          </p>
        </form>
      </div>
    </div>
  );
}
