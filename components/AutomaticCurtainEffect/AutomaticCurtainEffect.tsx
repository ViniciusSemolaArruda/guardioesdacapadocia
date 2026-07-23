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

const MINIMUM_HERO_HEIGHT = 400;

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

  const openingTimeoutRef =
    useRef<ReturnType<typeof setTimeout> | null>(
      null,
    );

  const finishingTimeoutRef =
    useRef<ReturnType<typeof setTimeout> | null>(
      null,
    );

  const [isReady, setIsReady] =
    useState(false);

  const [isOpening, setIsOpening] =
    useState(false);

  const [isFinished, setIsFinished] =
    useState(false);

  const [availableHeight, setAvailableHeight] =
    useState(0);

  /* =======================================================
     CALCULA A ALTURA DISPONÍVEL DO HERO

     Usa apenas:
     altura da janela - altura do Header.

     Não utiliza a posição do Hero em relação ao scroll,
     evitando que ele fique gigante ao atualizar a página.
  ======================================================= */

  useLayoutEffect(() => {
    let animationFrameId: number | null = null;

    let resizeObserver:
      ResizeObserver | null = null;

    function calculateAvailableHeight() {
      const header =
        document.querySelector<HTMLElement>(
          "header",
        );

      const headerHeight =
        header?.getBoundingClientRect().height ??
        0;

      /*
       * visualViewport é mais confiável em celulares,
       * especialmente quando a barra do navegador aparece
       * ou desaparece.
       */
      const viewportHeight =
        window.visualViewport?.height ??
        window.innerHeight;

      const calculatedHeight =
        viewportHeight - headerHeight;

      const nextHeight = Math.max(
        MINIMUM_HERO_HEIGHT,
        Math.floor(calculatedHeight),
      );

      setAvailableHeight((currentHeight) => {
        /*
         * Evita renderizações desnecessárias quando
         * a diferença é mínima.
         */
        if (
          Math.abs(currentHeight - nextHeight) <
          2
        ) {
          return currentHeight;
        }

        return nextHeight;
      });
    }

    function requestCalculation() {
      if (animationFrameId !== null) {
        window.cancelAnimationFrame(
          animationFrameId,
        );
      }

      animationFrameId =
        window.requestAnimationFrame(() => {
          calculateAvailableHeight();

          animationFrameId = null;
        });
    }

    /*
     * Primeiro cálculo.
     */
    requestCalculation();

    /*
     * Segundo cálculo após o navegador terminar
     * o layout inicial e carregar fontes/imagens.
     */
    const initialTimeout =
      window.setTimeout(
        requestCalculation,
        100,
      );

    window.addEventListener(
      "resize",
      requestCalculation,
    );

    window.addEventListener(
      "orientationchange",
      requestCalculation,
    );

    window.visualViewport?.addEventListener(
      "resize",
      requestCalculation,
    );

    const header =
      document.querySelector<HTMLElement>(
        "header",
      );

    if (
      header &&
      typeof ResizeObserver !== "undefined"
    ) {
      resizeObserver =
        new ResizeObserver(
          requestCalculation,
        );

      /*
       * Observa somente o Header.
       *
       * Não observa o próprio Hero, pois isso poderia
       * gerar um ciclo:
       * altura muda → observer dispara → altura muda.
       */
      resizeObserver.observe(header);
    }

    return () => {
      window.clearTimeout(initialTimeout);

      window.removeEventListener(
        "resize",
        requestCalculation,
      );

      window.removeEventListener(
        "orientationchange",
        requestCalculation,
      );

      window.visualViewport?.removeEventListener(
        "resize",
        requestCalculation,
      );

      resizeObserver?.disconnect();

      if (animationFrameId !== null) {
        window.cancelAnimationFrame(
          animationFrameId,
        );
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

    if (alreadyOpened || reducedMotion) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setIsReady(true);
      setIsOpening(true);
      setIsFinished(true);

      return;
    }

    setIsReady(true);

    openingTimeoutRef.current =
      setTimeout(() => {
        setIsOpening(true);
      }, delay);

    finishingTimeoutRef.current =
      setTimeout(() => {
        setIsFinished(true);

        if (openOncePerSession) {
          try {
            window.sessionStorage.setItem(
              sessionKey,
              "true",
            );
          } catch {
            /*
             * Mantém a animação funcionando caso
             * o armazenamento esteja bloqueado.
             */
          }
        }
      }, delay + duration + 200);

    return () => {
      if (openingTimeoutRef.current) {
        clearTimeout(
          openingTimeoutRef.current,
        );

        openingTimeoutRef.current = null;
      }

      if (finishingTimeoutRef.current) {
        clearTimeout(
          finishingTimeoutRef.current,
        );

        finishingTimeoutRef.current = null;
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

  const stageClassNames = [
    styles.curtainStage,
    !isReady || availableHeight === 0
      ? styles.loading
      : "",
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
      <div className={stageClassNames}>
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