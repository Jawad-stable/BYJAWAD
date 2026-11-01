import * as THREE from "three";
import { RoomEnvironment } from "three/examples/jsm/environments/RoomEnvironment.js";
import { tape } from "./tape";

/* The 3D cassette, modelled in code at real proportions (100.4 × 63.8 × 12mm,
   one unit per centimetre). Two shell halves with a see-through window; inside
   it, two reels whose tape packs trade size as the sample plays and whose hubs
   turn at real tape speed (4.76 cm/s, so the emptying reel spins faster). The
   label prints the loaded sample's title.

   One fixed, click-through canvas covers the viewport. Each frame the model is
   placed over a page element:
     [data-tape-hero]  where it floats on load (drag it to spin it)
     [data-tape-dock]  the deck's bay, where it lands and stays
   Between the two it flies an arc driven by the scroll. A new tape lifts out of
   the bay, turns over and drops back in. Reduced motion: no flight, no spin,
   no swap; it rests in the hero and the deck keeps its flat cassette. */

const W = 10.04;
const H = 6.38;
const D = 1.2;
const FRONT = D / 2;
const BEV = 0.05;
const CORNER = 0.32;
const WIN = { w: 6.0, h: 1.9, y: 0.35 };
const LABEL = { w: 8.7, h: 4.6, y: 0.57, r: 0.22 };
const REEL_X = 2.125;
const HUB_R = 0.55;
const PACK = { empty: 0.62, full: 2.0 };
const TAPE_SPEED = 4.76; // cm/s

const C = {
  shell: "#1b2029",
  seam: "#06080b",
  label: "#f3efe4",
  ink: "#1a1d22",
  hub: "#eeeae1",
  tape: "#35231a",
  metal: "#a9afb7",
  hole: "#07080a",
  stripes: ["#d4af37", "#c88568", "#94b0c7"],
};

/** Rounded rectangle (a stadium when r = h/2), centred on cx, cy. */
function rounded<T extends THREE.Path>(path: T, cx: number, cy: number, w: number, h: number, r: number): T {
  const x = cx - w / 2;
  const y = cy - h / 2;
  r = Math.min(r, w / 2, h / 2);
  path.moveTo(x + r, y);
  path.lineTo(x + w - r, y);
  path.absarc(x + w - r, y + r, r, -Math.PI / 2, 0, false);
  path.lineTo(x + w, y + h - r);
  path.absarc(x + w - r, y + h - r, r, 0, Math.PI / 2, false);
  path.lineTo(x + r, y + h);
  path.absarc(x + r, y + h - r, r, Math.PI / 2, Math.PI, false);
  path.lineTo(x, y + r);
  path.absarc(x + r, y + r, r, Math.PI, Math.PI * 1.5, false);
  return path;
}
const circle = (cx: number, cy: number, r: number) => new THREE.Path().absarc(cx, cy, r, 0, Math.PI * 2, false);

/** Flat geometry with UVs spanning a box of w × h centred on (cx, cy). */
function flat(shape: THREE.Shape, cx: number, cy: number, w: number, h: number) {
  const g = new THREE.ShapeGeometry(shape, 32);
  const pos = g.attributes.position;
  const uv = g.attributes.uv;
  for (let i = 0; i < pos.count; i++) uv.setXY(i, (pos.getX(i) - cx) / w + 0.5, (pos.getY(i) - cy) / h + 0.5);
  return g;
}

function canvas(w: number, h: number) {
  const c = document.createElement("canvas");
  c.width = w;
  c.height = h;
  return [c, c.getContext("2d")!] as const;
}

function noiseTexture(size: number, alpha: number) {
  const [c, g] = canvas(size, size);
  const img = g.createImageData(size, size);
  for (let i = 0; i < img.data.length; i += 4) {
    const v = 128 + (Math.random() - 0.5) * 255 * alpha;
    img.data[i] = img.data[i + 1] = img.data[i + 2] = v;
    img.data[i + 3] = 255;
  }
  g.putImageData(img, 0, 0);
  const t = new THREE.CanvasTexture(c);
  t.wrapS = t.wrapT = THREE.RepeatWrapping;
  return t;
}

function tapeTexture() {
  const [c, g] = canvas(512, 512);
  g.fillStyle = C.tape;
  g.fillRect(0, 0, 512, 512);
  // Wound tape: fine concentric rings with a soft sheen.
  for (let r = 4; r < 256; r += 1.6) {
    g.strokeStyle = `rgba(${Math.random() < 0.5 ? "255,220,180" : "0,0,0"},${0.04 + Math.random() * 0.06})`;
    g.beginPath();
    g.arc(256, 256, r, 0, Math.PI * 2);
    g.stroke();
  }
  const sheen = g.createLinearGradient(0, 0, 512, 512);
  sheen.addColorStop(0, "rgba(255,230,200,0.12)");
  sheen.addColorStop(0.5, "rgba(255,230,200,0)");
  sheen.addColorStop(1, "rgba(255,230,200,0.08)");
  g.fillStyle = sheen;
  g.fillRect(0, 0, 512, 512);
  const t = new THREE.CanvasTexture(c);
  t.colorSpace = THREE.SRGBColorSpace;
  return t;
}

function windowInset() {
  const [c, g] = canvas(512, 280);
  g.fillStyle = "rgba(255,255,255,0.14)";
  g.fillRect(0, 0, 512, 280);
  g.strokeStyle = "rgba(255,255,255,0.45)";
  g.lineWidth = 3;
  for (let i = 0; i <= 20; i++) {
    const x = 26 + i * 23;
    g.beginPath();
    g.moveTo(x, 0);
    g.lineTo(x, i % 5 === 0 ? 46 : 26);
    g.stroke();
  }
  const t = new THREE.CanvasTexture(c);
  t.colorSpace = THREE.SRGBColorSpace;
  return t;
}

/* ── Label ── */
const fontVar = (name: string) => getComputedStyle(document.documentElement).getPropertyValue(name).trim() || "monospace";
let logo: HTMLImageElement | null = null;

function drawLabel(cv: HTMLCanvasElement, opts: { title: string; client: string; rtl: boolean; back?: boolean }) {
  const g = cv.getContext("2d")!;
  const w = cv.width;
  const h = cv.height;
  const k = w / LABEL.w;
  const top = LABEL.y + LABEL.h / 2;
  g.save();
  g.fillStyle = C.label;
  g.fillRect(0, 0, w, h);
  // Paper tooth and a faint shadow toward the edges.
  for (let i = 0; i < 16000; i++) {
    g.fillStyle = `rgba(70,55,30,${Math.random() * 0.035})`;
    g.fillRect(Math.random() * w, Math.random() * h, 2, 2);
  }
  const edge = g.createRadialGradient(w / 2, h / 2, h * 0.35, w / 2, h / 2, w * 0.62);
  edge.addColorStop(0, "rgba(0,0,0,0)");
  edge.addColorStop(1, "rgba(60,45,20,0.12)");
  g.fillStyle = edge;
  g.fillRect(0, 0, w, h);

  // Three stripes through the window line.
  const yc = (top - WIN.y) * k;
  const band = 0.16 * k;
  C.stripes.forEach((col, i) => {
    g.fillStyle = col;
    g.fillRect(0, yc - band * 1.5 + 0.06 * k + i * band, w, band + 1);
  });

  const mono = fontVar("--font-geist-mono");
  const arabic = fontVar("--font-arad");
  const ink = "#1a1d22";
  const pad = 0.42 * k;

  // Monogram in the top corner opposite the title.
  const size = 0.6 * k;
  if (logo?.complete) g.drawImage(logo, opts.rtl ? pad : w - pad - size, 0.3 * k, size, size);

  if (!opts.back) {
    const family = opts.rtl ? arabic : mono;
    g.direction = opts.rtl ? "rtl" : "ltr";
    g.textAlign = opts.rtl ? "right" : "left";
    const x = opts.rtl ? w - pad : pad;
    const max = w - pad * 2 - size - 0.2 * k;
    let px = 0.36 * k;
    g.fillStyle = ink;
    const title = opts.rtl ? opts.title : opts.title.toUpperCase();
    do {
      g.font = `600 ${px}px ${family}`;
      px -= 2;
    } while (g.measureText(title).width > max && px > 0.18 * k);
    g.fillText(title, x, 0.78 * k);
    g.font = `500 ${0.21 * k}px ${family}`;
    g.fillStyle = "rgba(26,29,34,0.62)";
    g.fillText(opts.rtl ? opts.client : opts.client.toUpperCase(), x, 1.16 * k);
  }
  // A ruled line, then small print along the bottom.
  g.fillStyle = "rgba(26,29,34,0.16)";
  g.fillRect(pad, 1.36 * k, w - pad * 2, 3);
  g.direction = "ltr";
  g.font = `500 ${0.17 * k}px ${mono}`;
  g.fillStyle = "rgba(26,29,34,0.55)";
  g.textAlign = "left";
  g.fillText("JAWAD KHAMAYSA", pad, 4.22 * k);
  g.textAlign = "right";
  g.fillText("VOICE · DESIGN", w - pad, 4.22 * k);
  g.restore();
}

type Reel = { group: THREE.Group; pack: THREE.Mesh };

function buildCassette() {
  const root = new THREE.Group();
  const grain = noiseTexture(256, 0.5);
  grain.repeat.set(3, 2);

  const shellMat = new THREE.MeshPhysicalMaterial({
    color: C.shell,
    roughness: 0.42,
    roughnessMap: grain,
    bumpMap: grain,
    bumpScale: 0.004,
    clearcoat: 0.35,
    clearcoatRoughness: 0.35,
  });
  const dark = new THREE.MeshStandardMaterial({ color: C.hole, roughness: 0.8 });

  // Two shell halves with a window cut through both, and the seam between them.
  const half = (front: boolean) => {
    const s = rounded(new THREE.Shape(), 0, 0, W - 2 * BEV, H - 2 * BEV, CORNER - BEV);
    s.holes.push(rounded(new THREE.Path(), 0, WIN.y, WIN.w + 2 * BEV, WIN.h + 2 * BEV, WIN.h / 2 + BEV));
    const depth = FRONT - 0.02 - 2 * BEV;
    const g = new THREE.ExtrudeGeometry(s, { depth, bevelEnabled: true, bevelThickness: BEV, bevelSize: BEV, bevelSegments: 4, curveSegments: 28 });
    g.translate(0, 0, front ? 0.02 + BEV : -FRONT + BEV);
    return new THREE.Mesh(g, shellMat);
  };
  const seamShape = rounded(new THREE.Shape(), 0, 0, W - 0.1, H - 0.1, CORNER - 0.05);
  seamShape.holes.push(rounded(new THREE.Path(), 0, WIN.y, WIN.w + 0.2, WIN.h + 0.2, WIN.h / 2 + 0.1));
  const seam = new THREE.ExtrudeGeometry(seamShape, { depth: 0.06, bevelEnabled: false, curveSegments: 28 });
  seam.translate(0, 0, -0.03);
  root.add(half(true), half(false), new THREE.Mesh(seam, new THREE.MeshStandardMaterial({ color: C.seam, roughness: 0.6 })));

  // Write-protect openings on the top edge.
  for (const x of [-3.6, 3.6]) {
    const tab = new THREE.Mesh(new THREE.BoxGeometry(0.8, 0.03, 0.34), dark);
    tab.position.set(x, H / 2 - 0.012, -0.28);
    root.add(tab);
  }

  // Labels, front and back, with the window cut out.
  const labelShape = () => {
    const s = rounded(new THREE.Shape(), 0, LABEL.y, LABEL.w, LABEL.h, LABEL.r);
    s.holes.push(rounded(new THREE.Path(), 0, WIN.y, WIN.w + 0.3, WIN.h + 0.3, WIN.h / 2 + 0.15));
    return s;
  };
  const [frontCv] = canvas(2048, Math.round((2048 * LABEL.h) / LABEL.w));
  const [backCv] = canvas(2048, Math.round((2048 * LABEL.h) / LABEL.w));
  const paper = noiseTexture(256, 0.6);
  paper.repeat.set(4, 2);
  const labelMat = (cv: HTMLCanvasElement) => {
    const t = new THREE.CanvasTexture(cv);
    t.colorSpace = THREE.SRGBColorSpace;
    t.anisotropy = 8;
    return new THREE.MeshStandardMaterial({ map: t, roughness: 0.88, bumpMap: paper, bumpScale: 0.002 });
  };
  const frontLabel = new THREE.Mesh(flat(labelShape(), 0, LABEL.y, LABEL.w, LABEL.h), labelMat(frontCv));
  frontLabel.position.z = FRONT + 0.002;
  const backLabel = new THREE.Mesh(flat(labelShape(), 0, LABEL.y, LABEL.w, LABEL.h), labelMat(backCv));
  backLabel.rotation.y = Math.PI;
  backLabel.position.z = -FRONT - 0.002;
  root.add(frontLabel, backLabel);

  // Window glass, front and back, and the frosted counter inset.
  const glass = new THREE.MeshPhysicalMaterial({
    color: "#ffffff",
    transparent: true,
    opacity: 0.1,
    roughness: 0.05,
    clearcoat: 1,
    clearcoatRoughness: 0.04,
    side: THREE.DoubleSide,
    depthWrite: false,
  });
  for (const z of [FRONT - 0.04, -FRONT + 0.04]) {
    const pane = new THREE.Mesh(new THREE.ShapeGeometry(rounded(new THREE.Shape(), 0, WIN.y, WIN.w, WIN.h, WIN.h / 2), 32), glass);
    pane.position.z = z;
    pane.renderOrder = 2;
    root.add(pane);
  }
  const inset = new THREE.Mesh(
    new THREE.PlaneGeometry(1.75, 0.95),
    new THREE.MeshBasicMaterial({ map: windowInset(), transparent: true, depthWrite: false }),
  );
  inset.position.set(0, WIN.y, FRONT - 0.035);
  inset.renderOrder = 3;
  root.add(inset);

  // Reels: a toothed hub and a wound pack that turn together.
  const hubShape = new THREE.Shape().absarc(0, 0, HUB_R, 0, Math.PI * 2, false);
  const drive = new THREE.Path();
  for (let i = 0; i <= 96; i++) {
    const a = (i / 96) * Math.PI * 2;
    const r = ((a * 180) / Math.PI) % 60 < 16 ? 0.22 : 0.3;
    if (i === 0) drive.moveTo(Math.cos(a) * r, Math.sin(a) * r);
    else drive.lineTo(Math.cos(a) * r, Math.sin(a) * r);
  }
  hubShape.holes.push(drive);
  for (let i = 0; i < 3; i++) {
    const a = Math.PI / 2 + (i * Math.PI * 2) / 3;
    hubShape.holes.push(circle(Math.cos(a) * 0.42, Math.sin(a) * 0.42, 0.055));
  }
  const hubGeo = new THREE.ExtrudeGeometry(hubShape, { depth: 0.46, bevelEnabled: true, bevelThickness: 0.02, bevelSize: 0.015, bevelSegments: 2, curveSegments: 32 });
  hubGeo.translate(0, 0, -0.06);
  const hubMat = new THREE.MeshPhysicalMaterial({ color: C.hub, roughness: 0.35, clearcoat: 0.4 });
  const packGeo = new THREE.CylinderGeometry(1, 1, 0.48, 96, 1);
  packGeo.rotateX(Math.PI / 2);
  packGeo.translate(0, 0, 0.17);
  const capMat = new THREE.MeshStandardMaterial({ map: tapeTexture(), roughness: 0.32, metalness: 0.15 });
  const sideMat = new THREE.MeshStandardMaterial({ color: C.tape, roughness: 0.4, metalness: 0.15 });
  const reels: Reel[] = [-REEL_X, REEL_X].map(x => {
    const group = new THREE.Group();
    group.position.set(x, WIN.y, 0);
    const pack = new THREE.Mesh(packGeo, [sideMat, capMat, capMat]);
    const core = new THREE.Mesh(new THREE.CircleGeometry(0.29, 32), dark);
    core.position.z = 0.415;
    group.add(pack, core, new THREE.Mesh(hubGeo, hubMat));
    root.add(group);
    return { group, pack };
  });

  // The head area at the bottom, with its guide holes.
  const by = -H / 2 + 0.04;
  const ty = -H / 2 + 1.25;
  const trap = new THREE.Shape();
  trap.moveTo(-3.27, by + 0.025);
  trap.lineTo(3.27, by + 0.025);
  trap.lineTo(2.58, ty - 0.025);
  trap.lineTo(-2.58, ty - 0.025);
  trap.closePath();
  const pins = [-2.35, 2.35].map(x => ({ x, y: by + 0.42 }));
  const squares = [-0.95, 0.95].map(x => ({ x, y: by + 0.6 }));
  pins.forEach(p => trap.holes.push(circle(p.x, p.y, 0.19)));
  squares.forEach(p => trap.holes.push(rounded(new THREE.Path(), p.x, p.y, 0.32, 0.32, 0.05)));
  const head = new THREE.Mesh(
    new THREE.ExtrudeGeometry(trap, { depth: 0.04, bevelEnabled: true, bevelThickness: 0.025, bevelSize: 0.025, bevelSegments: 3, curveSegments: 16 }),
    shellMat,
  );
  head.position.z = FRONT + 0.025;
  root.add(head);
  for (const p of pins) {
    const m = new THREE.Mesh(new THREE.CircleGeometry(0.2, 24), dark);
    m.position.set(p.x, p.y, FRONT + 0.001);
    root.add(m);
  }
  for (const p of squares) {
    const m = new THREE.Mesh(new THREE.PlaneGeometry(0.33, 0.33), dark);
    m.position.set(p.x, p.y, FRONT + 0.001);
    root.add(m);
  }

  // Screws: four corners and one on the head, each in its recess.
  const metal = new THREE.MeshStandardMaterial({ color: C.metal, metalness: 0.9, roughness: 0.32 });
  const screw = (x: number, y: number, z: number) => {
    const ring = new THREE.Mesh(new THREE.RingGeometry(0.15, 0.21, 32), dark);
    ring.position.set(x, y, z + 0.001);
    const headM = new THREE.Mesh(new THREE.CylinderGeometry(0.15, 0.15, 0.05, 32), metal);
    headM.rotation.x = Math.PI / 2;
    headM.position.set(x, y, z + 0.02);
    root.add(ring, headM);
    for (const a of [0.5, 0.5 + Math.PI / 2]) {
      const cut = new THREE.Mesh(new THREE.BoxGeometry(0.19, 0.035, 0.02), dark);
      cut.position.set(x, y, z + 0.045);
      cut.rotation.z = a;
      root.add(cut);
    }
  };
  const sx = W / 2 - 0.45;
  const sy = H / 2 - 0.45;
  screw(-sx, sy, FRONT);
  screw(sx, sy, FRONT);
  screw(-sx, -sy, FRONT);
  screw(sx, -sy, FRONT);
  screw(0, ty - 0.42, FRONT + 0.09);

  const paint = (title: string, client: string, rtl: boolean) => {
    drawLabel(frontCv, { title, client, rtl });
    drawLabel(backCv, { title, client, rtl, back: true });
    ((frontLabel.material as THREE.MeshStandardMaterial).map as THREE.Texture).needsUpdate = true;
    ((backLabel.material as THREE.MeshStandardMaterial).map as THREE.Texture).needsUpdate = true;
  };

  return { root, reels, paint };
}

function shadowTexture() {
  const [c, g] = canvas(256, 256);
  const grad = g.createRadialGradient(128, 128, 0, 128, 128, 128);
  grad.addColorStop(0, "rgba(0,0,0,0.6)");
  grad.addColorStop(0.55, "rgba(0,0,0,0.22)");
  grad.addColorStop(1, "rgba(0,0,0,0)");
  g.fillStyle = grad;
  g.fillRect(0, 0, 256, 256);
  return new THREE.CanvasTexture(c);
}

const clamp01 = (v: number) => Math.min(1, Math.max(0, v));
const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
const inOut = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);
const outQuart = (t: number) => 1 - Math.pow(1 - t, 4);
const follow = (rate: number, dt: number) => 1 - Math.exp(-rate * dt);

/** Mounts the scene on a canvas. Returns a cleanup function, or null without WebGL. */
export function mountCassette(canvasEl: HTMLCanvasElement): (() => void) | null {
  let renderer: THREE.WebGLRenderer;
  try {
    renderer = new THREE.WebGLRenderer({ canvas: canvasEl, antialias: true, alpha: true, powerPreference: "high-performance" });
  } catch {
    return null;
  }
  // Phones: a lighter pixel ratio keeps the full-screen canvas smooth.
  const touch = window.matchMedia("(pointer: coarse)").matches;
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, touch ? 1.5 : 2));
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.NeutralToneMapping;

  const scene = new THREE.Scene();
  const pmrem = new THREE.PMREMGenerator(renderer);
  scene.environment = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;
  scene.environmentIntensity = 0.7;
  const key = new THREE.DirectionalLight("#fff1dc", 2.1);
  key.position.set(-7, 10, 12);
  const rim = new THREE.DirectionalLight("#a9c4ff", 1.1);
  rim.position.set(10, 2, -8);
  const fill = new THREE.HemisphereLight("#ffffff", "#2a2f3a", 0.35);
  scene.add(key, rim, fill);

  const FOV = 28;
  const DIST = 40;
  const camera = new THREE.PerspectiveCamera(FOV, 1, 1, 300);
  camera.position.z = DIST;

  const model = buildCassette();
  const rig = new THREE.Group();
  rig.add(model.root);
  scene.add(rig);
  const shadow = new THREE.Mesh(new THREE.PlaneGeometry(1, 1), new THREE.MeshBasicMaterial({ map: shadowTexture(), transparent: true, depthWrite: false }));
  scene.add(shadow);

  // Label: printed now, reprinted when a new tape goes in.
  let printed = "";
  const print = () => {
    const { title, client, rtl } = tape.get();
    const id = `${title}|${client}|${rtl}`;
    if (id === printed) return;
    printed = id;
    model.paint(title, client, rtl);
  };
  logo = new Image();
  logo.onload = () => {
    printed = "";
    print();
    dirty = true;
  };
  logo.src = "/media/logo-gold.png";
  document.fonts?.ready.then(() => {
    printed = "";
    print();
    dirty = true;
  });

  const reducedQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
  const finePointer = window.matchMedia("(hover: hover) and (pointer: fine)");
  let reduced = reducedQuery.matches;
  const html = document.documentElement;

  let vw = 0;
  let vh = 0;
  let dirty = true;
  const resize = () => {
    vw = window.innerWidth;
    vh = window.innerHeight;
    renderer.setSize(vw, vh, false);
    camera.aspect = vw / vh;
    camera.updateProjectionMatrix();
    dirty = true;
  };

  // Pointer tilt in the hero, and drag to spin.
  const pointer = { x: 0, y: 0, tx: 0, ty: 0 };
  const spin = { angle: 0, vel: 0, dragging: false, lastX: 0 };
  let heroEl: HTMLElement | null = null;
  const onMove = (e: PointerEvent) => {
    if (finePointer.matches) {
      pointer.tx = (e.clientX / vw) * 2 - 1;
      pointer.ty = (e.clientY / vh) * 2 - 1;
    }
    if (spin.dragging) {
      const dx = e.clientX - spin.lastX;
      spin.lastX = e.clientX;
      spin.angle += dx * 0.012;
      spin.vel = dx * 0.012 * 60;
    }
  };
  const onDown = (e: PointerEvent) => {
    if (reduced || e.button !== 0) return;
    spin.dragging = true;
    spin.lastX = e.clientX;
    heroEl?.setPointerCapture(e.pointerId);
  };
  const onUp = () => (spin.dragging = false);
  const bindHero = () => {
    const el = document.querySelector<HTMLElement>("[data-tape-hero]");
    if (el === heroEl) return;
    heroEl?.removeEventListener("pointerdown", onDown);
    heroEl = el;
    heroEl?.addEventListener("pointerdown", onDown);
  };

  const markDirty = () => (dirty = true);
  // Which flat cassette the 3D one covers: both while it flies, or only
  // the one it rests in under reduced motion.
  const setMode = () => (html.dataset.tape3d = !reduced ? "fly" : heroEl ? "hero" : "dock");
  const onReduced = () => {
    reduced = reducedQuery.matches;
    setMode();
    dirty = true;
  };
  window.addEventListener("resize", resize);
  window.addEventListener("scroll", markDirty, { passive: true });
  window.addEventListener("pointermove", onMove, { passive: true });
  window.addEventListener("pointerup", onUp);
  window.addEventListener("pointercancel", onUp);
  reducedQuery.addEventListener("change", onReduced);
  const unsubscribe = tape.subscribe(markDirty);
  resize();

  let raf = 0;
  let last = performance.now();
  let born = -1;
  let flight = -1;
  let swapAt = -1;
  let swapSeen = tape.get().swap;
  let swapped = false;
  const angles = [0, 0];

  const frame = (now: number) => {
    raf = requestAnimationFrame(frame);
    const dt = Math.min(0.05, (now - last) / 1000);
    last = now;
    if (document.hidden) return;

    bindHero();
    const dockEl = document.querySelector<HTMLElement>("[data-tape-dock]");
    if (!heroEl && !dockEl) return;
    const hero = (heroEl || dockEl)!.getBoundingClientRect();
    const dock = (dockEl || heroEl)!.getBoundingClientRect();
    if (born < 0) {
      born = now;
      setMode();
    }

    // Landing: the cassette arrives from deep in the stage, turning once.
    const intro = reduced ? 1 : outQuart(clamp01((now - born - 250) / 1800));

    // Flight: it follows the scroll from the first move until the bay sits
    // just below mid-screen. The deck comes straight after the stage, so the
    // cassette stays in view the whole way down and settles into the bay.
    let target = 0;
    if (!heroEl) target = 1;
    else if (dockEl && !reduced) {
      const land = dock.top + window.scrollY + dock.height / 2 - vh * 0.55;
      const start = vh * 0.02;
      target = inOut(clamp01((window.scrollY - start) / Math.max(1, land - start)));
    }
    flight = flight < 0 ? target : lerp(flight, target, follow(9, dt));
    if (Math.abs(flight - target) < 0.0005) flight = target;
    const e = flight;
    const free = 1 - e;

    // A new tape: lift out of the bay, turn over, drop back in.
    const { playing, progress, swap } = tape.get();
    if (swap !== swapSeen) {
      swapSeen = swap;
      if (reduced || e < 0.5) print();
      else {
        swapAt = now;
        swapped = false;
      }
    }
    let swapT = swapAt < 0 ? 0 : clamp01((now - swapAt) / 950);
    if (swapAt >= 0 && swapT >= 0.5 && !swapped) {
      swapped = true;
      print();
    }
    if (swapT >= 1) {
      swapAt = -1;
      swapT = 0;
    }
    if (swapAt < 0) print();

    // Drag spin settles back to the nearest full turn.
    if (!spin.dragging) {
      const rest = Math.round(spin.angle / (Math.PI * 2)) * Math.PI * 2;
      spin.vel += ((rest - spin.angle) * 22 - spin.vel * 7) * dt;
      spin.angle += spin.vel * dt;
    }

    const animating = intro < 1 || (free > 0.001 && !reduced) || playing || swapAt >= 0 || spin.dragging || Math.abs(spin.vel) > 0.01 || flight !== target;
    if (!animating && !dirty) return;
    dirty = false;

    const t = now / 1000;
    pointer.x = lerp(pointer.x, pointer.tx, follow(4, dt));
    pointer.y = lerp(pointer.y, pointer.ty, follow(4, dt));
    const live = reduced ? 0 : 1;

    // Position: a swooping arc from the hero to the bay.
    const p0 = { x: hero.left + hero.width / 2, y: hero.top + hero.height / 2 };
    const p2 = { x: dock.left + dock.width / 2, y: dock.top + dock.height / 2 };
    const side = p0.x >= p2.x ? 1 : -1;
    const p1 = { x: (p0.x + p2.x) / 2 + side * vw * 0.16, y: (p0.y + p2.y) / 2 - vh * 0.04 };
    const b = (a: number, m: number, c: number) => (1 - e) * (1 - e) * a + 2 * (1 - e) * e * m + e * e * c;
    const cx = b(p0.x, p1.x, p2.x);
    let cy = b(p0.y, p1.y, p2.y) + Math.sin(t * 1.1) * 9 * free * live;
    let width = lerp(hero.width, dock.width, e) * (1 + 0.12 * Math.sin(e * Math.PI));
    const lift = Math.sin(swapT * Math.PI);
    cy -= lift * dock.height * 0.42;
    width *= 1 + 0.05 * lift;

    const upp = (2 * DIST * Math.tan(THREE.MathUtils.degToRad(FOV / 2))) / vh;
    const s = (width * upp) / W;
    rig.scale.setScalar(s);
    rig.position.set((cx - vw / 2) * upp, -(cy - vh / 2) * upp, -FRONT * s - 70 * (1 - intro));

    const heroX = 0.3 + Math.sin(t * 0.8) * 0.04 * live + pointer.y * 0.22;
    const heroY = -0.4 + Math.sin(t * 0.55) * 0.12 * live + pointer.x * 0.38;
    rig.rotation.set(
      lerp(heroX, 0, e) + Math.sin(e * Math.PI) * 0.35 - (1 - intro) * 0.6 - lift * 0.35,
      lerp(heroY, 0, e) + spin.angle * free - (1 - intro) * Math.PI * 2 + inOut(swapT) * Math.PI * 2,
      lerp(0.09, 0, e) - Math.sin(e * Math.PI) * 0.3 * side,
    );

    // Reels: packs trade size; hubs turn at constant tape speed.
    const area = PACK.full * PACK.full - PACK.empty * PACK.empty;
    const radii = [Math.sqrt(PACK.empty ** 2 + (1 - progress) * area), Math.sqrt(PACK.empty ** 2 + progress * area)];
    model.reels.forEach((reel, i) => {
      reel.pack.scale.set(radii[i], radii[i], 1);
      if (playing && !reduced) angles[i] += (TAPE_SPEED / radii[i]) * dt;
      reel.group.rotation.z = angles[i];
    });

    const floatGap = 0.35 + 1.1 * free * live + lift * 2.2;
    shadow.scale.set(W * s * lerp(0.85, 0.98, e), H * s * lerp(0.26, 0.12, e), 1);
    shadow.position.set(rig.position.x, rig.position.y - (H / 2 + floatGap) * s, rig.position.z - D * s);
    (shadow.material as THREE.MeshBasicMaterial).opacity = lerp(0.5, 0.4, e) * intro;

    renderer.render(scene, camera);
  };
  raf = requestAnimationFrame(frame);

  const lost = (ev: Event) => {
    ev.preventDefault();
    delete html.dataset.tape3d;
  };
  canvasEl.addEventListener("webglcontextlost", lost);

  return () => {
    cancelAnimationFrame(raf);
    window.removeEventListener("resize", resize);
    window.removeEventListener("scroll", markDirty);
    window.removeEventListener("pointermove", onMove);
    window.removeEventListener("pointerup", onUp);
    window.removeEventListener("pointercancel", onUp);
    heroEl?.removeEventListener("pointerdown", onDown);
    reducedQuery.removeEventListener("change", onReduced);
    canvasEl.removeEventListener("webglcontextlost", lost);
    unsubscribe();
    delete html.dataset.tape3d;
    scene.traverse(o => {
      const m = o as THREE.Mesh;
      m.geometry?.dispose();
      const mats = Array.isArray(m.material) ? m.material : m.material ? [m.material] : [];
      mats.forEach(mat => {
        const std = mat as THREE.MeshStandardMaterial;
        std.map?.dispose();
        std.roughnessMap?.dispose();
        std.bumpMap?.dispose();
        mat.dispose();
      });
    });
    pmrem.dispose();
    renderer.dispose();
  };
}
