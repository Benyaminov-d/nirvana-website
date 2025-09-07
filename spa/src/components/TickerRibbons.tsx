import { useEffect, useMemo, useRef, useState } from 'react';
import { useCompliance } from '../context/ComplianceContext';
import { fetchTickerData } from '../services/products';

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
  const [titleSuffix, setTitleSuffix] = useState<string>('');
  const [scrollPos, setScrollPos] = useState(0);
  const [isReady, setIsReady] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, scrollPos: 0 });
  const animationRef = useRef<number | null>(null);

  const outerRef = useRef<HTMLDivElement | null>(null);
  const innerRef = useRef<HTMLDivElement | null>(null);
  const stateRef = useRef<{ width: number; offset: number; paused: boolean; dragging: boolean; startX: number; startOffset: number }>({ width: 1, offset: 0, paused: false, dragging: false, startX: 0, startOffset: 0 });
  const SEQ = 3;

  // Static placeholder data for website
  const placeholderFeed: FeedItem[] = [
    { symbol: 'AAPL', cvar95: 0.15, cvar99: 0.22, as_of: '06 Sep 2025' },
    { symbol: 'GOOGL', cvar95: 0.18, cvar99: 0.25, as_of: '06 Sep 2025' },
    { symbol: 'MSFT', cvar95: 0.14, cvar99: 0.21, as_of: '06 Sep 2025' },
    { symbol: 'TSLA', cvar95: 0.25, cvar99: 0.35, as_of: '06 Sep 2025' },
    { symbol: 'AMZN', cvar95: 0.19, cvar99: 0.27, as_of: '06 Sep 2025' },
  ];

  useEffect(() => {
    const loadTickerData = async () => {
      try {
        setIsReady(false);
        const response = await fetch(`/api/ticker/feed?country=${country}&mode=${mode}&limit=20`);
        const data = await response.json();
        
        if (data.success) {
          setFeed(data.items || []);
          setAsOf(data.items && data.items.length > 0 ? data.items[0].as_of || '06 Sep 2025' : '06 Sep 2025');
          setTitleSuffix(data.title_suffix || '');
          
          // Show message if no data
          if (!data.items || data.items.length === 0) {
            console.warn('No ticker data available:', data.message || 'No items returned');
          }
        } else {
          throw new Error('Invalid response from ticker API');
        }
        setIsReady(true);
      } catch (error) {
        console.error('Failed to load ticker data:', error);
        // Fallback to placeholder data
        setFeed(placeholderFeed);
        setAsOf('06 Sep 2025');
        setTitleSuffix('');
        setIsReady(true);
      }
    };
    
    loadTickerData();
  }, [mode, country]);

  // Update CSS custom property --rib-h when component height changes
  useEffect(() => {
    const updateHeight = () => {
      if (outerRef.current) {
        const height = outerRef.current.offsetHeight;
        document.documentElement.style.setProperty('--rib-h', `${height}px`);
      }
    };

    // Initial measurement
    updateHeight();

    // Use ResizeObserver for accurate height tracking
    let resizeObserver: ResizeObserver | null = null;
    if (outerRef.current && window.ResizeObserver) {
      resizeObserver = new ResizeObserver(updateHeight);
      resizeObserver.observe(outerRef.current);
    }

    return () => {
      if (resizeObserver) {
        resizeObserver.disconnect();
      }
    };
  }, [isReady]); // Re-run when component is ready

  const keyField = mode === 'cvar99' ? 'cvar99' : 'cvar95';
  
  // Country-specific title text
  const getCountrySpecificTitle = () => {
    if (mode !== 'five_stars') {
      return mode === 'cvar99' ? 'CVaR 99%' : 'CVaR 95%';
    }
    
    // Use API-provided title suffix if available
    if (titleSuffix) {
      return `EXPECTED LOSS: ${titleSuffix}`;
    }
    
    // Fallback to hardcoded titles
    switch (country) {
      case 'US':
        return 'EXPECTED LOSS: MORNINGSTAR GOLD MEDALIST + 5-STAR RATED US MUTUAL FUNDS (99-CVAR, ANNUALISED)';
      case 'UK':
        return 'EXPECTED LOSS: MORNINGSTAR GOLD MEDALIST + 5-STAR RATED UK and US ETF and MUTUAL FUNDS (99-CVAR, ANNUALISED) Aug 22, 2025';
      default:
        return 'EXPECTED LOSS: MORNINGSTAR GOLD MEDALIST + 5-STAR RATED UK and US ETF and MUTUAL FUNDS (99-CVAR, ANNUALISED) Aug 22, 2025';
    }
  };
  
  const title = getCountrySpecificTitle();

  const fontPx = getTickerFontSizePx(size);

  useEffect(() => {
    if (!isReady || !innerRef.current || !outerRef.current) return;

    const inner = innerRef.current;
    const outer = outerRef.current;

    const speed = 30; // pixels per second

    const animate = () => {
      // Don't animate if dragging or hovering
      if (isDragging || isHovered) {
        animationRef.current = requestAnimationFrame(animate);
        return;
      }

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

      animationRef.current = requestAnimationFrame(animate);
    };

    // Start animation immediately
    animationRef.current = requestAnimationFrame(animate);

    return () => {
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
    };
  }, [isReady, feed.length, isDragging, isHovered]);

  useEffect(() => {
    if (innerRef.current) {
      innerRef.current.style.transform = `translateX(${-scrollPos}px)`;
    }
  }, [scrollPos]);

  // Drag handlers
  const handleMouseDown = (e: React.MouseEvent) => {
    if (!outerRef.current) return;
    
    setIsDragging(true);
    setDragStart({
      x: e.clientX,
      scrollPos: scrollPos
    });
    
    e.preventDefault();
  };

  const handleMouseMove = (e: MouseEvent) => {
    if (!isDragging || !outerRef.current) return;
    
    const deltaX = e.clientX - dragStart.x;
    const newScrollPos = dragStart.scrollPos - deltaX;
    
    const innerWidth = innerRef.current?.scrollWidth || 0;
    const outerWidth = outerRef.current.clientWidth;
    const maxScroll = innerWidth - outerWidth;
    
    // Clamp scroll position
    const clampedPos = Math.max(-outerWidth, Math.min(maxScroll, newScrollPos));
    setScrollPos(clampedPos);
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
  };

  // Add global mouse event listeners for drag
  useEffect(() => {
    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      
      return () => {
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
      };
    }
  }, [isDragging, dragStart]);

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
      <div 
        className="relative overflow-hidden select-none" 
        style={{ cursor: isDragging ? 'grabbing' : 'grab' }}
        onMouseDown={handleMouseDown}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        <div ref={innerRef} className="whitespace-nowrap will-change-transform">
          {seq}
        </div>
      </div>
    </div>
  );
}