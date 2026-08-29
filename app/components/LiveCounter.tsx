"use client";

import { useEffect, useRef, useState } from "react";

export default function LiveCounter({ target = 90, comma = false }: { target?: number; comma?: boolean }) {
  const [value, setValue] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let frame = 0;
    let started = false;
    const animate = (time: number) => {
      const progress = Math.min(time / 1500, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setValue(Math.round(target * eased));
      if (progress < 1) frame = requestAnimationFrame(animate);
    };
    const start = () => {
      if (started) return;
      started = true;
      if (reduced) setValue(target);
      else frame = requestAnimationFrame(animate);
    };
    const observer = new IntersectionObserver(([entry]) => { if (entry.isIntersecting) { start(); observer.disconnect(); } }, { threshold: .35 });
    observer.observe(node);
    return () => { observer.disconnect(); cancelAnimationFrame(frame); };
  }, [target]);

  return <span ref={ref}>{comma ? value.toLocaleString("en-US") : value}</span>;
}
