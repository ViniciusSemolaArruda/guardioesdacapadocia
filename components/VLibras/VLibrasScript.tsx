"use client";

import Script from "next/script";

declare global {
  interface Window {
    VLibras?: {
      Widget: new (url: string) => unknown;
    };

    __vlibrasInitialized?: boolean;
  }
}

export default function VLibrasScript() {
  function initializeVLibras() {
    if (typeof window === "undefined") return;

    if (!window.VLibras?.Widget) return;

    if (window.__vlibrasInitialized) return;

    const container = document.querySelector("[vw]");

    if (!container) {
      console.error(
        "O elemento principal do VLibras não foi encontrado.",
      );

      return;
    }

    try {
      new window.VLibras.Widget(
        "https://vlibras.gov.br/app",
      );

      window.__vlibrasInitialized = true;
    } catch (error) {
      console.error(
        "Erro ao inicializar o VLibras:",
        error,
      );
    }
  }

  return (
    <Script
      id="vlibras-plugin"
      src="https://vlibras.gov.br/app/vlibras-plugin.js"
      strategy="afterInteractive"
      onLoad={initializeVLibras}
      onReady={initializeVLibras}
      onError={(error) => {
        console.error(
          "Erro ao carregar o script do VLibras:",
          error,
        );
      }}
    />
  );
}