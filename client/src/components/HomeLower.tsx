import { ArrowRight, ArrowUpRight, Dumbbell, GraduationCap, Layers3, Map, Trophy, UsersRound, Wrench } from "lucide-react";
import "./home-lower-reference.css";

const venues = [
  {
    name: "Family entertainment centers",
    description: "Add another dimension of active, social play to a day out.",
    image: "/manus-storage/async-images/ciVJSH0vBTVwJK4ZXmXSA9/image-2.webp",
    alt: "Concept illustration of an interactive sports venue",
    caption: "CONCEPT VISUAL · NOT AN ACTUAL INSTALLATION",
  },
  {
    name: "Sports parks",
    description: "Bring digital experiences into a bigger world of sport and movement.",
    image: "/assets/football.webp",
    alt: "LJ Sports Tech interactive football simulator",
    caption: "LJ FOOTBALL SIMULATOR",
  },
  {
    name: "Clubs & gyms",
    description: "Explore new ways for members to move, practice and play together.",
    image: "/assets/tennis-real.webp",
    alt: "LJ Sports Tech indoor digital tennis simulator",
    caption: "LJ TENNIS SIMULATOR",
  },
];

const capabilities = [
  {
    icon: Map,
    title: "Plan your space",
    description: "Explore venue planning and design around your layout and ambitions.",
  },
  {
    icon: Layers3,
    title: "Choose your experiences",
    description: "Discover interactive sports equipment for the way you want to play.",
  },
  {
    icon: Wrench,
    title: "Support your setup",
    description: "Discuss installation support for your selected equipment.",
  },
];

const audiences = [
  { icon: UsersRound, label: "Family entertainment centers" },
  { icon: Trophy, label: "Sports parks" },
  { icon: Dumbbell, label: "Clubs & gyms" },
  { icon: GraduationCap, label: "Schools" },
];

export default function HomeLower() {
  return (
    <div className="home-lower">
      <section id="solutions" className="hl-solutions hl-section" aria-labelledby="hl-solutions-title">
        <div className="hl-container">
          <div className="hl-heading hl-heading--center">
            <p className="hl-eyebrow">SPACES MADE FOR PLAY</p>
            <h2 id="hl-solutions-title">Solutions for <span>every kind of space.</span></h2>
            <p>From a single experience to a bigger idea, discover ways to bring sport and play together.</p>
          </div>

          <div className="hl-solution-grid">
            {venues.map((venue) => (
              <article className="hl-solution-card" key={venue.name}>
                <div className="hl-solution-image">
                  <img src={venue.image} alt={venue.alt} loading="lazy" />
                  <span>{venue.caption}</span>
                </div>
                <div className="hl-solution-copy">
                  <h3>{venue.name}</h3>
                  <p>{venue.description}</p>
                  <a href="/solutions" aria-label={`Explore solutions for ${venue.name}`}>
                    EXPLORE SOLUTIONS <ArrowRight size={16} aria-hidden="true" />
                  </a>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="hl-promo" aria-labelledby="hl-promo-title">
        <div className="hl-promo-shape hl-promo-shape--one" aria-hidden="true" />
        <div className="hl-promo-shape hl-promo-shape--two" aria-hidden="true" />
        <div className="hl-container hl-promo-inner">
          <div>
            <p className="hl-eyebrow hl-eyebrow--light">YOUR SPACE. YOUR IDEA.</p>
            <h2 id="hl-promo-title">Let's make more<br /><span>room for play.</span></h2>
            <p>Tell us about your space and the experience you want to create.</p>
          </div>
          <a className="hl-button hl-button--orange" href="/contact">
            START A PROJECT <ArrowUpRight size={18} aria-hidden="true" />
          </a>
        </div>
      </section>

      <section className="hl-benefits hl-section" aria-labelledby="hl-benefits-title">
        <div className="hl-container">
          <div className="hl-heading hl-heading--center">
            <p className="hl-eyebrow">FROM IDEA TO OPENING DAY</p>
            <h2 id="hl-benefits-title">A little help at <span>every step.</span></h2>
            <p>Explore the capabilities behind an interactive sports space.</p>
          </div>
          <div className="hl-benefit-grid">
            {capabilities.map(({ icon: Icon, title, description }) => (
              <article className="hl-benefit" key={title}>
                <div className="hl-benefit-icon"><Icon size={26} strokeWidth={1.6} aria-hidden="true" /></div>
                <h3>{title}</h3>
                <p>{description}</p>
              </article>
            ))}
          </div>

          <div className="hl-audiences" aria-labelledby="hl-audiences-title">
            <div className="hl-heading hl-heading--center">
              <p className="hl-eyebrow">PLACES TO PLAY</p>
              <h2 id="hl-audiences-title">Different spaces. <span>Shared energy.</span></h2>
            </div>
            <div className="hl-audience-grid">
              {audiences.map(({ icon: Icon, label }) => (
                <div className="hl-audience" key={label}>
                  <Icon size={25} strokeWidth={1.6} aria-hidden="true" />
                  <span>{label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section id="about" className="hl-story" aria-labelledby="hl-story-title">
        <div className="hl-container hl-story-grid">
          <figure className="hl-story-figure">
            <img src="/assets/company.webp" alt="Exterior of the Liangjia Technology building" loading="lazy" />
            <figcaption>LIANGJIA TECHNOLOGY BUILDING · GUANGZHOU, CHINA</figcaption>
          </figure>
          <div className="hl-story-copy">
            <p className="hl-eyebrow hl-eyebrow--light">ABOUT LJ SPORTS TECH</p>
            <h2 id="hl-story-title">Real sport.<br /><span>Digital play.</span></h2>
            <p>Liangjia Sports Technology (Guangzhou) Co., Ltd. develops, manufactures and sells digital interactive sports equipment.</p>
            <p>Founded in Shanghai in 2018, the company relocated to Guangzhou in 2020. Today, our work connects sports simulation equipment with the spaces and people it is made for.</p>
            <a className="hl-button hl-button--orange" href="/about">
              OUR STORY <ArrowUpRight size={18} aria-hidden="true" />
            </a>
          </div>
        </div>
      </section>

      <section id="contact" className="hl-contact" aria-labelledby="hl-contact-title">
        <div className="hl-container hl-contact-grid">
          <div className="hl-contact-copy">
            <p className="hl-eyebrow hl-eyebrow--light">LET'S TALK</p>
            <h2 id="hl-contact-title">Have a space<br /><span>in mind?</span></h2>
            <p>Tell us where you are, the size of your space, your audience and the experiences you are considering.</p>
            <a className="hl-contact-link" href="/contact">MORE WAYS TO CONTACT US <ArrowRight size={17} aria-hidden="true" /></a>
          </div>
          <div className="hl-contact-card" aria-label="Direct contact options">
            <p>START A CONVERSATION</p>
            <a href="mailto:business@ljsportstech.com">
              <span><small>EMAIL</small><strong>business@ljsportstech.com</strong></span>
              <ArrowUpRight size={20} aria-hidden="true" />
            </a>
            <a href="tel:+8619927435575">
              <span><small>PHONE</small><strong>+86 199 2743 5575</strong></span>
              <ArrowUpRight size={20} aria-hidden="true" />
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
