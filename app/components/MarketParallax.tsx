"use client";

import { useEffect, useRef, type ReactNode } from "react";

type MarketParallaxProps = {
  className?: string;
  children: ReactNode;
};

export default function MarketParallax({ className = "", children }: MarketParallaxProps) {
  const sceneRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const scene = sceneRef.current;
    if (!scene || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let frame = 0;
    const updateParallax = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        const bounds = scene.getBoundingClientRect();
        const viewportMidpoint = window.innerHeight / 2;
        const sceneMidpoint = bounds.top + bounds.height / 2;
        const progress = Math.max(-1, Math.min(1, (sceneMidpoint - viewportMidpoint) / (window.innerHeight + bounds.height / 2)));
        scene.style.setProperty("--landscape-y", `${Math.round(progress * -18)}px`);
      });
    };

    updateParallax();
    window.addEventListener("scroll", updateParallax, { passive: true });
    window.addEventListener("resize", updateParallax, { passive: true });
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", updateParallax);
      window.removeEventListener("resize", updateParallax);
    };
  }, []);

  return <div ref={sceneRef} className={className}>{children}</div>;
}
