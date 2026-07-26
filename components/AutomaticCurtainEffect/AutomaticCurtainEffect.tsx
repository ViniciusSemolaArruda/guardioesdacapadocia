"use client";

import {
  CSSProperties,
  ReactNode,
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

const DEFAULT_STORAGE_KEY =
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
  sessionKey = DEFAULT_STORAGE_KEY,
}: AutomaticCurtainEffectProps) {
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

  /*
   * null:
   * ainda não verificou o localStorage.
   *
   * true:
   * deve reproduzir a cortina.
   *
   * false:
   * deve mostrar o Hero diretamente.
   */
  const [shouldAnimate, setShouldAnimate] =
    useState<boolean | null>(null);

  const [isOpening, setIsOpening] =
    useState(false);

  const [isFinished, setIsFinished] =
    useState(false);

  const [availableHeight, setAvailableHeight] =
    useState(MINIMUM_HERO_HEIGHT);

  /* =======================================================
     VERIFICA SE A CORTINA JÁ APARECEU
  ======================================================= */

  useLayoutEffect(() => {
    const reducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    /*
     * Quando openOncePerSession não estiver habilitado,
     * a animação funciona normalmente em toda montagem.
     */
    if (!openOncePerSession) {
      if (reducedMotion) {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setShouldAnimate(false);
        setIsOpening(true);
        setIsFinished(true);

        return;
      }

      setShouldAnimate(true);

      return;
    }

    let curtainAlreadyOpened = false;

    try {
      curtainAlreadyOpened =
        window.localStorage.getItem(sessionKey) ===
        "true";
    } catch {
      curtainAlreadyOpened = false;
    }

    /*
     * Se já abriu alguma vez neste navegador,
     * mostra o Hero diretamente.
     */
    if (curtainAlreadyOpened || reducedMotion) {
      setShouldAnimate(false);
      setIsOpening(true);
      setIsFinished(true);

      return;
    }

    /*
     * Registra imediatamente.
     *
     * Isso precisa acontecer antes dos timeouts.
     * Assim, mesmo se o usuário atualizar a página,
     * sair ou navegar antes da animação terminar,
     * a cortina não aparecerá novamente.
     */
    try {
      window.localStorage.setItem(
        sessionKey,
        "true",
      );
    } catch {
      /*
       * Se o navegador bloquear o localStorage,
       * a animação ainda continua funcionando.
       */
    }

    setShouldAnimate(true);
  }, [
    openOncePerSession,
    sessionKey,
  ]);

  /* =======================================================
     ABERTURA AUTOMÁTICA
  ======================================================= */

  useLayoutEffect(() => {
    /*
     * Aguarda a verificação do localStorage.
     */
    if (shouldAnimate === null) {
      return;
    }

    /*
     * Se não deve animar, o Hero já foi colocado
     * diretamente no estado final.
     */
    if (!shouldAnimate) {
      return;
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
    };
  }, [
    shouldAnimate,
    delay,
    duration,
  ]);

  /* =======================================================
     CALCULA A ALTURA DO HERO
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
     CLASSES
  ======================================================= */

  const sectionClassName = [
    styles.curtainSection,
    shouldAnimate === null
      ? styles.loading
      : "",
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
      id={id}
      className={sectionClassName}
      style={curtainStyle}
    >
      <div className={stageClassNameFinal}>
        <div className={styles.curtainContent}>
          {children}
        </div>

        {shouldAnimate && !isFinished && (
          <>
            <div
              className={styles.heroShade}
              aria-hidden="true"
            />

            <div
              className={`${styles.curtainPanel} ${styles.curtainLeft}`}
              aria-hidden="true"
            >
              <div
                className={
                  styles.curtainArtwork
                }
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
                className={
                  styles.curtainArtwork
                }
              />

              <div
                className={styles.curtainEdge}
              />
            </div>

            <div
              className={styles.centerSeam}
              aria-hidden="true"
            />
          </>
        )}
      </div>
    </section>
  );
}