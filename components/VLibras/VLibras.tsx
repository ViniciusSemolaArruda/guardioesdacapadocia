/* eslint-disable react-hooks/immutability */
"use client";

import Script from "next/script";
import { usePathname } from "next/navigation";
import { useCallback, useEffect, useRef } from "react";

declare global {
  interface Window {
    VLibras?: {
      Widget: new (url: string) => unknown;
    };

    __vlibrasInitialized?: boolean;
  }
}

const VLibrAS_URL = "https://vlibras.gov.br/app";

export default function VLibras() {
  const pathname = usePathname();

  const retryTimerRef =
    useRef<number | null>(null);

  const routeTimerRef =
    useRef<number | null>(null);

  const attemptsRef = useRef(0);

  const initializeVLibras = useCallback(() => {
    if (typeof window === "undefined") {
      return;
    }

    const container =
      document.querySelector<HTMLElement>(
        "#vlibras-root",
      );

    const accessButton =
      document.querySelector<HTMLElement>(
        "#vlibras-root [vw-access-button]",
      );

    if (!container || !accessButton) {
      return;
    }

    /*
     * Verifica se o plugin realmente criou sua estrutura.
     * Não confiamos apenas em uma variável global.
     */
    const pluginWasCreated = Boolean(
      container.querySelector(
        ".vpw-container, .vpw-box, .vpw-controls",
      ),
    );

    if (pluginWasCreated) {
      window.__vlibrasInitialized = true;

      container.classList.add("enabled");
      accessButton.classList.add("active");

      return;
    }

    /*
     * A variável pode permanecer true mesmo quando os elementos
     * internos desapareceram durante uma navegação.
     */
    window.__vlibrasInitialized = false;

    if (!window.VLibras?.Widget) {
      attemptsRef.current += 1;

      if (attemptsRef.current <= 50) {
        retryTimerRef.current =
          window.setTimeout(() => {
            initializeVLibras();
          }, 250);
      }

      return;
    }

    try {
      new window.VLibras.Widget(VLibrAS_URL);

      window.__vlibrasInitialized = true;
      attemptsRef.current = 0;
    } catch (error) {
      console.error(
        "Erro ao inicializar o VLibras:",
        error,
      );

      attemptsRef.current += 1;

      if (attemptsRef.current <= 10) {
        retryTimerRef.current =
          window.setTimeout(() => {
            initializeVLibras();
          }, 500);
      }
    }
  }, []);

  /*
   * Inicialização inicial do widget.
   */
  useEffect(() => {
    const frameId =
      window.requestAnimationFrame(() => {
        initializeVLibras();
      });

    return () => {
      window.cancelAnimationFrame(frameId);

      if (retryTimerRef.current !== null) {
        window.clearTimeout(
          retryTimerRef.current,
        );

        retryTimerRef.current = null;
      }
    };
  }, [initializeVLibras]);

  /*
   * Reconfere o widget sempre que a rota mudar.
   */
  useEffect(() => {
    attemptsRef.current = 0;

    routeTimerRef.current =
      window.setTimeout(() => {
        initializeVLibras();

        routeTimerRef.current = null;
      }, 150);

    return () => {
      if (routeTimerRef.current !== null) {
        window.clearTimeout(
          routeTimerRef.current,
        );

        routeTimerRef.current = null;
      }
    };
  }, [pathname, initializeVLibras]);

  /*
   * Reconfere quando a página volta a ficar visível.
   */
  useEffect(() => {
    function handlePageShow() {
      initializeVLibras();
    }

    function handleVisibilityChange() {
      if (
        document.visibilityState === "visible"
      ) {
        initializeVLibras();
      }
    }

    window.addEventListener(
      "pageshow",
      handlePageShow,
    );

    window.addEventListener(
      "focus",
      handlePageShow,
    );

    document.addEventListener(
      "visibilitychange",
      handleVisibilityChange,
    );

    return () => {
      window.removeEventListener(
        "pageshow",
        handlePageShow,
      );

      window.removeEventListener(
        "focus",
        handlePageShow,
      );

      document.removeEventListener(
        "visibilitychange",
        handleVisibilityChange,
      );
    };
  }, [initializeVLibras]);

  return (
    <>
      <div
        id="vlibras-root"
        {...({
          vw: "true",
        } as Record<string, string>)}
        className="enabled"
      >
        <div
          {...({
            "vw-access-button": "true",
          } as Record<string, string>)}
          className="active"
          aria-label="Abrir o tradutor VLibras"
        />

        <div
          {...({
            "vw-plugin-wrapper": "true",
          } as Record<string, string>)}
        >
          <div className="vw-plugin-top-wrapper" />
        </div>
      </div>

      <Script
        id="vlibras-plugin-script"
        src="https://vlibras.gov.br/app/vlibras-plugin.js"
        strategy="afterInteractive"
        onLoad={initializeVLibras}
        onReady={initializeVLibras}
        onError={(error) => {
          console.error(
            "Não foi possível carregar o script do VLibras:",
            error,
          );
        }}
      />
    </>
  );
}