"use client";

import Image from "next/image";
import { useRef, useState } from "react";
import {
  ChevronRight,
  Pause,
  Play,
  Volume2,
  VolumeX,
} from "lucide-react";

import AutomaticCurtainEffect from "@/components/AutomaticCurtainEffect/AutomaticCurtainEffect";
import styles from "./Hero.module.css";

export default function Hero() {
  const videoRef = useRef<HTMLVideoElement>(null);

  const [isPlaying, setIsPlaying] =
    useState(false);

  const [isMuted, setIsMuted] =
    useState(true);

  async function toggleVideo() {
    const video = videoRef.current;

    if (!video) return;

    try {
      if (video.paused) {
        await video.play();
      } else {
        video.pause();
      }
    } catch (error) {
      console.error(
        "Não foi possível reproduzir o vídeo:",
        error,
      );
    }
  }

  function toggleMuted() {
    const video = videoRef.current;

    if (!video) return;

    video.muted = !video.muted;

    setIsMuted(video.muted);
  }

  return (
    <AutomaticCurtainEffect
      id="inicio"
      openOncePerSession
      curtainImage="/images/cortina-fechada1.png"
      duration={2200}
      delay={450}
      
    >
      <section className={styles.hero}>
        {/* =================================================
            FUNDO DECORATIVO
        ================================================= */}

        <div
          className={styles.backgroundDecorations}
          aria-hidden="true"
        >
          <div className={styles.lightTop} />

          <div className={styles.lightBottom} />

          <div
            className={styles.decorativeCircle}
          />

          <div
            className={styles.decorativeLines}
          />
        </div>

        {/* =================================================
            CONTEÚDO PRINCIPAL
        ================================================= */}

        <div className={styles.mainArea}>
          <div className={styles.container}>
            {/* =============================================
                TEXTO
            ============================================= */}

            <div className={styles.content}>
              <span className={styles.eyebrow}>
                G.R.E.S. Guardiões da Capadócia
              </span>

              <h1 className={styles.title}>
                <span
                  className={styles.titleWhite}
                >
                  Tradição, garra e paixão
                </span>

                <strong
                  className={styles.titleGold}
                >
                  que desfilam no samba!
                </strong>
              </h1>

              <p className={styles.description}>
                Guardiões da Capadócia,
                honrando nossa história e
                escrevendo nosso futuro.
              </p>

              <div className={styles.actions}>
                <a
                  href="#quem-somos"
                  className={
                    styles.primaryButton
                  }
                >
                  <span>Conheça a escola</span>

                  <ChevronRight
                    size={20}
                    strokeWidth={2.5}
                    aria-hidden="true"
                  />
                </a>

                <button
                  type="button"
                  className={
                    styles.secondaryButton
                  }
                  onClick={toggleVideo}
                  aria-label={
                    isPlaying
                      ? "Pausar vídeo"
                      : "Reproduzir vídeo"
                  }
                >
                  {isPlaying ? (
                    <Pause
                      size={22}
                      fill="currentColor"
                      aria-hidden="true"
                    />
                  ) : (
                    <Play
                      size={22}
                      fill="currentColor"
                      aria-hidden="true"
                    />
                  )}
                </button>
              </div>
            </div>

            {/* =============================================
                VÍDEO
            ============================================= */}

            <div className={styles.videoColumn}>
              <div
                className={
                  styles.videoBackFrame
                }
                aria-hidden="true"
              />

              <div className={styles.videoFrame}>
                <video
                  ref={videoRef}
                  className={styles.video}
                  src="/videos/guardioes.mp4"
                  poster="/images/logo.png"
                  muted={isMuted}
                  playsInline
                  preload="metadata"
                  onPlay={() =>
                    setIsPlaying(true)
                  }
                  onPause={() =>
                    setIsPlaying(false)
                  }
                  onEnded={() =>
                    setIsPlaying(false)
                  }
                />

                <div
                  className={styles.videoShade}
                  aria-hidden="true"
                />

                {/* =========================================
                    CABEÇALHO DO VÍDEO
                ========================================= */}

                <div
                  className={styles.videoHeader}
                >
                  <Image
                    src="/images/logo.png"
                    alt=""
                    width={52}
                    height={52}
                    className={styles.videoLogo}
                  />

                  <div
                    className={
                      styles.videoHeaderText
                    }
                  >
                    <small>
                      Conheça nossa história
                    </small>

                    <strong>
                      Guardiões da Capadócia
                    </strong>
                  </div>
                </div>

                {/* =========================================
                    BOTÃO CENTRAL
                ========================================= */}

                {!isPlaying && (
                  <button
                    type="button"
                    className={
                      styles.centerPlayButton
                    }
                    onClick={toggleVideo}
                    aria-label="Reproduzir vídeo da Guardiões da Capadócia"
                  >
                    <span
                      className={styles.playPulse}
                    />

                    <Play
                      size={32}
                      fill="currentColor"
                      aria-hidden="true"
                    />
                  </button>
                )}

                {/* =========================================
                    CONTROLES DO VÍDEO
                ========================================= */}

                <div
                  className={
                    styles.videoControls
                  }
                >
                  <button
                    type="button"
                    className={
                      styles.controlButton
                    }
                    onClick={toggleVideo}
                    aria-label={
                      isPlaying
                        ? "Pausar vídeo"
                        : "Reproduzir vídeo"
                    }
                  >
                    {isPlaying ? (
                      <Pause
                        size={17}
                        fill="currentColor"
                        aria-hidden="true"
                      />
                    ) : (
                      <Play
                        size={17}
                        fill="currentColor"
                        aria-hidden="true"
                      />
                    )}
                  </button>

                  <div
                    className={
                      styles.videoProgress
                    }
                  >
                    <span />
                  </div>

                  <span
                    className={
                      styles.videoLabel
                    }
                  >
                    Nossa escola
                  </span>

                  <button
                    type="button"
                    className={
                      styles.controlButton
                    }
                    onClick={toggleMuted}
                    aria-label={
                      isMuted
                        ? "Ativar som"
                        : "Desativar som"
                    }
                  >
                    {isMuted ? (
                      <VolumeX
                        size={18}
                        aria-hidden="true"
                      />
                    ) : (
                      <Volume2
                        size={18}
                        aria-hidden="true"
                      />
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* =================================================
            FAIXA INFERIOR
        ================================================= */}

        <div className={styles.bottomBar}>
          <div
            className={
              styles.bottomBarContent
            }
          >
            <div className={styles.bottomItem}>
              <span className={styles.bottomIcon}>
                ✦
              </span>

              <div>
                <small>Nossa essência</small>

                <strong>
                  Tradição e paixão
                </strong>
              </div>
            </div>

            <div
              className={styles.bottomDivider}
            />

            <div className={styles.bottomItem}>
              <span className={styles.bottomIcon}>
                ♬
              </span>

              <div>
                <small>Nossa missão</small>

                <strong>
                  Manter o samba vivo
                </strong>
              </div>
            </div>

            <div
              className={styles.bottomDivider}
            />

            <div className={styles.bottomItem}>
              <span className={styles.bottomIcon}>
                ★
              </span>

              <div>
                <small>Nosso futuro</small>

                <strong>
                  Escrever uma nova história
                </strong>
              </div>
            </div>
          </div>
        </div>
      </section>
    </AutomaticCurtainEffect>
  );
}