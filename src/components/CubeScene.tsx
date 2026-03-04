import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { gsap } from 'gsap';

/* ── Shaders ─────────────────────────────────────────────── */

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

void main() {
  vec3 col = uColor;

  // Interior (back face) is much darker
  if (!gl_FrontFacing) col *= 0.3;

  // ── 3D mat surface texture ──
  float pat = 0.0;

  if (uPattern > 0.5 && uPattern < 1.5) {                                                         
    // Wavy zigzag channels (car floor mat)                                                       
    float w = sin(vUv.x * 15.7) * 0.35;                                                           
    float ch = abs(fract(vUv.y * 5.0 + w) - 0.5) * 2.0;                                           
    pat = 1.0 - smoothstep(0.0, 0.25, ch);                                                        
  } else if (uPattern > 1.5 && uPattern < 2.5) {                                                  
    // Diagonal parallel grooves (car mat edge zones)                                             
    float ru = vUv.x * 0.707 - vUv.y * 0.707;                                                     
    float gr = abs(fract(ru * 7.0) - 0.5) * 2.0;                                                  
    pat = 1.0 - smoothstep(0.0, 0.15, gr);                                                        
  } else if (uPattern > 2.5) {                                                                    
    // Dot grid (trunk mat)                                                                       
    vec2 dc = fract(vUv * 7.0) - 0.5;                                                             
    pat = 1.0 - smoothstep(0.12, 0.18, length(dc));                                               
  }                                                                                               
  // Apply as subtle emboss relief                                                                
  col *= 1.0 - pat * 0.15;                                                                        
  col += pat * 0.03;

  // Edge highlight
  float edge = min(min(vUv.x, 1.0 - vUv.x), min(vUv.y, 1.0 - vUv.y));
  col += smoothstep(0.04, 0.0, edge) * 0.18;

  // Glitch: chromatic-style color shift
  col.r += sin(vUv.y * 40.0 + uTime * 40.0) * 0.15 * uGlitch;
  col.b += sin(vUv.x * 30.0 + uTime * 30.0) * 0.08 * uGlitch;

  gl_FragColor = vec4(col, 1.0);
}
`;

/* ── Component ───────────────────────────────────────────── */

export default function CubeScene() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // ── Renderer ──────────────────────────────────────────
    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(container.clientWidth, container.clientHeight);
    container.appendChild(renderer.domElement);

    // ── Scene / Camera ────────────────────────────────────
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
      50, container.clientWidth / container.clientHeight, 0.1, 100,
    );
    camera.position.set(0, 0.6, 5.5);
    camera.lookAt(1.5, 0, 0);

    // ── Shared uniforms ───────────────────────────────────
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

    // ── Cube faces ────────────────────────────────────────
    // 6 PlaneGeometry faces positioned like a box.
    // Primary faces use icon-exact colors; secondary faces are very dark.
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

    // Primary (icon colors) — each face shows a different product texture
    addFace(0xE80000,  0,  1,  0, -Math.PI / 2, 0, 0, true, 1);  // +Y top: wavy channels (car mat)
    addFace(0xC40000,  0,  0,  1,  0, 0, 0,            true, 3);  // +Z front: dot grid (trunk mat)
    addFace(0xD60000,  1,  0,  0,  0, Math.PI / 2, 0,  true, 2);  // +X right: diagonal grooves
    // Secondary (dark interior sides)
    addFace(0x4A0000,  0, -1,  0,  Math.PI / 2, 0, 0,  false); // -Y bottom
    addFace(0x550000,  0,  0, -1,  0, Math.PI, 0,       false); // -Z back
    addFace(0x480000, -1,  0,  0,  0, -Math.PI / 2, 0,  false); // -X left

    // Isometric rotation (matches logo angle)
    cubeGroup.rotation.x = 0.54;
    cubeGroup.rotation.y = Math.PI / 4;
    scene.add(cubeGroup);

    // ── Edge wireframe (stays fixed — reveals skeleton on separation) ──
    const edgeGeo = new THREE.EdgesGeometry(new THREE.BoxGeometry(2, 2, 2));
    const edgeMat = new THREE.LineBasicMaterial({
      color: 0xffffff, transparent: true, opacity: 0.5,
      blending: THREE.AdditiveBlending,
    });
    cubeGroup.add(new THREE.LineSegments(edgeGeo, edgeMat));

    // ── Ghost wireframe (larger, subtle echo) ──
    const ghostEdgeGeo = new THREE.EdgesGeometry(new THREE.BoxGeometry(2.2, 2.2, 2.2));
    const ghostMat = new THREE.LineBasicMaterial({
      color: 0xA80000, transparent: true, opacity: 0.1,
      blending: THREE.AdditiveBlending,
    });
    cubeGroup.add(new THREE.LineSegments(ghostEdgeGeo, ghostMat));

    // ── Inner glow (visible when faces separate) ──
    const innerGlowMat = new THREE.MeshBasicMaterial({
      color: 0xffffff, transparent: true, opacity: 1,
      blending: THREE.AdditiveBlending,
    });

    // const innerGlowGeo = new THREE.SphereGeometry(0.6, 12, 12);
    const innerGlowGeo = new THREE.BoxGeometry(1.5, 1.5, 1.5);
    cubeGroup.add(new THREE.Mesh(innerGlowGeo, innerGlowMat));

    // ── Particles (reduced, intentional) ──
    const pp: number[] = [];
    for (let i = 0; i < 60; i++) {
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
      color: 0x991100, size: 0.025, transparent: true, opacity: 0.5,
      blending: THREE.AdditiveBlending,
    });
    const particles = new THREE.Points(particleGeo, particleMat);
    scene.add(particles);

    // ── Entrance ──
    cubeGroup.scale.setScalar(0);
    const scaleTween = gsap.to(cubeGroup.scale, {
      x: 1, y: 1, z: 1, duration: 2, delay: 1.2, ease: 'elastic.out(1, 0.55)',
    });

    // ── Mouse tracking ──
    let mouseX = 0, mouseY = 0;
    const onMouse = (e: MouseEvent) => {
      mouseX = (e.clientX / window.innerWidth - 0.5) * 2;
      mouseY = (e.clientY / window.innerHeight - 0.5) * 2;
    };
    window.addEventListener('mousemove', onMouse);

    // ── Animation state ──
    let autoY   = Math.PI / 4;
    let curRotX = 0.54;
    let curRotY = Math.PI / 4;
    let curSep  = 0;
    let t       = 0;
    let rafId: number;
    let lastGlitch  = performance.now();
    let nextGlitchIn = 3500 + Math.random() * 3000;

    function animate() {
      rafId = requestAnimationFrame(animate);
      t += 0.016;
      autoY += 0.004;

      // Rotation w/ parallax
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
      innerGlowMat.opacity = curSep * 2.5;

      // Glitch trigger
      const now = performance.now();
      if (now - lastGlitch > nextGlitchIn) {
        lastGlitch = now;
        nextGlitchIn = 3500 + Math.random() * 3000;
        uGlitch.value = 1;
      }
      if (uGlitch.value > 0) uGlitch.value = Math.max(0, uGlitch.value - 0.06);

      // Update shared uniforms
      uTime.value = t;

      // Edge pulse
      edgeMat.opacity = 0.35 + Math.sin(t) * 0.15;

      // Particles drift
      particles.rotation.y += 0.002;
      particles.rotation.x += 0.0005;

      renderer.render(scene, camera);
    }
    animate();

    // ── Resize ──
    const ro = new ResizeObserver(() => {
      const w = container.clientWidth;
      const h = container.clientHeight;
      renderer.setSize(w, h);
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
    });
    ro.observe(container);

    // ── Cleanup ──
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
      innerGlowGeo.dispose();
      innerGlowMat.dispose();
      particleGeo.dispose();
      particleMat.dispose();
      renderer.dispose();
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
    };
  }, []);

  return <div ref={containerRef} className="absolute inset-0" style={{ pointerEvents: 'none' }} />;
}
