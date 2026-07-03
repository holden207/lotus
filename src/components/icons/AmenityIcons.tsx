import { forwardRef } from "react";
import type { LucideProps } from "lucide-react";

const iconDefaults = {
  xmlns: "http://www.w3.org/2000/svg",
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
};

export const SolarEnergyIcon = forwardRef<SVGSVGElement, LucideProps>(
  ({ className, strokeWidth = 1.5, ...props }, ref) => (
    <svg
      ref={ref}
      {...iconDefaults}
      strokeWidth={strokeWidth}
      className={className}
      aria-hidden
      {...props}
    >
      <path d="M13 2 3 14h9l-1 8 10-12h-9l1-8z" />
    </svg>
  ),
);
SolarEnergyIcon.displayName = "SolarEnergyIcon";

export const NewHouseIcon = forwardRef<SVGSVGElement, LucideProps>(
  ({ className, strokeWidth = 1.5, ...props }, ref) => (
    <svg
      ref={ref}
      {...iconDefaults}
      strokeWidth={strokeWidth}
      className={className}
      aria-hidden
      {...props}
    >
      <path d="M3 11.5 12 4l9 7.5" />
      <path d="M5 10.5V20h14v-9.5" />
      <path d="M9 20v-5h6v5" />
      <path d="M17.5 6.5 19 5" />
      <path d="M18.25 5.75 18.25 8.25" />
      <path d="M16.75 7.25 19.75 7.25" />
    </svg>
  ),
);
NewHouseIcon.displayName = "NewHouseIcon";

export const LakefrontIcon = forwardRef<SVGSVGElement, LucideProps>(
  ({ className, strokeWidth = 1.5, ...props }, ref) => (
    <svg
      ref={ref}
      {...iconDefaults}
      strokeWidth={strokeWidth}
      className={className}
      aria-hidden
      {...props}
    >
      <path d="M5 11.5 12 6l7 5.5" />
      <path d="M7 11v3h10v-3" />
      <path d="M2 17c2-1.25 3.5-1.25 5.5 0s3.5 1.25 5.5 0 3.5-1.25 5.5 0 3.5 1.25 5.5 0" />
      <path d="M2 20.5c2-1.25 3.5-1.25 5.5 0s3.5 1.25 5.5 0 3.5-1.25 5.5 0 3.5 1.25 5.5 0" />
    </svg>
  ),
);
LakefrontIcon.displayName = "LakefrontIcon";
