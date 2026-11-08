import { useState } from "react";
import { ArrowDown, ArrowRight, ArrowUpRight } from "lucide-react";
import "./discover-page.css";

type ShowcaseScene = {
  id: string;
  number: string;
  label: string;
  heading: string;
  description: string;
  image: string;
  alt: string;
};

const showcaseScenes: ShowcaseScene[] = [
  {
    id: "together",
    number: "01",
    label: "Play together",
    heading: "A little friendly competition.",
    description: "Bring people together around the kind of play that makes everyone want another turn.",
    image: "/assets/about-user/group-play.webp",
    alt: "Illustrative image of a group playing an interactive ball game indoors",
  },
  {
    id: "tennis",
    number: "02",
    label: "Find your rally",
    heading: "The court is calling.",
    description: "Make room for the rhythm of a rally, whether it’s a first swing or a familiar game.",
    image: "/assets/about-user/tennis.webp",
    alt: "Illustrative image of a tennis player swinging in front of a digital court",
  },
  {
    id: "multi",
    number: "03",
    label: "Mix it up",
    heading: "More ways to move.",
    description: "Imagine a space where different sports and different players can find their own kind of fun.",
    image: "/assets/about-user/multi-sport.webp",
    alt: "Illustrative image of a player beside screens showing several digital sports",
  },
];

const productHighlights = [
  {
    number: "01",
    name: "Tennis",
    detail: "Rally indoors",
    image: "/assets/tennis-real.webp",
    alt: "LJ Sports Tech digital tennis simulator with a projected court",
    href: "/Tennis-Simulator-pl43801697.html",
  },
  {
    number: "02",
    name: "Football",
    detail: "Take your shot",
    image: "/assets/football.webp",
    alt: "LJ Sports Tech interactive football simulator in an enclosed playing area",
    href: "/Interactive-Football-Soccer-Simulator-Machine-pd519549738.html",
  },
  {
    number: "03",
    name: "Skiing",
    detail: "Find your slope",
    image: "/assets/skiing.webp",
    alt: "A player using an LJ Sports Tech skiing simulator",
    href: "/Skiing-Simulator-Machine-Premium-Virtual-Ski-Experience-pd577329738.html",
  },
];

export default function DiscoverPage() {
  const [selectedScene, setSelectedScene] = useState(0);
  const scene = showcaseScenes[selectedScene];

  return (
    <main id="top" className="discover">
      <section className="discover-hero" aria-labelledby="discover-title">
        <img
          className="discover-hero__image"
          src="/assets/about-user/tennis.webp"
          alt="Illustrative image of a tennis player in an indoor digital sports space"
          loading="eager"
          fetchPriority="high"
        />
        <div className="discover-hero__shade" aria-hidden="true" />
        <div className="discover-hero__content discover-gutter">
          <p className="discover-kicker discover-kicker--light"><span /> LJ SPORTS TECH / EXPERIENCES</p>
          <h1 id="discover-title">MAKE<br />SPACE<br /><em>FOR PLAY.</em></h1>
          <p className="discover-hero__intro">Sports, technology and imagination come together to bring new energy to indoor play.</p>
          <a className="discover-button discover-button--orange" href="#discover-showcase">
            EXPLORE THE POSSIBILITIES <ArrowDown size={17} aria-hidden="true" />
          </a>
        </div>
        <div className="discover-hero__bottom discover-gutter">
          <span>MADE FOR THE MOMENT</span>
          <span>ILLUSTRATIVE VISUAL</span>
        </div>
      </section>

      <section className="discover-intro discover-gutter" aria-labelledby="discover-intro-title">
        <div className="discover-intro__label discover-kicker"><span /> A DIFFERENT KIND OF PLAY</div>
        <div className="discover-intro__grid">
          <h2 id="discover-intro-title">The joy of sport.<br /><em>A whole new setting.</em></h2>
          <div className="discover-intro__copy">
            <p>From a first try to a friendly challenge, LJ Sports Tech creates interactive sports experiences that invite people to get moving.</p>
            <a className="discover-text-link" href="/experiences">DISCOVER EXPERIENCES <ArrowUpRight size={17} aria-hidden="true" /></a>
          </div>
        </div>
      </section>

      <section className="discover-showcase discover-gutter" id="discover-showcase" aria-labelledby="discover-showcase-title">
        <div className="discover-showcase__header">
          <div>
            <p className="discover-kicker discover-kicker--light"><span /> IMAGINE THE POSSIBILITIES</p>
            <h2 id="discover-showcase-title">Pick a way<br /><em>to play.</em></h2>
          </div>
          <p className="discover-showcase__lead">Different games. Different moments. One invitation: come play.</p>
        </div>

        <div className="discover-showcase__layout">
          <div className="discover-showcase__visual" id="discover-scene" aria-live="polite" aria-atomic="true">
            <div className="discover-showcase__image-frame">
              <img key={scene.id} src={scene.image} alt={scene.alt} loading="lazy" />
              <span className="discover-showcase__image-label">ILLUSTRATIVE VISUAL</span>
            </div>
            <div className="discover-showcase__caption">
              <span>IDEAS FOR PLAY / {scene.number}</span>
              <span>Illustrative visual.</span>
            </div>
          </div>
          <div className="discover-showcase__side">
            <div className="discover-showcase__side-top">
              <span>CHOOSE YOUR MOMENT</span>
              <span>01 — 03</span>
            </div>
            <div className="discover-showcase__controls" role="group" aria-label="Choose a sports concept">
              {showcaseScenes.map((option, index) => (
                <button
                  className={`discover-showcase__option${selectedScene === index ? " is-selected" : ""}`}
                  type="button"
                  key={option.id}
                  aria-pressed={selectedScene === index}
                  aria-controls="discover-scene"
                  onClick={() => setSelectedScene(index)}
                >
                  <span className="discover-showcase__option-number">{option.number}</span>
                  <span>{option.label}</span>
                  <ArrowUpRight size={19} aria-hidden="true" />
                </button>
              ))}
            </div>
            <div className="discover-showcase__story" aria-live="polite" aria-atomic="true">
              <p className="discover-showcase__story-label">THE FEELING / {scene.number}</p>
              <h3>{scene.heading}</h3>
              <p>{scene.description}</p>
            </div>
          </div>
        </div>
      </section>

      <section className="discover-products discover-gutter" aria-labelledby="discover-products-title">
        <div className="discover-products__header">
          <div>
            <p className="discover-kicker"><span /> FROM IMAGINATION TO PLAY</p>
            <h2 id="discover-products-title">Meet the<br /><em>real thing.</em></h2>
          </div>
          <div className="discover-products__intro">
            <p>Explore a selection of LJ Sports Tech simulators, made for a variety of sports and spaces.</p>
            <a className="discover-text-link" href="/products.html">VIEW ALL PRODUCTS <ArrowUpRight size={17} aria-hidden="true" /></a>
          </div>
        </div>
        <div className="discover-products__grid">
          {productHighlights.map((product) => (
            <a className="discover-product" href={product.href} key={product.name} aria-label={`Explore the ${product.name} simulator`}>
              <div className="discover-product__image">
                <img src={product.image} alt={product.alt} loading="lazy" />
                <span>{product.number} / 03</span>
              </div>
              <div className="discover-product__details">
                <div><p>{product.detail}</p><h3>{product.name}</h3></div>
                <span className="discover-product__arrow"><ArrowUpRight size={20} aria-hidden="true" /></span>
              </div>
            </a>
          ))}
        </div>
        <div className="discover-products__foot">
          <span>SPORTS FOR EVERY KIND OF MOMENT</span>
          <a className="discover-text-link" href="/experiences">EXPLORE ALL EXPERIENCES <ArrowRight size={17} aria-hidden="true" /></a>
        </div>
      </section>

      <section className="discover-venue discover-gutter" aria-labelledby="discover-venue-title">
        <div className="discover-venue__top">
          <p className="discover-kicker discover-kicker--light"><span /> YOUR SPACE, IN PLAY</p>
          <span>SPORT × TECHNOLOGY × PEOPLE</span>
        </div>
        <div className="discover-venue__body">
          <h2 id="discover-venue-title">Big ideas<br /><em>start here.</em></h2>
          <div className="discover-venue__copy">
            <p>Have a space in mind? Let’s explore how interactive sports can fit your vision.</p>
            <div className="discover-venue__actions">
              <a className="discover-button discover-button--orange" href="/contact">LET’S TALK <ArrowUpRight size={17} aria-hidden="true" /></a>
              <a className="discover-venue__link" href="/solutions">EXPLORE SOLUTIONS <ArrowUpRight size={17} aria-hidden="true" /></a>
            </div>
          </div>
        </div>
      </section>

      <section className="discover-stories discover-gutter" id="newsPage-stories" aria-label="LJ Sports Tech news">
        <div><p className="discover-kicker"><span /> KEEP EXPLORING</p><h2>There’s more to the story.</h2></div>
        <a href="/news">VISIT THE NEWS ARCHIVE <ArrowUpRight size={18} aria-hidden="true" /></a>
      </section>
    </main>
  );
}
