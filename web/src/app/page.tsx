import { About } from "@/components/site/about";
import { Cassette3D } from "@/components/site/cassette-3d";
import { Contact } from "@/components/site/contact";
import { Hero } from "@/components/site/hero";
import { Channels, VoiceSection } from "@/components/site/home-sections";
import { Films, WorkGallery } from "@/components/site/work";

export default function Home() {
  return (
    <main>
      <Hero />
      <VoiceSection />
      <About />
      <WorkGallery />
      <Films />
      <Channels />
      <Contact />
      <Cassette3D />
    </main>
  );
}
