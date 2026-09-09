type Props = {
  className?: string;
};

/** Wordmark da locomotiva TremBoom — SVG inline, sem dependências. */
export function TrainLogo({ className = "h-10 w-10" }: Props) {
  return (
    <svg
      viewBox="0 0 64 64"
      fill="none"
      role="img"
      aria-label="Locomotiva TremBoom"
      className={className}
    >
      {/* Chaminé / fumaça estilizada */}
      <circle cx="20" cy="10" r="3.2" fill="#FFC531" opacity="0.9" />
      <circle cx="28" cy="6.5" r="2.4" fill="#fff" opacity="0.85" />
      <circle cx="35" cy="10" r="2" fill="#FFC531" opacity="0.7" />
      {/* Cabine */}
      <rect x="8" y="18" width="20" height="22" rx="4" fill="#231610" />
      <rect x="12" y="22" width="12" height="9" rx="2" fill="#9AD7FF" />
      {/* Corpo / caldeira */}
      <rect x="28" y="26" width="24" height="14" rx="7" fill="#E63A1E" />
      <rect x="28" y="26" width="24" height="14" rx="7" fill="url(#tb-flame)" opacity="0.55" />
      {/* Chaminé */}
      <rect x="44" y="16" width="6" height="12" rx="2" fill="#231610" />
      <rect x="42" y="14" width="10" height="4" rx="2" fill="#231610" />
      {/* Faixa amarela */}
      <rect x="28" y="33" width="24" height="3" fill="#FFC531" />
      {/* Rodas */}
      <circle cx="18" cy="46" r="7" fill="#231610" />
      <circle cx="18" cy="46" r="3" fill="#FFC531" />
      <circle cx="38" cy="46" r="7" fill="#231610" />
      <circle cx="38" cy="46" r="3" fill="#fff" />
      <circle cx="51" cy="47" r="5" fill="#231610" />
      <circle cx="51" cy="47" r="2" fill="#FFC531" />
      {/* Base */}
      <rect x="6" y="50" width="52" height="4" rx="2" fill="#231610" />
      <defs>
        <linearGradient id="tb-flame" x1="28" y1="26" x2="52" y2="40">
          <stop stopColor="#F96116" />
          <stop offset="1" stopColor="#FFC531" />
        </linearGradient>
      </defs>
    </svg>
  );
}
