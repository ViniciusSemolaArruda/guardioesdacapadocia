"use client";

import Image from "next/image";
import Link from "next/link";

import type { MouseEvent } from "react";

import {
  ChevronRight,
  Facebook,
  Instagram,
  Mail,
  MapPin,
  Phone,
  Youtube,
} from "lucide-react";

import styles from "./Footer.module.css";

const quickLinks = [
  {
    label: "Início",
    href: "#inicio",
  },
  {
    label: "Evento",
    href: "#evento",
  },
  {
    label: "Quem somos",
    href: "#quem-somos",
  },
  {
    label: "Galeria",
    href: "#galeria",
  },
  {
    label: "Notícias",
    href: "#noticias",
  },
  {
    label: "Contato",
    href: "#contato",
  },
];

const socialLinks = [
  {
    label: "Instagram",
    href: "https://www.instagram.com/",
    icon: Instagram,
  },
  {
    label: "Facebook",
    href: "https://www.facebook.com/",
    icon: Facebook,
  },
  {
    label: "YouTube",
    href: "https://www.youtube.com/",
    icon: Youtube,
  },
];

export default function Footer() {
  function handleNavigation(
    event: MouseEvent<HTMLAnchorElement>,
    href: string
  ) {
    event.preventDefault();

    const sectionId = href.replace("#", "");
    const section = document.getElementById(sectionId);

    if (!section) {
      return;
    }

    /*
     * Pega a altura real do Header, que foi salva
     * pelo Header.tsx na variável CSS.
     */
    const rootStyles = window.getComputedStyle(
      document.documentElement
    );

    const headerHeightValue = rootStyles
      .getPropertyValue("--header-height")
      .trim();

    const headerHeight =
      Number.parseFloat(headerHeightValue) || 0;

    const sectionPosition =
      section.getBoundingClientRect().top +
      window.scrollY;

    /*
     * No início, sempre volta exatamente para o topo.
     * Nas outras seções, desconta a altura real do Header.
     */
    const destination =
      sectionId === "inicio"
        ? 0
        : sectionPosition - headerHeight;

    window.scrollTo({
      top: Math.max(destination, 0),
      behavior: "smooth",
    });

    /*
     * Atualiza o endereço sem provocar outro scroll automático.
     */
    window.history.replaceState(
      null,
      "",
      href
    );
  }

  return (
    <footer className={styles.footer}>
      <div
        className={styles.background}
        aria-hidden="true"
      />

      <div className={styles.mainContent}>
        <div className={styles.container}>
          {/* =================================================
              MARCA
          ================================================== */}

          <section className={styles.brandColumn}>
            <Link
              href="#inicio"
              className={styles.logoLink}
              aria-label="Voltar ao início"
              onClick={(event) =>
                handleNavigation(
                  event,
                  "#inicio"
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
                Tradição que inspira,
                <br />
                paixão que nos move.
              </p>
            </div>
          </section>

          {/* =================================================
              LINKS RÁPIDOS
          ================================================== */}

          <nav
            className={`${styles.footerColumn} ${styles.columnDivider}`}
            aria-label="Links rápidos do rodapé"
          >
            <h3>Links rápidos</h3>

            <ul className={styles.quickLinks}>
              {quickLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    onClick={(event) =>
                      handleNavigation(
                        event,
                        link.href
                      )
                    }
                  >
                    <ChevronRight
                      aria-hidden="true"
                    />

                    <span>{link.label}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          {/* =================================================
              REDES SOCIAIS
          ================================================== */}

          <section
            className={`${styles.footerColumn} ${styles.columnDivider}`}
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

                      <span>
                        {social.label}
                      </span>
                    </a>
                  </li>
                );
              })}
            </ul>
          </section>

          {/* =================================================
              CONTATO
          ================================================== */}

          <section
            className={`${styles.footerColumn} ${styles.contactColumn} ${styles.columnDivider}`}
          >
            <h3>Contato</h3>

            <address className={styles.contactList}>
              <a href="tel:+5521999999999">
                <span
                  className={styles.contactIcon}
                >
                  <Phone aria-hidden="true" />
                </span>

                <span>
                  (21) 99999-9999
                </span>
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
          </section>
        </div>
      </div>

      {/* =====================================================
          BARRA INFERIOR
      ====================================================== */}

      <div className={styles.bottomBar}>
        <div className={styles.bottomBarContent}>
          <p>
            © 2026 G.R.E.S. Guardiões da Capadócia —
            Todos os direitos reservados.
          </p>
        </div>
      </div>
    </footer>
  );
}