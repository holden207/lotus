"use client";

import { useEffect, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { useRouter } from "@tanstack/react-router";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useSiteSettings } from "@/hooks/use-site-settings";
import { updateSiteSettings } from "@/lib/properties";

type SettingsModalProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

function SectionHeading({ children }: { children: React.ReactNode }) {
  return (
    <h3 className="border-b border-border/60 pb-2 text-sm font-semibold text-foreground">
      {children}
    </h3>
  );
}

export function SettingsModal({ open, onOpenChange }: SettingsModalProps) {
  const { settings } = useSiteSettings();
  const queryClient = useQueryClient();
  const router = useRouter();

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [footerPhone, setFooterPhone] = useState(settings.footerPhone);
  const [footerEmail, setFooterEmail] = useState(settings.footerEmail);
  const [footerAddress, setFooterAddress] = useState(settings.footerAddress);
  const [consultantPhone, setConsultantPhone] = useState(settings.consultantPhone);
  const [consultantEmail, setConsultantEmail] = useState(settings.consultantEmail);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!open) return;
    setCurrentPassword("");
    setNewPassword("");
    setConfirmPassword("");
    setFooterPhone(settings.footerPhone);
    setFooterEmail(settings.footerEmail);
    setFooterAddress(settings.footerAddress);
    setConsultantPhone(settings.consultantPhone);
    setConsultantEmail(settings.consultantEmail);
  }, [open, settings]);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    if (!currentPassword.trim()) {
      toast.error("Informe a senha atual para salvar as alterações.");
      return;
    }

    if (newPassword || confirmPassword) {
      if (newPassword.length < 4) {
        toast.error("A nova senha deve ter pelo menos 4 caracteres.");
        return;
      }
      if (newPassword !== confirmPassword) {
        toast.error("A confirmação da nova senha não confere.");
        return;
      }
    }

    setSubmitting(true);
    try {
      await updateSiteSettings({
        currentPassword,
        newPassword: newPassword.trim() || undefined,
        footerPhone,
        footerEmail,
        footerAddress,
        consultantPhone,
        consultantEmail,
      });

      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ["site-settings"] }),
        router.invalidate({
          filter: (match) =>
            match.routeId === "/" ||
            match.routeId === "/imoveis/$slug" ||
            match.routeId === "/admin_page/",
        }),
      ]);

      toast.success("Configurações salvas com sucesso.");
      onOpenChange(false);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Não foi possível salvar as configurações.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] max-w-lg overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Configurações</DialogTitle>
          <DialogDescription>
            Altere a senha de acesso e as informações de contato exibidas no site.
          </DialogDescription>
        </DialogHeader>

        <form className="space-y-6" onSubmit={handleSubmit}>
          <section className="space-y-4">
            <SectionHeading>Alterar senha</SectionHeading>
            <div className="space-y-2">
              <Label htmlFor="settings-current-password">Senha atual</Label>
              <Input
                id="settings-current-password"
                type="password"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                placeholder="Digite a senha atual"
                autoComplete="current-password"
                disabled={submitting}
              />
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="settings-new-password">Nova senha</Label>
                <Input
                  id="settings-new-password"
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="Opcional"
                  autoComplete="new-password"
                  disabled={submitting}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="settings-confirm-password">Confirmar nova senha</Label>
                <Input
                  id="settings-confirm-password"
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Opcional"
                  autoComplete="new-password"
                  disabled={submitting}
                />
              </div>
            </div>
          </section>

          <section className="space-y-4">
            <SectionHeading>Contato do rodapé</SectionHeading>
            <div className="space-y-2">
              <Label htmlFor="settings-footer-phone">Telefone</Label>
              <Input
                id="settings-footer-phone"
                value={footerPhone}
                onChange={(e) => setFooterPhone(e.target.value)}
                placeholder="(11) 99999-9999"
                disabled={submitting}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="settings-footer-email">E-mail</Label>
              <Input
                id="settings-footer-email"
                type="email"
                value={footerEmail}
                onChange={(e) => setFooterEmail(e.target.value)}
                placeholder="contato@lotusimoveis.com.br"
                disabled={submitting}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="settings-footer-address">Endereço</Label>
              <Input
                id="settings-footer-address"
                value={footerAddress}
                onChange={(e) => setFooterAddress(e.target.value)}
                placeholder="Av. Paulista, 1000 - São Paulo, SP"
                disabled={submitting}
              />
            </div>
          </section>

          <section className="space-y-4">
            <SectionHeading>Contato do consultor (página do imóvel)</SectionHeading>
            <div className="space-y-2">
              <Label htmlFor="settings-consultant-phone">Telefone</Label>
              <Input
                id="settings-consultant-phone"
                value={consultantPhone}
                onChange={(e) => setConsultantPhone(e.target.value)}
                placeholder="(11) 4002-8922"
                disabled={submitting}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="settings-consultant-email">E-mail</Label>
              <Input
                id="settings-consultant-email"
                type="email"
                value={consultantEmail}
                onChange={(e) => setConsultantEmail(e.target.value)}
                placeholder="contato@lotusimoveis.com.br"
                disabled={submitting}
              />
            </div>
          </section>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)} disabled={submitting}>
              Cancelar
            </Button>
            <Button
              type="submit"
              disabled={submitting}
              className="bg-gold text-primary-foreground hover:bg-gold-dark"
            >
              {submitting ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Salvando...
                </>
              ) : (
                "Salvar alterações"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
