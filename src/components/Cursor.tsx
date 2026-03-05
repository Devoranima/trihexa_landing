import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';

export default function Cursor() {
  const dotRef  = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (window.matchMedia('(hover: none)').matches) return;

    const dot  = dotRef.current!;
    const ring = ringRef.current!;

    // show cursor elements (hidden by default for mobile)
    dot.style.display = 'block';
    ring.style.display = 'block';

    let mouseX = -100, mouseY = -100;
    let ringX  = -100, ringY  = -100;
    let raf: number;

    const onMove = (e: MouseEvent) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      gsap.set(dot, { x: mouseX - 4, y: mouseY - 4 });
    };

    const loop = () => {
      ringX += (mouseX - ringX) * 0.1;
      ringY += (mouseY - ringY) * 0.1;
      gsap.set(ring, { x: ringX - 18, y: ringY - 18 });
      raf = requestAnimationFrame(loop);
    };

    const enter = () => {
      gsap.to(ring, { scale: 1.3, borderColor: '#A80000', duration: 0.25 });
      gsap.to(dot, { scale: 0, duration: 0.25 });
    };

    const leave = () => {
      gsap.to(ring, { scale: 1, borderColor: 'rgba(244,244,244,0.5)', duration: 0.25 });
      gsap.to(dot, { scale: 1, duration: 0.25 });
    };

    window.addEventListener('mousemove', onMove);
    raf = requestAnimationFrame(loop);

    const targets = document.querySelectorAll('a, button, [data-cursor]');
    targets.forEach(el => {
      el.addEventListener('mouseenter', enter);
      el.addEventListener('mouseleave', leave);
    });

    return () => {
      window.removeEventListener('mousemove', onMove);
      cancelAnimationFrame(raf);
      dot.style.display = 'none';
      ring.style.display = 'none';
    };
  }, []);

  const sharedStyle: React.CSSProperties = {
    position: 'fixed',
    top: 0,
    left: 0,
    borderRadius: '50%',
    pointerEvents: 'none',
    willChange: 'transform',
    display: 'none',
  };

  return (
    <>
      <div
        ref={dotRef}
        style={{
          ...sharedStyle,
          width: 8,
          height: 8,
          background: '#A80000',
          zIndex: 9999,
        }}
      />
      <div
        ref={ringRef}
        style={{
          ...sharedStyle,
          width: 36,
          height: 36,
          border: '1px solid rgba(244,244,244,0.5)',
          zIndex: 9998,
        }}
      />
    </>
  );
}
