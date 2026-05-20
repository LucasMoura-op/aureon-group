"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  AlertTriangle,
  BarChart3,
  Bot,
  Building2,
  Calculator,
  CircleDollarSign,
  FileText,
  Hammer,
  Menu,
  Moon,
  Search,
  ShieldCheck,
  Sun
} from "lucide-react";
import { useTheme } from "next-themes";
import { AureonLogo } from "@/components/brand/aureon-logo";
import { BrandSignature } from "@/components/brand/brand-signature";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const nav = [
  { href: "/app", label: "Dashboard", icon: BarChart3 },
  { href: "/app/projetos", label: "Projetos", icon: Building2 },
  { href: "/app/simuladores", label: "Simuladores", icon: Calculator },
  { href: "/app/financeiro", label: "Financeiro", icon: CircleDollarSign },
  { href: "/app/obras", label: "Obras", icon: Hammer },
  { href: "/app/regioes", label: "Regioes", icon: Search },
  { href: "/app/ia", label: "IA Consultiva", icon: Bot },
  { href: "/app/relatorios", label: "Relatorios", icon: FileText }
];

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { theme, setTheme } = useTheme();

  return (
    <div className="min-h-screen bg-background">
      <aside className="fixed inset-y-0 left-0 z-30 hidden w-72 border-r bg-card lg:block">
        <div className="flex h-16 items-center gap-3 border-b px-5">
          <AureonLogo />
        </div>
        <nav className="space-y-1 p-3">
          {nav.map((item) => {
            const active = pathname === item.href;
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 rounded-md px-3 py-2.5 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground",
                  active && "bg-primary/10 text-primary"
                )}
              >
                <Icon className="h-4 w-4" />
                {item.label}
              </Link>
            );
          })}
        </nav>
        <div className="absolute bottom-4 left-4 right-4 space-y-3">
          <BrandSignature />
          <div className="rounded-lg border bg-background p-4">
            <div className="flex items-center gap-2 text-sm font-medium">
              <ShieldCheck className="h-4 w-4 text-success" />
              RLS e auditoria
            </div>
            <p className="mt-2 text-xs text-muted-foreground">
              Dados isolados por organizacao, roles e politicas no Supabase.
            </p>
          </div>
        </div>
      </aside>

      <div className="lg:pl-72">
        <header className="sticky top-0 z-20 flex h-16 items-center justify-between border-b bg-background/92 px-4 backdrop-blur sm:px-6">
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="icon" className="lg:hidden" aria-label="Abrir menu">
              <Menu className="h-5 w-5" />
            </Button>
            <div>
              <p className="text-xs text-muted-foreground">Organizacao</p>
              <h2 className="text-sm font-semibold tracking-[0.08em]">AUREON GROUP</h2>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" className="hidden sm:inline-flex">
              <AlertTriangle className="h-4 w-4" />
              4 alertas
            </Button>
            <Button
              variant="ghost"
              size="icon"
              aria-label="Alternar tema"
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            >
              <Sun className="h-4 w-4 dark:hidden" />
              <Moon className="hidden h-4 w-4 dark:block" />
            </Button>
          </div>
        </header>
        <main className="p-4 sm:p-6">{children}</main>
        <nav className="fixed inset-x-0 bottom-0 z-30 grid grid-cols-5 border-t bg-card p-1 lg:hidden">
          {nav.slice(0, 5).map((item) => {
            const Icon = item.icon;
            const active = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex flex-col items-center gap-1 rounded-md py-2 text-[11px] text-muted-foreground",
                  active && "bg-primary/10 text-primary"
                )}
              >
                <Icon className="h-4 w-4" />
                {item.label.split(" ")[0]}
              </Link>
            );
          })}
        </nav>
      </div>
    </div>
  );
}
