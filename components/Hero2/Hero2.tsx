/* eslint-disable @next/next/no-html-link-for-pages */
"use client";

import { ChevronDown, ChevronRight, Ticket } from "lucide-react";
import {
  type CSSProperties,
  type MouseEvent,
  useEffect,
  useRef,
  useState,
} from "react";
import styles from "./Hero2.module.css";

const TICKET_URL =
  "https://www.sympla.com.br/evento/passaporte-todo-mundo-no-samba-g-r-e-s-guardioes-da-capadocia/3517324?algoliaID=220fd97b3bd3333b1b7f05cbd66b263f";

type Scene = 1 | 2 | 3;

function clamp(value: number, min = 0, max = 1) {
  return Math.min(max, Math.max(min, value));
}

function range(progress: number, from: number, to: number) {
  return clamp((progress - from) / (to - from));
}

export default function Hero2() {
  const sectionRef = useRef<HTMLElement>(null);
  const frameRef = useRef<number | null>(null);
  const sceneRef = useRef<Scene>(1);
  const [activeScene, setActiveScene] = useState<Scene>(1);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const reducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    function render() {
      frameRef.current = null;
      const rect = section!.getBoundingClientRect();
      const scrollable = Math.max(section!.offsetHeight - window.innerHeight, 1);
      const progress = clamp(-rect.top / scrollable);

      // Four beats: bateria, reveal, dance, exit.
      const reveal = range(progress, 0.18, 0.45);
      const dance = range(progress, 0.48, 0.82);
      const exit = range(progress, 0.84, 1);
      const cameraArc = Math.sin(dance * Math.PI);
      const flagSway = Math.sin(dance * Math.PI * 2);
      const visible = 1 - exit;

      section!.style.setProperty("--progress", progress.toFixed(4));
      section!.style.setProperty("--progress-percent", `${progress * 100}%`);
      section!.style.setProperty("--reveal", reveal.toFixed(4));
      section!.style.setProperty("--dance", dance.toFixed(4));
      section!.style.setProperty("--exit", exit.toFixed(4));
      section!.style.setProperty("--camera-arc", cameraArc.toFixed(4));
      section!.style.setProperty("--flag-sway", flagSway.toFixed(4));
      section!.style.setProperty("--bg-x", `${reveal * -1.3}%`);
      section!.style.setProperty("--bg-y", `${progress * -1.1}%`);
      section!.style.setProperty("--bg-scale", (1.1 - reveal * 0.045).toFixed(4));
      section!.style.setProperty("--bg-saturation", (0.86 + reveal * 0.14).toFixed(4));
      section!.style.setProperty("--photo-opacity", (reveal * visible).toFixed(4));
      section!.style.setProperty("--reveal-radius", `${9 + reveal * 74}%`);
      section!.style.setProperty("--photo-x", `${cameraArc * -1.8}%`);
      section!.style.setProperty("--photo-y", `${exit * -4}%`);
      section!.style.setProperty("--photo-scale", (1.075 + dance * 0.045 + exit * 0.09).toFixed(4));
      section!.style.setProperty("--photo-rotate", `${cameraArc * -0.7}deg`);
      section!.style.setProperty("--flag-opacity", (dance * visible * 0.88).toFixed(4));
      section!.style.setProperty("--flag-rotate", `${flagSway * 1.2}deg`);
      section!.style.setProperty("--visible", visible.toFixed(4));

      const nextScene: Scene = progress < 0.31 ? 1 : progress < 0.68 ? 2 : 3;
      if (nextScene !== sceneRef.current) {
        sceneRef.current = nextScene;
        setActiveScene(nextScene);
      }
    }

    function requestRender() {
      if (frameRef.current === null) {
        frameRef.current = window.requestAnimationFrame(render);
      }
    }

    if (reducedMotion) {
      section.style.setProperty("--reveal", "1");
      section.style.setProperty("--dance", "0");
      section.style.setProperty("--exit", "0");
      section.style.setProperty("--photo-opacity", "1");
      section.style.setProperty("--reveal-radius", "100%");
    } else {
      render();
      window.addEventListener("scroll", requestRender, { passive: true });
      window.addEventListener("resize", requestRender);
    }

    return () => {
      window.removeEventListener("scroll", requestRender);
      window.removeEventListener("resize", requestRender);
      if (frameRef.current !== null) window.cancelAnimationFrame(frameRef.current);
    };
  }, []);

  function goToSchool(event: MouseEvent<HTMLAnchorElement>) {
    event.preventDefault();
    const destination = document.getElementById("quem-somos");
    if (!destination) {
      window.location.href = "/#quem-somos";
      return;
    }
    destination.scrollIntoView({ behavior: "smooth", block: "start" });
    window.history.replaceState(null, "", "/#quem-somos");
  }

  function finishMotion() {
    const section = sectionRef.current;
    if (!section) return;
    const end = section.offsetTop + section.offsetHeight - window.innerHeight;
    window.scrollTo({ top: end, behavior: "smooth" });
  }

  return (
    <section
      ref={sectionRef}
      id="inicio"
      className={styles.motionSection}
      style={
        {
          "--progress": "0",
          "--progress-percent": "0%",
          "--reveal": "0",
          "--dance": "0",
          "--exit": "0",
          "--camera-arc": "0",
          "--flag-sway": "0",
          "--bg-x": "0%",
          "--bg-y": "0%",
          "--bg-scale": "1.1",
          "--bg-saturation": "0.86",
          "--photo-opacity": "0",
          "--reveal-radius": "9%",
          "--photo-x": "0%",
          "--photo-y": "0%",
          "--photo-scale": "1.075",
          "--photo-rotate": "0deg",
          "--flag-opacity": "0",
          "--flag-rotate": "0deg",
          "--visible": "1",
        } as CSSProperties
      }
    >
      <div className={styles.stickyStage}>
        <div className={styles.backgroundPlate} aria-hidden="true" />
        <div className={styles.couplePhoto} aria-hidden="true" />
        <div className={styles.flagAccent} aria-hidden="true" />
        <div className={styles.lightOverlay} aria-hidden="true" />
        <div className={styles.filmGrain} aria-hidden="true" />

        <div
          className={`${styles.scene} ${styles.sceneOne} ${
            activeScene === 1 ? styles.sceneActive : ""
          }`}
        >
          <span className={styles.eyebrow}>O coração da escola</span>
          <h1>
            Primeiro,
            <br />
            <strong>a bateria.</strong>
          </h1>
          <p>Role para atravessar a avenida.</p>
        </div>

        <div
          className={`${styles.scene} ${styles.sceneTwo} ${
            activeScene === 2 ? styles.sceneActive : ""
          }`}
        >
          <span className={styles.eyebrow}>Tradição em movimento</span>
          <h2>
            Mestre-sala e
            <br />
            <strong>porta-bandeira.</strong>
          </h2>
        </div>

        <div
          className={`${styles.scene} ${styles.sceneThree} ${
            activeScene === 3 ? styles.sceneActive : ""
          }`}
        >
          <span className={styles.eyebrow}>Força, foco e fé</span>
          <h2>
            A bandeira
            <br />
            <strong>ganha a avenida.</strong>
          </h2>
          <div className={styles.actions}>
            <a href="/#quem-somos" onClick={goToSchool}>
              Conheça a escola <ChevronRight size={18} />
            </a>
            <a href={TICKET_URL} target="_blank" rel="noopener noreferrer">
              <Ticket size={18} /> Ingressos
            </a>
          </div>
        </div>

        <div className={styles.progress} aria-hidden="true">
          <span><i /></span>
          <small>Role para avançar</small>
        </div>

        <button type="button" className={styles.skipButton} onClick={finishMotion}>
          Pular apresentação <ChevronDown size={16} />
        </button>
      </div>
    </section>
  );
}
