"use client";

import Image from "next/image";
import { Menu, X } from "lucide-react";
import {
  type MouseEvent,
  useEffect,
  useRef,
  useState,
} from "react";

import styles from "./Header.module.css";

const navigationLinks = [
  {
    label: "Início",
    href: "#inicio",
  },
  {
    label: "A escola",
    href: "#quem-somos",
  },
  {
    label: "Eventos",
    href: "#evento",
  },
  {
    label: "Galeria",
    href: "#galeria",
  },
  
  {
    label: "Contato",
    href: "#contato",
  },
];

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);

  const headerRef = useRef<HTMLElement>(null);

  const leftLinks = navigationLinks.slice(0, 3);
  const rightLinks = navigationLinks.slice(3);

  function closeMenu() {
    setMenuOpen(false);
  }

  /*
   * Calcula a altura real do Header.
   * O valor é atualizado sempre que o Header ou a tela mudam.
   */
  useEffect(() => {
    const headerElement = headerRef.current;

    if (!headerElement) {
      return;
    }

    function updateHeaderHeight() {
      if (!headerRef.current) {
        return;
      }

      const headerHeight =
        headerRef.current.getBoundingClientRect().height;

      document.documentElement.style.setProperty(
        "--header-height",
        `${Math.ceil(headerHeight)}px`
      );
    }

    updateHeaderHeight();

    const resizeObserver = new ResizeObserver(() => {
      updateHeaderHeight();
    });

    resizeObserver.observe(headerElement);

    window.addEventListener("resize", updateHeaderHeight);
    window.addEventListener("orientationchange", updateHeaderHeight);

    return () => {
      resizeObserver.disconnect();

      window.removeEventListener(
        "resize",
        updateHeaderHeight
      );

      window.removeEventListener(
        "orientationchange",
        updateHeaderHeight
      );
    };
  }, []);

  /*
   * Faz a navegação manualmente, descontando a altura atual
   * do Header para que a seção pare no lugar correto.
   */
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

    closeMenu();

    const headerHeight =
      headerRef.current?.getBoundingClientRect().height ?? 0;

    const sectionPosition =
      section.getBoundingClientRect().top +
      window.scrollY;

    const destination =
      sectionId === "inicio"
        ? 0
        : sectionPosition - headerHeight;

    window.scrollTo({
      top: Math.max(destination, 0),
      behavior: "smooth",
    });

    window.history.replaceState(
      null,
      "",
      href
    );
  }

  /*
   * Impede a rolagem da página quando o menu mobile
   * estiver aberto.
   */
  useEffect(() => {
    if (!menuOpen) {
      return;
    }

    const previousOverflow =
      document.body.style.overflow;

    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow =
        previousOverflow;
    };
  }, [menuOpen]);

  /*
   * Fecha o menu mobile ao retornar para o desktop.
   */
  useEffect(() => {
    function handleResize() {
      if (window.innerWidth > 900) {
        setMenuOpen(false);
      }
    }

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener(
        "resize",
        handleResize
      );
    };
  }, []);

  /*
   * Fecha o menu pressionando Escape.
   */
  useEffect(() => {
    function handleEscape(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setMenuOpen(false);
      }
    }

    window.addEventListener(
      "keydown",
      handleEscape
    );

    return () => {
      window.removeEventListener(
        "keydown",
        handleEscape
      );
    };
  }, []);

  return (
    <>
      <header
        ref={headerRef}
        className={styles.header}
      >
      <div
        className={styles.backgroundFrame}
        aria-hidden="true"
      >
        <div className={styles.background} />
        <div className={styles.headerOverlay} />
      </div>

      {/* =====================================================
          DESKTOP
      ====================================================== */}

      <div className={styles.desktopContent}>
        <nav
          className={styles.desktopNavigation}
          aria-label="Navegação principal"
        >
          <div className={styles.navigationGroup}>
            {leftLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={(event) =>
                  handleNavigation(
                    event,
                    link.href
                  )
                }
              >
                {link.label}
              </a>
            ))}
          </div>

          <div className={styles.logoColumn}>
            <a
              href="#inicio"
              className={styles.logoArea}
              aria-label="Ir para o início"
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
                width={240}
                height={240}
                priority
                className={styles.logo}
              />
            </a>
          </div>

          <div className={styles.navigationGroup}>
            {rightLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={(event) =>
                  handleNavigation(
                    event,
                    link.href
                  )
                }
              >
                {link.label}
              </a>
            ))}
          </div>
        </nav>
      </div>

      {/* =====================================================
          CABEÇALHO MOBILE
      ====================================================== */}

      <div className={styles.mobileHeader}>
        <a
          href="#inicio"
          className={styles.mobileLogoArea}
          aria-label="Ir para o início"
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
            width={135}
            height={135}
            priority
            className={styles.mobileLogo}
          />
        </a>

        <button
          type="button"
          className={styles.menuButton}
          onClick={() =>
            setMenuOpen(
              (currentValue) => !currentValue
            )
          }
          aria-label={
            menuOpen
              ? "Fechar menu"
              : "Abrir menu"
          }
          aria-expanded={menuOpen}
          aria-controls="mobile-navigation"
        >
          {menuOpen ? (
            <X size={24} />
          ) : (
            <Menu size={24} />
          )}
        </button>
      </div>

      </header>

      {/* =====================================================
          FUNDO ESCURO DO MENU MOBILE
      ====================================================== */}

      <button
        type="button"
        className={`${styles.backdrop} ${
          menuOpen
            ? styles.backdropVisible
            : ""
        }`}
        onClick={closeMenu}
        aria-label="Fechar menu"
        tabIndex={menuOpen ? 0 : -1}
      />

      {/* =====================================================
          MENU MOBILE
      ====================================================== */}

      <nav
        id="mobile-navigation"
        className={`${styles.mobileMenu} ${
          menuOpen
            ? styles.mobileMenuOpen
            : ""
        }`}
        aria-label="Navegação para celular"
        aria-hidden={!menuOpen}
      >
        <div className={styles.mobileMenuHeader}>
          <div className={styles.mobileMenuBrand}>
            <Image
              src="/images/logo.png"
              alt=""
              width={72}
              height={72}
              className={styles.mobileMenuLogo}
            />

            <div>
              <span>Menu principal</span>

              <strong>
                Guardiões da Capadócia
              </strong>
            </div>
          </div>

          <button
            type="button"
            onClick={closeMenu}
            aria-label="Fechar menu"
          >
            <X size={23} />
          </button>
        </div>

        <div className={styles.mobileLinks}>
          {navigationLinks.map(
            (link, index) => (
              <a
                key={link.href}
                href={link.href}
                onClick={(event) =>
                  handleNavigation(
                    event,
                    link.href
                  )
                }
              >
                <span>
                  {String(index + 1).padStart(
                    2,
                    "0"
                  )}
                </span>

                <strong>{link.label}</strong>
              </a>
            )
          )}
        </div>

        <div className={styles.mobileFooter}>
          <span>
            Tradição, cultura e comunidade
          </span>
        </div>
      </nav>
    </>
  );
}