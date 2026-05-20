import { cn } from "@/lib/utils";

type AureonLogoProps = {
  className?: string;
  markClassName?: string;
  showText?: boolean;
  compact?: boolean;
};

export function AureonLogo({
  className,
  markClassName,
  showText = true,
  compact = false
}: AureonLogoProps) {
  return (
    <div className={cn("flex items-center gap-3", className)}>
      <AureonMark className={markClassName} />
      {showText ? (
        <div className="min-w-0">
          <p className={cn("font-semibold tracking-[0.16em]", compact ? "text-xs" : "text-sm")}>
            AUREON GROUP
          </p>
          {!compact ? (
            <p className="text-xs text-muted-foreground">Inteligência patrimonial</p>
          ) : null}
        </div>
      ) : null}
    </div>
  );
}

export function AureonMark({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "relative flex h-10 w-10 shrink-0 items-center justify-center rounded-md bg-[#10231f] text-[#f5c86a] shadow-soft ring-1 ring-[#f5c86a]/35",
        className
      )}
      aria-hidden="true"
    >
      <svg viewBox="0 0 48 48" className="h-8 w-8" fill="none">
        <path
          d="M24 5.5c10.2 0 18.5 8.3 18.5 18.5S34.2 42.5 24 42.5 5.5 34.2 5.5 24 13.8 5.5 24 5.5Z"
          stroke="currentColor"
          strokeWidth="2.6"
          opacity="0.45"
        />
        <path
          d="M11 29.6C19.2 18.7 29.7 13.4 39 15.5"
          stroke="currentColor"
          strokeWidth="2.4"
          strokeLinecap="round"
          opacity="0.85"
        />
        <path
          d="M15 35.5 24 10.8l9 24.7M18.9 26.2h12.2"
          stroke="currentColor"
          strokeWidth="3.4"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M36.5 15.7 40 12.5l.7 4.7"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </div>
  );
}
