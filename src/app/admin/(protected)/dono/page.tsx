"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { fetchOwnerOverview } from "@/lib/api";
import { getCurrentAdminRole } from "@/lib/auth";
import { formatCurrency } from "@/lib/utils";

interface OwnerViewState {
  total_cars: number;
  active_services: number;
  waiting_services: number;
  completed_this_week: number;
  avg_progress: number;
  monthly_revenue: number;
  yards: Array<{
    yard_name: string;
    total: number;
    waiting: number;
    active: number;
    done: number;
    cancelled: number;
  }>;
}

const EMPTY_STATE: OwnerViewState = {
  total_cars: 0,
  active_services: 0,
  waiting_services: 0,
  completed_this_week: 0,
  avg_progress: 0,
  monthly_revenue: 0,
  yards: [],
};

export default function AdminOwnerPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [authorized, setAuthorized] = useState(false);
  const [overview, setOverview] = useState<OwnerViewState>(EMPTY_STATE);

  useEffect(() => {
    getCurrentAdminRole()
      .then((role) => {
        if (role !== "owner") {
          router.replace("/admin");
          return;
        }
        setAuthorized(true);
        return fetchOwnerOverview().then((data) => setOverview(data));
      })
      .catch(() => {
        router.replace("/admin");
      })
      .finally(() => setLoading(false));
  }, [router]);

  const occupancy = useMemo(() => {
    if (!overview.total_cars) return 0;
    return Math.round((overview.active_services / overview.total_cars) * 100);
  }, [overview.active_services, overview.total_cars]);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="animate-spin w-10 h-10 border-4 border-primary-orange border-t-transparent rounded-full" />
      </div>
    );
  }

  if (!authorized) return null;

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
      <section className="relative overflow-hidden rounded-2xl border border-dark-border-light bg-black/25 p-6 sm:p-8 mb-8">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_12%_14%,_rgba(255,184,0,0.2),_transparent_45%)]" />
        <div className="relative">
          <p className="text-primary-gold text-xs font-semibold tracking-widest uppercase mb-2">Owner cockpit</p>
          <h2 className="text-3xl font-black text-white">Visão do Dono</h2>
          <p className="text-sm text-gray-300 mt-1">
            Acompanhamento executivo dos pátios, capacidade e produtividade operacional.
          </p>
        </div>
      </section>

      <div className="mb-6">
        <p className="text-sm text-gray-400">
          Acompanhamento executivo dos pátios, capacidade e produtividade operacional.
        </p>
      </div>

      <section className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 mb-8">
        <article className="glass-card rounded-xl p-5 border border-dark-border-light">
          <p className="text-sm text-gray-300">Carros no sistema</p>
          <p className="text-3xl font-bold text-white mt-2">{overview.total_cars}</p>
        </article>
        <article className="glass-card rounded-xl p-5 border border-dark-border-light">
          <p className="text-sm text-gray-300">Serviços em execução</p>
          <p className="text-3xl font-bold text-orange-400 mt-2">{overview.active_services}</p>
        </article>
        <article className="glass-card rounded-xl p-5 border border-dark-border-light">
          <p className="text-sm text-gray-300">Aguardando fila</p>
          <p className="text-3xl font-bold text-yellow-400 mt-2">{overview.waiting_services}</p>
        </article>
        <article className="glass-card rounded-xl p-5 border border-dark-border-light">
          <p className="text-sm text-gray-300">Concluídos na semana</p>
          <p className="text-3xl font-bold text-green-400 mt-2">{overview.completed_this_week}</p>
        </article>
      </section>

      <section className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <article className="glass-card rounded-xl p-6 border border-dark-border-light">
          <h3 className="text-white font-semibold mb-4">Produtividade Geral</h3>
          <div className="space-y-4">
            <div>
              <div className="flex items-center justify-between text-sm text-gray-400 mb-1">
                <span>Ocupação operacional</span>
                <span>{occupancy}%</span>
              </div>
              <progress
                value={occupancy}
                max={100}
                className="w-full h-2 [&::-webkit-progress-bar]:bg-dark-border [&::-webkit-progress-value]:bg-orange-500 [&::-webkit-progress-value]:rounded-full [&::-moz-progress-bar]:bg-orange-500"
              />
            </div>

            <div>
              <div className="flex items-center justify-between text-sm text-gray-400 mb-1">
                <span>Progresso médio dos serviços</span>
                <span>{overview.avg_progress}%</span>
              </div>
              <progress
                value={overview.avg_progress}
                max={100}
                className="w-full h-2 [&::-webkit-progress-bar]:bg-dark-border [&::-webkit-progress-value]:bg-primary-gold [&::-webkit-progress-value]:rounded-full [&::-moz-progress-bar]:bg-primary-gold"
              />
            </div>
          </div>
        </article>

        <article className="glass-card rounded-xl p-6 border border-dark-border-light">
          <h3 className="text-white font-semibold mb-4">Financeiro do Mês</h3>
          <p className="text-sm text-gray-300">Faturamento em serviços concluídos</p>
          <p className="text-4xl font-bold text-primary-gold mt-3">
            {formatCurrency(overview.monthly_revenue)}
          </p>
          <p className="text-xs text-gray-300 mt-3">
            Valor calculado com base no total_value dos serviços com status concluído no mês atual.
          </p>
        </article>
      </section>

      <section className="glass-card rounded-xl p-6 border border-dark-border-light">
        <h3 className="text-white font-semibold mb-4">Status por Pátio</h3>

        {overview.yards.length === 0 ? (
          <div className="text-sm text-gray-500 py-6 text-center border border-dashed border-dark-border rounded-xl">
            Sem dados de pátios no momento.
          </div>
        ) : (
          <div className="space-y-3">
            {overview.yards.map((yard) => (
              <article key={yard.yard_name} className="bg-dark-card/80 rounded-xl border border-dark-border p-4">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-3">
                  <h4 className="text-white font-semibold">{yard.yard_name}</h4>
                  <span className="text-xs text-gray-400">{yard.total} carros</span>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-5 gap-2 text-xs">
                  <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-lg px-3 py-2 text-yellow-300">
                    Fila: {yard.waiting}
                  </div>
                  <div className="bg-orange-500/10 border border-orange-500/20 rounded-lg px-3 py-2 text-orange-300">
                    Em execução: {yard.active}
                  </div>
                  <div className="bg-green-500/10 border border-green-500/20 rounded-lg px-3 py-2 text-green-300">
                    Concluídos: {yard.done}
                  </div>
                  <div className="bg-red-500/10 border border-red-500/20 rounded-lg px-3 py-2 text-red-300">
                    Cancelados: {yard.cancelled}
                  </div>
                  <div className="bg-white/5 border border-dark-border-light rounded-lg px-3 py-2 text-gray-300">
                    Total: {yard.total}
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}
