import React from 'react';
import { Link } from 'react-router-dom';

export default function NirvanaFellowsPage() {
  return (
    <main className="max-w-5xl mx-auto px-4 py-8 md:py-12">
      <div className="mb-4">
        <Link to="/" className="glass nv-glass--inner-hairline border border-white/10 rounded-lg px-3 py-2 inline-flex items-center gap-2 text-gray-200 hover:text-white">
          <span className="text-xl leading-none">←</span>
          <span className="trajan-text">Home</span>
        </Link>
      </div>
      <div className="glass nv-glass--inner-hairline border border-white/10 rounded-2xl p-6 md:p-10">
        <header className="mb-6">
          <h1 className="trajan-text text-3xl md:text-4xl text-white">Nirvana Fellows</h1>
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


