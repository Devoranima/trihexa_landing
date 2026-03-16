import { useEffect, useRef, useState, useCallback } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const ALL_PRODUCTS_LINKS: Record<string, string> = {
  Ozon: "...",
  Wildberries: "...",
};

/* types */
interface Product {
  name: string;
  desc: string;
  features: string[];
  images?: string[];
  links?: Record<(typeof MARKETPLACES)[number], string>;
}

interface CategoryData {
  number: string;
  label: string;
  name: string;
  description: string;
  bg: string;
  products: Product[];
  also?: string[];
}

/* category data */
const DATA: Record<string, CategoryData> = {
  car: {
    number: "01",
    label: "Автомобиль",
    name: "Автоковрики",
    description:
      "TPE и резина с точным кроем под каждую модель. Защита салона от грязи, воды и реагентов — круглый год.",
    bg: "#0f0f10",
    products: [
      {
        name: "Коврик в багажник",
        desc: "Полное покрытие грузового отсека с поднятыми бортиками. Защита от протечек, грязи и механических повреждений.",
        features: [
          "Бортики 30 мм",
          "TPE-полимер",
          "Индивидуальный крой",
          "Простая установка",
        ],
        images: [
          "mat_trunk_niva_legend.webp",
          "mat_trunk_travel.webp",
          "mat_trunk_omada_perspective.webp",
          "mat_trunk_lada_perspective.webp",
        ],
        links: { Ozon: "#", Wildberries: "#" },
      },
      {
        name: "Коврик пассажира",
        desc: "Точная подгонка под переднее пассажирское место. Надёжная фиксация и простой уход.",
        features: [
          "Точная подгонка",
          "Нескользящая основа",
          "Лёгкая чистка",
          "Стойкость к реагентам",
        ],
      },
      {
        name: "Коврик водителя",
        desc: "Усиленная зона пятки для максимальной износостойкости. Антискользящий крепёж к полу автомобиля.",
        features: [
          "Усиленная пятка",
          "Антискользящий крепёж",
          "Повышенная износостойкость",
          "Точный крой",
        ],
        images: [
          "mat_driver_lada_vesta.webp",
          "mat_driver_duster.webp",
          "mat_driver_duster_2.webp",
        ],
      },
    ],
  },
  home: {
    number: "02",
    label: "Для дома",
    name: "Домашние коврики",
    description:
      "Каждый порог и угол — под контролем. Задерживающие грязь, моющиеся, долговечные коврики для любого помещения.",
    bg: "#111621",
    products: [
      {
        name: "Входной коврик",
        desc: "Грязезащитный коврик с дренажными каналами для зон с высокой проходимостью. Тонкий профиль не мешает двери, собирает влагу и грязь.",
        features: [
          "Грязезащитный",
          "Дренажные каналы",
          "Тонкий профиль",
          "Устойчив к влаге",
          "Моющийся",
        ],
        images: [
          "mat_wave.webp",
          "mat_door_boots_water.webp",
          "mat_door_boots_snow.webp",
          "mat_door_boots_snow_closeup.webp",
        ],
        links: { Ozon: "" },
      },
      {
        name: "Коврик под раковину",
        desc: "Водонепроницаемый коврик с поднятыми бортами. Защищает пол от протечек на кухне и в ванной.",
        features: [
          "Водонепроницаемый",
          "Бортики от протечек",
          "Лёгкая установка",
          "Кухня / ванная",
        ],
        images: ["mat_sink.webp"],
      },
      {
        name: "Коврик для питомца",
        desc: "Моющийся коврик, устойчивый к когтям и шерсти. Гипоаллергенный, не впитывает запахи.",
        features: [
          "Устойчив к когтям",
          "Моющийся",
          "Гипоаллергенный",
          "Не впитывает запахи",
        ],
        images: ["mat_pet.webp", "mat_pet_bend.webp"],
      },
    ],
    also: ["Коврик для шкафа", "Коврик в прихожую с ворсом"],
  },
  garage: {
    number: "03",
    label: "Гараж",
    name: "Гаражные системы",
    description:
      "Промышленная защита пола от масла, реагентов и механических повреждений. Для гаража, мастерской и паркинга.",
    bg: "#0c0c0d",
    products: [
      {
        name: "Коврики под бампер",
        desc: "Защита пола от масла и грязи под бампером. Для обслуживания авто и защиты от подтеков.",
        features: [
          "Удобные",
          "Защита от грязи",
          "Хорошо держатся",
          "Универсальный размер",
        ],
        images: ["mat_bumper.webp"],
      },
      {
        name: "Гаражные полосы",
        desc: "Полосы для защиты пола от грязи колес. Нескользящая основа, удобная чистка.",
        features: [
          "Защита от грязи",
          "Прочные",
          "Не скользят",
          "Легко чистить",
        ],
        images: ["garage_lines.webp"],
      },
      {
        name: "Антибукса",
        desc: "Вулканический полимер для повышенной износостойкости. Промышленная толщина, простая укладка.",
        features: [
          "Текстурная поверхность",
          "Износостойкий",
          "Антискольжение",
          "Промышленная толщина",
        ],
        images: ["antislip.webp"],
      },
    ],
  },
};

/* sub-components */

function ImagePlaceholder() {
  return (
    <div className="relative aspect-[4/3] bg-th-dark border-b border-th-white/40 flex flex-col items-center justify-center gap-3 overflow-hidden">
      <div className="absolute inset-0 hex-pattern opacity-15" />
      <svg viewBox="0 0 48 48" fill="none" className="w-10 h-10 relative z-10">
        <rect
          x="4"
          y="8"
          width="40"
          height="32"
          rx="2"
          stroke="#A80000"
          strokeWidth="1.5"
        />
        <circle cx="16" cy="20" r="4" stroke="#A80000" strokeWidth="1" />
        <path
          d="M4 32l12-10 8 6 10-8 10 8V38a2 2 0 01-2 2H6a2 2 0 01-2-2V32z"
          fill="#A80000"
          opacity="0.15"
        />
      </svg>
      <span className="text-th-light/25 text-[0.6rem] tracking-[0.3em] uppercase relative z-10">
        Фото товара
      </span>
    </div>
  );
}

function ImageCarousel({ images, alt }: { images: string[]; alt: string }) {
  const [current, setCurrent] = useState(0);
  const trackRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const count = images.length;

  const goTo = useCallback(
    (idx: number) => {
      const next = (idx + count) % count;
      setCurrent(next);
      if (trackRef.current) {
        gsap.to(trackRef.current, {
          x: `${(-next * 100) / count}%`,
          duration: 0.4,
          ease: "power2.out",
        });
      }
    },
    [count],
  );

  // Touch/swipe handling
  useEffect(() => {
    const el = containerRef.current;
    if (!el || count <= 1) return;

    let startX = 0;
    let startY = 0;
    let dragging = false;

    const onStart = (e: TouchEvent) => {
      startX = e.touches[0].clientX;
      startY = e.touches[0].clientY;
      dragging = true;
    };

    const onEnd = (e: TouchEvent) => {
      if (!dragging) return;
      dragging = false;
      const dx = e.changedTouches[0].clientX - startX;
      const dy = e.changedTouches[0].clientY - startY;
      // Only swipe if horizontal movement > 40px and more horizontal than vertical
      if (Math.abs(dx) > 40 && Math.abs(dx) > Math.abs(dy)) {
        if (dx < 0 && current < count - 1) {
          goTo(current + 1);
        }
        if (dx > 0 && current > 0) goTo(current - 1);
      }
    };

    el.addEventListener("touchstart", onStart, { passive: true });
    el.addEventListener("touchend", onEnd, { passive: true });
    return () => {
      el.removeEventListener("touchstart", onStart);
      el.removeEventListener("touchend", onEnd);
    };
  }, [count, current, goTo]);

  return (
    <div
      ref={containerRef}
      className="relative aspect-[4/3] bg-th-light overflow-hidden group/carousel touch-pan-y"
    >
      {/* image track */}
      <div
        ref={trackRef}
        className="flex h-full"
        style={{ width: `${count * 100}%` }}
      >
        {images.map((src, i) => (
          <div
            key={src}
            className="relative h-full"
            style={{ width: `${100 / count}%` }}
          >
            <img
              src={"assets/" + src}
              alt={`${alt} — ${i + 1}`}
              loading="lazy"
              decoding="async"
              className="w-full h-full object-cover"
            />
          </div>
        ))}
      </div>

      {/* arrows (only if >1 image) */}
      {count > 1 && (
        <>
          <button
            onClick={() => goTo(current - 1)}
            aria-label="Предыдущее фото"
            className="absolute left-2 top-1/2 -translate-y-1/2 w-8 h-8 bg-th-dark/70 backdrop-blur-sm border border-th-white/10 flex items-center justify-center text-th-light/60 hover:text-th-white hover:border-th-red/40 transition-all duration-200 opacity-0 group-hover/carousel:opacity-100"
            style={current > 0 ? {} : { display: "none" }}
          >
            <svg viewBox="0 0 16 16" fill="none" className="w-4 h-4">
              <path
                d="M10 3L5 8l5 5"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
          <button
            onClick={() => goTo(current + 1)}
            aria-label="Следующее фото"
            className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 bg-th-dark/70 backdrop-blur-sm border border-th-white/10 flex items-center justify-center text-th-light/60 hover:text-th-white hover:border-th-red/40 transition-all duration-200 opacity-0 group-hover/carousel:opacity-100"
            style={current < count - 1 ? {} : { display: "none" }}
          >
            <svg viewBox="0 0 16 16" fill="none" className="w-4 h-4">
              <path
                d="M6 3l5 5-5 5"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>

          {/* dots */}
          <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1.5">
            {images.map((_, i) => (
              <button
                key={i}
                onClick={() => goTo(i)}
                aria-label={`Фото ${i + 1}`}
                className={`w-1.5 h-1.5 rounded-full transition-all duration-200 ${
                  i === current
                    ? "bg-th-red w-4"
                    : "bg-th-dark/30 hover:bg-th-dark/50"
                }`}
              />
            ))}
          </div>
        </>
      )}

      {/* counter badge */}
      {count > 1 && (
        <span className="absolute top-2 right-2 bg-th-dark/70 backdrop-blur-sm text-th-light/50 text-[0.55rem] tracking-wider px-2 py-1 border border-th-white/8">
          {current + 1}/{count}
        </span>
      )}
    </div>
  );
}

function ProductCard({ product }: { product: Product }) {
  const hasImages = product.images && product.images.length > 0;

  return (
    <div className="group border border-th-white/30 hover:border-th-white/90 transition-all duration-300 bg-th-dark/60">
      {hasImages ? (
        <ImageCarousel images={product.images!} alt={product.name} />
      ) : (
        <ImagePlaceholder />
      )}

      <div className="p-6">
        <h3 className="text-th-white font-semibold tracking-wide text-lg mb-2">
          {product.name}
        </h3>
        <p className="text-th-light/40 text-sm leading-relaxed mb-5">
          {product.desc}
        </p>

        {/* features */}
        <ul className="space-y-2 mb-6">
          {product.features.map((f) => (
            <li key={f} className="flex items-center gap-2 text-sm">
              <span className="w-4 h-px bg-th-red shrink-0" />
              <span className="text-th-light/55">{f}</span>
            </li>
          ))}
        </ul>

        {/* marketplace links */}
        {product.links && Object.keys(product.links).length > 0 && (
          <div className="pt-4 mt-auto border-t border-th-white/6">
            <div className="flex flex-wrap gap-2">
              {Object.entries(product.links).map(([name, url]) => (
                <a
                  key={name}
                  href={url || '#'}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`${name}-link flex items-center gap-1.5 px-3 py-1.5 text-[0.65rem] tracking-[0.15em] border text-th-light/70 hover:text-white transition-all duration-200`}
                >
                  {name}
                  <svg viewBox="0 0 12 12" fill="none" className="w-3 h-3 opacity-40">
                    <path d="M4 2h6v6M10 2L3 9" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </a>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

/* main page component */

export default function ProductPage({ category }: { category: string }) {
  const heroRef = useRef<HTMLDivElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);

  const cat = DATA[category];
  if (!cat)
    return <div className="text-th-light p-20">Category not found.</div>;

  useEffect(() => {
    const ctx = gsap.context(() => {
      // hero entrance
      gsap.fromTo(
        heroRef.current?.querySelectorAll(".hero-anim") ?? [],
        { y: 40, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.8,
          stagger: 0.12,
          ease: "power3.out",
          delay: 0.15,
        },
      );

      // product cards stagger
      gsap.fromTo(
        Array.from(gridRef.current?.children ?? []),
        { y: 50, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.6,
          stagger: 0.1,
          ease: "power3.out",
          scrollTrigger: { trigger: gridRef.current, start: "top 80%" },
        },
      );

      // CTA
      gsap.fromTo(
        ctaRef.current,
        { y: 40, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.8,
          ease: "power3.out",
          scrollTrigger: { trigger: ctaRef.current, start: "top 85%" },
        },
      );
    });

    return () => ctx.revert();
  }, [category]);

  return (
    <div>
      {/* hero */}
      <section
        className="relative min-h-[60vh] flex items-end overflow-hidden"
        style={{ backgroundColor: cat.bg }}
      >
        <div className="absolute inset-0 hex-pattern grid-pattern opacity-30" />
        <div className="absolute inset-0 bg-gradient-to-t from-th-dark via-transparent to-transparent" />

        <div
          ref={heroRef}
          className="relative z-10 max-w-7xl mx-auto px-6 lg:px-16 pb-16 pt-32 w-full"
        >
          {/* breadcrumb */}
          <nav className="hero-anim flex items-center gap-2 text-[0.6rem] tracking-[0.3em] uppercase mb-8">
            <a
              href="/"
              className="text-th-light/40 hover:text-th-light/60 transition-colors"
            >
              Главная
            </a>
            <span className="text-th-light/60">/</span>
            <a
              href="/#products"
              className="text-th-light/40 hover:text-th-light/60 transition-colors"
            >
              Продукция
            </a>
            <span className="text-th-light/60">/</span>
            {/* <span className="text-th-light/70">{cat.name}</span> */}
          </nav>

          {/* eyebrow */}
          {/* <div className="hero-anim flex items-center gap-4 mb-4">
            <span className="block w-8 h-px bg-th-red" />
            <span className="text-th-light/50 text-[0.6rem] tracking-[0.45em] uppercase font-semibold">
              {cat.label}
            </span>
          </div> */}

          {/* title */}
          <h1
            className="hero-anim font-display text-th-white leading-none mb-6"
            style={{ fontSize: "clamp(3.5rem, 10vw, 9rem)" }}
          >
            {cat.name.toUpperCase()}
          </h1>

          {/* description */}
          <p className="hero-anim text-th-light/70 text-base lg:text-lg max-w-[50ch] leading-relaxed">
            {cat.description}
          </p>
        </div>
      </section>

      {/* product grid */}
      <section className="bg-th-dark py-10 lg:py-20">
        <div className="max-w-7xl mx-auto px-6 lg:px-16">
          {/* <div className="flex items-center gap-4 mb-10">
            <span className="block w-8 h-px bg-th-red" />
            <span className="text-th-light/50 text-[0.6rem] tracking-[0.45em] uppercase font-semibold">
              Все товары
            </span>
          </div> */}

          <div
            ref={gridRef}
            className={`grid gap-6 ${
              cat.products.length === 4
                ? "sm:grid-cols-2 lg:grid-cols-4"
                : "sm:grid-cols-2 lg:grid-cols-3"
            }`}
          >
            {cat.products.map((p) => (
              <ProductCard key={p.name} product={p} />
            ))}
          </div>

          {/* "Also available" list */}
          {/* {cat.also && cat.also.length > 0 && (
            <div className="mt-10">
              <p className="text-th-light/90 text-md leading-relaxed">
                <span className="text-th-light/70">А также</span>{' '}
                {cat.also.join(' / ')}
              </p>
              
            </div>
          )} */}

          {/* all products banner */}
          <div className="mt-16 py-8 px-8 border border-th-white/6 bg-th-white/[0.02] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
            <div>
              <h3 className="text-th-white font-semibold text-base tracking-wide mb-1">
                Полный каталог
              </h3>
              <p className="text-th-light/35 text-sm">
                Все товары TRIHEXA на маркетплейсах
              </p>
            </div>
            <div className="flex flex-wrap gap-3 shrink-0">
              {Object.entries(ALL_PRODUCTS_LINKS).map(([name, url]) => (
                <a
                  key={name}
                  href={url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`${name}-link flex items-center gap-2 px-5 py-2.5 text-[0.7rem] tracking-[0.15em] border text-th-light/80 hover:text-white transition-all duration-200`}
                >
                  {name}
                  <svg viewBox="0 0 12 12" fill="none" className="w-3 h-3 opacity-40">
                    <path d="M4 2h6v6M10 2L3 9" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </a>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section
        className="relative overflow-hidden border-t border-th-red/15"
        style={{ backgroundColor: cat.bg }}
      >
        <div className="absolute inset-0 hex-pattern opacity-20" />
        <div
          ref={ctaRef}
          className="relative z-10 max-w-7xl mx-auto px-6 lg:px-16 py-20 lg:py-28 text-center"
        >
          <h2
            className="font-display text-th-white leading-none mb-4"
            style={{ fontSize: "clamp(2rem, 6vw, 5rem)" }}
          >
            НУЖНА <span className="text-th-red">КОНСУЛЬТАЦИЯ?</span>
          </h2>
          <p className="text-th-light/40 text-sm max-w-[40ch] mx-auto mb-8 leading-relaxed">
            Подберём коврики под вашу модель или помещение. Ответим на вопросы и
            поможем с выбором.
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <a
              href="/#contact"
              className="mag-btn px-8 py-4 bg-th-red text-white text-[0.7rem] tracking-[0.28em] uppercase font-semibold hover:bg-[#8a0000] transition-colors duration-300"
            >
              Связаться
            </a>
            <a
              href="/"
              className="mag-btn px-8 py-4 border border-th-light/25 text-th-light/75 hover:border-th-light hover:text-th-white text-[0.7rem] tracking-[0.28em] uppercase font-semibold transition-all duration-300"
            >
              На главную
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
