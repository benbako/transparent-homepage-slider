import { useEffect, useRef } from "react";
import "./hero-depth.css";

/** Decorative movement stays separate from the photos and interactive controls. */
export default function HeroDepth() {
  const rootRef = useRef<HTMLDivElement>(null);
  const rigRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const hero = rootRef.current?.closest<HTMLElement>(".hero");
    const rig = rigRef.current;
    if (!hero || !rig) return;

    const pointer = window.matchMedia("(hover: hover) and (pointer: fine)");
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    let frame: number | null = null;
    let nextX = 0;
    let nextY = 0;

    const reset = () => {
      if (frame !== null) window.cancelAnimationFrame(frame);
      frame = null;
      rig.style.transform = "";
    };
    const handleMove = (event: PointerEvent) => {
      if (event.pointerType !== "mouse" || !pointer.matches || reducedMotion.matches) return;
      const bounds = hero.getBoundingClientRect();
      if (!bounds.width || !bounds.height) return;
      nextX = ((event.clientX - bounds.left) / bounds.width - .5) * 14;
      nextY = ((event.clientY - bounds.top) / bounds.height - .5) * 10;
      if (frame !== null) return;
      frame = window.requestAnimationFrame(() => {
        frame = null;
        rig.style.transform = `translate3d(${nextX}px, ${nextY}px, 0)`;
      });
    };
    const updatePreferences = () => {
      if (!pointer.matches || reducedMotion.matches) reset();
    };
    hero.addEventListener("pointermove", handleMove, { passive: true });
    hero.addEventListener("pointerleave", reset);
    pointer.addEventListener("change", updatePreferences);
    reducedMotion.addEventListener("change", updatePreferences);
    return () => {
      reset();
      hero.removeEventListener("pointermove", handleMove);
      hero.removeEventListener("pointerleave", reset);
      pointer.removeEventListener("change", updatePreferences);
      reducedMotion.removeEventListener("change", updatePreferences);
    };
  }, []);

  return (
    <div className="hero-depth" aria-hidden="true" ref={rootRef}>
      <div className="hero-depth__rig" ref={rigRef}>
        <div className="hero-depth__orbit hero-depth__orbit--outer"><span /></div>
        <div className="hero-depth__orbit hero-depth__orbit--inner"><span /></div>
        <i className="hero-depth__spark hero-depth__spark--one" />
        <i className="hero-depth__spark hero-depth__spark--two" />
        <i className="hero-depth__spark hero-depth__spark--three" />
        <span className="hero-depth__trail" />
      </div>
    </div>
  );
}
