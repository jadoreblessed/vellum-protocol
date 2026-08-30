"use client";

import Link from "next/link";
import { useEffect, useRef } from "react";
import styles from "./LivingHero.module.css";
import TokenLogo from "./TokenLogo";

const clamp01 = (value: number) => Math.max(0, Math.min(1, value));
const easeOut = (value: number) => 1 - Math.pow(1 - clamp01(value), 4);

export default function LivingHero() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const heroRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const hero = heroRef.current;
    if (!canvas || !hero) return;

    let disposed = false;
    let disposeScene = () => {};

    void (async () => {
      const THREE = await import("three");
      if (disposed) return;

      const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      const context = canvas.getContext("webgl2", { alpha: true, antialias: true, powerPreference: "high-performance" })
        ?? canvas.getContext("webgl", { alpha: true, antialias: true, powerPreference: "high-performance" });
      if (!context) {
        hero.dataset.webgl = "fallback";
        return;
      }

      let renderer: InstanceType<typeof THREE.WebGLRenderer>;
      try {
        renderer = new THREE.WebGLRenderer({ canvas, context, alpha: true, antialias: true, powerPreference: "high-performance" });
      } catch {
        hero.dataset.webgl = "fallback";
        return;
      }

      hero.dataset.webgl = "ready";
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
      renderer.outputColorSpace = THREE.SRGBColorSpace;
      renderer.toneMapping = THREE.ACESFilmicToneMapping;
      renderer.toneMappingExposure = 1.04;
      renderer.shadowMap.enabled = true;
      renderer.shadowMap.type = THREE.PCFSoftShadowMap;

      const scene = new THREE.Scene();
      const camera = new THREE.PerspectiveCamera(30, 1, 0.1, 100);
      camera.position.set(0, 0, 12.2);
      const world = new THREE.Group();
      scene.add(world);

      scene.add(new THREE.HemisphereLight(0xfffdf3, 0x456b59, 2.7));
      const key = new THREE.DirectionalLight(0xfff8e8, 5.4);
      key.position.set(-4, 7, 9);
      key.castShadow = true;
      scene.add(key);
      const greenLight = new THREE.PointLight(0x00d866, 13, 13, 2);
      greenLight.position.set(3.5, -1.1, 4);
      scene.add(greenLight);
      const limeLight = new THREE.PointLight(0xd4ff62, 8, 11, 2);
      limeLight.position.set(-3.8, 1.8, 3.2);
      scene.add(limeLight);

      const floor = new THREE.Mesh(
        new THREE.PlaneGeometry(24, 14),
        new THREE.ShadowMaterial({ color: 0x164d31, opacity: 0.1 }),
      );
      floor.rotation.x = -Math.PI / 2;
      floor.position.set(0, -3.35, -1.5);
      floor.receiveShadow = true;
      world.add(floor);

      const fiberCanvas = document.createElement("canvas");
      fiberCanvas.width = 256;
      fiberCanvas.height = 64;
      const fiberContext = fiberCanvas.getContext("2d");
      if (fiberContext) {
        const gradient = fiberContext.createLinearGradient(0, 0, 0, 64);
        gradient.addColorStop(0, "#6d6d6d");
        gradient.addColorStop(0.45, "#d7d7d7");
        gradient.addColorStop(1, "#777777");
        fiberContext.fillStyle = gradient;
        fiberContext.fillRect(0, 0, 256, 64);
        for (let index = 0; index < 110; index += 1) {
          const x = (index * 37) % 256;
          const alpha = 0.08 + (index % 5) * 0.035;
          const channel = index % 3 === 0 ? 255 : 20;
          fiberContext.strokeStyle = `rgba(${channel},${channel},${channel},${alpha})`;
          fiberContext.lineWidth = index % 7 === 0 ? 2 : 1;
          fiberContext.beginPath();
          fiberContext.moveTo(x, 0);
          fiberContext.bezierCurveTo(x + 2, 19, x - 2, 42, x + 1, 64);
          fiberContext.stroke();
        }
      }
      const fiberBump = new THREE.CanvasTexture(fiberCanvas);
      fiberBump.wrapS = THREE.RepeatWrapping;
      fiberBump.wrapT = THREE.RepeatWrapping;
      fiberBump.repeat.set(52, 2.2);
      fiberBump.anisotropy = renderer.capabilities.getMaxAnisotropy();

      const makeStrand = (phase: number, color: number, radius: number, depthOffset = 0) => {
        const points = [];
        const segments = 220;
        for (let index = 0; index <= segments; index += 1) {
          const t = index / segments;
          const x = -9.4 + t * 18.8;
          const arc = Math.sin(t * Math.PI * 2.02 - 0.82) * 0.72 + Math.sin(t * Math.PI * 4.15 + 0.3) * 0.18;
          const depth = -0.5 + Math.cos(t * Math.PI * 2.2) * 0.2 + depthOffset;
          const twist = t * Math.PI * 14 + phase;
          points.push(new THREE.Vector3(
            x,
            arc + Math.cos(twist) * 0.19,
            depth + Math.sin(twist) * 0.19,
          ));
        }
        const curve = new THREE.CatmullRomCurve3(points);
        const geometry = new THREE.TubeGeometry(curve, segments, radius, 20, false);
        geometry.setDrawRange(0, 0);
        const material = new THREE.MeshPhysicalMaterial({
          color,
          roughness: 0.64,
          metalness: 0,
          clearcoat: 0.08,
          clearcoatRoughness: 0.78,
          sheen: 0.78,
          sheenRoughness: 0.7,
          sheenColor: new THREE.Color(0xd6ffe5),
          bumpMap: fiberBump,
          bumpScale: 0.075,
        });
        const mesh = new THREE.Mesh(geometry, material);
        mesh.castShadow = true;
        mesh.receiveShadow = true;
        world.add(mesh);
        return mesh;
      };

      const darkStrand = makeStrand(0, 0x073d27, 0.235, -0.015);
      const greenStrand = makeStrand(Math.PI, 0x00bd58, 0.225, 0.015);
      const limeThread = makeStrand(Math.PI * 0.5, 0xbfff55, 0.052, 0.16);

      const sealShape = new THREE.Shape();
      const sealPoints = 180;
      for (let index = 0; index <= sealPoints; index += 1) {
        const angle = (index / sealPoints) * Math.PI * 2;
        const scallop = Math.sin(angle * 13 + 0.2) * 0.032;
        const organic = Math.sin(angle * 4 + 1.4) * 0.022 + Math.sin(angle * 7 - 0.5) * 0.014;
        const radius = 1 + scallop + organic;
        const x = Math.cos(angle) * radius;
        const y = Math.sin(angle) * radius;
        if (index === 0) sealShape.moveTo(x, y);
        else sealShape.lineTo(x, y);
      }
      const sealGeometry = new THREE.ExtrudeGeometry(sealShape, {
        depth: 0.15,
        bevelEnabled: true,
        bevelSegments: 7,
        steps: 1,
        bevelSize: 0.055,
        bevelThickness: 0.048,
      });
      sealGeometry.center();

      const sealCanvas = document.createElement("canvas");
      sealCanvas.width = 256;
      sealCanvas.height = 256;
      const sealContext = sealCanvas.getContext("2d");
      if (sealContext) {
        sealContext.fillStyle = "#8a8a8a";
        sealContext.fillRect(0, 0, 256, 256);
        for (let index = 0; index < 1300; index += 1) {
          const x = (index * 73) % 256;
          const y = (index * 131) % 256;
          const size = 0.35 + (index % 5) * 0.25;
          const tone = 90 + (index * 19) % 110;
          sealContext.fillStyle = `rgb(${tone},${tone},${tone})`;
          sealContext.beginPath();
          sealContext.arc(x, y, size, 0, Math.PI * 2);
          sealContext.fill();
        }
      }
      const sealBump = new THREE.CanvasTexture(sealCanvas);
      sealBump.wrapS = THREE.RepeatWrapping;
      sealBump.wrapT = THREE.RepeatWrapping;
      sealBump.repeat.set(3.2, 3.2);

      const waxMaterial = new THREE.MeshPhysicalMaterial({
        color: 0x789b2e,
        roughness: 0.92,
        metalness: 0,
        clearcoat: 0,
        sheen: 0.2,
        sheenColor: new THREE.Color(0xe6ffad),
        bumpMap: sealBump,
        bumpScale: 0.065,
      });
      const seal = new THREE.Mesh(sealGeometry, waxMaterial);
      seal.position.set(-0.25, -0.05, 0.72);
      seal.rotation.set(-0.05, 0.08, -0.12);
      seal.scale.setScalar(0.001);
      seal.castShadow = true;
      world.add(seal);

      const sealMark = new THREE.Group();
      sealMark.position.set(-0.25, -0.05, 0.875);
      sealMark.rotation.z = -0.12;
      sealMark.scale.setScalar(0.001);
      const insetMaterial = new THREE.MeshPhysicalMaterial({ color: 0x668425, roughness: 0.96, bumpMap: sealBump, bumpScale: 0.05 });
      const markMaterial = new THREE.MeshPhysicalMaterial({ color: 0x314714, roughness: 0.9, metalness: 0 });
      const inset = new THREE.Mesh(new THREE.CircleGeometry(0.78, 96), insetMaterial);
      const outerRing = new THREE.Mesh(new THREE.TorusGeometry(0.69, 0.027, 12, 96), markMaterial);
      outerRing.position.z = 0.012;
      const innerRing = new THREE.Mesh(new THREE.TorusGeometry(0.52, 0.012, 10, 80), markMaterial);
      innerRing.position.z = 0.014;
      const tickGeometry = new THREE.BoxGeometry(0.012, 0.07, 0.026);
      const tickMarks = new THREE.InstancedMesh(tickGeometry, markMaterial, 44);
      const tickTransform = new THREE.Object3D();
      for (let index = 0; index < 44; index += 1) {
        const angle = (index / 44) * Math.PI * 2;
        tickTransform.position.set(Math.cos(angle) * 0.61, Math.sin(angle) * 0.61, 0.018);
        tickTransform.rotation.z = angle - Math.PI / 2;
        tickTransform.updateMatrix();
        tickMarks.setMatrixAt(index, tickTransform.matrix);
      }
      tickMarks.instanceMatrix.needsUpdate = true;
      const vLeft = new THREE.Mesh(new THREE.BoxGeometry(0.13, 0.6, 0.055), markMaterial);
      const vRight = new THREE.Mesh(new THREE.BoxGeometry(0.13, 0.6, 0.055), markMaterial);
      vLeft.position.set(-0.13, 0.035, 0.025);
      vRight.position.set(0.13, 0.035, 0.025);
      vLeft.rotation.z = 0.43;
      vRight.rotation.z = -0.43;
      sealMark.add(inset, outerRing, innerRing, tickMarks, vLeft, vRight);
      world.add(sealMark);

      const particlesGeometry = new THREE.BufferGeometry();
      const particleCount = 44;
      const particlePositions = new Float32Array(particleCount * 3);
      for (let index = 0; index < particleCount; index += 1) {
        particlePositions[index * 3] = ((index * 83) % 100) / 100 * 14 - 7;
        particlePositions[index * 3 + 1] = ((index * 47) % 100) / 100 * 6 - 3;
        particlePositions[index * 3 + 2] = ((index * 29) % 100) / 100 * 3 - 1.5;
      }
      particlesGeometry.setAttribute("position", new THREE.BufferAttribute(particlePositions, 3));
      const particles = new THREE.Points(
        particlesGeometry,
        new THREE.PointsMaterial({ color: 0x00bc5a, size: 0.032, transparent: true, opacity: 0.32 }),
      );
      world.add(particles);

      const pointer = { x: 0, y: 0, targetX: 0, targetY: 0 };
      const onPointerMove = (event: PointerEvent) => {
        const bounds = hero.getBoundingClientRect();
        pointer.targetX = ((event.clientX - bounds.left) / bounds.width - 0.5) * 2;
        pointer.targetY = ((event.clientY - bounds.top) / bounds.height - 0.5) * 2;
        hero.style.setProperty("--hero-x", pointer.targetX.toFixed(3));
        hero.style.setProperty("--hero-y", pointer.targetY.toFixed(3));
      };
      const onPointerLeave = () => {
        pointer.targetX = 0;
        pointer.targetY = 0;
        hero.style.setProperty("--hero-x", "0");
        hero.style.setProperty("--hero-y", "0");
      };
      hero.addEventListener("pointermove", onPointerMove, { passive: true });
      hero.addEventListener("pointerleave", onPointerLeave);

      const resize = () => {
        const bounds = hero.getBoundingClientRect();
        const width = Math.max(1, bounds.width);
        const height = Math.max(1, bounds.height);
        renderer.setSize(width, height, false);
        camera.aspect = width / height;
        camera.fov = width < 760 ? 44 : 30;
        camera.updateProjectionMatrix();
        world.position.x = width < 760 ? 0 : 1.15;
        world.position.y = width < 760 ? -1.85 : -0.12;
        world.scale.setScalar(width < 760 ? 0.68 : width < 1120 ? 0.87 : 1);
      };
      const resizeObserver = new ResizeObserver(resize);
      resizeObserver.observe(hero);
      resize();

      let visible = true;
      const visibilityObserver = new IntersectionObserver(([entry]) => { visible = entry.isIntersecting; }, { threshold: 0.02 });
      visibilityObserver.observe(hero);

      const startedAt = performance.now();
      let animationFrame = 0;
      const render = (now: number) => {
        if (disposed) return;
        animationFrame = requestAnimationFrame(render);
        if (!visible && !reducedMotion) return;

        const elapsed = reducedMotion ? 20 : (now - startedAt) / 1000;
        const strandProgress = [
          easeOut(elapsed / 5.25),
          easeOut((elapsed - 0.28) / 5.25),
          easeOut((elapsed - 0.62) / 4.95),
        ];
        [darkStrand, greenStrand, limeThread].forEach((strand, index) => {
          const count = strand.geometry.index?.count ?? 0;
          strand.geometry.setDrawRange(0, Math.floor(count * strandProgress[index]));
        });

        const sealProgress = easeOut((elapsed - 4.75) / 1.85);
        const sealScale = Math.max(0.001, sealProgress * 0.82);
        seal.scale.setScalar(sealScale);
        sealMark.scale.setScalar(sealScale);

        pointer.x += (pointer.targetX - pointer.x) * 0.035;
        pointer.y += (pointer.targetY - pointer.y) * 0.035;
        world.rotation.y = pointer.x * 0.045;
        world.rotation.x = pointer.y * -0.028;
        seal.rotation.z = -0.12 + Math.sin(elapsed * 0.27) * 0.024;
        sealMark.rotation.z = seal.rotation.z;
        darkStrand.position.y = Math.sin(elapsed * 0.34) * 0.018;
        greenStrand.position.y = Math.sin(elapsed * 0.34 + 1.4) * 0.018;
        limeThread.position.y = Math.sin(elapsed * 0.42 + 2.1) * 0.013;
        particles.rotation.z = elapsed * 0.008;
        greenLight.position.x = 3.5 + Math.sin(elapsed * 0.3) * 0.65;
        renderer.render(scene, camera);
      };
      animationFrame = requestAnimationFrame(render);

      disposeScene = () => {
        cancelAnimationFrame(animationFrame);
        hero.removeEventListener("pointermove", onPointerMove);
        hero.removeEventListener("pointerleave", onPointerLeave);
        resizeObserver.disconnect();
        visibilityObserver.disconnect();
        scene.traverse((object) => {
          if (object instanceof THREE.Mesh || object instanceof THREE.Points || object instanceof THREE.LineSegments) {
            object.geometry.dispose();
            const materials = Array.isArray(object.material) ? object.material : [object.material];
            materials.forEach((material) => material.dispose());
          }
        });
        fiberBump.dispose();
        sealBump.dispose();
        renderer.dispose();
      };
    })();

    return () => {
      disposed = true;
      disposeScene();
    };
  }, []);

  return (
    <section className={styles.hero} ref={heroRef}>
      <canvas ref={canvasRef} className={styles.canvas} aria-hidden="true" />
      <div className={styles.fallbackArtifact} aria-hidden="true">
        <svg className={styles.fallbackCord} viewBox="0 0 1200 700" fill="none">
          <defs>
            <linearGradient id="cord-dark" x1="0" y1="0" x2="1" y2="1"><stop stopColor="#03170e"/><stop offset=".48" stopColor="#0a5633"/><stop offset="1" stopColor="#01130b"/></linearGradient>
            <linearGradient id="cord-green" x1="0" y1="0" x2="1" y2="1"><stop stopColor="#8affae"/><stop offset=".46" stopColor="#00bd59"/><stop offset="1" stopColor="#006534"/></linearGradient>
            <filter id="cord-shadow"><feDropShadow dx="0" dy="18" stdDeviation="13" floodColor="#07562f" floodOpacity=".24"/></filter>
          </defs>
          <path className={styles.cordDark} d="M-90 490 C130 690 250 100 520 280 C760 440 820 70 1280 210" stroke="url(#cord-dark)" strokeWidth="58" strokeLinecap="round" filter="url(#cord-shadow)"/>
          <path className={styles.cordGreen} d="M-90 490 C130 690 250 100 520 280 C760 440 820 70 1280 210" stroke="url(#cord-green)" strokeWidth="34" strokeLinecap="round"/>
          <path className={styles.cordHighlight} d="M-90 481 C130 681 250 91 520 271 C760 431 820 61 1280 201" stroke="rgba(232,255,237,.68)" strokeWidth="5" strokeLinecap="round"/>
        </svg>
        <div className={styles.fallbackSeal}><span><b>V</b><small>VELLUM</small></span></div>
      </div>

      <div className={styles.ambient} aria-hidden="true"><i /><i /><i /></div>

      <div className={styles.copy}>
        <div className={styles.kicker}><span /> Robinhood Chain · Bearer instruments</div>
        <h1><span>Lock the</span><br /><span>position.</span><br /><em>Move the claim.</em></h1>
        <p>A real token balance becomes a portable onchain note — sealed with its amount, term and provenance.</p>
        <div className={styles.actions}>
          <Link href="/app" className={styles.primary}>Create a note <span>↗</span></Link>
          <Link href="/how-it-works" className={styles.secondary}>See how it moves</Link>
        </div>
      </div>

      <div className={styles.ticketStage} aria-hidden="true">
        <i className={styles.ticketShadow} />
        <i className={styles.ticketBack} />
        <article className={styles.ticket}>
          <div className={styles.ticketGrain} />
          <header className={styles.ticketTop}>
            <b>vellum<span>.</span></b>
            <small>BEARER NOTE · ERC-721</small>
            <strong>W/000421</strong>
          </header>
          <div className={styles.ticketBand}>
            <span className={styles.ticketLogo}><TokenLogo symbol="$CASHCAT" color="#147b43" /></span>
            <span><small>UNDERLYING / ROBINHOOD CHAIN</small><b>$CASHCAT</b><em>Cash Cat</em></span>
            <i>VERIFIED</i>
          </div>
          <div className={styles.ticketAmount}>
            <small>POSITION / 01</small>
            <strong>250,000</strong>
            <span>CASHCAT</span>
            <p>≈ $30,150 <i>AT MARK</i></p>
          </div>
          <div className={styles.ticketFacts}>
            <span>ENTRY<b>$0.0870</b></span>
            <span>MARK<b>$0.1206</b></span>
            <span>TERM<b>90 DAYS</b></span>
          </div>
          <div className={styles.ticketSealBar}><span>✦</span> SEALED UNTIL 04 NOV 2026 <b>ACTIVE</b></div>
          <footer className={styles.ticketFoot}>
            <p>WHOEVER HOLDS THIS NOTE HOLDS THE CLAIM.</p>
            <span>PAYABLE TO BEARER</span><span>0x020b…18b4</span>
          </footer>
          <i className={styles.ticketScan} />
        </article>
      </div>

      <div className={styles.objectLabels} aria-hidden="true">
        <span className={styles.labelOne}>01 / POSITION SEALED</span>
        <span className={styles.labelTwo}>02 / NOTE FORMED</span>
        <span className={styles.labelThree}>03 / CLAIM PORTABLE</span>
      </div>

      <div className={styles.metrics}>
        <span><b>$119.2M</b> routed value</span>
        <span><b>18,421</b> live block</span>
        <span><b>12s</b> finality</span>
      </div>
      <div className={styles.scroll}>Scroll to enter <i /> ↓</div>
    </section>
  );
}
