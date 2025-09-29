import React from 'react';
import ReactDOM from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import './styles/index.css';
import RootLayout from './pages/RootLayout';
import HomePage from './pages/HomePage';
import AboutPage from './pages/AboutPage';
import MemberEulaPage from './pages/MemberEulaPage';
import WhyPeopleUseNirvanaPage from './pages/WhyPeopleUseNirvanaPage';
import CompassScorePage from './pages/CompassScorePage';
import TermsPage from './pages/TermsPage';
import TrustCodeProgrammePage from './pages/TrustCodeProgrammePage';
import HaveACodeOrNeedOnePage from './pages/HaveACodeOrNeedOnePage';
import WhatIsThisAllAboutPage from './pages/WhatIsThisAllAboutPage';
import AnnualMembershipBenefitsPage from './pages/AnnualMembershipBenefitsPage';
import WhatDoesAnnualMembershipGiveYouPage from './pages/WhatDoesAnnualMembershipGiveYouPage';
import WhyDoINeedItPage from './pages/WhyDoINeedItPage';
import CryptoPage from './pages/CryptoPage';
import BitcoinStatementPage from './pages/BitcoinStatementPage';
import EtherStatementPage from './pages/EtherStatementPage';
import StablecoinStatementPage from './pages/StablecoinStatementPage';
import NotFoundPage from './pages/NotFoundPage';
import YourRightToKnowPage from './pages/YourRightToKnowPage';
import NirvanaFellowsPage from './pages/NirvanaFellowsPage';
import { ComplianceProvider } from './context/ComplianceContext';

// ── Trust Code QR cookie bootstrap ───────────────────────────────────────────
function setCookie(name: string, value: string, days = 180) {
  try {
    const expires = new Date(Date.now() + days * 864e5).toUTCString();
    const host = window.location.hostname || '';
    let domain = '';
    if (host === 'nirvana.bm' || host.endsWith('.nirvana.bm')) {
      domain = '; domain=.nirvana.bm';
    } else if (host.endsWith('.lvh.me')) {
      domain = '; domain=.lvh.me';
    } else if (host.endsWith('.nip.io')) {
      domain = '; domain=.nip.io';
    }
    document.cookie = `${name}=${encodeURIComponent(value)}; expires=${expires}; path=/${domain}; SameSite=Lax`;
  } catch {}
}

function getCookie(name: string): string | null {
  try {
    const m = document.cookie.match(new RegExp('(?:^|; )' + name.replace(/([.$?*|{}()\[\]\\/+^])/g, '\\$1') + '=([^;]*)'));
    return m ? decodeURIComponent(m[1]) : null;
  } catch { return null; }
}

function ensureSid(): string {
  let sid = getCookie('nir_sid');
  if (!sid) {
    // Simple UUID v4-like generator
    sid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
      const r = (Math.random() * 16) | 0;
      const v = c === 'x' ? r : (r & 0x3) | 0x8;
      return v.toString(16);
    });
    setCookie('nir_sid', sid);
  }
  return sid;
}

// On entry, capture ?trustcode (and optional source/campaign) into cookies
try {
  const url = new URL(window.location.href);
  const trust = (url.searchParams.get('trustcode') || url.searchParams.get('charity') || '').trim();
  if (trust) {
    const source = (url.searchParams.get('source') || 'qr').trim().toLowerCase();
    const campaign = (url.searchParams.get('campaign') || '').trim();
    setCookie('nir_trust_code', trust);
    setCookie('nir_source', source);
    if (campaign) setCookie('nir_campaign', campaign);
    ensureSid();
    // Clean URL (remove params)
    url.searchParams.delete('trustcode');
    url.searchParams.delete('charity');
    url.searchParams.delete('source');
    url.searchParams.delete('campaign');
    try { window.history.replaceState(null, '', url.toString()); } catch {}
  }
} catch {}

const router = createBrowserRouter([
  {
    path: '/',
    element: <RootLayout />,
    children: [
      { index: true, element: <HomePage /> },
      { path: 'the-founder', element: <AboutPage /> },
      { path: 'member-eula', element: <MemberEulaPage /> },
      { path: 'why-people-use-nirvana', element: <WhyPeopleUseNirvanaPage /> },
      { path: 'why-do-we-exist', element: <WhyPeopleUseNirvanaPage /> },
      { path: 'what-is-compass-score', element: <CompassScorePage /> },
      { path: 'what-is-this-all-about', element: <WhatIsThisAllAboutPage /> },
      { path: 'what-does-an-annual-nirvana-membership-give-you', element: <WhatDoesAnnualMembershipGiveYouPage /> },
      { path: 'nirvana-membership-fees', element: <AnnualMembershipBenefitsPage /> },
      { path: 'why-do-i-need-it', element: <WhyDoINeedItPage /> },
      { path: 'have-a-code-or-need-one', element: <HaveACodeOrNeedOnePage /> },
      { path: 'nirvana-fellows', element: <NirvanaFellowsPage /> },
      { path: 'terms', element: <TermsPage /> },
      { path: 'trust-code-programme', element: <TrustCodeProgrammePage /> },
      { path: 'your-right-to-know', element: <YourRightToKnowPage /> },
      { path: 'founder-statement-on-cryptocurrencies', element: <CryptoPage /> },
      { path: 'founder-statement-on-cryptocurrencies/bitcoin', element: <BitcoinStatementPage /> },
      { path: 'founder-statement-on-cryptocurrencies/ether', element: <EtherStatementPage /> },
      { path: 'founder-statement-on-cryptocurrencies/stablecoins', element: <StablecoinStatementPage /> },
      { path: '*', element: <NotFoundPage /> },
    ],
  },
]);

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ComplianceProvider>
      <RouterProvider router={router} />
    </ComplianceProvider>
  </React.StrictMode>
);