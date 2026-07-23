"use client";

import {
  CalendarDays,
  MapPin,
  Ticket,
} from "lucide-react";
import {
  useEffect,
  useMemo,
  useState,
} from "react";

import styles from "./EventSection.module.css";

interface Countdown {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

const EVENT_DATE =
  "2026-10-31T08:00:00-03:00";

const INITIAL_COUNTDOWN: Countdown = {
  days: 0,
  hours: 0,
  minutes: 0,
  seconds: 0,
};

function getCountdown(): Countdown {
  const eventTime =
    new Date(EVENT_DATE).getTime();

  const currentTime = Date.now();

  const difference = Math.max(
    0,
    eventTime - currentTime,
  );

  const totalSeconds = Math.floor(
    difference / 1000,
  );

  return {
    days: Math.floor(
      totalSeconds / 86400,
    ),

    hours: Math.floor(
      (totalSeconds % 86400) / 3600,
    ),

    minutes: Math.floor(
      (totalSeconds % 3600) / 60,
    ),

    seconds:
      totalSeconds % 60,
  };
}

function formatValue(value: number) {
  return String(value).padStart(2, "0");
}

export default function EventSection() {
  const [countdown, setCountdown] =
    useState<Countdown>(
      INITIAL_COUNTDOWN,
    );

  const [isMounted, setIsMounted] =
    useState(false);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setIsMounted(true);

    function updateCountdown() {
      setCountdown(getCountdown());
    }

    updateCountdown();

    const intervalId =
      window.setInterval(
        updateCountdown,
        1000,
      );

    return () => {
      window.clearInterval(intervalId);
    };
  }, []);

  const countdownItems = useMemo(
    () => [
      {
        value: countdown.days,
        label: "Dias",
      },
      {
        value: countdown.hours,
        label: "Horas",
      },
      {
        value: countdown.minutes,
        label: "Min",
      },
      {
        value: countdown.seconds,
        label: "Seg",
      },
    ],
    [countdown],
  );

  return (
    <section
      id="evento"
      className={styles.eventSection}
    >
      <div
        className={styles.background}
        aria-hidden="true"
      />

      <div className={styles.container}>
        <header className={styles.header}>
          <div
            className={styles.crown}
            aria-hidden="true"
          >
            ♛
          </div>

          <div className={styles.eyebrow}>
            <span />

            <strong>
              Próximo evento
            </strong>

            <span />
          </div>

          <h2 className={styles.title}>
            <small aria-hidden="true">
              ✦
            </small>

            <span>
              Festival Todo Mundo no Samba
            </span>

            <small aria-hidden="true">
              ✦
            </small>
          </h2>
        </header>

        <div className={styles.mainContent}>
          <div className={styles.eventInfo}>
            <article className={styles.infoItem}>
              <CalendarDays
                aria-hidden="true"
              />

              <div>
                <strong>
                  31 de outubro de 2026
                </strong>

                <span>
                  Sábado • A partir das 08h
                </span>
              </div>
            </article>

            <article className={styles.infoItem}>
              <MapPin aria-hidden="true" />

              <div>
                <strong>
                  Av. Nelson Cardoso, nº 82
                </strong>

                <span>
                  Bairro Tanque • RJ
                </span>
              </div>
            </article>

            <article className={styles.infoItem}>
              <Ticket aria-hidden="true" />

              <div>
                <strong>
                  Garanta seu ingresso
                </strong>

                <span>
                  E venha fazer parte desta festa!
                </span>
              </div>
            </article>
          </div>

          <div className={styles.countdownBlock}>
            <div
              className={styles.countdown}
              aria-label="Contagem regressiva para o Festival Todo Mundo no Samba"
              aria-live="polite"
            >
              {countdownItems.map((item) => (
                <div
                  key={item.label}
                  className={
                    styles.countdownCard
                  }
                >
                  <strong>
                    {isMounted
                      ? formatValue(item.value)
                      : "00"}
                  </strong>

                  <span>
                    {item.label}
                  </span>
                </div>
              ))}
            </div>

            <a
              href="#detalhes-evento"
              className={styles.eventButton}
            >
              <span>
                Saiba mais sobre o evento
              </span>

              <strong aria-hidden="true">
                ›
              </strong>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}