"use client";

import {
  Crown,
  LoaderCircle,
  Mail,
  MapPin,
  Phone,
  Send,
} from "lucide-react";
import { FormEvent, useState } from "react";
import styles from "./Contato.module.css";

type FormStatus = "idle" | "sending" | "success" | "error";

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

export default function Contato() {
  const [formData, setFormData] =
    useState<ContactFormData>(initialFormData);

  const [status, setStatus] =
    useState<FormStatus>("idle");

  function handleChange(
    event:
      | React.ChangeEvent<HTMLInputElement>
      | React.ChangeEvent<HTMLTextAreaElement>,
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

      submissionData.append("Nome", formData.nome);
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
        <div className={styles.contactInformation}>
          <header className={styles.header}>
            <div className={styles.ornament}>
              <span />
              <Crown aria-hidden="true" />
              <span />
            </div>

            <h2 className={styles.title}>
              Fale conosco
            </h2>

            <p className={styles.subtitle}>
              Entre em contato conosco e faça parte
              <br className={styles.desktopBreak} />
              dessa grande família!
            </p>
          </header>

          <div className={styles.contactList}>
            <a
              href="tel:+5521999999999"
              className={styles.contactItem}
              aria-label="Ligar para a Guardiões da Capadócia"
            >
              <span className={styles.iconWrapper}>
                <Phone aria-hidden="true" />
              </span>

              <span>(21) 99999-9999</span>
            </a>

            <a
              href="mailto:guardioesdacapadociaoficial@gmail.com"
              className={styles.contactItem}
              aria-label="Enviar e-mail para a Guardiões da Capadócia"
            >
              <span className={styles.iconWrapper}>
                <Mail aria-hidden="true" />
              </span>

              <span>
                guardioesdacapadociaoficial@gmail.com
              </span>
            </a>

            <a
              href="https://www.google.com/maps/search/?api=1&query=Av.+Nelson+Cardoso,+82,+Tanque,+Rio+de+Janeiro,+RJ"
              target="_blank"
              rel="noopener noreferrer"
              className={styles.contactItem}
              aria-label="Abrir endereço no mapa"
            >
              <span className={styles.iconWrapper}>
                <MapPin aria-hidden="true" />
              </span>

              <span>
                Av. Nelson Cardoso, nº 82
                <br />
                Bairro Tanque – Rio de Janeiro / RJ
              </span>
            </a>
          </div>
        </div>

        <div
          className={styles.divider}
          aria-hidden="true"
        />

        <form
          className={styles.form}
          onSubmit={handleSubmit}
        >
          <div className={styles.field}>
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
          </div>

          <div className={styles.field}>
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
          </div>

          <div className={styles.field}>
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
          </div>

          <div
            className={`${styles.field} ${styles.messageField}`}
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
          </div>

          <div className={styles.formFooter}>
            <button
              type="submit"
              className={styles.submitButton}
              disabled={status === "sending"}
            >
              <span>
                {status === "sending"
                  ? "Enviando..."
                  : "Enviar mensagem"}
              </span>

              {status === "sending" ? (
                <LoaderCircle
                  className={styles.loadingIcon}
                  aria-hidden="true"
                />
              ) : (
                <Send aria-hidden="true" />
              )}
            </button>

            <div
              className={styles.statusArea}
              aria-live="polite"
            >
              {status === "success" && (
                <p
                  className={`${styles.statusMessage} ${styles.successMessage}`}
                >
                  Mensagem enviada com sucesso!
                </p>
              )}

              {status === "error" && (
                <p
                  className={`${styles.statusMessage} ${styles.errorMessage}`}
                >
                  Não foi possível enviar. Tente novamente.
                </p>
              )}
            </div>
          </div>
        </form>
      </div>
    </section>
  );
}