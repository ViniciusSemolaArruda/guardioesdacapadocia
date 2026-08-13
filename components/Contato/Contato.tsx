"use client";

import {
  Crown,
  LoaderCircle,
  Mail,
  MapPin,
  Phone,
  Send,
} from "lucide-react";
import { motion } from "framer-motion";
import {
  type ChangeEvent,
  type FormEvent,
  useState,
} from "react";

import styles from "./Contato.module.css";

type FormStatus =
  | "idle"
  | "sending"
  | "success"
  | "error";

interface ContactFormData {
  nome: string;
  email: string;
  assunto: string;
  mensagem: string;
}

const initialFormData: ContactFormData = {
  nome: "",
  email: "",
  assunto: "",
  mensagem: "",
};

const contactListAnimation = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.14,
      delayChildren: 0.25,
    },
  },
};

const contactItemAnimation = {
  hidden: {
    opacity: 0,
    x: -35,
  },
  visible: {
    opacity: 1,
    x: 0,
  },
};

const formAnimation = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.12,
      delayChildren: 0.2,
    },
  },
};

const formItemAnimation = {
  hidden: {
    opacity: 0,
    y: 30,
  },
  visible: {
    opacity: 1,
    y: 0,
  },
};

export default function Contato() {
  const [formData, setFormData] =
    useState<ContactFormData>(
      initialFormData,
    );

  const [status, setStatus] =
    useState<FormStatus>("idle");

  function handleChange(
    event: ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement
    >,
  ) {
    const { name, value } = event.target;

    setFormData((currentData) => ({
      ...currentData,
      [name]: value,
    }));

    if (status !== "idle") {
      setStatus("idle");
    }
  }

  async function handleSubmit(
    event: FormEvent<HTMLFormElement>,
  ) {
    event.preventDefault();

    if (status === "sending") {
      return;
    }

    setStatus("sending");

    try {
      const submissionData = new FormData();

      submissionData.append(
        "Nome",
        formData.nome,
      );

      submissionData.append(
        "E-mail do visitante",
        formData.email,
      );

      submissionData.append(
        "Assunto",
        formData.assunto,
      );

      submissionData.append(
        "Mensagem",
        formData.mensagem,
      );

      submissionData.append(
        "_subject",
        `Contato pelo site: ${formData.assunto}`,
      );

      submissionData.append(
        "_template",
        "table",
      );

      submissionData.append(
        "_captcha",
        "false",
      );

      const response = await fetch(
        "https://formsubmit.co/ajax/guardioesdacapadociaoficial@gmail.com",
        {
          method: "POST",
          headers: {
            Accept: "application/json",
          },
          body: submissionData,
        },
      );

      if (!response.ok) {
        throw new Error(
          "Não foi possível enviar a mensagem.",
        );
      }

      setStatus("success");
      setFormData(initialFormData);
    } catch (error) {
      console.error(
        "Erro ao enviar formulário:",
        error,
      );

      setStatus("error");
    }
  }

  return (
    <section
      id="contato"
      className={styles.contactSection}
    >
      <div
        className={styles.background}
        aria-hidden="true"
      />

      <div className={styles.container}>
        {/* INFORMAÇÕES DE CONTATO */}
        <motion.div
          className={styles.contactInformation}
          initial={{
            opacity: 0,
            x: -60,
          }}
          whileInView={{
            opacity: 1,
            x: 0,
          }}
          viewport={{
            once: true,
            amount: 0.2,
          }}
          transition={{
            duration: 0.8,
            ease: [0.22, 1, 0.36, 1],
          }}
        >
          <motion.header
            className={styles.header}
            initial={{
              opacity: 0,
              y: -30,
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
              duration: 0.7,
              ease: [0.22, 1, 0.36, 1],
            }}
          >
            <motion.div
              className={styles.ornament}
              initial={{
                opacity: 0,
                scale: 0.7,
              }}
              whileInView={{
                opacity: 1,
                scale: 1,
              }}
              viewport={{
                once: true,
              }}
              transition={{
                duration: 0.6,
                delay: 0.15,
                ease: [0.22, 1, 0.36, 1],
              }}
            >
              <span />

              <Crown aria-hidden="true" />

              <span />
            </motion.div>

            <h2 className={styles.title}>
              Fale conosco
            </h2>

            <p className={styles.subtitle}>
              Entre em contato conosco e faça parte
              <br
                className={
                  styles.desktopBreak
                }
              />
              dessa grande família!
            </p>
          </motion.header>

          <motion.div
            className={styles.contactList}
            variants={contactListAnimation}
            initial="hidden"
            whileInView="visible"
            viewport={{
              once: true,
              amount: 0.25,
            }}
          >
            <motion.a
              href="tel:+5521993527840"
              className={styles.contactItem}
              aria-label="Ligar para a Guardiões da Capadócia"
              variants={contactItemAnimation}
              transition={{
                duration: 0.65,
                ease: [0.22, 1, 0.36, 1],
              }}
              whileHover={{
                x: 6,
              }}
              whileTap={{
                scale: 0.98,
              }}
            >
              <span
                className={styles.iconWrapper}
              >
                <Phone aria-hidden="true" />
              </span>

              <span>
                (21) 99352-7840
              </span>
            </motion.a>

            <motion.a
              href="mailto:guardioesdacapadociaoficial@gmail.com"
              className={styles.contactItem}
              aria-label="Enviar e-mail para a Guardiões da Capadócia"
              variants={contactItemAnimation}
              transition={{
                duration: 0.65,
                ease: [0.22, 1, 0.36, 1],
              }}
              whileHover={{
                x: 6,
              }}
              whileTap={{
                scale: 0.98,
              }}
            >
              <span
                className={styles.iconWrapper}
              >
                <Mail aria-hidden="true" />
              </span>

              <span>
                guardioesdacapadociaoficial@gmail.com
              </span>
            </motion.a>

            <motion.a
              href="https://www.google.com/maps/search/?api=1&query=Av.+Nelson+Cardoso,+82,+Tanque,+Rio+de+Janeiro,+RJ"
              target="_blank"
              rel="noopener noreferrer"
              className={styles.contactItem}
              aria-label="Abrir endereço no mapa"
              variants={contactItemAnimation}
              transition={{
                duration: 0.65,
                ease: [0.22, 1, 0.36, 1],
              }}
              whileHover={{
                x: 6,
              }}
              whileTap={{
                scale: 0.98,
              }}
            >
              <span
                className={styles.iconWrapper}
              >
                <MapPin aria-hidden="true" />
              </span>

              <span>
                Av. Nelson Cardoso, nº 82
                <br />
                Bairro Tanque – Rio de Janeiro / RJ
              </span>
            </motion.a>
          </motion.div>
        </motion.div>

        {/* LINHA DIVISÓRIA */}
        <motion.div
          className={styles.divider}
          aria-hidden="true"
          initial={{
            opacity: 0,
            scaleY: 0,
          }}
          whileInView={{
            opacity: 1,
            scaleY: 1,
          }}
          viewport={{
            once: true,
            amount: 0.3,
          }}
          transition={{
            duration: 0.8,
            delay: 0.25,
            ease: [0.22, 1, 0.36, 1],
          }}
          style={{
            transformOrigin: "top",
          }}
        />

        {/* FORMULÁRIO */}
        <motion.form
          className={styles.form}
          onSubmit={handleSubmit}
          variants={formAnimation}
          initial="hidden"
          whileInView="visible"
          viewport={{
            once: true,
            amount: 0.15,
          }}
        >
          <motion.div
            className={styles.field}
            variants={formItemAnimation}
            transition={{
              duration: 0.65,
              ease: [0.22, 1, 0.36, 1],
            }}
          >
            <label htmlFor="contact-name">
              Seu nome
            </label>

            <input
              id="contact-name"
              name="nome"
              type="text"
              value={formData.nome}
              onChange={handleChange}
              placeholder="Seu nome"
              autoComplete="name"
              required
            />
          </motion.div>

          <motion.div
            className={styles.field}
            variants={formItemAnimation}
            transition={{
              duration: 0.65,
              ease: [0.22, 1, 0.36, 1],
            }}
          >
            <label htmlFor="contact-email">
              Seu e-mail
            </label>

            <input
              id="contact-email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Seu e-mail"
              autoComplete="email"
              required
            />
          </motion.div>

          <motion.div
            className={styles.field}
            variants={formItemAnimation}
            transition={{
              duration: 0.65,
              ease: [0.22, 1, 0.36, 1],
            }}
          >
            <label htmlFor="contact-subject">
              Assunto
            </label>

            <input
              id="contact-subject"
              name="assunto"
              type="text"
              value={formData.assunto}
              onChange={handleChange}
              placeholder="Assunto"
              required
            />
          </motion.div>

          <motion.div
            className={`${styles.field} ${styles.messageField}`}
            variants={formItemAnimation}
            transition={{
              duration: 0.65,
              ease: [0.22, 1, 0.36, 1],
            }}
          >
            <label htmlFor="contact-message">
              Mensagem
            </label>

            <textarea
              id="contact-message"
              name="mensagem"
              value={formData.mensagem}
              onChange={handleChange}
              placeholder="Mensagem"
              rows={6}
              required
            />
          </motion.div>

          <motion.div
            className={styles.formFooter}
            variants={formItemAnimation}
            transition={{
              duration: 0.65,
              ease: [0.22, 1, 0.36, 1],
            }}
          >
            <motion.button
              type="submit"
              className={styles.submitButton}
              disabled={status === "sending"}
              whileHover={
                status !== "sending"
                  ? {
                      scale: 1.03,
                    }
                  : undefined
              }
              whileTap={
                status !== "sending"
                  ? {
                      scale: 0.97,
                    }
                  : undefined
              }
              transition={{
                duration: 0.2,
              }}
            >
              <span>
                {status === "sending"
                  ? "Enviando..."
                  : "Enviar mensagem"}
              </span>

              {status === "sending" ? (
                <LoaderCircle
                  className={
                    styles.loadingIcon
                  }
                  aria-hidden="true"
                />
              ) : (
                <Send aria-hidden="true" />
              )}
            </motion.button>

            <div
              className={styles.statusArea}
              aria-live="polite"
            >
              {status === "success" && (
                <motion.p
                  className={`${styles.statusMessage} ${styles.successMessage}`}
                  initial={{
                    opacity: 0,
                    y: 8,
                  }}
                  animate={{
                    opacity: 1,
                    y: 0,
                  }}
                  transition={{
                    duration: 0.35,
                  }}
                >
                  Mensagem enviada com sucesso!
                </motion.p>
              )}

              {status === "error" && (
                <motion.p
                  className={`${styles.statusMessage} ${styles.errorMessage}`}
                  initial={{
                    opacity: 0,
                    y: 8,
                  }}
                  animate={{
                    opacity: 1,
                    y: 0,
                  }}
                  transition={{
                    duration: 0.35,
                  }}
                >
                  Não foi possível enviar. Tente novamente.
                </motion.p>
              )}
            </div>
          </motion.div>
        </motion.form>
      </div>
    </section>
  );
}