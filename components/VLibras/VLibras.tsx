"use client";

import Script from "next/script";
import { useCallback, useEffect } from "react";

declare global {
  interface Window {
    VLibras?: {
      Widget: new (url: string) => unknown;
    };

    vlibrasWidgetInitialized?: boolean;
  }
}

export default function VLibras() {
  const initializeVLibras = useCallback(() => {
    if (
      typeof window === "undefined" ||
      !window.VLibras ||
      window.vlibrasWidgetInitialized
    ) {
      return;
    }

    new window.VLibras.Widget("https://vlibras.gov.br/app");

    window.vlibrasWidgetInitialized = true;
  }, []);

  useEffect(() => {
    initializeVLibras();
  }, [initializeVLibras]);

  return (
    <>
      <div
        {...({ vw: "" } as Record<string, string>)}
        className="enabled"
      >
        <div
          {...({ "vw-access-button": "" } as Record<string, string>)}
          className="active"
        />

        <div
          {...({ "vw-plugin-wrapper": "" } as Record<string, string>)}
        >
          <div className="vw-plugin-top-wrapper" />
        </div>
      </div>

      <Script
        id="vlibras-plugin"
        src="https://vlibras.gov.br/app/vlibras-plugin.js"
        strategy="afterInteractive"
        onLoad={initializeVLibras}
      />
    </>
  );
}