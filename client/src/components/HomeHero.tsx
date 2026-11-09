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
  fullBleed?: boolean;
};

export const homeHeroPrimaryImage = "/manus-storage/async-images/C3Kt1JyTfjUIMFpKeiEBJs/image-1.webp";

const slides: HeroSlide[] = [
  {
    eyebrow: "STEP INTO THE EXPERIENCE",
    first: "MOVE", outlined: "PLAY", last: "CONNECT",
    description: "Interactive sports experiences that bring people, technology and play together.",
    primary: { text: "EXPLORE EXPERIENCES", href: "#experiences" },
    secondary: { text: "START A PROJECT", href: "/contact" },
    image: homeHeroPrimaryImage,
    label: "Move, play, connect",
    caption: "CONCEPT VISUAL",
    fullBleed: true,
  },
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
  const [visitedSlides, setVisitedSlides] = useState<number[]>([0]);
  const [pendingIndex, setPendingIndex] = useState<number | null>(null);
  const [loadMessage, setLoadMessage] = useState("");
  const [playing, setPlaying] = useState(false);
  const [hovered, setHovered] = useState(false);
  const [showOrbit, setShowOrbit] = useState(false);
  const playingBeforePointerFocus = useRef<boolean | null>(null);
  const activeRef = useRef(0);
  const imageRefs = useRef<Array<HTMLImageElement | null>>([]);
  const pending = useRef<{ index: number; timer: number; automatic: boolean; decoding: boolean } | null>(null);

  function cancelPending() {
    const request = pending.current;
    if (!request) return;
    window.clearTimeout(request.timer);
    pending.current = null;
    setPendingIndex(null);
  }

  function cancelAutomatic() {
    if (!pending.current?.automatic) return;
    cancelPending();
    setLoadMessage("");
  }

  function finishRequest(request: NonNullable<typeof pending.current>, loaded: boolean) {
    if (pending.current !== request) return;
    cancelPending();
    if (loaded) {
      setVisitedSlides(previous => previous.includes(request.index) ? previous : [...previous, request.index]);
      activeRef.current = request.index;
      setActive(request.index);
      setLoadMessage("");
    } else {
      setVisitedSlides(previous => previous.filter(index => index !== request.index));
      if (request.automatic) setPlaying(false);
      setLoadMessage(`Slide ${request.index + 1} could not be loaded. Select it to retry.`);
    }
  }

  function imageReady(request: NonNullable<typeof pending.current>, image: HTMLImageElement) {
    if (pending.current !== request || request.decoding) return;
    if (typeof image.decode !== "function") {
      finishRequest(request, true);
      return;
    }
    request.decoding = true;
    image.decode().then(() => finishRequest(request, true), () => finishRequest(request, false));
  }

  function requestSlide(index: number, automatic = false) {
    const target = (index + slides.length) % slides.length;
    if (!automatic) setPlaying(false);
    if (pending.current?.index === target) {
      if (!automatic) pending.current.automatic = false;
      return;
    }
    cancelPending();
    if (target === activeRef.current) {
      setLoadMessage("");
      return;
    }

    const request = { index: target, timer: 0, automatic, decoding: false };
    pending.current = request;
    setPendingIndex(target);
    setLoadMessage(`Loading slide ${target + 1}…`);
    request.timer = window.setTimeout(() => finishRequest(request, false), 15000);
    const image = imageRefs.current[target];
    if (image?.getAttribute("src") === slides[target].image && image.complete) {
      if (image.naturalWidth > 0) imageReady(request, image);
      else finishRequest(request, false);
    }
  }

  useEffect(() => {
    const request = pending.current;
    if (!request) return;
    const image = imageRefs.current[request.index];
    // An image may have completed from cache before React observed its load event.
    if (image?.getAttribute("src") === slides[request.index].image && image.complete) {
      if (image.naturalWidth > 0) imageReady(request, image);
      else finishRequest(request, false);
    }
  }, [pendingIndex]);

  useEffect(() => () => {
    const request = pending.current;
    if (request) {
      window.clearTimeout(request.timer);
      pending.current = null;
    }
  }, []);

  // Pausing rotation also cancels an automatic transition that is still loading.
  useEffect(() => {
    if (!playing || hovered) cancelAutomatic();
  }, [playing, hovered]);

  // The orbit is decorative; let the primary image and content load first.
  useEffect(() => {
    const connection = (navigator as Navigator & { connection?: { saveData?: boolean } }).connection;
    if (connection?.saveData) return;
    let idleId: number | undefined;
    let timerId: number | undefined;
    const schedule = () => {
      if (typeof window.requestIdleCallback === "function") {
        idleId = window.requestIdleCallback(() => setShowOrbit(true), { timeout: 3000 });
      } else {
        timerId = window.setTimeout(() => setShowOrbit(true), 1000);
      }
    };
    if (document.readyState === "complete") schedule();
    else window.addEventListener("load", schedule, { once: true });
    return () => {
      window.removeEventListener("load", schedule);
      if (idleId !== undefined) window.cancelIdleCallback(idleId);
      if (timerId !== undefined) window.clearTimeout(timerId);
    };
  }, []);

  useEffect(() => {
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    setPlaying(!media.matches);
    const onChange = (event: MediaQueryListEvent) => { if (event.matches) { cancelAutomatic(); setPlaying(false); } };
    media.addEventListener("change", onChange);
    return () => media.removeEventListener("change", onChange);
  }, []);

  useEffect(() => {
    if (!playing || hovered || pendingIndex !== null) return;
    const timer = window.setInterval(() => {
      if (!document.hidden) requestSlide(activeRef.current + 1, true);
    }, 7000);
    return () => window.clearInterval(timer);
  }, [playing, hovered, active, pendingIndex]);

  // Warm only the next automatic slide, after the first view has settled.
  useEffect(() => {
    const connection = (navigator as Navigator & { connection?: { saveData?: boolean } }).connection;
    if (!playing || hovered || connection?.saveData) return;
    const timer = window.setTimeout(() => {
      if (document.hidden) return;
      const image = new Image();
      image.decoding = "async";
      image.fetchPriority = "low";
      image.src = slides[(active + 1) % slides.length].image;
    }, 2500);
    return () => window.clearTimeout(timer);
  }, [active, playing, hovered]);

  const selectSlide = (index: number) => {
    requestSlide(index);
  };
  const slide = slides[active];

  return <div
    className="home-hero-shell"
    onPointerEnter={event => { if (event.pointerType === "mouse") { cancelAutomatic(); setHovered(true); } }}
    onPointerLeave={event => { if (event.pointerType === "mouse") setHovered(false); }}
    onFocusCapture={() => { cancelAutomatic(); setPlaying(false); }}
  >
    <section className={`hero${slide.copySide === "right" ? " hero--copy-right" : ""}${slide.fullBleed ? " hero--fullbleed" : ""}`} aria-roledescription="carousel" aria-label="Featured sports experiences">
      <div className="hero-backgrounds" aria-hidden="true">
        {slides.map((item, index) => <div key={item.label} className={`hero-image hero-slide-image${item.subjectSide === "left" ? " hero-slide-image--subject-left" : ""}${index === active ? " is-visible" : ""}`}>
          <img
            ref={node => { imageRefs.current[index] = node; }}
            src={index === active || index === pendingIndex || visitedSlides.includes(index) ? item.image : undefined}
            alt=""
            loading={index === active || index === pendingIndex ? "eager" : "lazy"}
            decoding="async"
            draggable={false}
            onLoad={event => {
              const request = pending.current;
              if (request?.index === index && event.currentTarget.naturalWidth > 0) imageReady(request, event.currentTarget);
            }}
            onError={() => {
              setVisitedSlides(previous => previous.filter(visited => visited !== index));
              const request = pending.current;
              if (request?.index === index) finishRequest(request, false);
            }}
          />
        </div>)}
      </div>
      <div className="hero-grid" aria-hidden="true" />
      {showOrbit && <DecorativeBoundary><Suspense fallback={null}><PlayOrbit className="hero-orbit" /></Suspense></DecorativeBoundary>}
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
        <span className="hero-slide-status" role="status" aria-live="polite">{loadMessage}</span>
        <div className="hero-slide-pickers" role="group" aria-label="Choose a slide">
          {slides.map((item, index) => <button key={item.label} type="button" className={`hero-slide-picker${active === index ? " is-active" : ""}`} aria-label={`Show slide ${index + 1}: ${item.label}`} aria-current={active === index ? "true" : undefined} onClick={() => selectSlide(index)}><span>0{index + 1}</span></button>)}
        </div>
        <button className="hero-slide-arrow" type="button" aria-label="Previous slide" onClick={() => selectSlide((pending.current?.index ?? activeRef.current) - 1)}><ArrowLeft size={16}/></button>
        <button className="hero-slide-arrow" type="button" aria-label="Next slide" onClick={() => selectSlide((pending.current?.index ?? activeRef.current) + 1)}><ArrowRight size={16}/></button>
        <button className="hero-slide-pause" type="button" aria-label={playing ? "Pause automatic slide rotation" : "Play automatic slide rotation"} onPointerDown={() => { playingBeforePointerFocus.current = playing; }} onClick={event => { const wasPlaying = event.detail > 0 && playingBeforePointerFocus.current !== null ? playingBeforePointerFocus.current : playing; if (wasPlaying) cancelAutomatic(); setPlaying(!wasPlaying); playingBeforePointerFocus.current = null; }}>{playing ? <Pause size={15}/> : <Play size={15}/>}</button>
      </div>
      <div className="hero-bottom page-gutter">
        <span className="hero-scroll"><span className="scroll-icon"><ArrowDown size={14}/></span> SCROLL TO EXPLORE</span>
        <span className="hero-caption">SPORTS × TECHNOLOGY × PLAY</span>
        <span className="hero-image-caption">{slide.caption}</span>
      </div>
    </section>
  </div>;
}
