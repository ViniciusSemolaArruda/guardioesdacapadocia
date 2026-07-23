import { CalendarDays, Clock3, MapPin, Ticket } from "lucide-react";
import styles from "./EventSection.module.css";

const details = [
  { icon: CalendarDays, title: "31 de outubro de 2026", text: "Sábado" },
  { icon: Clock3, title: "A partir das 8h", text: "Programação durante todo o dia" },
  { icon: MapPin, title: "Av. Nelson Cardoso, nº 82", text: "Tanque — Rio de Janeiro/RJ" },
];

export default function EventSection() {
  return (
    <section id="evento" className={styles.section}>
      <div className={styles.flag} aria-hidden="true" />
      <div className="container">
        <div className={styles.heading}>
          <p>Próximo evento</p>
          <h2>Festival Todo Mundo no Samba</h2>
          <span>Uma celebração aberta à cultura, à música e à alegria.</span>
        </div>
        <div className={styles.grid}>
          <div className={styles.details}>
            {details.map(({ icon: Icon, title, text }) => (
              <article key={title}><Icon /><div><strong>{title}</strong><span>{text}</span></div></article>
            ))}
          </div>
          <div className={styles.ctaBox}>
            <Ticket size={34} />
            <h3>Prepare-se para viver essa festa</h3>
            <p>Em breve, esta área poderá receber informações de ingressos, programação, atrações e patrocinadores.</p>
            <a href="#contato">Saiba mais sobre o evento</a>
          </div>
        </div>
      </div>
    </section>
  );
}
