/* eslint-disable @next/next/no-html-link-for-pages */
"use client";

import Image from "next/image";
import {
  usePathname,
  useRouter,
} from "next/navigation";
import { CalendarDays, Menu, X } from "lucide-react";
import {
  type MouseEvent,
  useEffect,
  useRef,
  useState,
} from "react";

import styles from "./Header.module.css";

/*
 * Escolha aqui quais links aparecem de cada lado da logo.
 * Para mover um item, basta transferir o objeto entre as duas listas.
 */
const leftNavigationLinks = [
  {
    label: "Início",
    href: "/#inicio",
  },
  {
    label: "Quem Somos",
    href: "/#quem-somos",
  },
];

const rightNavigationLinks = [
  {
    label: "Galeria",
    href: "/#galeria",
  },
  {
    label: "Contato",
    href: "/#contato",
  },
];

/*
 * No menu mobile, os links dos dois lados são reunidos
 * automaticamente em uma única lista.
 */
const navigationLinks = [
  ...leftNavigationLinks,
  ...rightNavigationLinks,
];

const PENDING_SECTION_KEY = "guardioes-pending-section";

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();

  const headerRef = useRef<HTMLElement>(null);

  const leftLinks = leftNavigationLinks;
  const rightLinks = rightNavigationLinks;

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

  function scrollToSection(
    sectionId: string,
    behavior: ScrollBehavior = "smooth"
  ) {
    const section = document.getElementById(sectionId);

    if (!section) {
      return false;
    }

    const headerHeight =
      headerRef.current?.getBoundingClientRect().height ?? 0;

    const sectionPosition =
      section.getBoundingClientRect().top + window.scrollY;

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
  sectionId === "inicio"
    ? "/"
    : `/#${sectionId}`,
);

    return true;
  }

  /*
   * Na Home, faz o scroll suave normalmente.
   * Em páginas internas, salva a seção desejada antes de voltar
   * para a Home. Assim o posicionamento só acontece depois que
   * a página e suas seções terminarem de carregar.
   */
  function handleNavigation(
    event: MouseEvent<HTMLAnchorElement>,
    href: string
  ) {
    closeMenu();

    const sectionId = href.split("#")[1] || "inicio";

   if (pathname !== "/") {
  event.preventDefault();

  sessionStorage.setItem(
    PENDING_SECTION_KEY,
    sectionId,
  );

  router.push(
    sectionId === "inicio"
      ? "/"
      : `/#${sectionId}`,
  );

  return;
}

    event.preventDefault();

    if (!scrollToSection(sectionId)) {
      // eslint-disable-next-line react-hooks/immutability
      window.location.href = href;
    }
  }

  /*
   * Ao chegar à Home vindo de outra página, espera as seções
   * existirem no DOM e então aplica o deslocamento exato do Header.
   */
  useEffect(() => {
    if (pathname !== "/") {
      return;
    }

    const pendingSection = sessionStorage.getItem(
      PENDING_SECTION_KEY
    );

    const hashSection = window.location.hash.replace("#", "");
    const sectionId = pendingSection || hashSection;

    if (!sectionId) {
      return;
    }

    let attempts = 0;
    let timeoutId: ReturnType<typeof setTimeout>;

    function tryToScroll() {
      attempts += 1;

      const scrolled = scrollToSection(
        sectionId,
        attempts === 1 ? "auto" : "smooth"
      );

      if (scrolled) {
        sessionStorage.removeItem(PENDING_SECTION_KEY);

        // Corrige novamente após imagens, fontes e componentes
        // terminarem de alterar a altura da página.
        [150, 400, 800].forEach((delay) => {
          setTimeout(() => {
            scrollToSection(sectionId, "auto");
          }, delay);
        });

        return;
      }

      if (attempts < 20) {
        timeoutId = setTimeout(tryToScroll, 100);
      }
    }

    const frameId = requestAnimationFrame(() => {
      timeoutId = setTimeout(tryToScroll, 50);
    });

    return () => {
      cancelAnimationFrame(frameId);
      clearTimeout(timeoutId);
    };
  }, [pathname]);

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
              href="/#inicio"
              className={styles.logoArea}
              aria-label="Ir para o início"
              onClick={(event) =>
                handleNavigation(
                  event,
                  "/#inicio"
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
          href="/#inicio"
          className={styles.mobileLogoArea}
          aria-label="Ir para o início"
          onClick={(event) =>
            handleNavigation(
              event,
              "/#inicio"
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
          BOTÃO FLUTUANTE DE DESTAQUE DO EVENTO
      ====================================================== */}

      <a
        href="/evento"
        className={styles.eventFloatingNav}
        aria-label="Abrir a página do evento"
      >
        <span
          className={styles.eventFloatingIcon}
          aria-hidden="true"
        >
          <CalendarDays size={21} strokeWidth={2.2} />
        </span>

        <strong>Evento</strong>

        <span
          className={styles.eventFloatingShine}
          aria-hidden="true"
        />
      </a>

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

        <a
          href="/evento"
          className={styles.mobileEventLink}
          onClick={closeMenu}
          aria-label="Abrir a página do evento"
        >
          <span
            className={styles.mobileEventIcon}
            aria-hidden="true"
          >
            <CalendarDays size={21} strokeWidth={2.2} />
          </span>

          <span className={styles.mobileEventText}>
            <small>Destaque</small>
            <strong>Evento</strong>
          </span>

          <span
            className={styles.mobileEventArrow}
            aria-hidden="true"
          >
            →
          </span>
        </a>

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