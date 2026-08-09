"use client";

import Image from "next/image";
import { useEffect, useMemo, useState } from "react";
import {
  ArrowRight,
  Crown,
  ExternalLink,
  Info,
  Instagram,
  Sparkles,
  X,
} from "lucide-react";

import Header from "@/components/Header/Header";
import Footer from "@/components/Footer/Footer";

import styles from "./sobre.module.css";

type Member = {
  id: number;
  name: string;
  role: string;
  category: string;
  image: string;
  instagram?: string;
  biography: string;
};

const categories = [
  {
    id: "diretoria",
    label: "Diretoria",
  },
  {
    id: "carnaval",
    label: "Carnaval",
  },
  {
    id: "harmonia",
    label: "Harmonia",
  },
  {
    id: "bateria",
    label: "Bateria",
  },
  {
    id: "musical",
    label: "Departamento Musical",
  },
  {
    id: "comunicacao",
    label: "Comunicação",
  },
  {
    id: "cultural",
    label: "Gestão Cultural",
  },
  {
    id: "producao",
    label: "Produção",
  },
  {
    id: "comunidade",
    label: "Comunidade",
  },
];

const members: Member[] = [
  {
    id: 1,
    name: "Sandro Capadócia",
    role: "Diretor Geral",
    category: "diretoria",
    image: "/membros/sandro.png",
    instagram: "https://www.instagram.com/",
    biography:
      "Sandro Capadócia atua na direção geral da G.R.E.S. Guardiões da Capadócia, contribuindo para o desenvolvimento institucional, cultural e estratégico da escola. Sua trajetória é marcada pelo compromisso com o samba, com a comunidade e com a valorização da cultura popular.",
  },
  
  {
    id: 3,
    name: "BaBi Cruz",
    role: "Relações Públicas",
    category: "comunicacao",
    image: "/images/membros/babi-cruz.jpg",
    instagram: "https://www.instagram.com/",
    biography:
      "BaBi Cruz é responsável pelo relacionamento institucional e pela aproximação da escola com parceiros, convidados, integrantes da comunidade e representantes da cultura do samba.",
  },
  {
    id: 4,
    name: "Carla Lopes",
    role: "Gestão Cultural e Pesquisa",
    category: "cultural",
    image: "/images/membros/carla-lopes.jpg",
    instagram: "https://www.instagram.com/",
    biography:
      "Carla Lopes atua na gestão cultural e na pesquisa, contribuindo para a preservação da memória, para o desenvolvimento dos projetos culturais e para a valorização da história da Guardiões da Capadócia.",
  },
  {
    id: 5,
    name: "Daniel Paiva",
    role: "Produção de Imagens",
    category: "producao",
    image: "/images/membros/daniel-paiva.jpg",
    instagram: "https://www.instagram.com/",
    biography:
      "Daniel Paiva trabalha na produção de imagens e no registro dos momentos que fazem parte da trajetória da escola, ajudando a preservar visualmente sua história e sua identidade.",
  },
  {
    id: 6,
    name: "Nome do Integrante",
    role: "Direção de Carnaval",
    category: "carnaval",
    image: "/images/membros/membro-carnaval.jpg",
    instagram: "https://www.instagram.com/",
    biography:
      "Responsável pelo planejamento e pela organização das atividades relacionadas ao carnaval, trabalhando na integração dos diferentes departamentos da escola.",
  },
  {
    id: 7,
    name: "Nome do Integrante",
    role: "Direção de Harmonia",
    category: "harmonia",
    image: "/images/membros/membro-harmonia.jpg",
    instagram: "https://www.instagram.com/",
    biography:
      "Atua na organização dos componentes durante ensaios, apresentações e desfiles, garantindo harmonia, disciplina, evolução e integração entre as alas.",
  },
  {
    id: 8,
    name: "Nome do Integrante",
    role: "Mestre de Bateria",
    category: "bateria",
    image: "/images/membros/mestre-bateria.jpg",
    instagram: "https://www.instagram.com/",
    biography:
      "Responsável pela condução musical da bateria, pela preparação dos ritmistas e pela preservação da identidade rítmica da Guardiões da Capadócia.",
  },
  {
    id: 9,
    name: "Nome do Integrante",
    role: "Direção Musical",
    category: "musical",
    image: "/images/membros/direcao-musical.jpg",
    instagram: "https://www.instagram.com/",
    biography:
      "Atua na criação, preparação e direção musical da escola, contribuindo para a interpretação dos sambas e para a identidade artística da agremiação.",
  },
  {
    id: 10,
    name: "Nome do Integrante",
    role: "Representante da Comunidade",
    category: "comunidade",
    image: "/images/membros/comunidade.jpg",
    instagram: "https://www.instagram.com/",
    biography:
      "Representa a participação ativa da comunidade na construção da escola, fortalecendo os vínculos sociais, culturais e afetivos da Guardiões da Capadócia.",
  },
];

const timeline = [
  {
    number: "01",
    title: "O nascimento de um sonho",
    text: "A Guardiões da Capadócia nasceu da união de pessoas apaixonadas pelo samba, pela cultura popular e pelo fortalecimento da comunidade.",
  },
  {
    number: "02",
    title: "A força da comunidade",
    text: "A escola cresceu com a participação de integrantes, artistas, músicos, trabalhadores, parceiros e famílias que acreditaram no projeto.",
  },
  {
    number: "03",
    title: "Nossa identidade",
    text: "O vermelho, o branco e o dourado representam nossa força, nossa fé, nossa elegância e o orgulho de carregar o nome da Capadócia.",
  },
  {
    number: "04",
    title: "Um futuro de conquistas",
    text: "Seguimos construindo uma história baseada em união, organização, inovação, responsabilidade cultural e amor pelo samba.",
  },
];

export default function Sobre() {
  const [activeCategory, setActiveCategory] = useState("diretoria");
  const [selectedMember, setSelectedMember] = useState<Member | null>(null);

  const tickerMembers = useMemo(
    () => members.filter((member) => member.name !== "Nome do Integrante"),
    []
  );

  const filteredMembers = useMemo(
    () =>
      members.filter((member) => member.category === activeCategory),
    [activeCategory]
  );

  useEffect(() => {
    if (!selectedMember) {
      return;
    }

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    function handleEscape(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setSelectedMember(null);
      }
    }

    window.addEventListener("keydown", handleEscape);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", handleEscape);
    };
  }, [selectedMember]);

  return (
    <>
      <Header />

      <main className={styles.page}>
        {/* =====================================================
            FAIXA ANIMADA DE INTEGRANTES
        ====================================================== */}
        <section
          className={styles.membersTicker}
          aria-label="Integrantes da Guardiões da Capadócia"
        >
          <div className={styles.tickerViewport}>
            <div className={styles.tickerTrack}>
              {[...tickerMembers, ...tickerMembers].map(
                (member, index) => (
                  <div
                    className={styles.tickerItem}
                    key={`${member.id}-${index}`}
                    aria-hidden={index >= tickerMembers.length}
                  >
                    <span className={styles.tickerRole}>
                      {member.role}
                    </span>

                    <span className={styles.tickerSeparator}>
                      <Crown size={13} strokeWidth={2.2} />
                    </span>

                    <span className={styles.tickerName}>
                      {member.name}
                    </span>
                  </div>
                )
              )}
            </div>
          </div>
        </section>

        {/* =====================================================
            HERO DA PÁGINA
        ====================================================== */}
        <section className={styles.hero}>
          <div
            className={styles.heroBackground}
            aria-hidden="true"
          />

          <div
            className={styles.heroOverlay}
            aria-hidden="true"
          />

          <div className={styles.heroContainer}>
            <div className={styles.heroContent}>
              <div className={styles.sectionEyebrow}>
                <span />
                <Crown size={16} />
                <p>Nossa escola</p>
                <span />
              </div>

              <h1>
                Uma história construída com
                <strong> amor ao samba</strong>
              </h1>

              <p className={styles.heroDescription}>
                Conheça a trajetória, os valores e as pessoas que
                ajudam a escrever todos os dias a história da
                G.R.E.S. Guardiões da Capadócia.
              </p>

              {/* <a
                href="#nossa-historia"
                className={styles.heroButton}
              >
                Conheça nossa trajetória
                <ArrowRight size={19} />
              </a> */}
            </div>

            <div
              className={styles.heroSeal}
              aria-hidden="true"
            >
              <div className={styles.heroSealCircle}>
                <Image
                  src="/images/logo.png"
                  alt=""
                  width={220}
                  height={220}
                  priority
                />
              </div>
            </div>
          </div>
        </section>

        {/* =====================================================
            HISTÓRIA
        ====================================================== */}
        <section
          className={styles.historySection}
          id="nossa-historia"
        >
          <div className={styles.historyContainer}>
            <div className={styles.historyImageColumn}>
              <div className={styles.mainHistoryImage}>
                <Image
                  src="/images/foto2.png"
                  alt="Integrantes da Guardiões da Capadócia"
                  fill
                  sizes="(max-width: 900px) 100vw, 48vw"
                />

                <div className={styles.imageBadge}>
                  <strong>G.R.E.S.</strong>
                  <span>Guardiões da Capadócia</span>
                </div>
              </div>

              <div className={styles.historyDetailImage}>
                <Image
                  src="/images/foto4.png"
                  alt="Apresentação da Guardiões da Capadócia"
                  fill
                  sizes="(max-width: 900px) 45vw, 20vw"
                />
              </div>

              <div
                className={styles.historyDecoration}
                aria-hidden="true"
              />
            </div>

            <div className={styles.historyContent}>
              <div className={styles.sectionLabel}>
                <Sparkles size={16} />
                <span>Quem somos</span>
              </div>

              <h2>
                Mais que uma escola,
                <strong> somos uma família</strong>
              </h2>

              <div className={styles.historyText}>
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
                  Somos mais que uma escola de samba. Somos uma
                  família que defende suas cores, suas tradições e o
                  samba como expressão da alma.
                </p>

                <p>
                  Cada integrante, cada ritmista, cada componente e
                  cada pessoa que acredita em nosso projeto é parte
                  fundamental dessa história.
                </p>
              </div>

              <div className={styles.historyQuote}>
                <span>“</span>

                <blockquote>
                  Nossa força vem da comunidade. Nosso coração bate
                  no ritmo do samba.
                </blockquote>
              </div>
            </div>
          </div>
        </section>

        {/* =====================================================
            LINHA DO TEMPO
        ====================================================== */}
        <section className={styles.timelineSection}>
          <div className={styles.sectionHeading}>
            <div className={styles.sectionEyebrow}>
              <span />
              <Crown size={16} />
              <p>Nossa trajetória</p>
              <span />
            </div>

            <h2>
              Uma história feita de
              <strong> força, foco e fé</strong>
            </h2>

            <p>
              Cada etapa representa um capítulo importante da nossa
              caminhada.
            </p>
          </div>

          <div className={styles.timelineGrid}>
            {timeline.map((item) => (
              <article
                className={styles.timelineCard}
                key={item.number}
              >
                <div className={styles.timelineNumber}>
                  {item.number}
                </div>

                <div className={styles.timelineIcon}>
                  <Crown size={19} />
                </div>

                <h3>{item.title}</h3>
                <p>{item.text}</p>
              </article>
            ))}
          </div>
        </section>

        {/* =====================================================
            INTEGRANTES
        ====================================================== */}
        <section className={styles.teamSection}>
          <div className={styles.teamContainer}>
            <div className={styles.sectionHeading}>
              <div className={styles.sectionEyebrow}>
                <span />
                <Crown size={16} />
                <p>Nossa equipe</p>
                <span />
              </div>

              <h2>
                Quem faz parte da
                <strong> Guardiões da Capadócia</strong>
              </h2>

              <p>
                Selecione uma área para conhecer seus integrantes e
                suas histórias.
              </p>
            </div>

            <div
              className={styles.categoryButtons}
              role="tablist"
              aria-label="Áreas da escola de samba"
            >
              {categories.map((category) => {
                const isActive = activeCategory === category.id;

                return (
                  <button
                    key={category.id}
                    type="button"
                    role="tab"
                    aria-selected={isActive}
                    className={`${styles.categoryButton} ${
                      isActive ? styles.categoryButtonActive : ""
                    }`}
                    onClick={() => setActiveCategory(category.id)}
                  >
                    {category.label}
                  </button>
                );
              })}
            </div>

            <div
              className={styles.teamGrid}
              key={activeCategory}
            >
              {filteredMembers.map((member, index) => (
                <article
                  className={styles.memberCard}
                  key={member.id}
                  style={
                    {
                      "--card-delay": `${index * 90}ms`,
                    } as React.CSSProperties
                  }
                >
                  <div className={styles.memberImageWrapper}>
                    <Image
                      src={member.image}
                      alt={`${member.name} — ${member.role}`}
                      fill
                      sizes="(max-width: 650px) 92vw, (max-width: 1000px) 45vw, 300px"
                      className={styles.memberImage}
                    />

                    <div className={styles.memberGradient} />

                    <div className={styles.memberHover}>
                      <div className={styles.memberActions}>
                        {member.instagram && (
                          <a
                            href={member.instagram}
                            target="_blank"
                            rel="noopener noreferrer"
                            className={styles.memberAction}
                            aria-label={`Abrir o Instagram de ${member.name}`}
                          >
                            <Instagram size={31} />
                            
                          </a>
                        )}

                        <button
                          type="button"
                          className={styles.memberAction}
                          onClick={() => setSelectedMember(member)}
                          aria-label={`Ver informações sobre ${member.name}`}
                        >
                          <Info size={31} />
                          
                        </button>
                      </div>
                    </div>

                    <div className={styles.memberCardContent}>
                      <span>{member.role}</span>
                      <h3>{member.name}</h3>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* =====================================================
            ENCERRAMENTO
        ====================================================== */}
        <section className={styles.finalSection}>
          <div
            className={styles.finalBackground}
            aria-hidden="true"
          />

          <div className={styles.finalContent}>
            <Image
              src="/images/logo.png"
              alt="Brasão da Guardiões da Capadócia"
              width={135}
              height={135}
            />

            <span>G.R.E.S. Guardiões da Capadócia</span>

            <h2>
              Nossa história continua sendo escrita
              <strong> por todos nós.</strong>
            </h2>

            <p>Força, Foco, Fé e Samba no Pé!</p>
          </div>
        </section>
      </main>

      <Footer />

      {/* =====================================================
          MODAL DE CURRÍCULO
      ====================================================== */}
      {selectedMember && (
        <div
          className={styles.modalBackdrop}
          role="presentation"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) {
              setSelectedMember(null);
            }
          }}
        >
          <article
            className={styles.memberModal}
            role="dialog"
            aria-modal="true"
            aria-labelledby="member-modal-title"
          >
            <button
              type="button"
              className={styles.modalClose}
              onClick={() => setSelectedMember(null)}
              aria-label="Fechar informações"
            >
              <X size={22} />
            </button>

            <div className={styles.modalImage}>
              <Image
                src={selectedMember.image}
                alt={selectedMember.name}
                fill
                sizes="(max-width: 700px) 100vw, 42vw"
              />
            </div>

            <div className={styles.modalContent}>
              <div className={styles.modalRole}>
                <Crown size={15} />
                <span>{selectedMember.role}</span>
              </div>

              <h2 id="member-modal-title">
                {selectedMember.name}
              </h2>

              <div className={styles.modalDivider} />

              <h3>Sobre o integrante</h3>

              <p>{selectedMember.biography}</p>

              {selectedMember.instagram && (
                <a
                  href={selectedMember.instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={styles.modalInstagram}
                >
                  <Instagram size={19} />
                  Visitar Instagram
                  <ExternalLink size={16} />
                </a>
              )}
            </div>
          </article>
        </div>
      )}
    </>
  );
}