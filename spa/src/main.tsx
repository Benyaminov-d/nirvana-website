import React from 'react';
import ReactDOM from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import './styles/index.css';
import RootLayout from './pages/RootLayout';
import HomePage from './pages/HomePage';
import ProductsPage from './pages/ProductsPage';
import TickerPage from './pages/TickerPage';
import CvarPage from './pages/CvarPage';
import ExportPage from './pages/ExportPage';
import AnnualPage from './pages/AnnualPage';
import CryptoRiskPage from './pages/CryptoRiskPage';
import FiveStarsPage from './pages/FiveStarsPage';
import TermsPage from './pages/TermsPage';
import MemberEulaPage from './pages/MemberEulaPage';
import CompassScorePage from './pages/CompassScorePage';
import AboutPage from './pages/AboutPage';
import WhyPeopleUseNirvanaPage from './pages/WhyPeopleUseNirvanaPage';
import NotFoundPage from './pages/NotFoundPage';
import ScoreExperimentPage from './pages/ScoreExperimentPage';
import SignInPage from './pages/SignInPage';
import SignUpPage from './pages/SignUpPage';
import LogoutPage from './pages/LogoutPage';
import VerifyEmailPage from './pages/VerifyEmailPage';
import RequestResetPage from './pages/RequestResetPage';
import ResetPasswordPage from './pages/ResetPasswordPage';
import { ComplianceProvider } from './context/ComplianceContext';
import DemoPage from './pages/DemoPage';
import TickerCheckPage from './pages/TickerCheckPage';
import ValidationAnalyticsPage from './pages/ValidationAnalyticsPage';
import TrustCodeProgrammePage from './pages/TrustCodeProgrammePage';

const router = createBrowserRouter([
  {
    path: '/',
    element: <RootLayout />,
    children: [
      { index: true, element: <HomePage /> },
      { path: 'products', element: <ProductsPage /> },
      { path: 'ticker', element: <TickerPage /> },
      { path: 'ticker/check', element: <TickerCheckPage /> },
      { path: 'cvar', element: <CvarPage /> },
      { path: 'cvar/calculator', element: <CvarPage /> },
      { path: 'export', element: <ExportPage /> },
      { path: 'annual', element: <AnnualPage /> },
      { path: 'crypto-risk', element: <CryptoRiskPage /> },
      { path: 'five-stars', element: <FiveStarsPage /> },
      { path: 'terms', element: <TermsPage /> },
      { path: 'what-is-compass-score', element: <CompassScorePage /> },
      { path: 'member-eula', element: <MemberEulaPage /> },
      { path: 'about', element: <AboutPage /> },
      { path: 'why-people-use-nirvana', element: <WhyPeopleUseNirvanaPage /> },
      { path: 'demo', element: <DemoPage /> },
      { path: 'score-experiment', element: <ScoreExperimentPage /> },
      { path: 'validation-analytics', element: <ValidationAnalyticsPage /> },
      { path: 'trust-code-programme', element: <TrustCodeProgrammePage /> },
      { path: 'signin', element: <SignInPage /> },
      { path: 'signup', element: <SignUpPage /> },
      // aliases for the typoed links per request
      { path: 'singin', element: <SignInPage /> },
      { path: 'singup', element: <SignUpPage /> },
      { path: 'logout', element: <LogoutPage /> },
      { path: 'verify', element: <VerifyEmailPage /> },
      { path: 'request-reset', element: <RequestResetPage /> },
      { path: 'reset-password', element: <ResetPasswordPage /> },
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


