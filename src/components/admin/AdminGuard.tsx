"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getSession, onAuthChange, signOut } from "@/lib/auth";
import Link from "next/link";

export default function AdminGuard({ children }: { children: React.ReactNode }) {
  const [authenticated, setAuthenticated] = useState(false);
  const [checking, setChecking] = useState(true);
  const router = useRouter();

  useEffect(() => {
    getSession().then((session) => {
      if (!session) {
        router.replace("/admin/login");
      } else {
        setAuthenticated(true);
      }
      setChecking(false);
    });

    const { data: listener } = onAuthChange((session) => {
      if (!session) {
        setAuthenticated(false);
        router.replace("/admin/login");
      }
    });

    return () => { listener.subscription.unsubscribe(); };
  }, [router]);

  if (checking) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin w-10 h-10 border-4 border-primary-orange border-t-transparent rounded-full" />
      </div>
    );
  }

  if (!authenticated) return null;

  return (
    <div className="min-h-screen">
      <header className="bg-dark-card/80 backdrop-blur-xl border-b border-dark-border px-4 sm:px-6 py-4 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <Link href="/admin" className="text-white text-xl font-bold">
            TZM <span className="gradient-text">Admin</span>
          </Link>
          <nav className="flex items-center gap-4 sm:gap-6">
            <Link href="/admin" className="text-gray-400 hover:text-white text-sm transition-colors">
              Dashboard
            </Link>
            <Link href="/admin/agendamentos" className="text-gray-400 hover:text-white text-sm transition-colors">
              Agendamentos
            </Link>
            <Link href="/admin/servicos" className="text-gray-400 hover:text-white text-sm transition-colors">
              Serviços
            </Link>
            <button
              onClick={async () => { await signOut(); router.replace("/admin/login"); }}
              className="text-gray-500 hover:text-red-400 text-sm transition-colors"
            >
              Sair
            </button>
          </nav>
        </div>
      </header>
      {children}
    </div>
  );
}
