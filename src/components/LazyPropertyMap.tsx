import { useEffect, useRef, useState } from "react";

import { PropertyMap } from "@/components/PropertyMap";

type LazyPropertyMapProps = {
  address: string;
};

export function LazyPropertyMap({ address }: LazyPropertyMapProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const element = containerRef.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { rootMargin: "200px" },
    );

    observer.observe(element);
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={containerRef} className="aspect-[16/10] w-full">
      {visible ? (
        <PropertyMap address={address} />
      ) : (
        <div className="flex h-full w-full items-center justify-center rounded-md bg-muted text-sm text-muted-foreground">
          Carregando mapa…
        </div>
      )}
    </div>
  );
}
