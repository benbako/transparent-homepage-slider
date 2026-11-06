import { useState } from "react";
import { ArrowDownRight, ArrowRight, ArrowUpRight } from "lucide-react";
import HomeHero from "@/components/HomeHero";
import ProductShowroom from "@/components/ProductShowroom";
import SiteFooter from "@/components/SiteFooter";

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


function Intro() {
  return <section className="intro-section page-gutter" id="about">
    <div className="intro-kicker"><span className="eyebrow-line dark" /> THE LJ SPORTS TECH APPROACH</div>
    <div className="intro-main">
      <h2>REAL SPORT.<br/><span>NEW POSSIBILITIES.</span></h2>
      <div className="intro-copy"><p>We bring the excitement of sport into new spaces through immersive simulators and interactive technology.</p><p>From a single experience to a complete venue, LJ Sports Tech helps turn your ideas into places people want to play.</p><div className="intro-links"><a className="text-link dark-link" href="#solutions">HOW WE WORK <ArrowRight size={18}/></a><a className="text-link dark-link" href="/about">OUR STORY <ArrowRight size={18}/></a></div></div>
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
  return <section className="experiences page-gutter" id="experiences">
    <div className="section-topline"><div className="eyebrow"><span className="eyebrow-line" /> THE EXPERIENCES</div><span>EXPLORE THE POSSIBILITIES <ArrowDownRight size={17}/></span></div>
    <div className="experiences-heading"><h2>CHOOSE YOUR<br/><span>WORLD OF PLAY.</span></h2><p>From the court to the slopes, explore immersive sports experiences made for a whole new kind of venue.</p></div>
    <div className="experience-layout">
      <ProductShowroom items={experiences} selected={selected} onSelect={setSelected} />
      <div className="experience-list" aria-label="Choose a sports experience">
        <div className="list-caption">SELECT AN EXPERIENCE <span> / 04</span></div>
        {experiences.map((item, index) => <button key={item.name} type="button" className={`experience-option ${selected === index ? "is-active" : ""}`} aria-pressed={selected === index} onClick={() => setSelected(index)}>
          <span className="option-number">{item.number}</span><span className="option-name">{item.name}</span><span className="option-icon"><ArrowUpRight size={18}/></span>
        </button>)}
        <p className="experience-note">And more ways to play, from interactive sports to arcade experiences.</p>
        <a className="all-products" href="/experiences">EXPLORE ALL EXPERIENCES <ArrowUpRight size={17}/></a>
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
      <div className="solution-actions"><a className="button button-white" href="/solutions">EXPLORE SOLUTIONS <ArrowUpRight size={18}/></a><a className="text-link light-link" href="#contact">START A PROJECT <ArrowRight size={17}/></a></div>
      <span className="concept-caption">CONCEPT VISUAL</span>
    </div>
  </section>;
}

function Contact() {
  return <section className="contact-section page-gutter" id="contact">
    <div className="contact-top"><span>HAVE A SPACE IN MIND?</span><span>LET'S MAKE IT MOVE <ArrowDownRight size={18}/></span></div>
    <div className="contact-main"><h2>LET'S BUILD<br/><span>SOMETHING</span><br/>WORTH PLAYING.</h2><div><p>Tell us about your space, your audience and the experience you want to create.</p><a className="contact-circle" href="mailto:sarah@ljsportstech.com?subject=Let's%20build%20a%20sports%20experience" aria-label="Email LJ Sports Tech about your project"><ArrowUpRight size={34}/></a><a className="contact-email" href="mailto:sarah@ljsportstech.com">sarah@ljsportstech.com <ArrowUpRight size={16}/></a></div></div>
    <SiteFooter />
  </section>;
}

export default function Home() {
  return <main><HomeHero/><Intro/><Experiences/><Solutions/><Contact/></main>;
}
