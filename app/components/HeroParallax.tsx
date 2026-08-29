"use client";
import { useEffect, useRef } from "react";

export default function HeroParallax({ children }: { children: React.ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    let frame = 0;
    const update = () => {
      frame = 0;
      const rect = node.getBoundingClientRect();
      const progress = Math.max(0, Math.min(1, -rect.top / Math.max(1, rect.height)));
      node.style.setProperty("--hero-scroll", progress.toFixed(3));
    };
    const onScroll = () => { if (!frame) frame = requestAnimationFrame(update); };
    update(); window.addEventListener("scroll", onScroll, { passive: true }); window.addEventListener("resize", onScroll);
    return () => { window.removeEventListener("scroll", onScroll); window.removeEventListener("resize", onScroll); if (frame) cancelAnimationFrame(frame); };
  }, []);
  const handlePointerMove = (event: React.PointerEvent<HTMLDivElement>) => {
    const node = ref.current;
    if (!node) return;
    const bounds = node.getBoundingClientRect();
    const x = ((event.clientX - bounds.left) / bounds.width - 0.5) * 2;
    const y = ((event.clientY - bounds.top) / bounds.height - 0.5) * 2;
    node.style.setProperty("--hero-pointer-x", x.toFixed(3));
    node.style.setProperty("--hero-pointer-y", y.toFixed(3));
  };
  const handlePointerLeave = () => {
    const node = ref.current;
    if (!node) return;
    node.style.setProperty("--hero-pointer-x", "0");
    node.style.setProperty("--hero-pointer-y", "0");
  };
  return <div ref={ref} className="hero-parallax" onPointerMove={handlePointerMove} onPointerLeave={handlePointerLeave}>{children}</div>;
}
