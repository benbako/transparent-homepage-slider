import { useEffect, useRef, useState, type PointerEvent } from "react";
import "./about-design-scene.css";

type DragState = {
  id: number;
  startX: number;
  startY: number;
  lastX: number;
  direction: "horizontal" | "vertical" | null;
};

/** An original, illustrative venue concept—not an LJ product or real venue. */
export default function AboutDesignScene() {
  const stageRef = useRef<HTMLDivElement>(null);
  const rotateRef = useRef<((amount: number) => void) | null>(null);
  const dragRef = useRef<DragState | null>(null);
  const [interactive, setInteractive] = useState(false);

  useEffect(() => {
    const stage = stageRef.current;
    if (!stage) return;

    let cancelled = false;
    let renderer: import("three").WebGLRenderer | null = null;
    let resizeObserver: ResizeObserver | null = null;
    let visibilityObserver: IntersectionObserver | null = null;
    let removeResize: (() => void) | null = null;
    let removeContextLost: (() => void) | null = null;
    const geometries: import("three").BufferGeometry[] = [];
    const materials: import("three").Material[] = [];

    const cleanup = () => {
      rotateRef.current = null;
      dragRef.current = null;
      stage.classList.remove("is-dragging");
      resizeObserver?.disconnect();
      resizeObserver = null;
      removeResize?.();
      removeResize = null;
      removeContextLost?.();
      removeContextLost = null;
      geometries.forEach(geometry => geometry.dispose());
      materials.forEach(material => material.dispose());
      geometries.length = 0;
      materials.length = 0;
      if (renderer) {
        renderer.dispose();
        renderer.domElement.remove();
        renderer = null;
      }
    };

    const createScene = async () => {
      try {
        // Keep server-rendered markup useful and load the 3D library only in the browser.
        const THREE = await import("./about-three");
        if (cancelled) return;

        renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true, powerPreference: "low-power" });
        const activeRenderer = renderer;
        activeRenderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
        activeRenderer.setClearColor(0x000000, 0);
        activeRenderer.domElement.setAttribute("aria-hidden", "true");
        activeRenderer.domElement.className = "about-design-scene__canvas";
        stage.appendChild(activeRenderer.domElement);

        const scene = new THREE.Scene();
        const camera = new THREE.OrthographicCamera(-4, 4, 4, -4, 0.1, 100);
        camera.position.set(7, 6, 8);
        camera.lookAt(0, 0.65, 0);
        scene.add(new THREE.HemisphereLight(0xe4f5ff, 0x244260, 2.1));
        const light = new THREE.DirectionalLight(0xffffff, 2.3);
        light.position.set(-3, 8, 5);
        scene.add(light);

        const model = new THREE.Group();
        scene.add(model);

        const material = (color: number, options: { metalness?: number; roughness?: number; emissive?: number; emissiveIntensity?: number } = {}) => {
          const result = new THREE.MeshStandardMaterial({ color, roughness: 0.72, ...options });
          materials.push(result);
          return result;
        };
        const navy = material(0x102a40);
        const blue = material(0x087bd3);
        const blueDark = material(0x0b4169);
        const pale = material(0xd9f0fb);
        const screenBlue = material(0x095887, { emissive: 0x07345a, emissiveIntensity: 0.45 });
        const screenLine = material(0x69c8ff, { emissive: 0x1378b3, emissiveIntensity: 0.45 });
        const orange = material(0xe87a3e);
        const seam = material(0x713b2c);
        const steel = material(0x7ba4bc, { metalness: 0.25 });

        const box = (width: number, height: number, depth: number, surface: import("three").Material, x: number, y: number, z: number) => {
          const geometry = new THREE.BoxGeometry(width, height, depth);
          geometries.push(geometry);
          const mesh = new THREE.Mesh(geometry, surface);
          mesh.position.set(x, y, z);
          model.add(mesh);
          return mesh;
        };
        const ring = (inner: number, outer: number, surface: import("three").Material, x: number, y: number, z: number, horizontal = false) => {
          const geometry = new THREE.RingGeometry(inner, outer, 64);
          geometries.push(geometry);
          const mesh = new THREE.Mesh(geometry, surface);
          mesh.position.set(x, y, z);
          if (horizontal) mesh.rotation.x = -Math.PI / 2;
          model.add(mesh);
          return mesh;
        };

        // Raised plinth, court, and deliberately abstract white court markings.
        box(5.7, 0.22, 4.2, navy, 0, 0, 0);
        box(5.46, 0.035, 3.96, pale, 0, 0.127, 0);
        box(5.32, 0.035, 3.82, blue, 0, 0.16, 0);
        box(4.82, 0.012, 0.035, pale, 0, 0.186, -1.59);
        box(4.82, 0.012, 0.035, pale, 0, 0.186, 1.59);
        box(0.035, 0.012, 3.2, pale, -2.41, 0.186, 0);
        box(0.035, 0.012, 3.2, pale, 2.41, 0.186, 0);
        box(0.035, 0.012, 3.2, pale, 0, 0.186, 0);
        ring(0.52, 0.55, pale, 0, 0.19, 0, true);
        ring(0.075, 0.095, pale, 0, 0.191, 0, true);
        // Two quiet inset blocks give the base a designed, architectural edge.
        box(0.6, 0.035, 0.045, screenLine, -1.9, -0.015, 2.105);
        box(0.28, 0.035, 0.045, orange, -1.38, -0.015, 2.105);

        // A freestanding screen-like plane, with graphic rather than product UI.
        box(0.08, 1.72, 0.08, steel, -1.37, 0.98, -1.72);
        box(0.08, 1.72, 0.08, steel, 1.37, 0.98, -1.72);
        box(3.24, 1.85, 0.16, navy, 0, 1.32, -1.72);
        box(3.04, 1.65, 0.018, screenBlue, 0, 1.32, -1.63);
        ring(0.38, 0.405, screenLine, 0, 1.34, -1.616);
        ring(0.18, 0.2, pale, 0, 1.34, -1.613);
        box(0.58, 0.035, 0.018, screenLine, -1.03, 1.68, -1.61);
        box(0.35, 0.035, 0.018, screenLine, -1.145, 1.56, -1.61);
        box(0.5, 0.035, 0.018, screenLine, 1.07, 0.98, -1.61);
        box(0.14, 0.06, 0.02, orange, 1.25, 1.69, -1.61);
        // The back has its own restrained detail when the model is turned around.
        box(2.82, 1.42, 0.018, blueDark, 0, 1.32, -1.81);
        box(0.8, 0.035, 0.018, screenLine, 0, 1.32, -1.823);

        // A small sport-inspired ball is a visual cue, not a specific product.
        const ballGeometry = new THREE.SphereGeometry(0.28, 32, 20);
        geometries.push(ballGeometry);
        const ball = new THREE.Mesh(ballGeometry, orange);
        ball.position.set(1.35, 0.47, 0.82);
        model.add(ball);
        const seamGeometry = new THREE.TorusGeometry(0.282, 0.006, 6, 48);
        geometries.push(seamGeometry);
        [0, 1, 2].forEach(axis => {
          const line = new THREE.Mesh(seamGeometry, seam);
          line.position.copy(ball.position);
          if (axis === 1) line.rotation.y = Math.PI / 2;
          if (axis === 2) line.rotation.x = Math.PI / 2;
          model.add(line);
        });

        const render = () => activeRenderer.render(scene, camera);
        const resize = () => {
          const width = Math.max(1, stage.clientWidth);
          const height = Math.max(1, stage.clientHeight);
          const aspect = width / height;
          // Keep the entire concept in frame, including on narrow screens.
          const halfHeight = Math.max(3.2, 4.2 / aspect);
          camera.left = -halfHeight * aspect;
          camera.right = halfHeight * aspect;
          camera.top = halfHeight;
          camera.bottom = -halfHeight;
          camera.updateProjectionMatrix();
          activeRenderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
          activeRenderer.setSize(width, height, false);
          render();
        };
        rotateRef.current = amount => {
          model.rotation.y += amount;
          render();
        };

        const contextLost = (event: Event) => {
          event.preventDefault();
          cleanup();
          if (!cancelled) setInteractive(false);
        };
        activeRenderer.domElement.addEventListener("webglcontextlost", contextLost);
        removeContextLost = () => activeRenderer.domElement.removeEventListener("webglcontextlost", contextLost);
        if (typeof ResizeObserver !== "undefined") {
          resizeObserver = new ResizeObserver(resize);
          resizeObserver.observe(stage);
        }
        window.addEventListener("resize", resize);
        removeResize = () => window.removeEventListener("resize", resize);
        resize();
        if (!cancelled) setInteractive(true);
      } catch {
        // Import failures, disabled WebGL and renderer errors retain the CSS view.
        cleanup();
        if (!cancelled) setInteractive(false);
      }
    };

    if (typeof IntersectionObserver !== "undefined") {
      visibilityObserver = new IntersectionObserver(entries => {
        if (!entries.some(entry => entry.isIntersecting)) return;
        visibilityObserver?.disconnect();
        visibilityObserver = null;
        void createScene();
      }, { rootMargin: "300px 0px" });
      visibilityObserver.observe(stage);
    } else {
      void createScene();
    }
    return () => {
      cancelled = true;
      visibilityObserver?.disconnect();
      cleanup();
    };
  }, []);

  const endDrag = (event: PointerEvent<HTMLDivElement>) => {
    if (dragRef.current?.id !== event.pointerId) return;
    dragRef.current = null;
    event.currentTarget.classList.remove("is-dragging");
    if (event.currentTarget.hasPointerCapture(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId);
    }
  };

  const onPointerDown = (event: PointerEvent<HTMLDivElement>) => {
    if (!interactive || !event.isPrimary || (event.pointerType === "mouse" && event.button !== 0)) return;
    dragRef.current = { id: event.pointerId, startX: event.clientX, startY: event.clientY, lastX: event.clientX, direction: null };
    event.currentTarget.setPointerCapture(event.pointerId);
  };

  const onPointerMove = (event: PointerEvent<HTMLDivElement>) => {
    const drag = dragRef.current;
    if (!drag || drag.id !== event.pointerId) return;
    const dx = event.clientX - drag.startX;
    const dy = event.clientY - drag.startY;
    if (!drag.direction && Math.max(Math.abs(dx), Math.abs(dy)) > 6) {
      drag.direction = Math.abs(dx) > Math.abs(dy) ? "horizontal" : "vertical";
      if (drag.direction === "horizontal") event.currentTarget.classList.add("is-dragging");
    }
    if (drag.direction === "horizontal") {
      rotateRef.current?.((event.clientX - drag.lastX) * 0.01);
      drag.lastX = event.clientX;
    }
  };

  return (
    <figure className="about-design-scene">
      <div className="about-design-scene__topline">
        <span className="about-design-scene__label"><span aria-hidden="true" /> CONCEPT ILLUSTRATION</span>
        <span className="about-design-scene__index" aria-hidden="true">SPACE / SPORT / PLAY</span>
      </div>

      <div
        ref={stageRef}
        className={`about-design-scene__stage${interactive ? " is-ready" : ""}`}
        role="img"
        aria-label="Conceptual isometric indoor sports space with a blue court, a screen-like plane and an orange ball. This is an illustration, not an actual venue or LJ product."
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={endDrag}
        onPointerCancel={endDrag}
        onLostPointerCapture={endDrag}
      >
        <div className="about-design-scene__fallback" aria-hidden="true">
          <div className="about-design-scene__shadow" />
          <div className="about-design-scene__iso">
            <div className="about-design-scene__floor">
              <div className="about-design-scene__court"><span /><i /></div>
              <div className="about-design-scene__screen"><div><span /><i /><b /></div></div>
              <div className="about-design-scene__ball"><span /></div>
            </div>
          </div>
        </div>
        <span className="about-design-scene__stage-mark" aria-hidden="true">01 / SPACE FOR PLAY</span>
      </div>

      <figcaption className="about-design-scene__caption">
        <div className="about-design-scene__copy">
          <strong>DESIGNED FOR PLAY<span>.</span></strong>
          <p>A little imagination for the spaces where sport and technology meet.</p>
        </div>
        <div className="about-design-scene__interaction">
          {interactive ? (
            <>
              <span className="about-design-scene__hint">DRAG TO ROTATE</span>
              <div className="about-design-scene__controls" role="group" aria-label="Rotate the concept illustration">
                <button type="button" onClick={() => rotateRef.current?.(-Math.PI / 4)}><span aria-hidden="true">←</span> Rotate left</button>
                <button type="button" onClick={() => rotateRef.current?.(Math.PI / 4)}>Rotate right <span aria-hidden="true">→</span></button>
              </div>
            </>
          ) : (
            <span className="about-design-scene__hint">STATIC CONCEPT VIEW</span>
          )}
        </div>
      </figcaption>
    </figure>
  );
}
