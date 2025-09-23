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
import NotFoundPage from './pages/NotFoundPage';
import { ComplianceProvider } from './context/ComplianceContext';

const router = createBrowserRouter([
  {
    path: '/',
    element: <RootLayout />,
    children: [
      { index: true, element: <HomePage /> },
      { path: 'about', element: <AboutPage /> },
      { path: 'member-eula', element: <MemberEulaPage /> },
      { path: 'why-people-use-nirvana', element: <WhyPeopleUseNirvanaPage /> },
      { path: 'why-do-we-exist', element: <WhyPeopleUseNirvanaPage /> },
      { path: 'what-is-compass-score', element: <CompassScorePage /> },
      { path: 'what-is-this-all-about', element: <WhatIsThisAllAboutPage /> },
      { path: 'what-does-an-annual-nirvana-membership-give-you', element: <WhatDoesAnnualMembershipGiveYouPage /> },
      { path: 'nirvana-membership-fees', element: <AnnualMembershipBenefitsPage /> },
      { path: 'why-do-i-need-it', element: <WhyDoINeedItPage /> },
      { path: 'have-a-code-or-need-one', element: <HaveACodeOrNeedOnePage /> },
      { path: 'terms', element: <TermsPage /> },
      { path: 'trust-code-programme', element: <TrustCodeProgrammePage /> },
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