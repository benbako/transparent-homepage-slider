import { ArrowRight, ArrowUpRight } from "lucide-react";
import ProductShowroom, { type ProductShowroomItem } from "./ProductShowroom";
import "./home-catalogue.css";

type HomeCatalogueProps = {
  items: ProductShowroomItem[];
  selected: number;
  onSelect: (index: number) => void;
};

/** The parent owns selection so the cards, showroom and named controls stay in sync. */
export default function HomeCatalogue({ items, selected, onSelect }: HomeCatalogueProps) {
  return (
    <section className="home-catalogue" id="experiences" aria-labelledby="home-catalogue-title">
      <div className="home-catalogue__collection">
        <div className="home-catalogue__inner">
          <header className="home-catalogue__intro">
            <p className="home-catalogue__eyebrow">LJ SPORTS TECH EXPERIENCES</p>
            <h2 id="home-catalogue-title">Find your way to play.</h2>
            <p>From the court to the slopes, explore sports experiences for play, practice and friendly competition.</p>
          </header>

          <div className="home-catalogue__grid">
            {items.slice(0, 4).map((item, index) => (
              <article className="home-catalogue__card" key={`${item.number}-${item.name}`}>
                <div className="home-catalogue__image">
                  <img src={item.image} alt={item.alt} loading="lazy" decoding="async" />
                </div>
                <div className="home-catalogue__card-body">
                  <p className="home-catalogue__category">{item.category}{item.imageCaption ? " · ILLUSTRATION" : ""}</p>
                  <h3>{item.name}</h3>
                  <a
                    className="home-catalogue__card-link"
                    href="#showroom"
                    aria-label={`Explore ${item.name} in the showroom`}
                    onClick={() => onSelect(index)}
                  >
                    EXPLORE <ArrowRight size={16} aria-hidden="true" />
                  </a>
                </div>
              </article>
            ))}
          </div>
        </div>
      </div>

      <div className="home-catalogue__showroom" id="showroom" aria-labelledby="home-catalogue-showroom-title">
        <div className="home-catalogue__inner">
          <div className="home-catalogue__showroom-heading">
            <div>
              <p className="home-catalogue__eyebrow">TAKE A CLOSER LOOK</p>
              <h2 id="home-catalogue-showroom-title">Explore the experiences.</h2>
            </div>
            <p>Choose an experience to see more.</p>
          </div>

          <div className="home-catalogue__showroom-layout">
            <ProductShowroom items={items} selected={selected} onSelect={onSelect} />
            <div className="home-catalogue__selector" role="group" aria-label="Choose a sports experience">
              <p className="home-catalogue__selector-label">SELECT AN EXPERIENCE</p>
              {items.map((item, index) => (
                <button
                  key={`${item.number}-${item.name}`}
                  type="button"
                  className={`experience-option home-catalogue__option${selected === index ? " is-active" : ""}`}
                  aria-pressed={selected === index}
                  onClick={() => onSelect(index)}
                >
                  <span className="home-catalogue__option-number">{item.number}</span>
                  <span className="home-catalogue__option-name">{item.name}</span>
                  <ArrowUpRight size={19} aria-hidden="true" />
                </button>
              ))}
              <a className="all-products home-catalogue__all-link" href="/experiences">
                EXPLORE ALL EXPERIENCES <ArrowUpRight size={17} aria-hidden="true" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
