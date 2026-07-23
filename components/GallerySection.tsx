import Image from "next/image";
import styles from "./GallerySection.module.css";

const photos = [
  { src: "/images/hero-samba.jpg", title: "Nossa energia" },
  { src: "/images/historia-samba.jpg", title: "Nossa história" },
  { src: "/images/bandeira-logo.jpg", title: "Nossas cores" },
];

export default function GallerySection() {
  return (
    <section id="galeria" className={styles.section}>
      <div className="container">
        <div className={styles.heading}>
          <div><p className="sectionEyebrow">Galeria</p><h2 className="sectionTitle">Momentos que <span className="goldText">fazem história</span></h2></div>
          <p>Área preparada para receber fotografias de ensaios, apresentações, eventos, comunidade e bastidores da escola.</p>
        </div>
        <div className={styles.grid}>
          {photos.map((photo, index) => (
            <article key={photo.title} className={index === 0 ? styles.large : ""}>
              <Image src={photo.src} alt={photo.title} fill />
              <div><span>0{index + 1}</span><h3>{photo.title}</h3></div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
