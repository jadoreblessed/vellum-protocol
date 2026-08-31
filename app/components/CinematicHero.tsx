"use client";

import Link from "next/link";
import { useEffect, useRef } from "react";
import styles from "./CinematicHero.module.css";

export default function CinematicHero() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const section = sectionRef.current;
    if (!canvas || !section) return;

    const context = canvas.getContext("2d");
    if (!context) return;
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let frame = 0;
    let visible = true;
    let width = 1;
    let height = 1;

    const resize = () => {
      const bounds = section.getBoundingClientRect();
      const pixelRatio = Math.min(window.devicePixelRatio, 1.5);
      width = Math.max(1, bounds.width);
      height = Math.max(1, bounds.height);
      canvas.width = Math.round(width * pixelRatio);
      canvas.height = Math.round(height * pixelRatio);
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      context.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);
    };

    const observer = new IntersectionObserver(([entry]) => { visible = entry.isIntersecting; }, { threshold: 0.02 });
    observer.observe(section);
    const resizer = new ResizeObserver(resize);
    resizer.observe(section);
    resize();

    const draw = (time: number) => {
      if (!visible || !context) {
        if (!reduceMotion) frame = requestAnimationFrame(draw);
        return;
      }
      const t = reduceMotion ? 0.8 : time / 1000;
      context.clearRect(0, 0, width, height);
      context.globalCompositeOperation = "screen";

      for (let index = 0; index < 16; index += 1) {
        const origin = (index / 15) * width;
        const phase = index * 0.83;
        const amplitude = 26 + (index % 4) * 12;
        const gradient = context.createLinearGradient(origin - 70, 0, origin + 90, height);
        const tone = index % 5 === 0 ? "191,255,87" : index % 3 === 0 ? "45,212,128" : "178,238,197";
        gradient.addColorStop(0, `rgba(${tone},0)`);
        gradient.addColorStop(.38, `rgba(${tone},${index % 3 === 0 ? .16 : .09})`);
        gradient.addColorStop(.58, `rgba(${tone},${index % 5 === 0 ? .28 : .12})`);
        gradient.addColorStop(1, `rgba(${tone},0)`);
        context.strokeStyle = gradient;
        context.lineWidth = index % 5 === 0 ? 2.4 : 1.15;
        context.beginPath();
        for (let y = -80; y <= height + 100; y += 22) {
          const bend = Math.sin(y * .0048 + t * .55 + phase) * amplitude + Math.sin(y * .012 + phase * 2) * 13;
          const x = origin + bend + Math.sin(t * .22 + phase) * 24;
          if (y === -80) context.moveTo(x, y);
          else context.lineTo(x, y);
        }
        context.stroke();
      }

      const glow = context.createRadialGradient(width * .5, height * .73, 0, width * .5, height * .73, Math.max(width, height) * .46);
      glow.addColorStop(0, "rgba(61,255,137,.18)");
      glow.addColorStop(.45, "rgba(16,185,110,.06)");
      glow.addColorStop(1, "rgba(0,0,0,0)");
      context.fillStyle = glow;
      context.fillRect(0, 0, width, height);
      context.globalCompositeOperation = "source-over";
      if (!reduceMotion) frame = requestAnimationFrame(draw);
    };
    if (reduceMotion) draw(0);
    else frame = requestAnimationFrame(draw);

    return () => {
      cancelAnimationFrame(frame);
      observer.disconnect();
      resizer.disconnect();
    };
  }, []);

  return (
    <section className={styles.hero} ref={sectionRef}>
      <svg className={styles.filterDefs} aria-hidden="true" focusable="false">
        <filter id="vellum-liquid-waves" x="-8%" y="-8%" width="116%" height="116%">
          <feTurbulence type="fractalNoise" baseFrequency=".005 .018" numOctaves="2" seed="8" result="flow">
            <animate attributeName="baseFrequency" dur="15s" values=".005 .018;.011 .03;.006 .016;.005 .018" repeatCount="indefinite" />
          </feTurbulence>
          <feDisplacementMap in="SourceGraphic" in2="flow" scale="19" xChannelSelector="R" yChannelSelector="G" />
        </filter>
      </svg>
      <video className={styles.video} autoPlay muted loop playsInline preload="metadata" aria-hidden="true">
        <source src="/brand/hero-liquid-waves-v2.mp4" type="video/mp4" />
      </video>
      <canvas ref={canvasRef} className={styles.canvas} aria-hidden="true" />
      <div className={styles.noise} aria-hidden="true" />
      <div className={styles.content}>
        <div className={styles.copy}>
          <h1>Positions that<br /><em>outlive the trade.</em></h1>
          <p>Lock a real balance. Carry its claim as one clear, transferable instrument.</p>
          <div className={styles.actions}>
            <Link href="/app" className={styles.primary}>Open Vellum <span>↗</span></Link>
            <Link href="#how" className={styles.secondary}>How it works</Link>
          </div>
        </div>

        <div className={styles.terminal} aria-label="Vellum contract panel">
          <div className={styles.terminalTop}><span><i /> VELLUM CONTRACT</span><span>ROBINHOOD CHAIN</span></div>
          <div className={styles.terminalScreen}>
            <span className={styles.terminalLabel}>POSITION VAULT · VERIFIED</span>
            <strong>0x020b...18B4</strong>
            <p className={styles.terminalHint}>A live position becomes a bearer note.</p>
            <Link href="/app" className={styles.terminalCta}>Open Vellum <b>↗</b></Link>
          </div>
        </div>
      </div>
      <div className={styles.bottomFade} aria-hidden="true" />
    </section>
  );
}
