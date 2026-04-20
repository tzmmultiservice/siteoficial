"use client";

import Link from "next/link";
import { STATUS_CONFIG } from "@/lib/constants";

// Mock stats for static demo
const MOCK_STATS = {
  pending: 3,
  confirmed: 2,
  in_progress: 1,
  done: 15,
  today: 4,
  this_week: 12,
};

export default function AdminDashboardPage() {
  return (
    <div className="min-h-screen bg-surface">
      {/* Admin Header */}
      <header className="bg-dark-bg border-b border-gray-800 px-4 sm:px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <h1 className="text-white text-xl font-bold">
              TZM <span className="gradient-text">Admin</span>
            </h1>
          </div>
          <nav className="flex items-center gap-6">
            <Link href="/admin" className="text-primary-orange text-sm font-medium">
              Dashboard
            </Link>
            <Link href="/admin/agendamentos" className="text-gray-400 hover:text-white text-sm transition-colors">
              Agendamentos
            </Link>
            <Link href="/admin/servicos" className="text-gray-400 hover:text-white text-sm transition-colors">
              Serviços
            </Link>
            <Link href="/admin/login" className="text-gray-500 hover:text-red-400 text-sm transition-colors">
              Sair
            </Link>
          </nav>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        <h2 className="text-2xl font-bold text-dark mb-6">Dashboard</h2>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {[
            { label: "Pendentes", value: MOCK_STATS.pending, color: "bg-yellow-500", textColor: "text-yellow-600" },
            { label: "Confirmados", value: MOCK_STATS.confirmed, color: "bg-blue-500", textColor: "text-blue-600" },
            { label: "Em Atendimento", value: MOCK_STATS.in_progress, color: "bg-orange-500", textColor: "text-orange-600" },
            { label: "Concluídos", value: MOCK_STATS.done, color: "bg-green-500", textColor: "text-green-600" },
          ].map((stat) => (
            <div key={stat.label} className="bg-white rounded-xl p-5 shadow-sm">
              <div className="flex items-center gap-3 mb-2">
                <div className={`w-3 h-3 rounded-full ${stat.color}`} />
                <span className="text-sm text-gray-500">{stat.label}</span>
              </div>
              <p className={`text-3xl font-bold ${stat.textColor}`}>{stat.value}</p>
            </div>
          ))}
        </div>

        {/* Quick summary */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white rounded-xl p-6 shadow-sm">
            <h3 className="font-bold text-dark mb-4">Hoje</h3>
            <div className="flex items-center justify-between">
              <span className="text-gray-500">Agendamentos</span>
              <span className="text-2xl font-bold text-dark">{MOCK_STATS.today}</span>
            </div>
            <div className="mt-4">
              <Link href="/admin/agendamentos" className="text-primary-orange text-sm font-medium hover:underline">
                Ver todos os agendamentos →
              </Link>
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm">
            <h3 className="font-bold text-dark mb-4">Esta Semana</h3>
            <div className="flex items-center justify-between">
              <span className="text-gray-500">Total de agendamentos</span>
              <span className="text-2xl font-bold text-dark">{MOCK_STATS.this_week}</span>
            </div>
            <div className="mt-4">
              <Link href="/admin/agendamentos" className="text-primary-orange text-sm font-medium hover:underline">
                Ver todos os agendamentos →
              </Link>
            </div>
          </div>
        </div>

        {/* Quick actions */}
        <div className="mt-8 bg-white rounded-xl p-6 shadow-sm">
          <h3 className="font-bold text-dark mb-4">Ações Rápidas</h3>
          <div className="flex flex-wrap gap-3">
            <Link href="/admin/agendamentos" className="btn-primary text-sm">
              Gerenciar Agendamentos
            </Link>
            <Link href="/admin/servicos" className="btn-secondary text-sm">
              Editar Serviços
            </Link>
            <Link href="/" target="_blank" className="text-gray-500 hover:text-dark border border-gray-200 rounded-lg px-4 py-2 text-sm transition-colors">
              Ver Site →
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}
