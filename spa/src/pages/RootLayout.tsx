import { Outlet, useLocation } from 'react-router-dom';
import ComplianceGate from '../components/ComplianceGate';
import CookieBanner from '../components/CookieBanner';
import { useCompliance } from '../context/ComplianceContext';
import { useEffect } from 'react';

export default function RootLayout() {
  const location = useLocation();
  const isHome = location.pathname === '/';
  const { reset } = useCompliance();

  // Reset compliance state when visiting home page
  useEffect(() => {
    if (isHome) {
      reset();
    }
  }, [isHome, reset]);

  return (
    <div className="min-h-screen">
      {!['/member-eula','/terms'].includes(location.pathname) && <ComplianceGate />}
      {/* Top ribbons */}
      <div className="fixed top-0 left-0 right-0 z-10">
        {/* place ribbons only on homepage; other pages keep space */}
      </div>
      {/* Header intentionally removed per requirement */}
      <main className="w-full px-0 md:px-0 py-0">
        <Outlet />
      </main>
      {location.pathname !== '/demo' && (
      <footer className="w-full pb-12">
        <div className="w-full px-4 md:px-6 py-4 text-center">
          <a href="mailto:hello@nirvana.bm" className="inline-block text-lg md:text-xl email-text hover:opacity-80 mb-6">hello@nirvana.bm</a>
          <p className="mt-2 text-[10px] md:text-[11px] leading-snug disc-text max-w-5xl mx-auto text-center">
            Universal analytics & advertising disclaimer.
            Informational only. All figures and outputs are impersonal, parameterised analytics provided “as is” for general informational purposes. They are identical for anyone using the same inputs and do not constitute advice, a suitability assessment, a personal recommendation, an offer, a solicitation, or a prediction. Metrics such as Compass Score are historical or model-based indicators calculated for the stated horizon, confidence, and lookback; values may be inaccurate, incomplete, delayed, or change without notice. Past performance is not a reliable indicator of future results; all investments involve risk, including loss of principal.
            Advertising: Nirvana may display third-party advertisements on this page. Advertising has no influence on the calculation, inclusion, weighting, ranking, or presentation of analytics. Nirvana does not accept any payment, referral fee, or commission in exchange for coverage, scoring, or placement of any financial instrument. Advertisements are clearly labelled and kept separate from analytics.
          </p>
          <p className="mt-3 text-[10px] md:text-[11px]">
            <a href="/terms" className="underline text-gray-300 hover:text-white">Public Terms of Use</a>
          </p>
        </div>
      </footer>
      )}
      <CookieBanner />
    </div>
  );
}


