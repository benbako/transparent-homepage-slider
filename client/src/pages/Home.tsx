import { Component, lazy, Suspense, useState, type ReactNode } from "react";
import { ArrowDown, ArrowDownRight, ArrowRight, ArrowUpRight, Menu, X } from "lucide-react";

const PlayOrbit = lazy(() => import("@/components/PlayOrbit"));

class DecorativeBoundary extends Component<{ children: ReactNode }, { failed: boolean }> {
  state = { failed: false };

  static getDerivedStateFromError() {
    return { failed: true };
  }

  render() {
    return this.state.failed ? null : this.props.children;
  }
}

const heroImage = "/manus-storage/async-images/ciVJSH0vBTVwJK4ZXmXSA9/image-1.webp";
const venueImage = "/manus-storage/async-images/ciVJSH0vBTVwJK4ZXmXSA9/image-2.webp";

const experiences = [
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
    image: "/assets/pickleball.webp",
    alt: "LJ Sports Tech interactive pickleball simulator",
  },
];

const links = [
  { label: "Experiences", href: "#experiences" },
  { label: "Solutions", href: "#solutions" },
  { label: "About", href: "#about" },
];

function Header() {
  const [open, setOpen] = useState(false);
  return (
    <header className="site-header">
      <a className="logo-link" href="#top" aria-label="LJ Sports Tech home" onClick={() => setOpen(false)}>
        <img src="/assets/lj-logo.png" alt="LJ Sports Tech" />
      </a>
      <nav className="desktop-nav" aria-label="Main navigation">
        {links.map(link => <a key={link.label} href={link.href}>{link.label}</a>)}
      </nav>
      <a className="header-cta" href="#contact">LET'S TALK <ArrowUpRight size={16} strokeWidth={1.8} /></a>
      <button className="menu-toggle" type="button" aria-expanded={open} aria-controls="mobile-menu" aria-label={open ? "Close menu" : "Open menu"} onClick={() => setOpen(!open)}>
        {open ? <X size={25} /> : <Menu size={25} />}
      </button>
      {open && <nav className="mobile-nav" id="mobile-menu" aria-label="Mobile navigation">
        {links.map(link => <a key={link.label} href={link.href} onClick={() => setOpen(false)}>{link.label}<ArrowUpRight size={20}/></a>)}
        <a href="#contact" onClick={() => setOpen(false)}>Let's talk <ArrowUpRight size={20}/></a>
      </nav>}
    </header>
  );
}

function Hero() {
  return <section className="hero" id="top">
    <div className="hero-image" style={{ backgroundImage: `linear-gradient(90deg, rgba(3,9,16,.94) 0%, rgba(3,9,16,.76) 38%, rgba(3,9,16,.15) 75%), linear-gradient(0deg, rgba(3,9,16,.84) 0%, transparent 38%), url('${heroImage}')` }} />
    <div className="hero-grid" aria-hidden="true" />
    <Header />
    <DecorativeBoundary><Suspense fallback={null}><PlayOrbit className="hero-orbit" /></Suspense></DecorativeBoundary>
    <div className="hero-content page-gutter">
      <div className="eyebrow hero-eyebrow"><span className="eyebrow-line" /> A NEW DIMENSION OF SPORT</div>
      <h1>PLAY<br/><span>BEYOND</span><br/>LIMITS<span className="period">.</span></h1>
      <p>Real movement. Digital worlds. Unforgettable experiences. Let's bring a new kind of play to your space.</p>
      <div className="hero-actions">
        <a className="button button-blue" href="#experiences">EXPLORE EXPERIENCES <ArrowUpRight size={18} /></a>
        <a className="text-link light-link" href="#about">DISCOVER LJ <ArrowRight size={17} /></a>
      </div>
    </div>
    <div className="hero-bottom page-gutter">
      <span className="hero-scroll"><span className="scroll-icon"><ArrowDown size={14}/></span> SCROLL TO EXPLORE</span>
      <span className="hero-caption">SPORTS × TECHNOLOGY × PLAY</span>
      <span className="hero-image-caption">CONCEPT VISUAL</span>
    </div>
  </section>;
}

function Intro() {
  return <section className="intro-section page-gutter" id="about">
    <div className="intro-kicker"><span className="eyebrow-line dark" /> THE LJ SPORTS TECH APPROACH</div>
    <div className="intro-main">
      <h2>REAL SPORT.<br/><span>NEW POSSIBILITIES.</span></h2>
      <div className="intro-copy"><p>We bring the excitement of sport into new spaces through immersive simulators and interactive technology.</p><p>From a single experience to a complete venue, LJ Sports Tech helps turn your ideas into places people want to play.</p><a className="text-link dark-link" href="#solutions">HOW WE WORK <ArrowRight size={18}/></a></div>
    </div>
    <div className="benefit-row">
      <div><span>01 /</span><strong>MOVE FOR REAL</strong><small>Physical play meets digital worlds.</small></div>
      <div><span>02 /</span><strong>PLAY TOGETHER</strong><small>Experiences made to be shared.</small></div>
      <div><span>03 /</span><strong>MAKE IT YOURS</strong><small>Solutions tailored to your space.</small></div>
    </div>
  </section>;
}

function Experiences() {
  const [selected, setSelected] = useState(0);
  const current = experiences[selected];
  return <section className="experiences page-gutter" id="experiences">
    <div className="section-topline"><div className="eyebrow"><span className="eyebrow-line" /> THE EXPERIENCES</div><span>EXPLORE THE POSSIBILITIES <ArrowDownRight size={17}/></span></div>
    <div className="experiences-heading"><h2>CHOOSE YOUR<br/><span>WORLD OF PLAY.</span></h2><p>From the court to the slopes, explore immersive sports experiences made for a whole new kind of venue.</p></div>
    <div className="experience-layout">
      <div className="experience-feature" key={current.name}>
        <div className="feature-image-wrap"><img src={current.image} alt={current.alt} loading="lazy" onError={event => { event.currentTarget.style.display = "none"; }} /><div className="feature-image-gradient" /><span className="feature-label">{current.category} <span> / </span> {current.number}</span><div className="feature-image-caption">LJ SPORTS TECH EXPERIENCE</div></div>
        <div className="feature-copy"><div><span className="feature-index">FEATURED EXPERIENCE / {current.number}</span><h3>{current.title}</h3></div><div><p>{current.description}</p><a className="text-link light-link" href={`mailto:sarah@ljsportstech.com?subject=${encodeURIComponent(`Inquiry about ${current.name} simulator`)}`}>ASK ABOUT {current.name.toUpperCase()} <ArrowUpRight size={17}/></a></div></div>
      </div>
      <div className="experience-list" aria-label="Choose a sports experience">
        <div className="list-caption">SELECT AN EXPERIENCE <span> / 04</span></div>
        {experiences.map((item, index) => <button key={item.name} type="button" className={`experience-option ${selected === index ? "is-active" : ""}`} aria-pressed={selected === index} onClick={() => setSelected(index)}>
          <span className="option-number">{item.number}</span><span className="option-name">{item.name}</span><span className="option-icon"><ArrowUpRight size={18}/></span>
        </button>)}
        <p className="experience-note">And more ways to play, from interactive sports to arcade experiences.</p>
        <a className="all-products" href="https://www.ljsportstech.com/Sports-Simulator-pl45801697.html" target="_blank" rel="noreferrer">VIEW ALL PRODUCTS <ArrowUpRight size={17}/></a>
      </div>
    </div>
  </section>;
}

function Solutions() {
  return <section className="solutions" id="solutions">
    <div className="solutions-image" style={{backgroundImage: `linear-gradient(90deg, rgba(4,10,16,.9), rgba(4,10,16,.22)), linear-gradient(0deg, rgba(4,10,16,.5), transparent), url('${venueImage}')`}} />
    <div className="solutions-content page-gutter">
      <div className="eyebrow"><span className="eyebrow-line"/> BUILT AROUND YOUR AMBITION</div>
      <h2>YOUR SPACE.<br/>THEIR NEXT<br/><span>FAVORITE PLACE.</span></h2>
      <p>Great experiences start with a great plan. From equipment selection and venue design to installation support, we're here to help you bring your vision to life.</p>
      <a className="button button-white" href="#contact">START A PROJECT <ArrowUpRight size={18}/></a>
      <span className="concept-caption">CONCEPT VISUAL</span>
    </div>
  </section>;
}

function Contact() {
  return <section className="contact-section page-gutter" id="contact">
    <div className="contact-top"><span>HAVE A SPACE IN MIND?</span><span>LET'S MAKE IT MOVE <ArrowDownRight size={18}/></span></div>
    <div className="contact-main"><h2>LET'S BUILD<br/><span>SOMETHING</span><br/>WORTH PLAYING.</h2><div><p>Tell us about your space, your audience and the experience you want to create.</p><a className="contact-circle" href="mailto:sarah@ljsportstech.com?subject=Let's%20build%20a%20sports%20experience" aria-label="Email LJ Sports Tech about your project"><ArrowUpRight size={34}/></a><a className="contact-email" href="mailto:sarah@ljsportstech.com">sarah@ljsportstech.com <ArrowUpRight size={16}/></a></div></div>
    <footer className="footer"><div className="footer-brand"><img src="/assets/lj-logo.png" alt="LJ Sports Tech"/><p>Making more room for play.</p></div><div className="footer-column"><span>EXPLORE</span>{links.map(link => <a key={link.label} href={link.href}>{link.label}</a>)}</div><div className="footer-column"><span>GET IN TOUCH</span><a href="mailto:sarah@ljsportstech.com">Email us</a><a href="https://wa.me/8619927435575" target="_blank" rel="noreferrer">WhatsApp ↗</a><a href="tel:+8619927435575">+86 199 2743 5575</a></div><div className="footer-column footer-location"><span>FIND US</span><p>Liangjia Technology Building<br/>No. 170 Donghuan Rd, Shiqiao Street<br/>Guangzhou, China</p></div></footer>
    <div className="footer-bottom"><span>© {new Date().getFullYear()} LIANGJIA SPORTS TECHNOLOGY</span><span>SPORT HAS A NEW HOME.</span><a href="#top">BACK TO TOP ↑</a></div>
  </section>;
}

export default function Home() {
  return <main><Hero/><Intro/><Experiences/><Solutions/><Contact/></main>;
}
