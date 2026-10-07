import { useEffect, useState, type FormEvent } from 'react'
import { ArrowLeft, ArrowRight, ArrowUpRight, Check, ChevronDown, Menu, Minus, Plus, Search, ShoppingBag, SlidersHorizontal, X } from 'lucide-react'

type Product = {
  id: string; name: string; category: string; categoryLabel: string; price: number; image: string; alt: string
  sizes: string[]; colors: { name: string; value: string }[]; stock: number; badge?: string; collection: string; description: string; material: string
}
type CartLine = { productId: string; size: string; color: string; quantity: number }

const products: Product[] = [
  { id: 'stride-tee', name: 'Stride тренировочная футболка', category: 'men', categoryLabel: 'Мужская одежда', price: 18990, image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=1100&q=85', alt: 'Футболка для спортивных тренировок', sizes: ['S', 'M', 'L', 'XL'], colors: [{ name: 'Угольный', value: '#25292b' }, { name: 'Молочный', value: '#e9e5db' }, { name: 'Оливковый', value: '#777a59' }], stock: 18, badge: 'Бестселлер', collection: 'Core Training', description: 'Лёгкая тренировочная футболка с продуманной посадкой. Отводит влагу и сохраняет свободу движения от разминки до последнего повторения.', material: '92% переработанный полиэстер, 8% эластан' },
  { id: 'form-leggings', name: 'Form легинсы с высокой посадкой', category: 'women', categoryLabel: 'Женская одежда', price: 24990, image: 'https://images.unsplash.com/photo-1506629905607-d9d7c8a77f27?auto=format&fit=crop&w=1100&q=85', alt: 'Спортивная одежда для занятий фитнесом', sizes: ['XS', 'S', 'M', 'L'], colors: [{ name: 'Чёрный', value: '#17191b' }, { name: 'Графит', value: '#696b6b' }, { name: 'Тёмная вишня', value: '#713d43' }], stock: 12, badge: 'Новинка', collection: 'Studio Form', description: 'Мягкий пояс с высокой посадкой поддерживает, не сковывая движений. Плотная эластичная ткань остаётся комфортной во время силовых и растяжки.', material: '78% нейлон, 22% эластан' },
  { id: 'lift-shorts', name: 'Lift шорты для тренировок', category: 'men', categoryLabel: 'Мужская одежда', price: 16990, image: 'https://images.unsplash.com/photo-1591195853828-11db59a44f6b?auto=format&fit=crop&w=1100&q=85', alt: 'Спортивные шорты для тренировки', sizes: ['S', 'M', 'L', 'XL'], colors: [{ name: 'Чёрный', value: '#17191b' }, { name: 'Сланец', value: '#7b8182' }], stock: 9, collection: 'Core Training', description: 'Универсальные шорты для зала и пробежек. Боковые разрезы дают дополнительную свободу, а карман на молнии хранит самое необходимое.', material: '88% переработанный полиэстер, 12% эластан' },
  { id: 'flow-bra', name: 'Flow спортивный топ средней поддержки', category: 'women', categoryLabel: 'Женская одежда', price: 17990, image: 'https://images.unsplash.com/photo-1579758629938-03607ccdbaba?auto=format&fit=crop&w=1100&q=85', alt: 'Спортивный топ для тренировок', sizes: ['XS', 'S', 'M', 'L'], colors: [{ name: 'Чёрный', value: '#17191b' }, { name: 'Лайм', value: '#cbdf52' }, { name: 'Кобальт', value: '#425f91' }], stock: 15, badge: 'Новинка', collection: 'Studio Form', description: 'Топ с мягкой поддержкой и съёмными чашечками для тренировок, йоги и активного дня. Эластичная ткань быстро сохнет.', material: '75% переработанный полиамид, 25% эластан' },
  { id: 'pace-runner', name: 'Pace беговые кроссовки', category: 'shoes', categoryLabel: 'Обувь', price: 45990, image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=1100&q=85', alt: 'Яркие беговые кроссовки', sizes: ['39', '40', '41', '42', '43', '44'], colors: [{ name: 'Красный', value: '#d94b39' }, { name: 'Чёрный', value: '#252729' }, { name: 'Светлый', value: '#e5e1d8' }], stock: 7, badge: 'Новинка', collection: 'Run Club', description: 'Лёгкие кроссовки с амортизирующей подошвой для коротких пробежек и ежедневных маршрутов. Дышащий верх помогает сохранять комфорт.', material: 'Текстильный верх, резиновая подошва' },
  { id: 'grip-gloves', name: 'Grip перчатки для зала', category: 'training', categoryLabel: 'Фитнес и тренировки', price: 9990, image: 'https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?auto=format&fit=crop&w=1100&q=85', alt: 'Экипировка для силовой тренировки', sizes: ['S', 'M', 'L'], colors: [{ name: 'Чёрный', value: '#17191b' }, { name: 'Оливковый', value: '#777a59' }], stock: 22, collection: 'Core Training', description: 'Перчатки с цепкой ладонью для устойчивого хвата и мягкой защитой в ключевых зонах. Застёжка помогает быстро подогнать посадку.', material: 'Синтетическая кожа, сетчатая ткань' },
  { id: 'carry-duffel', name: 'Carry спортивная сумка', category: 'accessories', categoryLabel: 'Аксессуары', price: 21990, image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=1100&q=85', alt: 'Спортивная сумка для тренировок и поездок', sizes: ['Один размер'], colors: [{ name: 'Чёрный', value: '#17191b' }, { name: 'Песочный', value: '#b9a68e' }], stock: 6, collection: 'Everyday Motion', description: 'Вместительная сумка с отдельным отделением для обуви и внутренним карманом на молнии. Удобна для зала и коротких поездок.', material: 'Износостойкий переработанный полиэстер' },
  { id: 'tempo-hoodie', name: 'Tempo худи на молнии', category: 'women', categoryLabel: 'Женская одежда', price: 32990, image: 'https://images.unsplash.com/photo-1556821840-3a63f95609a7?auto=format&fit=crop&w=1100&q=85', alt: 'Спортивная толстовка', sizes: ['XS', 'S', 'M', 'L', 'XL'], colors: [{ name: 'Серый меланж', value: '#a5a6a2' }, { name: 'Чёрный', value: '#17191b' }], stock: 0, badge: 'Скоро', collection: 'Everyday Motion', description: 'Мягкий слой для дороги в зал и спокойных дней. Свободный крой, удобные карманы и плотный хлопковый футер.', material: '80% хлопок, 20% переработанный полиэстер' },
  { id: 'move-bottle', name: 'Move бутылка для воды', category: 'accessories', categoryLabel: 'Аксессуары', price: 6990, image: 'https://images.unsplash.com/photo-1602143407151-7111542de6e8?auto=format&fit=crop&w=1100&q=85', alt: 'Бутылка для воды для занятий спортом', sizes: ['750 мл'], colors: [{ name: 'Лайм', value: '#cbdf52' }, { name: 'Чёрный', value: '#17191b' }, { name: 'Стальной', value: '#aab2b4' }], stock: 31, collection: 'Everyday Motion', description: 'Многоразовая бутылка с герметичной крышкой и удобной петлёй. Подходит для тренировок и повседневного использования.', material: 'BPA-free пластик, 750 мл' },
]
const categories = [{ id: 'all', label: 'Весь каталог' }, { id: 'new', label: 'Новинки' }, { id: 'collections', label: 'Коллекции' }, { id: 'men', label: 'Мужская одежда' }, { id: 'women', label: 'Женская одежда' }, { id: 'shoes', label: 'Обувь' }, { id: 'training', label: 'Фитнес и тренировки' }, { id: 'accessories', label: 'Аксессуары' }]
const alternateProductImages: Record<string, string> = {
  'stride-tee': 'https://images.unsplash.com/photo-1581655353564-df123a1eb820?auto=format&fit=crop&w=1100&q=85',
  'form-leggings': 'https://images.unsplash.com/photo-1518611012118-696072aa579a?auto=format&fit=crop&w=1100&q=85',
  'lift-shorts': 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?auto=format&fit=crop&w=1100&q=85',
  'flow-bra': 'https://images.unsplash.com/photo-1518611012118-696072aa579a?auto=format&fit=crop&w=1100&q=85',
  'pace-runner': 'https://images.unsplash.com/photo-1608231387042-66d1773070a5?auto=format&fit=crop&w=1100&q=85',
  'grip-gloves': 'https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?auto=format&fit=crop&w=1100&q=85',
  'carry-duffel': 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=900&q=85',
  'tempo-hoodie': 'https://images.unsplash.com/photo-1556821840-3a63f95609a7?auto=format&fit=crop&w=900&q=85',
  'move-bottle': 'https://images.unsplash.com/photo-1602143407151-7111542de6e8?auto=format&fit=crop&w=900&q=85',
}
const money = new Intl.NumberFormat('ru-KZ', { style: 'currency', currency: 'KZT', maximumFractionDigits: 0 })
const cartStorageKey = 'asylbek-arslan-cart'
const readRoute = () => window.location.hash.replace(/^#\/?/, '')

function Logo() {
  return <a className="brand" href="#home" aria-label="Асылбек Арслан, главная"><span className="brand-symbol" aria-hidden="true"><svg viewBox="0 0 42 42" fill="none"><path d="M5 33 17.5 7h7L37 33h-8l-2.5-5.5H15L12.5 33H5Z" fill="currentColor"/><path d="m17.8 21.5 3.2-7 3.2 7h-6.4Z" fill="#f5f4ee"/><path d="M8 36h26" stroke="currentColor" strokeWidth="2"/></svg></span><span className="brand-wordmark">АСЫЛБЕК <b>АРСЛАН</b></span></a>
}

function App() {
  const [route, setRoute] = useState(() => readRoute() || 'home')
  const [activeProduct, setActiveProduct] = useState(() => products.find((product) => product.id === readRoute().replace('product/', '')) ?? products[0])
  const [category, setCategory] = useState('all')
  const [query, setQuery] = useState('')
  const [sizeFilter, setSizeFilter] = useState('all')
  const [colorFilter, setColorFilter] = useState('all')
  const [maxPrice, setMaxPrice] = useState('')
  const [inStockOnly, setInStockOnly] = useState(false)
  const [selectedSize, setSelectedSize] = useState('')
  const [selectedColor, setSelectedColor] = useState('')
  const [imageIndex, setImageIndex] = useState(0)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [notice, setNotice] = useState('')
  const [cart, setCart] = useState<CartLine[]>(() => {
    try { return JSON.parse(window.localStorage.getItem(cartStorageKey) ?? '[]') as CartLine[] } catch { return [] }
  })

  useEffect(() => {
    const syncRoute = () => {
      const nextRoute = readRoute() || 'home'
      setRoute(nextRoute)
      const product = products.find((item) => item.id === nextRoute.replace('product/', ''))
      if (product) setActiveProduct(product)
    }
    const goHome = () => navigate('home')
    window.addEventListener('hashchange', syncRoute)
    window.addEventListener('shop-home', goHome)
    return () => { window.removeEventListener('hashchange', syncRoute); window.removeEventListener('shop-home', goHome) }
  }, [])
  useEffect(() => { try { window.localStorage.setItem(cartStorageKey, JSON.stringify(cart)) } catch { /* Cart remains available for this tab. */ } }, [cart])
  useEffect(() => { if (!notice) return; const timeout = window.setTimeout(() => setNotice(''), 3200); return () => window.clearTimeout(timeout) }, [notice])

  const navigate = (nextRoute: string) => { window.history.pushState({}, '', `#${nextRoute}`); setRoute(nextRoute); setMobileMenuOpen(false); window.scrollTo({ top: 0, behavior: 'smooth' }) }
  const openCatalog = (nextCategory = 'all') => { setCategory(nextCategory); navigate('catalog') }
  const openProduct = (product: Product) => { setActiveProduct(product); setSelectedSize(''); setSelectedColor(product.colors[0].name); setImageIndex(0); navigate(`product/${product.id}`) }
  const filteredProducts = products.filter((product) => {
    const matchesCategory = category === 'all' || (category === 'new' ? product.badge === 'Новинка' : category === 'collections' ? true : product.category === category)
    const searchable = `${product.name} ${product.categoryLabel} ${product.collection} ${product.colors.map((color) => color.name).join(' ')}`.toLocaleLowerCase('ru')
    return matchesCategory && searchable.includes(query.trim().toLocaleLowerCase('ru')) && (sizeFilter === 'all' || product.sizes.includes(sizeFilter)) && (colorFilter === 'all' || product.colors.some((color) => color.name === colorFilter)) && (!maxPrice || product.price <= Number(maxPrice)) && (!inStockOnly || product.stock > 0)
  })
  const cartCount = cart.reduce((sum, line) => sum + line.quantity, 0)
  const cartTotal = cart.reduce((sum, line) => sum + (products.find((product) => product.id === line.productId)?.price ?? 0) * line.quantity, 0)
  const addToCart = (product: Product, size: string, color: string) => {
    if (!size) { setNotice('Сначала выберите размер'); return }
    if (!product.stock) { setNotice('Этот товар временно отсутствует'); return }
    setCart((current) => {
      const existing = current.find((line) => line.productId === product.id && line.size === size && line.color === color)
      return existing ? current.map((line) => line === existing ? { ...line, quantity: Math.min(line.quantity + 1, product.stock) } : line) : [...current, { productId: product.id, size, color, quantity: 1 }]
    })
    setNotice(`${product.name} добавлен в корзину`)
  }
  const updateQuantity = (line: CartLine, amount: number) => setCart((current) => current.flatMap((item) => {
    if (item !== line) return [item]
    const quantity = item.quantity + amount
    return quantity > 0 ? [{ ...item, quantity: Math.min(quantity, products.find((product) => product.id === item.productId)?.stock ?? quantity) }] : []
  }))
  const handleSearch = (event: FormEvent<HTMLFormElement>) => event.preventDefault()
  const uniqueColors = [...new Set(products.flatMap((product) => product.colors.map((color) => color.name)))]
  const featuredProducts = products.filter((product) => product.badge === 'Новинка' || product.badge === 'Бестселлер').slice(0, 4)
  const productImages = [activeProduct.image, alternateProductImages[activeProduct.id]]
  const isProductPage = route.startsWith('product/')

  return <>
    <div className="promo-strip"><span>ДОСТАВКА ПО КАЗАХСТАНУ ОТ 30 000 ₸ — БЕСПЛАТНО</span><span className="promo-location">АЛМАТЫ · KZ</span></div>
    <header className="site-header"><div className="header-inner">
      <button className="mobile-menu-toggle" type="button" aria-label={mobileMenuOpen ? 'Закрыть меню' : 'Открыть меню'} aria-expanded={mobileMenuOpen} onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>{mobileMenuOpen ? <X /> : <Menu />}</button><Logo />
      <nav className={mobileMenuOpen ? 'main-nav is-open' : 'main-nav'} aria-label="Категории магазина">{categories.slice(1).map((item) => <button key={item.id} type="button" onClick={() => openCatalog(item.id)}>{item.label}</button>)}<button type="button" onClick={() => navigate('info')}>О бренде</button></nav>
      <div className="header-actions"><button className="header-icon search-trigger" type="button" aria-label="Перейти в каталог и поиск" onClick={() => openCatalog()}><Search size={19} /></button><button className="header-icon cart-trigger" type="button" aria-label={`Корзина, товаров: ${cartCount}`} onClick={() => navigate('cart')}><ShoppingBag size={20} /><span>КОРЗИНА</span>{cartCount > 0 && <b>{cartCount}</b>}</button></div>
    </div></header>

    <main>
      {route === 'home' && <>
        <section className="hero" aria-labelledby="hero-title"><img className="hero-photo" src="https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&w=2300&q=90" alt="Силовая тренировка в современном спортивном зале" fetchPriority="high" /><div className="hero-scrim" /><div className="hero-content"><p className="eyebrow"><span /> ДВИЖЕНИЕ — ЭТО ХАРАКТЕР</p><h1 id="hero-title">СИЛА<br />БЫТЬ <i>СОБОЙ.</i></h1><p>Экипировка для тех, кто выходит за привычные пределы. Создано для движения. Проверено делом.</p><button className="button button-lime" onClick={() => openCatalog('new')}>НОВАЯ КОЛЛЕКЦИЯ <ArrowRight size={17} /></button></div><span className="hero-index">01 / 03 <i /></span><span className="hero-caption">CORE TRAINING · 2026</span></section>
        <section className="category-band" aria-label="Линейки магазина"><button className="category-tile women-tile" onClick={() => openCatalog('women')}><img src="https://images.unsplash.com/photo-1518611012118-696072aa579a?auto=format&fit=crop&w=1000&q=85" alt="Атлетка на тренировке" loading="lazy" /><span>01 — STUDIO FORM</span><strong>ЖЕНСКАЯ<br />ЛИНИЯ</strong><i>СМОТРЕТЬ <ArrowUpRight size={17} /></i></button><button className="category-tile men-tile" onClick={() => openCatalog('men')}><img src="https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?auto=format&fit=crop&w=1000&q=85" alt="Спортсмен во время силовой тренировки" loading="lazy" /><span>02 — CORE TRAINING</span><strong>МУЖСКАЯ<br />ЛИНИЯ</strong><i>СМОТРЕТЬ <ArrowUpRight size={17} /></i></button></section>
        <section className="product-section page-wrap"><div className="section-top"><div><p className="eyebrow eyebrow-dark"><span /> СВЕЖЕЕ В КАТАЛОГЕ</p><h2>ВЫБРАНО <i>ДЛЯ ТЕБЯ.</i></h2></div><button className="text-arrow" onClick={() => openCatalog('new')}>ВСЕ НОВИНКИ <ArrowRight size={17} /></button></div><div className="product-grid home-grid">{featuredProducts.map((product) => <ProductCard key={product.id} product={product} onOpen={openProduct} onQuickAdd={addToCart} />)}</div></section>
        <section className="manifesto"><img src="https://images.unsplash.com/photo-1517836357463-d25dfeac3438?auto=format&fit=crop&w=1900&q=85" alt="Спортсмен тренируется с гантелями" loading="lazy" /><div className="manifesto-shade" /><div className="manifesto-copy"><p className="eyebrow"><span /> НЕ СТОЯТЬ НА МЕСТЕ</p><h2>ТВОЙ ТЕМП.<br /><i>ТВОИ ПРАВИЛА.</i></h2><p>От первой разминки до личного рекорда. Функциональные материалы и честный комфорт для твоего движения.</p><button className="button button-light" onClick={() => openCatalog('training')}>НАЙТИ СВОЮ ЭКИПИРОВКУ <ArrowRight size={17} /></button></div></section>
        <section className="collection-section page-wrap"><div className="collection-number">AA / 03</div><div><p className="eyebrow eyebrow-dark"><span /> НАЙДИ СВОЙ РИТМ</p><h2>ОДНА ЦЕЛЬ.<br /><i>ТВОЙ МАРШРУТ.</i></h2><p>Run Club, Studio Form, Core Training и Everyday Motion — коллекции для движения в своём темпе.</p></div><button className="button button-dark" onClick={() => openCatalog('collections')}>СМОТРЕТЬ КОЛЛЕКЦИИ <ArrowUpRight size={17} /></button></section>
      </>}

      {route === 'catalog' && <section className="catalog-page page-wrap"><div className="page-heading"><p className="eyebrow eyebrow-dark"><span /> АСЫЛБЕК АРСЛАН · КАТАЛОГ</p><h1>{categories.find((item) => item.id === category)?.label.toUpperCase() ?? 'КАТАЛОГ'}</h1><p>{filteredProducts.length} моделей для движения в своём ритме</p></div><div className="catalog-layout">
        <aside className="filters"><div className="filters-title"><SlidersHorizontal size={17} /> ФИЛЬТРЫ <button type="button" onClick={() => { setCategory('all'); setQuery(''); setSizeFilter('all'); setColorFilter('all'); setMaxPrice(''); setInStockOnly(false) }}>СБРОСИТЬ</button></div>
          <label className="filter-field">КАТЕГОРИЯ<select value={category} onChange={(event) => setCategory(event.target.value)}>{categories.map((item) => <option key={item.id} value={item.id}>{item.label}</option>)}</select></label>
          <label className="filter-field">РАЗМЕР<select value={sizeFilter} onChange={(event) => setSizeFilter(event.target.value)}><option value="all">Любой размер</option>{['XS', 'S', 'M', 'L', 'XL', '39', '40', '41', '42', '43', '44', 'Один размер', '750 мл'].map((size) => <option key={size} value={size}>{size}</option>)}</select></label>
          <label className="filter-field">ЦВЕТ<select value={colorFilter} onChange={(event) => setColorFilter(event.target.value)}><option value="all">Любой цвет</option>{uniqueColors.map((color) => <option key={color} value={color}>{color}</option>)}</select></label>
          <label className="filter-field">ЦЕНА ДО, ₸<input type="number" min="0" step="1000" placeholder="Без ограничения" value={maxPrice} onChange={(event) => setMaxPrice(event.target.value)} /></label>
          <label className="stock-filter"><input type="checkbox" checked={inStockOnly} onChange={(event) => setInStockOnly(event.target.checked)} /><span className="custom-check"><Check size={13} /></span>В наличии</label>
        </aside><div className="catalog-results"><form className="catalog-search" onSubmit={handleSearch}><Search size={18} /><input aria-label="Поиск товаров" placeholder="ПОИСК ПО КАТАЛОГУ" value={query} onChange={(event) => setQuery(event.target.value)} />{query && <button type="button" aria-label="Очистить поиск" onClick={() => setQuery('')}><X size={17} /></button>}</form>
          {filteredProducts.length ? <div className="product-grid catalog-grid">{filteredProducts.map((product) => <ProductCard key={product.id} product={product} onOpen={openProduct} onQuickAdd={addToCart} />)}</div> : <div className="no-results"><Search size={24} /><h2>НИЧЕГО НЕ НАШЛОСЬ</h2><p>Измени запрос или ослабь фильтры, чтобы увидеть больше товаров.</p><button className="button button-dark" onClick={() => { setQuery(''); setCategory('all'); setSizeFilter('all'); setColorFilter('all'); setMaxPrice(''); setInStockOnly(false) }}>ПОКАЗАТЬ ВСЁ</button></div>}
        </div></div></section>}

      {isProductPage && <section className="product-detail page-wrap"><button className="back-link" onClick={() => navigate('catalog')}><ArrowLeft size={16} /> НАЗАД В КАТАЛОГ</button><div className="detail-layout"><div className="detail-gallery"><div className="detail-main-image"><img src={productImages[imageIndex]} alt={activeProduct.alt} /></div><div className="gallery-thumbs">{productImages.map((image, index) => <button key={image} className={imageIndex === index ? 'thumb is-active' : 'thumb'} aria-label={`Изображение ${index + 1}`} aria-pressed={imageIndex === index} onClick={() => setImageIndex(index)}><img src={image} alt="" /></button>)}</div></div>
        <div className="detail-info"><p className="eyebrow eyebrow-dark"><span /> {activeProduct.categoryLabel.toUpperCase()} · {activeProduct.collection.toUpperCase()}</p><h1>{activeProduct.name}</h1><p className="detail-price">{money.format(activeProduct.price)}</p><p className="detail-description">{activeProduct.description}</p>
          <div className="option-block"><div className="option-heading"><strong>ЦВЕТ</strong><span>{selectedColor}</span></div><div className="swatch-list">{activeProduct.colors.map((color) => <button key={color.name} className={selectedColor === color.name ? 'swatch is-selected' : 'swatch'} type="button" title={color.name} aria-label={`Цвет: ${color.name}`} aria-pressed={selectedColor === color.name} onClick={() => setSelectedColor(color.name)} style={{ '--swatch': color.value } as React.CSSProperties} />)}</div></div>
          <div className="option-block"><div className="option-heading"><strong>РАЗМЕР</strong><button type="button" onClick={() => setNotice('Сверь свой размер с привычной посадкой')}>ТАБЛИЦА РАЗМЕРОВ <ArrowUpRight size={13} /></button></div><div className="size-list">{activeProduct.sizes.map((size) => <button key={size} type="button" className={selectedSize === size ? 'size-option is-selected' : 'size-option'} aria-pressed={selectedSize === size} onClick={() => setSelectedSize(size)}>{size}</button>)}</div></div>
          <p className={activeProduct.stock ? 'stock-note' : 'stock-note is-unavailable'}><span />{activeProduct.stock ? `${activeProduct.stock} шт. в наличии` : 'Временно нет в наличии'}</p><button className="add-button" disabled={!activeProduct.stock} onClick={() => addToCart(activeProduct, selectedSize, selectedColor)}><ShoppingBag size={18} /> ДОБАВИТЬ В КОРЗИНУ <span>{money.format(activeProduct.price)}</span></button>
          <div className="product-spec"><details open><summary>О ТОВАРЕ <ChevronDown size={16} /></summary><p>{activeProduct.description}</p></details><details><summary>МАТЕРИАЛ И УХОД <ChevronDown size={16} /></summary><p>{activeProduct.material}. Следуйте рекомендациям на внутренней этикетке.</p></details><details><summary>ДОСТАВКА И ВОЗВРАТ <ChevronDown size={16} /></summary><p>Доставка по Казахстану от 2 до 7 рабочих дней. Возврат нового товара возможен в течение 14 дней.</p></details></div>
        </div></div><section className="related-section"><div className="section-top"><div><p className="eyebrow eyebrow-dark"><span /> МОЖЕТ ПОНРАВИТЬСЯ</p><h2>ДОПОЛНИ <i>ОБРАЗ.</i></h2></div></div><div className="product-grid">{products.filter((product) => product.id !== activeProduct.id).slice(0, 4).map((product) => <ProductCard key={product.id} product={product} onOpen={openProduct} onQuickAdd={addToCart} />)}</div></section></section>}

      {route === 'cart' && <section className="cart-page page-wrap"><div className="page-heading"><p className="eyebrow eyebrow-dark"><span /> ТВОЙ ВЫБОР</p><h1>КОРЗИНА <i>({cartCount})</i></h1></div>
        {cart.length === 0 ? <div className="cart-empty"><ShoppingBag size={35} strokeWidth={1.3} /><h2>ЗДЕСЬ ПОКА ПУСТО</h2><p>Самое время найти экипировку для следующей тренировки.</p><button className="button button-dark" onClick={() => openCatalog()}>ПЕРЕЙТИ В КАТАЛОГ <ArrowRight size={16} /></button></div> : <div className="cart-layout"><div className="cart-lines">{cart.map((line, index) => { const product = products.find((item) => item.id === line.productId); if (!product) return null; return <article className="cart-line" key={`${line.productId}-${line.size}-${line.color}`}><button className="cart-line-image" onClick={() => openProduct(product)} aria-label={`Открыть ${product.name}`}><img src={product.image} alt={product.alt} /></button><div className="cart-line-info"><p className="eyebrow eyebrow-dark">{product.categoryLabel.toUpperCase()}</p><button className="cart-product-name" onClick={() => openProduct(product)}>{product.name}</button><span>Цвет: {line.color} · Размер: {line.size}</span><div className="quantity-control"><button aria-label="Уменьшить количество" onClick={() => updateQuantity(line, -1)}><Minus size={14} /></button><span>{line.quantity}</span><button aria-label="Увеличить количество" onClick={() => updateQuantity(line, 1)}><Plus size={14} /></button></div></div><strong className="cart-line-price">{money.format(product.price * line.quantity)}</strong><button className="remove-line" aria-label={`Удалить ${product.name}`} onClick={() => setCart((current) => current.filter((_, itemIndex) => itemIndex !== index))}><X size={18} /></button></article> })}</div>
          <aside className="order-summary"><h2>ВАШ ЗАКАЗ</h2><div><span>Товары · {cartCount} шт.</span><strong>{money.format(cartTotal)}</strong></div><div><span>Доставка</span><strong>{cartTotal >= 30000 ? 'Бесплатно' : money.format(2500)}</strong></div><p>{cartTotal >= 30000 ? 'Отлично! Доставка по Казахстану бесплатная.' : `Ещё ${money.format(30000 - cartTotal)} до бесплатной доставки.`}</p><div className="summary-total"><span>ИТОГО</span><strong>{money.format(cartTotal + (cartTotal >= 30000 ? 0 : 2500))}</strong></div><button className="add-button" onClick={() => setNotice('Заказ оформляется: подключите платёжный сервис магазина')}>ПЕРЕЙТИ К ОФОРМЛЕНИЮ <ArrowRight size={17} /></button><small>Оплата и оформление заказов будут доступны после подключения платёжного сервиса.</small></aside>
        </div>}</section>}

      {route === 'info' && <section className="info-page"><div className="info-hero"><img src="https://images.unsplash.com/photo-1517836357463-d25dfeac3438?auto=format&fit=crop&w=2000&q=85" alt="Спортсмен тренируется в зале" /><div className="info-overlay" /><div><p className="eyebrow"><span /> СДЕЛАНО ДЛЯ ДВИЖЕНИЯ</p><h1>АСЫЛБЕК<br /><i>АРСЛАН.</i></h1></div></div><div className="info-content page-wrap"><section><p className="eyebrow eyebrow-dark"><span /> НАШ ПОДХОД</p><h2>ЭКИПИРОВКА<br />С ХАРАКТЕРОМ.</h2><p>«Асылбек Арслан» — самостоятельный демонстрационный бренд спортивной одежды и экипировки. Мы верим в движение без лишнего шума: функциональные материалы, продуманный крой и вещи, которые хочется носить снова.</p><p>Представленные товары и цены — демонстрационные. Сейчас сайт показывает работу каталога и корзины; реальные покупки пока не принимаются.</p></section><section className="delivery-info"><h2>ДОСТАВКА И ВОЗВРАТ</h2><p>Доставка по Казахстану — ориентировочно 2–7 рабочих дней. При заказе от 30 000 ₸ доставка бесплатна. Для демонстрационной версии оформление заказа и возврат не подключены.</p><h2>КОНТАКТЫ</h2><p><a href="mailto:hello@asylbekarslan.kz">hello@asylbekarslan.kz</a><br /><a href="tel:+77270000000">+7 727 000 00 00</a></p><h2>МЫ В СОЦСЕТЯХ</h2><div className="social-links"><a href="https://instagram.com/" target="_blank" rel="noreferrer">INSTAGRAM <ArrowUpRight size={14} /></a><a href="https://tiktok.com/" target="_blank" rel="noreferrer">TIKTOK <ArrowUpRight size={14} /></a></div></section></div></section>}
    </main>

    <footer className="site-footer"><div className="footer-top page-wrap"><div><Logo /><p>ЭКИПИРОВКА ДЛЯ ТВОЕГО<br />СЛЕДУЮЩЕГО ШАГА.</p></div><div className="footer-nav"><div><strong>КАТАЛОГ</strong><button onClick={() => openCatalog('men')}>Мужская одежда</button><button onClick={() => openCatalog('women')}>Женская одежда</button><button onClick={() => openCatalog('shoes')}>Обувь и аксессуары</button></div><div><strong>ПОМОЩЬ</strong><button onClick={() => navigate('info')}>Доставка и возврат</button><button onClick={() => navigate('info')}>Контакты</button><button onClick={() => navigate('info')}>О бренде</button></div></div></div><div className="footer-bottom page-wrap"><span>© 2026 АСЫЛБЕК АРСЛАН</span><span>НЕЗАВИСИМЫЙ ДЕМО-БРЕНД · НЕ СВЯЗАН С ДРУГИМИ МАРКАМИ</span><button onClick={() => navigate('home')}>НАВЕРХ <ArrowUpRight size={14} /></button></div></footer>
    {notice && <div className="toast" role="status"><Check size={17} />{notice}<button aria-label="Закрыть уведомление" onClick={() => setNotice('')}><X size={16} /></button></div>}
  </>
}

function ProductCard({ product, onOpen, onQuickAdd }: { product: Product; onOpen: (product: Product) => void; onQuickAdd: (product: Product, size: string, color: string) => void }) {
  return <article className="product-card"><button className="product-image" onClick={() => onOpen(product)} aria-label={`Открыть: ${product.name}`}><img src={product.image} alt={product.alt} loading="lazy" />{product.badge && <span className="product-badge">{product.badge.toUpperCase()}</span>}<span className="product-image-arrow"><ArrowUpRight size={19} /></span></button><div className="product-card-info"><div><p>{product.categoryLabel} · {product.collection}</p><button className="product-name" onClick={() => onOpen(product)}>{product.name}</button></div><strong>{money.format(product.price)}</strong></div><div className="product-card-bottom"><div className="product-swatches" aria-label="Доступные цвета">{product.colors.slice(0, 4).map((color) => <span key={color.name} title={color.name} style={{ backgroundColor: color.value }} />)}</div><button className="quick-add" onClick={() => onQuickAdd(product, product.sizes[0], product.colors[0].name)} disabled={!product.stock} aria-label={product.stock ? `Быстро добавить ${product.name}, размер ${product.sizes[0]}` : 'Нет в наличии'}>{product.stock ? 'БЫСТРЫЙ ДОБАВИТЬ' : 'НЕТ В НАЛИЧИИ'} <Plus size={14} /></button></div></article>
}

export default App