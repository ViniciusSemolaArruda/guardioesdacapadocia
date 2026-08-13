"use client";

import {
  CalendarDays,
  MapPin,
  Ticket,
} from "lucide-react";
import { motion } from "framer-motion";
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

const infoContainerAnimation = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.15,
      delayChildren: 0.1,
    },
  },
};

const infoItemAnimation = {
  hidden: {
    opacity: 0,
    x: -50,
  },
  visible: {
    opacity: 1,
    x: 0,
  },
};

const countdownContainerAnimation = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.12,
      delayChildren: 0.2,
    },
  },
};

const countdownCardAnimation = {
  hidden: {
    opacity: 0,
    y: 35,
    scale: 0.9,
  },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
  },
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
        {/* CABEÇALHO */}
        <motion.header
          className={styles.header}
          initial={{
            opacity: 0,
            y: -40,
          }}
          whileInView={{
            opacity: 1,
            y: 0,
          }}
          viewport={{
            once: true,
            amount: 0.4,
          }}
          transition={{
            duration: 0.75,
            ease: [0.22, 1, 0.36, 1],
          }}
        >
          <motion.div
            className={styles.crown}
            aria-hidden="true"
            initial={{
              opacity: 0,
              scale: 0.5,
              rotate: -15,
            }}
            whileInView={{
              opacity: 1,
              scale: 1,
              rotate: 0,
            }}
            viewport={{
              once: true,
            }}
            transition={{
              duration: 0.65,
              delay: 0.15,
              ease: [0.22, 1, 0.36, 1],
            }}
          >
            ♛
          </motion.div>

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
        </motion.header>

        <div className={styles.mainContent}>
          {/* INFORMAÇÕES DO EVENTO */}
          <motion.div
            className={styles.eventInfo}
            variants={infoContainerAnimation}
            initial="hidden"
            whileInView="visible"
            viewport={{
              once: true,
              amount: 0.25,
            }}
          >
            <motion.article
              className={styles.infoItem}
              variants={infoItemAnimation}
              transition={{
                duration: 0.7,
                ease: [0.22, 1, 0.36, 1],
              }}
            >
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
            </motion.article>

            <motion.article
              className={styles.infoItem}
              variants={infoItemAnimation}
              transition={{
                duration: 0.7,
                ease: [0.22, 1, 0.36, 1],
              }}
            >
              <MapPin aria-hidden="true" />

              <div>
                <strong>
                  Av. Nelson Cardoso, nº 82
                </strong>

                <span>
                  Bairro Tanque • RJ
                </span>
              </div>
            </motion.article>

            <motion.article
              className={styles.infoItem}
              variants={infoItemAnimation}
              transition={{
                duration: 0.7,
                ease: [0.22, 1, 0.36, 1],
              }}
            >
              <Ticket aria-hidden="true" />

              <div>
                <strong>
                  Garanta seu ingresso
                </strong>

                <span>
                  E venha fazer parte desta festa!
                </span>
              </div>
            </motion.article>
          </motion.div>

          {/* CONTAGEM REGRESSIVA */}
          <motion.div
            className={styles.countdownBlock}
            initial={{
              opacity: 0,
              x: 60,
            }}
            whileInView={{
              opacity: 1,
              x: 0,
            }}
            viewport={{
              once: true,
              amount: 0.25,
            }}
            transition={{
              duration: 0.8,
              delay: 0.15,
              ease: [0.22, 1, 0.36, 1],
            }}
          >
            <motion.div
              className={styles.countdown}
              aria-label="Contagem regressiva para o Festival Todo Mundo no Samba"
              aria-live="polite"
              variants={countdownContainerAnimation}
              initial="hidden"
              whileInView="visible"
              viewport={{
                once: true,
                amount: 0.3,
              }}
            >
              {countdownItems.map((item) => (
                <motion.div
                  key={item.label}
                  className={
                    styles.countdownCard
                  }
                  variants={
                    countdownCardAnimation
                  }
                  transition={{
                    duration: 0.55,
                    ease: [0.22, 1, 0.36, 1],
                  }}
                >
                  <strong>
                    {isMounted
                      ? formatValue(item.value)
                      : "00"}
                  </strong>

                  <span>
                    {item.label}
                  </span>
                </motion.div>
              ))}
            </motion.div>

            <motion.a
              href="/evento"
              className={styles.eventButton}
              initial={{
                opacity: 0,
                y: 25,
              }}
              whileInView={{
                opacity: 1,
                y: 0,
              }}
              viewport={{
                once: true,
              }}
              transition={{
                duration: 0.6,
                delay: 0.65,
                ease: [0.22, 1, 0.36, 1],
              }}
              whileHover={{
                scale: 1.03,
              }}
              whileTap={{
                scale: 0.97,
              }}
            >
              <span>
                Saiba mais sobre o evento
              </span>

              <strong aria-hidden="true">
                ›
              </strong>
            </motion.a>
          </motion.div>
        </div>
      </div>
    </section>
  );
}