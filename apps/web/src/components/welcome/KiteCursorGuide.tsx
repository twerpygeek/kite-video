import { useEffect, useRef, useState } from "react";
import { X } from "lucide-react";

const GUIDE_MESSAGES = [
  "Drop a clip.",
  "Shape the timeline.",
  "Add captions.",
  "Export anywhere.",
  "One editor. Every device.",
];

const clamp = (value: number, min: number, max: number) =>
  Math.min(max, Math.max(min, value));

interface KiteCursorGuideProps {
  className?: string;
}

export const KiteCursorGuide: React.FC<KiteCursorGuideProps> = ({
  className = "",
}) => {
  const guideRef = useRef<HTMLButtonElement | null>(null);
  const frameRef = useRef<number | null>(null);
  const [messageIndex, setMessageIndex] = useState(0);
  const [isHidden, setIsHidden] = useState(false);
  const message = GUIDE_MESSAGES[messageIndex];

  useEffect(() => {
    if (typeof window === "undefined") return;

    const prefersReducedMotion =
      window.matchMedia?.("(prefers-reduced-motion: reduce)").matches ?? false;

    if (prefersReducedMotion) return;

    const handlePointerMove = (event: PointerEvent) => {
      if (frameRef.current !== null) {
        window.cancelAnimationFrame(frameRef.current);
      }

      frameRef.current = window.requestAnimationFrame(() => {
        const guide = guideRef.current;
        if (!guide) return;

        const rect = guide.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;
        const x = clamp((event.clientX - centerX) / 180, -1, 1);
        const y = clamp((event.clientY - centerY) / 150, -1, 1);

        guide.style.setProperty("--kite-guide-tilt-x", `${x * 16}deg`);
        guide.style.setProperty("--kite-guide-tilt-y", `${y * -12}deg`);
        guide.style.setProperty("--kite-guide-eye-x", `${x * 5}px`);
        guide.style.setProperty("--kite-guide-eye-y", `${y * 4}px`);
        guide.style.setProperty("--kite-guide-tail-x", `${x * 8}px`);
      });
    };

    window.addEventListener("pointermove", handlePointerMove, {
      passive: true,
    });

    return () => {
      window.removeEventListener("pointermove", handlePointerMove);
      if (frameRef.current !== null) {
        window.cancelAnimationFrame(frameRef.current);
      }
    };
  }, []);

  if (isHidden) return null;

  return (
    <div
      className={`kite-cursor-guide-shell ${className}`}
      data-testid="kite-guide-shell"
    >
      <button
        type="button"
        className="kite-cursor-guide__close"
        aria-label="Hide Kite guide"
        onClick={() => setIsHidden(true)}
      >
        <X size={14} strokeWidth={2.6} />
      </button>
      <button
        ref={guideRef}
        type="button"
        className="kite-cursor-guide"
        aria-label="Cycle Kite guide tip"
        onClick={() =>
          setMessageIndex((current) => (current + 1) % GUIDE_MESSAGES.length)
        }
      >
        <span className="kite-cursor-guide__bubble">{message}</span>
        <span className="kite-cursor-guide__stage" aria-hidden="true">
          <span className="kite-cursor-guide__shadow" />
          <span className="kite-cursor-guide__body">
            <span className="kite-cursor-guide__kite">
              <span className="kite-cursor-guide__panel kite-cursor-guide__panel--top" />
              <span className="kite-cursor-guide__panel kite-cursor-guide__panel--left" />
              <span className="kite-cursor-guide__panel kite-cursor-guide__panel--right" />
              <span className="kite-cursor-guide__face">
                <span className="kite-cursor-guide__eye kite-cursor-guide__eye--left" />
                <span className="kite-cursor-guide__eye kite-cursor-guide__eye--right" />
              </span>
            </span>
            <span className="kite-cursor-guide__tail">
              <span className="kite-cursor-guide__tail-dot" />
            </span>
          </span>
        </span>
      </button>
    </div>
  );
};
