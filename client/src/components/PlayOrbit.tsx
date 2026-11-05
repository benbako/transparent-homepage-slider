import { useEffect, useRef } from "react";
import * as THREE from "three";

type PlayOrbitProps = {
  className?: string;
};

/** A purely decorative, click-through orbital illustration for a hero. */
export default function PlayOrbit({ className }: PlayOrbitProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // Three's current renderer requires WebGL 2. Check first so an unavailable
    // context simply leaves this decorative layer empty instead of throwing.
    const canvas = document.createElement("canvas");
    let context: WebGL2RenderingContext | null = null;
    try {
      context = canvas.getContext("webgl2", {
        alpha: true,
        antialias: true,
        powerPreference: "low-power",
      });
    } catch {
      return;
    }
    if (!context) return;

    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({
        canvas,
        context,
        alpha: true,
        antialias: true,
      });
    } catch {
      return;
    }

    renderer.setClearColor(0x000000, 0);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.75));
    canvas.style.display = "block";
    canvas.style.width = "100%";
    canvas.style.height = "100%";
    canvas.style.pointerEvents = "none";
    container.appendChild(canvas);

    const scene = new THREE.Scene();
    const camera = new THREE.OrthographicCamera(-2, 2, 2, -2, 0.1, 20);
    camera.position.set(0, 0, 7);
    camera.lookAt(0, 0, 0);

    const geometries = new Set<THREE.BufferGeometry>();
    const materials = new Set<THREE.Material>();
    const keepGeometry = <T extends THREE.BufferGeometry>(geometry: T) => {
      geometries.add(geometry);
      return geometry;
    };
    const keepMaterial = <T extends THREE.Material>(material: T) => {
      materials.add(material);
      return material;
    };
    const lineMaterial = (color: number, opacity: number) =>
      keepMaterial(
        new THREE.LineBasicMaterial({
          color,
          transparent: true,
          opacity,
          depthWrite: false,
          toneMapped: false,
        })
      );

    const gridMaterial = lineMaterial(0x5ca9e6, 0.29);
    const contourMaterial = lineMaterial(0x98e4f5, 0.56);
    const orbitMaterial = lineMaterial(0x65bce8, 0.38);
    const tickMaterial = lineMaterial(0x9adff2, 0.48);
    const pointMaterial = keepMaterial(
      new THREE.PointsMaterial({
        color: 0xb5efff,
        size: 3,
        transparent: true,
        opacity: 0.8,
        depthWrite: false,
        sizeAttenuation: false,
        toneMapped: false,
      })
    );

    const tilted = new THREE.Group();
    tilted.rotation.set(0.32, -0.2, -0.22);
    scene.add(tilted);
    const sculpture = new THREE.Group();
    tilted.add(sculpture);

    const addLine = (
      parent: THREE.Object3D,
      points: THREE.Vector3[],
      material: THREE.LineBasicMaterial,
      closed = false
    ) => {
      const geometry = keepGeometry(
        new THREE.BufferGeometry().setFromPoints(points)
      );
      const line = closed
        ? new THREE.LineLoop(geometry, material)
        : new THREE.Line(geometry, material);
      parent.add(line);
    };
    const addPoints = (parent: THREE.Object3D, points: THREE.Vector3[]) => {
      const geometry = keepGeometry(
        new THREE.BufferGeometry().setFromPoints(points)
      );
      parent.add(new THREE.Points(geometry, pointMaterial));
    };

    const radius = 1.12;
    const steps = 96;
    // A very faint volume gives the fine wire contour a little depth on images.
    const shellGeometry = keepGeometry(
      new THREE.SphereGeometry(radius, 32, 20)
    );
    const shellMaterial = keepMaterial(
      new THREE.MeshBasicMaterial({
        color: 0x216da9,
        transparent: true,
        opacity: 0.035,
        depthWrite: false,
        side: THREE.DoubleSide,
        toneMapped: false,
      })
    );
    sculpture.add(new THREE.Mesh(shellGeometry, shellMaterial));

    // Latitude and longitude lines: deliberately open and light, not a dense mesh.
    for (let latitude = -3; latitude <= 3; latitude += 1) {
      const angle = (latitude * Math.PI) / 8;
      const ringRadius = Math.cos(angle) * radius;
      const y = Math.sin(angle) * radius;
      const ring: THREE.Vector3[] = [];
      for (let i = 0; i < steps; i += 1) {
        const t = (i / steps) * Math.PI * 2;
        ring.push(
          new THREE.Vector3(
            Math.cos(t) * ringRadius,
            y,
            Math.sin(t) * ringRadius
          )
        );
      }
      addLine(
        sculpture,
        ring,
        latitude === 0 ? contourMaterial : gridMaterial,
        true
      );
    }
    for (let meridian = 0; meridian < 8; meridian += 1) {
      const longitude = (meridian / 8) * Math.PI;
      const ring: THREE.Vector3[] = [];
      for (let i = 0; i < steps; i += 1) {
        const t = (i / steps) * Math.PI * 2;
        ring.push(
          new THREE.Vector3(
            Math.sin(t) * Math.cos(longitude) * radius,
            Math.cos(t) * radius,
            Math.sin(t) * Math.sin(longitude) * radius
          )
        );
      }
      addLine(sculpture, ring, gridMaterial, true);
    }

    // A continuous, ball-panel-like seam gives the globe a sporting character.
    const seam: THREE.Vector3[] = [];
    const seamNodes: THREE.Vector3[] = [];
    for (let i = 0; i < steps; i += 1) {
      const t = (i / steps) * Math.PI * 2;
      const y = 0.43 * Math.sin(t * 2);
      const horizontal = Math.sqrt(1 - y * y);
      const point = new THREE.Vector3(
        Math.cos(t) * horizontal * (radius + 0.007),
        y * (radius + 0.007),
        Math.sin(t) * horizontal * (radius + 0.007)
      );
      seam.push(point);
      if ([5, 22, 43, 66, 82].includes(i)) seamNodes.push(point.clone());
    }
    addLine(sculpture, seam, contourMaterial, true);
    addPoints(sculpture, seamNodes);

    // Broken, tilted orbital tracks and small calibration marks.
    const track = new THREE.Group();
    track.rotation.set(0.92, 0.15, -0.34);
    sculpture.add(track);
    const trackPoint = (angle: number, scale = 1) =>
      new THREE.Vector3(
        Math.cos(angle) * 1.53 * scale,
        Math.sin(angle) * 1.42 * scale,
        0
      );
    const addArc = (start: number, end: number) => {
      const points: THREE.Vector3[] = [];
      const count = Math.max(
        2,
        Math.ceil(((end - start) / (Math.PI * 2)) * 120)
      );
      for (let i = 0; i <= count; i += 1) {
        points.push(trackPoint(start + ((end - start) * i) / count));
      }
      addLine(track, points, orbitMaterial);
    };
    addArc(0.12, 2.52);
    addArc(2.66, 4.29);
    addArc(4.48, 6.12);
    addPoints(
      track,
      [0.12, 1.31, 2.52, 4.29, 5.45].map(angle => trackPoint(angle))
    );

    const ticks: THREE.Vector3[] = [];
    for (let i = 0; i < 24; i += 1) {
      const angle = (i / 24) * Math.PI * 2;
      ticks.push(
        trackPoint(angle, 1.014),
        trackPoint(angle, i % 3 === 0 ? 1.042 : 1.028)
      );
    }
    const tickGeometry = keepGeometry(
      new THREE.BufferGeometry().setFromPoints(ticks)
    );
    track.add(new THREE.LineSegments(tickGeometry, tickMaterial));

    const secondTrack = new THREE.Group();
    secondTrack.rotation.set(-0.48, 0.8, 0.4);
    sculpture.add(secondTrack);
    const secondArc: THREE.Vector3[] = [];
    for (let i = 0; i <= 80; i += 1) {
      const angle = -0.35 + (i / 80) * Math.PI * 1.38;
      secondArc.push(
        new THREE.Vector3(Math.cos(angle) * 1.38, Math.sin(angle) * 1.38, 0)
      );
    }
    addLine(secondTrack, secondArc, gridMaterial);

    const motionPreference = window.matchMedia?.(
      "(prefers-reduced-motion: reduce)"
    );
    let reducedMotion = motionPreference?.matches ?? false;
    let contextLost = false;
    let hasSize = false;
    let frame: number | null = null;
    let previousTime: number | null = null;
    let phase = 0;
    let targetX = 0;
    let targetY = 0;
    let currentX = 0;
    let currentY = 0;

    const render = () => {
      if (hasSize && !contextLost) renderer.render(scene, camera);
    };
    const stop = () => {
      if (frame !== null) window.cancelAnimationFrame(frame);
      frame = null;
      previousTime = null;
    };
    const animate = (time: number) => {
      frame = null;
      if (reducedMotion || contextLost || document.hidden) return;
      const delta =
        previousTime === null
          ? 0
          : Math.min((time - previousTime) / 1000, 0.05);
      previousTime = time;
      phase += delta * 0.075;
      const ease = 1 - Math.exp(-delta * 3);
      currentX += (targetX - currentX) * ease;
      currentY += (targetY - currentY) * ease;
      sculpture.rotation.x = currentX;
      sculpture.rotation.y = phase + currentY;
      render();
      frame = window.requestAnimationFrame(animate);
    };
    const start = () => {
      if (
        frame === null &&
        !reducedMotion &&
        !contextLost &&
        !document.hidden
      ) {
        frame = window.requestAnimationFrame(animate);
      }
    };
    const resize = () => {
      const width = container.clientWidth;
      const height = container.clientHeight;
      hasSize = width > 0 && height > 0;
      if (!hasSize) return;
      const aspect = width / height;
      const span = 3.65;
      const viewWidth = aspect >= 1 ? span * aspect : span;
      const viewHeight = aspect >= 1 ? span : span / aspect;
      camera.left = -viewWidth / 2;
      camera.right = viewWidth / 2;
      camera.top = viewHeight / 2;
      camera.bottom = -viewHeight / 2;
      camera.updateProjectionMatrix();
      renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.75));
      renderer.setSize(width, height, false);
      render();
    };
    const setPointer = (clientX: number, clientY: number) => {
      if (reducedMotion) return;
      const bounds = container.getBoundingClientRect();
      if (!bounds.width || !bounds.height) return;
      const x = THREE.MathUtils.clamp(
        ((clientX - bounds.left) / bounds.width) * 2 - 1,
        -1,
        1
      );
      const y = THREE.MathUtils.clamp(
        ((clientY - bounds.top) / bounds.height) * 2 - 1,
        -1,
        1
      );
      targetY = x * 0.18;
      targetX = y * 0.12;
    };
    const onPointerMove = (event: PointerEvent) =>
      setPointer(event.clientX, event.clientY);
    const onTouchMove = (event: TouchEvent) => {
      const touch = event.touches[0];
      if (touch) setPointer(touch.clientX, touch.clientY);
    };
    const resetPointer = () => {
      targetX = 0;
      targetY = 0;
    };
    const onMotionChange = (event: MediaQueryListEvent) => {
      reducedMotion = event.matches;
      if (reducedMotion) {
        stop();
        phase = 0;
        currentX = 0;
        currentY = 0;
        resetPointer();
        sculpture.rotation.set(0, 0, 0);
        render();
      } else {
        start();
      }
    };
    const onVisibilityChange = () => (document.hidden ? stop() : start());
    const onContextLost = (event: Event) => {
      event.preventDefault();
      contextLost = true;
      stop();
    };
    const onContextRestored = () => {
      contextLost = false;
      render();
      start();
    };

    const observer =
      typeof ResizeObserver === "undefined" ? null : new ResizeObserver(resize);
    observer?.observe(container);
    window.addEventListener("resize", resize);
    window.addEventListener("pointermove", onPointerMove, { passive: true });
    window.addEventListener("touchmove", onTouchMove, { passive: true });
    window.addEventListener("touchend", resetPointer, { passive: true });
    window.addEventListener("blur", resetPointer);
    document.addEventListener("visibilitychange", onVisibilityChange);
    canvas.addEventListener("webglcontextlost", onContextLost);
    canvas.addEventListener("webglcontextrestored", onContextRestored);
    if (motionPreference?.addEventListener) {
      motionPreference.addEventListener("change", onMotionChange);
    } else {
      motionPreference?.addListener(onMotionChange);
    }
    resize();
    start();

    return () => {
      stop();
      observer?.disconnect();
      window.removeEventListener("resize", resize);
      window.removeEventListener("pointermove", onPointerMove);
      window.removeEventListener("touchmove", onTouchMove);
      window.removeEventListener("touchend", resetPointer);
      window.removeEventListener("blur", resetPointer);
      document.removeEventListener("visibilitychange", onVisibilityChange);
      canvas.removeEventListener("webglcontextlost", onContextLost);
      canvas.removeEventListener("webglcontextrestored", onContextRestored);
      if (motionPreference?.removeEventListener) {
        motionPreference.removeEventListener("change", onMotionChange);
      } else {
        motionPreference?.removeListener(onMotionChange);
      }
      geometries.forEach(geometry => geometry.dispose());
      materials.forEach(material => material.dispose());
      renderer.dispose();
      canvas.remove();
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className={className}
      aria-hidden="true"
      style={{ pointerEvents: "none" }}
    />
  );
}
