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

export default function VLibras() {
  useEffect(() => {
    let cancelled = false;
    let attempts = 0;

    function widgetAlreadyCreated() {
      return Boolean(
        document.querySelector(
          ".vpw-container, .vpw-box, .vpw-settings-btn"
        )
      );
    }

    function initializeWidget() {
      if (cancelled) return;

      if (widgetAlreadyCreated()) return;

      if (window.VLibras?.Widget) {
        try {
          new window.VLibras.Widget(
            "https://vlibras.gov.br/app"
          );
        } catch (error) {
          console.error(
            "Erro ao inicializar o VLibras:",
            error
          );
        }

        return;
      }

      attempts += 1;

      if (attempts <= 40) {
        window.setTimeout(initializeWidget, 250);
      }
    }

    const existingScript = document.getElementById(
      SCRIPT_ID
    ) as HTMLScriptElement | null;

    if (existingScript) {
      initializeWidget();

      existingScript.addEventListener(
        "load",
        initializeWidget
      );

      return () => {
        cancelled = true;

        existingScript.removeEventListener(
          "load",
          initializeWidget
        );
      };
    }

    const script = document.createElement("script");

    script.id = SCRIPT_ID;
    script.src =
      "https://vlibras.gov.br/app/vlibras-plugin.js";
    script.async = true;

    script.onload = () => {
      initializeWidget();
    };

    script.onerror = () => {
      console.error(
        "Não foi possível carregar o script do VLibras."
      );
    };

    document.body.appendChild(script);

    initializeWidget();

    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <div
      {...({ vw: "" } as Record<string, string>)}
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