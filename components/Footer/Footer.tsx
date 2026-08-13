"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";

import {
  type MouseEvent,
  useCallback,
  useEffect,
} from "react";

import {
  ChevronRight,
  Instagram,
  Mail,
  MapPin,
  Phone,
  Youtube,
} from "lucide-react";

import { usePathname, useRouter } from "next/navigation";

import styles from "./Footer.module.css";

/* =========================================================
   CONFIGURAÇÕES
========================================================= */

const HOME_PATH = "/";
const SCROLL_STORAGE_KEY =
  "guardioes-footer-scroll-target";

const quickLinks = [
  {
    label: "Início",
    href: "/#inicio",
    sectionId: "inicio",
  },
  {
    label: "Evento",
    href: "/evento",
    sectionId: null,
  },
  {
    label: "Quem somos",
    href: "/#quem-somos",
    sectionId: "quem-somos",
  },
  {
    label: "Galeria",
    href: "/#galeria",
    sectionId: "galeria",
  },
  {
    label: "Contato",
    href: "/#contato",
    sectionId: "contato",
  },
];

const socialLinks = [
  {
    label: "Instagram",
    href: "https://www.instagram.com/g.r.e.s.guardioes_da_capadocia/",
    icon: Instagram,
  },
  {
    label: "YouTube",
    href: "https://youtube.com/@guardioesdacapadocia?si=xFXtc4Wfbvu42Hlf",
    icon: Youtube,
  },
];

const footerColumnsAnimation = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.16,
      delayChildren: 0.1,
    },
  },
};

const footerColumnAnimation = {
  hidden: {
    opacity: 0,
    y: 45,
  },
  visible: {
    opacity: 1,
    y: 0,
  },
};

/* =========================================================
   COMPONENTE
========================================================= */

export default function Footer() {
  const pathname = usePathname();
  const router = useRouter();

  const isHomePage = pathname === HOME_PATH;

  /* =======================================================
     POSICIONAMENTO EXATO DA SEÇÃO
  ======================================================== */

  const scrollToSection = useCallback(
    (
      sectionId: string,
      behavior: ScrollBehavior = "smooth"
    ) => {
      const section = document.getElementById(sectionId);

      if (!section) {
        return false;
      }

      /*
       * O Header salva a própria altura nesta variável.
       * Caso ela não exista, usamos 0 como segurança.
       */
      const headerHeightValue = getComputedStyle(
        document.documentElement
      ).getPropertyValue("--header-height");

      const headerHeight =
        Number.parseFloat(headerHeightValue) || 0;

      const sectionPosition =
        section.getBoundingClientRect().top +
        window.scrollY;

      const destination =
        sectionId === "inicio"
          ? 0
          : sectionPosition - headerHeight;

      window.scrollTo({
        top: Math.max(destination, 0),
        behavior,
      });

      window.history.replaceState(
        null,
        "",
        `/#${sectionId}`
      );

      return true;
    },
    []
  );

  /* =======================================================
     CLIQUE NOS LINKS DA HOME
  ======================================================== */

  function handleSectionNavigation(
    event: MouseEvent<HTMLAnchorElement>,
    sectionId: string
  ) {
    /*
     * Se já estiver na página inicial, evitamos uma nova
     * navegação e fazemos apenas o scroll suave.
     */
    if (isHomePage) {
      event.preventDefault();

      scrollToSection(sectionId, "smooth");

      return;
    }

    /*
     * Se estiver em /evento ou qualquer página interna,
     * salvamos a seção desejada antes de voltar para a Home.
     */
    event.preventDefault();

    sessionStorage.setItem(
      SCROLL_STORAGE_KEY,
      sectionId
    );

    router.push(`/#${sectionId}`);
  }

  /* =======================================================
     SCROLL APÓS VOLTAR DE UMA PÁGINA INTERNA
  ======================================================== */

  useEffect(() => {
    if (!isHomePage) {
      return;
    }

    const storedSectionId = sessionStorage.getItem(
      SCROLL_STORAGE_KEY
    );

    const hashSectionId = window.location.hash.replace(
      "#",
      ""
    );

    const sectionId =
      storedSectionId || hashSectionId;

    if (!sectionId) {
      return;
    }

    sessionStorage.removeItem(SCROLL_STORAGE_KEY);

    let attempts = 0;
    const maximumAttempts = 15;

    function positionSection() {
      attempts += 1;

      const positioned = scrollToSection(
        sectionId,
        attempts === 1 ? "auto" : "smooth"
      );

      /*
       * Algumas imagens e componentes podem alterar a altura
       * da página após o primeiro carregamento. Por isso,
       * repetimos o cálculo algumas vezes.
       */
      if (
        (!positioned || attempts < 4) &&
        attempts < maximumAttempts
      ) {
        window.setTimeout(positionSection, 150);
      }
    }

    const animationFrameId =
      window.requestAnimationFrame(() => {
        window.setTimeout(positionSection, 80);
      });

    function handleWindowLoad() {
      window.setTimeout(() => {
        scrollToSection(sectionId, "auto");
      }, 100);
    }

    window.addEventListener(
      "load",
      handleWindowLoad
    );

    return () => {
      window.cancelAnimationFrame(
        animationFrameId
      );

      window.removeEventListener(
        "load",
        handleWindowLoad
      );
    };
  }, [isHomePage, scrollToSection]);

  /* =======================================================
     JSX
  ======================================================== */

  return (
    <footer className={styles.footer}>
      <div
        className={styles.background}
        aria-hidden="true"
      />

      <div className={styles.mainContent}>
        <motion.div
          className={styles.container}
          variants={footerColumnsAnimation}
          initial="hidden"
          whileInView="visible"
          viewport={{
            once: true,
            amount: 0.15,
          }}
        >
          {/* =================================================
              MARCA
          ================================================== */}

          <motion.section
            className={styles.brandColumn}
            variants={footerColumnAnimation}
            transition={{
              duration: 0.75,
              ease: [0.22, 1, 0.36, 1],
            }}
          >
            <Link
              href="/#inicio"
              className={styles.logoLink}
              aria-label="Voltar ao início"
              onClick={(event) =>
                handleSectionNavigation(
                  event,
                  "inicio"
                )
              }
            >
              <Image
                src="/images/logo.png"
                alt="G.R.E.S. Guardiões da Capadócia"
                width={180}
                height={180}
                className={styles.logo}
                priority
              />
            </Link>

            <div className={styles.brandText}>
              <h2>
                G.R.E.S. Guardiões
                <br />
                da Capadócia
              </h2>

              <p>
                Força, Foco, Fé
                <br />
                e Samba no Pé!
              </p>
            </div>
          </motion.section>

          {/* =================================================
              LINKS RÁPIDOS
          ================================================== */}

          <motion.nav
            className={`${styles.footerColumn} ${styles.columnDivider}`}
            aria-label="Links rápidos do rodapé"
            variants={footerColumnAnimation}
            transition={{
              duration: 0.75,
              ease: [0.22, 1, 0.36, 1],
            }}
          >
            <h3>Links rápidos</h3>

            <ul className={styles.quickLinks}>
              {quickLinks.map((link) => (
                <li key={link.label}>
                  {link.sectionId ? (
                    <Link
                      href={link.href}
                      onClick={(event) =>
                        handleSectionNavigation(
                          event,
                          link.sectionId
                        )
                      }
                    >
                      <ChevronRight
                        aria-hidden="true"
                      />

                      <span>{link.label}</span>
                    </Link>
                  ) : (
                    <Link href={link.href}>
                      <ChevronRight
                        aria-hidden="true"
                      />

                      <span>{link.label}</span>
                    </Link>
                  )}
                </li>
              ))}
            </ul>
          </motion.nav>

          {/* =================================================
              REDES SOCIAIS
          ================================================== */}

          <motion.section
            className={`${styles.footerColumn} ${styles.columnDivider}`}
            variants={footerColumnAnimation}
            transition={{
              duration: 0.75,
              ease: [0.22, 1, 0.36, 1],
            }}
          >
            <h3>Redes sociais</h3>

            <ul className={styles.socialLinks}>
              {socialLinks.map((social) => {
                const Icon = social.icon;

                return (
                  <li key={social.label}>
                    <a
                      href={social.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={`Acessar ${social.label}`}
                    >
                      <span
                        className={
                          styles.socialIcon
                        }
                      >
                        <Icon aria-hidden="true" />
                      </span>

                      <span>{social.label}</span>
                    </a>
                  </li>
                );
              })}
            </ul>
          </motion.section>

          {/* =================================================
              CONTATO
          ================================================== */}

          <motion.section
            className={`${styles.footerColumn} ${styles.contactColumn} ${styles.columnDivider}`}
            variants={footerColumnAnimation}
            transition={{
              duration: 0.75,
              ease: [0.22, 1, 0.36, 1],
            }}
          >
            <h3>Contato</h3>

            <address className={styles.contactList}>
              <a href="tel:+5521993527840">
                <span
                  className={styles.contactIcon}
                >
                  <Phone aria-hidden="true" />
                </span>

                <span>(21) 99352-7840</span>
              </a>

              <a href="mailto:guardioesdacapadociaoficial@gmail.com">
                <span
                  className={styles.contactIcon}
                >
                  <Mail aria-hidden="true" />
                </span>

                <span className={styles.email}>
                  guardioesdacapadociaoficial@gmail.com
                </span>
              </a>

              <a
                href="https://www.google.com/maps/search/?api=1&query=Av.+Nelson+Cardoso,+82,+Tanque,+Rio+de+Janeiro,+RJ"
                target="_blank"
                rel="noopener noreferrer"
              >
                <span
                  className={styles.contactIcon}
                >
                  <MapPin aria-hidden="true" />
                </span>

                <span>
                  Av. Nelson Cardoso, nº 82
                  <br />
                  Bairro Tanque – Rio de Janeiro / RJ
                </span>
              </a>
            </address>
          </motion.section>
        </motion.div>
      </div>

      {/* =====================================================
          BARRA INFERIOR
      ====================================================== */}

      <motion.div
        className={styles.bottomBar}
        initial={{
          opacity: 0,
          y: 20,
        }}
        whileInView={{
          opacity: 1,
          y: 0,
        }}
        viewport={{
          once: true,
          amount: 0.8,
        }}
        transition={{
          duration: 0.6,
          delay: 0.35,
          ease: [0.22, 1, 0.36, 1],
        }}
      >
        <div className={styles.bottomBarContent}>
          <p>
            © 2026 G.R.E.S. Guardiões da Capadócia —
            Todos os direitos reservados.
          </p>
        </div>
      </motion.div>
    </footer>
  );
}