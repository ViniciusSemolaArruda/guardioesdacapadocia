import AboutSection from "@/components/About/AboutSection";
import Contato from "@/components/Contato/Contato";
import EventSection from "@/components/Event/EventSection";
import Footer from "@/components/Footer/Footer";
import Galeria from "@/components/Galeria/galeria";
import Header from "@/components/Header/Header";
import Hero from "@/components/Hero/Hero";

export default function HomePage() {
  return (
    <>
      <Header />

      <main>
        <Hero />
        <AboutSection />
        <EventSection />
        <Galeria />
        <Contato />
      </main>

      <Footer />
    </>
  );
}