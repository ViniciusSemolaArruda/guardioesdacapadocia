"use client";

import { useEffect, useRef } from "react";

declare global {
  interface Window {
    VLibras?: {
      Widget: new (url: string) => unknown;
    };
  }
}

const VLIBRAS_APP_URL =
  "https://vlibras.gov.br/app";

const MAX_ATTEMPTS = 200;
const RETRY_DELAY = 100;

export default function VLibras() {
  const initializedRef = useRef(false);

  useEffect(() => {
    let cancelled = false;
    let attempts = 0;
    let timer: number | undefined;

    function widgetWasRendered() {
      return Boolean(
        document.querySelector(
          [
            ".vpw-container",
            ".vpw-box",
            ".vpw-controls",
          ].join(", "),
        ),
      );
    }

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

    function initializeVLibras() {
      if (cancelled) {
        return;
      }

      maintainOfficialClasses();

      if (widgetWasRendered()) {
        initializedRef.current = true;
        return;
      }

      if (
        !initializedRef.current &&
        window.VLibras?.Widget
      ) {
        try {
          new window.VLibras.Widget(
            VLIBRAS_APP_URL,
          );

          initializedRef.current = true;

          console.log(
            "VLibras inicializado corretamente.",
          );

          return;
        } catch (error) {
          initializedRef.current = false;

          console.error(
            "Erro ao inicializar o VLibras:",
            error,
          );
        }
      }

      attempts += 1;

      if (attempts < MAX_ATTEMPTS) {
        timer = window.setTimeout(
          initializeVLibras,
          RETRY_DELAY,
        );

        return;
      }

      console.error(
        "O VLibras não conseguiu ser inicializado.",
      );
    }

    /*
     * Aguarda o React terminar de montar a estrutura
     * antes de tentar inicializar o widget.
     */
    window.requestAnimationFrame(() => {
      window.requestAnimationFrame(() => {
        initializeVLibras();
      });
    });

    return () => {
      cancelled = true;

      if (timer !== undefined) {
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