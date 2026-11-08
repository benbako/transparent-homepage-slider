import { Component, lazy, Suspense, useEffect, useRef, useState, type ReactNode } from "react";
import { ArrowDown, ArrowLeft, ArrowRight, ArrowUpRight, Pause, Play } from "lucide-react";
import "./home-hero-reference.css";

const PlayOrbit = lazy(() => import("./PlayOrbit"));

class DecorativeBoundary extends Component<{ children: ReactNode }, { failed: boolean }> {
  state = { failed: false };
  static getDerivedStateFromError() { return { failed: true }; }
  render() { return this.state.failed ? null : this.props.children; }
}

type HeroSlide = {
  eyebrow: string;
  first: string;
  outlined: string;
  last: string;
  description: string;
  primary: { text: string; href: string };
  secondary: { text: string; href: string };
  image: string;
  label: string;
  caption: string;
  copySide?: "right";
  subjectSide?: "left";
};

const slides: HeroSlide[] = [
  {
    eyebrow: "A NEW DIMENSION OF SPORT",
    first: "PLAY", outlined: "BEYOND", last: "LIMITS",
    description: "Real movement. Digital worlds. Unforgettable experiences. Let's bring a new kind of play to your space.",
    primary: { text: "EXPLORE EXPERIENCES", href: "#experiences" },
    secondary: { text: "DISCOVER LJ", href: "#about" },
    image: "/manus-storage/async-images/QIghVlGM0UfFWsKq8QK7U4/image-1.webp",
    label: "Play beyond limits",
    caption: "CONCEPT VISUAL",
  },
  {
    eyebrow: "THE GAME IS ON",
    first: "PLAY", outlined: "YOUR", last: "BEST",
    description: "Bring the excitement of tennis indoors with an immersive sports experience.",
    primary: { text: "EXPLORE TENNIS", href: "/Tennis-Simulator-pd594559948.html" },
    secondary: { text: "VIEW PRODUCTS", href: "/products.html" },
    image: "/manus-storage/ljsportstech_slider_01_fe42207a.webp",
    label: "Play your best",
    caption: "SPORTS EXPERIENCE VISUAL",
  },
  {
    eyebrow: "A WORLD OF SPORTS",
    first: "ONE SPACE", outlined: "MANY WAYS", last: "TO PLAY",
    description: "From tennis to skiing and beyond, discover interactive sports experiences for your space.",
    primary: { text: "EXPLORE EXPERIENCES", href: "/experiences" },
    secondary: { text: "START A PROJECT", href: "/contact" },
    image: "/manus-storage/ljsportstech_slider_02_17c1d36a.webp",
    label: "Many ways to play",
    caption: "SPORTS EXPERIENCE VISUAL",
    copySide: "right",
    subjectSide: "left",
  },
  {
    eyebrow: "MOVE AND PLAY TOGETHER",
    first: "BRING", outlined: "PLAYERS", last: "TOGETHER",
    description: "Make room for shared challenges and interactive fun that gets people moving.",
    primary: { text: "EXPLORE EXPERIENCES", href: "/experiences" },
    secondary: { text: "PLAN A PROJECT", href: "/contact" },
    image: "/manus-storage/ljsportstech_slider_03_a5e7ed08.webp",
    label: "Bring players together",
    caption: "SPORTS EXPERIENCE VISUAL",
  },
  {
    eyebrow: "MOVE INTO A NEW WORLD",
    first: "PLAY", outlined: "IN A NEW", last: "WORLD",
    description: "Step into immersive sports experiences that bring movement, technology and people together.",
    primary: { text: "DISCOVER EXPERIENCES", href: "/experiences" },
    secondary: { text: "START A PROJECT", href: "/contact" },
    image: "/assets/skiing.webp",
    label: "Play in a new world",
    caption: "LJ SIMULATOR",
  },
  {
    eyebrow: "BUILT AROUND YOUR AMBITION",
    first: "BUILD", outlined: "WHAT'S", last: "NEXT",
    description: "From a single simulator to a complete venue, let's create a place people come to play.",
    primary: { text: "EXPLORE SOLUTIONS", href: "/solutions" },
    secondary: { text: "LET'S TALK", href: "/contact" },
    image: "/manus-storage/async-images/ciVJSH0vBTVwJK4ZXmXSA9/image-2.webp",
    label: "Build what's next",
    caption: "CONCEPT VISUAL",
  },
];

export default function HomeHero() {
  const [active, setActive] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [hovered, setHovered] = useState(false);
  const playingBeforePointerFocus = useRef<boolean | null>(null);

  useEffect(() => {
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    setPlaying(!media.matches);
    const onChange = (event: MediaQueryListEvent) => { if (event.matches) setPlaying(false); };
    media.addEventListener("change", onChange);
    return () => media.removeEventListener("change", onChange);
  }, []);

  useEffect(() => {
    if (!playing || hovered) return;
    const timer = window.setInterval(() => {
      if (!document.hidden) setActive(index => (index + 1) % slides.length);
    }, 7000);
    return () => window.clearInterval(timer);
  }, [playing, hovered]);

  const selectSlide = (index: number) => {
    setPlaying(false);
    setActive((index + slides.length) % slides.length);
  };
  const slide = slides[active];

  return <div
    className="home-hero-shell"
    onPointerEnter={event => { if (event.pointerType === "mouse") setHovered(true); }}
    onPointerLeave={event => { if (event.pointerType === "mouse") setHovered(false); }}
    onFocusCapture={() => setPlaying(false)}
  >
    <section className={`hero${slide.copySide === "right" ? " hero--copy-right" : ""}`} aria-roledescription="carousel" aria-label="Featured sports experiences">
      <div className="hero-backgrounds" aria-hidden="true">
        {slides.map((item, index) => <div key={item.label} className={`hero-image hero-slide-image${item.subjectSide === "left" ? " hero-slide-image--subject-left" : ""}${index === active ? " is-visible" : ""}`} style={{ backgroundImage: `url('${item.image}')` }} />)}
      </div>
      <div className="hero-grid" aria-hidden="true" />
      <DecorativeBoundary><Suspense fallback={null}><PlayOrbit className="hero-orbit" /></Suspense></DecorativeBoundary>
      <div className="hero-content page-gutter" role="group" aria-roledescription="slide" aria-label={`${active + 1} of ${slides.length}`} aria-live={playing && !hovered ? "off" : "polite"} key={slide.label}>
        <div className="eyebrow hero-eyebrow"><span className="eyebrow-line" /> {slide.eyebrow}</div>
        <h1>{slide.first}<br/><span>{slide.outlined}</span><br/>{slide.last}<span className="period">.</span></h1>
        <p>{slide.description}</p>
        <div className="hero-actions">
          <a className="button button-blue" href={slide.primary.href}>{slide.primary.text} <ArrowUpRight size={18} /></a>
          <a className="text-link light-link" href={slide.secondary.href}>{slide.secondary.text} <ArrowRight size={17} /></a>
        </div>
      </div>
      <div className="hero-slider-controls" role="group" aria-label="Hero slide controls">
        <div className="hero-slide-pickers" role="group" aria-label="Choose a slide">
          {slides.map((item, index) => <button key={item.label} type="button" className={`hero-slide-picker${active === index ? " is-active" : ""}`} aria-label={`Show slide ${index + 1}: ${item.label}`} aria-current={active === index ? "true" : undefined} onClick={() => selectSlide(index)}><span>0{index + 1}</span></button>)}
        </div>
        <button className="hero-slide-arrow" type="button" aria-label="Previous slide" onClick={() => selectSlide(active - 1)}><ArrowLeft size={16}/></button>
        <button className="hero-slide-arrow" type="button" aria-label="Next slide" onClick={() => selectSlide(active + 1)}><ArrowRight size={16}/></button>
        <button className="hero-slide-pause" type="button" aria-label={playing ? "Pause automatic slide rotation" : "Play automatic slide rotation"} onPointerDown={() => { playingBeforePointerFocus.current = playing; }} onClick={event => { const wasPlaying = event.detail > 0 && playingBeforePointerFocus.current !== null ? playingBeforePointerFocus.current : playing; setPlaying(!wasPlaying); playingBeforePointerFocus.current = null; }}>{playing ? <Pause size={15}/> : <Play size={15}/>}</button>
      </div>
      <div className="hero-bottom page-gutter">
        <span className="hero-scroll"><span className="scroll-icon"><ArrowDown size={14}/></span> SCROLL TO EXPLORE</span>
        <span className="hero-caption">SPORTS × TECHNOLOGY × PLAY</span>
        <span className="hero-image-caption">{slide.caption}</span>
      </div>
    </section>
  </div>;
}
