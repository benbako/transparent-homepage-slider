import { useEffect, useId, useRef, useState, type TouchEvent } from "react";
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
  const [visitedImages, setVisitedImages] = useState<string[]>(slides[0] ? [slides[0].image] : []);
  const [pendingIndex, setPendingIndex] = useState<number | null>(null);
  const [loadMessage, setLoadMessage] = useState("");
  const [keyboardNavigation, setKeyboardNavigation] = useState(false);
  const touchStart = useRef<{ x: number; y: number } | null>(null);
  const imageRefs = useRef<Array<HTMLImageElement | null>>([]);
  const pending = useRef<{ index: number; image: string; timer: number; decoding: boolean } | null>(null);
  const carouselId = useId();
  const titleId = useId();
  const count = slides.length;
  // Keep the selection valid if the supplied list changes after mount.
  const activeIndex = count ? ((selectedIndex % count) + count) % count : 0;
  const activeSlide = slides[activeIndex];
  const activeRef = useRef(activeIndex);
  const slidesRef = useRef(slides);
  activeRef.current = activeIndex;
  slidesRef.current = slides;

  function cancelPending() {
    if (!pending.current) return;
    window.clearTimeout(pending.current.timer);
    pending.current = null;
    setPendingIndex(null);
  }

  function finishRequest(request: NonNullable<typeof pending.current>, loaded: boolean) {
    if (pending.current !== request) return;
    cancelPending();
    if (slidesRef.current[request.index]?.image !== request.image) {
      setLoadMessage("Project inspirations changed. Please choose again.");
    } else if (loaded) {
      setVisitedImages(previous => previous.includes(request.image) ? previous : [...previous, request.image]);
      activeRef.current = request.index;
      setSelectedIndex(request.index);
      setLoadMessage("");
    } else {
      setVisitedImages(previous => previous.filter(image => image !== request.image));
      setLoadMessage(`Project inspiration ${request.index + 1} could not be loaded. Select it to retry.`);
    }
  }

  function imageReady(request: NonNullable<typeof pending.current>, image: HTMLImageElement) {
    if (pending.current !== request || request.decoding) return;
    if (typeof image.decode !== "function") {
      finishRequest(request, true);
      return;
    }
    request.decoding = true;
    image.decode().then(() => finishRequest(request, true), () => finishRequest(request, false));
  }

  function requestSlide(index: number) {
    if (!count) return;
    const target = ((index % count) + count) % count;
    if (pending.current?.index === target && pending.current.image === slides[target].image) return;
    cancelPending();
    if (target === activeRef.current) {
      setLoadMessage("");
      return;
    }
    const request = { index: target, image: slides[target].image, timer: 0, decoding: false };
    pending.current = request;
    setPendingIndex(target);
    setLoadMessage(`Loading project inspiration ${target + 1}…`);
    request.timer = window.setTimeout(() => finishRequest(request, false), 15000);
    const image = imageRefs.current[target];
    if (image?.getAttribute("src") === request.image && image.complete) {
      if (image.naturalWidth > 0) imageReady(request, image);
      else finishRequest(request, false);
    }
  }

  useEffect(() => {
    if (activeSlide) setVisitedImages(previous => previous.includes(activeSlide.image) ? previous : [...previous, activeSlide.image]);
  }, [activeSlide?.image]);

  useEffect(() => {
    const request = pending.current;
    if (!request) return;
    if (slides[request.index]?.image !== request.image) {
      finishRequest(request, false);
      return;
    }
    const image = imageRefs.current[request.index];
    // An image may have completed from cache before React observed its load event.
    if (image?.getAttribute("src") === request.image && image.complete) {
      if (image.naturalWidth > 0) imageReady(request, image);
      else finishRequest(request, false);
    }
  }, [pendingIndex, slides]);

  useEffect(() => () => {
    if (pending.current) window.clearTimeout(pending.current.timer);
    pending.current = null;
  }, []);

  function moveBy(direction: number) {
    if (count < 2) return;
    requestSlide((pending.current?.index ?? activeRef.current) + direction);
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
                  <img
                    ref={node => { imageRefs.current[index] = node; }}
                    src={index === activeIndex || index === pendingIndex || visitedImages.includes(slide.image) ? slide.image : undefined}
                    alt={slide.alt}
                    loading={index === pendingIndex ? "eager" : "lazy"}
                    decoding="async"
                    draggable={false}
                    onLoad={event => {
                      const request = pending.current;
                      if (request?.index === index && request.image === slide.image && event.currentTarget.naturalWidth > 0) imageReady(request, event.currentTarget);
                    }}
                    onError={() => {
                      setVisitedImages(previous => previous.filter(image => image !== slide.image));
                      const request = pending.current;
                      if (request?.index === index && request.image === slide.image) finishRequest(request, false);
                    }}
                  />
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
                    requestSlide(index);
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
          <p className="home-project-slider__load-status" role="status" aria-live="polite">{loadMessage}</p>
          <p className="home-project-slider__sr-only" role="status" aria-live="polite" aria-atomic="true">
            Project inspiration {activeIndex + 1} of {count}: {activeSlide.title}
          </p>
        </div>
      </div>
    </section>
  );
}
