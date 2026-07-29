"use client";

import { useEffect } from "react";

declare global {
  interface Window {
    VLibras?: {
      Widget: new (url: string) => unknown;
    };

    __vlibrasInitialized?: boolean;
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
    let retryTimeout: number | null = null;
    let attempts = 0;

    const MAX_ATTEMPTS = 30;

    function clearRetry() {
      if (retryTimeout !== null) {
        window.clearTimeout(retryTimeout);
        retryTimeout = null;
      }
    }

    function widgetExists() {
      return Boolean(
        document.querySelector(
          ".vpw-container, .vpw-box, .vpw-controls",
        ),
      );
    }

    function initializeWidget() {
      if (cancelled) {
        return;
      }

      if (widgetExists()) {
        window.__vlibrasInitialized = true;
        return;
      }

      if (!window.VLibras?.Widget) {
        attempts += 1;

        if (attempts <= MAX_ATTEMPTS) {
          clearRetry();

          retryTimeout = window.setTimeout(
            initializeWidget,
            300,
          );
        }

        return;
      }

      if (
        window.__vlibrasInitialized &&
        widgetExists()
      ) {
        return;
      }

      try {
        new window.VLibras.Widget(
          WIDGET_URL,
        );

        window.__vlibrasInitialized = true;
        attempts = 0;

        console.log(
          "VLibras inicializado com sucesso.",
        );
      } catch (error) {
        window.__vlibrasInitialized = false;

        console.error(
          "Erro ao inicializar o VLibras:",
          error,
        );
      }
    }

    function createScript() {
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
          { once: true },
        );

        return;
      }

      const script =
        document.createElement("script");

      script.id = SCRIPT_ID;
      script.src = SCRIPT_URL;
      script.async = true;
      script.defer = true;

      script.onload = () => {
        console.log(
          "Script do VLibras carregado.",
        );

        initializeWidget();
      };

      script.onerror = () => {
        console.error(
          "Falha ao carregar o script do VLibras.",
        );
      };

      document.body.appendChild(script);
    }

    const frameId =
      window.requestAnimationFrame(() => {
        createScript();
      });

    function handlePageShow() {
      if (widgetExists()) {
        return;
      }

      window.__vlibrasInitialized = false;
      attempts = 0;

      createScript();
    }

    window.addEventListener(
      "pageshow",
      handlePageShow,
    );

    return () => {
      cancelled = true;

      clearRetry();

      window.cancelAnimationFrame(frameId);

      window.removeEventListener(
        "pageshow",
        handlePageShow,
      );
    };
  }, []);

  return (
    <div
      data-vlibras-root="true"
      {...({
        vw: "",
      } as Record<string, string>)}
      className="enabled"
    >
      <div
        {...({
          "vw-access-button": "",
        } as Record<string, string>)}
        className="active"
      />

      <div
        {...({
          "vw-plugin-wrapper": "",
        } as Record<string, string>)}
      >
        <div className="vw-plugin-top-wrapper" />
      </div>
    </div>
  );
}