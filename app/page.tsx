"use client";

import { useEffect, useState } from "react";

import AboutSection from "@/components/About/AboutSection";
import Contato from "@/components/Contato/Contato";
import EventSection from "@/components/Event/EventSection";
import Footer from "@/components/Footer/Footer";
import Galeria from "@/components/Galeria/galeria";
import Header from "@/components/Header/Header";
import Hero2 from "@/components/Hero2/Hero2";

import styles from "./page.module.css";

export default function HomePage() {
  const [showHeader, setShowHeader] =
    useState(false);

  useEffect(() => {
    let animationFrame: number | null = null;

    function updateHeaderVisibility() {
      animationFrame = null;

      const hero =
        document.getElementById("inicio");

      if (!hero) {
        setShowHeader(true);
        return;
      }

      const heroPosition =
        hero.getBoundingClientRect();

      /*
       * O Header aparece quando o usuário:
       *
       * 1. Terminou toda a animação do Hero;
       * 2. Continuou rolando;
       * 3. Começou a entrar no restante da página.
       */
      const finishedHero =
        heroPosition.bottom <=
        window.innerHeight - 24;

      setShowHeader(finishedHero);
    }

    function requestUpdate() {
      if (animationFrame !== null) return;

      animationFrame =
        window.requestAnimationFrame(
          updateHeaderVisibility,
        );
    }

    updateHeaderVisibility();

    window.addEventListener(
      "scroll",
      requestUpdate,
      {
        passive: true,
      },
    );

    window.addEventListener(
      "resize",
      requestUpdate,
    );

    return () => {
      window.removeEventListener(
        "scroll",
        requestUpdate,
      );

      window.removeEventListener(
        "resize",
        requestUpdate,
      );

      if (animationFrame !== null) {
        window.cancelAnimationFrame(
          animationFrame,
        );
      }
    };
  }, []);

  return (
    <>
      <div
        className={`${styles.headerWrapper} ${
          showHeader
            ? styles.headerVisible
            : styles.headerHidden
        }`}
        aria-hidden={!showHeader}
      >
        <Header />
      </div>

      <main>
        <Hero2 />
        <AboutSection />
        <EventSection />
        <Galeria />
        <Contato />
      </main>

      <Footer />
    </>
  );
}