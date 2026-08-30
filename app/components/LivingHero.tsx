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
          const x = -8.6 + t * 17.2;
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
      const sealPoints = 128;
      for (let index = 0; index <= sealPoints; index += 1) {
        const angle = (index / sealPoints) * Math.PI * 2;
        const radius = 1 + Math.sin(angle * 3 + 0.4) * 0.025 + Math.sin(angle * 5 + 1.7) * 0.018 + Math.sin(angle * 8 + 0.2) * 0.01;
        const x = Math.cos(angle) * radius;
        const y = Math.sin(angle) * radius;
        if (index === 0) sealShape.moveTo(x, y);
        else sealShape.lineTo(x, y);
      }

      const sealGeometry = new THREE.ExtrudeGeometry(sealShape, {
        depth: 0.11,
        bevelEnabled: true,
        bevelSegments: 8,
        steps: 1,
        bevelSize: 0.065,
        bevelThickness: 0.05,
      });
      sealGeometry.center();

      const bumpCanvas = document.createElement("canvas");
      bumpCanvas.width = 192;
      bumpCanvas.height = 192;
      const bumpContext = bumpCanvas.getContext("2d");
      if (bumpContext) {
        const imageData = bumpContext.createImageData(192, 192);
        for (let index = 0; index < imageData.data.length; index += 4) {
          const seed = ((index * 17 + Math.floor(index / 97) * 31) % 37) / 36;
          const tone = Math.floor(102 + seed * 66);
          imageData.data[index] = tone;
          imageData.data[index + 1] = tone;
          imageData.data[index + 2] = tone;
          imageData.data[index + 3] = 255;
        }
        bumpContext.putImageData(imageData, 0, 0);
      }
      const sealBump = new THREE.CanvasTexture(bumpCanvas);
      sealBump.wrapS = THREE.RepeatWrapping;
      sealBump.wrapT = THREE.RepeatWrapping;
      sealBump.repeat.set(2.4, 2.4);

      const seal = new THREE.Mesh(
        sealGeometry,
        new THREE.MeshPhysicalMaterial({
          color: 0xa5c94c,
          roughness: 0.78,
          metalness: 0.02,
          clearcoat: 0.08,
          clearcoatRoughness: 0.86,
          bumpMap: sealBump,
          bumpScale: 0.035,
        }),
      );
      seal.position.set(0.25, -0.08, 0.55);
      seal.rotation.set(-0.04, 0.08, -0.1);
      seal.scale.setScalar(0.01);
      seal.castShadow = true;
      world.add(seal);

      const sealMark = new THREE.Group();
      sealMark.position.set(0.25, -0.08, 0.7);
      sealMark.rotation.z = -0.1;
      sealMark.scale.setScalar(0.01);
      const insetMaterial = new THREE.MeshPhysicalMaterial({ color: 0x8eaf3d, roughness: 0.82, bumpMap: sealBump, bumpScale: 0.025 });
      const inset = new THREE.Mesh(new THREE.CylinderGeometry(0.76, 0.79, 0.035, 96), insetMaterial);
      inset.rotation.x = Math.PI / 2;
      inset.position.z = -0.025;
      const markMaterial = new THREE.MeshPhysicalMaterial({ color: 0x667f28, roughness: 0.72, metalness: 0.03 });
      const outerRing = new THREE.Mesh(new THREE.TorusGeometry(0.7, 0.027, 12, 96), markMaterial);
      const innerRing = new THREE.Mesh(new THREE.TorusGeometry(0.54, 0.015, 10, 80), markMaterial);
      const tickGeometry = new THREE.BoxGeometry(0.012, 0.08, 0.025);
      const tickMarks = new THREE.InstancedMesh(tickGeometry, markMaterial, 48);
      const tickTransform = new THREE.Object3D();
      for (let index = 0; index < 48; index += 1) {
        const angle = (index / 48) * Math.PI * 2;
        tickTransform.position.set(Math.cos(angle) * 0.62, Math.sin(angle) * 0.62, 0.005);
        tickTransform.rotation.z = angle - Math.PI / 2;
        tickTransform.updateMatrix();
        tickMarks.setMatrixAt(index, tickTransform.matrix);
      }
      tickMarks.instanceMatrix.needsUpdate = true;
      const vLeft = new THREE.Mesh(new THREE.BoxGeometry(0.14, 0.62, 0.055), markMaterial);
      const vRight = new THREE.Mesh(new THREE.BoxGeometry(0.14, 0.62, 0.055), markMaterial);
      vLeft.position.set(-0.13, 0.04, 0.02);
      vRight.position.set(0.13, 0.04, 0.02);
      vLeft.rotation.z = 0.42;
      vRight.rotation.z = -0.42;
      sealMark.add(inset, outerRing, innerRing, tickMarks, vLeft, vRight);
      world.add(sealMark);

      const makeNoteTexture = () => {
        const textureCanvas = document.createElement("canvas");
        textureCanvas.width = 1800;
        textureCanvas.height = 2360;
        const context = textureCanvas.getContext("2d");
        if (!context) return null;
        context.scale(2, 2);
        context.fillStyle = "#f6f1e5";
        context.fillRect(0, 0, 900, 1180);
        const paperGradient = context.createRadialGradient(160, 110, 30, 440, 570, 820);
        paperGradient.addColorStop(0, "rgba(255,255,255,.68)");
        paperGradient.addColorStop(0.5, "rgba(250,247,235,.08)");
        paperGradient.addColorStop(1, "rgba(129,111,70,.08)");
        context.fillStyle = paperGradient;
        context.fillRect(0, 0, 900, 1180);
        context.strokeStyle = "#121812";
        context.lineWidth = 4;
        context.strokeRect(24, 24, 852, 1132);
        context.lineWidth = 1;
        context.strokeRect(36, 36, 828, 1108);
        context.fillStyle = "#101510";
        context.font = "700 50px Arial";
        context.fillText("vellum.", 62, 96);
        context.font = "22px monospace";
        context.fillText("BEARER NOTE", 390, 81);
        context.font = "700 21px monospace";
        context.fillText("W/000421", 695, 81);
        context.strokeStyle = "#182018";
        context.lineWidth = 2;
        context.beginPath();
        context.moveTo(60, 118);
        context.lineTo(840, 118);
        context.stroke();
        context.fillStyle = "#0d713c";
        context.fillRect(58, 153, 784, 218);
        context.strokeStyle = "rgba(247,255,239,.62)";
        context.lineWidth = 2;
        context.strokeRect(73, 168, 754, 188);
        context.fillStyle = "#f7ffef";
        context.font = "700 54px Arial";
        context.fillText("$CASHCAT", 202, 246);
        context.font = "700 22px monospace";
        context.fillText("CASH CAT · UNDERLYING", 202, 292);
        context.font = "20px monospace";
        context.fillText("ROBINHOOD CHAIN", 202, 329);
        context.fillStyle = "#eaf1d8";
        context.beginPath();
        context.arc(133, 260, 51, 0, Math.PI * 2);
        context.fill();
        context.fillStyle = "#0d713c";
        context.beginPath();
        context.moveTo(104, 244);
        context.lineTo(116, 216);
        context.lineTo(133, 236);
        context.lineTo(151, 216);
        context.lineTo(163, 244);
        context.quadraticCurveTo(164, 292, 133, 296);
        context.quadraticCurveTo(102, 292, 104, 244);
        context.fill();
        context.fillStyle = "#eaf1d8";
        context.beginPath();
        context.arc(119, 259, 3.5, 0, Math.PI * 2);
        context.arc(147, 259, 3.5, 0, Math.PI * 2);
        context.fill();
        context.fillStyle = "#151915";
        context.font = "700 20px monospace";
        context.fillText("POSITION / 01", 65, 440);
        context.font = "700 108px Arial";
        context.fillText("250,000", 58, 568);
        context.font = "26px monospace";
        context.fillText("CASHCAT", 642, 556);
        context.font = "24px monospace";
        context.fillText("≈ $30,150   AT MARK", 65, 624);
        context.strokeStyle = "#253025";
        context.lineWidth = 2;
        context.beginPath();
        context.moveTo(62, 670);
        context.lineTo(838, 670);
        context.stroke();
        context.font = "19px monospace";
        context.fillStyle = "#556055";
        context.fillText("ENTRY", 65, 723);
        context.fillText("MARK", 338, 723);
        context.fillText("TERM", 615, 723);
        context.fillStyle = "#111711";
        context.font = "31px monospace";
        context.fillText("$0.0870", 65, 773);
        context.fillText("$0.1206", 338, 773);
        context.fillText("90 DAYS", 615, 773);
        context.strokeStyle = "rgba(37,48,37,.38)";
        context.lineWidth = 1;
        context.beginPath();
        context.moveTo(303, 688);
        context.lineTo(303, 803);
        context.moveTo(579, 688);
        context.lineTo(579, 803);
        context.stroke();
        context.fillStyle = "#b7dd41";
        context.fillRect(34, 842, 832, 100);
        context.strokeStyle = "#111711";
        context.strokeRect(34, 842, 832, 100);
        context.fillStyle = "#101510";
        context.font = "700 24px monospace";
        context.fillText("◫  SEALED UNTIL 04 NOV 2026", 72, 902);
        context.strokeStyle = "rgba(17,23,17,.48)";
        context.beginPath();
        context.moveTo(62, 1000);
        context.lineTo(838, 1000);
        context.stroke();
        context.font = "700 18px monospace";
        context.fillText("WHOEVER HOLDS THIS NOTE HOLDS THE CLAIM.", 65, 1044);
        context.fillStyle = "#566056";
        context.font = "17px monospace";
        context.fillText("PAYABLE TO BEARER", 65, 1100);
        context.fillText("0x020b…18b4", 658, 1100);
        context.strokeStyle = "rgba(28,42,30,.13)";
        context.lineWidth = 1;
        for (let index = 0; index < 58; index += 1) {
          const x = (index * 137) % 850 + 25;
          const y = (index * 211) % 1110 + 25;
          context.beginPath();
          context.moveTo(x, y);
          context.lineTo(x + 2 + (index % 4), y);
          context.stroke();
        }
        const texture = new THREE.CanvasTexture(textureCanvas);
        texture.colorSpace = THREE.SRGBColorSpace;
        texture.anisotropy = renderer.capabilities.getMaxAnisotropy();
        texture.minFilter = THREE.LinearMipmapLinearFilter;
        texture.magFilter = THREE.LinearFilter;
        return texture;
      };

      const ticketWidth = 2.7;
      const ticketHeight = 3.54;
      const halfWidth = ticketWidth / 2;
      const halfHeight = ticketHeight / 2;
      const ticketShape = new THREE.Shape();
      ticketShape.moveTo(-halfWidth + 0.12, -halfHeight);
      ticketShape.lineTo(-0.22, -halfHeight);
      ticketShape.quadraticCurveTo(0, -halfHeight + 0.22, 0.22, -halfHeight);
      ticketShape.lineTo(halfWidth - 0.12, -halfHeight);
      ticketShape.quadraticCurveTo(halfWidth, -halfHeight, halfWidth, -halfHeight + 0.12);
      ticketShape.lineTo(halfWidth, halfHeight - 0.12);
      ticketShape.quadraticCurveTo(halfWidth, halfHeight, halfWidth - 0.12, halfHeight);
      ticketShape.lineTo(0.22, halfHeight);
      ticketShape.quadraticCurveTo(0, halfHeight - 0.22, -0.22, halfHeight);
      ticketShape.lineTo(-halfWidth + 0.12, halfHeight);
      ticketShape.quadraticCurveTo(-halfWidth, halfHeight, -halfWidth, halfHeight - 0.12);
      ticketShape.lineTo(-halfWidth, -halfHeight + 0.12);
      ticketShape.quadraticCurveTo(-halfWidth, -halfHeight, -halfWidth + 0.12, -halfHeight);

      const card = new THREE.Group();
      const cardBack = new THREE.Mesh(
        new THREE.ExtrudeGeometry(ticketShape, { depth: 0.09, bevelEnabled: true, bevelSegments: 4, bevelSize: 0.025, bevelThickness: 0.025 }),
        new THREE.MeshPhysicalMaterial({ color: 0xe7e2d5, roughness: 0.76, clearcoat: 0.08 }),
      );
      cardBack.geometry.center();
      cardBack.castShadow = true;
      card.add(cardBack);
      const noteTexture = makeNoteTexture();
      const faceGeometry = new THREE.ShapeGeometry(ticketShape, 20);
      const positionAttribute = faceGeometry.getAttribute("position");
      const uvs = new Float32Array(positionAttribute.count * 2);
      for (let index = 0; index < positionAttribute.count; index += 1) {
        uvs[index * 2] = positionAttribute.getX(index) / ticketWidth + 0.5;
        uvs[index * 2 + 1] = positionAttribute.getY(index) / ticketHeight + 0.5;
      }
      faceGeometry.setAttribute("uv", new THREE.BufferAttribute(uvs, 2));
      const cardFace = new THREE.Mesh(
        faceGeometry,
        new THREE.MeshPhysicalMaterial({ map: noteTexture ?? undefined, roughness: 0.58, clearcoat: 0.15 }),
      );
      cardFace.position.z = 0.071;
      card.add(cardFace);
      const cardEdge = new THREE.LineSegments(
        new THREE.EdgesGeometry(faceGeometry, 24),
        new THREE.LineBasicMaterial({ color: 0x151a15, transparent: true, opacity: 0.72 }),
      );
      cardEdge.position.z = 0.078;
      card.add(cardEdge);
      const scanMaterial = new THREE.MeshBasicMaterial({
        color: 0xc7ff43,
        transparent: true,
        opacity: 0,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
      });
      const cardScan = new THREE.Mesh(new THREE.PlaneGeometry(2.5, 0.045), scanMaterial);
      cardScan.position.set(0, 1.48, 0.085);
      card.add(cardScan);
      card.position.set(1.45, -0.1, -4.2);
      card.rotation.set(0.26, -0.45, 0.16);
      card.scale.setScalar(0.68);
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
        world.position.x = width < 760 ? 0.1 : 1.25;
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

        const elapsed = reducedMotion ? 14 : (now - startedAt) / 1000;
        const strandProgress = [
          easeOut(elapsed / 3.35),
          easeOut((elapsed - 0.16) / 3.35),
          easeOut((elapsed - 0.34) / 3.2),
        ];
        [darkStrand, greenStrand, thread].forEach((strand, index) => {
          const count = strand.geometry.index?.count ?? 0;
          strand.geometry.setDrawRange(0, Math.floor(count * strandProgress[index]));
        });

        const sealProgress = easeOut((elapsed - 3.3) / 1.5);
        seal.scale.setScalar(Math.max(0.001, sealProgress * 0.78));
        sealMark.scale.setScalar(Math.max(0.001, sealProgress * 0.78));

        const cardProgress = easeOut((elapsed - 4.9) / 1.85);
        card.position.z = THREE.MathUtils.lerp(-4.2, 1.18, cardProgress);
        card.position.y = THREE.MathUtils.lerp(-0.5, 0.08, cardProgress);
        card.rotation.x = THREE.MathUtils.lerp(0.52, -0.04, cardProgress);
        card.rotation.y = THREE.MathUtils.lerp(-0.72, -0.16, cardProgress);
        card.rotation.z = THREE.MathUtils.lerp(0.28, 0.055, cardProgress);
        card.scale.setScalar(THREE.MathUtils.lerp(0.64, 0.88, cardProgress));

        const scanProgress = clamp01((elapsed - 6.35) / 1.4);
        cardScan.position.y = THREE.MathUtils.lerp(1.48, -1.48, scanProgress);
        scanMaterial.opacity = Math.sin(scanProgress * Math.PI) * 0.72 * cardProgress;

        pointer.x += (pointer.targetX - pointer.x) * 0.045;
        pointer.y += (pointer.targetY - pointer.y) * 0.045;
        const drift = elapsed * 0.34;
        world.rotation.y = pointer.x * 0.055;
        world.rotation.x = pointer.y * -0.035;
        seal.rotation.z = -0.13 + Math.sin(drift) * 0.035;
        sealMark.rotation.z = seal.rotation.z;
        darkStrand.position.y = Math.sin(elapsed * 0.5) * 0.018;
        greenStrand.position.y = Math.sin(elapsed * 0.5 + 1.4) * 0.018;
        thread.position.y = Math.sin(elapsed * 0.65 + 2.1) * 0.014;
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
          if (object instanceof THREE.Mesh || object instanceof THREE.Points || object instanceof THREE.LineSegments) {
            object.geometry.dispose();
            const materials = Array.isArray(object.material) ? object.material : [object.material];
            materials.forEach((material) => material.dispose());
          }
        });
        noteTexture?.dispose();
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
            <linearGradient id="cord-dark" x1="0" y1="0" x2="1" y2="1"><stop stopColor="#020f0a"/><stop offset=".48" stopColor="#0b5d36"/><stop offset="1" stopColor="#01140b"/></linearGradient>
            <linearGradient id="cord-green" x1="0" y1="0" x2="1" y2="1"><stop stopColor="#8effaa"/><stop offset=".46" stopColor="#00bd59"/><stop offset="1" stopColor="#006633"/></linearGradient>
            <filter id="cord-shadow"><feDropShadow dx="0" dy="18" stdDeviation="13" floodColor="#07562f" floodOpacity=".22"/></filter>
          </defs>
          <path className={styles.cordDark} d="M-90 490 C130 690 250 100 520 280 C760 440 820 70 1280 210" stroke="url(#cord-dark)" strokeWidth="46" strokeLinecap="round" filter="url(#cord-shadow)"/>
          <path className={styles.cordGreen} d="M-90 490 C130 690 250 100 520 280 C760 440 820 70 1280 210" stroke="url(#cord-green)" strokeWidth="25" strokeLinecap="round"/>
          <path className={styles.cordHighlight} d="M-90 484 C130 684 250 94 520 274 C760 434 820 64 1280 204" stroke="rgba(232,255,237,.7)" strokeWidth="4" strokeLinecap="round"/>
        </svg>
        <div className={styles.fallbackSeal}><span><b>V</b><small>VELLUM</small></span></div>
        <div className={styles.fallbackNote}>
          <header><b>vellum</b><span>BEARER NOTE · W/000421</span></header>
          <div className={styles.fallbackBand}><i /> <span><b>$CASHCAT</b><small>ROBINHOOD CHAIN</small></span></div>
          <main><small>POSITION</small><strong>250,000</strong><span>≈ $30,150 AT MARK</span></main>
          <footer><span>ENTRY <b>$0.0870</b></span><span>TERM <b>90 DAYS</b></span></footer>
          <aside>SEALED UNTIL 04 NOV 2026</aside>
        </div>
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
