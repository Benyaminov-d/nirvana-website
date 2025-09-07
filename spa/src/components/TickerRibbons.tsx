import { useEffect, useMemo, useRef, useState } from 'react';
import { useCompliance } from '../context/ComplianceContext';

type FeedItem = { symbol: string; as_of?: string; cvar95?: number; cvar99?: number };

function fmtLoss(v?: number) {
  if (v == null || !Number.isFinite(v)) return '-';
  return `-${Math.abs(v * 100).toFixed(2)}%`;
}

function getTickerFontSizePx(override?: string | number): number {
  if (override != null) {
    const n = typeof override === 'number' ? override : parseInt(String(override), 10);
    if (Number.isFinite(n) && n >= 9 && n <= 64) return n;
    const s = String(override);
    const kw = keywordToPx(s);
    if (kw) return kw;
  }
  // Default: 14px
  return 14;
}

function keywordToPx(kw: string): number | null {
  const lc = kw.toLowerCase().trim();
  switch (lc) {
    case 'xs': case 'small': return 12;
    case 'sm': return 14;
    case 'md': case 'normal': return 16;
    case 'lg': return 18;
    case 'xl': case 'large': return 20;
    case '2xl': case 'huge': return 24;
    default: return null;
  }
}

type TickerRibbonsProps = {
  size?: number | string;
  mode?: 'cvar95' | 'cvar99' | 'five_stars';
  country?: string;
};

export default function TickerRibbons({ size = 14, mode = 'cvar95', country = 'US' }: TickerRibbonsProps) {
  const { state } = useCompliance();
  const [feed, setFeed] = useState<FeedItem[]>([]);
  const [asOf, setAsOf] = useState<string>('');
  const innerRef = useRef<HTMLDivElement>(null);
  const outerRef = useRef<HTMLDivElement>(null);
  const [scrollPos, setScrollPos] = useState(0);
  const [isReady, setIsReady] = useState(false);

  // Static placeholder data for website
  const placeholderFeed: FeedItem[] = [
    { symbol: 'AAPL', cvar95: 0.15, cvar99: 0.22, as_of: '06 Sep 2025' },
    { symbol: 'GOOGL', cvar95: 0.18, cvar99: 0.25, as_of: '06 Sep 2025' },
    { symbol: 'MSFT', cvar95: 0.14, cvar99: 0.21, as_of: '06 Sep 2025' },
    { symbol: 'TSLA', cvar95: 0.25, cvar99: 0.35, as_of: '06 Sep 2025' },
    { symbol: 'AMZN', cvar95: 0.19, cvar99: 0.27, as_of: '06 Sep 2025' },
  ];

  useEffect(() => {
    // Use static data for website
    setFeed(placeholderFeed);
    setAsOf('06 Sep 2025');
    setIsReady(true);
  }, [mode, country]);

  const keyField = mode === 'cvar99' ? 'cvar99' : 'cvar95';
  const title = mode === 'five_stars' ? 'Top Performers' : (mode === 'cvar99' ? 'CVaR 99%' : 'CVaR 95%');

  const fontPx = getTickerFontSizePx(size);

  useEffect(() => {
    if (!isReady || !innerRef.current || !outerRef.current) return;

    const inner = innerRef.current;
    const outer = outerRef.current;

    let animationId: number;
    const speed = 30; // pixels per second

    const animate = () => {
      const innerWidth = inner.scrollWidth;
      const outerWidth = outer.clientWidth;

      if (innerWidth <= outerWidth) {
        setScrollPos(0);
        return;
      }

      setScrollPos(prev => {
        const maxScroll = innerWidth - outerWidth;
        const newPos = prev + speed / 60; // 60fps
        return newPos > maxScroll ? -outerWidth : newPos;
      });

      animationId = requestAnimationFrame(animate);
    };

    const timer = setTimeout(() => {
      animationId = requestAnimationFrame(animate);
    }, 1000);

    return () => {
      clearTimeout(timer);
      if (animationId) cancelAnimationFrame(animationId);
    };
  }, [isReady, feed.length]);

  useEffect(() => {
    if (innerRef.current) {
      innerRef.current.style.transform = `translateX(${-scrollPos}px)`;
    }
  }, [scrollPos]);

  if (!isReady || feed.length === 0) {
    return (
      <div className="glass nv-glass--inner-hairline text-white border border-white/10 p-1 rounded-none w-full">
        <div className="flex items-center gap-2 mb-1">
          <div className="text-[12px] uppercase tracking-wider text-gray-300">{title}</div>
        </div>
        <div className="text-center py-4 text-gray-400">Loading...</div>
      </div>
    );
  }

  const textStyle = { fontSize: `${fontPx}px` };

  // Duplicate feed for seamless loop
  const extendedFeed = [...feed, ...feed, ...feed];

  const seq = extendedFeed.map((it, i) => {
    if (!it.symbol) return null;

    const sizeClass = fontPx >= 24 ? 'text-2xl' : fontPx >= 18 ? 'text-xl' : fontPx >= 16 ? 'text-lg' : 'text-sm';
    return (
      <span key={`${it.symbol}-${i}`} className={`inline-flex items-center gap-2 px-4 py-1 ${sizeClass}`} style={textStyle}>
        <span className="text-white font-medium" style={textStyle}>
          {it.symbol}
        </span>
        <span className="text-[#FF4A3D] font-semibold" style={textStyle}>
          {fmtLoss(it[keyField])}
        </span>
      </span>
    );
  });

  return (
    <div className="glass nv-glass--inner-hairline text-white border border-white/10 p-1 rounded-none w-full" ref={outerRef}>
      <div className="flex items-center gap-2 mb-1">
        <div className="text-[12px] uppercase tracking-wider text-gray-300">{title}</div>
        <div className="hidden md:inline text-[12px] text-gray-400">
          {asOf}
        </div>
      </div>
      <div className="relative overflow-hidden select-none" style={{ cursor: 'grab' }}>
        <div ref={innerRef} className="whitespace-nowrap will-change-transform">
          {seq}
        </div>
      </div>
    </div>
  );
}