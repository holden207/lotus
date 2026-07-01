import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

type PropertyAmenityCardProps = {
  icon: LucideIcon;
  label: string;
  selected?: boolean;
  interactive?: boolean;
  disabled?: boolean;
  onClick?: () => void;
};

export function PropertyAmenityCard({
  icon: Icon,
  label,
  selected = false,
  interactive = false,
  disabled = false,
  onClick,
}: PropertyAmenityCardProps) {
  const className = cn(
    "flex flex-col items-center gap-2 rounded-lg border px-4 py-5 text-center transition-colors",
    selected
      ? "border-gold bg-gold-soft/50"
      : "border-border/70 bg-cream/50",
    interactive && !disabled && "cursor-pointer",
    interactive && !selected && !disabled && "hover:border-gold/40",
    interactive && disabled && "cursor-not-allowed opacity-60",
  );

  const content = (
    <>
      <Icon className="h-6 w-6 text-gold" strokeWidth={1.5} />
      <span className="text-xs font-medium text-foreground">{label}</span>
    </>
  );

  if (interactive) {
    return (
      <button
        type="button"
        disabled={disabled}
        onClick={onClick}
        className={className}
        aria-pressed={selected}
      >
        {content}
      </button>
    );
  }

  return <div className={className}>{content}</div>;
}
