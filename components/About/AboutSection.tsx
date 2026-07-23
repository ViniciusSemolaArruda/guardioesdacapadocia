"use client";

import Image from "next/image";
import { ChevronRight, Crown } from "lucide-react";

import styles from "./AboutSection.module.css";

export default function AboutSection() {
  return (
    <section
      id="quem-somos"
      className={styles.aboutSection}
    >
      <div
        className={styles.background}
        aria-hidden="true"
      />

      <div className={styles.container}>
        <div className={styles.content}>
          <div className={styles.sectionLabel}>
            <span className={styles.labelLine} />

            <Crown
              size={18}
              strokeWidth={1.8}
              aria-hidden="true"
            />

            <span>Quem somos</span>

            <span className={styles.labelLine} />
          </div>

          <h2 className={styles.title}>
            <span className={styles.titleMain}>
              Uma história
            </span>

            <span className={styles.titleAccent}>
              de amor ao samba!
            </span>
          </h2>

          <div className={styles.textContent}>
            <p>
              A G.R.E.S. Guardiões da Capadócia nasceu do sonho
              de um grupo de apaixonados pelo samba, pela cultura
              popular e pela valorização da comunidade.
            </p>

            <p>
              Com garra, união e resistência, construímos nossa
              trajetória levando alegria, arte e emoção para a
              avenida e para a vida de milhares de pessoas.
            </p>

            <p>
              Somos mais que uma escola, somos uma família que
              defende nossas cores, nossas tradições e o samba
              como expressão da alma.
            </p>
          </div>

          <a
            href="#nossa-historia"
            className={styles.historyButton}
          >
            <span>Conheça nossa história</span>

            <ChevronRight
              size={19}
              strokeWidth={2.2}
              aria-hidden="true"
            />
          </a>
        </div>

        <div className={styles.gallery}>
          <div
            className={`${styles.photoWrapper} ${styles.photoOne}`}
          >
            <div className={styles.photoFrame}>
              <Image
                src="/images/foto1.png"
                alt="Integrantes da Guardiões da Capadócia em apresentação"
                fill
                sizes="(max-width: 700px) 82vw, 36vw"
                className={styles.photo}
                priority={false}
              />
            </div>
          </div>

          <div
            className={`${styles.photoWrapper} ${styles.photoTwo}`}
          >
            <div className={styles.photoFrame}>
              <Image
                src="/images/foto2.png"
                alt="Componentes da Guardiões da Capadócia reunidos"
                fill
                sizes="(max-width: 700px) 66vw, 25vw"
                className={styles.photo}
              />
            </div>
          </div>

          <div
            className={`${styles.photoWrapper} ${styles.photoThree}`}
          >
            <div className={styles.photoFrame}>
              <Image
                src="/images/foto3.png"
                alt="Bateria e comunidade da Guardiões da Capadócia"
                fill
                sizes="(max-width: 700px) 66vw, 25vw"
                className={styles.photo}
              />
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}