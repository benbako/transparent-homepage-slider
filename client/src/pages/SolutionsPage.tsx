import { ArrowDown, ArrowRight, ArrowUpRight } from "lucide-react";
import "./solutions-page.css";

const approach = [
  {
    number: "01",
    title: "Start with the idea",
    description:
      "Tell us about your space, your audience and the kind of experience you want to create.",
  },
  {
    number: "02",
    title: "Shape the space",
    description:
      "Explore venue planning and design around your layout, ambitions and opportunities.",
  },
  {
    number: "03",
    title: "Select the equipment",
    description:
      "Explore digital sports simulators and equipment for the experiences you have in mind.",
  },
  {
    number: "04",
    title: "Support the setup",
    description:
      "Move toward opening with installation support for your selected equipment.",
  },
];

const venues = [
  {
    number: "01",
    name: "Family entertainment centers",
    description:
      "Add another dimension of active, social play to a day out.",
  },
  {
    number: "02",
    name: "Sports parks",
    description:
      "Bring digital experiences into a bigger world of sport and movement.",
  },
  {
    number: "03",
    name: "Clubs & gyms",
    description:
      "Explore new ways for members to move, practice and play together.",
  },
  {
    number: "04",
    name: "Schools",
    description:
      "Introduce interactive sport to spaces made for learning and activity.",
  },
];

export default function SolutionsPage() {
  return (
    <main id="top" className="sp-page">
      <section className="sp-hero" aria-labelledby="sp-hero-title">
        <div
          className="sp-hero-image"
          style={{ backgroundImage: "url('/manus-storage/async-images/ciVJSH0vBTVwJK4ZXmXSA9/image-2.webp')" }}
          aria-hidden="true"
        />
        <div className="sp-hero-shade" aria-hidden="true" />
        <div className="sp-hero-grid" aria-hidden="true" />
        <div className="sp-hero-inner sp-gutter">
          <div className="sp-kicker sp-kicker-light">
            <span aria-hidden="true" /> VENUE SOLUTIONS
          </div>
          <h1 id="sp-hero-title">
            GIVE PLAY<br />
            <span>A PLACE</span><br />
            TO THRIVE<span className="sp-period">.</span>
          </h1>
          <p>
            Your idea. Your space. A new way to bring people together through
            sport, technology and play.
          </p>
          <div className="sp-hero-actions">
            <a className="sp-button sp-button-blue" href="/contact">
              START A PROJECT <ArrowUpRight size={18} aria-hidden="true" />
            </a>
            <a className="sp-text-link sp-text-link-light" href="/experiences">
              EXPLORE EXPERIENCES <ArrowRight size={18} aria-hidden="true" />
            </a>
          </div>
        </div>
        <div className="sp-hero-bottom sp-gutter">
          <a href="#approach" className="sp-scroll-link">
            <span><ArrowDown size={14} aria-hidden="true" /></span>
            EXPLORE THE APPROACH
          </a>
          <p>CONCEPT VISUAL · NOT AN ACTUAL INSTALLATION</p>
        </div>
      </section>

      <section className="sp-approach sp-gutter" id="approach" aria-labelledby="sp-approach-title">
        <div className="sp-kicker sp-kicker-dark">
          <span aria-hidden="true" /> THE LJ APPROACH
        </div>
        <div className="sp-approach-intro">
          <h2 id="sp-approach-title">
            FROM IDEA TO<br /><span>OPENING DAY.</span>
          </h2>
          <p>
            Every venue starts with a different ambition. LJ Sports Tech helps
            you navigate the key decisions, from shaping the space to choosing
            equipment and supporting installation.
          </p>
        </div>
        <ol className="sp-steps">
          {approach.map((step) => (
            <li className="sp-step" key={step.number}>
              <span className="sp-step-number">{step.number} /</span>
              <h3>{step.title}</h3>
              <p>{step.description}</p>
            </li>
          ))}
        </ol>
      </section>

      <section className="sp-venues sp-gutter" aria-labelledby="sp-venues-title">
        <div className="sp-venues-head">
          <div>
            <div className="sp-kicker sp-kicker-light">
              <span aria-hidden="true" /> PLACES TO PLAY
            </div>
            <h2 id="sp-venues-title">
              DIFFERENT SPACES.<br /><span>SHARED ENERGY.</span>
            </h2>
          </div>
          <p>
            Whether you are creating a destination or adding something new to
            an existing space, there are many ways to bring play into the mix.
          </p>
        </div>
        <div className="sp-venue-grid">
          {venues.map((venue) => (
            <article className="sp-venue" key={venue.number}>
              <div className="sp-venue-index">
                <span>{venue.number} /</span>
                <ArrowUpRight size={18} aria-hidden="true" />
              </div>
              <h3>{venue.name}</h3>
              <p>{venue.description}</p>
            </article>
          ))}
        </div>
        <div className="sp-venue-bottom">
          <p>FIND THE EXPERIENCES THAT FIT YOUR SPACE.</p>
          <a className="sp-text-link sp-text-link-light" href="/experiences">
            EXPLORE EXPERIENCES <ArrowUpRight size={18} aria-hidden="true" />
          </a>
        </div>
      </section>

      <section className="sp-contact sp-gutter" aria-labelledby="sp-contact-title">
        <div className="sp-contact-top">
          <span>HAVE A SPACE IN MIND?</span>
          <span>LET’S TALK ABOUT WHAT’S POSSIBLE <ArrowUpRight size={17} aria-hidden="true" /></span>
        </div>
        <div className="sp-contact-main">
          <h2 id="sp-contact-title">
            YOUR NEXT MOVE<br /><span>STARTS HERE.</span>
          </h2>
          <div className="sp-contact-copy">
            <p>
              Tell us where you are, the size of your space, your audience and
              the experiences you are considering. We can discuss the next
              steps together.
            </p>
            <a className="sp-button sp-button-dark" href="/contact">
              START A PROJECT <ArrowUpRight size={18} aria-hidden="true" />
            </a>
          </div>
        </div>
      </section>
    </main>
  );
}
