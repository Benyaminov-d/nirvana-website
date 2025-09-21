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
    { src: new URL('../assets/arman/arman_15.jpg', import.meta.url).toString(), aspect: '4 / 3' },
    { src: new URL('../assets/arman/arman_16.jpg', import.meta.url).toString(), aspect: '3 / 4' },
    { src: new URL('../assets/arman/arman_17.jpg', import.meta.url).toString(), aspect: '3 / 4' },
    { src: new URL('../assets/arman/arman_18.jpeg', import.meta.url).toString(), aspect: '4 / 3' },
    { src: new URL('../assets/arman/arman_19.jpeg', import.meta.url).toString(), aspect: '3 / 4' },
    { src: new URL('../assets/arman/arman_20.jpeg', import.meta.url).toString(), aspect: '3 / 4' },
    { src: new URL('../assets/arman/arman_21.jpeg', import.meta.url).toString(), aspect: '3 / 4' },
    { src: new URL('../assets/arman/arman_22.jpeg', import.meta.url).toString(), aspect: '4 / 3' },
    { src: new URL('../assets/arman/arman_23.jpeg', import.meta.url).toString(), aspect: '3 / 4' },
    { src: new URL('../assets/arman/arman_24.jpeg', import.meta.url).toString(), aspect: '4 / 3' },
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
            {images.slice(0, 8).map((img, idx) => (
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
              <div key={images[23].src} className="relative rounded-xl overflow-hidden border border-white/10 nv-glass--inner-hairline bg-black/20 mt-4" style={{ aspectRatio: images[23].aspect }}>
                <img src={images[23].src} alt="Arman Valaquenta" className="absolute inset-0 w-full h-full object-cover object-center" />
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
              <p>Arman Valaquenta is a mathematician, artist, ice and mountain climber, with a career that spans 35 years at the intersection of finance, theoretical computer science, mathematics, art and exploration of the natural world and humanity.</p>
              <p>His objective is to save forests and animal habitats and improve the human condition through examining commonly held assumptions and seeing if we can do better by each other, and the home planet.</p>
              <p>
                <a href="https://www.youtube.com/@essea-art?si=T715FSmZZ8pnqQi2" target="_blank" rel="noopener noreferrer">YouTube channel</a>
                {' '}·{' '}
                <a href="https://www.essea.art" target="_blank" rel="noopener noreferrer">essea.art</a>
              </p>
              <p>In sciences and business, he is best known in global capital markets for inventing the client-to-client foreign-exchange trading model that now routes roughly <strong>70 percent of the world’s USD 7.5 trillion</strong> daily FX turnover. Subject to 15 patents, the business method of enabling counterparties to trade FX without direct credit lines was a revolution, marking an early decentralisation milestone that presaged many of the principles later embodied in decentralised finance (DeFi).</p>
              <p>In 2006, the Chinese Central Bank – the People’s Bank of China, recommended his technology to power a global FX exchange to be based in Shanghai, as the patented decentralised limit order books architecture could enable the central bank to selectively curb and cool foreign speculative activity in the national currency. His technology is currently embedded in Deutsche Börse FX franchise.</p>

              <h3><strong>A broader lens: art, systems thinking, and human-centred design</strong></h3>
              <p>Arman is also the first ever <strong>brand ambassador of ALPA Cameras of Switzerland</strong>, recognised for his 8,000-kilometre solo photographic journey across the sub-Arctic forests of Canada. The same obsession with precision optics informs his approach to software architecture: remove distortion, let the subject speak for itself.</p>
              <p>His art is at <a href="http://www.essea.art" target="_blank" rel="noopener noreferrer">www.essea.art</a> and his YouTube channel is: <a href="https://www.youtube.com/@essea-art" target="_blank" rel="noopener noreferrer">https://www.youtube.com/@essea-art</a></p>

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
                <div key={images[23].src} className="relative rounded-xl overflow-hidden border border-white/10 nv-glass--inner-hairline bg-black/20 mt-4" style={{ aspectRatio: images[23].aspect }}>
                  <img src={images[23].src} alt="Arman Valaquenta" className="absolute inset-0 w-full h-full object-cover object-center" />
                </div>
            </div>
          </div>
        </div>
      </div>

      {/* Nirvana Fellows */}
      <div className="glass nv-glass--inner-hairline border border-white/10 rounded-2xl p-6 md:p-10 mt-6 md:mt-8">
        <header className="mb-6">
          <h2 className="trajan-text text-2xl md:text-3xl text-white">Nirvana Fellows</h2>
        </header>
        <div className="markdown text-gray-200/95">
          <p>
            A <strong>Nirvana Fellow</strong> is a distinguished consultant formally appointed by Nirvana under a bespoke Nirvana Fellow Agreement. Each Fellow is a globally recognised authority in a domain that advances Nirvana’s mission. Fellows contribute strategic insight, independent thought leadership, and access to influential networks, thereby reinforcing the scientific, ethical, and entrepreneurial rigour that underpins the Nirvana Network.
          </p>

          <h3><strong>Professor Hersh M. Shefrin</strong>, Nirvana Fellow – Behavioural Finance</h3>
          <p>
            Professor Hersh Shefrin, PhD, is globally acknowledged as one of the founding architects of behavioural finance. He holds the Mario L. Belotti Chair in Finance at Santa Clara University’s Leavey School of Business, where he has taught and conducted research for more than four decades
            {' '}(<a href="https://www.scu.edu/business/finance/faculty/shefrin/" target="_blank" rel="noopener noreferrer">Santa Clara University</a>).
          </p>
          <p>Over the course of his career, Professor Shefrin has:</p>
          <ul>
            <li><strong>Pioneered behavioural-finance theory and practice.</strong> His seminal works, including <em>Beyond Greed and Fear</em> (Wiley, 2000) and <em>Behavioral Risk Management</em> (Palgrave, 2016), are standard references for both academics and practitioners. <em>CFO</em> magazine named him among the “academic stars of finance,” and a landmark 2003 <em>American Economic Review</em> study ranked him in the top fifteen theorists most influential on empirical research (<a href="https://www.amazon.com/stores/author/B001HCZZLE" target="_blank" rel="noopener noreferrer">Amazon</a>).</li>
            <li><strong>Bridged academia and industry.</strong> He advises leading asset managers, risk officers, and policy makers, delivering keynotes and workshops to financial institutions worldwide. His insights guide portfolio-construction processes, risk-governance frameworks, and investor-education programmes (<a href="https://www.forbes.com/sites/hershshefrin/" target="_blank" rel="noopener noreferrer">Forbes</a>).</li>
            <li><strong>Advanced public understanding of investor psychology.</strong> Professor Shefrin’s columns appear in outlets such as <em>Forbes</em>, where he analyses market behaviour through a behavioural lens, translating complex theory into practical counsel for capital-market participants (<a href="https://www.forbes.com/sites/hershshefrin/" target="_blank" rel="noopener noreferrer">Forbes</a>).</li>
          </ul>

          <h4><strong>Strategic contribution to Nirvana</strong></h4>
          <p>As a <strong>Nirvana Fellow</strong>, Professor Shefrin strengthens the Network’s scientific and ethical foundations in three critical ways:</p>
          <ol>
            <li><strong>Behavioural-bias mitigation.</strong> His research informs Satya’s conversational protocols, ensuring that recommendations systematically neutralise cognitive traps—loss aversion, framing effects, present bias—that impede rational, long-term decision-making.</li>
            <li><strong>Refined suitability metrics.</strong> By embedding behavioural-risk considerations into the Nirvana Standard and Compass Score, he enhances their ability to reflect true Member tolerance for downside volatility, strengthening fiduciary alignment.</li>
            <li><strong>Credibility and outreach.</strong> Professor Shefrin’s reputation and extensive professional network open doors to academic collaborators, pension trustees, and regulatory audiences, accelerating Nirvana’s adoption as the transparent, member-centric operating system for finance.</li>
          </ol>

          <h3><strong>Professor Daniel P. Palomar</strong>, Nirvana Fellow – Algorithmic Optimisation</h3>
          <p>
            Daniel P. Palomar is a Professor in the <a href="https://ece.hkust.edu.hk/" target="_blank" rel="noopener noreferrer">Department of Electronic and Computer Engineering</a> and <a href="https://ieda.ust.hk/" target="_blank" rel="noopener noreferrer">Department of Industrial Engineering & Decision Analytics</a> at the <a href="https://hkust.edu.hk/" target="_blank" rel="noopener noreferrer">Hong Kong University of Science and Technology (HKUST)</a>, which he joined in 2006. He received the Electrical Engineering degree and the Ph.D. degree from the Technical University of Catalonia (UPC), Barcelona, Spain, in 1998 and 2003, respectively, and was a Fulbright Scholar at Princeton University during 2004-2006.
          </p>
          <p>
            He has held several visiting research appointments, namely, at King’s College London (KCL), London, UK; Technical University of Catalonia (UPC), Barcelona; Stanford University, Stanford, CA; Telecommunications Technological Center of Catalonia (CTTC), Barcelona; Royal Institute of Technology (KTH), Stockholm, Sweden; University of Rome “La Sapienza”, Rome, Italy; and Princeton University, Princeton, NJ.
          </p>
          <p>
            Prof. Palomar is a EURASIP Fellow (2024), an IEEE Fellow (2012), and, among others, has been awarded with the 2004/06 Fulbright Research Fellowship and the 2004, 2015, and 2020 Young Author Best Paper Awards by the IEEE Signal Processing Society.
          </p>
          <p>
            Prof. Palomar is a prolific author with over one hundred research articles, and several influential monographs and books to his credit, including "A Signal Processing Perspective on Financial Engineering" (2016), "Optimization Methods for Financial Index Tracking: From Theory to Practice" (2018), and "Portfolio Optimization: From Theory to Practice" (2025).
          </p>
          <p>
            His extensive editorial contributions to the field include serving as Associate Editor of IEEE Transactions on Information Theory and IEEE Transactions on Signal Processing. He has also served as Guest Editor for several prestigious publications: the IEEE Journal of Selected Topics in Signal Processing 2016 Special Issue on "Financial Signal Processing and Machine Learning for Electronic Trading," the IEEE Signal Processing Magazine 2010 Special Issue on "Convex Optimization for Signal Processing," the IEEE Journal on Selected Areas in Communications 2008 Special Issue on "Game Theory in Communication Systems," and as Lead Guest Editor of the IEEE Journal on Selected Areas in Communications 2007 Special Issue on "Optimization of MIMO Transceivers for Realistic Communication Networks".
          </p>
        </div>
      </div>
    </main>
  );
}


