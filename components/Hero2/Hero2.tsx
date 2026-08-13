/* eslint-disable @next/next/no-html-link-for-pages */
"use client";

import { ChevronDown, ChevronRight, Ticket } from "lucide-react";
import { type CSSProperties, type MouseEvent, useEffect, useRef, useState } from "react";
import styles from "./Hero2.module.css";

const FRAME_COUNT = 120;
const PRIORITY_FRAMES = [0, 30, 60, 90, 119];
const TICKET_URL = "https://www.sympla.com.br/evento/passaporte-todo-mundo-no-samba-g-r-e-s-guardioes-da-capadocia/3517324?algoliaID=220fd97b3bd3333b1b7f05cbd66b263f";

function framePath(index: number, mobile: boolean) {
  const folder = mobile ? "mobile" : "desktop";
  return `/images/motion-sapucai/${folder}/frame-${String(index).padStart(4, "0")}.webp`;
}

export default function Hero2() {
  const sectionRef = useRef<HTMLElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const imagesRef = useRef<Array<HTMLImageElement | null>>(Array(FRAME_COUNT).fill(null));
  const targetFrameRef = useRef(0);
  const currentFrameRef = useRef(0);
  const animationRef = useRef<number | null>(null);
  const lastDrawnFrameRef = useRef(-1);
  const mobileRef = useRef(false);
  const [loadProgress, setLoadProgress] = useState(0);
  const [isReady, setIsReady] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [activeScene, setActiveScene] = useState<1 | 2 | 3>(1);
  const activeSceneRef = useRef<1 | 2 | 3>(1);

  useEffect(() => {
    const section = sectionRef.current;
    const canvas = canvasRef.current;
    if (!section || !canvas) return;

    const context = canvas.getContext("2d", { alpha: false });
    if (!context) return;

    // Referência definitivamente validada para uso dentro das funções internas.
    const ctx: CanvasRenderingContext2D = context;

    let cancelled = false;
    let loaded = 0;
    let failed = 0;
    mobileRef.current = window.matchMedia("(max-width: 700px)").matches;

    function drawFrame(index: number) {
      const image = imagesRef.current[index];
      if (!image?.complete || !image.naturalWidth) return false;

      const rect = canvas!.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, mobileRef.current ? 1.5 : 2);
      const width = Math.max(1, Math.round(rect.width * dpr));
      const height = Math.max(1, Math.round(rect.height * dpr));

      if (canvas!.width !== width || canvas!.height !== height) {
        canvas!.width = width;
        canvas!.height = height;
      }

      const imageRatio = image.naturalWidth / image.naturalHeight;
      const canvasRatio = width / height;
      let sourceX = 0;
      let sourceY = 0;
      let sourceWidth = image.naturalWidth;
      let sourceHeight = image.naturalHeight;

      if (imageRatio > canvasRatio) {
        sourceWidth = image.naturalHeight * canvasRatio;
        sourceX = (image.naturalWidth - sourceWidth) / 2;
      } else {
        sourceHeight = image.naturalWidth / canvasRatio;
        sourceY = (image.naturalHeight - sourceHeight) / 2;
      }

      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = "high";
      ctx.fillStyle = "#090b10";
      ctx.fillRect(0, 0, width, height);
      ctx.drawImage(image, sourceX, sourceY, sourceWidth, sourceHeight, 0, 0, width, height);
      lastDrawnFrameRef.current = index;
      return true;
    }

    function closestLoadedFrame(wanted: number) {
      if (imagesRef.current[wanted]?.complete && imagesRef.current[wanted]?.naturalWidth) return wanted;
      for (let distance = 1; distance < FRAME_COUNT; distance += 1) {
        const before = wanted - distance;
        const after = wanted + distance;
        if (before >= 0 && imagesRef.current[before]?.complete && imagesRef.current[before]?.naturalWidth) return before;
        if (after < FRAME_COUNT && imagesRef.current[after]?.complete && imagesRef.current[after]?.naturalWidth) return after;
      }
      return 0;
    }

    function animate() {
      const difference = targetFrameRef.current - currentFrameRef.current;
      currentFrameRef.current += difference * 0.16;
      if (Math.abs(difference) < 0.03) currentFrameRef.current = targetFrameRef.current;

      const wanted = Math.max(0, Math.min(FRAME_COUNT - 1, Math.round(currentFrameRef.current)));
      const drawable = closestLoadedFrame(wanted);
      if (drawable !== lastDrawnFrameRef.current) drawFrame(drawable);
      animationRef.current = window.requestAnimationFrame(animate);
    }

    function updateScroll() {
      const rect = section!.getBoundingClientRect();
      const distance = Math.max(section!.offsetHeight - window.innerHeight, 1);
      const progress = Math.min(1, Math.max(0, -rect.top / distance));
      targetFrameRef.current = progress * (FRAME_COUNT - 1);
      section!.style.setProperty("--motion-progress", progress.toFixed(4));
      section!.style.setProperty("--motion-percent", `${progress * 100}%`);

      const nextScene: 1 | 2 | 3 = progress < 0.29 ? 1 : progress < 0.69 ? 2 : 3;
      if (nextScene !== activeSceneRef.current) {
        activeSceneRef.current = nextScene;
        setActiveScene(nextScene);
      }
    }

    function loadFrame(index: number) {
      return new Promise<void>((resolve) => {
        if (cancelled || imagesRef.current[index]) return resolve();
        const image = new Image();
        image.decoding = "async";
        image.onload = () => {
          if (!cancelled) {
            loaded += 1;
            setLoadProgress(Math.round((loaded / FRAME_COUNT) * 100));
            if (index === 0 || lastDrawnFrameRef.current < 0) drawFrame(index === 0 ? 0 : index);
          }
          resolve();
        };
        image.onerror = () => {
          failed += 1;
          if (!cancelled && failed > 5) setHasError(true);
          resolve();
        };
        image.src = framePath(index, mobileRef.current);
        imagesRef.current[index] = image;
      });
    }

    async function preload() {
      await Promise.all(PRIORITY_FRAMES.map(loadFrame));
      if (cancelled) return;
      drawFrame(0);
      setIsReady(true);

      const remaining = Array.from({ length: FRAME_COUNT }, (_, index) => index).filter(
        (index) => !PRIORITY_FRAMES.includes(index),
      );
      const batchSize = 8;
      for (let start = 0; start < remaining.length && !cancelled; start += batchSize) {
        await Promise.all(remaining.slice(start, start + batchSize).map(loadFrame));
      }
    }

    function handleResize() {
      lastDrawnFrameRef.current = -1;
      drawFrame(closestLoadedFrame(Math.round(currentFrameRef.current)));
      updateScroll();
    }

    preload();
    updateScroll();
    animationRef.current = window.requestAnimationFrame(animate);
    window.addEventListener("scroll", updateScroll, { passive: true });
    window.addEventListener("resize", handleResize);

    return () => {
      cancelled = true;
      window.removeEventListener("scroll", updateScroll);
      window.removeEventListener("resize", handleResize);
      if (animationRef.current !== null) window.cancelAnimationFrame(animationRef.current);
      imagesRef.current = Array(FRAME_COUNT).fill(null);
    };
  }, []);

  function goToSchool(event: MouseEvent<HTMLAnchorElement>) {
    event.preventDefault();
    const section = document.getElementById("quem-somos");
    if (!section) return void (window.location.href = "/#quem-somos");
    section.scrollIntoView({ behavior: "smooth", block: "start" });
    window.history.replaceState(null, "", "/#quem-somos");
  }

  function finishMotion() {
    const section = sectionRef.current;
    if (!section) return;
    window.scrollTo({ top: section.offsetTop + section.offsetHeight - window.innerHeight, behavior: "smooth" });
  }

  return (
    <section ref={sectionRef} id="inicio" className={styles.motionSection} style={{ "--motion-progress": "0", "--motion-percent": "0%" } as CSSProperties}>
      <div className={styles.stickyStage}>
        <canvas ref={canvasRef} className={`${styles.canvas} ${isReady ? styles.canvasReady : ""}`} aria-label="Mestre-sala e porta-bandeira desfilando na Sapucaí" />
        <div className={styles.lightOverlay} aria-hidden="true" />

        {!isReady && !hasError && <div className={styles.loader} role="status"><span /><strong>Preparando experiência</strong><small>{loadProgress}%</small></div>}
        {hasError && <div className={styles.error} role="alert">Não foi possível carregar a sequência de imagens.</div>}

        <div className={`${styles.scene} ${styles.sceneOne} ${activeScene === 1 ? styles.sceneActive : ""}`}><span className={styles.eyebrow}>G.R.E.S. Guardiões da Capadócia</span><h1>A Sapucaí é<br /><strong>o nosso palco.</strong></h1><p>Role para viver essa história.</p></div>
        <div className={`${styles.scene} ${styles.sceneTwo} ${activeScene === 2 ? styles.sceneActive : ""}`}><span className={styles.eyebrow}>Tradição em movimento</span><h2>Nossa bandeira.<br /><strong>Nossa história.</strong></h2></div>
        <div className={`${styles.scene} ${styles.sceneThree} ${activeScene === 3 ? styles.sceneActive : ""}`}><span className={styles.eyebrow}>Força, Foco e Fé</span><h2>E muito<br /><strong>samba no pé!</strong></h2><div className={styles.actions}><a href="/#quem-somos" onClick={goToSchool}>Conheça a escola<ChevronRight size={18} /></a><a href={TICKET_URL} target="_blank" rel="noopener noreferrer"><Ticket size={18} />Ingressos</a></div></div>

        <div className={styles.progress} aria-hidden="true"><span><i /></span><small>Role para avançar</small></div>
        <button type="button" className={styles.skipButton} onClick={finishMotion}>Pular apresentação<ChevronDown size={16} /></button>
      </div>
    </section>
  );
}