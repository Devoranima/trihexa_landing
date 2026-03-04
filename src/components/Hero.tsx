import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import CubeScene from './CubeScene';

export default function Hero() {
  const sectionRef  = useRef<HTMLElement>(null);
  const eyebrowRef  = useRef<HTMLDivElement>(null);
  const titleRef    = useRef<HTMLDivElement>(null);
  const dividerRef  = useRef<HTMLDivElement>(null);
  const taglineRef  = useRef<HTMLParagraphElement>(null);
  const ctasRef     = useRef<HTMLDivElement>(null);
  const scrollRef   = useRef<HTMLDivElement>(null);
  const accentARef  = useRef<HTMLDivElement>(null);
  const accentBRef  = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ delay: 1.4 });

      /* Red accent bars */
      tl.fromTo(accentARef.current,
        { scaleY: 0, transformOrigin: 'top center' },
        { scaleY: 1, duration: 1.1, ease: 'power3.out' }, 0);

      tl.fromTo(accentBRef.current,
        { scaleY: 0, transformOrigin: 'bottom center' },
        { scaleY: 1, duration: 0.9, ease: 'power3.out' }, 0.2);

      /* Eyebrow */
      tl.fromTo(eyebrowRef.current,
        { x: -60, opacity: 0 },
        { x: 0,   opacity: 1, duration: 0.8, ease: 'power3.out' }, 0.1);

      /* Title */
      tl.fromTo(titleRef.current,
        { x: -100, opacity: 0, skewX: -6 },
        { x: 0,    opacity: 1, skewX: 0, duration: 0.95, ease: 'power3.out' }, 0.28);

      /* Divider sweep */
      tl.fromTo(dividerRef.current,
        { scaleX: 0, transformOrigin: 'left center' },
        { scaleX: 1, duration: 0.7, ease: 'power3.inOut' }, 0.86);

      /* Tagline */
      tl.fromTo(taglineRef.current,
        { y: 28, opacity: 0 },
        { y: 0,  opacity: 1, duration: 0.75, ease: 'power2.out' }, 1.06);

      /* CTAs */
      tl.fromTo(Array.from(ctasRef.current?.children ?? []),
        { y: 22, opacity: 0 },
        { y: 0,  opacity: 1, duration: 0.55, stagger: 0.14, ease: 'power2.out' }, 1.31);

      /* Scroll indicator */
      tl.fromTo(scrollRef.current,
        { opacity: 0, y: -8 },
        { opacity: 1, y: 0, duration: 0.5, ease: 'power2.out' }, 1.76);

      /* Continuous: scroll dot bounce */
      gsap.to('.scroll-pulse', {
        y: 14, duration: 1.3, ease: 'power2.inOut', repeat: -1, yoyo: true,
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative min-h-screen overflow-hidden bg-th-dark"
      id="hero"
    >
      {/* Three.js canvas — fills entire section */}
      <CubeScene />

      {/* Hex/grid background pattern (shows through transparent canvas) */}
      <div className="absolute inset-0 hex-pattern grid-pattern opacity-30 pointer-events-none" />

      {/* Left gradient overlay for text readability */}
      <div className="absolute inset-0 bg-gradient-to-r from-th-dark via-th-dark/80 to-transparent pointer-events-none" />

      {/* Radial vignette */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_75%_50%,rgba(27,38,59,0.4)_0%,transparent_60%)] pointer-events-none" />

      {/* Corner accents */}
      <div className="absolute top-0 right-0 w-36 h-36 border-r border-t border-th-red/20 pointer-events-none" />
      <div className="absolute bottom-0 left-0  w-36 h-36 border-l border-b border-th-red/20 pointer-events-none" />

      {/* Left red accent bar */}
      <div ref={accentARef} className="absolute left-0 top-0 bottom-0 w-[3px] bg-gradient-to-b from-th-red/0 via-th-red/60 to-th-red/0 pointer-events-none" />

      {/* Right thin vertical accent */}
      <div ref={accentBRef} className="absolute right-[8%] top-[8%] bottom-[8%] w-px bg-th-red/15 pointer-events-none" />

      {/* ── Text overlay — left 52% ──────────────────────────── */}
      <div className="absolute inset-0 flex items-center pointer-events-none">
        <div className="w-full max-w-7xl mx-auto px-6 lg:px-16 pt-28 pb-20 pointer-events-auto" style={{ maxWidth: '52%', paddingLeft: 'clamp(1.5rem, 4vw, 4rem)' }}>

          {/* Eyebrow */}
          <div ref={eyebrowRef} className="flex items-center gap-4 mb-5">
            <span className="block w-10 h-px bg-th-red" />
            <span className="text-th-red text-[0.65rem] tracking-[0.45em] uppercase font-semibold">
              Автомобиль · Дом · Гараж
            </span>
          </div>

          {/* Title */}
          <div ref={titleRef}>
            <h1
              className="font-display leading-none text-th-white"
              style={{ fontSize: 'clamp(5rem, 13vw, 12rem)' }}
            >
              TRI<span className="text-th-red">HEXA</span>
            </h1>
          </div>

          {/* Divider */}
          <div ref={dividerRef} className="h-[3px] w-28 bg-th-red mt-5 mb-7" />

          {/* Tagline */}
          <p ref={taglineRef} className="text-th-light/55 text-base lg:text-lg max-w-[42ch] leading-relaxed">
            Производим коврики из EVA-полимера и резины для салона, багажника
            и гаража. Точный крой под каждую модель — без зазоров, без смещений.
          </p>

          {/* CTAs */}
          <div ref={ctasRef} className="flex flex-wrap gap-4 mt-10">
            <a
              href="#products"
              className="mag-btn px-8 py-4 bg-th-red text-white text-[0.7rem] tracking-[0.28em] uppercase font-semibold hover:bg-[#8a0000] transition-colors duration-300"
            >
              Каталог продукции
            </a>
            <a
              href="#contact"
              className="mag-btn px-8 py-4 border border-th-light/25 text-th-light/75 hover:border-th-light hover:text-th-white text-[0.7rem] tracking-[0.28em] uppercase font-semibold transition-all duration-300"
            >
              Запросить цену
            </a>
          </div>

          {/* Stats row */}
          <div className="flex gap-10 mt-14 pt-8 border-t border-th-white/8">
            {[
              { value: '3',    label: 'Линейки' },
              { value: '10+',  label: 'Видов ковриков'  },
              { value: '100%', label: 'Точный крой' },
            ].map(s => (
              <div key={s.label}>
                <div className="font-display text-3xl text-th-white leading-none">{s.value}</div>
                <div className="text-th-light/40 text-[0.65rem] tracking-[0.3em] uppercase mt-1">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Scroll indicator ──────────────────────────────────── */}
      <div
        ref={scrollRef}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 pointer-events-none"
      >
        <span className="text-th-light/30 text-[0.6rem] tracking-[0.45em] uppercase">Листайте</span>
        <div className="relative w-px h-14 bg-th-white/10 overflow-hidden">
          <div className="scroll-pulse absolute top-0 left-0 w-full h-5 bg-gradient-to-b from-th-red to-transparent" />
        </div>
      </div>
    </section>
  );
}
