import React, { useEffect, useMemo, useRef, useState } from 'react';
import { fetchProductsPreview } from '../services/products';
import TickerRibbons from '../components/TickerRibbons';
import { useCompliance } from '../context/ComplianceContext';

// Forest Image Slider Component
function ForestSlider() {
  const [currentImage, setCurrentImage] = useState(0);
  
  const forestImages = [
    { src: new URL('../assets/forests/forests_1.jpg', import.meta.url).toString(), alt: 'Forest conservation 1' },
    { src: new URL('../assets/forests/forests_2.jpg', import.meta.url).toString(), alt: 'Forest conservation 2' },
    { src: new URL('../assets/forests/forests_3.jpg', import.meta.url).toString(), alt: 'Forest conservation 3' },
    { src: new URL('../assets/forests/forests_4.jpg', import.meta.url).toString(), alt: 'Forest conservation 4' },
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImage((prev) => (prev + 1) % forestImages.length);
    }, 6000); // Change image every 3 seconds

    return () => clearInterval(interval);
  }, [forestImages.length]);

  return (
    <div className="max-w-[450px] mx-auto">
      <div className="glass max-w-[300px] max-h-[200px] mx-auto nv-glass--inner-hairline border border-white/10 rounded-2xl overflow-hidden relative">
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
              className={`w-full h-auto max-w-[300px] mx-auto object-cover transition-opacity duration-1000 ${
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
  useEffect(() => {
    fetchProductsPreview(tickerCountry).then((res: Array<{name?:string; symbol?:string; compass_score?:number}>)=>{
      setItems(res);
    }).finally(()=> setLoading(false));
  }, [tickerCountry]);


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

  return (
    <div className="relative max-w-full mx-auto">
    {/* <div className="relative max-w-[1450px] mx-auto"> */}
      {/* Full-viewport-width ticker (ignores main padding) */}
      <div className="mt-2 mb-2" style={{ width: '100vw', marginLeft: 'calc(50% - 50vw)' }}>
        <TickerRibbons size={20} mode="five_stars" country={tickerCountry} />
      </div>
      <div className="w-full">
        <div className="w-full px-3 md:px-6 grid grid-cols-1 md:grid-cols-12 gap-4 pt-3 md:pt-2 pb-8 items-stretch md:overflow-hidden md:h-[calc(100dvh-var(--rib-h,84px))]">
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
              <a href="/why-people-use-nirvana" role="button" className="glass trajan-text nv-glass--inner-hairline border border-white/10 rounded-lg px-3 py-2 inline-block text-gray-200 hover:text-white text-center">Why do we exist</a>
              <a href="/what-is-compass-score" role="button" className="glass trajan-text nv-glass--inner-hairline border border-white/10 rounded-lg px-3 py-2 inline-block text-gray-200 hover:text-white text-center">The Compass Score</a>
              <a href="/about" role="button" className="glass trajan-text nv-glass--inner-hairline border border-white/10 rounded-lg px-3 py-2 inline-block text-gray-200 hover:text-white text-center">About us</a>
              <a href="/trust-code-programme" role="button" className="glass trajan-text nv-glass--inner-hairline border border-white/10 rounded-lg px-3 py-2 inline-block text-gray-200 hover:text-white text-center">Trust Code Programme</a>
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
                    ?
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
                    <input type="text" placeholder="Ask Satya..." className="w-full bg-transparent outline-none text-white placeholder:text-gray-400 leading-none" disabled={mobileLocked} />
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
                  <div className="text-gray-300 normal-case tracking-normal mt-1" style={{ color: '#ff7f50' }}>
                    No AI used in search
                  </div>
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
                <a href="/member-eula" role="button" className="glass nv-glass--inner-hairline border border-white/10 rounded-lg px-3 py-2 inline-block text-gray-200 hover:text-white">Member EULA</a>
                <img src={new URL('../assets/NirvanaFireFlyLogo.png', import.meta.url).toString()} alt="Nirvana" className="h-auto mx-auto max-h-40 w-auto object-contain" />
              </div>
            </div>
          </div>

          {/* Center chat column */}
          <div className="hidden md:grid md:grid-rows-[5fr_7fr] gap-3 md:col-span-5 md:h-full md:min-h-0">
            {/* Desktop only buttons - hidden on mobile */}
            <div className="hidden md:flex flex-row row-span-1 flex-wrap gap-8 w-full justify-center content-center">
              <a href="/why-people-use-nirvana" role="button" className="glass text-lg trajan-text nv-glass--inner-hairline border border-white/10 rounded-lg px-4 py-2 inline-block whitespace-nowrap h-auto self-start text-white hover:text-gray-200 text-center">Why do we exist</a>
              <a href="/what-is-compass-score" role="button" className="glass text-lg trajan-text nv-glass--inner-hairline border border-white/10 rounded-lg px-4 py-2 inline-block whitespace-nowrap h-auto self-start text-white hover:text-gray-200 text-center">The Compass Score</a>
              <a href="/about" role="button" className="glass text-lg trajan-text nv-glass--inner-hairline border border-white/10 rounded-lg px-4 py-2 inline-block whitespace-nowrap h-auto self-start text-white hover:text-gray-200 text-center">About us</a>
              <a href="/trust-code-programme" role="button" className="glass text-lg trajan-text nv-glass--inner-hairline border border-white/10 rounded-lg px-4 py-2 inline-block whitespace-nowrap h-auto self-start text-white hover:text-gray-200 text-center">Trust Code Programme</a>
            </div>
            <div className="glass mt-12 md:mt-0 
                            bg-black/10 md:row-span-1 w-full 
                            md:h-full md:min-h-0 justify-start 
                            nv-glass--inner-hairline early-form 
                            px-4 py-6 border border-white/10 
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
                    ?
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
                    ans.textContent = 'Enter a product name or symbol, or specify a loss limit (e.g., −20%)';
                    // ans.textContent = 'Thank you for your message, Nirvana will be live soon';
                    ansRow.appendChild(ans);
                    chatRef.current?.appendChild(ansRow);
                    chatRef.current?.scrollTo({ top: chatRef.current.scrollHeight });
                  }, 2500);
                }}>
                  <div className="px-5 py-4 flex-1">
                    <input type="text" placeholder="Ask Satya..." className="w-full bg-transparent outline-none text-white placeholder:text-gray-400 leading-none" disabled={locked} />
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
                  <div className="text-gray-300 normal-case tracking-normal mt-1" style={{ color: '#ff7f50' }}>
                    No AI used in search
                  </div>
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

        {/* Mobile-only bottom bar: logo left, About/EULA right */}
        <div className="md:hidden px-3 pb-5">
          <div className="grid grid-cols-2 gap-4 items-center">
            <div className="flex items-center justify-center">
              <img src={new URL('../assets/NirvanaFireFlyLogo.png', import.meta.url).toString()} alt="Nirvana" className="h-auto max-h-24 w-auto object-contain" />
            </div>
            <div className="flex flex-col gap-3">
              {/* <a href="/about" className="glass nv-glass--inner-hairline border border-white/10 rounded-lg px-3 py-2 inline-block text-gray-200 hover:text-white text-center">About us</a> */}
              <a href="/member-eula" role="button" className="glass nv-glass--inner-hairline border border-white/10 rounded-lg px-3 py-2 inline-block text-gray-200 hover:text-white text-center">Member EULA</a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}


