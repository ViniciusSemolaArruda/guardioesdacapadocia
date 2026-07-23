import { Mail, MapPin, Phone } from "lucide-react";
import styles from "./ContactSection.module.css";

export default function ContactSection() {
  return (
    <section id="contato" className={styles.section}>
      <div className="container">
        <div className={styles.grid}>
          <div className={styles.info}>
            <p className="sectionEyebrow">Fale conosco</p>
            <h2>Entre em contato e faça parte dessa grande família.</h2>
            <p>Use o formulário para falar com a diretoria, solicitar informações sobre eventos, apresentações, parcerias e projetos.</p>
            <div className={styles.contacts}>
              <a href="tel:+5521999999999"><Phone /><span><strong>Telefone</strong>(21) 99999-9999</span></a>
              <a href="mailto:contato@guardioesdacapadocia.com.br"><Mail /><span><strong>E-mail</strong>contato@guardioesdacapadocia.com.br</span></a>
              <div><MapPin /><span><strong>Endereço</strong>Av. Nelson Cardoso, nº 82 — Tanque/RJ</span></div>
            </div>
          </div>
          <form className={styles.form}>
            <div className={styles.row}><input placeholder="Seu nome" /><input type="email" placeholder="Seu e-mail" /></div>
            <input placeholder="Assunto" />
            <textarea placeholder="Digite sua mensagem" rows={7} />
            <button type="button">Enviar mensagem</button>
          </form>
        </div>
      </div>
    </section>
  );
}
