"use client";

import { useEffect, useRef, type CSSProperties, type ReactNode } from "react";

type TextRevealProps = {
  children: ReactNode;
  className?: string;
  delay?: number;
  as?: "div" | "section" | "footer";
};

export default function TextReveal({ children, className = "", delay = 0, as = "div" }: TextRevealProps) {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const element = ref.current;
    if (!element || window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      element?.classList.add("is-visible");
      return;
    }

    const observer = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting) return;
      element.classList.add("is-visible");
      observer.disconnect();
    }, { threshold: 0.16, rootMargin: "0px 0px -7%" });

    observer.observe(element);
    return () => observer.disconnect();
  }, []);

  const props = {
    className: `text-reveal ${className}`,
    style: { "--text-reveal-delay": `${delay}ms` } as CSSProperties,
  };
  const setRef = (element: HTMLElement | null) => { ref.current = element; };

  if (as === "section") return <section ref={setRef} {...props}>{children}</section>;
  if (as === "footer") return <footer ref={setRef} {...props}>{children}</footer>;
  return <div ref={setRef} {...props}>{children}</div>;
}
