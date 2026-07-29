"use client";

import { useEffect } from "react";

declare global {
  interface Window {
    VLibras?: {
      Widget: new (url: string) => unknown;
    };
  }
}

const SCRIPT_ID = "vlibras-plugin-script";

const SCRIPT_URL =
  "https://vlibras.gov.br/app/vlibras-plugin.js";

const APP_URL =
  "https://vlibras.gov.br/app";

export default function VLibras() {
  useEffect(() => {
    let cancelled = false;
    let attempts = 0;
    let timer: number | undefined;

    const MAX_ATTEMPTS = 100;
    const RETRY_DELAY = 200;

    function hasRenderedWidget() {
      const accessButton =
        document.querySelector<HTMLElement>(
          "[vw-access-button]",
        );

      const pluginWrapper =
        document.querySelector<HTMLElement>(
          "[vw-plugin-wrapper]",
        );

      const internalWidget =
        document.querySelector(
          ".vpw-container, .vpw-box",
        );

      return Boolean(
        accessButton &&
          pluginWrapper &&
          internalWidget,
      );
    }

    function initialize() {
      if (cancelled) {
        return;
      }

      attempts += 1;

      if (hasRenderedWidget()) {
        return;
      }

      if (window.VLibras?.Widget) {
        try {
          new window.VLibras.Widget(APP_URL);

          console.log(
            "VLibras inicializado corretamente.",
          );

          return;
        } catch (error) {
          console.error(
            "Erro ao inicializar o VLibras:",
            error,
          );
        }
      }

      if (attempts < MAX_ATTEMPTS) {
        timer = window.setTimeout(
          initialize,
          RETRY_DELAY,
        );
      } else {
        console.error(
          "O VLibras não foi carregado após várias tentativas.",
        );
      }
    }

    const existingScript =
      document.getElementById(
        SCRIPT_ID,
      ) as HTMLScriptElement | null;

    if (existingScript) {
      initialize();
    } else {
      const script =
        document.createElement("script");

      script.id = SCRIPT_ID;
      script.src = SCRIPT_URL;
      script.async = true;

      script.onload = initialize;

      script.onerror = () => {
        console.error(
          "Não foi possível carregar o script do VLibras.",
        );
      };

      document.body.appendChild(script);
    }

    return () => {
      cancelled = true;

      if (timer) {
        window.clearTimeout(timer);
      }
    };
  }, []);

  return (
    <div
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