import { Moon, Sun } from "lucide-react";
import { cn } from "@openreel/ui";
import { useThemeStore } from "../stores/theme-store";

interface ThemeToggleButtonProps {
  className?: string;
}

export const ThemeToggleButton = ({
  className,
}: ThemeToggleButtonProps) => {
  const isDark = useThemeStore((state) => state.isDark);
  const setMode = useThemeStore((state) => state.setMode);
  const nextMode = isDark ? "light" : "dark";

  return (
    <button
      type="button"
      aria-label={`Switch to ${nextMode} mode`}
      title={`Switch to ${nextMode} mode`}
      onClick={() => setMode(nextMode)}
      className={cn(
        "grid h-10 w-10 shrink-0 place-items-center rounded-md border border-border bg-background-secondary text-text-primary transition hover:border-primary hover:bg-primary/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary",
        className,
      )}
    >
      {isDark ? <Sun size={16} /> : <Moon size={16} />}
    </button>
  );
};
