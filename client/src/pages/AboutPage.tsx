import { ArrowDownRight, ArrowRight, ArrowUpRight } from "lucide-react";
import AboutExpansion from "@/components/AboutExpansion";
import AboutDesignScene from "@/components/AboutDesignScene";
import "./company-pages.css";

const capabilities = [
  {
    number: "01",
    title: "Digital sports simulators",
    description: "Interactive equipment that brings sports and digital technology together.",
  },
  {
    number: "02",
    title: "Venue planning",
    description: "Planning and design support for spaces built around interactive play.",
  },
  {
    number: "03",
    title: "Customization",
    description: "Equipment and venue solutions shaped around the needs of a project.",
  },
  {
    number: "04",
    title: "Installation support",
    description: "Practical support for bringing equipment into your space.",
  },
];

export default function AboutPage() {
  return (
    <main id="top" className="company-page">
      <section className="cp-about-hero cp-gutter" aria-labelledby="about-title">
        <div className="cp-about-hero__copy">
          <div className="cp-eyebrow"><span aria-hidden="true" /> ABOUT LJ SPORTS TECH</div>
          <h1 id="about-title">REAL SPORT.<br /><span>DIGITAL</span><br />PLAY<span className="cp-blue">.</span></h1>
          <p>We bring movement and technology together to make more room for play.</p>
          <a className="cp-text-link cp-text-link--light" href="#our-story">
            OUR STORY <ArrowDownRight size={18} aria-hidden="true" />
          </a>
        </div>
        <figure className="cp-about-hero__figure">
          <div className="cp-about-hero__image">
            <img src="/assets/company.webp" alt="Exterior of the Liangjia Technology building" />
          </div>
          <figcaption><span>LIANGJIA SPORTS TECHNOLOGY</span><span>GUANGZHOU, CHINA</span></figcaption>
        </figure>
        <div className="cp-hero-bottom"><span>SPORTS × TECHNOLOGY × PLAY</span><span>ABOUT / LJ SPORTS TECH</span></div>
      </section>

      <section id="our-story" className="cp-story cp-gutter" aria-labelledby="story-title">
        <div className="cp-section-label"><span aria-hidden="true" /> OUR STORY</div>
        <div className="cp-story__grid">
          <h2 id="story-title">FROM AN IDEA<br /><span>TO A WORLD<br />OF PLAY.</span></h2>
          <div className="cp-story__copy">
            <p>Liangjia Sports Technology (Guangzhou) Co., Ltd. develops, manufactures and sells digital interactive sports equipment.</p>
            <p>Founded in Shanghai in 2018, the company relocated to Guangzhou in 2020. Today, our work connects sports simulation equipment with the spaces and people it is made for.</p>
          </div>
        </div>
        <div className="cp-timeline" aria-label="Company history">
          <div><span>2018</span><strong>SHANGHAI</strong><p>Founded in Shanghai</p></div>
          <div><span>2020</span><strong>GUANGZHOU</strong><p>Relocated to Guangzhou</p></div>
        </div>
      </section>

      <AboutExpansion scene={<AboutDesignScene />} />

      <section className="cp-capabilities cp-gutter" aria-labelledby="capabilities-title">
        <div className="cp-capabilities__head">
          <div>
            <div className="cp-eyebrow"><span aria-hidden="true" /> WHAT WE DO</div>
            <h2 id="capabilities-title">FROM EQUIPMENT<br /><span>TO EXPERIENCE.</span></h2>
          </div>
          <p>Explore the capabilities behind an interactive sports space.</p>
        </div>
        <div className="cp-capability-list">
          {capabilities.map(item => (
            <div className="cp-capability" key={item.number}>
              <span className="cp-capability__number">{item.number} /</span>
              <h3>{item.title}</h3>
              <p>{item.description}</p>
              <ArrowUpRight size={21} aria-hidden="true" />
            </div>
          ))}
        </div>
        <a className="cp-text-link cp-text-link--light cp-capabilities__link" href="/solutions">
          EXPLORE SOLUTIONS <ArrowRight size={18} aria-hidden="true" />
        </a>
      </section>

      <section className="cp-about-cta cp-gutter" aria-labelledby="about-cta-title">
        <div className="cp-about-cta__top"><span>HAVE A PROJECT IN MIND?</span><ArrowDownRight size={19} aria-hidden="true" /></div>
        <div className="cp-about-cta__content">
          <h2 id="about-cta-title">LET'S MAKE<br /><span>SPACE FOR PLAY.</span></h2>
          <div><p>Tell us about your space and the experience you want to create.</p><a className="cp-button cp-button--blue" href="/contact">GET IN TOUCH <ArrowUpRight size={18} aria-hidden="true" /></a></div>
        </div>
      </section>
    </main>
  );
}
