"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { fetchDashboardStats } from "@/lib/api";
import { getCurrentAdminRole } from "@/lib/auth";
import type { AdminRole } from "@/lib/types";

interface DashboardStats {
  pending: number;
  confirmed: number;
  in_progress: number;
  done: number;
  today: number;
  this_week: number;
}

const DEFAULT_STATS: DashboardStats = { pending: 0, confirmed: 0, in_progress: 0, done: 0, today: 0, this_week: 0 };

export default function AdminDashboardPage() {
  const [stats, setStats] = useState<DashboardStats>(DEFAULT_STATS);
  const [role, setRole] = useState<AdminRole>("mechanic");

  useEffect(() => {
    fetchDashboardStats().then(setStats).catch(() => {});
    getCurrentAdminRole().then((value) => {
      if (value) setRole(value);
    });
  }, []);

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
      <section className="relative overflow-hidden rounded-2xl border border-dark-border-light bg-black/25 p-6 sm:p-8 mb-8">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_10%_10%,_rgba(230,92,0,0.22),_transparent_45%)]" />
        <div className="relative flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6">
          <div>
            <p className="text-primary-gold text-xs font-semibold tracking-widest uppercase mb-2">Painel operacional</p>
            <h2 className="text-3xl sm:text-4xl font-black text-white leading-tight">Controle da oficina em tempo real</h2>
            <p className="text-gray-300 mt-3 max-w-2xl">
              Acompanhe fila, andamento e produtividade do time com visão consolidada.
            </p>
          </div>
          <Link href="/admin/agendamentos" className="btn-primary text-sm w-max">
            Abrir Kanban
          </Link>
        </div>
      </section>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {[
          { label: "Pendentes", value: stats.pending, color: "bg-yellow-500", textColor: "text-yellow-400" },
          { label: "Confirmados", value: stats.confirmed, color: "bg-blue-500", textColor: "text-blue-400" },
          { label: "Em Atendimento", value: stats.in_progress, color: "bg-orange-500", textColor: "text-orange-400" },
          { label: "Concluídos", value: stats.done, color: "bg-green-500", textColor: "text-green-400" },
        ].map((stat) => (
          <div key={stat.label} className="glass-card rounded-xl p-5 border border-dark-border-light">
            <div className="flex items-center gap-3 mb-2">
              <div className={`w-3 h-3 rounded-full ${stat.color}`} />
              <span className="text-sm text-gray-300">{stat.label}</span>
            </div>
            <p className={`text-3xl font-bold ${stat.textColor}`}>{stat.value}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="glass-card rounded-xl p-6 border border-dark-border-light">
          <h3 className="font-bold text-white mb-4">Hoje</h3>
          <div className="flex items-center justify-between">
            <span className="text-gray-300">Agendamentos</span>
            <span className="text-2xl font-bold text-white">{stats.today}</span>
          </div>
          <div className="mt-4">
            <Link href="/admin/agendamentos" className="text-primary-orange text-sm font-semibold hover:text-primary-gold transition-colors">
              Ir para fluxo do dia →
            </Link>
          </div>
        </div>

        <div className="glass-card rounded-xl p-6 border border-dark-border-light">
          <h3 className="font-bold text-white mb-4">Esta Semana</h3>
          <div className="flex items-center justify-between">
            <span className="text-gray-300">Total de agendamentos</span>
            <span className="text-2xl font-bold text-white">{stats.this_week}</span>
          </div>
          <div className="mt-4">
            <Link href="/admin/agendamentos" className="text-primary-orange text-sm font-semibold hover:text-primary-gold transition-colors">
              Ver linha da semana →
            </Link>
          </div>
        </div>
      </div>

      <div className="mt-8 glass-card rounded-xl p-6 border border-dark-border-light">
        <h3 className="font-bold text-white mb-4">Ações Rápidas</h3>
        <div className="flex flex-wrap gap-3">
          <Link href="/admin/agendamentos" className="btn-primary text-sm">
            Abrir Kanban Operacional
          </Link>
          <Link href="/admin/servicos" className="btn-secondary text-sm">
            Editar Serviços
          </Link>
          {role === "owner" && (
            <Link href="/admin/dono" className="bg-primary-gold/10 text-primary-gold border border-primary-gold/40 rounded-lg px-4 py-2 text-sm font-medium hover:bg-primary-gold/20 transition-colors">
              Visão Executiva do Dono
            </Link>
          )}
          <Link href="/" target="_blank" className="text-gray-500 hover:text-white border border-dark-border-light rounded-lg px-4 py-2 text-sm transition-colors">
            Ver Site →
          </Link>
        </div>
      </div>
    </main>
  );
}
