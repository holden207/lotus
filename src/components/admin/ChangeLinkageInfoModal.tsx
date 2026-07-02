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
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useSiteSettings } from "@/hooks/use-site-settings";
import { getAdminPassword } from "@/lib/admin-auth";
import { updateSiteSettings } from "@/lib/properties";

type ChangeLinkageInfoModalProps = {
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

export function ChangeLinkageInfoModal({ open, onOpenChange }: ChangeLinkageInfoModalProps) {
  const { settings } = useSiteSettings();
  const queryClient = useQueryClient();
  const router = useRouter();

  const [footerPhone, setFooterPhone] = useState(settings.footerPhone);
  const [footerEmail, setFooterEmail] = useState(settings.footerEmail);
  const [footerAddress, setFooterAddress] = useState(settings.footerAddress);
  const [consultantPhone, setConsultantPhone] = useState(settings.consultantPhone);
  const [consultantEmail, setConsultantEmail] = useState(settings.consultantEmail);
  const [consultantWhatsApp, setConsultantWhatsApp] = useState(settings.consultantWhatsApp);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!open) return;
    setFooterPhone(settings.footerPhone);
    setFooterEmail(settings.footerEmail);
    setFooterAddress(settings.footerAddress);
    setConsultantPhone(settings.consultantPhone);
    setConsultantEmail(settings.consultantEmail);
    setConsultantWhatsApp(settings.consultantWhatsApp);
  }, [open, settings]);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    const currentPassword = getAdminPassword();
    if (!currentPassword) {
      toast.error("Sessão expirada. Faça login novamente para salvar as alterações.");
      return;
    }

    setSubmitting(true);
    try {
      await updateSiteSettings({
        currentPassword,
        footerPhone,
        footerEmail,
        footerAddress,
        consultantPhone,
        consultantEmail,
        consultantWhatsApp,
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

      toast.success("Informações de contato salvas com sucesso.");
      onOpenChange(false);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Não foi possível salvar as informações.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] max-w-lg overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Informações de contato</DialogTitle>
        </DialogHeader>

        <form className="space-y-6" onSubmit={handleSubmit}>
          <section className="space-y-4">
            <SectionHeading>Contato do rodapé</SectionHeading>
            <div className="space-y-2">
              <Label htmlFor="linkage-footer-phone">Telefone</Label>
              <Input
                id="linkage-footer-phone"
                value={footerPhone}
                onChange={(e) => setFooterPhone(e.target.value)}
                placeholder="(11) 99999-9999"
                disabled={submitting}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="linkage-footer-email">E-mail</Label>
              <Input
                id="linkage-footer-email"
                type="email"
                value={footerEmail}
                onChange={(e) => setFooterEmail(e.target.value)}
                placeholder="contato@lotusimoveis.com.br"
                disabled={submitting}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="linkage-footer-address">Endereço</Label>
              <Input
                id="linkage-footer-address"
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
              <Label htmlFor="linkage-consultant-phone">Telefone</Label>
              <Input
                id="linkage-consultant-phone"
                value={consultantPhone}
                onChange={(e) => setConsultantPhone(e.target.value)}
                placeholder="(11) 4002-8922"
                disabled={submitting}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="linkage-consultant-email">E-mail</Label>
              <Input
                id="linkage-consultant-email"
                type="email"
                value={consultantEmail}
                onChange={(e) => setConsultantEmail(e.target.value)}
                placeholder="contato@lotusimoveis.com.br"
                disabled={submitting}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="linkage-consultant-whatsapp">WhatsApp</Label>
              <Input
                id="linkage-consultant-whatsapp"
                value={consultantWhatsApp}
                onChange={(e) => setConsultantWhatsApp(e.target.value)}
                placeholder="(11) 4002-8922"
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
