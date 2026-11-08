import { useId } from "react";
import "./about-gallery.css";

type GalleryImage = {
  src: string;
  alt: string;
  thumbnail?: string;
};

type AboutGalleryProps = {
  factoryImages: Array<GalleryImage>;
  certificateGroups: Array<{
    label: string;
    images: Array<GalleryImage>;
  }>;
};

export function AboutGalleryNav() {
  return (
    <nav className="about-gallery-nav" aria-label="About page sections">
      <span className="about-gallery-nav__label">ON THIS PAGE</span>
      <ul>
        <li><a href="#our-story">OUR STORY</a></li>
        <li><a href="#factory">FACTORY</a></li>
        <li><a href="#certificates">CERTIFICATES</a></li>
      </ul>
    </nav>
  );
}

function ImageCard({ image, kind, index }: { image: GalleryImage; kind: "factory" | "document"; index?: number }) {
  return (
    <li className={`about-gallery-card about-gallery-card--${kind}`}>
      <a href={image.src} target="_blank" rel="noopener noreferrer">
        <span className="about-gallery-card__frame">
          <img src={image.thumbnail ?? image.src} alt={image.alt} loading="lazy" decoding="async" />
        </span>
        <span className="about-gallery-card__action">
          <span>{kind === "factory" && index !== undefined && <span className="about-gallery-card__number" aria-hidden="true">{String(index + 1).padStart(2, "0")} / </span>}{kind === "factory" ? "VIEW PHOTO" : "VIEW DOCUMENT"}<span className="about-gallery-sr-only"> (opens in a new tab)</span></span>
          <span aria-hidden="true">↗</span>
        </span>
      </a>
    </li>
  );
}

export default function AboutGallery({ factoryImages, certificateGroups }: AboutGalleryProps) {
  const groupId = useId();

  return (
    <div className="about-gallery">
      <section id="factory" className="about-gallery-section about-gallery-factory" aria-labelledby="about-gallery-factory-title">
        <span id="jiBqrKnjnrmioijnonj" className="about-gallery-legacy-anchor" aria-hidden="true" />
        <div className="about-gallery-section__head">
          <div>
            <div className="about-gallery-kicker"><span aria-hidden="true" /> FACTORY</div>
            <h2 id="about-gallery-factory-title">A CLOSER LOOK<br /><span>AT THE FACTORY.</span></h2>
          </div>
          <p>Explore the spaces where our equipment comes together. Select a photo to view it full size.</p>
        </div>
        <ul className="about-gallery-grid about-gallery-grid--factory" aria-label="Factory images">
          {factoryImages.map((image, index) => (
            <ImageCard key={`${image.src}-${index}`} image={image} kind="factory" index={index} />
          ))}
        </ul>
      </section>

      <section id="certificates" className="about-gallery-section about-gallery-documents" aria-labelledby="about-gallery-documents-title">
        <span id="jiBqrKnjnrmioiknmij" className="about-gallery-legacy-anchor" aria-hidden="true" />
        <div className="about-gallery-section__head">
          <div>
            <div className="about-gallery-kicker"><span aria-hidden="true" /> CERTIFICATES</div>
            <h2 id="about-gallery-documents-title">CERTIFICATES<br /><span>AND PATENTS.</span></h2>
          </div>
          <p>Select a document to view it full size. <a href="/contact">Need help reading a document? Contact us.</a></p>
        </div>
        <div className="about-gallery-groups">
          {certificateGroups.map((group, groupIndex) => (
            <section className="about-gallery-group" aria-labelledby={`${groupId}-group-${groupIndex}`} key={`${group.label}-${groupIndex}`}>
              <div className="about-gallery-group__heading">
                <h3 id={`${groupId}-group-${groupIndex}`}>{group.label}</h3>
              </div>
              <ul className="about-gallery-grid about-gallery-grid--documents">
                {group.images.map((image, imageIndex) => (
                  <ImageCard key={`${image.src}-${imageIndex}`} image={image} kind="document" />
                ))}
              </ul>
            </section>
          ))}
        </div>
      </section>
    </div>
  );
}
