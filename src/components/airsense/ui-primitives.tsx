import { cn } from "@/lib/utils";

export function PageHero({
  eyebrow,
  title,
  description,
  action,
  className,
}: {
  eyebrow?: string;
  title: string;
  description?: string;
  action?: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "airsense-page-bg airsense-surface-glass relative overflow-hidden rounded-2xl p-6 md:p-8",
        className,
      )}
    >
      <div className="relative flex flex-wrap items-start justify-between gap-4">
        <div className="max-w-2xl space-y-2">
          {eyebrow && (
            <p className="text-primary text-xs font-semibold tracking-widest uppercase">
              {eyebrow}
            </p>
          )}
          <h1 className="text-2xl font-semibold tracking-tight md:text-3xl">
            {title}
          </h1>
          {description && (
            <p className="text-muted-foreground text-sm leading-relaxed md:text-base">
              {description}
            </p>
          )}
        </div>
        {action}
      </div>
    </div>
  );
}

export function AqiLegend({ compact = false }: { compact?: boolean }) {
  const items = [
    { color: "#22c55e", label: "Good", range: "0–50" },
    { color: "#eab308", label: "Moderate", range: "51–100" },
    { color: "#f97316", label: "Unhealthy", range: "101–200" },
    { color: "#ef4444", label: "Very Unhealthy", range: "201–300" },
    { color: "#a855f7", label: "Hazardous", range: ">300" },
  ];

  return (
    <div
      className={cn(
        "flex flex-wrap gap-2",
        compact ? "gap-1.5" : "gap-2",
      )}
    >
      {items.map((item) => (
        <div
          key={item.label}
          className={cn(
            "flex items-center gap-2 rounded-full border bg-background/60 px-3 py-1 text-xs",
            compact && "px-2 py-0.5",
          )}
        >
          <span
            className="size-2.5 shrink-0 rounded-full"
            style={{ backgroundColor: item.color }}
          />
          <span className="font-medium">{item.label}</span>
          {!compact && (
            <span className="text-muted-foreground">{item.range}</span>
          )}
        </div>
      ))}
    </div>
  );
}

export function ConfidenceBar({
  value,
  color = "var(--primary)",
}: {
  value: number;
  color?: string;
}) {
  const pct = Math.round(value * 100);

  return (
    <div className="space-y-1.5">
      <div className="flex justify-between text-xs">
        <span className="text-muted-foreground">Model confidence</span>
        <span className="font-medium">{pct}%</span>
      </div>
      <div className="bg-muted h-2 overflow-hidden rounded-full">
        <div
          className="h-full rounded-full transition-all duration-700"
          style={{ width: `${pct}%`, backgroundColor: color }}
        />
      </div>
    </div>
  );
}
