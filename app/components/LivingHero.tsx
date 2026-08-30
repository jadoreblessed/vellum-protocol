"use client";

import Link from "next/link";
import { useEffect, useRef } from "react";
import styles from "./LivingHero.module.css";

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
      const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true, powerPreference: "high-performance" });
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.55));
      renderer.outputColorSpace = THREE.SRGBColorSpace;
      renderer.toneMapping = THREE.ACESFilmicToneMapping;
      renderer.toneMappingExposure = 1.12;
      renderer.shadowMap.enabled = true;
      renderer.shadowMap.type = THREE.PCFSoftShadowMap;

      const scene = new THREE.Scene();
      const camera = new THREE.PerspectiveCamera(31, 1, 0.1, 100);
      camera.position.set(0, 0, 11.5);

      const world = new THREE.Group();
      world.position.set(1.7, -0.05, 0);
      scene.add(world);

      scene.add(new THREE.HemisphereLight(0xffffff, 0x5d806b, 2.5));
      const key = new THREE.DirectionalLight(0xffffff, 5.1);
      key.position.set(-4, 7, 8);
      key.castShadow = true;
      scene.add(key);
      const greenLight = new THREE.PointLight(0x00e86a, 11, 12, 2);
      greenLight.position.set(3.3, -1.1, 4);
      scene.add(greenLight);
      const rimLight = new THREE.PointLight(0xc9ff62, 8, 10, 2);
      rimLight.position.set(-2.5, 1.7, 2.5);
      scene.add(rimLight);

      const floor = new THREE.Mesh(
        new THREE.PlaneGeometry(22, 13),
        new THREE.ShadowMaterial({ color: 0x0a4a25, opacity: 0.11 }),
      );
      floor.rotation.x = -Math.PI / 2;
      floor.position.set(1.5, -3.1, -1.2);
      floor.receiveShadow = true;
      world.add(floor);

      const makeStrand = (phase: number, color: number, radius: number) => {
        const points = [];
        const segments = 180;
        for (let index = 0; index <= segments; index += 1) {
          const t = index / segments;
          const x = -7.2 + t * 14.4;
          const baseY = 0.62 * Math.sin(t * Math.PI * 2.05 - 0.65) + 0.22 * Math.sin(t * Math.PI * 4.4);
          const baseZ = -0.45 + 0.18 * Math.cos(t * Math.PI * 2.2);
          const twist = t * Math.PI * 13 + phase;
          points.push(new THREE.Vector3(
            x,
            baseY + Math.cos(twist) * 0.15,
            baseZ + Math.sin(twist) * 0.15,
          ));
        }
        const curve = new THREE.CatmullRomCurve3(points);
        const geometry = new THREE.TubeGeometry(curve, segments, radius, 14, false);
        geometry.setDrawRange(0, 0);
        const material = new THREE.MeshPhysicalMaterial({
          color,
          roughness: 0.29,
          metalness: 0.08,
          clearcoat: 0.85,
          clearcoatRoughness: 0.2,
          sheen: 0.9,
          sheenColor: new THREE.Color(0xc8ffdb),
        });
        const mesh = new THREE.Mesh(geometry, material);
        mesh.castShadow = true;
        mesh.receiveShadow = true;
        world.add(mesh);
        return mesh;
      };

      const darkStrand = makeStrand(0, 0x073c25, 0.17);
      const greenStrand = makeStrand(Math.PI, 0x00c85a, 0.16);
      const thread = makeStrand(Math.PI * 0.5, 0xbaff58, 0.035);

      const sealShape = new THREE.Shape();
      const sealPoints = 96;
      for (let index = 0; index <= sealPoints; index += 1) {
        const angle = (index / sealPoints) * Math.PI * 2;
        const radius = 1 + Math.sin(angle * 11) * 0.055 + Math.sin(angle * 5 + 1.4) * 0.035;
        const x = Math.cos(angle) * radius;
        const y = Math.sin(angle) * radius;
        if (index === 0) sealShape.moveTo(x, y);
        else sealShape.lineTo(x, y);
      }

      const sealGeometry = new THREE.ExtrudeGeometry(sealShape, {
        depth: 0.22,
        bevelEnabled: true,
        bevelSegments: 5,
        steps: 1,
        bevelSize: 0.09,
        bevelThickness: 0.08,
      });
      sealGeometry.center();
      const seal = new THREE.Mesh(
        sealGeometry,
        new THREE.MeshPhysicalMaterial({ color: 0x079b4a, roughness: 0.48, clearcoat: 0.36, clearcoatRoughness: 0.38 }),
      );
      seal.position.set(0.55, -0.05, 0.55);
      seal.rotation.set(-0.07, 0.1, -0.13);
      seal.scale.setScalar(0.01);
      seal.castShadow = true;
      world.add(seal);

      const makeSealTexture = () => {
        const textureCanvas = document.createElement("canvas");
        textureCanvas.width = 512;
        textureCanvas.height = 512;
        const context = textureCanvas.getContext("2d");
        if (!context) return null;
        context.clearRect(0, 0, 512, 512);
        context.strokeStyle = "rgba(226,255,231,.88)";
        context.lineWidth = 10;
        context.beginPath();
        context.arc(256, 256, 190, 0, Math.PI * 2);
        context.stroke();
        context.strokeStyle = "rgba(3,83,39,.55)";
        context.lineWidth = 5;
        context.beginPath();
        context.arc(256, 256, 167, 0, Math.PI * 2);
        context.stroke();
        context.fillStyle = "#f0fff2";
        context.textAlign = "center";
        context.textBaseline = "middle";
        context.font = "700 238px Arial";
        context.fillText("V", 246, 235);
        context.font = "700 31px monospace";
        context.letterSpacing = "11px";
        context.fillText("VELLUM", 260, 385);
        const texture = new THREE.CanvasTexture(textureCanvas);
        texture.colorSpace = THREE.SRGBColorSpace;
        texture.anisotropy = renderer.capabilities.getMaxAnisotropy();
        return texture;
      };

      const sealTexture = makeSealTexture();
      const sealFace = new THREE.Mesh(
        new THREE.CircleGeometry(0.83, 64),
        new THREE.MeshBasicMaterial({ map: sealTexture ?? undefined, transparent: true, depthWrite: false }),
      );
      sealFace.position.set(0.55, -0.05, 0.72);
      sealFace.rotation.z = -0.13;
      sealFace.scale.setScalar(0.01);
      world.add(sealFace);

      const makeNoteTexture = () => {
        const textureCanvas = document.createElement("canvas");
        textureCanvas.width = 900;
        textureCanvas.height = 1180;
        const context = textureCanvas.getContext("2d");
        if (!context) return null;
        context.fillStyle = "#f5f4eb";
        context.fillRect(0, 0, 900, 1180);
        context.strokeStyle = "#121812";
        context.lineWidth = 3;
        context.strokeRect(25, 25, 850, 1130);
        context.fillStyle = "#101510";
        context.font = "700 47px Arial";
        context.fillText("vellum", 65, 92);
        context.font = "24px monospace";
        context.fillText("BEARER NOTE · W/000421", 390, 88);
        context.fillStyle = "#087b42";
        context.fillRect(60, 145, 780, 220);
        context.fillStyle = "#effff2";
        context.font = "700 52px Arial";
        context.fillText("$CASHCAT", 190, 235);
        context.font = "24px monospace";
        context.fillText("ROBINHOOD CHAIN", 190, 310);
        context.fillStyle = "#4be382";
        context.beginPath();
        context.arc(120, 255, 38, 0, Math.PI * 2);
        context.fill();
        context.fillStyle = "#151915";
        context.font = "22px monospace";
        context.fillText("POSITION", 65, 440);
        context.font = "700 104px Arial";
        context.fillText("250,000", 58, 570);
        context.font = "28px monospace";
        context.fillText("≈ $30,150  AT MARK", 65, 625);
        context.strokeStyle = "#253025";
        context.beginPath();
        context.moveTo(65, 680);
        context.lineTo(835, 680);
        context.stroke();
        context.font = "21px monospace";
        context.fillStyle = "#556055";
        context.fillText("ENTRY", 65, 735);
        context.fillText("TERM", 500, 735);
        context.fillStyle = "#111711";
        context.font = "35px monospace";
        context.fillText("$0.0870", 65, 785);
        context.fillText("90 DAYS", 500, 785);
        context.fillStyle = "#baff00";
        context.fillRect(35, 850, 830, 94);
        context.fillStyle = "#101510";
        context.font = "700 25px monospace";
        context.fillText("SEALED UNTIL 04 NOV 2026", 78, 909);
        context.font = "20px monospace";
        context.fillText("WHOEVER HOLDS THIS NOTE HOLDS THE CLAIM.", 65, 1040);
        const texture = new THREE.CanvasTexture(textureCanvas);
        texture.colorSpace = THREE.SRGBColorSpace;
        texture.anisotropy = renderer.capabilities.getMaxAnisotropy();
        return texture;
      };

      const card = new THREE.Group();
      const cardBack = new THREE.Mesh(
        new THREE.BoxGeometry(2.52, 3.32, 0.11),
        new THREE.MeshPhysicalMaterial({ color: 0xecece1, roughness: 0.52, clearcoat: 0.2 }),
      );
      cardBack.castShadow = true;
      card.add(cardBack);
      const noteTexture = makeNoteTexture();
      const cardFace = new THREE.Mesh(
        new THREE.PlaneGeometry(2.45, 3.24),
        new THREE.MeshPhysicalMaterial({ map: noteTexture ?? undefined, roughness: 0.58, clearcoat: 0.15 }),
      );
      cardFace.position.z = 0.061;
      card.add(cardFace);
      card.position.set(3.35, -0.1, -4.2);
      card.rotation.set(0.26, -0.45, 0.16);
      card.scale.setScalar(0.72);
      world.add(card);

      const particlesGeometry = new THREE.BufferGeometry();
      const particleCount = 56;
      const particlePositions = new Float32Array(particleCount * 3);
      for (let index = 0; index < particleCount; index += 1) {
        particlePositions[index * 3] = (Math.random() - 0.5) * 12;
        particlePositions[index * 3 + 1] = (Math.random() - 0.5) * 5;
        particlePositions[index * 3 + 2] = (Math.random() - 0.5) * 3;
      }
      particlesGeometry.setAttribute("position", new THREE.BufferAttribute(particlePositions, 3));
      const particles = new THREE.Points(
        particlesGeometry,
        new THREE.PointsMaterial({ color: 0x00c85a, size: 0.035, transparent: true, opacity: 0.42 }),
      );
      world.add(particles);

      const pointer = { x: 0, y: 0, targetX: 0, targetY: 0 };
      const onPointerMove = (event: PointerEvent) => {
        const bounds = hero.getBoundingClientRect();
        pointer.targetX = ((event.clientX - bounds.left) / bounds.width - 0.5) * 2;
        pointer.targetY = ((event.clientY - bounds.top) / bounds.height - 0.5) * 2;
      };
      const onPointerLeave = () => { pointer.targetX = 0; pointer.targetY = 0; };
      hero.addEventListener("pointermove", onPointerMove, { passive: true });
      hero.addEventListener("pointerleave", onPointerLeave);

      const resize = () => {
        const bounds = hero.getBoundingClientRect();
        const width = Math.max(1, bounds.width);
        const height = Math.max(1, bounds.height);
        renderer.setSize(width, height, false);
        camera.aspect = width / height;
        camera.fov = width < 760 ? 42 : 31;
        camera.updateProjectionMatrix();
        world.position.x = width < 760 ? 0.2 : 1.7;
        world.position.y = width < 760 ? -1.7 : -0.05;
        world.scale.setScalar(width < 760 ? 0.72 : width < 1120 ? 0.88 : 1);
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

        const elapsed = reducedMotion ? 8 : (now - startedAt) / 1000;
        const ropeProgress = easeOut(elapsed / 1.65);
        for (const strand of [darkStrand, greenStrand, thread]) {
          const count = strand.geometry.index?.count ?? 0;
          strand.geometry.setDrawRange(0, Math.floor(count * ropeProgress));
        }

        const sealProgress = easeOut((elapsed - 0.95) / 1.05);
        seal.scale.setScalar(Math.max(0.001, sealProgress));
        sealFace.scale.setScalar(Math.max(0.001, sealProgress));

        const cardProgress = easeOut((elapsed - 1.85) / 1.25);
        card.position.z = THREE.MathUtils.lerp(-4.2, 1.08, cardProgress);
        card.position.y = THREE.MathUtils.lerp(-0.5, 0.12, cardProgress);
        card.rotation.x = THREE.MathUtils.lerp(0.52, -0.04, cardProgress);
        card.rotation.y = THREE.MathUtils.lerp(-0.72, -0.16, cardProgress);
        card.rotation.z = THREE.MathUtils.lerp(0.28, 0.055, cardProgress);
        card.scale.setScalar(THREE.MathUtils.lerp(0.72, 1, cardProgress));

        pointer.x += (pointer.targetX - pointer.x) * 0.045;
        pointer.y += (pointer.targetY - pointer.y) * 0.045;
        const drift = elapsed * 0.34;
        world.rotation.y = pointer.x * 0.055;
        world.rotation.x = pointer.y * -0.035;
        seal.rotation.z = -0.13 + Math.sin(drift) * 0.035;
        sealFace.rotation.z = seal.rotation.z;
        card.position.y += Math.sin(elapsed * 0.72) * 0.055 * cardProgress;
        card.rotation.z += Math.sin(elapsed * 0.5) * 0.012 * cardProgress;
        particles.rotation.z = elapsed * 0.012;
        greenLight.position.x = 3.3 + Math.sin(elapsed * 0.43) * 0.7;

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
          if (object instanceof THREE.Mesh || object instanceof THREE.Points) {
            object.geometry.dispose();
            const materials = Array.isArray(object.material) ? object.material : [object.material];
            materials.forEach((material) => material.dispose());
          }
        });
        sealTexture?.dispose();
        noteTexture?.dispose();
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
