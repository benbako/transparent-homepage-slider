import { useState } from "react";
import HomeHero from "@/components/HomeHero";
import HomeCatalogue from "@/components/HomeCatalogue";
import HomeLower from "@/components/HomeLower";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";
import type { ProductShowroomItem } from "@/components/ProductShowroom";

const experiences: ProductShowroomItem[] = [
  {
    number: "01",
    name: "Tennis",
    category: "RACKET SPORTS",
    title: "A new court\nfor every player.",
    description: "Bring the energy of the court indoors with interactive tennis experiences made for play, practice and friendly competition.",
    image: "/assets/tennis-real.webp",
    alt: "LJ Sports Tech indoor digital tennis simulator",
  },
  {
    number: "02",
    name: "Football",
    category: "BALL SPORTS",
    title: "Make every\nshot count.",
    description: "Turn a compact space into an engaging football experience where players can test their aim, challenge friends and keep coming back.",
    image: "/assets/football.webp",
    alt: "LJ Sports Tech interactive football simulator",
  },
  {
    number: "03",
    name: "Skiing",
    category: "ADVENTURE SPORTS",
    title: "The mountain\ncomes to you.",
    description: "Give guests the feeling of the slopes in an indoor setting, with an immersive experience that brings adventure closer to home.",
    image: "/assets/skiing.webp",
    alt: "LJ Sports Tech immersive skiing simulator",
  },
  {
    number: "04",
    name: "Pickleball",
    category: "RACKET SPORTS",
    title: "More ways\nto get in the game.",
    description: "Bring a lively racket sport indoors with an interactive experience designed for play in all kinds of venues.",
    image: "/assets/pickleball-catalog.webp",
    alt: "Product illustration of an LJ Sports Tech interactive pickleball simulator",
    imageCaption: "PRODUCT ILLUSTRATION",
    imagePosition: "center 90%",
  },
];

export default function Home() {
  const [selected, setSelected] = useState(0);

  return (
    <div className="reference-home" id="top">
      <div className="home-hero-shell"><SiteHeader /></div>
      <main>
        <HomeHero />
        <HomeCatalogue items={experiences} selected={selected} onSelect={setSelected} />
        <HomeLower />
      </main>
      <div className="home-lower"><div className="hl-footer-wrap"><div className="hl-container"><SiteFooter /></div></div></div>
    </div>
  );
}
