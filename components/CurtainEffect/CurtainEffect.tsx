"use client";

import {
  CSSProperties,
  ReactNode,
  useEffect,
  useRef,
  useState,
} from "react";

import styles from "./CurtainEffect.module.css";

/* =========================================================
   TIPAGEM DAS VARIÁVEIS CSS PERSONALIZADAS
========================================================= */

type CurtainCSSProperties = CSSProperties & {
  "--curtain-image"?: string;
};

/* =========================================================
   PROPRIEDADES DO COMPONENTE
========================================================= */

interface CurtainEffectProps {
  /**
   * Conteúdo que ficará atrás da cortina.
   *
   * Aqui você pode colocar:
   * - imagem de fundo;
   * - textos;
   * - botões;
   * - logos;
   * - qualquer conteúdo do Hero.
   */
  children: ReactNode;

  /**
   * ID da seção.
   *
   * Por padrão será "inicio".
   */
  id?: string;

  /**
   * Caminho da imagem da cortina fechada.
   */
  curtainImage?: string;

  /**
   * Texto apresentado no indicador de rolagem.
   */
  scrollLabel?: string;

  /**
   * Chave usada no sessionStorage.
   *
   * Permite utilizar mais de uma cortina no projeto,
   * caso cada uma tenha uma chave diferente.
   */
  sessionKey?: string;

  /**
   * Classe opcional adicionada à seção externa.
   */
  className?: string;

  /**
   * Classe opcional adicionada ao palco interno.
   */
  stageClassName?: string;
}

/* =========================================================
   CONFIGURAÇÕES PADRÃO
========================================================= */

const DEFAULT_SESSION_KEY =
  "guardioes-curtain-opened";

const DEFAULT_CURTAIN_IMAGE =
  "/images/cortina-fechada1.png";

/* =========================================================
   FUNÇÕES AUXILIARES
========================================================= */

function clamp(
  value: number,
  min = 0,
  max = 1,
) {
  return Math.min(
    Math.max(value, min),
    max,
  );
}

function easeInOutCubic(value: number) {
  return value < 0.5
    ? 4 * value * value * value
    : 1 -
        Math.pow(-2 * value + 2, 3) /
          2;
}

/**
 * Deve acompanhar a altura real do Header.
 *
 * Os mesmos valores também aparecem nos media queries
 * do arquivo CurtainEffect.module.css.
 */
function getHeaderHeight() {
  const width = window.innerWidth;

  if (width <= 520) {
    return 86;
  }

  if (width <= 900) {
    return 96;
  }

  if (width <= 1250) {
    return 185;
  }

  return Math.min(
    215,
    Math.max(
      200,
      width * 0.115,
    ),
  );
}

/* =========================================================
   COMPONENTE
========================================================= */

export default function CurtainEffect({
  children,
  id = "inicio",
  curtainImage = DEFAULT_CURTAIN_IMAGE,
  scrollLabel = "Role para abrir",
  sessionKey = DEFAULT_SESSION_KEY,
  className = "",
  stageClassName = "",
}: CurtainEffectProps) {
  const sectionRef =
    useRef<HTMLElement | null>(null);

  const stageRef =
    useRef<HTMLDivElement | null>(null);

  /**
   * Indica que a leitura do sessionStorage
   * já foi concluída.
   *
   * Enquanto isso não acontece, o palco fica oculto
   * para evitar um flash da cortina no estado errado.
   */
  const [isReady, setIsReady] =
    useState(false);

  /**
   * Estado React utilizado para aplicar a classe
   * definitiva de cortina aberta.
   */
  const [
    isCurtainOpened,
    setIsCurtainOpened,
  ] = useState(false);

  /**
   * Referência utilizada dentro dos eventos de scroll.
   *
   * Ela evita depender de uma renderização do React
   * para saber se a cortina já foi aberta.
   */
  const curtainOpenedRef =
    useRef(false);

  /* =======================================================
     VERIFICA O ESTADO SALVO NA SESSÃO
  ======================================================= */

  useEffect(() => {
    let alreadyOpened = false;

    try {
      alreadyOpened =
        window.sessionStorage.getItem(
          sessionKey,
        ) === "true";
    } catch {
      alreadyOpened = false;
    }

    curtainOpenedRef.current =
      alreadyOpened;

    // eslint-disable-next-line react-hooks/set-state-in-effect
    setIsCurtainOpened(
      alreadyOpened,
    );

    setIsReady(true);
  }, [sessionKey]);

  /* =======================================================
     ANIMAÇÃO CONTROLADA PELO SCROLL
  ======================================================= */

  useEffect(() => {
    if (!isReady) {
      return;
    }

    const section =
      sectionRef.current;

    const stage =
      stageRef.current;

    if (!section || !stage) {
      return;
    }

    let animationFrameId:
      | number
      | null = null;

    /* =====================================================
       APLICA O ESTADO FINAL
    ===================================================== */

    const applyOpenedState = () => {
      stage.style.setProperty(
        "--curtain-left-x",
        "-102%",
      );

      stage.style.setProperty(
        "--curtain-right-x",
        "102%",
      );

      stage.style.setProperty(
        "--curtain-opacity",
        "0",
      );

      stage.style.setProperty(
        "--curtain-edge-shadow",
        "0",
      );

      stage.style.setProperty(
        "--seam-opacity",
        "0",
      );

      stage.style.setProperty(
        "--hero-darkness",
        "0",
      );

      stage.style.setProperty(
        "--hero-scale",
        "1",
      );

      stage.style.setProperty(
        "--content-opacity",
        "1",
      );

      stage.style.setProperty(
        "--content-y",
        "0px",
      );

      stage.style.setProperty(
        "--scroll-indicator-opacity",
        "0",
      );
    };

    /* =====================================================
       TRAVA A CORTINA ABERTA
    ===================================================== */

    const lockCurtainOpened = () => {
      if (
        curtainOpenedRef.current
      ) {
        applyOpenedState();
        return;
      }

      curtainOpenedRef.current =
        true;

      setIsCurtainOpened(true);

      try {
        window.sessionStorage.setItem(
          sessionKey,
          "true",
        );
      } catch {
        /**
         * Caso o navegador bloqueie o armazenamento,
         * a cortina continuará aberta enquanto este
         * componente permanecer montado.
         */
      }

      applyOpenedState();
    };

    /**
     * Caso a cortina já tenha sido aberta nesta sessão,
     * aplica imediatamente o estado final.
     */
    if (
      curtainOpenedRef.current ||
      isCurtainOpened
    ) {
      applyOpenedState();
    }

    /* =====================================================
       ATUALIZAÇÃO DA ANIMAÇÃO
    ===================================================== */

    const updateAnimation = () => {
      animationFrameId = null;

      /**
       * Depois que a abertura termina, a cortina não
       * fecha novamente quando o usuário sobe a página.
       */
      if (
        curtainOpenedRef.current
      ) {
        applyOpenedState();
        return;
      }

      const reducedMotion =
        window.matchMedia(
          "(prefers-reduced-motion: reduce)",
        ).matches;

      if (reducedMotion) {
        lockCurtainOpened();
        return;
      }

      const headerHeight =
        getHeaderHeight();

      const sectionTop =
        section.getBoundingClientRect()
          .top + window.scrollY;

      const stageHeight =
        Math.max(
          1,
          window.innerHeight -
            headerHeight,
        );

      const animationStart =
        sectionTop - headerHeight;

      const animationDistance =
        Math.max(
          1,
          section.offsetHeight -
            stageHeight,
        );

      const rawProgress =
        (window.scrollY -
          animationStart) /
        animationDistance;

      const progress =
        clamp(rawProgress);

      /**
       * Pequeno intervalo inicial para que a pessoa
       * consiga visualizar a cortina totalmente fechada.
       */
      const openingProgress =
        clamp(
          (progress - 0.035) /
            0.82,
        );

      const easedOpening =
        easeInOutCubic(
          openingProgress,
        );

      const curtainMovement =
        easedOpening * 102;

      /**
       * A cortina só começa a desaparecer quando já
       * estiver praticamente fora da tela.
       */
      const curtainOpacity =
        clamp(
          1 -
            (progress - 0.82) /
              0.14,
        );

      const seamOpacity =
        clamp(
          1 -
            openingProgress * 6,
        );

      const curtainEdgeShadow =
        clamp(
          0.52 -
            easedOpening * 0.34,
          0.12,
          0.52,
        );

      const heroDarkness =
        0.42 -
        easedOpening * 0.42;

      const heroScale =
        1.035 -
        easedOpening * 0.035;

      const contentOpacity =
        clamp(
          (openingProgress -
            0.28) /
            0.42,
        );

      const contentY =
        (1 - contentOpacity) *
        18;

      const indicatorOpacity =
        clamp(
          1 - progress * 6,
        );

      stage.style.setProperty(
        "--curtain-left-x",
        `${-curtainMovement}%`,
      );

      stage.style.setProperty(
        "--curtain-right-x",
        `${curtainMovement}%`,
      );

      stage.style.setProperty(
        "--curtain-opacity",
        curtainOpacity.toString(),
      );

      stage.style.setProperty(
        "--curtain-edge-shadow",
        curtainEdgeShadow.toString(),
      );

      stage.style.setProperty(
        "--seam-opacity",
        seamOpacity.toString(),
      );

      stage.style.setProperty(
        "--hero-darkness",
        heroDarkness.toString(),
      );

      stage.style.setProperty(
        "--hero-scale",
        heroScale.toString(),
      );

      stage.style.setProperty(
        "--content-opacity",
        contentOpacity.toString(),
      );

      stage.style.setProperty(
        "--content-y",
        `${contentY}px`,
      );

      stage.style.setProperty(
        "--scroll-indicator-opacity",
        indicatorOpacity.toString(),
      );

      /**
       * Quando a abertura estiver praticamente completa,
       * salva o estado e trava a cortina aberta.
       */
      if (
        openingProgress >= 0.995
      ) {
        lockCurtainOpened();
      }
    };

    /* =====================================================
       LIMITA ATUALIZAÇÕES COM REQUESTANIMATIONFRAME
    ===================================================== */

    const requestUpdate = () => {
      if (
        animationFrameId !== null
      ) {
        return;
      }

      animationFrameId =
        window.requestAnimationFrame(
          updateAnimation,
        );
    };

    updateAnimation();

    window.addEventListener(
      "scroll",
      requestUpdate,
      {
        passive: true,
      },
    );

    window.addEventListener(
      "resize",
      requestUpdate,
    );

    return () => {
      window.removeEventListener(
        "scroll",
        requestUpdate,
      );

      window.removeEventListener(
        "resize",
        requestUpdate,
      );

      if (
        animationFrameId !== null
      ) {
        window.cancelAnimationFrame(
          animationFrameId,
        );
      }
    };
  }, [
    isReady,
    isCurtainOpened,
    sessionKey,
  ]);

  /* =======================================================
     CLASSES
  ======================================================= */

  const sectionClassName = [
    styles.curtainSection,
    className,
  ]
    .filter(Boolean)
    .join(" ");

  const curtainStageClassName = [
    styles.curtainStage,
    !isReady
      ? styles.curtainStageLoading
      : "",
    isCurtainOpened
      ? styles.curtainStageOpened
      : "",
    stageClassName,
  ]
    .filter(Boolean)
    .join(" ");

  /* =======================================================
     IMAGEM DINÂMICA DA CORTINA
  ======================================================= */

  const curtainStyle:
    CurtainCSSProperties = {
    "--curtain-image": `url("${curtainImage}")`,
  };

  /* =======================================================
     RENDERIZAÇÃO
  ======================================================= */

  return (
    <section
      id={id}
      ref={sectionRef}
      className={sectionClassName}
    >
      <div
        ref={stageRef}
        className={
          curtainStageClassName
        }
        style={curtainStyle}
      >
        {/* Conteúdo do Hero */}
        <div
          className={
            styles.curtainContent
          }
        >
          {children}
        </div>

        {/* Cortina esquerda */}
        <div
          className={`${styles.curtainPanel} ${styles.curtainLeft}`}
          aria-hidden="true"
        >
          <div
            className={
              styles.curtainArtwork
            }
          />

          <div
            className={
              styles.curtainEdge
            }
          />
        </div>

        {/* Cortina direita */}
        <div
          className={`${styles.curtainPanel} ${styles.curtainRight}`}
          aria-hidden="true"
        >
          <div
            className={
              styles.curtainArtwork
            }
          />

          <div
            className={
              styles.curtainEdge
            }
          />
        </div>

        {/* Encontro central das cortinas */}
        <div
          className={
            styles.centerSeam
          }
          aria-hidden="true"
        />

        {/* Indicador para rolar */}
        <div
          className={
            styles.scrollIndicator
          }
          aria-hidden="true"
        >
          <span>{scrollLabel}</span>

          <div
            className={styles.mouse}
          >
            <div
              className={
                styles.mouseWheel
              }
            />
          </div>

          <div
            className={
              styles.scrollArrow
            }
          />
        </div>
      </div>
    </section>
  );
}