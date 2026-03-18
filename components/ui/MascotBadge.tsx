"use client";

/**
 * MascotBadge — displays a mascot emoji with a contextual message.
 * Variant determines background/text color scheme.
 */
interface MascotBadgeProps {
  emoji: string;
  message: string;
  variant: "success" | "warning" | "danger" | "info";
}

const variantClasses: Record<MascotBadgeProps["variant"], string> = {
  success:
    "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300",
  warning:
    "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300",
  danger:
    "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300",
  info: "bg-[var(--color-primary-light)] text-[var(--color-primary)]",
};

export default function MascotBadge({
  emoji,
  message,
  variant,
}: MascotBadgeProps) {
  return (
    <div
      className={`rounded-full px-4 py-2 text-sm font-medium inline-flex items-center gap-2 ${variantClasses[variant]}`}
    >
      <span className="text-lg">{emoji}</span>
      <span>{message}</span>
    </div>
  );
}
