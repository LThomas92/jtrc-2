import Hero from '@components/home/Hero.jsx';
import About from '@components/home/About.jsx';
import Menu from '@components/home/Menu.jsx';
import Packages from '@components/home/Packages.jsx';
import Process from '@components/home/Process.jsx';
import Postcards from '@components/home/Postcards.jsx';
import CTA from '@components/home/CTA.jsx';
import Reveal from '@components/ui/Reveal.jsx';

export default function HomePage() {
  return (
    <>
      <Hero />
      <Reveal as="section"><About /></Reveal>
      <Reveal as="section"><Menu /></Reveal>
      <Reveal as="section"><Packages /></Reveal>
      <Reveal as="section"><Process /></Reveal>
      <Reveal as="section"><Postcards /></Reveal>
      <Reveal as="section"><CTA /></Reveal>
    </>
  );
}
