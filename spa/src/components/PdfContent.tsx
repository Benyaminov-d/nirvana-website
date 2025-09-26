import React, { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';

type PdfContentProps = {
  src: string;
  className?: string;
  pageGapPx?: number;
  maxPages?: number;
  title?: string;
};

/**
 * Minimal, UI-less PDF renderer using pdf.js via ESM CDN, producing page images stacked as normal content.
 * No toolbar, no page controls – looks like standard flowing content.
 */
export default function PdfContent({ src, className, pageGapPx = 16, maxPages, title }: PdfContentProps) {
  const hostRef = useRef<HTMLDivElement | null>(null);
  const [error, setError] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(true);
  const [pageUrls, setPageUrls] = useState<string[]>([]);
  const [renderKey, setRenderKey] = useState<number>(0);

  // Re-render on container resize to preserve crispness
  useLayoutEffect(() => {
    const host = hostRef.current;
    if (!host) return;
    let raf = 0;
    let lastWidth = host.clientWidth;
    const resizeObserver = new ResizeObserver(() => {
      const w = host.clientWidth;
      if (Math.abs(w - lastWidth) > 10) {
        lastWidth = w;
        cancelAnimationFrame(raf);
        raf = requestAnimationFrame(() => setRenderKey((k) => k + 1));
      }
    });
    resizeObserver.observe(host);
    return () => {
      cancelAnimationFrame(raf);
      resizeObserver.disconnect();
    };
  }, []);

  const CDN_BASE = useMemo(() => 'https://cdn.jsdelivr.net/npm/pdfjs-dist@3.11.174/build', []);

  // Load UMD script once globally
  const loadPdfJs = useCallback(async () => {
    const w = window as any;
    if (w.__nv_pdfjs_loading) return w.__nv_pdfjs_loading;
    if (w.pdfjsLib) return Promise.resolve(w.pdfjsLib);
    w.__nv_pdfjs_loading = new Promise((resolve, reject) => {
      try {
        const script = document.createElement('script');
        script.src = `${CDN_BASE}/pdf.min.js`;
        script.async = true;
        script.onload = () => {
          try {
            const lib = (window as any).pdfjsLib;
            if (!lib) return reject(new Error('pdfjsLib not available'));
            lib.GlobalWorkerOptions.workerSrc = `${CDN_BASE}/pdf.worker.min.js`;
            resolve(lib);
          } catch (e) {
            reject(e);
          }
        };
        script.onerror = () => reject(new Error('Failed to load pdf.js'));
        document.head.appendChild(script);
      } catch (e) {
        reject(e);
      }
    });
    return w.__nv_pdfjs_loading;
  }, [CDN_BASE]);

  const renderPdf = useCallback(async () => {
    const container = hostRef.current;
    if (!container) return;
    setError('');
    setLoading(true);
    setPageUrls((prev) => {
      prev.forEach((u) => URL.revokeObjectURL(u));
      return [];
    });
    try {
      const pdfjs: any = await loadPdfJs();
      const loadingTask = pdfjs.getDocument({ url: src });
      const pdf = await loadingTask.promise;
      const total = maxPages ? Math.min(maxPages, pdf.numPages) : pdf.numPages;

      const cssWidth = container.clientWidth || 800;
      const deviceScale = Math.min(Math.max(window.devicePixelRatio || 1, 1), 2);

      const urls: string[] = [];
      for (let i = 1; i <= total; i++) {
        const page = await pdf.getPage(i);
        const viewport = page.getViewport({ scale: 1 });
        const scale = cssWidth / viewport.width;
        const outputScale = scale * deviceScale;
        const vp = page.getViewport({ scale: outputScale });

        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        if (!ctx) continue;
        canvas.width = Math.max(1, Math.floor(vp.width));
        canvas.height = Math.max(1, Math.floor(vp.height));

        await page.render({ canvasContext: ctx, viewport: vp, intent: 'display' }).promise;

        // Convert to blob URL for React rendering; set CSS width 100% via style
        const blob: Blob = await new Promise((resolve) => canvas.toBlob((b) => resolve(b as Blob), 'image/png'));
        const url = URL.createObjectURL(blob);
        urls.push(url);
      }
      setPageUrls(urls);
    } catch (e: any) {
      setError(String(e?.message || e));
    } finally {
      setLoading(false);
    }
  }, [src, maxPages, loadPdfJs]);

  useLayoutEffect(() => {
    if (!hostRef.current) {
      const id = requestAnimationFrame(() => renderPdf());
      return () => cancelAnimationFrame(id);
    }
    renderPdf();
    // Cleanup object URLs on unmount
    return () => {
      setPageUrls((prev) => {
        prev.forEach((u) => URL.revokeObjectURL(u));
        return [];
      });
    };
  }, [renderPdf, renderKey]);

  const loadingText = title ? `Loading ${title}` : 'Loading…';

  return (
    <div ref={hostRef} className={className}>
      {error ? (
        <div className="text-red-400 text-sm">Failed to load document: {error}</div>
      ) : pageUrls.length === 0 ? (
        <div className="py-12 flex items-center justify-center">
          <div className="flex flex-col items-center">
            <div className="text-center text-white md:text-lg font-semibold tracking-wide mb-6" aria-live="polite">
              {loadingText}
            </div>
            <span className="h-10 w-10 rounded-full border-2 border-slate-300 border-t-slate-600 animate-spin" aria-hidden="true" />
          </div>
        </div>
      ) : (
        <div className="flex flex-col items-stretch">
          {pageUrls.map((u, idx) => (
            <img
              key={idx}
              src={u}
              alt={title ? `${title} – page ${idx + 1}` : `Page ${idx + 1}`}
              style={{ width: '100%', height: 'auto', display: 'block', marginBottom: pageGapPx }}
            />
          ))}
        </div>
      )}
    </div>
  );
}


