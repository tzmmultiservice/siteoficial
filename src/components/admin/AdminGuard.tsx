"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getAdminRoleByEmail, getSession, onAuthChange, signOut } from "@/lib/auth";
import type { AdminRole } from "@/lib/types";
import Link from "next/link";
import Image from "next/image";

export default function AdminGuard({ children }: { children: React.ReactNode }) {
  const [authenticated, setAuthenticated] = useState(false);
  const [role, setRole] = useState<AdminRole>("mechanic");
  const [checking, setChecking] = useState(true);
  const router = useRouter();

  useEffect(() => {
    getSession().then((session) => {
      if (!session) {
        router.replace("/admin/login");
      } else {
        setAuthenticated(true);
        setRole(getAdminRoleByEmail(session.user?.email));
      }
      setChecking(false);
    });

    const { data: listener } = onAuthChange((session) => {
      if (!session) {
        setAuthenticated(false);
        router.replace("/admin/login");
        return;
      }

      setRole(getAdminRoleByEmail(session.user?.email));
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
      <header className="bg-dark-bg/92 backdrop-blur-xl border-b border-dark-border-light px-4 sm:px-6 py-3 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
          <Link href="/admin" className="flex items-center gap-3">
            <Image
              src="/images/logo-dark.jpeg"
              alt="TZM Admin"
              width={36}
              height={36}
              className="rounded-lg ring-1 ring-white/10"
            />
            <div>
              <p className="text-white text-base sm:text-lg font-bold leading-tight">TZM Admin</p>
              <p className="text-primary-gold/80 text-[11px] uppercase tracking-wider">
                {role === "owner" ? "Owner Workspace" : "Operacao"}
              </p>
            </div>
          </Link>
          <nav className="flex items-center gap-2 sm:gap-3">
            <Link href="/admin" className="text-gray-200 hover:text-white text-xs sm:text-sm transition-colors px-3 py-2 rounded-lg hover:bg-white/10">
              Dashboard
            </Link>
            <Link href="/admin/agendamentos" className="text-gray-200 hover:text-white text-xs sm:text-sm transition-colors px-3 py-2 rounded-lg hover:bg-white/10">
              Kanban
            </Link>
            <Link href="/admin/servicos" className="text-gray-200 hover:text-white text-xs sm:text-sm transition-colors px-3 py-2 rounded-lg hover:bg-white/10">
              Serviços
            </Link>
            {role === "owner" && (
              <Link href="/admin/dono" className="text-gray-200 hover:text-white text-xs sm:text-sm transition-colors px-3 py-2 rounded-lg hover:bg-white/10">
                Visão do Dono
              </Link>
            )}
            <button
              onClick={async () => { await signOut(); router.replace("/admin/login"); }}
              className="text-red-300 hover:text-red-200 text-xs sm:text-sm transition-colors px-3 py-2 rounded-lg hover:bg-red-500/10"
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
