import { Link } from 'react-router-dom';

export default function BitcoinStatementPage() {
  return (
    <main className="max-w-5xl mx-auto px-4 py-8 md:py-12">
      <div className="mb-4">
        <Link to="/" className="glass nv-glass--inner-hairline border border-white/10 rounded-lg px-3 py-2 inline-flex items-center gap-2 text-gray-200 hover:text-white">
          <span className="text-xl leading-none">←</span>
          <span className="trajan-text">Home</span>
        </Link>
      </div>
      {/* Hero */}
      <div className="glass nv-glass--inner-hairline border border-white/10 rounded-2xl p-6 md:p-10 mb-8">
        <header className="text-center mb-4">
          <h1 className="trajan-text text-4xl md:text-5xl text-white mb-4">Founder statement on Bitcoin</h1>
          <p className="text-gray-300 mt-2">(personal opinion – not financial advice for you)</p>
          <p className="text-gray-400 mt-4">Arman Q. Valaquenta · 20 September 2025</p>
        </header>

        {/* FCA warning */}
        <div className="mt-8 bg-black/20 border border-[#ff7f50]/30 rounded-xl p-4 text-[#ffddb8]">
          <p className="text-sm md:text-base">
            UK — Mandatory FCA risk warning: “Do not invest unless you are prepared to lose all the money you invest. This is a high-risk investment and you should not expect to be protected if something goes wrong. Take 2 mins to learn more.”
          </p>
        </div>
      </div>

      {/* Body */}
      <section className="glass nv-glass--inner-hairline border border-white/10 rounded-2xl p-6 md:p-10 mb-8 text-gray-200/95 leading-relaxed space-y-6">
        <p>
          Bitcoin is an unbacked digital token with no intrinsic cash flows, no issuer standing behind it, and no right of redemption; its price rests on what another party will pay at a point in time. Leading monetary authorities state plainly that unbacked cryptoassets establish no claim on future income or collateral and therefore have <strong>no intrinsic value</strong>; several also judge Bitcoin not suitable as a payment system or as an investment.
        </p>

        <div>
          <h2 className="text-white text-xl md:text-2xl mb-2">Existence depends on electricity and the internet</h2>
          <p>
            Bitcoin exists only as a replicated electronic ledger maintained by powered computers on an online peer-to-peer network. Turn off electricity and connectivity and the network halts; there is no consensus, no authoritative ledger, and <strong>no Bitcoin</strong>. By contrast, cash is a physical bearer instrument that does not require electricity or the internet and remains your legal property during outages.
          </p>
        </div>

        <div>
          <h2 className="text-white text-xl md:text-2xl mb-2">Irreversibility and key‑loss risk</h2>
          <p>
            Control equals possession of a private key. If a key is lost or stolen, access is typically permanently lost; on‑chain transfers are generally <strong>irreversible</strong>. There is usually no practical mechanism to restore keys or unwind a transfer once broadcast.
          </p>
        </div>

        <div>
          <h2 className="text-white text-xl md:text-2xl mb-2">No deposit insurance or issuer recourse</h2>
          <p>
            Crypto assets are <strong>not</strong> covered by FDIC deposit insurance. Losses from crypto‑asset price moves, platform failures, or insolvencies are not insured events.
          </p>
        </div>

        <div>
          <h2 className="text-white text-xl md:text-2xl mb-2">Extreme volatility and tail risk</h2>
          <p>
            Bitcoin’s price has undergone repeated deep drawdowns and exhibits volatility multiple times that of major equity indices. Even sponsor filings for bitcoin‑related funds warn that adoption remains limited and that the asset is subject to extreme swings, including from exchange failures, security breaches, and regulatory actions.
          </p>
        </div>

        <div>
          <h2 className="text-white text-xl md:text-2xl mb-2">Retail investor outcomes</h2>
          <p>
            Independent research indicates a <strong>large majority</strong> of retail participants likely <strong>lost money</strong> on their initial crypto investments in the 2015–2022 period.
          </p>
        </div>

        <div>
          <h2 className="text-white text-xl md:text-2xl mb-2">Fraud environment and market‑integrity concerns</h2>
          <p>
            Authorities warn that Ponzi and pyramid‑style scams use virtual currencies, and recent years have seen multibillion‑dollar crypto‑related investment‑fraud losses reported to federal agencies. Platform‑level risk and governance failures can wipe out customer access and value.
          </p>
        </div>

        <div>
          <h2 className="text-white text-xl md:text-2xl mb-2">Ecological toll</h2>
          <p>
            Proof‑of‑work mining imposes material electricity demand, with associated greenhouse‑gas emissions and local externalities tracked by independent indices and federal assessments.
          </p>
        </div>

        <div>
          <h2 className="text-white text-xl md:text-2xl mb-2">Operational fragility of the wider stack</h2>
          <p>
            Beyond the protocol itself, surrounding market infrastructure has suffered spectacular failures; high‑profile criminal cases underscore risks that can erase customer access and value.
          </p>
        </div>

        <div className="bg-black/20 border border-white/15 rounded-xl p-4">
          <h3 className="text-white text-lg md:text-xl mb-2">Bottom line</h3>
          <p>
            Bitcoin is a purely electronic, unbacked, irreversible system that <strong>does not exist without power and connectivity</strong>, offers no claim on cash flows or collateral, is not covered by deposit insurance, and has a track record of extreme volatility and poor retail outcomes, all while imposing a real ecological cost.
          </p>
          <p className="mt-2">
            In my opinion, hard‑working people should treat Bitcoin as <strong>speculative with a credible risk of massively large losses</strong> — including near‑total loss of market value and <strong>total loss of access</strong> if private keys are lost or stolen — and that it is unsuitable for any person who cannot afford such outcomes.
          </p>
        </div>
      </section>

      {/* Sources */}
      <section className="glass nv-glass--inner-hairline border border-white/10 rounded-2xl p-6 md:p-10 mb-8">
        <h2 className="trajan-text text-2xl md:text-3xl text-white mb-4">Sources</h2>
        <ul className="list-disc pl-6 space-y-2 text-gray-200/95">
          <li><a href="https://www.bankofengland.co.uk/financial-stability-in-focus/2022/march-2022" target="_blank" rel="noopener noreferrer">Bank of England — Financial Stability in Focus (2022)</a></li>
          <li><a href="https://bitcoin.org/bitcoin.pdf" target="_blank" rel="noopener noreferrer">Bitcoin white paper (bitcoin.org)</a></li>
          <li><a href="https://files.consumerfinance.gov/f/201408_cfpb_consumer-advisory_virtual-currencies.pdf" target="_blank" rel="noopener noreferrer">Consumer Financial Protection Bureau — Advisory on virtual currencies</a></li>
          <li><a href="https://www.fdic.gov/resources/deposit-insurance" target="_blank" rel="noopener noreferrer">FDIC — Deposit insurance resources and crypto clarification</a></li>
          <li><a href="https://www.bis.org/publ/work1049.pdf" target="_blank" rel="noopener noreferrer">Bank for International Settlements — Working Paper 1049</a></li>
          <li><a href="https://www.sec.gov/files/ia_virtualcurrencies.pdf" target="_blank" rel="noopener noreferrer">SEC — Investor alert on virtual currencies</a></li>
          <li><a href="https://ccaf.io/cbnsi/cbeci/methodology" target="_blank" rel="noopener noreferrer">Cambridge Bitcoin Electricity Consumption Index — Methodology</a></li>
          <li><a href="https://www.justice.gov/usao-sdny/pr/samuel-bankman-fried-sentenced-25-years-prison" target="_blank" rel="noopener noreferrer">U.S. Department of Justice — SBF sentencing</a></li>
        </ul>
      </section>

      {/* Notes / Legal */}
      <section className="glass nv-glass--inner-hairline border border-white/10 rounded-2xl p-6 md:p-10">
        <h2 className="trajan-text text-2xl md:text-3xl text-white mb-4">Notes</h2>
        <ul className="list-disc pl-6 space-y-2 text-gray-300 text-sm leading-relaxed">
          <li>United Kingdom: This document is not a financial promotion to UK consumers. It is general commentary intended for international audiences and is not an invitation or inducement to engage in investment activity in the UK. It should not be relied upon by UK consumers for investment decisions.</li>
          <li>No advice / no recommendation: These materials are for general information only, reflect the author’s personal views at the date of writing, and do not constitute investment, legal, accounting, tax, or other advice; they are not a recommendation or an invitation or inducement to purchase, sell, or hold any asset or to engage in any transaction.</li>
          <li>No research / independence: These materials are non‑independent commentary and do not constitute “investment research”. No specific recipient’s objectives, financial situation, or needs have been considered.</li>
          <li>No client relationship; no duty: Reading this document does not create any client, advisory, fiduciary, or agency relationship with the author or any affiliate.</li>
          <li>Sources, accuracy, and updates: Public sources may be incomplete or change without notice. While reasonable care has been taken, accuracy, completeness, and timeliness are not guaranteed. No duty to update is assumed.</li>
          <li>Risk statement (generic): Cryptoassets can be extremely volatile and may lose most or all of their value; access may be lost through theft, loss of credentials, protocol or platform failure, or regulatory action. Past performance is not a reliable indicator of future results.</li>
          <li>No conflicts / compensation: The author received no compensation from any issuer, exchange, or protocol mentioned herein, and holds no position designed to benefit from this publication.</li>
          <li>Territorial scope: Distribution of this document may be restricted by law in certain jurisdictions. Persons who receive it are responsible for informing themselves about, and observing, any such restrictions.</li>
        </ul>
      </section>
    </main>
  );
}


