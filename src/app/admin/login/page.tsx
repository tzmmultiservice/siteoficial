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
    <div className="min-h-screen flex items-center justify-center px-4 relative">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_rgba(230,92,0,0.08)_0%,_transparent_50%)]" />
      <div className="w-full max-w-md relative">
        <div className="text-center mb-8">
          <Image
            src="/images/logo-light.jpeg"
            alt={COMPANY.fullName}
            width={80}
            height={80}
            className="mx-auto rounded-xl mb-4 ring-1 ring-white/10"
          />
          <h1 className="text-2xl font-bold text-white">Painel Administrativo</h1>
          <p className="text-gray-500 text-sm mt-1">Acesso restrito ao administrador</p>
        </div>

        <form onSubmit={handleSubmit} className="glass-card rounded-2xl p-8">
          {error && (
            <div className="bg-red-500/10 border border-red-500/30 text-red-400 text-sm rounded-xl p-3 mb-4">
              {error}
            </div>
          )}

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-1.5">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="input-dark"
                placeholder="admin@email.com"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-1.5">Senha</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="input-dark"
                placeholder="••••••••"
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
        </form>
      </div>
    </div>
  );
}
