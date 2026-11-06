import { useState } from "react";
import { ArrowDown, ArrowDownRight, ArrowRight, ArrowUpRight } from "lucide-react";
import "./experiences-page.css";

type ExperienceCategory = "Racket" | "Ball" | "Adventure";
type ExperienceFilter = "All" | ExperienceCategory;

type Experience = {
  number: string;
  name: string;
  category: ExperienceCategory;
  descriptor: string;
  description: string;
  image: string;
  alt: string;
};

const experiences: Experience[] = [
  {
    number: "01",
    name: "Tennis",
    category: "Racket",
    descriptor: "THE COURT, REIMAGINED",
    description: "Bring the energy of the court indoors with interactive tennis for play, practice and friendly competition.",
    image: "/assets/tennis-real.webp",
    alt: "LJ Sports Tech digital tennis simulator with a projected court",
  },
  {
    number: "02",
    name: "Football",
    category: "Ball",
    descriptor: "EVERY SHOT COUNTS",
    description: "Give guests a place to kick, aim and challenge each other in an interactive football experience.",
    image: "/assets/football.webp",
    alt: "LJ Sports Tech interactive football simulator in an enclosed playing area",
  },
  {
    number: "03",
    name: "Skiing",
    category: "Adventure",
    descriptor: "FIND YOUR SLOPE",
    description: "Bring a taste of the slopes indoors with a simulator that puts movement at the heart of the adventure.",
    image: "/assets/skiing.webp",
    alt: "A player using an LJ Sports Tech skiing simulator",
  },
  {
    number: "04",
    name: "Pickleball",
    category: "Racket",
    descriptor: "A NEW WAY TO RALLY",
    description: "Introduce a lively racket sport to your venue with an interactive pickleball experience made for indoor play.",
    image: "/assets/pickleball.webp",
    alt: "Product illustration of an LJ Sports Tech pickleball simulator",
  },
];

const filters: ExperienceFilter[] = ["All", "Racket", "Ball", "Adventure"];
const catalogueUrl = "https://www.ljsportstech.com/Sports-Simulator-pl45801697.html";

function ExperienceCard({ experience }: { experience: Experience }) {
  const inquiry = `mailto:sarah@ljsportstech.com?subject=${encodeURIComponent(`Inquiry about ${experience.name} simulator`)}`;

  return (
    <article className="expPage-card">
      <div className="expPage-cardImage">
        <img src={experience.image} alt={experience.alt} loading="lazy" />
        <div className="expPage-cardImageShade" aria-hidden="true" />
        <span className="expPage-cardNumber">{experience.number} / 04</span>
        <span className="expPage-cardCategory">{experience.category} sports</span>
      </div>
      <div className="expPage-cardBody">
        <div className="expPage-cardTitleRow">
          <div>
            <p className="expPage-cardDescriptor">{experience.descriptor}</p>
            <h3>{experience.name}</h3>
          </div>
          <ArrowUpRight className="expPage-cardArrow" size={25} strokeWidth={1.5} aria-hidden="true" />
        </div>
        <p className="expPage-cardDescription">{experience.description}</p>
        <a className="expPage-cardLink" href={inquiry}>
          ASK ABOUT {experience.name.toUpperCase()} <ArrowRight size={17} aria-hidden="true" />
        </a>
      </div>
    </article>
  );
}

export default function ExperiencesPage() {
  const [filter, setFilter] = useState<ExperienceFilter>("All");
  const visibleExperiences = filter === "All"
    ? experiences
    : experiences.filter((experience) => experience.category === filter);

  return (
    <main id="top" className="expPage">
      <section className="expPage-hero" aria-labelledby="expPage-title">
        <div className="expPage-heroImage" aria-hidden="true">
          <img src="/assets/skiing.webp" alt="" />
        </div>
        <div className="expPage-heroOverlay" aria-hidden="true" />
        <div className="expPage-heroGrid" aria-hidden="true" />
        <div className="expPage-heroContent expPage-gutter">
          <p className="expPage-kicker"><span /> THE EXPERIENCE COLLECTION</p>
          <h1 id="expPage-title">MAKE ROOM<br />FOR <span>PLAY.</span></h1>
          <div className="expPage-heroBottomContent">
            <p>From the court to the slopes, discover sports experiences that bring people and spaces to life.</p>
            <a className="expPage-primaryButton" href="#expPage-collection">
              EXPLORE EXPERIENCES <ArrowDown size={18} aria-hidden="true" />
            </a>
          </div>
        </div>
        <div className="expPage-heroFoot expPage-gutter">
          <span>SPORTS <i>×</i> TECHNOLOGY <i>×</i> PLAY</span>
          <span className="expPage-heroFootRight">LJ SPORTS TECH <ArrowDownRight size={17} aria-hidden="true" /></span>
        </div>
      </section>

      <section className="expPage-intro expPage-gutter" aria-labelledby="expPage-introTitle">
        <div className="expPage-sectionLabel"><span /> MADE FOR MOVEMENT</div>
        <div className="expPage-introGrid">
          <h2 id="expPage-introTitle">REAL SPORT.<br /><span>NEW SETTINGS.</span></h2>
          <div className="expPage-introCopy">
            <p>Great play belongs in more places. Our interactive sports simulators bring the thrill of movement into entertainment venues, sports centres and beyond.</p>
            <a href="#expPage-collection">FIND YOUR EXPERIENCE <ArrowDownRight size={17} aria-hidden="true" /></a>
          </div>
        </div>
      </section>

      <section className="expPage-collection expPage-gutter" id="expPage-collection" aria-labelledby="expPage-collectionTitle">
        <div className="expPage-collectionTop">
          <div>
            <div className="expPage-sectionLabel expPage-sectionLabelLight"><span /> EXPLORE THE EXPERIENCES</div>
            <h2 id="expPage-collectionTitle">PICK YOUR<br /><span>PLAY.</span></h2>
          </div>
          <p>Different sports. Different stories. Find the experience that fits your space and the people you welcome.</p>
        </div>

        <div className="expPage-filterBar">
          <div className="expPage-filters" role="group" aria-label="Filter experiences by category">
            {filters.map((option) => (
              <button
                key={option}
                type="button"
                className={`expPage-filter${filter === option ? " expPage-filterActive" : ""}`}
                aria-pressed={filter === option}
                onClick={() => setFilter(option)}
              >
                {option}
              </button>
            ))}
          </div>
          <p className="expPage-resultCount" aria-live="polite" aria-atomic="true">
            SHOWING {visibleExperiences.length} {visibleExperiences.length === 1 ? "EXPERIENCE" : "EXPERIENCES"}
          </p>
        </div>

        <div className="expPage-cardGrid" id="expPage-results">
          {visibleExperiences.map((experience) => <ExperienceCard key={experience.name} experience={experience} />)}
        </div>

        <div className="expPage-catalogue">
          <div>
            <p className="expPage-catalogueEyebrow">LOOKING FOR MORE?</p>
            <p>There are more ways to play.</p>
          </div>
          <a href={catalogueUrl} target="_blank" rel="noreferrer">
            VIEW THE FULL CATALOGUE <ArrowUpRight size={18} aria-hidden="true" />
          </a>
        </div>
      </section>

      <section className="expPage-project expPage-gutter" aria-labelledby="expPage-projectTitle">
        <div className="expPage-projectTop">
          <div className="expPage-sectionLabel"><span /> BUILT AROUND YOUR SPACE</div>
          <ArrowDownRight size={23} strokeWidth={1.5} aria-hidden="true" />
        </div>
        <div className="expPage-projectGrid">
          <h2 id="expPage-projectTitle">LET'S MAKE<br /><span>PLAY HAPPEN.</span></h2>
          <div className="expPage-projectCopy">
            <p>Have a venue or an idea in mind? Talk to our team about the right experiences for your space, from selection and planning to installation support.</p>
            <a className="expPage-darkButton" href="/contact">START A CONVERSATION <ArrowUpRight size={18} aria-hidden="true" /></a>
            <a className="expPage-email" href="mailto:sarah@ljsportstech.com">sarah@ljsportstech.com <ArrowUpRight size={15} aria-hidden="true" /></a>
          </div>
        </div>
      </section>
    </main>
  );
}
