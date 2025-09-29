import { useLayoutEffect, useRef, useState } from 'react';

export default function AboutPage() {
  const textRef = useRef<HTMLDivElement | null>(null);
  const leftColRef = useRef<HTMLDivElement | null>(null);
  const [splitIndex, setSplitIndex] = useState<number>(0);

  // Image definitions with aspect ratio to estimate heights accurately
  const images: { src: string; aspect: string }[] = [
    { src: new URL('../assets/arman/arman.jpg', import.meta.url).toString(), aspect: '3 / 4' },
    { src: new URL('../assets/arman/arman_2.jpg', import.meta.url).toString(), aspect: '3 / 4' },
    { src: new URL('../assets/arman/arman_3.jpg', import.meta.url).toString(), aspect: '4 / 3' },
    { src: new URL('../assets/arman/arman_4.jpg', import.meta.url).toString(), aspect: '4 / 3' },
    { src: new URL('../assets/arman/arman_5.jpeg', import.meta.url).toString(), aspect: '4 / 3' },
    { src: new URL('../assets/arman/arman_6.jpeg', import.meta.url).toString(), aspect: '3 / 4' },
    { src: new URL('../assets/arman/arman_7.jpeg', import.meta.url).toString(), aspect: '4 / 3' },
    { src: new URL('../assets/arman/arman_8.jpeg', import.meta.url).toString(), aspect: '3 / 4' },
    { src: new URL('../assets/arman/arman_9.jpeg', import.meta.url).toString(), aspect: '3 / 4' },
    { src: new URL('../assets/arman/arman_10.jpeg', import.meta.url).toString(), aspect: '3 / 4' },
    { src: new URL('../assets/arman/arman_11.jpeg', import.meta.url).toString(), aspect: '4 / 3' },
    { src: new URL('../assets/arman/arman_12.jpeg', import.meta.url).toString(), aspect: '4 / 3' },
    { src: new URL('../assets/arman/arman_13.jpeg', import.meta.url).toString(), aspect: '3 / 4' },
    { src: new URL('../assets/arman/arman_14.jpeg', import.meta.url).toString(), aspect: '4 / 3' },
    { src: new URL('../assets/arman/arman_15.jpeg', import.meta.url).toString(), aspect: '4 / 3' },
    { src: new URL('../assets/arman/arman_16.jpg', import.meta.url).toString(), aspect: '3 / 4' },
    { src: new URL('../assets/arman/arman_17.jpg', import.meta.url).toString(), aspect: '3 / 4' },
    { src: new URL('../assets/arman/arman_18.jpeg', import.meta.url).toString(), aspect: '4 / 3' },
    { src: new URL('../assets/arman/arman_19.jpeg', import.meta.url).toString(), aspect: '3 / 4' },
    { src: new URL('../assets/arman/arman_20.jpeg', import.meta.url).toString(), aspect: '3 / 4' },
    { src: new URL('../assets/arman/arman_21.jpeg', import.meta.url).toString(), aspect: '3 / 4' },
    { src: new URL('../assets/arman/arman_22.jpeg', import.meta.url).toString(), aspect: '4 / 3' },
    { src: new URL('../assets/arman/arman_23.jpeg', import.meta.url).toString(), aspect: '3 / 4' },
    { src: new URL('../assets/arman/arman_24.jpeg', import.meta.url).toString(), aspect: '4 / 3' },
    
    { src: new URL('../assets/arman/arman_25.jpeg', import.meta.url).toString(), aspect: '4 / 3' },
    { src: new URL('../assets/arman/arman_26.jpeg', import.meta.url).toString(), aspect: '4 / 3' },
    { src: new URL('../assets/arman/arman_27.jpeg', import.meta.url).toString(), aspect: '3 / 4' },
    { src: new URL('../assets/arman/arman_28.jpeg', import.meta.url).toString(), aspect: '4 / 3' },
    { src: new URL('../assets/arman/arman_29.jpeg', import.meta.url).toString(), aspect: '3 / 4' },
    { src: new URL('../assets/arman/arman_30.jpeg', import.meta.url).toString(), aspect: '3 / 4' },
    { src: new URL('../assets/arman/arman_31.jpeg', import.meta.url).toString(), aspect: '3 / 4' },
    { src: new URL('../assets/arman/arman_32.jpeg', import.meta.url).toString(), aspect: '4 / 3' },
    { src: new URL('../assets/arman/arman_33.jpeg', import.meta.url).toString(), aspect: '3 / 4' },
    { src: new URL('../assets/arman/arman_34.jpeg', import.meta.url).toString(), aspect: '3 / 4' },
    { src: new URL('../assets/arman/arman_35.jpeg', import.meta.url).toString(), aspect: '3 / 4' },
  ];

  useLayoutEffect(() => {
    const recompute = () => {
      const textHeight = textRef.current?.getBoundingClientRect().height ?? 0;
      const leftWidth = leftColRef.current?.clientWidth ?? 0;

      // On small screens there is no sidebar; push all images below the text
      if (leftWidth === 0 || textHeight === 0) {
        setSplitIndex(0);
        return;
      }

      const verticalGapPx = 16; // mt-4 between cards (~1rem)
      let consumed = 0;
      let count = 0;
      for (let i = 0; i < images.length; i++) {
        const [w, h] = images[i].aspect.split(' / ').map(Number);
        const estimatedHeight = (leftWidth * h) / w;
        if (i > 0) consumed += verticalGapPx;
        if (consumed + estimatedHeight <= textHeight) {
          consumed += estimatedHeight;
          count = i + 1;
        } else {
          break;
        }
      }
      setSplitIndex(count);
    };

    recompute();
    const ro = new ResizeObserver(recompute);
    if (textRef.current) ro.observe(textRef.current);
    if (leftColRef.current) ro.observe(leftColRef.current);
    window.addEventListener('resize', recompute);
    return () => {
      ro.disconnect();
      window.removeEventListener('resize', recompute);
    };
  }, []);

  return (
    <main className="max-w-5xl mx-auto px-4 py-8 md:py-12">
      <div className="glass nv-glass--inner-hairline border border-white/10 rounded-2xl p-6 md:p-10">
        <header className="mb-8">
          <h1 className="trajan-text text-3xl md:text-4xl text-white">About</h1>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-start">
          <div className="md:col-span-1 order-1 md:order-none" ref={leftColRef}>
            <div key={images[0].src} className='hidden md:block mb-4 relative rounded-xl overflow-hidden border border-white/10 nv-glass--inner-hairline bg-black/20' style={{ aspectRatio: images[0].aspect }}>
              <img src={images[0].src} alt="Arman Valaquenta" className="absolute inset-0 w-full h-full object-cover object-center" />
            </div>
            {images.slice(1, 8).map((img, idx) => (
              <div key={img.src} className={idx === 0 ? 'relative rounded-xl overflow-hidden border border-white/10 nv-glass--inner-hairline bg-black/20' : 'relative rounded-xl overflow-hidden border border-white/10 nv-glass--inner-hairline bg-black/20 mt-4'} style={{ aspectRatio: img.aspect }}>
                <img src={img.src} alt="Arman Valaquenta" className="absolute inset-0 w-full h-full object-cover object-center" />
              </div>
            ))}
            <div className='md:hidden'>
              <div key={images[8].src} className="relative rounded-xl overflow-hidden border border-white/10 nv-glass--inner-hairline bg-black/20 mt-4" style={{ aspectRatio: images[8].aspect }}>
                <img src={images[8].src} alt="Arman Valaquenta" className="absolute inset-0 w-full h-full object-cover object-center" />
              </div>
              <div key={images[9].src} className="relative rounded-xl overflow-hidden border border-white/10 nv-glass--inner-hairline bg-black/20 mt-4" style={{ aspectRatio: images[9].aspect }}>
                <img src={images[9].src} alt="Arman Valaquenta" className="absolute inset-0 w-full h-full object-cover object-center" />
              </div>
              <div key={images[10].src} className="relative rounded-xl overflow-hidden border border-white/10 nv-glass--inner-hairline bg-black/20 mt-4" style={{ aspectRatio: images[10].aspect }}>
                <img src={images[10].src} alt="Arman Valaquenta" className="absolute inset-0 w-full h-full object-cover object-center" />
              </div>
              <div key={images[11].src} className="relative rounded-xl overflow-hidden border border-white/10 nv-glass--inner-hairline bg-black/20 mt-4" style={{ aspectRatio: images[11].aspect }}>
                <img src={images[11].src} alt="Arman Valaquenta" className="absolute inset-0 w-full h-full object-cover object-center" />
              </div>

              <div key={images[12].src} className="relative rounded-xl overflow-hidden border border-white/10 nv-glass--inner-hairline bg-black/20 mt-4" style={{ aspectRatio: images[12].aspect }}>
                <img src={images[12].src} alt="Arman Valaquenta" className="absolute inset-0 w-full h-full object-cover object-center" />
              </div>
              <div key={images[16].src} className="relative rounded-xl overflow-hidden border border-white/10 nv-glass--inner-hairline bg-black/20 mt-4" style={{ aspectRatio: images[16].aspect }}>
                <img src={images[16].src} alt="Arman Valaquenta" className="absolute inset-0 w-full h-full object-cover object-center" />
              </div>

              <div key={images[14].src} className="relative rounded-xl overflow-hidden border border-white/10 nv-glass--inner-hairline bg-black/20 mt-4" style={{ aspectRatio: images[14].aspect }}>
                <img src={images[14].src} alt="Arman Valaquenta" className="absolute inset-0 w-full h-full object-cover object-center" />
              </div>
              <div key={images[13].src} className="relative rounded-xl overflow-hidden border border-white/10 nv-glass--inner-hairline bg-black/20 mt-4" style={{ aspectRatio: images[13].aspect }}>
                <img src={images[13].src} alt="Arman Valaquenta" className="absolute inset-0 w-full h-full object-cover object-center" />
              </div>

              <div key={images[15].src} className="relative rounded-xl overflow-hidden border border-white/10 nv-glass--inner-hairline bg-black/20 mt-4" style={{ aspectRatio: images[15].aspect }}>
                <img src={images[15].src} alt="Arman Valaquenta" className="absolute inset-0 w-full h-full object-cover object-center" />
              </div>
              <div key={images[18].src} className="relative rounded-xl overflow-hidden border border-white/10 nv-glass--inner-hairline bg-black/20 mt-4" style={{ aspectRatio: images[18].aspect }}>
                <img src={images[18].src} alt="Arman Valaquenta" className="absolute inset-0 w-full h-full object-cover object-center" />
              </div>

              <div key={images[19].src} className="relative rounded-xl overflow-hidden border border-white/10 nv-glass--inner-hairline bg-black/20 mt-4" style={{ aspectRatio: images[19].aspect }}>
                <img src={images[19].src} alt="Arman Valaquenta" className="absolute inset-0 w-full h-full object-cover object-center" />
              </div>
              <div key={images[20].src} className="relative rounded-xl overflow-hidden border border-white/10 nv-glass--inner-hairline bg-black/20 mt-4" style={{ aspectRatio: images[20].aspect }}>
                <img src={images[20].src} alt="Arman Valaquenta" className="absolute inset-0 w-full h-full object-cover object-center" />
              </div>
              
              <div key={images[17].src} className="relative rounded-xl overflow-hidden border border-white/10 nv-glass--inner-hairline bg-black/20 mt-4" style={{ aspectRatio: images[17].aspect }}>
                <img src={images[17].src} alt="Arman Valaquenta" className="absolute inset-0 w-full h-full object-cover object-center" />
              </div>
              <div key={images[21].src} className="relative rounded-xl overflow-hidden border border-white/10 nv-glass--inner-hairline bg-black/20 mt-4" style={{ aspectRatio: images[21].aspect }}>
                <img src={images[21].src} alt="Arman Valaquenta" className="absolute inset-0 w-full h-full object-cover object-center" />
              </div>

              <div key={images[22].src} className="relative rounded-xl overflow-hidden border border-white/10 nv-glass--inner-hairline bg-black/20 mt-4" style={{ aspectRatio: images[22].aspect }}>
                <img src={images[22].src} alt="Arman Valaquenta" className="absolute inset-0 w-full h-full object-cover object-center" />
              </div>
              <div key={images[26].src} className="relative rounded-xl overflow-hidden border border-white/10 nv-glass--inner-hairline bg-black/20 mt-4" style={{ aspectRatio: images[26].aspect }}>
                <img src={images[26].src} alt="Arman Valaquenta" className="absolute inset-0 w-full h-full object-cover object-center" />
              </div>

              <div key={images[24].src} className="relative rounded-xl overflow-hidden border border-white/10 nv-glass--inner-hairline bg-black/20 mt-4" style={{ aspectRatio: images[24].aspect }}>
                <img src={images[24].src} alt="Arman Valaquenta" className="absolute inset-0 w-full h-full object-cover object-center" />
              </div>
              <div key={images[25].src} className="relative rounded-xl overflow-hidden border border-white/10 nv-glass--inner-hairline bg-black/20 mt-4" style={{ aspectRatio: images[25].aspect }}>
                <img src={images[25].src} alt="Arman Valaquenta" className="absolute inset-0 w-full h-full object-cover object-center" />
              </div>

              <div key={images[23].src} className="relative rounded-xl overflow-hidden border border-white/10 nv-glass--inner-hairline bg-black/20 mt-4" style={{ aspectRatio: images[23].aspect }}>
                <img src={images[23].src} alt="Arman Valaquenta" className="absolute inset-0 w-full h-full object-cover object-center" />
              </div>
              <div key={images[27].src} className="relative rounded-xl overflow-hidden border border-white/10 nv-glass--inner-hairline bg-black/20 mt-4" style={{ aspectRatio: images[27].aspect }}>
                <img src={images[27].src} alt="Arman Valaquenta" className="absolute inset-0 w-full h-full object-cover object-center" />
              </div>

              <div key={images[28].src} className="relative rounded-xl overflow-hidden border border-white/10 nv-glass--inner-hairline bg-black/20 mt-4" style={{ aspectRatio: images[28].aspect }}>
                <img src={images[28].src} alt="Arman Valaquenta" className="absolute inset-0 w-full h-full object-cover object-center" />
              </div>
              <div key={images[29].src} className="relative rounded-xl overflow-hidden border border-white/10 nv-glass--inner-hairline bg-black/20 mt-4" style={{ aspectRatio: images[29].aspect }}>
                <img src={images[29].src} alt="Arman Valaquenta" className="absolute inset-0 w-full h-full object-cover object-center" />
              </div>

              <div key={images[30].src} className="relative rounded-xl overflow-hidden border border-white/10 nv-glass--inner-hairline bg-black/20 mt-4" style={{ aspectRatio: images[30].aspect }}>
                <img src={images[30].src} alt="Arman Valaquenta" className="absolute inset-0 w-full h-full object-cover object-center" />
              </div>
              <div key={images[32].src} className="relative rounded-xl overflow-hidden border border-white/10 nv-glass--inner-hairline bg-black/20 mt-4" style={{ aspectRatio: images[32].aspect }}>
                <img src={images[32].src} alt="Arman Valaquenta" className="absolute inset-0 w-full h-full object-cover object-center" />
              </div>

              <div key={images[33].src} className="relative rounded-xl overflow-hidden border border-white/10 nv-glass--inner-hairline bg-black/20 mt-4" style={{ aspectRatio: images[33].aspect }}>
                <img src={images[33].src} alt="Arman Valaquenta" className="absolute inset-0 w-full h-full object-cover object-center" />
              </div>
              <div key={images[34].src} className="relative rounded-xl overflow-hidden border border-white/10 nv-glass--inner-hairline bg-black/20 mt-4" style={{ aspectRatio: images[34].aspect }}>
                <img src={images[34].src} alt="Arman Valaquenta" className="absolute inset-0 w-full h-full object-cover object-center" />
              </div>
              
              <div key={images[31].src} className="relative rounded-xl overflow-hidden border border-white/10 nv-glass--inner-hairline bg-black/20 mt-4" style={{ aspectRatio: images[31].aspect }}>
                <img src={images[31].src} alt="Arman Valaquenta" className="absolute inset-0 w-full h-full object-cover object-center" />
              </div>
            </div>
          </div>

          <div className="md:col-span-2 text-gray-200/95 leading-relaxed" ref={textRef}>
            <div className="markdown">
              <p>
                <a href="https://www.linkedin.com/in/armanvalaquenta/" target="_blank" rel="noopener noreferrer">Arman Valaquenta</a>
                {' '}<strong>– Founder, Chairman and Chief Executive Officer</strong>
              </p>

              <p><strong>A proven architect of market-changing infrastructure</strong></p>
              <div className="md:hidden mb-4">
                <div key={images[0].src} className="relative rounded-xl overflow-hidden border border-white/10 nv-glass--inner-hairline bg-black/20" style={{ aspectRatio: images[0].aspect }}>
                  <img src={images[0].src} alt="Arman Valaquenta" className="absolute inset-0 w-full h-full object-cover object-center" />
                </div>
              </div>
              <p>Arman Valaquenta is a mathematician, artist, ice and mountain climber, with a career that spans 35 years at the intersection of finance, theoretical computer science, mathematics, art and exploration of the natural world and humanity.</p>
              <p>His objective is to save forests and animal habitats and improve the human condition through examining commonly held assumptions and seeing if we can do better by each other, and the home planet.</p>
              <div className="flex flex-row flex-wrap gap-4 mb-4">
                <a href="https://www.youtube.com/@essea-art?si=T715FSmZZ8pnqQi2" role="button" target="_blank" rel="noopener noreferrer" className="glass text-md trajan-text nv-glass--inner-hairline border border-white/10 rounded-lg px-3 py-2 inline-block !text-white !hover:text-gray-200 text-center !no-underline">Arman's Youtube channel</a>
                <a href="https://www.essea.art" role="button" target="_blank" rel="noopener noreferrer" className="glass text-md trajan-text nv-glass--inner-hairline border border-white/10 rounded-lg px-3 py-2 inline-block !text-white !hover:text-gray-200 text-center !no-underline">Arman's Photographic arts</a>
                <a href="https://www.essea.art/audiobook-witness/" role="button" target="_blank" rel="noopener noreferrer" className="glass text-md trajan-text nv-glass--inner-hairline border border-white/10 rounded-lg px-3 py-2 inline-block !text-white !hover:text-gray-200 text-center !no-underline">Audiobook - "Witness"</a>
              </div>
              <p>In sciences and business, he is best known in global capital markets for inventing the client-to-client foreign-exchange trading model that now routes roughly <strong>70 percent of the world’s USD 7.5 trillion</strong> daily FX turnover. Subject to 15 patents, the business method of enabling counterparties to trade FX without direct credit lines was a revolution, marking an early decentralisation milestone that presaged many of the principles later embodied in decentralised finance (DeFi).</p>
              <p>In 2006, the Chinese Central Bank – the People’s Bank of China, recommended his technology to power a global FX exchange to be based in Shanghai, as the patented decentralised limit order books architecture could enable the central bank to selectively curb and cool foreign speculative activity in the national currency. His technology is currently embedded in Deutsche Börse FX franchise.</p>

              <h3><strong>A broader lens: art, systems thinking, and human-centred design</strong></h3>
              <p>Arman is also the first ever <strong>brand ambassador of ALPA Cameras of Switzerland</strong>, recognised for his 8,000-kilometre solo photographic journey across the sub-Arctic forests of Canada. The same obsession with precision optics informs his approach to software architecture: remove distortion, let the subject speak for itself.</p>

              <h3><strong>Why this matters for Nirvana</strong></h3>
              <p>Having already rewritten the rules of inter-bank currency trading, Arman now applies thirty-five years of systems-level innovation to <strong>Nirvana</strong>, a neutral financial network designed to <em>align investment for 2.6 billion people</em>. His track record demonstrates an ability to:</p>
              <ol>
                <li><strong>Identify structural inefficiencies</strong> before incumbents acknowledge them.</li>
                <li><strong>Codify the solution in defensible intellectual property</strong> and hard technology.</li>
                <li><strong>Scale adoption until the solution becomes the industry standard</strong>.</li>
              </ol>
              <p>Nirvana’s vision extends the same “re-thinking business methods” logic from wholesale FX to the entire consumer finance stack. Collaborators therefore gain exposure to a founder who has already proven he can shepherd a radical idea from whiteboard to global market dominance.</p>
              <p>In short, Arman Valaquenta pairs rare technical and artistic depth with a documented capacity to bend market structure itself - precisely the calibre of leadership required to deliver a second financial revolution through Nirvana.</p>
            </div>
            <div className="hidden md:grid mt-6 grid-cols-2 md:grid-cols-2 gap-4 md:gap-6">
                <div key={images[8].src} className="relative rounded-xl overflow-hidden border border-white/10 nv-glass--inner-hairline bg-black/20" style={{ aspectRatio: images[8].aspect }}>
                  <img src={images[8].src} alt="Arman Valaquenta" className="absolute inset-0 w-full h-full object-cover object-center" />
                </div>
                <div key={images[9].src} className="relative rounded-xl overflow-hidden border border-white/10 nv-glass--inner-hairline bg-black/20" style={{ aspectRatio: images[9].aspect }}>
                  <img src={images[9].src} alt="Arman Valaquenta" className="absolute inset-0 w-full h-full object-cover object-center" />
                </div>
                <div key={images[10].src} className="relative rounded-xl overflow-hidden border border-white/10 nv-glass--inner-hairline bg-black/20" style={{ aspectRatio: images[10].aspect }}>
                  <img src={images[10].src} alt="Arman Valaquenta" className="absolute inset-0 w-full h-full object-cover object-center" />
                </div>
                <div key={images[11].src} className="relative rounded-xl overflow-hidden border border-white/10 nv-glass--inner-hairline bg-black/20" style={{ aspectRatio: images[11].aspect }}>
                  <img src={images[11].src} alt="Arman Valaquenta" className="absolute inset-0 w-full h-full object-cover object-center" />
                </div>

                <div key={images[12].src} className="relative rounded-xl overflow-hidden border border-white/10 nv-glass--inner-hairline bg-black/20" style={{ aspectRatio: images[12].aspect }}>
                  <img src={images[12].src} alt="Arman Valaquenta" className="absolute inset-0 w-full h-full object-cover object-center" />
                </div>
                <div key={images[16].src} className="relative rounded-xl overflow-hidden border border-white/10 nv-glass--inner-hairline bg-black/20 mt-4" style={{ aspectRatio: images[16].aspect }}>
                  <img src={images[16].src} alt="Arman Valaquenta" className="absolute inset-0 w-full h-full object-cover object-center" />
                </div>

                <div key={images[14].src} className="relative rounded-xl overflow-hidden border border-white/10 nv-glass--inner-hairline bg-black/20 mt-4" style={{ aspectRatio: images[14].aspect }}>
                  <img src={images[14].src} alt="Arman Valaquenta" className="absolute inset-0 w-full h-full object-cover object-center" />
                </div>
                <div key={images[13].src} className="relative rounded-xl overflow-hidden border border-white/10 nv-glass--inner-hairline bg-black/20" style={{ aspectRatio: images[13].aspect }}>
                  <img src={images[13].src} alt="Arman Valaquenta" className="absolute inset-0 w-full h-full object-cover object-center" />
                </div>

                <div key={images[15].src} className="relative rounded-xl overflow-hidden border border-white/10 nv-glass--inner-hairline bg-black/20 mt-4" style={{ aspectRatio: images[15].aspect }}>
                  <img src={images[15].src} alt="Arman Valaquenta" className="absolute inset-0 w-full h-full object-cover object-center" />
                </div>
                <div key={images[18].src} className="relative rounded-xl overflow-hidden border border-white/10 nv-glass--inner-hairline bg-black/20 mt-4" style={{ aspectRatio: images[18].aspect }}>
                  <img src={images[18].src} alt="Arman Valaquenta" className="absolute inset-0 w-full h-full object-cover object-center" />
                </div>

                <div key={images[19].src} className="relative rounded-xl overflow-hidden border border-white/10 nv-glass--inner-hairline bg-black/20 mt-4" style={{ aspectRatio: images[19].aspect }}>
                  <img src={images[19].src} alt="Arman Valaquenta" className="absolute inset-0 w-full h-full object-cover object-center" />
                </div>
                <div key={images[20].src} className="relative rounded-xl overflow-hidden border border-white/10 nv-glass--inner-hairline bg-black/20 mt-4" style={{ aspectRatio: images[20].aspect }}>
                  <img src={images[20].src} alt="Arman Valaquenta" className="absolute inset-0 w-full h-full object-cover object-center" />
                </div>
                
                <div key={images[17].src} className="relative rounded-xl overflow-hidden border border-white/10 nv-glass--inner-hairline bg-black/20 mt-4" style={{ aspectRatio: images[17].aspect }}>
                  <img src={images[17].src} alt="Arman Valaquenta" className="absolute inset-0 w-full h-full object-cover object-center" />
                </div>
                <div key={images[21].src} className="relative rounded-xl overflow-hidden border border-white/10 nv-glass--inner-hairline bg-black/20 mt-4" style={{ aspectRatio: images[21].aspect }}>
                  <img src={images[21].src} alt="Arman Valaquenta" className="absolute inset-0 w-full h-full object-cover object-center" />
                </div>

                <div key={images[22].src} className="relative rounded-xl overflow-hidden border border-white/10 nv-glass--inner-hairline bg-black/20 mt-4" style={{ aspectRatio: images[22].aspect }}>
                  <img src={images[22].src} alt="Arman Valaquenta" className="absolute inset-0 w-full h-full object-cover object-center" />
                </div>
                <div key={images[26].src} className="relative rounded-xl overflow-hidden border border-white/10 nv-glass--inner-hairline bg-black/20 mt-4" style={{ aspectRatio: images[26].aspect }}>
                  <img src={images[26].src} alt="Arman Valaquenta" className="absolute inset-0 w-full h-full object-cover object-center" />
                </div>

                <div key={images[24].src} className="relative rounded-xl overflow-hidden border border-white/10 nv-glass--inner-hairline bg-black/20 mt-4" style={{ aspectRatio: images[24].aspect }}>
                  <img src={images[24].src} alt="Arman Valaquenta" className="absolute inset-0 w-full h-full object-cover object-center" />
                </div>
                <div key={images[25].src} className="relative rounded-xl overflow-hidden border border-white/10 nv-glass--inner-hairline bg-black/20 mt-4" style={{ aspectRatio: images[25].aspect }}>
                  <img src={images[25].src} alt="Arman Valaquenta" className="absolute inset-0 w-full h-full object-cover object-center" />
                </div>

                <div key={images[23].src} className="relative rounded-xl overflow-hidden border border-white/10 nv-glass--inner-hairline bg-black/20 mt-4" style={{ aspectRatio: images[23].aspect }}>
                  <img src={images[23].src} alt="Arman Valaquenta" className="absolute inset-0 w-full h-full object-cover object-center" />
                </div>
                <div key={images[27].src} className="relative rounded-xl overflow-hidden border border-white/10 nv-glass--inner-hairline bg-black/20 mt-4" style={{ aspectRatio: images[27].aspect }}>
                  <img src={images[27].src} alt="Arman Valaquenta" className="absolute inset-0 w-full h-full object-cover object-center" />
                </div>

                <div key={images[28].src} className="relative rounded-xl overflow-hidden border border-white/10 nv-glass--inner-hairline bg-black/20 mt-4" style={{ aspectRatio: images[28].aspect }}>
                  <img src={images[28].src} alt="Arman Valaquenta" className="absolute inset-0 w-full h-full object-cover object-center" />
                </div>
                <div key={images[29].src} className="relative rounded-xl overflow-hidden border border-white/10 nv-glass--inner-hairline bg-black/20 mt-4" style={{ aspectRatio: images[29].aspect }}>
                  <img src={images[29].src} alt="Arman Valaquenta" className="absolute inset-0 w-full h-full object-cover object-center" />
                </div>

                <div key={images[30].src} className="relative rounded-xl overflow-hidden border border-white/10 nv-glass--inner-hairline bg-black/20 mt-4" style={{ aspectRatio: images[30].aspect }}>
                  <img src={images[30].src} alt="Arman Valaquenta" className="absolute inset-0 w-full h-full object-cover object-center" />
                </div>
                <div key={images[32].src} className="relative rounded-xl overflow-hidden border border-white/10 nv-glass--inner-hairline bg-black/20 mt-4" style={{ aspectRatio: images[32].aspect }}>
                  <img src={images[32].src} alt="Arman Valaquenta" className="absolute inset-0 w-full h-full object-cover object-center" />
                </div>

                <div key={images[33].src} className="relative rounded-xl overflow-hidden border border-white/10 nv-glass--inner-hairline bg-black/20 mt-4" style={{ aspectRatio: images[33].aspect }}>
                  <img src={images[33].src} alt="Arman Valaquenta" className="absolute inset-0 w-full h-full object-cover object-center" />
                </div>
                <div key={images[34].src} className="relative rounded-xl overflow-hidden border border-white/10 nv-glass--inner-hairline bg-black/20 mt-4" style={{ aspectRatio: images[34].aspect }}>
                  <img src={images[34].src} alt="Arman Valaquenta" className="absolute inset-0 w-full h-full object-cover object-center" />
                </div>

                <div key={images[31].src} className="relative rounded-xl overflow-hidden border border-white/10 nv-glass--inner-hairline bg-black/20 mt-4" style={{ aspectRatio: images[31].aspect }}>
                  <img src={images[31].src} alt="Arman Valaquenta" className="absolute inset-0 w-full h-full object-cover object-center" />
                </div>
            </div>
          </div>
        </div>
      </div>

      {/* Moved Nirvana Fellows to dedicated page: /nirvana-fellows */}
    </main>
  );
}


