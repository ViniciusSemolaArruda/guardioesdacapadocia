"use client";

import Image from "next/image";
import {
  ChevronLeft,
  ChevronRight,
  Expand,
  Images,
  X,
} from "lucide-react";
import {
  type CSSProperties,
  type TouchEvent,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";

import styles from "./galeria.module.css";

interface GalleryImage {
  id: number;
  src: string;
  alt: string;
}

/*
  =========================================================
  IMAGENS DA GALERIA
  =========================================================

  Coloque as imagens dentro de:

  public/images/

  Depois, informe aqui o caminho de cada imagem.

  Você pode:
  - trocar os nomes;
  - mudar a ordem;
  - adicionar imagens;
  - remover imagens.

  Não precisa manter nomes como foto1, foto2 etc.
*/

const galleryImages: GalleryImage[] = [
  {
    id: 1,
    src: "/images/foto1.png",
    alt: "Apresentação da Guardiões da Capadócia",
  },
  {
    id: 2,
    src: "/images/foto2.png",
    alt: "Evento da Guardiões da Capadócia",
  },
  {
    id: 3,
    src: "/images/foto3.png",
    alt: "Integrantes da Guardiões da Capadócia",
  },
  {
    id: 4,
    src: "/images/foto1.png",
    alt: "Comunidade da Guardiões da Capadócia",
  },
  {
    id: 5,
    src: "/images/foto2.png",
    alt: "Desfile da Guardiões da Capadócia",
  },
  {
    id: 6,
    src: "/images/foto3.png",
    alt: "Desfile da Guardiões da Capadócia",
  },
  {
    id: 7,
    src: "/images/foto1.png",
    alt: "Desfile da Guardiões da Capadócia",
  },
  {
    id: 8,
    src: "/images/foto2.png",
    alt: "Desfile da Guardiões da Capadócia",
  },
  {
    id: 9,
    src: "/images/foto3.png",
    alt: "Desfile da Guardiões da Capadócia",
  },
  {
    id: 10,
    src: "/images/foto2.png",
    alt: "Desfile da Guardiões da Capadócia",
  },

  
];

const AUTOPLAY_TIME = 4500;
const SWIPE_DISTANCE = 45;

export default function Galeria() {
  const [activeIndex, setActiveIndex] =
    useState(0);

  const [selectedIndex, setSelectedIndex] =
    useState<number | null>(null);

  const [isPaused, setIsPaused] =
    useState(false);

  const touchStartX = useRef<number | null>(
    null,
  );

  const touchEndX = useRef<number | null>(
    null,
  );

  const totalImages = galleryImages.length;

  const selectedImage =
    selectedIndex !== null
      ? galleryImages[selectedIndex]
      : null;

  const goToImage = useCallback(
    (index: number) => {
      if (totalImages === 0) {
        return;
      }

      const normalizedIndex =
        ((index % totalImages) + totalImages) %
        totalImages;

      setActiveIndex(normalizedIndex);
    },
    [totalImages],
  );

  const previousImage = useCallback(() => {
    if (totalImages === 0) {
      return;
    }

    setActiveIndex((currentIndex) => {
      return (
        (currentIndex - 1 + totalImages) %
        totalImages
      );
    });
  }, [totalImages]);

  const nextImage = useCallback(() => {
    if (totalImages === 0) {
      return;
    }

    setActiveIndex((currentIndex) => {
      return (
        (currentIndex + 1) % totalImages
      );
    });
  }, [totalImages]);

  const showPreviousLightboxImage =
    useCallback(() => {
      if (
        selectedIndex === null ||
        totalImages === 0
      ) {
        return;
      }

      setSelectedIndex(
        (selectedIndex - 1 + totalImages) %
          totalImages,
      );
    }, [selectedIndex, totalImages]);

  const showNextLightboxImage =
    useCallback(() => {
      if (
        selectedIndex === null ||
        totalImages === 0
      ) {
        return;
      }

      setSelectedIndex(
        (selectedIndex + 1) % totalImages,
      );
    }, [selectedIndex, totalImages]);

  function getRelativePosition(
    imageIndex: number,
  ) {
    let position =
      imageIndex - activeIndex;

    if (position > totalImages / 2) {
      position -= totalImages;
    }

    if (position < -totalImages / 2) {
      position += totalImages;
    }

    return position;
  }

  function handleTouchStart(
    event: TouchEvent<HTMLDivElement>,
  ) {
    touchStartX.current =
      event.touches[0].clientX;

    touchEndX.current = null;
  }

  function handleTouchMove(
    event: TouchEvent<HTMLDivElement>,
  ) {
    touchEndX.current =
      event.touches[0].clientX;
  }

  function handleTouchEnd() {
    if (
      touchStartX.current === null ||
      touchEndX.current === null
    ) {
      touchStartX.current = null;
      touchEndX.current = null;

      return;
    }

    const distance =
      touchStartX.current -
      touchEndX.current;

    if (distance > SWIPE_DISTANCE) {
      nextImage();
    }

    if (distance < -SWIPE_DISTANCE) {
      previousImage();
    }

    touchStartX.current = null;
    touchEndX.current = null;
  }

  function openImage(index: number) {
    setSelectedIndex(index);
    setIsPaused(true);
  }

  function closeImage() {
    setSelectedIndex(null);
    setIsPaused(false);
  }

  useEffect(() => {
    if (
      isPaused ||
      selectedImage ||
      totalImages <= 1
    ) {
      return;
    }

    const intervalId =
      window.setInterval(() => {
        nextImage();
      }, AUTOPLAY_TIME);

    return () => {
      window.clearInterval(intervalId);
    };
  }, [
    isPaused,
    nextImage,
    selectedImage,
    totalImages,
  ]);

  useEffect(() => {
    function handleKeyboard(
      event: KeyboardEvent,
    ) {
      if (selectedImage) {
        if (event.key === "ArrowLeft") {
          showPreviousLightboxImage();
        }

        if (event.key === "ArrowRight") {
          showNextLightboxImage();
        }

        if (event.key === "Escape") {
          closeImage();
        }

        return;
      }

      if (event.key === "ArrowLeft") {
        previousImage();
      }

      if (event.key === "ArrowRight") {
        nextImage();
      }
    }

    window.addEventListener(
      "keydown",
      handleKeyboard,
    );

    return () => {
      window.removeEventListener(
        "keydown",
        handleKeyboard,
      );
    };
  }, [
    nextImage,
    previousImage,
    selectedImage,
    showNextLightboxImage,
    showPreviousLightboxImage,
  ]);

  useEffect(() => {
    const previousOverflow =
      document.body.style.overflow;

    if (selectedImage) {
      document.body.style.overflow =
        "hidden";
    }

    return () => {
      document.body.style.overflow =
        previousOverflow;
    };
  }, [selectedImage]);

  if (totalImages === 0) {
    return null;
  }

  return (
    <>
      <section
        id="galeria"
        className={styles.section}
      >
        <div
          className={styles.background}
          aria-hidden="true"
        />

        <div className={styles.container}>
          <header className={styles.header}>
            <div
              className={styles.sectionIcon}
              aria-hidden="true"
            >
              <Images />
            </div>

            <div className={styles.eyebrow}>
              <span />

              <strong>
                Nossos registros
              </strong>

              <span />
            </div>
          </header>

          <div
            className={styles.galleryArea}
            onMouseEnter={() =>
              setIsPaused(true)
            }
            onMouseLeave={() =>
              setIsPaused(false)
            }
            onFocus={() =>
              setIsPaused(true)
            }
            onBlur={() =>
              setIsPaused(false)
            }
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
            onTouchCancel={handleTouchEnd}
            role="region"
            aria-roledescription="carrossel"
            aria-label="Galeria de registros fotográficos"
          >
            {totalImages > 1 && (
              <button
                type="button"
                className={`${styles.arrowButton} ${styles.arrowLeft}`}
                onClick={previousImage}
                aria-label="Mostrar foto anterior"
              >
                <ChevronLeft />
              </button>
            )}

            <div className={styles.carousel}>
              <div
                className={
                  styles.carouselTrack
                }
              >
                {galleryImages.map(
                  (image, index) => {
                    const position =
                      getRelativePosition(
                        index,
                      );

                    const absolutePosition =
                      Math.abs(position);

                    const isActive =
                      position === 0;

                    const isVisible =
                      absolutePosition <= 2;

                    const cardStyles = {
                      "--position": position,
                      "--absolute-position":
                        absolutePosition,
                    } as CSSProperties;

                    return (
                      <article
                        key={`${image.id}-${image.src}`}
                        className={`${styles.card} ${
                          isActive
                            ? styles.activeCard
                            : ""
                        }`}
                        data-position={position}
                        aria-hidden={!isVisible}
                        style={cardStyles}
                        onClick={() => {
                          if (isActive) {
                            openImage(index);
                            return;
                          }

                          goToImage(index);
                        }}
                      >
                        <div
                          className={
                            styles.imageWrapper
                          }
                        >
                          <Image
                            src={image.src}
                            alt={image.alt}
                            fill
                            sizes="(max-width: 650px) 82vw, (max-width: 1000px) 58vw, 570px"
                            priority={index <= 2}
                            className={
                              styles.image
                            }
                          />

                          <div
                            className={
                              styles.imageShade
                            }
                            aria-hidden="true"
                          />

                          <div
                            className={
                              styles.cardNumber
                            }
                          >
                            {String(
                              index + 1,
                            ).padStart(2, "0")}
                          </div>

                          {isActive && (
                            <button
                              type="button"
                              className={
                                styles.expandButton
                              }
                              onClick={(
                                event,
                              ) => {
                                event.stopPropagation();
                                openImage(index);
                              }}
                              aria-label={`Ampliar imagem ${
                                index + 1
                              }`}
                            >
                              <Expand />
                            </button>
                          )}
                        </div>
                      </article>
                    );
                  },
                )}
              </div>
            </div>

            {totalImages > 1 && (
              <button
                type="button"
                className={`${styles.arrowButton} ${styles.arrowRight}`}
                onClick={nextImage}
                aria-label="Mostrar próxima foto"
              >
                <ChevronRight />
              </button>
            )}
          </div>

          <div
            className={styles.galleryFooter}
          >
            {totalImages > 1 && (
              <div
                className={
                  styles.pagination
                }
                aria-label="Selecionar foto"
              >
                {galleryImages.map(
                  (image, index) => (
                    <button
                      type="button"
                      key={`${image.id}-pagination`}
                      className={`${styles.paginationButton} ${
                        index === activeIndex
                          ? styles.activePaginationButton
                          : ""
                      }`}
                      onClick={() =>
                        goToImage(index)
                      }
                      aria-label={`Mostrar imagem ${
                        index + 1
                      }`}
                      aria-current={
                        index === activeIndex
                          ? "true"
                          : undefined
                      }
                    />
                  ),
                )}
              </div>
            )}

            <p className={styles.counter}>
              <strong>
                {String(
                  activeIndex + 1,
                ).padStart(2, "0")}
              </strong>

              <span>/</span>

              <small>
                {String(
                  totalImages,
                ).padStart(2, "0")}
              </small>
            </p>
          </div>
        </div>
      </section>

      {selectedImage &&
        selectedIndex !== null && (
          <div
            className={styles.lightbox}
            role="dialog"
            aria-modal="true"
            aria-label="Visualização ampliada da imagem"
            onClick={closeImage}
          >
            <button
              type="button"
              className={styles.closeButton}
              onClick={closeImage}
              aria-label="Fechar imagem"
            >
              <X />
            </button>

            {totalImages > 1 && (
              <button
                type="button"
                className={`${styles.lightboxArrow} ${styles.lightboxArrowLeft}`}
                onClick={(event) => {
                  event.stopPropagation();
                  showPreviousLightboxImage();
                }}
                aria-label="Mostrar imagem anterior"
              >
                <ChevronLeft />
              </button>
            )}

            <div
              className={
                styles.lightboxContent
              }
              onClick={(event) =>
                event.stopPropagation()
              }
            >
              <Image
                src={selectedImage.src}
                alt={selectedImage.alt}
                fill
                sizes="95vw"
                priority
                className={
                  styles.lightboxImage
                }
              />

              <div
                className={
                  styles.lightboxCaption
                }
              >
                <span>
                  Guardiões da Capadócia
                </span>

                <strong>
                  Foto{" "}
                  {String(
                    selectedIndex + 1,
                  ).padStart(2, "0")}
                </strong>
              </div>
            </div>

            {totalImages > 1 && (
              <button
                type="button"
                className={`${styles.lightboxArrow} ${styles.lightboxArrowRight}`}
                onClick={(event) => {
                  event.stopPropagation();
                  showNextLightboxImage();
                }}
                aria-label="Mostrar próxima imagem"
              >
                <ChevronRight />
              </button>
            )}
          </div>
        )}
    </>
  );
}