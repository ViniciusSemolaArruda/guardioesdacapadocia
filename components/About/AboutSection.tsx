"use client";

import Image from "next/image";
import { Crown } from "lucide-react";
import { motion } from "framer-motion";

import styles from "./AboutSection.module.css";

const textAnimation = {
  hidden: {
    opacity: 0,
    x: -60,
  },
  visible: {
    opacity: 1,
    x: 0,
  },
};

const galleryAnimation = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.2,
      delayChildren: 0.15,
    },
  },
};

const photoAnimation = {
  hidden: {
    opacity: 0,
    x: 60,
    scale: 0.94,
  },
  visible: {
    opacity: 1,
    x: 0,
    scale: 1,
  },
};

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
        {/* CONTEÚDO */}
        <motion.div
          className={styles.content}
          variants={textAnimation}
          initial="hidden"
          whileInView="visible"
          viewport={{
            once: true,
            amount: 0.25,
          }}
          transition={{
            duration: 0.8,
            ease: [0.22, 1, 0.36, 1],
          }}
        >
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
        </motion.div>

        {/* GALERIA */}
        <motion.div
          className={styles.gallery}
          variants={galleryAnimation}
          initial="hidden"
          whileInView="visible"
          viewport={{
            once: true,
            amount: 0.2,
          }}
        >
          <motion.div
            className={`${styles.photoWrapper} ${styles.photoOne}`}
            variants={photoAnimation}
            transition={{
              duration: 0.75,
              ease: [0.22, 1, 0.36, 1],
            }}
          >
            <div className={styles.photoFrame}>
              <Image
                src="/images/foto5.png"
                alt="Integrantes da Guardiões da Capadócia em apresentação"
                fill
                sizes="(max-width: 700px) 82vw, 36vw"
                className={styles.photo}
              />
            </div>
          </motion.div>

          <motion.div
            className={`${styles.photoWrapper} ${styles.photoTwo}`}
            variants={photoAnimation}
            transition={{
              duration: 0.75,
              ease: [0.22, 1, 0.36, 1],
            }}
          >
            <div className={styles.photoFrame}>
              <Image
                src="/images/foto4.jpeg"
                alt="Componentes da Guardiões da Capadócia reunidos"
                fill
                sizes="(max-width: 700px) 66vw, 25vw"
                className={styles.photo}
              />
            </div>
          </motion.div>

          <motion.div
            className={`${styles.photoWrapper} ${styles.photoThree}`}
            variants={photoAnimation}
            transition={{
              duration: 0.75,
              ease: [0.22, 1, 0.36, 1],
            }}
          >
            <div className={styles.photoFrame}>
              <Image
                src="/images/foto1.png"
                alt="Bateria e comunidade da Guardiões da Capadócia"
                fill
                sizes="(max-width: 700px) 66vw, 25vw"
                className={styles.photo}
              />
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}