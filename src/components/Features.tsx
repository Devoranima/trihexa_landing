import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

/* ── Data ───────────────────────────────────────────────── */
const features = [
  {
    icon: (
      <svg viewBox="0 0 40 40" fill="none" className="w-10 h-10">
        <path d="M20 4L36 13V27L20 36L4 27V13L20 4Z" stroke="#A80000" strokeWidth="1.5" />
        <path d="M20 12L28 17V23L20 28L12 23V17L20 12Z" fill="#A80000" opacity="0.25" />
        <circle cx="20" cy="20" r="2" fill="#A80000" />
      </svg>
    ),
    title:  'Нескользящая основа',
    detail: 'Вулканизированные резиновые шипы надёжно фиксируют коврик на любом покрытии — плитка, ламинат, бетон.',
  },
  {
    icon: (
      <svg viewBox="0 0 40 40" fill="none" className="w-10 h-10">
        <rect x="4" y="18" width="32" height="4" stroke="#A80000" strokeWidth="1.5" />
        <line x1="20" y1="4" x2="20" y2="36" stroke="#A80000" strokeWidth="1.5" />
        <rect x="10" y="12" width="20" height="16" stroke="#A80000" strokeWidth="0.75" opacity="0.4" />
        <circle cx="20" cy="20" r="2.5" fill="#A80000" />
        <line x1="4" y1="13" x2="8" y2="13" stroke="#A80000" strokeWidth="1" />
        <line x1="32" y1="13" x2="36" y2="13" stroke="#A80000" strokeWidth="1" />
      </svg>
    ),
    title:  'Точный крой',
    detail: 'ЧПУ-нарезка с допуском ±1 мм по лекалам вашего автомобиля или помещения. Без зазоров, без перехлёстов.',
  },
  {
    icon: (
      <svg viewBox="0 0 40 40" fill="none" className="w-10 h-10">
        <path d="M20 5C20 5 8 11 8 21C8 27.6 13.4 33 20 33C26.6 33 32 27.6 32 21C32 11 20 5 20 5Z"
              stroke="#A80000" strokeWidth="1.5" />
        <path d="M14 21C14 24.3 16.7 27 20 27" stroke="#A80000" strokeWidth="1" strokeLinecap="round" opacity="0.5" />
        <circle cx="20" cy="21" r="3" fill="#A80000" opacity="0.3" />
        <line x1="20" y1="5" x2="20" y2="10" stroke="#A80000" strokeWidth="1.5" opacity="0.4" />
      </svg>
    ),
    title:  'Стойкость к погоде',
    detail: 'UV-стабильные компаунды не выгорают, не трескаются и не деформируются от жары и мороза.',
  },
  {
    icon: (
      <svg viewBox="0 0 40 40" fill="none" className="w-10 h-10">
        <rect x="8" y="28" width="24" height="5" rx="1" stroke="#A80000" strokeWidth="1.5" />
        <path d="M12 28V18M28 28V18" stroke="#A80000" strokeWidth="1.5" strokeLinecap="round" />
        <path d="M8 18H32" stroke="#A80000" strokeWidth="1.5" />
        <path d="M15 18C15 14.7 17.7 12 21 12"
              stroke="#A80000" strokeWidth="1" strokeLinecap="round" opacity="0.5" />
        <circle cx="21" cy="10" r="2" fill="#A80000" opacity="0.4" />
      </svg>
    ),
    title:  'Лёгкая чистка',
    detail: 'Структура ячеек отталкивает воду, грязь и шерсть. Промыл — и готово.',
  },
  {
    icon: (
      <svg viewBox="0 0 40 40" fill="none" className="w-10 h-10">
        <path d="M8 20L16 28L32 12" stroke="#A80000" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        <circle cx="20" cy="20" r="14" stroke="#A80000" strokeWidth="1" opacity="0.25" />
      </svg>
    ),
    title:  'Контроль качества',
    detail: 'Каждая партия проходит 12 этапов проверки перед отправкой с производства.',
  },
  {
    icon: (
      <svg viewBox="0 0 40 40" fill="none" className="w-10 h-10">
        <path d="M6 20H34M20 6V34" stroke="#A80000" strokeWidth="1.5" strokeLinecap="round" />
        <rect x="10" y="10" width="20" height="20" stroke="#A80000" strokeWidth="1" opacity="0.3" />
        <rect x="14" y="14" width="12" height="12" stroke="#A80000" strokeWidth="0.75" opacity="0.2" />
      </svg>
    ),
    title:  'Под любой размер',
    detail: 'Изготовим нестандартные размеры для спецтехники, промышленных зон и нетиповых планировок.',
  },
];

const stats = [
  { value: '3',   unit: '',   label: 'Линейки продукции'  },
  { value: '10',  unit: '+',  label: 'Видов ковриков'     },
  { value: '1',   unit: 'мм', label: 'Допуск нарезки'     },
  { value: '100', unit: '%',  label: 'Точный крой'        },
];

/* ── Counter hook ───────────────────────────────────────── */
function useCounter(target: number, trigger: Element | null) {
  const ref = useRef<HTMLSpanElement>(null);
  useEffect(() => {
    if (!ref.current || !trigger) return;
    const obj = { val: 0 };
    const anim = gsap.to(obj, {
      val: target,
      duration: 2,
      ease: 'power2.out',
      onUpdate: () => { if (ref.current) ref.current.textContent = Math.round(obj.val).toString(); },
      scrollTrigger: { trigger, start: 'top 75%', once: true },
    });
    return () => { anim.kill(); };
  }, [target, trigger]);
  return ref;
}

function Stat({ value, unit, label }: (typeof stats)[number]) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const numRef  = useCounter(parseInt(value), wrapRef.current);

  return (
    <div ref={wrapRef} className="text-center">
      <div className="font-display text-th-white" style={{ fontSize: 'clamp(3rem, 5vw, 5.5rem)', lineHeight: 1 }}>
        <span ref={numRef}>{value}</span>
        <span className="text-th-red">{unit}</span>
      </div>
      <div className="text-th-light/40 text-[0.6rem] tracking-[0.4em] uppercase mt-2">{label}</div>
    </div>
  );
}

/* ── Main component ─────────────────────────────────────── */
export default function Features() {
  const sectionRef  = useRef<HTMLElement>(null);
  const headerRef   = useRef<HTMLDivElement>(null);
  const statsRef    = useRef<HTMLDivElement>(null);
  const cardsRef    = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      /* Header */
      gsap.fromTo(headerRef.current,
        { y: 50, opacity: 0 },
        { y: 0, opacity: 1, duration: 1, ease: 'power3.out',
          scrollTrigger: { trigger: headerRef.current, start: 'top 80%' } });

      /* Stats row */
      gsap.fromTo(Array.from(statsRef.current?.children ?? []),
        { y: 40, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.7, stagger: 0.15, ease: 'power3.out',
          scrollTrigger: { trigger: statsRef.current, start: 'top 78%' } });

      /* Feature cards */
      gsap.fromTo(Array.from(cardsRef.current?.children ?? []),
        { y: 50, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.65, stagger: 0.1, ease: 'power3.out',
          scrollTrigger: { trigger: cardsRef.current, start: 'top 75%' } });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      id="features"
      className="bg-th-navy relative overflow-hidden"
    >
      {/* Subtle grid */}
      <div className="absolute inset-0 grid-pattern opacity-30" />
      {/* Red side accent */}
      <div className="absolute right-0 top-0 bottom-0 w-[3px] bg-gradient-to-b from-th-red/0 via-th-red/50 to-th-red/0" />

      <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-16 py-28">

        {/* Header */}
        <div ref={headerRef} className="mb-20">
          <div className="flex items-center gap-4 mb-6">
            <span className="block w-10 h-px bg-th-red" />
            <span className="text-th-red text-[0.6rem] tracking-[0.45em] uppercase font-semibold">
              Почему TriHexa
            </span>
          </div>
          <h2
            className="font-display text-th-white leading-none mb-5"
            style={{ fontSize: 'clamp(3rem, 8vw, 7.5rem)' }}
          >
            СДЕЛАНО <span className="text-th-red">НАДОЛГО</span>
          </h2>
          <p className="text-th-light/40 text-sm max-w-[50ch] leading-relaxed">
            Каждый коврик TriHexa — результат работы с материалами, точного производства
            и многоступенчатого контроля качества.
          </p>
        </div>

        {/* Stats */}
        <div
          ref={statsRef}
          className="grid grid-cols-2 lg:grid-cols-4 gap-8 mb-20 py-12 border-y border-th-red/15"
        >
          {stats.map(s => <Stat key={s.label} {...s} />)}
        </div>

        {/* Feature cards */}
        <div
          ref={cardsRef}
          className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {features.map(f => (
            <div
              key={f.title}
              className="feature-card bg-th-dark/60 p-8 border border-th-white/6 hover:border-th-red/30 transition-all duration-400 group"
            >
              <div className="mb-6 transition-transform duration-300 group-hover:scale-110 group-hover:translate-y-[-2px]">
                {f.icon}
              </div>
              <h3 className="text-th-white font-semibold tracking-wide mb-3 text-base">
                {f.title}
              </h3>
              <p className="text-th-light/40 text-sm leading-relaxed">
                {f.detail}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
