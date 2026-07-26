"use client";

import Script from "next/script";
import { useCallback, useRef } from "react";

declare global {
  interface Window {
    VLibras?: {
      Widget: new (url: string) => unknown;
    };
  }
}

export default function VLibras() {
  const initializedRef = useRef(false);

  const initializeVLibras = useCallback(() => {
    if (typeof window === "undefined") {
      return;
    }

    if (!window.VLibras?.Widget) {
      return;
    }

    /*
     * Evita criar o widget mais de uma vez durante
     * navegação, Fast Refresh ou re-renderização.
     */
    if (initializedRef.current) {
      return;
    }

    /*
     * Procura a estrutura gerada no documento inteiro,
     * e não somente dentro do #vlibras-root.
     */
    const existingWidget = document.querySelector(
      ".vpw-container, .vpw-box, .vpw-settings-btn",
    );

    if (existingWidget) {
      initializedRef.current = true;
      return;
    }

    try {
      new window.VLibras.Widget(
        "https://vlibras.gov.br/app",
      );

      initializedRef.current = true;
    } catch (error) {
      console.error(
        "Erro ao inicializar o VLibras:",
        error,
      );
    }
  }, []);

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
        onError={() => {
          console.error(
            "Não foi possível carregar o script do VLibras.",
          );
        }}
      />
    </>
  );
}