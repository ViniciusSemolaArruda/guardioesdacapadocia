"use client";

import {
  CSSProperties,
  ReactNode,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from "react";

import styles from "./AutomaticCurtainEffect.module.css";

type AutomaticCurtainCSSProperties =
  CSSProperties & {
    "--curtain-image"?: string;
    "--curtain-duration"?: string;
    "--curtain-delay"?: string;
    "--available-height"?: string;
  };

interface AutomaticCurtainEffectProps {
  children: ReactNode;
  id?: string;
  curtainImage?: string;
  duration?: number;
  delay?: number;
  className?: string;
  stageClassName?: string;
  openOncePerSession?: boolean;
  sessionKey?: string;
}

const DEFAULT_CURTAIN_IMAGE =
  "/images/cortina-fechada1.png";

const DEFAULT_SESSION_KEY =
  "guardioes-automatic-curtain-opened";

const MINIMUM_HERO_HEIGHT = 460;
const MAXIMUM_HERO_HEIGHT = 900;
const MOBILE_BREAKPOINT = 650;

export default function AutomaticCurtainEffect({
  children,
  id = "inicio",
  curtainImage = DEFAULT_CURTAIN_IMAGE,
  duration = 2200,
  delay = 450,
  className = "",
  stageClassName = "",
  openOncePerSession = false,
  sessionKey = DEFAULT_SESSION_KEY,
}: AutomaticCurtainEffectProps) {
  const sectionRef =
    useRef<HTMLElement | null>(null);

  /*
   * No navegador, window.setTimeout retorna number.
   * Isso evita conflito com NodeJS.Timeout.
   */
  const openingTimeoutRef =
    useRef<number | null>(null);

  const finishingTimeoutRef =
    useRef<number | null>(null);

  const resizeTimeoutRef =
    useRef<number | null>(null);

  const initialCalculationTimeoutRef =
    useRef<number | null>(null);

  const animationFrameRef =
    useRef<number | null>(null);

  const animationStartFrameRef =
    useRef<number | null>(null);

  const [isOpening, setIsOpening] =
    useState(false);

  const [isFinished, setIsFinished] =
    useState(false);

  const [availableHeight, setAvailableHeight] =
    useState(MINIMUM_HERO_HEIGHT);

  /* =======================================================
     CALCULA A ALTURA DO HERO

     No celular, a altura será controlada pelo conteúdo.

     Em tablets, notebooks e desktops, o Hero ocupa o espaço
     disponível abaixo do Header, com limite máximo para não
     ficar excessivamente grande.
  ======================================================= */

  useLayoutEffect(() => {
    function calculateAvailableHeight() {
      if (
        window.innerWidth <=
        MOBILE_BREAKPOINT
      ) {
        setAvailableHeight(
          MINIMUM_HERO_HEIGHT,
        );

        return;
      }

      const header =
        document.querySelector<HTMLElement>(
          "header",
        );

      const headerHeight =
        header?.getBoundingClientRect().height ??
        0;

      const viewportHeight =
        window.innerHeight;

      const calculatedHeight =
        viewportHeight - headerHeight;

      const nextHeight = Math.max(
        MINIMUM_HERO_HEIGHT,
        Math.min(
          Math.floor(calculatedHeight),
          MAXIMUM_HERO_HEIGHT,
        ),
      );

      setAvailableHeight(
        (currentHeight) => {
          const heightDifference =
            Math.abs(
              currentHeight - nextHeight,
            );

          if (heightDifference < 2) {
            return currentHeight;
          }

          return nextHeight;
        },
      );
    }

    function requestCalculation() {
      if (
        animationFrameRef.current !== null
      ) {
        window.cancelAnimationFrame(
          animationFrameRef.current,
        );
      }

      animationFrameRef.current =
        window.requestAnimationFrame(() => {
          calculateAvailableHeight();

          animationFrameRef.current = null;
        });
    }

    function handleResize() {
      if (
        resizeTimeoutRef.current !== null
      ) {
        window.clearTimeout(
          resizeTimeoutRef.current,
        );
      }

      resizeTimeoutRef.current =
        window.setTimeout(() => {
          requestCalculation();

          resizeTimeoutRef.current = null;
        }, 120);
    }

    requestCalculation();

    /*
     * Faz uma segunda medição depois que imagens, fontes
     * e o Header já tiveram tempo de concluir o layout.
     */
    initialCalculationTimeoutRef.current =
      window.setTimeout(() => {
        requestCalculation();

        initialCalculationTimeoutRef.current =
          null;
      }, 200);

    window.addEventListener(
      "resize",
      handleResize,
      {
        passive: true,
      },
    );

    window.addEventListener(
      "orientationchange",
      handleResize,
      {
        passive: true,
      },
    );

    return () => {
      window.removeEventListener(
        "resize",
        handleResize,
      );

      window.removeEventListener(
        "orientationchange",
        handleResize,
      );

      if (
        resizeTimeoutRef.current !== null
      ) {
        window.clearTimeout(
          resizeTimeoutRef.current,
        );

        resizeTimeoutRef.current = null;
      }

      if (
        initialCalculationTimeoutRef.current !==
        null
      ) {
        window.clearTimeout(
          initialCalculationTimeoutRef.current,
        );

        initialCalculationTimeoutRef.current =
          null;
      }

      if (
        animationFrameRef.current !== null
      ) {
        window.cancelAnimationFrame(
          animationFrameRef.current,
        );

        animationFrameRef.current = null;
      }
    };
  }, []);

  /* =======================================================
     ABERTURA AUTOMÁTICA
  ======================================================= */

  useEffect(() => {
    const reducedMotion =
      window.matchMedia(
        "(prefers-reduced-motion: reduce)",
      ).matches;

    let alreadyOpened = false;

    if (openOncePerSession) {
      try {
        alreadyOpened =
          window.sessionStorage.getItem(
            sessionKey,
          ) === "true";
      } catch {
        alreadyOpened = false;
      }
    }

    /*
     * O requestAnimationFrame evita chamar setState
     * diretamente no corpo do useEffect.
     */
    if (
      alreadyOpened ||
      reducedMotion
    ) {
      animationStartFrameRef.current =
        window.requestAnimationFrame(() => {
          setIsOpening(true);
          setIsFinished(true);

          animationStartFrameRef.current =
            null;
        });

      return () => {
        if (
          animationStartFrameRef.current !==
          null
        ) {
          window.cancelAnimationFrame(
            animationStartFrameRef.current,
          );

          animationStartFrameRef.current =
            null;
        }
      };
    }

    openingTimeoutRef.current =
      window.setTimeout(() => {
        setIsOpening(true);

        openingTimeoutRef.current = null;
      }, delay);

    finishingTimeoutRef.current =
      window.setTimeout(() => {
        setIsFinished(true);

        finishingTimeoutRef.current = null;

        if (openOncePerSession) {
          try {
            window.sessionStorage.setItem(
              sessionKey,
              "true",
            );
          } catch {
            /*
             * A animação continua funcionando mesmo que
             * o navegador bloqueie o sessionStorage.
             */
          }
        }
      }, delay + duration + 250);

    return () => {
      if (
        openingTimeoutRef.current !== null
      ) {
        window.clearTimeout(
          openingTimeoutRef.current,
        );

        openingTimeoutRef.current = null;
      }

      if (
        finishingTimeoutRef.current !== null
      ) {
        window.clearTimeout(
          finishingTimeoutRef.current,
        );

        finishingTimeoutRef.current = null;
      }

      if (
        animationStartFrameRef.current !==
        null
      ) {
        window.cancelAnimationFrame(
          animationStartFrameRef.current,
        );

        animationStartFrameRef.current =
          null;
      }
    };
  }, [
    delay,
    duration,
    openOncePerSession,
    sessionKey,
  ]);

  /* =======================================================
     CLASSES
  ======================================================= */

  const sectionClassName = [
    styles.curtainSection,
    className,
  ]
    .filter(Boolean)
    .join(" ");

  const stageClassNameFinal = [
    styles.curtainStage,
    isOpening ? styles.opening : "",
    isFinished ? styles.finished : "",
    stageClassName,
  ]
    .filter(Boolean)
    .join(" ");

  /* =======================================================
     VARIÁVEIS CSS
  ======================================================= */

  const curtainStyle:
    AutomaticCurtainCSSProperties = {
    "--curtain-image": `url("${curtainImage}")`,
    "--curtain-duration": `${duration}ms`,
    "--curtain-delay": `${delay}ms`,
    "--available-height": `${availableHeight}px`,
  };

  /* =======================================================
     RENDERIZAÇÃO
  ======================================================= */

  return (
    <section
      ref={sectionRef}
      id={id}
      className={sectionClassName}
      style={curtainStyle}
    >
      <div className={stageClassNameFinal}>
        <div className={styles.curtainContent}>
          {children}
        </div>

        <div
          className={styles.heroShade}
          aria-hidden="true"
        />

        <div
          className={`${styles.curtainPanel} ${styles.curtainLeft}`}
          aria-hidden="true"
        >
          <div
            className={styles.curtainArtwork}
          />

          <div
            className={styles.curtainEdge}
          />
        </div>

        <div
          className={`${styles.curtainPanel} ${styles.curtainRight}`}
          aria-hidden="true"
        >
          <div
            className={styles.curtainArtwork}
          />

          <div
            className={styles.curtainEdge}
          />
        </div>

        <div
          className={styles.centerSeam}
          aria-hidden="true"
        />
      </div>
    </section>
  );
}