export type SiteSettings = {
  footerPhone: string;
  footerEmail: string;
  footerAddress: string;
  footerCreci: string;
  consultantPhone: string;
  consultantEmail: string;
  consultantWhatsApp: string;
  instagramUrl: string;
  facebookUrl: string;
};

export const DEFAULT_SITE_SETTINGS: SiteSettings = {
  footerPhone: "(11) 99999-9999",
  footerEmail: "contato@lotusimoveis.com.br",
  footerAddress: "Av. Paulista, 1000 - São Paulo, SP",
  footerCreci: "",
  consultantPhone: "(11) 4002-8922",
  consultantEmail: "contato@lotusimoveis.com.br",
  consultantWhatsApp: "(11) 4002-8922",
  instagramUrl: "https://www.instagram.com/lotusimoveis",
  facebookUrl: "https://www.facebook.com/lotusimoveis",
};

export function phoneToTel(phone: string): string {
  const digits = phone.replace(/\D/g, "");
  if (!digits) return "";
  return digits.startsWith("55") ? `tel:+${digits}` : `tel:+55${digits}`;
}

export function phoneToWhatsApp(phone: string): string {
  const digits = phone.replace(/\D/g, "");
  if (!digits) return "";
  const normalized = digits.startsWith("55") ? digits : `55${digits}`;
  return `https://wa.me/${normalized}`;
}
