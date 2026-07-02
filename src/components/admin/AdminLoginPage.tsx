"use client";

import { useState } from "react";
import { Building2, Eye, EyeOff, Lock } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { setAdminAuthenticated } from "@/lib/admin-auth";
import { verifyAdminLogin } from "@/lib/properties";

type AdminLoginPageProps = {
  onSuccess: () => void;
};

export function AdminLoginPage({ onSuccess }: AdminLoginPageProps) {
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!password.trim()) {
      toast.error("Digite sua senha para continuar.");
      return;
    }

    setSubmitting(true);
    try {
      await verifyAdminLogin(password);
      setAdminAuthenticated(true, password);
      toast.success("Acesso autorizado.");
      onSuccess();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Senha incorreta.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="relative flex min-h-svh flex-col items-center justify-center bg-cream px-4 py-12">
      <div className="mb-8 text-center">
        <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center text-gold">
          <Building2 className="h-12 w-12" strokeWidth={1.25} />
        </div>
        <h1 className="text-xl font-bold tracking-[0.14em] text-foreground">LÓTUS IMÓVEIS</h1>
        <p className="mt-1 text-sm text-muted-foreground">Painel Administrativo</p>
      </div>

      <div className="w-full max-w-md rounded-xl border border-border/60 bg-background p-8 shadow-[0_8px_30px_rgba(0,0,0,0.06)]">
        <h2 className="text-center text-lg font-semibold text-foreground">Acesso restrito</h2>
        <p className="mt-2 text-center text-sm text-muted-foreground">
          Digite sua senha para acessar o painel administrativo.
        </p>

        <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
          <div className="space-y-2">
            <Label htmlFor="admin-password" className="text-sm font-medium">
              Senha
            </Label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                id="admin-password"
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Digite sua senha"
                className="h-11 rounded-lg border-gold/40 pl-10 pr-10"
                autoComplete="current-password"
                disabled={submitting}
              />
              <button
                type="button"
                onClick={() => setShowPassword((value) => !value)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground transition-colors hover:text-foreground"
                aria-label={showPassword ? "Ocultar senha" : "Mostrar senha"}
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
          </div>

          <Button
            type="submit"
            disabled={submitting}
            className="h-11 w-full rounded-lg bg-gold text-base font-medium text-primary-foreground hover:bg-gold-dark"
          >
            {submitting ? "Entrando..." : "Entrar"}
          </Button>
        </form>

        <div className="relative my-6">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-border/70" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-background px-2 text-muted-foreground">ou</span>
          </div>
        </div>

        <p className="flex items-center justify-center gap-2 text-center text-xs text-muted-foreground">
          <Lock className="h-3.5 w-3.5 shrink-0" />
          Acesso permitido apenas para administradores.
        </p>
      </div>
    </div>
  );
}
