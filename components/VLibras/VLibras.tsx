"use client";

import {
  useEffect,
  useSyncExternalStore,
} from "react";

declare global {
  interface Window {
    VLibras?: {
      Widget: new (url: string) => unknown;
    };

    __guardioesVlibrasInitialized?: boolean;
  }
}

const SCRIPT_ID = "vlibras-official-script";

const SCRIPT_URL =
  "https://vlibras.gov.br/app/vlibras-plugin.js";

const APP_URL =
  "https://vlibras.gov.br/app";

/*
 * No servidor retorna false.
 * Depois que a hidratação termina no navegador,
 * retorna true.
 */
function subscribe() {
  return () => {};
}

function getClientSnapshot() {
  return true;
}

function getServerSnapshot() {
  return false;
}

export default function VLibras() {
  const hydrated = useSyncExternalStore(
    subscribe,
    getClientSnapshot,
    getServerSnapshot,
  );

  useEffect(() => {
    if (!hydrated) {
      return;
    }

    let cancelled = false;

    function initialize() {
      if (cancelled) {
        return;
      }

      if (
        window.__guardioesVlibrasInitialized
      ) {
        return;
      }

      if (!window.VLibras?.Widget) {
        return;
      }

      /*
       * Neste momento o React já terminou
       * completamente a hidratação.
       */
      window.requestAnimationFrame(() => {
        window.requestAnimationFrame(() => {
          if (cancelled) {
            return;
          }

          if (
            window
              .__guardioesVlibrasInitialized
          ) {
            return;
          }

          try {
            new window.VLibras!.Widget(
              APP_URL,
            );

            window.__guardioesVlibrasInitialized =
              true;

            console.log(
              "VLibras inicializado com sucesso.",
            );
          } catch (error) {
            window.__guardioesVlibrasInitialized =
              false;

            console.error(
              "Erro ao inicializar VLibras:",
              error,
            );
          }
        });
      });
    }

    /*
     * Verifica se o script já existe.
     */
    let script =
      document.getElementById(
        SCRIPT_ID,
      ) as HTMLScriptElement | null;

    /*
     * Script já carregado.
     */
    if (window.VLibras?.Widget) {
      initialize();
    } else if (!script) {
      /*
       * Carrega somente depois da hidratação.
       */
      script =
        document.createElement("script");

      script.id = SCRIPT_ID;
      script.src = SCRIPT_URL;
      script.async = true;

      script.addEventListener(
        "load",
        initialize,
      );

      script.addEventListener(
        "error",
        () => {
          console.error(
            "Falha ao carregar o script oficial do VLibras.",
          );
        },
      );

      document.body.appendChild(script);
    } else {
      /*
       * O script existe, mas ainda está
       * terminando de carregar.
       */
      script.addEventListener(
        "load",
        initialize,
      );
    }

    return () => {
      cancelled = true;

      script?.removeEventListener(
        "load",
        initialize,
      );
    };
  }, [hydrated]);

  /*
   * MUITO IMPORTANTE:
   *
   * No servidor e durante a hidratação
   * não renderizamos absolutamente nada.
   *
   * Assim o VLibras não consegue modificar
   * o DOM antes do React terminar.
   */
  if (!hydrated) {
    return null;
  }

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