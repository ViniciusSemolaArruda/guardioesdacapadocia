import Image from "next/image";
import { Instagram, Mail, MapPin, Phone } from "lucide-react";
import styles from "./Footer.module.css";

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <div className="container">
        <div className={styles.grid}>
          <div className={styles.brand}>
            <Image src="/images/logo-guardioes.png" alt="Guardiões da Capadócia" width={96} height={96} />
            <div><strong>G.R.E.S. Guardiões da Capadócia</strong><p>Tradição que inspira, paixão que nos move.</p></div>
          </div>
          <div><h3>Links rápidos</h3><a href="#inicio">Início</a><a href="#evento">Evento</a><a href="#quem-somos">Quem somos</a><a href="#galeria">Galeria</a></div>
          <div><h3>Redes sociais</h3><a href="#"><Instagram size={17} /> Instagram</a><a href="#"><Instagram size={17} /> Facebook</a><a href="#"><Instagram size={17} /> YouTube</a></div>
          <div><h3>Contato</h3><span><Phone size={17} /> (21) 99999-9999</span><span><Mail size={17} /> contato@guardioes...</span><span><MapPin size={17} /> Tanque — RJ</span></div>
        </div>
        <div className={styles.bottom}>© 2026 G.R.E.S. Guardiões da Capadócia — Todos os direitos reservados.</div>
      </div>
    </footer>
  );
}
