import { useEffect, useId, useLayoutEffect, useRef, useState, type KeyboardEvent, type PointerEvent } from "react";
import { ArrowLeft, ArrowRight, ArrowUpRight } from "lucide-react";
import "./product-showroom.css";

export type ProductShowroomItem = {
  number: string;
  name: string;
  category: string;
  title: string;
  description: string;
  image: string;
  alt: string;
};

type ProductShowroomProps = {
  items: ProductShowroomItem[];
  selected: number;
  onSelect: (index: number) => void;
};

type PhotoLayer = {
  id: number;
  item: ProductShowroomItem;
  phase: "entering" | "active" | "exiting";
};

/** A controlled feature panel: the surrounding selector remains owned by the parent. */
export default function ProductShowroom({ items, selected, onSelect }: ProductShowroomProps) {
  const current = items[selected];
  const hintId = useId();
  const visualRef = useRef<HTMLDivElement>(null);
  const frameRef = useRef<HTMLDivElement>(null);
  const canTilt = useRef(false);
  const tiltFrame = useRef<number | null>(null);
  const pendingTilt = useRef({ x: 0, y: 0 });
  const touchStart = useRef<{ id: number; x: number; y: number } | null>(null);
  const nextLayerId = useRef(0);
  const activeLayerId = useRef<number | null>(current ? 0 : null);
  const animationFrames = useRef(new Set<number>());
  const cleanupTimers = useRef(new Set<number>());
  const signature = current ? JSON.stringify([selected, current.image, current.alt]) : "empty";
  const lastSignature = useRef(signature);
  const [layers, setLayers] = useState<PhotoLayer[]>(() => current ? [{ id: 0, item: current, phase: "active" }] : []);

  // Each change gets a fresh incoming layer. An interrupted incoming layer is
  // retargeted from its current position to the exit rather than restarting.
  useLayoutEffect(() => {
    if (signature === lastSignature.current) return;
    lastSignature.current = signature;

    if (!current) {
      activeLayerId.current = null;
      setLayers([]);
      return;
    }

    const previousId = activeLayerId.current;
    const id = ++nextLayerId.current;
    activeLayerId.current = id;
    setLayers(previous => [
      ...previous.map(layer => layer.id === previousId ? { ...layer, phase: "exiting" as const } : layer),
      { id, item: current, phase: previousId === null ? "active" : "entering" },
    ]);

    if (previousId !== null) {
      const frame = window.requestAnimationFrame(() => {
        animationFrames.current.delete(frame);
        setLayers(previous => previous.map(layer => layer.id === id && layer.phase === "entering" ? { ...layer, phase: "active" } : layer));
      });
      animationFrames.current.add(frame);
      // A timeout also cleans up when transitions are disabled or interrupted.
      const timer = window.setTimeout(() => {
        cleanupTimers.current.delete(timer);
        setLayers(previous => previous.filter(layer => layer.id !== previousId));
      }, 450);
      cleanupTimers.current.add(timer);
    }
  }, [signature, current]);

  useEffect(() => {
    const finePointer = window.matchMedia("(hover: hover) and (pointer: fine)");
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const updateMotionPreference = () => {
      canTilt.current = finePointer.matches && !reducedMotion.matches;
      if (!canTilt.current) {
        if (tiltFrame.current !== null) window.cancelAnimationFrame(tiltFrame.current);
        tiltFrame.current = null;
        if (frameRef.current) frameRef.current.style.transform = "";
      }
    };
    updateMotionPreference();
    finePointer.addEventListener("change", updateMotionPreference);
    reducedMotion.addEventListener("change", updateMotionPreference);
    return () => {
      finePointer.removeEventListener("change", updateMotionPreference);
      reducedMotion.removeEventListener("change", updateMotionPreference);
      if (tiltFrame.current !== null) window.cancelAnimationFrame(tiltFrame.current);
    };
  }, []);

  useEffect(() => {
    const frames = animationFrames.current;
    const timers = cleanupTimers.current;
    return () => {
      frames.forEach(frame => window.cancelAnimationFrame(frame));
      timers.forEach(timer => window.clearTimeout(timer));
      frames.clear();
      timers.clear();
    };
  }, []);

  // Warm the supplied real photos as the showroom approaches the viewport.
  useEffect(() => {
    const visual = visualRef.current;
    if (!visual) return;
    const preload = () => items.forEach(item => { const image = new Image(); image.src = item.image; });
    if (!("IntersectionObserver" in window)) {
      preload();
      return;
    }
    const observer = new IntersectionObserver(entries => {
      if (entries.some(entry => entry.isIntersecting)) {
        preload();
        observer.disconnect();
      }
    }, { rootMargin: "300px" });
    observer.observe(visual);
    return () => observer.disconnect();
  }, [items]);

  if (!current) return null;

  const selectRelative = (offset: number) => {
    if (items.length > 1) onSelect((selected + offset + items.length) % items.length);
  };

  const handleKeys = (event: KeyboardEvent<HTMLDivElement>) => {
    // Do not hijack keys while a link or button inside the showroom has focus.
    if (event.target !== event.currentTarget || event.altKey || event.ctrlKey || event.metaKey) return;
    if (event.key === "ArrowLeft" || event.key === "ArrowRight") {
      event.preventDefault();
      selectRelative(event.key === "ArrowLeft" ? -1 : 1);
    }
  };

  const handlePointerMove = (event: PointerEvent<HTMLDivElement>) => {
    if (event.pointerType !== "mouse" || !canTilt.current || !visualRef.current) return;
    if ((event.target as HTMLElement).closest("button, a")) {
      resetTilt();
      return;
    }
    const bounds = visualRef.current.getBoundingClientRect();
    const x = Math.max(-1, Math.min(1, (event.clientX - bounds.left) / bounds.width * 2 - 1));
    const y = Math.max(-1, Math.min(1, (event.clientY - bounds.top) / bounds.height * 2 - 1));
    pendingTilt.current = { x: -y * 2.5, y: x * 3.5 };
    if (tiltFrame.current !== null) return;
    tiltFrame.current = window.requestAnimationFrame(() => {
      tiltFrame.current = null;
      if (frameRef.current && canTilt.current) {
        frameRef.current.style.transform = `rotateX(${pendingTilt.current.x}deg) rotateY(${pendingTilt.current.y}deg)`;
      }
    });
  };

  const resetTilt = () => {
    if (tiltFrame.current !== null) window.cancelAnimationFrame(tiltFrame.current);
    tiltFrame.current = null;
    if (frameRef.current) frameRef.current.style.transform = "";
  };

  const handlePointerDown = (event: PointerEvent<HTMLDivElement>) => {
    if (event.pointerType === "touch" && event.isPrimary) {
      touchStart.current = { id: event.pointerId, x: event.clientX, y: event.clientY };
    }
  };

  const handlePointerUp = (event: PointerEvent<HTMLDivElement>) => {
    const start = touchStart.current;
    touchStart.current = null;
    if (!start || event.pointerType !== "touch" || start.id !== event.pointerId) return;
    const dx = event.clientX - start.x;
    const dy = event.clientY - start.y;
    if (Math.abs(dx) >= 50 && Math.abs(dx) > Math.abs(dy) * 1.25) selectRelative(dx < 0 ? 1 : -1);
  };

  return (
    <div
      className="product-showroom"
      role="region"
      aria-roledescription="carousel"
      aria-label="Sports experience showroom"
      aria-describedby={hintId}
      tabIndex={0}
      onKeyDown={handleKeys}
    >
      <span className="product-showroom__sr-only" id={hintId}>Use the left and right arrow keys to change experiences.</span>
      <span className="product-showroom__sr-only" aria-live="polite" aria-atomic="true">{current.name}, {selected + 1} of {items.length}</span>

      <div
        className="product-showroom__visual"
        ref={visualRef}
        onPointerMove={handlePointerMove}
        onPointerLeave={resetTilt}
        onPointerDown={handlePointerDown}
        onPointerUp={handlePointerUp}
        onPointerCancel={() => { touchStart.current = null; }}
      >
        <div className="product-showroom__frame" ref={frameRef}>
          <div className="product-showroom__viewport" role="group" aria-roledescription="slide" aria-label={`${selected + 1} of ${items.length}`}>
            {layers.map(layer => (
              <img
                key={layer.id}
                className={`product-showroom__photo is-${layer.phase}`}
                src={layer.item.image}
                alt={layer.phase === "exiting" ? "" : layer.item.alt}
                aria-hidden={layer.phase === "exiting" ? true : undefined}
                loading="lazy"
                decoding="async"
                draggable={false}
              />
            ))}
            <div className="product-showroom__image-shade" aria-hidden="true" />
            <div className="product-showroom__image-topline"><span>{current.category} <i>/</i> {current.number}</span><span aria-hidden="true">LJ / SPORTS TECH</span></div>
            <span className="product-showroom__image-caption">LJ SPORTS TECH EXPERIENCE</span>
            <span className="product-showroom__corner" aria-hidden="true" />
          </div>
          <div className="product-showroom__frame-bottom">
            <span className="product-showroom__frame-label"><span aria-hidden="true" /> FEATURED EXPERIENCE</span>
            <div className="product-showroom__navigation" role="group" aria-label="Experience navigation">
              <span className="product-showroom__count" aria-hidden="true">{String(selected + 1).padStart(2, "0")} <span>/ {String(items.length).padStart(2, "0")}</span></span>
              <button type="button" className="product-showroom__arrow" aria-label="Previous experience" disabled={items.length < 2} onClick={() => selectRelative(-1)}><ArrowLeft size={18} aria-hidden="true" /></button>
              <button type="button" className="product-showroom__arrow" aria-label="Next experience" disabled={items.length < 2} onClick={() => selectRelative(1)}><ArrowRight size={18} aria-hidden="true" /></button>
            </div>
          </div>
        </div>
      </div>

      <div className="product-showroom__copy">
        <div>
          <span className="product-showroom__index">FEATURED EXPERIENCE / {current.number}</span>
          <h3>{current.title}</h3>
        </div>
        <div>
          <p>{current.description}</p>
          <a className="product-showroom__inquiry" href={`mailto:sarah@ljsportstech.com?subject=${encodeURIComponent(`Inquiry about ${current.name} simulator`)}`}>
            ASK ABOUT {current.name.toUpperCase()} <ArrowUpRight size={17} aria-hidden="true" />
          </a>
        </div>
      </div>
    </div>
  );
}
