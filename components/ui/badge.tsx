import * as React from "react";
import { cn } from "@/lib/utils";

type BadgeProps = React.HTMLAttributes<HTMLSpanElement> & {
  tone?: "default" | "success" | "warning" | "danger" | "muted";
};

export function Badge({ className, tone = "default", ...props }: BadgeProps) {
  const tones = {
    default: "bg-primary/10 text-primary",
    success: "bg-success/12 text-success",
    warning: "bg-warning/15 text-amber-700 dark:text-amber-300",
    danger: "bg-destructive/12 text-destructive",
    muted: "bg-muted text-muted-foreground"
  };
  return <span className={cn("inline-flex rounded-md px-2 py-1 text-xs font-medium", tones[tone], className)} {...props} />;
}
