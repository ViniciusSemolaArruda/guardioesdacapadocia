/* eslint-disable @next/next/no-html-link-for-pages */
"use client";

import Image from "next/image";
import {
  type ChangeEvent,
  type CSSProperties,
  type MouseEvent,
  useRef,
  useState,
} from "react";

import {
  ChevronRight,
  Pause,
  Play,
  Ticket,
  Volume2,
  VolumeX,
} from "lucide-react";

import AutomaticCurtainEffect from "@/components/AutomaticCurtainEffect/AutomaticCurtainEffect";
import styles from "./Hero.module.css";

const TICKET_URL =
  "https://www.sympla.com.br/evento/passaporte-todo-mundo-no-samba-g-r-e-s-guardioes-da-capadocia/3517324?algoliaID=220fd97b3bd3333b1b7f05cbd66b263f";

export default function Hero() {
  const videoRef = useRef<HTMLVideoElement>(null);

  const [isPlaying, setIsPlaying] =
    useState(false);

  const [isMuted, setIsMuted] =
    useState(true);

  const [currentTime, setCurrentTime] =
    useState(0);

  const [duration, setDuration] =
    useState(0);

  const progress =
    duration > 0
      ? (currentTime / duration) * 100
      : 0;

  const progressStyle = {
    "--video-progress": `${progress}%`,
  } as CSSProperties;

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

  function handleSchoolNavigation(
    event: MouseEvent<HTMLAnchorElement>,
  ) {
    event.preventDefault();

    const section =
      document.getElementById("quem-somos");

    if (!section) {
      window.location.href = "/#quem-somos";
      return;
    }

    const headerHeightValue =
      getComputedStyle(
        document.documentElement,
      ).getPropertyValue("--header-height");

    const headerHeight =
      Number.parseFloat(headerHeightValue) ||
      0;

    const sectionPosition =
      section.getBoundingClientRect().top +
      window.scrollY;

    const destination =
      sectionPosition - headerHeight;

    window.scrollTo({
      top: Math.max(destination, 0),
      behavior: "smooth",
    });

    window.history.replaceState(
      null,
      "",
      "/#quem-somos",
    );
  }

  function toggleMuted() {
    const video = videoRef.current;

    if (!video) return;

    video.muted = !video.muted;
    setIsMuted(video.muted);
  }

  function handleLoadedMetadata() {
    const video = videoRef.current;

    if (!video) return;

    setDuration(
      Number.isFinite(video.duration)
        ? video.duration
        : 0,
    );

    setCurrentTime(video.currentTime);
  }

  function handleTimeUpdate() {
    const video = videoRef.current;

    if (!video) return;

    setCurrentTime(video.currentTime);
  }

  function handleSeek(
    event: ChangeEvent<HTMLInputElement>,
  ) {
    const video = videoRef.current;

    if (!video || !duration) return;

    const newTime = Number(
      event.target.value,
    );

    video.currentTime = newTime;
    setCurrentTime(newTime);
  }

  function formatTime(time: number) {
    if (!Number.isFinite(time)) {
      return "0:00";
    }

    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);

    return `${minutes}:${String(
      seconds,
    ).padStart(2, "0")}`;
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
          className={
            styles.backgroundDecorations
          }
          aria-hidden="true"
        >
          <div className={styles.lightTop} />

          <div
            className={styles.lightBottom}
          />

          <div
            className={
              styles.decorativeCircle
            }
          />

          <div
            className={
              styles.decorativeLines
            }
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
                G.R.E.S. Guardiões da
                Capadócia
              </span>

              <h1 className={styles.title}>
                <span
                  className={
                    styles.titleWhite
                  }
                >
                  Força, Foco, Fé
                </span>

                <strong
                  className={styles.titleGold}
                >
                  e Samba no Pé!
                </strong>
              </h1>

              <p
                className={styles.description}
              >
                Guardiões da Capadócia,
                honrando nossa história e
                escrevendo nosso futuro.
              </p>

              <div className={styles.actions}>
                <a
                  href="/#quem-somos"
                  className={
                    styles.primaryButton
                  }
                  onClick={
                    handleSchoolNavigation
                  }
                >
                  <span>
                    Conheça a escola
                  </span>

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
                VÍDEO E BOTÃO DO INGRESSO
            ============================================= */}

            <div
              className={styles.videoColumn}
            >
              <div
                className={styles.videoVisual}
              >
                <div
                  className={
                    styles.videoBackFrame
                  }
                  aria-hidden="true"
                />

                <div
                  className={
                    styles.videoFrame
                  }
                >
                  <video
                    ref={videoRef}
                    className={styles.video}
                    src="/images/video2.mp4"
                    muted={isMuted}
                    playsInline
                    preload="metadata"
                    onLoadedMetadata={
                      handleLoadedMetadata
                    }
                    onDurationChange={
                      handleLoadedMetadata
                    }
                    onTimeUpdate={
                      handleTimeUpdate
                    }
                    onSeeked={
                      handleTimeUpdate
                    }
                    onPlay={() =>
                      setIsPlaying(true)
                    }
                    onPause={() =>
                      setIsPlaying(false)
                    }
                    onEnded={() => {
                      setIsPlaying(false);
                      setCurrentTime(0);
                    }}
                  />

                  <div
                    className={
                      styles.videoShade
                    }
                    aria-hidden="true"
                  />

                  {/* =========================================
                      CABEÇALHO DO VÍDEO
                  ========================================= */}

                  <div
                    className={
                      styles.videoHeader
                    }
                  >
                    <Image
                      src="/images/logo.png"
                      alt=""
                      width={52}
                      height={52}
                      className={
                        styles.videoLogo
                      }
                    />

                    <div
                      className={
                        styles.videoHeaderText
                      }
                    >
                      <small>
                        Todo Mundo no Samba
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
                        className={
                          styles.playPulse
                        }
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

                    <input
                      type="range"
                      className={
                        styles.videoProgress
                      }
                      min={0}
                      max={duration || 0}
                      step="0.01"
                      value={Math.min(
                        currentTime,
                        duration || 0,
                      )}
                      onChange={handleSeek}
                      style={progressStyle}
                      aria-label="Avançar ou voltar no vídeo"
                      aria-valuetext={`${formatTime(
                        currentTime,
                      )} de ${formatTime(
                        duration,
                      )}`}
                    />

                    <span
                      className={
                        styles.videoLabel
                      }
                    >
                      {formatTime(
                        currentTime,
                      )}{" "}
                      / {formatTime(duration)}
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

              {/* =============================================
                  BOTÃO DO SYMPLA
              ============================================= */}

              <div
                className={
                  styles.ticketButtonWrapper
                }
              >
                <span
                  className={
                    styles.ticketConnector
                  }
                  aria-hidden="true"
                />

                <a
                  href={TICKET_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={
                    styles.ticketButton
                  }
                  aria-label="Adquirir o Passaporte Todo Mundo no Samba pelo Sympla"
                >
                  <span
                    className={
                      styles.ticketIcon
                    }
                  >
                    <Ticket
                      size={25}
                      strokeWidth={2}
                      aria-hidden="true"
                    />
                  </span>

                  <span
                    className={
                      styles.ticketButtonText
                    }
                  >
                    <small>
                      Garanta sua participação
                    </small>

                    <strong>
                      Adquira seu ingresso
                    </strong>
                  </span>

                  <span
                    className={
                      styles.ticketArrow
                    }
                  >
                    <ChevronRight
                      size={23}
                      strokeWidth={2.5}
                      aria-hidden="true"
                    />
                  </span>
                </a>
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
            <div
              className={styles.bottomItem}
            >
              <span
                className={styles.bottomIcon}
              >
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
              className={
                styles.bottomDivider
              }
            />

            <div
              className={styles.bottomItem}
            >
              <span
                className={styles.bottomIcon}
              >
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
              className={
                styles.bottomDivider
              }
            />

            <div
              className={styles.bottomItem}>
              <span
                className={styles.bottomIcon}
              >
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