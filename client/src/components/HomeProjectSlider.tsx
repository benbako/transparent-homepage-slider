import { useId, useRef, useState, type TouchEvent } from "react";
import { ArrowLeft, ArrowRight, ArrowUpRight } from "lucide-react";
import "./home-project-slider.css";

export type ProjectSlide = {
  category: string;
  title: string;
  description: string;
  image: string;
  alt: string;
  caption: string;
  href: string;
  cta: string;
};

export default function HomeProjectSlider({ slides }: { slides: ProjectSlide[] }) {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [keyboardNavigation, setKeyboardNavigation] = useState(false);
  const touchStart = useRef<{ x: number; y: number } | null>(null);
  const carouselId = useId();
  const titleId = useId();
  const count = slides.length;
  // Keep the selection valid if the supplied list changes after mount.
  const activeIndex = count ? ((selectedIndex % count) + count) % count : 0;
  const activeSlide = slides[activeIndex];

  function moveBy(direction: number) {
    if (count < 2) return;
    setSelectedIndex((current) => (((current % count) + count) % count + direction + count) % count);
  }

  function handleTouchStart(event: TouchEvent<HTMLDivElement>) {
    if (event.touches.length !== 1) {
      touchStart.current = null;
      return;
    }
    touchStart.current = { x: event.touches[0].clientX, y: event.touches[0].clientY };
  }

  function handleTouchEnd(event: TouchEvent<HTMLDivElement>) {
    const start = touchStart.current;
    touchStart.current = null;
    if (!start || event.touches.length !== 0 || event.changedTouches.length !== 1) return;
    const deltaX = event.changedTouches[0].clientX - start.x;
    const deltaY = event.changedTouches[0].clientY - start.y;
    // No preventDefault: ordinary vertical scrolling and pinch zoom remain native.
    if (Math.abs(deltaX) >= 50 && Math.abs(deltaX) > Math.abs(deltaY) * 1.5) {
      setKeyboardNavigation(false);
      moveBy(deltaX < 0 ? 1 : -1);
    }
  }

  if (!activeSlide) return null;

  const formatNumber = (number: number) => String(number).padStart(2, "0");

  return (
    <section id="projects" className="home-project-slider" aria-labelledby={titleId}>
      <div className="home-project-slider__inner">
        <header className="home-project-slider__intro">
          <div>
            <p className="home-project-slider__eyebrow">PROJECT STORIES &amp; INSPIRATION</p>
            <h2 id={titleId}>Imagine what <span>play can be.</span></h2>
          </div>
          <p className="home-project-slider__intro-copy">
            Explore a customer story and ideas for active spaces. Discover ways interactive sport could fit your own.
          </p>
        </header>

        <div
          className={`home-project-slider__carousel${keyboardNavigation ? " is-keyboard" : ""}`}
          role="region"
          aria-roledescription="carousel"
          aria-label="Project inspiration"
          id={carouselId}
        >
          <div className="home-project-slider__card">
            <div
              className="home-project-slider__visual"
              onTouchStart={handleTouchStart}
              onTouchEnd={handleTouchEnd}
              onTouchCancel={() => { touchStart.current = null; }}
            >
              {slides.map((slide, index) => (
                <figure
                  className={`home-project-slider__figure${index === activeIndex ? " is-active" : ""}`}
                  key={`${slide.image}-${index}`}
                  aria-hidden={index !== activeIndex}
                  role="group"
                  aria-roledescription="slide"
                  aria-label={`${index + 1} of ${count}`}
                >
                  <img src={slide.image} alt={slide.alt} loading="lazy" decoding="async" draggable={false} />
                  <figcaption>{slide.caption}</figcaption>
                </figure>
              ))}
            </div>

            <div className="home-project-slider__copy">
              <div className="home-project-slider__copy-top">
                <p className="home-project-slider__category">{activeSlide.category}</p>
                <p className="home-project-slider__counter" aria-hidden="true">
                  <span>{formatNumber(activeIndex + 1)}</span><span className="home-project-slider__counter-divider">/</span>{formatNumber(count)}
                </p>
              </div>
              <div className="home-project-slider__copy-main">
                <span className="home-project-slider__accent" aria-hidden="true" />
                <h3>{activeSlide.title}</h3>
                <p>{activeSlide.description}</p>
                <a className="home-project-slider__link" href={activeSlide.href}>
                  {activeSlide.cta}<ArrowUpRight size={18} aria-hidden="true" />
                </a>
              </div>
              <p className="home-project-slider__copy-foot" aria-hidden="true">IDEAS FOR YOUR SPACE <span>↗</span></p>
            </div>
          </div>

          <div className="home-project-slider__navigation">
            <div className="home-project-slider__pagination" role="group" aria-label="Choose project inspiration">
              {slides.map((slide, index) => (
                <button
                  className={`home-project-slider__page${index === activeIndex ? " is-active" : ""}`}
                  key={`${slide.image}-${index}`}
                  type="button"
                  aria-label={`Show project inspiration ${index + 1}: ${slide.title}`}
                  aria-current={index === activeIndex ? "true" : undefined}
                  aria-controls={carouselId}
                  onClick={(event) => {
                    setKeyboardNavigation(event.detail === 0);
                    setSelectedIndex(index);
                  }}
                >
                  <span aria-hidden="true">{formatNumber(index + 1)}</span>
                </button>
              ))}
            </div>
            <div className="home-project-slider__arrows" role="group" aria-label="Project inspiration navigation">
              <button type="button" aria-label="Previous project inspiration" aria-controls={carouselId} onClick={(event) => { setKeyboardNavigation(event.detail === 0); moveBy(-1); }} disabled={count < 2}>
                <ArrowLeft size={20} aria-hidden="true" />
              </button>
              <button type="button" aria-label="Next project inspiration" aria-controls={carouselId} onClick={(event) => { setKeyboardNavigation(event.detail === 0); moveBy(1); }} disabled={count < 2}>
                <ArrowRight size={20} aria-hidden="true" />
              </button>
            </div>
          </div>
          <p className="home-project-slider__sr-only" role="status" aria-live="polite" aria-atomic="true">
            Project inspiration {activeIndex + 1} of {count}: {activeSlide.title}
          </p>
        </div>
      </div>
    </section>
  );
}
