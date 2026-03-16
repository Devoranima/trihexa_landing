import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { gsap } from 'gsap';

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
    camera.lookAt(1.1, 0, 0);

    // light
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.4);
    scene.add(ambientLight);

    const dirLight = new THREE.DirectionalLight(0xffffff, 1.0);
    dirLight.position.set(2, 3, 4);
    // dirLight.position.set(0, 0.6, 5.5);
    scene.add(dirLight);

    const allMats: any[] = [];

    const loader = new THREE.TextureLoader();

    const diamond_normal = loader.load('DiamondPlate008C_1K-JPG_NormalGL.jpg');
    diamond_normal.wrapS = diamond_normal.wrapT = THREE.RepeatWrapping;
    diamond_normal.repeat.set(0.5, 0.5);

    const tiles_normal = loader.load('TilesCeramicHerringbone002_NRM_1K.png');
    tiles_normal.wrapS = tiles_normal.wrapT = THREE.RepeatWrapping;
    tiles_normal.repeat.set(0.5, 0.5);

    const penny_normal = loader.load('TilesMosaicPennyround001_NRM_1K.png');
    penny_normal.wrapS = penny_normal.wrapT = THREE.RepeatWrapping;
    penny_normal.repeat.set(0.5, 0.5);

    function makeMat(hex: number, pattern = 0) {
      let m = null;
      if (pattern == 1){
        m = new THREE.MeshStandardMaterial({
          color: hex,
          normalMap: tiles_normal,
          normalScale: new THREE.Vector2(1.5, 1.5),
          roughness: 0.6,
          metalness: 0.3,
          side: THREE.FrontSide
        });
      }
      else if (pattern == 2){
        m = new THREE.MeshStandardMaterial({
          color: hex,
          normalMap: penny_normal,
          normalScale: new THREE.Vector2(1.5, 1.5),
          roughness: 0.6,
          metalness: 0.3,
          side: THREE.FrontSide
        });
      }
      else if (pattern == 3){
        m = new THREE.MeshStandardMaterial({
          color: hex,
          normalMap: diamond_normal,
          normalScale: new THREE.Vector2(1.5, 1.5),
          roughness: 0.6,
          metalness: 0.3,
          side: THREE.FrontSide
        });
      }
      else{
        m = new THREE.MeshBasicMaterial({
          color: hex,
          side: THREE.FrontSide
        })
      }
      allMats.push(m);
      return m;
    }

    // cube faces
    // 6 PlaneGeometry faces positioned like a box.
    // primary faces use icon-exact colors; secondary faces are very dark.
    const faceGeo = new THREE.PlaneGeometry(2, 2);
    const cubeGroup = new THREE.Group();
    cubeGroup.position.x = 1.5;

    interface FaceRef { meshes: THREE.Mesh[]; basePos: THREE.Vector3; dir: THREE.Vector3 }
    const primaryFaces: FaceRef[] = [];

    function addFace(
      hex: number,
      px: number, py: number, pz: number,
      rx: number, ry: number, rz: number,
      primary: boolean,
      pattern = 0,
    ) {
      const front_mesh = new THREE.Mesh(faceGeo, makeMat(hex, pattern));
      const back_mesh = new THREE.Mesh(faceGeo, new THREE.MeshBasicMaterial({
        color: 0xAA0000,
        side: THREE.BackSide
      }))
      const meshes: THREE.Mesh[] = [front_mesh, back_mesh];
      
      for (const mesh of meshes){
        mesh.position.set(px, py, pz);
        mesh.rotation.set(rx, ry, rz);
        cubeGroup.add(mesh);
      } 
      if (primary) {
        primaryFaces.push({
          meshes,
          basePos: new THREE.Vector3(px, py, pz),
          dir: new THREE.Vector3(px, py, pz).normalize(),
        });
      }
    }

    // primary
    addFace(0xE80000, 0, 1, 0, -Math.PI / 2, 0, 0, true, 1);  // +Y top
    addFace(0xC40000, 0, 0, 1, 0, 0, 0, true, 3);  // +Z front
    addFace(0xD60000, 1, 0, 0, 0, Math.PI / 2, 0, true, 2);  // +X right
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
        side: THREE.FrontSide, // optional for outer layers, gives softer edge
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
        for (const mesh of f.meshes){
          mesh.position.copy(f.basePos).addScaledVector(f.dir, curSep);
        }
      }
      // innerGlowMat.opacity = curSep * 3;
      glowMats.forEach((mat, i) => {
        // mesh.scale.setScalar(glowLayers[i].scale * curSep*3.2);
        mat.opacity = glowLayers[i].opacity * curSep*3.5;
      });

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
