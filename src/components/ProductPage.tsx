import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

/* ── Types ───────────────────────────────────────────────── */
interface Product {
  name: string;
  desc: string;
  features: string[];
}

interface CategoryData {
  number: string;
  label: string;
  name: string;
  description: string;
  bg: string;
  products: Product[];
}

/* ── Category data ───────────────────────────────────────── */
const DATA: Record<string, CategoryData> = {
  car: {
    number: '01',
    label: 'Автомобиль',
    name: 'Автоковрики',
    description:
      'EVA и резина с точным кроем под каждую модель. Защита салона от грязи, воды и реагентов — круглый год.',
    bg: '#0f0f10',
    products: [
      {
        name: 'Коврик в багажник',
        desc: 'Полное покрытие грузового отсека с поднятыми бортиками. Защита от протечек, грязи и механических повреждений.',
        features: ['Бортики 30 мм', 'EVA-полимер', 'Индивидуальный крой', 'Простая установка'],
      },
      {
        name: 'Коврик пассажира',
        desc: 'Точная подгонка под переднее пассажирское место. Надёжная фиксация и простой уход.',
        features: ['Точная подгонка', 'Нескользящая основа', 'Лёгкая чистка', 'Стойкость к реагентам'],
      },
      {
        name: 'Коврик водителя',
        desc: 'Усиленная зона пятки для максимальной износостойкости. Антискользящий крепёж к полу автомобиля.',
        features: ['Усиленная пятка', 'Антискользящий крепёж', 'Повышенная износостойкость', 'Точный крой'],
      },
    ],
  },
  home: {
    number: '02',
    label: 'Для дома',
    name: 'Домашние коврики',
    description:
      'Каждый порог и угол — под контролем. Впитывающие, моющиеся, долговечные коврики для любого помещения.',
    bg: '#111621',
    products: [
      {
        name: 'Входной коврик',
        desc: 'Грязезащитный коврик с дренажными каналами для зон с высокой проходимостью. Не скользит, легко чистится.',
        features: ['Грязезащитный', 'Дренажные каналы', 'Высокая проходимость', 'Устойчив к влаге'],
      },
      {
        name: 'Коврик под обувь',
        desc: 'Тонкий впитывающий вкладыш для прихожей. Не мешает двери, собирает влагу и грязь.',
        features: ['Тонкий профиль', 'Впитывающий', 'Для прихожей', 'Моющийся'],
      },
      {
        name: 'Коврик под раковину',
        desc: 'Водонепроницаемый коврик с поднятыми бортами. Защищает пол от протечек на кухне и в ванной.',
        features: ['Водонепроницаемый', 'Бортики от протечек', 'Лёгкая установка', 'Кухня / ванная'],
      },
      {
        name: 'Коврик для питомца',
        desc: 'Моющийся коврик, устойчивый к когтям и шерсти. Гипоаллергенный, не впитывает запахи.',
        features: ['Устойчив к когтям', 'Моющийся', 'Гипоаллергенный', 'Не впитывает запахи'],
      },
    ],
  },
  garage: {
    number: '03',
    label: 'Гараж',
    name: 'Гаражные системы',
    description:
      'Промышленная защита пола от масла, реагентов и механических повреждений. Для гаража, мастерской и паркинга.',
    bg: '#0c0c0d',
    products: [
      {
        name: 'Бампер-защита',
        desc: 'Настенная защитная полоса в зоне бампера. Амортизирует удар при парковке, видна в темноте.',
        features: ['Настенное крепление', 'Амортизация удара', 'Видимая маркировка', 'Универсальный размер'],
      },
      {
        name: 'Парковочные линии',
        desc: 'Цветные направляющие полосы для точной парковки. Самоклеющаяся основа, устойчивы к наезду.',
        features: ['Цветные полосы', 'Самоклеющиеся', 'Видимость в темноте', 'Устойчивы к наезду'],
      },
      {
        name: 'Противоскользящий коврик',
        desc: 'Текстурная резина для масляных и мокрых поверхностей. Промышленная толщина, простая укладка.',
        features: ['Текстурная поверхность', 'Маслостойкий', 'Антискольжение', 'Промышленная толщина'],
      },
    ],
  },
};

const MARKETPLACES = [
  { name: 'Ozon',           color: '#005BFF' },
  { name: 'Wildberries',    color: '#CB11AB' },
  { name: 'Яндекс Маркет',  color: '#FFCC00' },
];

/* ── Sub-components ──────────────────────────────────────── */

function ImagePlaceholder() {
  return (
    <div className="relative aspect-[4/3] bg-th-dark border border-th-white/6 flex flex-col items-center justify-center gap-3 overflow-hidden">
      <div className="absolute inset-0 hex-pattern opacity-15" />
      <svg viewBox="0 0 48 48" fill="none" className="w-10 h-10 relative z-10">
        <rect x="4" y="8" width="40" height="32" rx="2" stroke="#A80000" strokeWidth="1.5" />
        <circle cx="16" cy="20" r="4" stroke="#A80000" strokeWidth="1" />
        <path
          d="M4 32l12-10 8 6 10-8 10 8V38a2 2 0 01-2 2H6a2 2 0 01-2-2V32z"
          fill="#A80000" opacity="0.15"
        />
      </svg>
      <span className="text-th-light/25 text-[0.6rem] tracking-[0.3em] uppercase relative z-10">
        Фото товара
      </span>
    </div>
  );
}

function ProductCard({ product }: { product: Product }) {
  return (
    <div className="group border border-th-white/6 hover:border-th-red/25 transition-all duration-300 bg-th-dark/60">
      <ImagePlaceholder />

      <div className="p-6">
        <h3 className="text-th-white font-semibold tracking-wide text-lg mb-2">
          {product.name}
        </h3>
        <p className="text-th-light/40 text-sm leading-relaxed mb-5">
          {product.desc}
        </p>

        {/* Features */}
        <ul className="space-y-2 mb-6">
          {product.features.map(f => (
            <li key={f} className="flex items-center gap-2 text-sm">
              <span className="w-4 h-px bg-th-red shrink-0" />
              <span className="text-th-light/55">{f}</span>
            </li>
          ))}
        </ul>

        {/* Marketplace links */}
        <div>
          <span className="text-th-light/25 text-[0.55rem] tracking-[0.3em] uppercase block mb-2">
            Купить на:
          </span>
          <div className="flex flex-wrap gap-2">
            {MARKETPLACES.map(m => (
              <a
                key={m.name}
                href="#"
                className="px-3 py-1.5 text-[0.6rem] tracking-[0.15em] border border-th-white/10 text-th-light/50 hover:border-th-red/40 hover:text-th-light transition-all duration-200"
              >
                {m.name}
              </a>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

/* ── Main page component ─────────────────────────────────── */

export default function ProductPage({ category }: { category: string }) {
  const heroRef  = useRef<HTMLDivElement>(null);
  const gridRef  = useRef<HTMLDivElement>(null);
  const ctaRef   = useRef<HTMLDivElement>(null);

  const cat = DATA[category];
  if (!cat) return <div className="text-th-light p-20">Category not found.</div>;

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Hero entrance
      gsap.fromTo(
        heroRef.current?.querySelectorAll('.hero-anim') ?? [],
        { y: 40, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.8, stagger: 0.12, ease: 'power3.out', delay: 0.15 },
      );

      // Product cards stagger
      gsap.fromTo(
        Array.from(gridRef.current?.children ?? []),
        { y: 50, opacity: 0 },
        {
          y: 0, opacity: 1, duration: 0.65, stagger: 0.12, ease: 'power3.out',
          scrollTrigger: { trigger: gridRef.current, start: 'top 80%' },
        },
      );

      // CTA
      gsap.fromTo(
        ctaRef.current,
        { y: 40, opacity: 0 },
        {
          y: 0, opacity: 1, duration: 0.8, ease: 'power3.out',
          scrollTrigger: { trigger: ctaRef.current, start: 'top 85%' },
        },
      );
    });

    return () => ctx.revert();
  }, [category]);

  return (
    <div>
      {/* ── Hero ─────────────────────────────────────────── */}
      <section
        className="relative min-h-[60vh] flex items-end overflow-hidden"
        style={{ backgroundColor: cat.bg }}
      >
        <div className="absolute inset-0 hex-pattern grid-pattern opacity-30" />
        <div className="absolute inset-0 bg-gradient-to-t from-th-dark via-transparent to-transparent" />

        {/* Large watermark number */}
        <div className="absolute right-4 top-1/2 -translate-y-1/2 font-display text-[18rem] lg:text-[26rem] leading-none text-th-red/[0.04] select-none pointer-events-none">
          {cat.number}
        </div>

        <div ref={heroRef} className="relative z-10 max-w-7xl mx-auto px-6 lg:px-16 pb-16 pt-32 w-full">
          {/* Breadcrumb */}
          <nav className="hero-anim flex items-center gap-2 text-[0.6rem] tracking-[0.3em] uppercase mb-8">
            <a href="/" className="text-th-light/30 hover:text-th-red transition-colors">Главная</a>
            <span className="text-th-light/15">/</span>
            <a href="/#products" className="text-th-light/30 hover:text-th-red transition-colors">Продукция</a>
            <span className="text-th-light/15">/</span>
            <span className="text-th-red">{cat.name}</span>
          </nav>

          {/* Eyebrow */}
          <div className="hero-anim flex items-center gap-4 mb-4">
            <span className="block w-8 h-px bg-th-red" />
            <span className="text-th-red text-[0.6rem] tracking-[0.45em] uppercase font-semibold">
              {cat.label}
            </span>
          </div>

          {/* Title */}
          <h1
            className="hero-anim font-display text-th-white leading-none mb-6"
            style={{ fontSize: 'clamp(3.5rem, 10vw, 9rem)' }}
          >
            {cat.name.toUpperCase()}
          </h1>

          {/* Description */}
          <p className="hero-anim text-th-light/50 text-base lg:text-lg max-w-[50ch] leading-relaxed">
            {cat.description}
          </p>
        </div>
      </section>

      {/* ── Product grid ─────────────────────────────────── */}
      <section className="bg-th-dark py-20 lg:py-28">
        <div className="max-w-7xl mx-auto px-6 lg:px-16">
          <div className="flex items-center gap-4 mb-10">
            <span className="block w-8 h-px bg-th-red" />
            <span className="text-th-red text-[0.6rem] tracking-[0.45em] uppercase font-semibold">
              Все товары
            </span>
          </div>

          <div
            ref={gridRef}
            className={`grid gap-6 ${
              cat.products.length === 4
                ? 'sm:grid-cols-2 lg:grid-cols-4'
                : 'sm:grid-cols-2 lg:grid-cols-3'
            }`}
          >
            {cat.products.map(p => (
              <ProductCard key={p.name} product={p} />
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ──────────────────────────────────────────── */}
      <section className="relative overflow-hidden border-t border-th-red/15" style={{ backgroundColor: cat.bg }}>
        <div className="absolute inset-0 hex-pattern opacity-20" />
        <div
          ref={ctaRef}
          className="relative z-10 max-w-7xl mx-auto px-6 lg:px-16 py-20 lg:py-28 text-center"
        >
          <h2
            className="font-display text-th-white leading-none mb-4"
            style={{ fontSize: 'clamp(2rem, 6vw, 5rem)' }}
          >
            НУЖНА <span className="text-th-red">КОНСУЛЬТАЦИЯ?</span>
          </h2>
          <p className="text-th-light/40 text-sm max-w-[40ch] mx-auto mb-8 leading-relaxed">
            Подберём коврики под вашу модель или помещение. Ответим на вопросы и поможем с выбором.
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
