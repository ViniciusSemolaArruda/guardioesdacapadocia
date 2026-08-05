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

const VLIBRAS_SCRIPT_ID =
  "vlibras-official-script";

const VLIBRAS_SCRIPT_URL =
  "https://vlibras.gov.br/app/vlibras-plugin.js";

const VLIBRAS_APP_URL =
  "https://vlibras.gov.br/app";

export default function VLibras() {
  useEffect(() => {
    let cancelled = false;
    let interval: number | null = null;

    function maintainOfficialClasses() {
      const container =
        document.querySelector<HTMLElement>(
          "[vw]",
        );

      const accessButton =
        document.querySelector<HTMLElement>(
          "[vw-access-button]",
        );

      container?.classList.add("enabled");
      accessButton?.classList.add("active");
    }

    function initializeWidget() {
      if (
        cancelled ||
        window.__vlibrasInitialized
      ) {
        return;
      }

      if (!window.VLibras?.Widget) {
        return;
      }

      maintainOfficialClasses();

      try {
        new window.VLibras.Widget(
          VLIBRAS_APP_URL,
        );

        window.__vlibrasInitialized = true;

        console.log(
          "VLibras inicializado corretamente.",
        );
      } catch (error) {
        window.__vlibrasInitialized = false;

        console.error(
          "Erro ao inicializar o VLibras:",
          error,
        );
      }
    }

    function handleScriptLoad() {
      window.requestAnimationFrame(() => {
        window.requestAnimationFrame(() => {
          initializeWidget();
        });
      });
    }

    maintainOfficialClasses();

    let script =
      document.getElementById(
        VLIBRAS_SCRIPT_ID,
      ) as HTMLScriptElement | null;

    if (!script) {
      script =
        document.createElement("script");

      script.id = VLIBRAS_SCRIPT_ID;
      script.src = VLIBRAS_SCRIPT_URL;
      script.async = true;

      script.addEventListener(
        "load",
        handleScriptLoad,
      );

      script.addEventListener(
        "error",
        () => {
          console.error(
            "Não foi possível baixar o script oficial do VLibras.",
          );
        },
      );

      document.body.appendChild(script);
    } else {
      script.addEventListener(
        "load",
        handleScriptLoad,
      );
    }

    /*
     * Cobre carregamento vindo do cache e pequenas
     * diferenças de tempo entre o React e o script.
     */
    interval = window.setInterval(() => {
      maintainOfficialClasses();

      if (
        window.VLibras?.Widget &&
        !window.__vlibrasInitialized
      ) {
        initializeWidget();
      }

      if (window.__vlibrasInitialized) {
        if (interval !== null) {
          window.clearInterval(interval);
          interval = null;
        }
      }
    }, 250);

    /*
     * Se o script já estiver no cache e disponível.
     */
    initializeWidget();

    return () => {
      cancelled = true;

      script?.removeEventListener(
        "load",
        handleScriptLoad,
      );

      if (interval !== null) {
        window.clearInterval(interval);
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
        aria-label="Abrir tradutor de Libras"
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