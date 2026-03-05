import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { gsap } from 'gsap';

/* shaders */

const VERT = /* glsl */ `
varying vec2 vUv;
uniform float uGlitch;
uniform float uTime;

void main() {
  vUv = uv;
  vec3 pos = position;
  // Glitch: brief vertex jitter
  float g = uGlitch;
  pos.x += sin(position.y * 20.0 + uTime * 80.0) * 0.1 * g;
  pos.y += cos(position.x * 15.0 + uTime * 60.0) * 0.06 * g;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
}
`;

const FRAG = /* glsl */ `
varying vec2 vUv;
uniform float uTime;
uniform vec3 uColor;
uniform float uGlitch;
uniform float uPattern;

/* Hex cell distance */
float hexDist(vec2 p) {
  p = abs(p);
  return max(dot(p, vec2(0.866025, 0.5)), p.y);
}

/* Height field for volumetric surface patterns */
float getHeight(vec2 uv) {
  if (uPattern > 0.5 && uPattern < 1.5) {
    // ── Honeycomb EVA cells ──
    float sc = 12.0;
    vec2 s = vec2(1.0, 1.732);
    vec2 h = s * 0.5;
    vec2 a = mod(uv * sc, s) - h;
    vec2 b = mod(uv * sc - h, s) - h;
    vec2 gv = dot(a, a) < dot(b, b) ? a : b;
    float d = hexDist(gv);
    float wall = smoothstep(0.44, 0.37, d);
    float top  = smoothstep(0.37, 0.28, d);
    return mix(wall * 0.4, 1.0, top);
  }
  if (uPattern > 1.5 && uPattern < 2.5) {
    // ── Diamond / rhombus ridges ──
    float sc = 10.0;
    vec2 d = fract(uv * sc) - 0.5;
    float dm = abs(d.x) + abs(d.y);
    float cell  = smoothstep(0.48, 0.38, dm);
    float bevel = smoothstep(0.38, 0.22, dm);
    return mix(cell * 0.35, 1.0, bevel);
  }
  if (uPattern > 2.5) {
    // ── Anti-slip dome nubs ──
    float sc = 9.0;
    vec2 cell = fract(uv * sc) - 0.5;
    float d = length(cell);
    float nub = smoothstep(0.22, 0.0, d);
    return nub * nub;
  }
  return 0.5;
}

void main() {
  vec3 col = uColor;
  if (!gl_FrontFacing) col *= 0.25;

  // ── Volumetric pattern ──
  float h = getHeight(vUv);

  // Fake normals from height-field derivatives
  float hx = dFdx(h);
  float hy = dFdy(h);
  vec3 N = normalize(vec3(-hx * 18.0, -hy * 18.0, 1.0));

  // Directional light (upper-right-front)
  vec3 L = normalize(vec3(0.4, 0.65, 1.0));
  float diff = max(dot(N, L), 0.0);

  // Specular (Blinn-Phong)
  vec3 V = vec3(0.0, 0.0, 1.0);
  vec3 H = normalize(L + V);
  float spec = pow(max(dot(N, H), 0.0), 40.0);

  // Ambient occlusion in grooves
  float ao = 0.45 + 0.55 * h;

  // Compose lighting
  col = col * (0.22 + diff * 0.7) * ao + vec3(spec * 0.18);

  // Extra groove darkening for depth
  col = mix(col * 0.55, col, smoothstep(0.0, 0.5, h));

  // Face edge highlight
  float edge = min(min(vUv.x, 1.0 - vUv.x), min(vUv.y, 1.0 - vUv.y));
  col += smoothstep(0.04, 0.0, edge) * 0.12;

  // Glitch: chromatic-style color shift
  col.r += sin(vUv.y * 40.0 + uTime * 40.0) * 0.15 * uGlitch;
  col.b += sin(vUv.x * 30.0 + uTime * 30.0) * 0.08 * uGlitch;

  gl_FragColor = vec4(col, 1.0);
}
`;

/* component */

export default function CubeScene() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // renderer
    const renderer = new THREE.WebGLRenderer({
      alpha: true, antialias: true, premultipliedAlpha: false,
    });
    renderer.setClearColor(0x000000, 0);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.domElement.style.display = 'block';
    container.appendChild(renderer.domElement);

    // scene / camera
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
      50, container.clientWidth / container.clientHeight, 0.1, 100,
    );
    camera.position.set(0, 0.6, 5.5);
    camera.lookAt(1.5, 0, 0);

    // shared uniforms
    const uTime   = { value: 0 };
    const uGlitch = { value: 0 };

    const allMats: THREE.ShaderMaterial[] = [];

    function makeMat(hex: number, pattern = 0) {
      const m = new THREE.ShaderMaterial({
        vertexShader: VERT,
        fragmentShader: FRAG,
        side: THREE.DoubleSide,
        uniforms: { uTime, uGlitch, uColor: { value: new THREE.Color(hex) }, uPattern: { value: pattern } },
      });
      allMats.push(m);
      return m;
    }

    // cube faces
    // 6 PlaneGeometry faces positioned like a box.
    // primary faces use icon-exact colors; secondary faces are very dark.
    const faceGeo = new THREE.PlaneGeometry(2, 2);
    const cubeGroup = new THREE.Group();
    cubeGroup.position.x = 1.5;

    interface FaceRef { mesh: THREE.Mesh; basePos: THREE.Vector3; dir: THREE.Vector3 }
    const primaryFaces: FaceRef[] = [];

    function addFace(
      hex: number,
      px: number, py: number, pz: number,
      rx: number, ry: number, rz: number,
      primary: boolean,
      pattern = 0,
    ) {
      const mesh = new THREE.Mesh(faceGeo, makeMat(hex, pattern));
      mesh.position.set(px, py, pz);
      mesh.rotation.set(rx, ry, rz);
      cubeGroup.add(mesh);
      if (primary) {
        primaryFaces.push({
          mesh,
          basePos: new THREE.Vector3(px, py, pz),
          dir: new THREE.Vector3(px, py, pz).normalize(),
        });
      }
    }

    // primary
    addFace(0xE80000, 0, 1, 0, -Math.PI / 2, 0, 0, true, 1);  // +Y top: honeycomb EVA cells
    addFace(0xC40000, 0, 0, 1, 0, 0, 0, true, 3);  // +Z front: anti-slip dome nubs
    addFace(0xD60000, 1, 0, 0, 0, Math.PI / 2, 0, true, 2);  // +X right: diamond ridges
    // secondary
    addFace(0x6A0000, 0, -1, 0, Math.PI / 2, 0, 0, false); // -Y bottom
    addFace(0x750000, 0, 0, -1, 0, Math.PI, 0, false); // -Z back
    addFace(0x680000, -1, 0, 0, 0, -Math.PI / 2, 0, false); // -X left

    // isometric rotation
    cubeGroup.rotation.x = 0.54;
    cubeGroup.rotation.y = Math.PI / 4;
    scene.add(cubeGroup);

    // edge wireframe
    const edgeGeo = new THREE.EdgesGeometry(new THREE.BoxGeometry(2, 2, 2));
    const edgeMat = new THREE.LineBasicMaterial({
      color: 0xffffff, transparent: true, opacity: 0.5,
      blending: THREE.AdditiveBlending,
    });
    cubeGroup.add(new THREE.LineSegments(edgeGeo, edgeMat));

    // ghost wireframe
    const ghostEdgeGeo = new THREE.EdgesGeometry(new THREE.BoxGeometry(2.2, 2.2, 2.2));
    const ghostMat = new THREE.LineBasicMaterial({
      color: 0xA80000, transparent: true, opacity: 0.1,
      blending: THREE.AdditiveBlending,
    });
    cubeGroup.add(new THREE.LineSegments(ghostEdgeGeo, ghostMat));

    // // inner glow
    // const innerGlowMat = new THREE.MeshBasicMaterial({
    //   color: 0xffffff, transparent: true, opacity: 1,
    //   blending: THREE.AdditiveBlending,
    // });

    // const innerGlowGeo = new THREE.SphereGeometry(0.3, 12, 12);
    // // const innerGlowGeo = new THREE.BoxGeometry(1.5, 1.5, 1.5);
    // cubeGroup.add(new THREE.Mesh(innerGlowGeo, innerGlowMat));

    const glowLayers = [
      { scale: 1.0, opacity: 1.0 },
      { scale: 1.5, opacity: 0.4 },
      { scale: 2.0, opacity: 0.15 },
      { scale: 2.8, opacity: 0.05 },
    ];

    const baseGeo = new THREE.SphereGeometry(0.3, 16, 16);

    let glowMats: THREE.MeshBasicMaterial[] = []

    glowLayers.forEach(({ scale, opacity }) => {
      const mat = new THREE.MeshBasicMaterial({
        color: 0xffffff,
        transparent: true,
        opacity,
        blending: THREE.AdditiveBlending,
        depthWrite: false,   // critical — prevents glow layers from occluding each other
        side: THREE.BackSide, // optional for outer layers, gives softer edge
      });
      const mesh = new THREE.Mesh(baseGeo, mat);
      glowMats.push(mat);
      mesh.scale.setScalar(scale);
      cubeGroup.add(mesh);
    });

    // particles
    const pp: number[] = [];
    for (let i = 0; i < 100; i++) {
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      const r = 3.2 + Math.random() * 2.8;
      pp.push(
        r * Math.sin(phi) * Math.cos(theta),
        r * Math.sin(phi) * Math.sin(theta),
        r * Math.cos(phi),
      );
    }
    const particleGeo = new THREE.BufferGeometry();
    particleGeo.setAttribute('position', new THREE.Float32BufferAttribute(pp, 3));
    const particleMat = new THREE.PointsMaterial({
      color: 0x991100, size: 0.025, transparent: true, opacity: 0.7,
      blending: THREE.AdditiveBlending,
    });
    const particles = new THREE.Points(particleGeo, particleMat);
    scene.add(particles);

    // entrance
    cubeGroup.scale.setScalar(0);
    const scaleTween = gsap.to(cubeGroup.scale, {
      x: 1, y: 1, z: 1, duration: 2, delay: 1.2, ease: 'elastic.out(1, 0.55)',
    });

    // mouse tracking
    let mouseX = 0, mouseY = 0;
    const onMouse = (e: MouseEvent) => {
      mouseX = (e.clientX / window.innerWidth - 0.5) * 2;
      mouseY = (e.clientY / window.innerHeight - 0.5) * 2;
    };
    window.addEventListener('mousemove', onMouse);

    // animation state
    let autoY = Math.PI / 4;
    let curRotX = 0.54;
    let curRotY = Math.PI / 4;
    let curSep = 0;
    let t = 0;
    let rafId: number;
    let lastGlitch = performance.now();
    let nextGlitchIn = 3500 + Math.random() * 3000;

    function animate() {
      rafId = requestAnimationFrame(animate);
      t += 0.016;
      autoY += 0.004;

      // rotation w/ parallax
      curRotX += (0.54 + mouseX * 0.2 - curRotX) * 0.04;
      curRotY += (autoY + mouseY * 0.35 - curRotY) * 0.04;
      cubeGroup.rotation.x = curRotX;
      cubeGroup.rotation.y = curRotY;

      // Face separation (mouse proximity to cube area)
      const dx = mouseX;
      const dist = Math.sqrt(dx * dx + mouseY * mouseY);
      const targetSep = Math.max(0, (0.7 - dist) / 0.7) * 0.35;
      curSep += (targetSep - curSep) * 0.04;

      for (const f of primaryFaces) {
        f.mesh.position.copy(f.basePos).addScaledVector(f.dir, curSep);
      }
      // innerGlowMat.opacity = curSep * 3;
      glowMats.forEach((mat, i) => {
        // mesh.scale.setScalar(glowLayers[i].scale * curSep*3.2);
        mat.opacity = glowLayers[i].opacity * curSep*3.5;
      });

      // glitch trigger
      const now = performance.now();
      if (now - lastGlitch > nextGlitchIn) {
        lastGlitch = now;
        nextGlitchIn = 3500 + Math.random() * 3000;
        uGlitch.value = 1;
      }
      if (uGlitch.value > 0) uGlitch.value = Math.max(0, uGlitch.value - 0.06);

      // update shared uniforms
      uTime.value = t;

      // edge pulse
      edgeMat.opacity = 0.35 + Math.sin(t) * 0.15;

      // particles drift
      particles.rotation.y += 0.002;
      particles.rotation.x += 0.0005;

      renderer.render(scene, camera);
    }
    animate();

    // resize
    const ro = new ResizeObserver(() => {
      const w = container.clientWidth;
      const h = container.clientHeight;
      renderer.setSize(w, h);
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
    });
    ro.observe(container);

    // cleanup
    return () => {
      cancelAnimationFrame(rafId);
      scaleTween.kill();
      ro.disconnect();
      window.removeEventListener('mousemove', onMouse);
      faceGeo.dispose();
      allMats.forEach(m => m.dispose());
      edgeGeo.dispose();
      edgeMat.dispose();
      ghostEdgeGeo.dispose();
      ghostMat.dispose();
      // innerGlowGeo.dispose();
      // innerGlowMat.dispose();
      particleGeo.dispose();
      particleMat.dispose();
      renderer.dispose();
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
    };
  }, []);

  return <div ref={containerRef} className="absolute inset-0 z-10" style={{ pointerEvents: 'none' }} />;
}
