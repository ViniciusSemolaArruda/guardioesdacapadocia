"use client";

import { useEffect } from "react";

declare global {
  interface Window {
    VLibras?: {
      Widget: new (url: string) => unknown;
    };

    __vlibrasWidgetInitialized?: boolean;
  }
}

const SCRIPT_ID = "vlibras-plugin-script";
const SCRIPT_URL =
  "https://vlibras.gov.br/app/vlibras-plugin.js";
const WIDGET_URL =
  "https://vlibras.gov.br/app";

export default function VLibras() {
  useEffect(() => {
    let cancelled = false;
    let retryId: number | null = null;
    let attempts = 0;

    function widgetExists() {
      return Boolean(
        document.querySelector(
          ".vpw-container, .vpw-box",
        ),
      );
    }

    function scheduleRetry() {
      if (cancelled) return;

      attempts += 1;

      if (attempts > 80) {
        console.error(
          "O VLibras não ficou disponível após várias tentativas.",
        );

        return;
      }

      retryId = window.setTimeout(
        initializeWidget,
        250,
      );
    }

    function initializeWidget() {
      if (cancelled) return;

      const root =
        document.querySelector<HTMLElement>(
          "#vlibras-root",
        );

      const button =
        document.querySelector<HTMLElement>(
          "#vlibras-root [vw-access-button]",
        );

      if (!root || !button) {
        scheduleRetry();
        return;
      }

      /*
       * Caso o plugin já tenha criado a interface,
       * não inicializa novamente.
       */
      if (widgetExists()) {
        window.__vlibrasWidgetInitialized = true;
        return;
      }

      /*
       * O script ainda não terminou de carregar.
       */
      if (!window.VLibras?.Widget) {
        scheduleRetry();
        return;
      }

      /*
       * Essa variável só serve como proteção adicional.
       * A verificação principal é a presença real do widget.
       */
      if (window.__vlibrasWidgetInitialized) {
        return;
      }

      try {
        new window.VLibras.Widget(WIDGET_URL);

        window.__vlibrasWidgetInitialized = true;
        attempts = 0;
      } catch (error) {
        console.error(
          "Erro ao inicializar o VLibras:",
          error,
        );

        window.__vlibrasWidgetInitialized = false;

        scheduleRetry();
      }
    }

    function loadScript() {
      const existingScript =
        document.getElementById(
          SCRIPT_ID,
        ) as HTMLScriptElement | null;

      if (existingScript) {
        if (window.VLibras?.Widget) {
          initializeWidget();
          return;
        }

        existingScript.addEventListener(
          "load",
          initializeWidget,
        );

        scheduleRetry();
        return;
      }

      const script =
        document.createElement("script");

      script.id = SCRIPT_ID;
      script.src = SCRIPT_URL;
      script.async = true;

      script.addEventListener(
        "load",
        initializeWidget,
      );

      script.addEventListener(
        "error",
        () => {
          console.error(
            "Não foi possível carregar o script do VLibras.",
          );
        },
      );

      document.body.appendChild(script);

      scheduleRetry();
    }

    /*
     * Aguarda a primeira pintura do navegador para garantir
     * que a estrutura [vw] já esteja presente no DOM.
     */
    const frameId =
      window.requestAnimationFrame(() => {
        loadScript();
      });

    return () => {
      cancelled = true;

      window.cancelAnimationFrame(frameId);

      if (retryId !== null) {
        window.clearTimeout(retryId);
      }

      const script =
        document.getElementById(
          SCRIPT_ID,
        ) as HTMLScriptElement | null;

      script?.removeEventListener(
        "load",
        initializeWidget,
      );
    };
  }, []);

  return (
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
  );
}