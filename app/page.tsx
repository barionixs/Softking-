import { AboutSection } from "@/components/AboutSection";
import { BackgroundFx } from "@/components/BackgroundFx";
import { BlogSection } from "@/components/BlogSection";
import { ContactSection } from "@/components/ContactSection";
import { Footer } from "@/components/Footer";
import { Hero } from "@/components/Hero";
import { Navbar } from "@/components/Navbar";
import { ServicesSection } from "@/components/ServicesSection";

export default function Home() {
  return (
    <>
      <BackgroundFx />
      <Navbar />
      <main>
        <Hero />
        <ServicesSection />
        <AboutSection />
        <BlogSection />
        <ContactSection />
      </main>
      <Footer />
    </>
  );
}
