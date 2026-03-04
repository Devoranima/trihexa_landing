import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

/* ── Data ───────────────────────────────────────────────── */
const categories = [
  {
    id:      'car',
    number:  '01',
    label:   'Автомобиль',
    name:    'Автоковрики',
    tagline: 'EVA и резина с точным кроем под каждую модель. Защита салона от грязи, воды и реагентов.',
    bg:      '#0f0f10',
    items: [
      { name: 'Коврик в багажник',   desc: 'Полное покрытие грузового отсека, бортики от протечек' },
      { name: 'Коврик пассажира',    desc: 'Точная подгонка под переднее пассажирское место'       },
      { name: 'Коврик водителя',     desc: 'Усиленная пятка, антискользящий крепёж к полу'         },
    ],
    Visual: CarVisual,
    href:   '/car',
  },
  {
    id:      'indoor',
    number:  '02',
    label:   'Для дома',
    name:    'Домашние коврики',
    tagline: 'Каждый порог и угол — под контролем. Впитывающие, моющиеся, долговечные.',
    bg:      '#111621',
    items: [
      { name: 'Входной коврик',       desc: 'Грязезащитный с дренажными каналами для высокой проходимости' },
      { name: 'Коврик под обувь',     desc: 'Тонкий впитывающий вкладыш для прихожей'                     },
      { name: 'Коврик под раковину',   desc: 'Водонепроницаемый с поднятыми бортами'                       },
      { name: 'Коврик для питомца',   desc: 'Моющийся, устойчивый к когтям и шерсти'                      },
    ],
    Visual: IndoorVisual,
    href:   '/home',
  },
  {
    id:      'garage',
    number:  '03',
    label:   'Гараж',
    name:    'Гаражные системы',
    tagline: 'Промышленная защита пола от масла, реагентов и механических повреждений.',
    bg:      '#0c0c0d',
    items: [
      { name: 'Бампер-защита',          desc: 'Настенная защитная полоса в зоне бампера'      },
      { name: 'Парковочные линии',       desc: 'Цветные направляющие полосы для точной парковки' },
      { name: 'Противоскользящий коврик', desc: 'Текстурная резина для масляных и мокрых поверхностей' },
    ],
    Visual: GarageVisual,
    href:   '/garage',
  },
];

/* ── Text scramble component ────────────────────────────── */
function ScrambleText({ text, trigger }: { text: string; trigger: boolean }) {
  const [display, setDisplay] = useState(text);
  const triggeredRef = useRef(false);

  useEffect(() => {
    if (!trigger || triggeredRef.current) return;
    triggeredRef.current = true;

    const alphabet = 'АБВГДЕЖЗИКЛМНОПРСТУФХЦЧШЩЭЮЯ0123456789';
    const framesPerChar = 2;
    let frame = 0;
    const nonSpaceCount = text.replace(/ /g, '').length;
    const totalFrames = nonSpaceCount * framesPerChar;

    const id = setInterval(() => {
      setDisplay(
        text.split('').map((char, charIdx) => {
          if (char === ' ') return ' ';
          const nonSpaceBefore = text.slice(0, charIdx).replace(/ /g, '').length;
          const charFrame = nonSpaceBefore * framesPerChar;
          if (frame >= charFrame + framesPerChar) return char;
          if (frame < charFrame) return char;
          return alphabet[Math.floor(Math.random() * alphabet.length)];
        }).join(''),
      );
      frame++;
      if (frame > totalFrames) {
        clearInterval(id);
        setDisplay(text);
      }
    }, 25);

    return () => clearInterval(id);
  }, [trigger, text]);

  return <>{display}</>;
}

/* ── SVG Visuals (unchanged from original) ──────────────── */
function CarVisual() {
  return (
    <svg viewBox="0 0 200 340" fill="none" xmlns="http://www.w3.org/2000/svg"
         className="w-full max-w-[220px] mx-auto">
      <path d="M55 80 Q55 28 100 18 Q145 28 145 80 L152 228 Q152 268 118 278 L82 278 Q48 268 48 228 Z"
            stroke="#A80000" strokeWidth="1.5" fill="none" opacity="0.45" />
      <path d="M70 98 Q100 88 130 98 L126 136 Q100 128 74 136 Z" fill="#A80000" opacity="0.15" />
      <path d="M74 238 Q100 248 126 238 L129 252 Q100 264 71 252 Z" fill="#A80000" opacity="0.1" />
      <rect x="52" y="150" width="42" height="70" rx="3" stroke="#A80000" strokeWidth="1.5" fill="#A80000" fillOpacity="0.22" />
      <line x1="65" y1="158" x2="65" y2="212" stroke="#A80000" strokeWidth="0.5" opacity="0.4" />
      <line x1="52" y1="172" x2="94" y2="172" stroke="#A80000" strokeWidth="0.5" opacity="0.4" />
      <rect x="106" y="150" width="42" height="70" rx="3" stroke="#A80000" strokeWidth="1.5" fill="#A80000" fillOpacity="0.22" />
      <line x1="119" y1="158" x2="119" y2="212" stroke="#A80000" strokeWidth="0.5" opacity="0.4" />
      <line x1="106" y1="172" x2="148" y2="172" stroke="#A80000" strokeWidth="0.5" opacity="0.4" />
      <rect x="62" y="250" width="76" height="38" rx="3" stroke="#A80000" strokeWidth="1.5" fill="#A80000" fillOpacity="0.22" />
      <line x1="62" y1="264" x2="138" y2="264" stroke="#A80000" strokeWidth="0.5" opacity="0.4" />
      {[42, 158].map(cx => ([110, 228] as number[]).map(cy => (
        <ellipse key={`${cx}-${cy}`} cx={cx} cy={cy} rx="9" ry="17"
                 stroke="#A80000" strokeWidth="1" fill="none" opacity="0.25" />
      )))}
      <text x="73"  y="189" fontSize="6" fill="#A80000" opacity="0.7" textAnchor="middle" fontFamily="Inter">ВОД</text>
      <text x="127" y="189" fontSize="6" fill="#A80000" opacity="0.7" textAnchor="middle" fontFamily="Inter">ПАС</text>
      <text x="100" y="272" fontSize="6" fill="#A80000" opacity="0.7" textAnchor="middle" fontFamily="Inter">БАГАЖ</text>
    </svg>
  );
}

function IndoorVisual() {
  return (
    <svg viewBox="0 0 240 200" fill="none" xmlns="http://www.w3.org/2000/svg"
         className="w-full max-w-[260px] mx-auto">
      <rect x="20" y="20" width="200" height="160" rx="2" stroke="#A80000" strokeWidth="1" fill="none" opacity="0.25" />
      <rect x="82" y="15" width="76" height="22" rx="2" stroke="#A80000" strokeWidth="1.5" fill="#A80000" fillOpacity="0.2" />
      {[90, 98, 106, 114, 122, 130, 138, 146].map(x => (
        <line key={x} x1={x} y1="18" x2={x} y2="34" stroke="#A80000" strokeWidth="0.5" opacity="0.5" />
      ))}
      <text x="120" y="29" fontSize="5.5" fill="#A80000" opacity="0.7" textAnchor="middle" fontFamily="Inter">ВХОД</text>
      <rect x="38" y="60" width="55" height="35" rx="2" stroke="#A80000" strokeWidth="1.5" fill="#A80000" fillOpacity="0.15" />
      <text x="65" y="81" fontSize="5.5" fill="#A80000" opacity="0.6" textAnchor="middle" fontFamily="Inter">ОБУВЬ</text>
      <rect x="148" y="55" width="52" height="30" rx="2" stroke="#A80000" strokeWidth="1.5" fill="#A80000" fillOpacity="0.15" />
      <rect x="150" y="57" width="48" height="26" rx="1" stroke="#A80000" strokeWidth="0.5" fill="none" opacity="0.4" />
      <text x="174" y="73" fontSize="5.5" fill="#A80000" opacity="0.6" textAnchor="middle" fontFamily="Inter">РАКОВИНА</text>
      <rect x="68" y="130" width="104" height="38" rx="4" stroke="#A80000" strokeWidth="1.5" fill="#A80000" fillOpacity="0.15" />
      {[88, 108, 132, 152].map((x, i) => (
        <circle key={i} cx={x} cy="149" r="4" fill="#A80000" opacity="0.3" />
      ))}
      <text x="120" y="161" fontSize="5.5" fill="#A80000" opacity="0.6" textAnchor="middle" fontFamily="Inter">ПИТОМЕЦ</text>
      <path d="M82 15 Q82 5 94 5 L158 5 Q170 5 170 15" stroke="#A80000" strokeWidth="0.5" fill="none" opacity="0.3" />
    </svg>
  );
}

function GarageVisual() {
  return (
    <svg viewBox="0 0 240 200" fill="none" xmlns="http://www.w3.org/2000/svg"
         className="w-full max-w-[260px] mx-auto">
      <rect x="30" y="20" width="180" height="160" rx="2" stroke="#A80000" strokeWidth="1" fill="none" opacity="0.2" />
      <line x1="30"  y1="20"  x2="30"  y2="180" stroke="#A80000" strokeWidth="2"   opacity="0.6" />
      <line x1="90"  y1="20"  x2="90"  y2="180" stroke="#A80000" strokeWidth="2"   opacity="0.6" />
      <line x1="150" y1="20"  x2="150" y2="180" stroke="#A80000" strokeWidth="2"   opacity="0.6" />
      <line x1="210" y1="20"  x2="210" y2="180" stroke="#A80000" strokeWidth="2"   opacity="0.6" />
      <line x1="30" y1="100" x2="210" y2="100" stroke="#A80000" strokeWidth="0.5" opacity="0.25" strokeDasharray="6 4" />
      <rect x="30" y="18" width="180" height="10" rx="1" stroke="#A80000" strokeWidth="1.5" fill="#A80000" fillOpacity="0.25" />
      <text x="120" y="26" fontSize="5.5" fill="#A80000" opacity="0.8" textAnchor="middle" fontFamily="Inter">БАМПЕР-ЗАЩИТА</text>
      <rect x="36" y="60" width="48" height="90" rx="2" stroke="#A80000" strokeWidth="1.5" fill="#A80000" fillOpacity="0.12" />
      {[40, 48, 56, 64, 72, 80].map(y => (
        <line key={y} x1="36" y1={y} x2="84" y2={y} stroke="#A80000" strokeWidth="0.4" opacity="0.35" />
      ))}
      <text x="60" y="110" fontSize="5.5" fill="#A80000" opacity="0.6" textAnchor="middle" fontFamily="Inter">АНТИСЛИП</text>
      <path d="M100 85 Q120 75 140 85 L142 130 Q120 138 98 130 Z" stroke="#A80000" strokeWidth="1" fill="none" opacity="0.2" />
      <text x="60"  y="175" fontSize="5" fill="#A80000" opacity="0.4" textAnchor="middle" fontFamily="Inter">ЗОНА 1</text>
      <text x="120" y="175" fontSize="5" fill="#A80000" opacity="0.4" textAnchor="middle" fontFamily="Inter">ЗОНА 2</text>
      <text x="180" y="175" fontSize="5" fill="#A80000" opacity="0.4" textAnchor="middle" fontFamily="Inter">ЗОНА 3</text>
    </svg>
  );
}

/* ── Horizontal panel ───────────────────────────────────── */
function HPanel({
  cat,
  active,
}: {
  cat: (typeof categories)[number];
  active: boolean;
}) {
  const itemsRef = useRef<HTMLUListElement>(null);
  const hasAnimated = useRef(false);

  useEffect(() => {
    if (!active || hasAnimated.current) return;
    hasAnimated.current = true;
    gsap.fromTo(
      Array.from(itemsRef.current?.children ?? []),
      { x: -30, opacity: 0 },
      { x: 0, opacity: 1, duration: 0.5, stagger: 0.1, ease: 'power2.out' },
    );
  }, [active]);

  const { Visual } = cat;

  return (
    <div
      className="flex-shrink-0 h-full flex items-center relative overflow-hidden"
      style={{ width: '100vw', backgroundColor: cat.bg }}
    >
      {/* Number watermark */}
      <div
        className="absolute font-display text-[20rem] leading-none text-th-red/[0.04] select-none pointer-events-none"
        style={{ right: '-2rem', top: '50%', transform: 'translateY(-50%)' }}
      >
        {cat.number}
      </div>

      <div className="w-full px-6 lg:px-16 grid lg:grid-cols-2 gap-12 items-center relative z-10"
           style={{ maxWidth: '1280px', margin: '0 auto' }}>

        {/* Text side */}
        <div className="flex flex-col justify-center py-10 lg:py-0">
          <span className="text-th-red text-[0.6rem] tracking-[0.45em] uppercase font-semibold mb-3 flex items-center gap-3">
            <span className="block w-6 h-px bg-th-red" />
            {cat.label}
          </span>

          <h2
            className="font-display text-th-white leading-none mb-5 scramble-target glitch"
            style={{ fontSize: 'clamp(3rem, 6vw, 6rem)' }}
            data-text={cat.name}
          >
            <ScrambleText text={cat.name} trigger={active} />
          </h2>

          <p className="text-th-light/45 text-sm lg:text-base leading-relaxed max-w-[38ch] mb-8">
            {cat.tagline}
          </p>

          <ul ref={itemsRef} className="space-y-3">
            {cat.items.map(item => (
              <li key={item.name} className="flex items-start gap-4 group">
                <span className="mt-[0.35rem] block w-5 h-px bg-th-red shrink-0 transition-all duration-300 group-hover:w-8" />
                <div>
                  <div className="text-th-white text-sm font-semibold tracking-wide">{item.name}</div>
                  <div className="text-th-light/35 text-xs mt-0.5">{item.desc}</div>
                </div>
              </li>
            ))}
          </ul>

          <a href={cat.href} className="mt-10 flex items-center gap-3 text-th-red text-[0.65rem] tracking-[0.35em] uppercase font-semibold hover:text-th-white transition-colors duration-200">
            <span className="w-8 h-px bg-th-red transition-all duration-200 group-hover:w-12" />
            Подробнее
          </a>
        </div>

        {/* Visual side */}
        <div className="flex items-center justify-center relative py-10 lg:py-0 min-h-[240px] lg:min-h-0">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(168,0,0,0.07),transparent_70%)]" />
          <div className="absolute inset-0 hex-pattern opacity-20" />
          <div className="relative z-10 w-full max-w-sm">
            <Visual />
          </div>
        </div>
      </div>
    </div>
  );
}

/* ── Section ────────────────────────────────────────────── */
export default function Products() {
  const headerRef  = useRef<HTMLDivElement>(null);
  const pinRef     = useRef<HTMLDivElement>(null);
  const trackRef   = useRef<HTMLDivElement>(null);
  const [activePanel, setActivePanel] = useState(0);

  useEffect(() => {
    const ctx = gsap.context(() => {
      /* Header reveal */
      gsap.fromTo(headerRef.current,
        { y: 50, opacity: 0 },
        {
          y: 0, opacity: 1, duration: 1, ease: 'power3.out',
          scrollTrigger: { trigger: headerRef.current, start: 'top 80%' },
        });

      /* Horizontal scroll pin */
      gsap.to(trackRef.current, {
        x: () => -(window.innerWidth * 2),
        ease: 'none',
        scrollTrigger: {
          trigger: pinRef.current,
          pin: true,
          scrub: 1,
          start: 'top top',
          end: () => '+=' + window.innerWidth * 2,
          invalidateOnRefresh: true,
          onUpdate: self => {
            setActivePanel(Math.round(self.progress * 2));
          },
        },
      });
    });

    return () => ctx.revert();
  }, []);

  return (
    <section id="products" className="bg-th-dark">
      {/* Section header */}
      <div ref={headerRef} className="max-w-7xl mx-auto px-6 lg:px-16 pt-24 pb-16">
        <div className="flex items-center gap-6 mb-6">
          <span className="block h-px w-10 bg-th-red" />
          <span className="text-th-red text-[0.6rem] tracking-[0.45em] uppercase font-semibold">
            Каталог продукции
          </span>
        </div>
        <h2
          className="font-display text-th-white leading-none"
          style={{ fontSize: 'clamp(3rem, 8vw, 7.5rem)' }}
        >
          ЧТО МЫ <span className="text-th-red">ДЕЛАЕМ</span>
        </h2>
        <p className="text-th-light/40 text-sm mt-4 max-w-[50ch] leading-relaxed">
          Три направления — один стандарт качества. Каждый коврик кроится, обрабатывается
          и проходит контроль с точностью до миллиметра.
        </p>
      </div>

      {/* Scrolling marquee */}
      <div className="overflow-hidden border-y border-th-red/15 bg-th-red/5 py-3">
        <div className="marquee-inner inline-flex gap-12">
          {Array(8).fill(['АВТОКОВРИКИ', 'ДЛЯ ДОМА', 'ГАРАЖНЫЕ СИСТЕМЫ', 'ТРИХЕКСА']).flat().map((t, i) => (
            <span key={i} className="font-display text-th-light/15 text-xl tracking-widest whitespace-nowrap">
              <span className="text-th-red/40">·</span> {t}
            </span>
          ))}
        </div>
      </div>

      {/* Pinned horizontal scroll container */}
      <div
        ref={pinRef}
        style={{ height: '100vh', overflow: 'hidden', position: 'relative' }}
      >
        {/* Track — 3 × 100vw */}
        <div
          ref={trackRef}
          style={{ display: 'flex', width: '300vw', height: '100%' }}
        >
          {categories.map((cat, i) => (
            <HPanel key={cat.id} cat={cat} active={activePanel === i} />
          ))}
        </div>

        {/* Progress dots */}
        <div
          style={{
            position: 'absolute',
            bottom: 32,
            left: '50%',
            transform: 'translateX(-50%)',
            display: 'flex',
            gap: 10,
            zIndex: 10,
          }}
        >
          {categories.map((cat, i) => (
            <div
              key={cat.id}
              style={{
                width: activePanel === i ? 24 : 8,
                height: 8,
                borderRadius: 4,
                backgroundColor: activePanel === i ? '#A80000' : 'rgba(244,244,244,0.2)',
                transition: 'all 0.3s ease',
              }}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
