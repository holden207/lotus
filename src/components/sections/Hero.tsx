import { useEffect, useState } from "react";
import imageHero from "@/assets/hero-living.png";
import { ArrowRight, Search } from "lucide-react";
import { fetchCondominiums } from "@/lib/properties";
import {
  PROPERTY_PURPOSES,
  PROPERTY_TYPES,
  handlePriceInputChange,
  mergeCondominiumLists,
  parseBrazilianPrice,
  type HeroSearchFilters,
  type PropertyPurpose,
} from "@/lib/property-search";

type HeroProps = {
  condominiums: string[];
  onSearch: (filters: HeroSearchFilters) => void;
};

function FieldLabel({ children }: { children: React.ReactNode }) {
  return (
    <label className="mb-1.5 block text-[10px] font-semibold tracking-[0.18em] text-gold">
      {children}
    </label>
  );
}

const selectClassName =
  "h-11 w-full appearance-none rounded-md border border-border/80 bg-background px-3 text-sm text-foreground outline-none transition-colors focus:border-gold/60";

const inputClassName =
  "h-11 w-full rounded-md border border-border/80 bg-background px-3 text-sm text-foreground outline-none transition-colors placeholder:text-muted-foreground/60 focus:border-gold/60";

export function Hero({ condominiums, onSearch }: HeroProps) {
  const [purpose, setPurpose] = useState<PropertyPurpose | "">("comprar");
  const [propertyType, setPropertyType] = useState("");
  const [condominium, setCondominium] = useState("");
  const [condominiumOptions, setCondominiumOptions] = useState<string[]>(condominiums);
  const [locationOrCode, setLocationOrCode] = useState("");
  const [minPriceInput, setMinPriceInput] = useState("");
  const [maxPriceInput, setMaxPriceInput] = useState("");
  const [priceError, setPriceError] = useState<string | null>(null);

  useEffect(() => {
    setCondominiumOptions(mergeCondominiumLists(condominiums));
  }, [condominiums]);

  async function loadCondominiumOptions() {
    try {
      const names = await fetchCondominiums();
      setCondominiumOptions((current) => mergeCondominiumLists(current, names));
    } catch {
      // Keep options already loaded from the page.
    }
  }

  useEffect(() => {
    void loadCondominiumOptions();
  }, []);

  function handleSearchSubmit(event: React.FormEvent) {
    event.preventDefault();

    const minPrice = minPriceInput.trim() ? parseBrazilianPrice(minPriceInput) : undefined;
    const maxPrice = maxPriceInput.trim() ? parseBrazilianPrice(maxPriceInput) : undefined;

    if (minPrice !== undefined && minPrice <= 0) {
      setPriceError("Informe um valor mínimo válido.");
      return;
    }

    if (maxPrice !== undefined && maxPrice <= 0) {
      setPriceError("Informe um valor máximo válido.");
      return;
    }

    if (minPrice !== undefined && maxPrice !== undefined && minPrice > maxPrice) {
      setPriceError("O valor mínimo não pode ser maior que o valor máximo.");
      return;
    }

    setPriceError(null);
    onSearch({
      purpose: purpose || undefined,
      propertyType: propertyType || undefined,
      condominium: condominium || undefined,
      locationOrCode: locationOrCode.trim() || undefined,
      minPrice,
      maxPrice,
    });
  }

  return (
    <section id="inicio" className="relative bg-background">
      <div className="relative min-h-[480px] md:min-h-[540px] lg:min-h-[600px]">
        <img
          src={imageHero}
          alt="Sala de estar luxuosa"
          width={2400}
          height={1200}
          className="absolute inset-0 h-full w-full object-cover object-center"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/75 via-black/50 to-black/20" />

        <div className="relative mx-auto flex h-full max-w-7xl items-center px-6 py-14 md:py-16 lg:py-20">
          <div className="max-w-xl">
            <p className="mb-4 text-[11px] font-semibold tracking-[0.24em] text-gold">
              BEM-VINDO À LÓTUS IMÓVEIS
            </p>
            <h1 className="font-display text-[2.75rem] leading-[1.08] text-white md:text-5xl lg:text-[3.5rem]">
              Investir com <span className="text-gold">VISÃO</span>,
              <br />
              transformando escolhas em <span className="text-gold">VALOR</span>.
            </h1>
            <p className="mt-5 max-w-md text-[15px] leading-relaxed text-white/85">
              Encontre oportunidades imobiliárias selecionadas com estratégia, segurança e excelência.
            </p>
            <a
              href="#imoveis"
              className="mt-7 inline-flex items-center gap-2.5 rounded-md bg-gold px-6 py-3 text-[11px] font-semibold tracking-[0.22em] text-primary-foreground transition-colors hover:bg-gold-dark"
            >
              VER IMÓVEIS
              <ArrowRight className="h-4 w-4" />
            </a>
          </div>
        </div>
      </div>

      <div className="relative z-10 mx-auto max-w-7xl px-6 pb-14 md:pb-16">
        <form
          onSubmit={handleSearchSubmit}
          className="-mt-10 rounded-xl border border-border/80 bg-card p-5 shadow-[0_8px_30px_rgba(0,0,0,0.08)] md:-mt-12 md:p-6"
        >
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <div>
              <FieldLabel>FINALIDADE</FieldLabel>
              <select
                value={purpose}
                onChange={(e) => setPurpose(e.target.value as PropertyPurpose | "")}
                className={selectClassName}
                aria-label="Finalidade"
              >
                <option value="">Todos</option>
                {PROPERTY_PURPOSES.map(({ value, label }) => (
                  <option key={value} value={value}>
                    {label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <FieldLabel>TIPO DE IMÓVEL</FieldLabel>
              <select
                value={propertyType}
                onChange={(e) => setPropertyType(e.target.value)}
                className={selectClassName}
                aria-label="Tipo de imóvel"
              >
                <option value="">Todos</option>
                {PROPERTY_TYPES.map((type) => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <FieldLabel>CONDOMÍNIO</FieldLabel>
              <select
                value={condominium}
                onChange={(e) => setCondominium(e.target.value)}
                onFocus={() => void loadCondominiumOptions()}
                className={selectClassName}
                aria-label="Condomínio"
              >
                <option value="">Todos</option>
                {condominiumOptions.map((name) => (
                  <option key={name} value={name}>
                    {name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <FieldLabel>LOCALIZAÇÃO OU CÓDIGO</FieldLabel>
              <input
                type="text"
                value={locationOrCode}
                onChange={(e) => setLocationOrCode(e.target.value)}
                placeholder="Bairro, Cidade ou código"
                className={inputClassName}
                aria-label="Localização ou código"
              />
            </div>
          </div>

          <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <div>
              <FieldLabel>VALOR MÍNIMO</FieldLabel>
              <div className="relative">
                <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">
                  R$
                </span>
                <input
                  type="text"
                  inputMode="numeric"
                  value={minPriceInput}
                  onChange={(e) => {
                    setMinPriceInput(handlePriceInputChange(e.target.value));
                    setPriceError(null);
                  }}
                  placeholder="0,00"
                  className={`${inputClassName} pl-9`}
                  aria-label="Valor mínimo"
                  aria-invalid={priceError ? true : undefined}
                />
              </div>
            </div>

            <div>
              <FieldLabel>VALOR MÁXIMO</FieldLabel>
              <div className="relative">
                <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">
                  R$
                </span>
                <input
                  type="text"
                  inputMode="numeric"
                  value={maxPriceInput}
                  onChange={(e) => {
                    setMaxPriceInput(handlePriceInputChange(e.target.value));
                    setPriceError(null);
                  }}
                  placeholder="0,00"
                  className={`${inputClassName} pl-9`}
                  aria-label="Valor máximo"
                  aria-invalid={priceError ? true : undefined}
                />
              </div>
            </div>

            <div className="sm:col-span-2">
              {priceError ? (
                <p className="mb-2 text-xs text-destructive" role="alert">
                  {priceError}
                </p>
              ) : null}
              <button
                type="submit"
                className="flex h-11 w-full items-center justify-center gap-2.5 rounded-md bg-gold text-[11px] font-semibold tracking-[0.22em] text-primary-foreground transition-colors hover:bg-gold-dark lg:mt-[22px]"
              >
                <Search className="h-4 w-4" />
                BUSCAR IMÓVEIS
              </button>
            </div>
          </div>
        </form>
      </div>
    </section>
  );
}
