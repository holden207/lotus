const GOOGLE_MAPS_API_KEY =
  import.meta.env.VITE_GOOGLE_MAPS_API_KEY ?? "AIzaSyAxOoTEuUxUbYyeo6uUdszybb60ZOR1KbM";

type PropertyMapProps = {
  address: string;
};

export function PropertyMap({ address }: PropertyMapProps) {
  if (!GOOGLE_MAPS_API_KEY) {
    return (
      <div className="flex aspect-[16/10] w-full items-center justify-center rounded-md bg-muted text-sm text-muted-foreground">
        Mapa indisponível
      </div>
    );
  }

  const src = `https://www.google.com/maps/embed/v1/place?key=${GOOGLE_MAPS_API_KEY}&q=${encodeURIComponent(address)}`;

  return (
    <iframe
      title={`Mapa — ${address}`}
      src={src}
      className="aspect-[16/10] w-full rounded-md border-0"
      allowFullScreen
      loading="lazy"
      referrerPolicy="no-referrer-when-downgrade"
    />
  );
}
