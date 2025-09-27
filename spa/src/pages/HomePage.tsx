import React, { useEffect, useMemo, useRef, useState, useCallback } from 'react';
import { fetchProductsPreview } from '../services/products';
import TickerRibbons from '../components/TickerRibbons';
import { useCompliance } from '../context/ComplianceContext';

// Feature flags for reversible UI behavior
// Set to false to revert to normal per-country ticker behavior
const FEATURE_FLAGS = {
  forceUsTickerForNonUk: true,
};

// Forest Image Slider Component
function ForestSlider() {
  const [currentImage, setCurrentImage] = useState(0);
  
  const forestImages = [
    { src: new URL('../assets/forests/forests_1.jpg', import.meta.url).toString(), alt: 'Forest conservation 1' },
    { src: new URL('../assets/forests/forests_2.jpg', import.meta.url).toString(), alt: 'Forest conservation 2' },
    { src: new URL('../assets/forests/forests_5.jpeg', import.meta.url).toString(), alt: 'Forest conservation 5' },
    { src: new URL('../assets/forests/forests_3.jpg', import.meta.url).toString(), alt: 'Forest conservation 3' },
    { src: new URL('../assets/forests/forests_4.jpg', import.meta.url).toString(), alt: 'Forest conservation 4' },
    { src: new URL('../assets/forests/forests_6.jpeg', import.meta.url).toString(), alt: 'Forest conservation 6' },
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImage((prev) => (prev + 1) % forestImages.length);
    }, 6000); // Change image every 3 seconds

    return () => clearInterval(interval);
  }, [forestImages.length]);

  return (
    <div className="max-w-[450px] mx-auto">
      <div className="glass max-w-[350px] max-h-[250px] mx-auto nv-glass--inner-hairline border border-white/10 rounded-2xl overflow-hidden relative">
        {/* <img 
          key={0}
          src={forestImages[0].src} 
          alt={forestImages[0].alt}
          className={`w-full h-auto mx-auto object-cover transition-opacity duration-1000`}
        /> */}
        <div className="relative w-full h-auto">
          {forestImages.map((image, index) => (
            <img 
              key={index}
              src={image.src} 
              alt={image.alt}
              className={`w-full h-auto max-w-[350px] mx-auto object-cover transition-opacity duration-1000 ${
                index === currentImage ? 'opacity-100' : 'opacity-0 absolute inset-0'
              }`}
            />
          ))}
        </div>
        
        {/* Slider indicators */}
        <div className="absolute bottom-3 left-1/2 transform -translate-x-1/2 flex gap-2">
          {forestImages.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentImage(index)}
              className={`w-2 h-2 rounded-full transition-all duration-300 ${
                index === currentImage ? 'bg-white' : 'bg-white/40 hover:bg-white/60'
              }`}
              aria-label={`Go to image ${index + 1}`}
            />
          ))}
        </div>
      </div>
      <p className="mt-2 text-md text-gray-200 text-center">
        Nirvana dedicates 10% of total consolidated revenues to protecting all forests, restoring ecosystems, safeguarding animals, and improving the human condition.
      </p>
    </div>
  );
}

export default function HomePage() {
  const { state } = useCompliance();
  const [items, setItems] = useState<Array<{name?:string; symbol?:string; compass_score?:number}>>([]);
  const [loading, setLoading] = useState(true);
  const chatRef = useRef<HTMLDivElement | null>(null);
  const mobileChatRef = useRef<HTMLDivElement | null>(null);
  const [locked, setLocked] = useState(false);
  const [showTip, setShowTip] = useState(false);
  const [mobileLocked, setMobileLocked] = useState(false);
  const [mobileShowTip, setMobileShowTip] = useState(false);
  const handleWsjDownload = useCallback((e?: React.MouseEvent) => {
    try {
      if (e) {
        e.preventDefault();
        e.stopPropagation();
      }
      const url = '/static/pdf/WSJ_Article_30_July_2025.pdf';
      const a = document.createElement('a');
      a.href = url;
      a.download = 'WSJ_Article_30_July_2025.pdf';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    } catch {}
  }, []);
  
  // Use selected region for tickers, fallback to US if not set or insufficient data
  const tickerCountry = useMemo(() => {
    if (!state.accepted || !state.region) return 'US';
    
    // Map regions to country codes for ticker API
    const regionToCountryMap: Record<string, string> = {
      'US': 'US',
      'CA': 'CA', 
      'UK': 'UK',
      'EU': 'EU',
      'CN': 'CN',
      'IN': 'IN',
      'CH': 'CH',
      'JP': 'JP',
      'OTHER': 'US' // fallback to US for other regions
    };
    
    return regionToCountryMap[state.region] || 'US';
  }, [state.accepted, state.region]);

  // Effective country considering feature flags
  const effectiveTickerCountry = useMemo(() => {
    if (FEATURE_FLAGS.forceUsTickerForNonUk && tickerCountry !== 'UK') return 'US';
    return tickerCountry;
  }, [tickerCountry]);
  useEffect(() => {
    // Do not fetch real products until compliance is accepted
    if (!state.accepted) {
      setItems([]);
      setLoading(false);
      return;
    }

    // setLoading(true);
    // fetchProductsPreview(tickerCountry).then((res: Array<{name?:string; symbol?:string; compass_score?:number}>)=>{
    //   setItems(res);
    // }).finally(()=> setLoading(false));
  }, [tickerCountry, state.accepted]);


  // Placeholder data for Home page (no real products)
  const placeholder = useMemo(() => {
    const phrase = 'Please subscribe to see products';
    const words = phrase.split(' ');

    const createSeededRandom = (seed: number) => {
      let s = seed % 2147483647;
      if (s <= 0) s += 2147483646;
      return () => (s = (s * 16807) % 2147483647) / 2147483647;
    };

    const shuffleWithSeed = (arr: string[], seed: number) => {
      const a = arr.slice();
      const rand = createSeededRandom(seed);
      for (let i = a.length - 1; i > 0; i--) {
        const j = Math.floor(rand() * (i + 1));
        const tmp = a[i];
        a[i] = a[j];
        a[j] = tmp;
      }
      return a;
    };

    const count = Math.max(items.length || 0, 20);
    const names: string[] = Array.from({ length: count }, (_, idx) => {
      const s = shuffleWithSeed(words, 1000 + idx).join(' ');
      return s ? s.charAt(0).toUpperCase() + s.slice(1) : s;
    });

    // Scores: top 3 fixed; others random multiples of 50 in descending order
    const scores: number[] = new Array(count).fill(0);
    if (count > 0) scores[0] = 9100;
    if (count > 1) scores[1] = 8450;
    if (count > 2) scores[2] = 8200;
    let previous = count > 2 ? 8200 : count > 1 ? 8450 : count > 0 ? 9100 : 9000;
    for (let i = 3; i < count; i++) {
      const rand = createSeededRandom(2000 + i);
      // Decrease by at least 50, up to 300, step is multiple of 50
      const step = (1 + Math.floor(rand() * 6)) * 50; // 50..300
      previous = Math.max(previous - step, 50);
      previous = previous - (previous % 50);
      scores[i] = previous;
    }

    return { names, scores };
  }, [items.length]);

  // Charities images (used for desktop row and mobile marquee)
  const charities = useMemo(() => {
    const arr = [
      { src: new URL('../assets/charities/1.jpg', import.meta.url).toString(), alt: "The Dzunuk'wa Society" },
      { src: new URL('../assets/charities/2.jpg', import.meta.url).toString(), alt: 'Sea Shepherd' },
      { src: new URL('../assets/charities/3.jpg', import.meta.url).toString(), alt: 'Rainforest Flying Squad' },
      { src: new URL('../assets/charities/4.jpg', import.meta.url).toString(), alt: 'PETA' },
      { src: new URL('../assets/charities/5.jpg', import.meta.url).toString(), alt: 'Greenpeace' },
      { src: new URL('../assets/charities/6.jpg', import.meta.url).toString(), alt: '6' },
      { src: new URL('../assets/charities/7.jpg', import.meta.url).toString(), alt: '7' },
      { src: new URL('../assets/charities/8.jpg', import.meta.url).toString(), alt: '8' },
      { src: new URL('../assets/charities/9.jpg', import.meta.url).toString(), alt: 'Women Center' },
      { src: new URL('../assets/charities/10.jpg', import.meta.url).toString(), alt: 'World Animal Protection' },
    ];
    // Shuffle once per mount to randomize order while keeping infinite loop seamless
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      const tmp = arr[i];
      arr[i] = arr[j];
      arr[j] = tmp;
    }
    return arr;
  }, []);

  return (
    <div className="relative max-w-full mx-auto">
    {/* <div className="relative max-w-[1450px] mx-auto"> */}
      {/* Full-viewport-width ticker (ignores main padding) */}
      {/* <div className="mt-2 mb-2" style={{ width: '100vw', marginLeft: 'calc(50% - 50vw)' }}>
        <TickerRibbons size={20} mode="five_stars" country={effectiveTickerCountry} staticMode={!state.accepted} />
      </div> */}
      {/* Nirvana supports - inside first row, no extra vertical gap */}
      <div className="px-3 md:px-6 pt-2 mt-6 mb-14 md:max-w-[85%] mx-auto">
        <span className="block md:hidden mb-6 whitespace-nowrap text-gray-200 trajan-text uppercase text-2xl">
          Nirvana supports:
        </span>
        <div className="inline-flex mt-2 w-full items-center gap-5 justify-center">
          <span className="hidden md:block whitespace-nowrap text-gray-200 trajan-text uppercase text-sm md:text-2xl">
            Nirvana supports:
          </span>
          {/* Desktop: infinite smooth marquee */}
          <div className='hidden md:flex w-full items-center relative'>
            <style>
              {`
                @keyframes nv-charities-marquee-desktop {
                  0% { transform: translateX(0); }
                  100% { transform: translateX(-50%); }
                }
              `}
            </style>
            <div className="relative w-full overflow-hidden" style={{ WebkitOverflowScrolling: 'auto' }}>
              <div
                className="flex items-center whitespace-nowrap gap-10 md:gap-16 px-8"
                style={{ animation: 'nv-charities-marquee-desktop 28s linear infinite' }}
              >
                <div className="flex items-center shrink-0 gap-10 md:gap-16">
                  {charities.map((c, idx) => (
                    <img
                      key={`d1-${idx}`}
                      src={c.src}
                      alt={c.alt}
                      className="h-16 md:h-24 w-auto object-contain"
                    />
                  ))}
                </div>
                <div className="flex items-center shrink-0 gap-10 md:gap-16" aria-hidden="true">
                  {charities.map((c, idx) => (
                    <img
                      key={`d2-${idx}`}
                      src={c.src}
                      alt={c.alt}
                      className="h-16 md:h-24 w-auto object-contain"
                    />
                  ))}
                </div>
              </div>
              {/* optional fading edges */}
              <div className="pointer-events-none absolute inset-y-0 left-0 w-10" style={{ background: 'linear-gradient(to right, rgba(0,0,0,0.85), rgba(0,0,0,0))' }} />
              <div className="pointer-events-none absolute inset-y-0 right-0 w-10" style={{ background: 'linear-gradient(to left, rgba(0,0,0,0.85), rgba(0,0,0,0))' }} />
            </div>
          </div>
          {/* Mobile: infinite marquee with fading edges */}
          <div className="relative md:hidden overflow-hidden" style={{ width: '100vw', marginLeft: 'calc(50% - 50vw)', marginRight: 'calc(50% - 50vw)' }}>
            {/* Keyframes for marquee (scoped by name) */}
            <style>
              {`
                @keyframes nv-charities-marquee {
                  0% { transform: translateX(0); }
                  100% { transform: translateX(-50%); }
                }
              `}
            </style>
            <div
              className="flex items-center whitespace-nowrap"
              style={{ animation: 'nv-charities-marquee 28s linear infinite' }}
            >
              <div className="flex items-center shrink-0">
                {charities.map((c, idx) => (
                  <img
                    key={`m1-${idx}`}
                    src={c.src}
                    alt={c.alt}
                    className="h-20 mr-6 w-auto object-contain"
                  />
                ))}
              </div>
              <div className="flex items-center shrink-0" aria-hidden="true">
                {charities.map((c, idx) => (
                  <img
                    key={`m2-${idx}`}
                    src={c.src}
                    alt={c.alt}
                    className="h-20 mr-6 w-auto object-contain"
                  />
                ))}
              </div>
            </div>
            {/* Fading edges overlays */}
            <div
              className="pointer-events-none absolute inset-y-0 left-0 w-10"
              style={{ background: 'linear-gradient(to right, rgba(0,0,0,0.85), rgba(0,0,0,0))' }}
            />
            <div
              className="pointer-events-none absolute inset-y-0 right-0 w-10"
              style={{ background: 'linear-gradient(to left, rgba(0,0,0,0.85), rgba(0,0,0,0))' }}
            />
          </div>
        </div>
      </div>

      <div className="w-full">
        <div className="w-full px-3 md:px-6 grid grid-cols-1 md:grid-cols-12 gap-4 pt-3 md:pt-2 pb-8 items-stretch 2xl:h-[calc(100dvh-var(--rib-h,84px))]">
          
          {/* Mobile-only WSJ quote */}
          <div className="md:hidden col-span-1 text-center px-2 mt-24 mb-6">
            <div className="trajan-text text-2xl text-white">
              <a href="https://www.wsj.com/finance/investing/financial-advice-investments-personalization-fea73e95" className="hover:underline hover:decoration-[#ff7f50] text-white" target="_blank" rel="noopener noreferrer">
                <div style={{ color: '#ff7f50' }}>
                  <p>"Why So Many People Get Financial Advice That Is Wrong for Them"</p>
                  <div className="mt-2">
                    <span>- </span>
                    <span className="underline underline-offset-2 decoration-[#ff7f50]">Wall Street Journal,</span>
                    <span> 30th July 2025</span>
                    <button
                      type="button"
                      onClick={handleWsjDownload}
                      className="ml-2 inline-flex items-center justify-center align-middle rounded-md border border-white/20 text-white hover:bg-white/10 p-1"
                      title="Download the WSJ article (PDF)"
                      aria-label="Download the WSJ article (PDF)"
                    >
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                        <polyline points="7 10 12 15 17 10" />
                        <line x1="12" y1="15" x2="12" y2="3" />
                      </svg>
                    </button>
                  </div>
                </div>
              </a>
            </div>
          </div>
          
          {/* Mobile-only mission text */}
          <div className="md:hidden col-span-1 text-center px-2 mb-6">
              <div className="text-lg text-white system-ui" style={{ fontWeight: 300, color: '#ff7f50' }}>
                <p>Industry "risk" and fund-rating labels hide the true size of potential losses.</p>
                <p className='mt-2'>Nearly 75% of people worldwide simply want to know the bottom line: How much could I lose if things go wrong? We are here for you.</p>
                <p className='mt-2'>Nirvana is the only global retail-facing service built around loss aversion. By far the most dominant investor behavior on the planet.</p>
            </div>
          </div>
          
          {/* Mobile-only navigation buttons */}
          <div className="md:hidden col-span-1 px-2 mt-8 mb-6">
            <div className="flex flex-col gap-3">
              <a href="/what-is-this-all-about" role="button" className="glass trajan-text nv-glass--inner-hairline border border-white/10 rounded-lg px-3 py-2 block w-full text-gray-200 hover:text-white text-center">Message from the founder</a>
              <a href="/why-do-we-exist" role="button" className="glass trajan-text nv-glass--inner-hairline border border-white/10 rounded-lg px-3 py-2 block w-full text-gray-200 hover:text-white text-center">Why do we exist</a>
              <a href="/your-right-to-know" role="button" className="glass trajan-text nv-glass--inner-hairline border border-white/10 rounded-lg px-3 py-2 block w-full text-gray-200 hover:text-white text-center">Your right to know</a>
              <a href="/the-founder" role="button" className="glass trajan-text nv-glass--inner-hairline border border-white/10 rounded-lg px-3 py-2 block w-full text-gray-200 hover:text-white text-center">The Founder</a>
              <a href="/nirvana-fellows" role="button" className="glass trajan-text nv-glass--inner-hairline border border-white/10 rounded-lg px-3 py-2 block w-full text-gray-200 hover:text-white text-center">Nirvana Fellows</a>
              <a href="/have-a-code-or-need-one" role="button" className="glass trajan-text nv-glass--inner-hairline border border-white/10 rounded-lg px-3 py-2 block w-full text-gray-200 hover:text-white text-center">
                <div>Trust Code programme</div>
                <div>You save 10% & we donate another 10%</div>
                <div>to your chosen organisation</div>
              </a>
              <a href="/trust-code-programme" role="button" className="glass trajan-text nv-glass--inner-hairline border border-white/10 rounded-lg px-3 py-2 block w-full text-gray-200 hover:text-white text-center">Trust Code Programme - Organisations</a>
              <a href="/founder-statement-on-cryptocurrencies" role="button" className="glass trajan-text nv-glass--inner-hairline border border-white/10 rounded-lg px-3 py-2 block w-full text-gray-200 hover:text-white text-center">Founder statement on crypto "currencies"</a>
            </div>
          </div>

          {/* Mobile-only Forest Slider with 10% text */}
          <div className="md:hidden col-span-1 px-2 mb-6">
            <div className="glass nv-glass--inner-hairline border border-white/10 rounded-2xl p-4 flex flex-col items-center">
              <ForestSlider />
            </div>
          </div>

          {/* Mobile-only Proximity Search */}
          <div className="md:hidden col-span-1 px-2 mb-6">
            <div className="glass bg-black/10 w-full justify-start nv-glass--inner-hairline early-form px-4 py-6 border border-white/10 rounded-2xl flex flex-col">
              <div className="flex gap-2 mb-3 items-start">
                <p className="text-white !text-4xl trajan-text">Proximity</p>
                <p className="text-white !text-md trajan-text relative right-1 bottom-1">Search</p>
                <div className="relative right-2 bottom-2 mb-0 ml-0">
                  <button
                    type="button"
                    aria-label="What's this?"
                    onMouseEnter={()=>setMobileShowTip(true)}
                    onMouseLeave={()=>setMobileShowTip(false)}
                    onFocus={()=>setMobileShowTip(true)}
                    onBlur={()=>setMobileShowTip(false)}
                    onClick={()=>setMobileShowTip((v)=>!v)}
                    className="w-3 h-3 inline-flex items-center justify-center rounded-full border border-white/40 text-white/80 hover:text-white hover:border-white text-[8px]"
                    title="What's this?"
                  >
                    i
                  </button>
                  {mobileShowTip && (
                    <div className="text-[12px] absolute top-full left-1/2 -translate-x-1/2 mt-2 z-10 text-gray-300 bg-black/40 border border-white/10 rounded-md p-2 w-fit whitespace-nowrap">
                      Nirvana's search engine
                    </div>
                  )}
                </div>
              </div>
              <div className="flex flex-col gap-2 w-full early-form mt-auto">
                <div ref={mobileChatRef} className="flex flex-col gap-2 mb-4">
                  <div className="flex justify-end">
                    <p className="chat-bubble w-fit chat-bubble--right">Welcome to Nirvana</p>
                  </div>
                  {/* <div className="flex justify-end">
                    <p className="chat-bubble w-fit chat-bubble--right">Begin anywhere</p>
                  </div> */}
                </div>
                <form className="w-full flex flex-row justify-center items-center early-form glass nv-glass--inner-hairline" onSubmit={(e)=>{
                  e.preventDefault();
                  if (mobileLocked) return;
                  const input = (e.currentTarget.querySelector('input') as HTMLInputElement);
                  const msg = (input?.value || '').trim();
                  if (!msg) return;
                  // Append user's message on the left
                  if (mobileChatRef.current) {
                    const row = document.createElement('div');
                    row.className = 'flex justify-start';
                    const bubble = document.createElement('p');
                    bubble.className = 'chat-bubble fade-in-up';
                    bubble.style.background = '#1c39bb';
                    bubble.style.color = '#ffffff';
                    bubble.textContent = msg;
                    row.appendChild(bubble);
                    mobileChatRef.current.appendChild(row);
                    mobileChatRef.current.scrollTop = mobileChatRef.current.scrollHeight;
                  }
                  if (input) input.value = '';
                  // Typing indicator on the right for ~2.5s
                  const typingRow = document.createElement('div');
                  typingRow.className = 'flex justify-end';
                  const typing = document.createElement('div');
                  typing.className = 'chat-bubble chat-bubble--right fade-in-up typing';
                  typing.innerHTML = '<span class="dot"></span><span class="dot"></span><span class="dot"></span>';
                  typingRow.appendChild(typing);
                  mobileChatRef.current?.appendChild(typingRow);
                  mobileChatRef.current?.scrollTo({ top: mobileChatRef.current.scrollHeight });
                  setMobileLocked(true);
                  setTimeout(()=>{
                    try { mobileChatRef.current?.removeChild(typingRow); } catch {}
                    const ansRow = document.createElement('div');
                    ansRow.className = 'flex justify-end';
                    const ans = document.createElement('p');
                    ans.className = 'chat-bubble chat-bubble--right fade-in-up';
                    ans.textContent = 'Thank you for your message, Nirvana will be live soon';
                    ansRow.appendChild(ans);
                    mobileChatRef.current?.appendChild(ansRow);
                    mobileChatRef.current?.scrollTo({ top: mobileChatRef.current.scrollHeight });
                  }, 2500);
                }}>
                  <div className="px-5 py-4 flex-1">
                    <input type="text" placeholder="Talk.." className="w-full bg-transparent outline-none text-white placeholder:text-gray-400 leading-none" disabled={mobileLocked} />
                  </div>
                  <div>
                    <button type="submit" disabled={mobileLocked} className="h-[40px] px-4 md:px-4 mr-2 bg-[#c19658] rounded-xl text-black hover:opacity-90 hover:bg-[#c19658]/90 disabled:opacity-60 disabled:cursor-not-allowed">
                      <span className="text-sm">Search</span>
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>

          {/* Mobile-only Search Results */}
          <div className="md:hidden col-span-1 px-2 mb-6">
            <div className="glass nv-glass--inner-hairline border border-white/10 rounded-2xl p-4 flex flex-col">
              <div className="grid grid-cols-2 text-[11px] uppercase tracking-wider text-gray-400 mb-3">
                <div>
                  <div>Search results</div>
                  {/* <div className="text-gray-300 normal-case tracking-normal mt-1" style={{ color: '#ff7f50' }}>
                    No AI used in search
                  </div> */}
                </div>
                <div className="text-right justify-self-end">
                  <p className='block'>Search relevance index</p>
                  <p className='block'>(Compass Score)</p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-y-2 text-sm">
                {Array.from({ length: Math.min(Math.max(items.length || 0, 10), 10) }).map((_, idx) => {
                  const displayName = placeholder.names[idx] ?? 'Please subscribe to see products';
                  const cs = placeholder.scores[idx] ?? null;
                  return (
                    <React.Fragment key={idx}>
                      <div className="text-gray-200 truncate" style={{ filter: 'blur(4px)', userSelect: 'none' }}>{displayName}</div>
                      <div className="justify-self-end nv-score nv-score--sm" style={{ filter: 'blur(4px)' }}>{cs ?? '-'}</div>
                    </React.Fragment>
                  );
                })}
              </div>
              {loading && <div className="text-xs text-gray-400 mt-2">Loading…</div>}
            </div>
          </div>
          
          {/* Left column */}
          <div className="md:col-span-3 items-end hidden md:flex pr-6 flex-col gap-4 pt-0 h-full mt-4">
            <div className="flex flex-col max-w-[400px] space-y-4 gap-4 h-full">
              <div className="flex flex-col justify-center gap-5 h-full">
                <div className="trajan-text text-lg text-white">
                  <a href="https://www.wsj.com/finance/investing/financial-advice-investments-personalization-fea73e95" className="hover:underline hover:decoration-[#ff7f50] text-white" target="_blank" rel="noopener noreferrer">
                    <div style={{ color: '#ff7f50' }}>
                      <p>"Why So Many People Get Financial Advice That Is Wrong for Them"</p>
                      <div className="mt-2">
                        <span className="underline underline-offset-2 decoration-[#ff7f50]">- Wall Street Journal,</span>
                        <span> 30th July 2025</span>
                        <button
                          type="button"
                          onClick={handleWsjDownload}
                          className="ml-2 inline-flex items-center justify-center align-middle rounded-md border border-white/20 text-white hover:bg-white/10 p-1"
                          title="Download the WSJ article (PDF)"
                          aria-label="Download the WSJ article (PDF)"
                        >
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                            <polyline points="7 10 12 15 17 10" />
                            <line x1="12" y1="15" x2="12" y2="3" />
                          </svg>
                        </button>
                      </div>
                    </div>
                  </a>
                </div>
                <div className="text-md text-white system-ui" style={{ fontWeight: 300, color: '#ff7f50' }}>
                  <p>Industry "risk" and fund-rating labels hide the true size of potential losses.</p>
                  <p className='mt-2'>Nearly 75% of people worldwide simply want to know the bottom line: How much could I lose if things go wrong? We are here for you.</p>
                  <p className='mt-2'>Nirvana is the only global retail-facing service built around loss aversion. By far the most dominant investor behavior on the planet.</p>
                </div>
              </div>
            </div>
            <div className="flex flex-col max-w-[400px] w-full">
              <div className="flex flex-col max-w-[400px] gap-4">
                <a href="/what-does-an-annual-nirvana-membership-give-you" role="button" className="glass nv-glass--inner-hairline border border-white/10 rounded-lg px-3 py-2 inline-block text-gray-200 hover:text-white">What does an annual Nirvana membership give you?</a>
                <a href="/nirvana-membership-fees" role="button" className="glass nv-glass--inner-hairline border border-white/10 rounded-lg px-3 py-2 inline-block text-gray-200 hover:text-white">Nirvana membership fees</a>
                <a href="/what-is-compass-score" role="button" className="glass nv-glass--inner-hairline border border-white/10 rounded-lg px-3 py-2 inline-block text-gray-200 hover:text-white">The Compass Score</a>
                <a href="/why-do-i-need-it" role="button" className="glass nv-glass--inner-hairline border border-white/10 rounded-lg px-3 py-2 inline-block text-gray-200 hover:text-white">Sur - why do I need it?</a>
                <a href="/member-eula" role="button" className="glass nv-glass--inner-hairline border border-white/10 rounded-lg px-3 py-2 inline-block text-gray-200 hover:text-white">Member EULA</a>
                <img src={new URL('../assets/NirvanaFireFlyLogo.png', import.meta.url).toString()} alt="Nirvana" className="h-auto mx-auto max-h-40 w-auto object-contain" />
              </div>
            </div>
          </div>

          {/* Center chat column */}
          <div className="hidden md:grid md:grid-rows-[auto_1fr] gap-2 md:col-span-5 md:h-full md:min-h-0">
            {/* Desktop only buttons - hidden on mobile */}
            <div className="hidden md:flex flex-col row-span-1 gap-3 w-full justify-start content-start">

              <div className="flex flex-row flex-wrap gap-3 justify-center">
                <a href="/what-is-this-all-about" role="button" className="glass text-lg trajan-text nv-glass--inner-hairline border border-white/10 rounded-lg px-4 py-2 block md:w-full md:max-w-[475px] h-auto self-start text-white hover:text-gray-200 text-center">
                  <div>Message from the founder</div>
                  {/* <div>What is this all about</div>
                  <div>a message from the founder</div> */}
                </a>
              </div>
              <div className="flex flex-row flex-wrap gap-2 justify-center">
                <a href="/why-do-we-exist" role="button" className="glass text-lg trajan-text nv-glass--inner-hairline border border-white/10 rounded-lg px-4 py-2 block md:w-full md:max-w-[475px] h-auto self-start text-white hover:text-gray-200 text-center">Why do we exist</a>
              </div>
              <div className="flex flex-row flex-wrap gap-2 justify-center">
                <a href="/your-right-to-know" role="button" className="glass text-lg trajan-text nv-glass--inner-hairline border border-white/10 rounded-lg px-4 py-2 block md:w-full md:max-w-[475px] h-auto self-start text-white hover:text-gray-200 text-center">Your right to know</a>
              </div>
              <div className="flex flex-row flex-wrap gap-2 justify-center">
                <a href="/the-founder" role="button" className="glass text-lg trajan-text nv-glass--inner-hairline border border-white/10 rounded-lg px-4 py-2 block md:w-full md:max-w-[475px] h-auto self-start text-white hover:text-gray-200 text-center">The Founder</a>
              </div>
              <div className="flex flex-row flex-wrap gap-2 justify-center">
                <a href="/nirvana-fellows" role="button" className="glass text-lg trajan-text nv-glass--inner-hairline border border-white/10 rounded-lg px-4 py-2 block md:w-full md:max-w-[475px] h-auto self-start text-white hover:text-gray-200 text-center">Nirvana Fellows</a>
              </div>
              <div className="flex flex-row flex-wrap gap-2 justify-center">
                <a href="/have-a-code-or-need-one" role="button" className="glass text-lg trajan-text nv-glass--inner-hairline border border-white/10 rounded-lg px-4 py-2 block md:w-full md:max-w-[475px] h-auto self-start text-white hover:text-gray-200 text-center">
                  <div>Trust Code programme</div>
                  <div>You save 10% & we donate another 10%</div>
                  <div>to your chosen organisation</div>
                </a>
              </div>
              <div className="flex flex-row flex-wrap gap-2 justify-center">
                <a href="/trust-code-programme" role="button" className="glass text-lg trajan-text nv-glass--inner-hairline border border-white/10 rounded-lg px-4 py-2 block md:w-full md:max-w-[475px] h-auto self-start text-white hover:text-gray-200 text-center">Trust Code Programme - Organisations</a>
              </div>
              <div className="flex flex-row flex-wrap gap-2 justify-center mb-20">
                <a href="/founder-statement-on-cryptocurrencies" role="button" className="glass text-lg trajan-text nv-glass--inner-hairline border border-white/10 rounded-lg px-4 py-2 block md:w-full md:max-w-[475px] h-auto self-start text-white hover:text-gray-200 text-center">Founder statement on crypto "currencies"</a>
              </div>
            </div>
            <div className="glass mt-6 md:mt-0 
                            bg-black/10 md:row-span-1 w-full 
                            md:h-full md:min-h-0 justify-start 
                            nv-glass--inner-hairline early-form 
                            px-4 py-5 border border-white/10 
                            rounded-2xl flex flex-col md:overflow-hidden">
              <div className="flex gap-2 mb-3 items-start">
                <p className="text-white !text-4xl trajan-text">Proximity</p>
                <p className="text-white !text-md trajan-text relative right-1 bottom-1">Search</p>
                <div className="relative right-2 bottom-2 mb-0 ml-0">
                  <button
                    type="button"
                    aria-label="What's this?"
                    onMouseEnter={()=>setShowTip(true)}
                    onMouseLeave={()=>setShowTip(false)}
                    onFocus={()=>setShowTip(true)}
                    onBlur={()=>setShowTip(false)}
                    onClick={()=>setShowTip((v)=>!v)}
                    className="w-3 h-3 inline-flex items-center justify-center rounded-full border border-white/40 text-white/80 hover:text-white hover:border-white text-[8px]"
                    title="What's this?"
                  >
                    i
                  </button>
                  {showTip && (
                    <div className="text-[12px] absolute top-full left-1/2 -translate-x-1/2 mt-2 z-10 text-gray-300 bg-black/40 border border-white/10 rounded-md p-2 w-fit whitespace-nowrap">
                      Nirvana's search engine
                    </div>
                  )}
                </div>
              </div>
              <div className="flex flex-col gap-2 w-full early-form mt-auto">
                <div ref={chatRef} className="flex flex-col gap-2 mb-4">
                  <div className="flex justify-end">
                    <p className="chat-bubble w-fit chat-bubble--right">Welcome to Nirvana</p>
                  </div>
                  {/* <div className="flex justify-end">
                    <p className="chat-bubble w-fit chat-bubble--right">Begin anywhere</p>
                  </div> */}
                </div>
                <form className="w-full flex flex-row justify-center items-center early-form glass nv-glass--inner-hairline" onSubmit={(e)=>{
                  e.preventDefault();
                  if (locked) return;
                  const input = (e.currentTarget.querySelector('input') as HTMLInputElement);
                  const msg = (input?.value || '').trim();
                  if (!msg) return;
                  // Append user's message on the left
                  if (chatRef.current) {
                    const row = document.createElement('div');
                    row.className = 'flex justify-start';
                    const bubble = document.createElement('p');
                    bubble.className = 'chat-bubble fade-in-up';
                    bubble.style.background = '#1c39bb';
                    bubble.style.color = '#ffffff';
                    bubble.textContent = msg;
                    row.appendChild(bubble);
                    chatRef.current.appendChild(row);
                    chatRef.current.scrollTop = chatRef.current.scrollHeight;
                  }
                  if (input) input.value = '';
                  // Typing indicator on the right for ~2.5s
                  const typingRow = document.createElement('div');
                  typingRow.className = 'flex justify-end';
                  const typing = document.createElement('div');
                  typing.className = 'chat-bubble chat-bubble--right fade-in-up typing';
                  typing.innerHTML = '<span class="dot"></span><span class="dot"></span><span class="dot"></span>';
                  typingRow.appendChild(typing);
                  chatRef.current?.appendChild(typingRow);
                  chatRef.current?.scrollTo({ top: chatRef.current.scrollHeight });
                  setLocked(true);
                  setTimeout(()=>{
                    try { chatRef.current?.removeChild(typingRow); } catch {}
                    const ansRow = document.createElement('div');
                    ansRow.className = 'flex justify-end';
                    const ans = document.createElement('p');
                    ans.className = 'chat-bubble chat-bubble--right fade-in-up';
                    // ans.textContent = 'Enter a product name or symbol, or specify a loss limit (e.g., −20%)';
                    ans.textContent = 'Thank you for your message, Nirvana will be live soon';
                    ansRow.appendChild(ans);
                    chatRef.current?.appendChild(ansRow);
                    chatRef.current?.scrollTo({ top: chatRef.current.scrollHeight });
                  }, 2500);
                }}>
                  <div className="px-5 py-4 flex-1">
                    <input type="text" placeholder="Say anything.." className="w-full bg-transparent outline-none text-white placeholder:text-gray-400 leading-none" disabled={locked} />
                  </div>
                  <div>
                    <button type="submit" disabled={locked} className="h-[40px] px-4 md:px-4 mr-2 bg-[#c19658] rounded-xl text-black hover:opacity-90 hover:bg-[#c19658]/90 disabled:opacity-60 disabled:cursor-not-allowed">
                      <span className="text-sm">Search</span>
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>

          {/* Right scores column (stable height); on mobile goes after chat */}
          <div className="hidden max-w-[450px] md:grid md:grid-rows-[5fr_7fr] gap-5 md:col-span-4 md:h-full md:min-h-0">
            <div className='md:row-span-1 flex items-center justify-center'>
              <ForestSlider />
            </div>
            <div className="glass nv-glass--inner-hairline border border-white/10 md:row-span-1 md:h-full md:min-h-0 rounded-2xl p-4 flex flex-col md:overflow-hidden">
              <div className="grid grid-cols-2 text-[11px] uppercase tracking-wider text-gray-400 mb-3">
                <div>
                <div>Search results</div>
                  {/* <div className="text-gray-300 normal-case tracking-normal mt-1" style={{ color: '#ff7f50' }}>
                    No AI used in search
                  </div> */}
                </div>
                <div className="text-right justify-self-end">
                  <p className='block'>Search relevance index</p>
                  <p className='block'>(Compass Score)</p>
                </div>
              </div>
              <div className="md:flex-1 md:overflow-hidden md:min-h-0">
                <div className="grid grid-cols-2 gap-y-2 text-sm">
                  {Array.from({ length: Math.min(Math.max(items.length || 0, 10), 10) }).map((_, idx) => {
                    const displayName = placeholder.names[idx] ?? 'Please subscribe to see products';
                    const cs = placeholder.scores[idx] ?? null;
                    return (
                      <React.Fragment key={idx}>
                        <div className="text-gray-200 truncate" style={{ filter: 'blur(4px)', userSelect: 'none' }}>{displayName}</div>
                        <div className="justify-self-end nv-score nv-score--sm" style={{ filter: 'blur(4px)' }}>{cs ?? '-'}</div>
                      </React.Fragment>
                    );
                  })}
                </div>
                {loading && <div className="text-xs text-gray-400 mt-2">Loading…</div>}
              </div>
            </div>
          </div>
        </div>

        {/* Mobile-only bottom bar: full-width buttons, logo below */}
        <div className="md:hidden px-3 pb-5">
          <div className="flex flex-col gap-4 items-stretch">
            <div className="flex flex-col gap-3">
              {/* <a href="/trust-code-programme" role="button" className="glass nv-glass--inner-hairline border border-white/10 rounded-lg px-3 py-2 block w-full text-gray-200 hover:text-white text-center">Trust Code Programme - Organisations</a> */}
              {/* <a href="/the-founder" className="glass nv-glass--inner-hairline border border-white/10 rounded-lg px-3 py-2 block w-full text-gray-200 hover:text-white text-center">About us</a> */}
              <a href="/what-does-an-annual-nirvana-membership-give-you" role="button" className="glass nv-glass--inner-hairline border border-white/10 rounded-lg px-3 py-2 block w-full text-gray-200 hover:text-white text-center">What does an annual Nirvana membership give you?</a>
              <a href="/nirvana-membership-fees" role="button" className="glass nv-glass--inner-hairline border border-white/10 rounded-lg px-3 py-2 block w-full text-gray-200 hover:text-white text-center">Nirvana membership fees</a>
              <a href="/what-is-compass-score" role="button" className="glass nv-glass--inner-hairline border border-white/10 rounded-lg px-3 py-2 block w-full text-gray-200 hover:text-white text-center">The Compass Score</a>
              <a href="/why-do-i-need-it" role="button" className="glass nv-glass--inner-hairline border border-white/10 rounded-lg px-3 py-2 block w-full text-gray-200 hover:text-white text-center">Sur - why do I need it?</a>
              <a href="/member-eula" role="button" className="glass nv-glass--inner-hairline border border-white/10 rounded-lg px-3 py-2 block w-full text-gray-200 hover:text-white text-center">Member EULA</a>
            </div>
            <div className="flex items-center justify-center">
              <img src={new URL('../assets/NirvanaFireFlyLogo.png', import.meta.url).toString()} alt="Nirvana" className="h-auto max-h-44 w-auto object-contain" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}


