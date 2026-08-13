"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import {
  CalendarDays,
  Clock3,
  Coffee,
  ExternalLink,
  MapPin,
  Music2,
  Ticket,
  UtensilsCrossed,
} from "lucide-react";

import styles from "./Evento.module.css";
import Header from "@/components/Header/Header";
import Footer from "@/components/Footer/Footer";

const SYMPLA_URL =
  "https://www.sympla.com.br/evento/passaporte-todo-mundo-no-samba-g-r-e-s-guardioes-da-capadocia/3517324?algoliaID=220fd97b3bd3333b1b7f05cbd66b263f";
const MAPS_URL =
  "https://www.google.com/maps/search/?api=1&query=Av.+Nelson+Cardoso,+82,+Tanque,+Rio+de+Janeiro";

const invitedGuests = [
  {
    name: "G.R.E.S. Renascer de Jacarepaguá",
    shortName: "Renascer de Jacarepaguá",
    logo: "/images/convidado-01.png",
  },
  {
    name: "G.R.E.S. Império Serrano",
    shortName: "Império Serrano",
    logo: "/images/convidado-02.png",
  },
];



const schedule = [
  {
    time: "08h",
    title: "Café da manhã",
    description: "Café, leite, pão, laticínios, suco e frutas de época.",
    icon: Coffee,
  },
  {
    time: "12h",
    title: "Almoço",
    description: "Strogonoff de frango.",
    icon: UtensilsCrossed,
  },
  {
    time: "18h",
    title: "Jantar",
    description: "Espaguete à bolonhesa.",
    icon: UtensilsCrossed,
  },
];

const sectionAnimation = {
  initial: {
    opacity: 0,
    y: 55,
  },
  whileInView: {
    opacity: 1,
    y: 0,
  },
  viewport: {
    once: true,
    amount: 0.12,
  },
  transition: {
    duration: 0.85,
    ease: [0.22, 1, 0.36, 1] as [
      number,
      number,
      number,
      number,
    ],
  },
};

export default function EventoPage() {
  return (
    <>
    <Header />
    <main className={styles.page}>
      <motion.section
        className={styles.hero}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
      >
        <div className={styles.heroGlow} aria-hidden="true" />

        <div className={styles.heroContainer}>
            <motion.div
              className={styles.posterColumn}
              initial={{ opacity: 0, x: -60, scale: 0.96 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              transition={{
                duration: 0.9,
                delay: 0.1,
                ease: [0.22, 1, 0.36, 1],
              }}
            >
            <div className={styles.posterFrame}>
              <Image
                src="/images/passaporte-evento2.png"
                alt="Passaporte Todo Mundo no Samba"
                width={483}
                height={731}
                priority
                className={styles.poster}
              />
            </div>
            </motion.div>

          <motion.div
            className={styles.heroContent}
            initial={{ opacity: 0, x: 60 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{
              duration: 0.9,
              delay: 0.2,
              ease: [0.22, 1, 0.36, 1],
            }}
          >
            <span className={styles.eyebrow}>
              <Music2 size={18} aria-hidden="true" />
              Festival Todo Mundo no Samba
            </span>

            <h1 className={styles.title}>
              12 horas de
              <strong>samba, cultura e confraternização</strong>
            </h1>

            <p className={styles.heroDescription}>
              Um dia inteiro para celebrar a música brasileira, o pagode,
              a MPB e os grandes sambas-enredo do nosso carnaval.
            </p>

            <div className={styles.eventInfoGrid}>
              <article className={styles.infoCard}>
                <CalendarDays size={23} aria-hidden="true" />
                <div>
                  <span>Data</span>
                  <strong>31 de outubro de 2026</strong>
                </div>
              </article>

              <article className={styles.infoCard}>
                <Clock3 size={23} aria-hidden="true" />
                <div>
                  <span>Horário</span>
                  <strong>Das 8h às 20h</strong>
                </div>
              </article>

              <article className={styles.infoCard}>
                <MapPin size={23} aria-hidden="true" />
                <div>
                  <span>Local</span>
                  <strong>Renascer de Jacarepaguá</strong>
                </div>
              </article>

              <article className={styles.infoCard}>
                <Ticket size={23} aria-hidden="true" />
                <div>
                  <span>Passaporte</span>
                  <strong>R$ 29,50</strong>
                </div>
              </article>
            </div>

            <div className={styles.heroActions}>
              <a
                href={SYMPLA_URL}
                target="_blank"
                rel="noopener noreferrer"
                className={styles.primaryButton}
              >
                Comprar ingresso
                <ExternalLink size={18} aria-hidden="true" />
              </a>

              <a
                href={MAPS_URL}
                target="_blank"
                rel="noopener noreferrer"
                className={styles.secondaryButton}
              >
                Ver localização
                <MapPin size={18} aria-hidden="true" />
              </a>
            </div>
          </motion.div>
        </div>
      </motion.section>

      <motion.section
        className={styles.aboutSection}
        {...sectionAnimation}
      >
        <div className={styles.sectionContainer}>
          <div className={styles.sectionHeading}>
            <span>Sobre o festival</span>
            <h2>Todo Mundo no Samba</h2>
          </div>

          <div className={styles.aboutGrid}>
            <div className={styles.aboutText}>
              <p>
                Atenção, sambistas e simpatizantes: está chegando o evento
                <strong> Todo Mundo no Samba</strong>.
              </p>

              <p>
                Serão 12 horas de programação com café da manhã, almoço e
                jantar, ao som de MPB, pagode e sambas-enredo atuais e
                antológicos do nosso carnaval.
              </p>

              <p>
                O passaporte dará direito às três refeições e a toda a
                programação do festival. As vendas estarão disponíveis pela
                plataforma Sympla.
              </p>

              <p>
                O encontro acontecerá na quadra da G.R.E.S. Renascer de
                Jacarepaguá. As atrações convidadas serão anunciadas em breve.
              </p>
            </div>

            <aside className={styles.passportCard}>
             <span className={styles.passportLabel}>
  <strong>Passaporte oficial</strong>
  <br />
  Primeiro Lote
</span>
              <strong className={styles.passportPrice}>R$ 29,50</strong>

              <ul>
                <li>12 horas de samba</li>
                <li>Café da manhã</li>
                <li>Almoço</li>
                <li>Jantar</li>
                <li>Programação musical completa</li>
              </ul>

              <a
                href={SYMPLA_URL}
                target="_blank"
                rel="noopener noreferrer"
                className={styles.passportButton}
              >
                Comprar pelo Sympla
              </a>
            </aside>
          </div>
        </div>
      </motion.section>

      <motion.section
        className={styles.scheduleSection}
        {...sectionAnimation}
      >
        <div className={styles.sectionContainer}>
          <div className={styles.sectionHeadingCenter}>
            <span>Programação gastronômica</span>
            <h2>Um dia inteiro de samba e boa comida</h2>
          </div>

          <div className={styles.scheduleGrid}>
            {schedule.map((item) => {
              const Icon = item.icon;

              return (
                <article key={item.time} className={styles.scheduleCard}>
                  <div className={styles.scheduleTime}>{item.time}</div>

                  <div className={styles.scheduleIcon}>
                    <Icon size={25} aria-hidden="true" />
                  </div>

                  <h3>{item.title}</h3>
                  <p>{item.description}</p>
                </article>
              );
            })}
          </div>
        </div>
      </motion.section>

      

      <motion.section
        className={styles.guestsSection}
        {...sectionAnimation}
      >
        <div className={styles.sectionContainer}>
          <div className={styles.sectionHeadingCenter}>
            <span>Participações especiais</span>
            <h2>Escolas convidadas</h2>
            <p>
              Agremiações que estarão presentes celebrando conosco
              o samba, a cultura e a tradição do nosso carnaval.
            </p>
          </div>

          <div className={styles.logoGrid}>
            {invitedGuests.map((guest) => (
              <article key={guest.name} className={styles.logoCard}>
                <div className={styles.logoCardTop}>
                  <span className={styles.guestBadge}>
                    Escola convidada
                  </span>
                </div>

                <div className={styles.logoImageArea}>
                  <Image
                    src={guest.logo}
                    alt={`Logo da ${guest.name}`}
                    width={420}
                    height={300}
                    sizes="(max-width: 600px) 86vw, (max-width: 900px) 42vw, 420px"
                    className={styles.partnerLogo}
                  />
                </div>

                <div className={styles.guestNameArea}>
                  <small>G.R.E.S.</small>
                  <strong>{guest.shortName}</strong>
                </div>
              </article>
            ))}
          </div>
        </div>
      </motion.section>

      

      <motion.section
        className={styles.finalCta}
        {...sectionAnimation}
      >
        <div className={styles.finalCtaGlow} aria-hidden="true" />

        <div className={styles.finalCtaContent}>
          <span>31 de outubro de 2026</span>

          <h2>Venha viver 12 horas inesquecíveis de samba!</h2>

          <p>
            Garanta seu passaporte e faça parte desta grande celebração
            da cultura brasileira.
          </p>

          <a
            href={SYMPLA_URL}
            target="_blank"
            rel="noopener noreferrer"
            className={styles.finalCtaButton}
          >
            Garantir meu ingresso
            <Ticket size={20} aria-hidden="true" />
          </a>
        </div>
      </motion.section>

      <motion.section
        className={styles.locationSection}
        {...sectionAnimation}
      >
  <div className={styles.sectionContainer}>
    <div className={styles.sectionHeadingCenter}>
      <span>Como chegar</span>
      <h2>Local do Evento</h2>
    </div>

    <div className={styles.locationGrid}>
      <div className={styles.locationInfo}>
        <h3>
          Quadra da G.R.E.S. Renascer de Jacarepaguá
        </h3>

        <p>
          Avenida Nelson Cardoso, nº 82
          <br />
          Largo do Tanque
          <br />
          Jacarepaguá - Rio de Janeiro
        </p>

        <a
          href="https://maps.google.com/?q=Av.+Nelson+Cardoso,+82,+Rio+de+Janeiro"
          target="_blank"
          rel="noopener noreferrer"
          className={styles.locationButton}
        >
          Abrir no Google Maps
        </a>
      </div>

      <div className={styles.mapContainer}>
        <iframe
          title="Mapa do Evento"
          src="https://www.google.com/maps?q=Avenida+Nelson+Cardoso,+82,+Rio+de+Janeiro&output=embed"
          loading="lazy"
          allowFullScreen
          referrerPolicy="no-referrer-when-downgrade"
        />
      </div>
    </div>
  </div>
</motion.section>
    </main>
    <Footer />
    </>

  );
}