import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';

export default function Intro() {
  const overlayRef = useRef<HTMLDivElement>(null);
  const logoRef    = useRef<HTMLImageElement>(null);
  const lineRef    = useRef<HTMLDivElement>(null);
  const titleRef   = useRef<HTMLDivElement>(null);
  const tagRef     = useRef<HTMLParagraphElement>(null);

  useEffect(() => {
    const overlay = overlayRef.current;
    if (!overlay) return;

    document.body.style.overflow = 'hidden';

    const tl = gsap.timeline({
      onComplete: () => {
        document.body.style.overflow = '';
        gsap.set(overlay, { display: 'none' });
      },
    });

    // 1. Logo: scale + rotate in
    tl.fromTo(
      logoRef.current,
      { scale: 0, rotation: 180, opacity: 0 },
      { scale: 1, rotation: 0, opacity: 1, duration: 0.9, ease: 'elastic.out(1, 0.6)' },
      0,
    );

    // 2. Red line sweeps left → right
    tl.fromTo(
      lineRef.current,
      { scaleX: 0 },
      { scaleX: 1, duration: 0.4, ease: 'power3.inOut' },
      0.8,
    );

    // 3. Title chars stagger in
    const chars = titleRef.current?.querySelectorAll('.intro-char') ?? [];
    tl.fromTo(
      chars,
      { y: 40, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.5, stagger: 0.06, ease: 'power3.out' },
      1.0,
    );

    // 4. Tagline fades in
    tl.fromTo(
      tagRef.current,
      { opacity: 0, y: 10 },
      { opacity: 1, y: 0, duration: 0.5, ease: 'power2.out' },
      1.8,
    );

    // 5. Clip-path wipe upward
    tl.to(
      overlay,
      {
        clipPath: 'polygon(0% 0%, 100% 0%, 100% 0%, 0% 0%)',
        duration: 0.7,
        ease: 'power3.inOut',
      },
      2.2,
    );

    return () => {
      tl.kill();
      document.body.style.overflow = '';
    };
  }, []);

  return (
    <div
      ref={overlayRef}
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 10000,
        backgroundColor: '#1A1A1B',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        clipPath: 'polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)',
      }}
    >
      {/* Logo */}
      <img
        ref={logoRef}
        src="/ICON.svg"
        alt="TriHexa"
        style={{ width: 80, height: 80, marginBottom: 24, opacity: 0 }}
      />

      {/* Red sweep line */}
      <div
        ref={lineRef}
        style={{
          width: 200,
          height: 2,
          backgroundColor: '#A80000',
          transformOrigin: 'left center',
          transform: 'scaleX(0)',
          marginBottom: 24,
        }}
      />

      {/* Title */}
      <div ref={titleRef} style={{ display: 'flex', overflow: 'hidden' }}>
        {'TRIHEXA'.split('').map((char, i) => (
          <span
            key={i}
            className="intro-char"
            style={{
              fontFamily: "'Bebas Neue', cursive",
              fontSize: 'clamp(3rem, 10vw, 7rem)',
              color: '#ffffff',
              lineHeight: 1,
              display: 'inline-block',
              opacity: 0,
            }}
          >
            {char}
          </span>
        ))}
      </div>

      {/* Tagline */}
      <p
        ref={tagRef}
        style={{
          marginTop: 16,
          color: 'rgba(244,244,244,0.4)',
          fontSize: '0.7rem',
          letterSpacing: '0.4em',
          textTransform: 'uppercase',
          fontFamily: "'Inter', sans-serif",
          opacity: 0,
        }}
      >
        Коврики нового уровня
      </p>
    </div>
  );
}
