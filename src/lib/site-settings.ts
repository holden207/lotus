export type SiteSettings = {
  footerPhone: string;
  footerEmail: string;
  footerAddress: string;
  consultantPhone: string;
  consultantEmail: string;
};

export const DEFAULT_SITE_SETTINGS: SiteSettings = {
  footerPhone: "(11) 99999-9999",
  footerEmail: "contato@lotusimoveis.com.br",
  footerAddress: "Av. Paulista, 1000 - São Paulo, SP",
  consultantPhone: "(11) 4002-8922",
  consultantEmail: "contato@lotusimoveis.com.br",
};

export function phoneToTel(phone: string): string {
  const digits = phone.replace(/\D/g, "");
  if (!digits) return "";
  return digits.startsWith("55") ? `tel:+${digits}` : `tel:+55${digits}`;
}
