export default function StablecoinStatementPage() {
  return (
    <main className="max-w-5xl mx-auto px-4 py-8 md:py-12">
      {/* Hero */}
      <div className="glass nv-glass--inner-hairline border border-white/10 rounded-2xl p-6 md:p-10 mb-8">
        <header className="text-center mb-4">
          <h1 className="trajan-text text-4xl md:text-5xl text-white mb-4">Founder statement on Stablecoins</h1>
          <p className="text-gray-300">(personal opinion – not financial advice for you)</p>
          <p className="text-gray-400 mt-2">Arman Q. Valaquenta · 20 September 2025</p>
        </header>

        {/* FCA warning */}
        <div className="mt-6 bg-black/20 border border-[#ff7f50]/30 rounded-xl p-4 text-[#ffddb8]">
          <p className="text-sm md:text-base">
            UK — Mandatory FCA risk warning: “Do not invest unless you are prepared to lose all the money you invest. This is a high-risk investment and you should not expect to be protected if something goes wrong. Take 2 mins to learn more.”
          </p>
        </div>
      </div>

      {/* Body */}
      <section className="glass nv-glass--inner-hairline border border-white/10 rounded-2xl p-6 md:p-10 mb-8 text-gray-200/95 leading-relaxed space-y-6">
        <p>
          “Stablecoins” are private digital tokens that claim to track a reference asset (usually the U.S. dollar). They come in three broad types: (i) fiat‑backed “e‑money tokens” redeemable against bank deposits and short‑term government paper; (ii) over‑collateralised crypto‑backed coins; and (iii) “algorithmic” coins that attempt to hold a peg via trading rules. The last category has a demonstrated failure mode: TerraUSD (UST) collapsed in 2022 and a U.S. jury later found Terraform Labs and its founder liable for fraud, with a civil judgment exceeding USD 4.5 billion.
        </p>

        <div>
          <h2 className="text-white text-xl md:text-2xl mb-2">Power and network dependence</h2>
          <p>
            A stablecoin exists only as entries on powered, internet‑connected blockchains. If electricity and connectivity stop, ledgers halt, consensus stops, and <strong>there is no stablecoin</strong> to access or transfer; by contrast, cash is a physical bearer instrument that does not require electricity or the internet and remains your legal property in an outage.
          </p>
        </div>

        <div>
          <h2 className="text-white text-xl md:text-2xl mb-2">Peg breaks and run risk are real</h2>
          <p>
            “Stable” is a marketing word, not a guarantee. USDC traded as low as ~USD 0.87 in March 2023 during the Silicon Valley Bank failure; USDT traded near USD 0.95 in May 2022. Over‑collateralised coins (e.g., DAI) have also deviated. Peg breaks are consistent with classic run dynamics when reserves are questioned or access to banks is impaired.
          </p>
        </div>

        <div>
          <h2 className="text-white text-xl md:text-2xl mb-2">Redemption is conditional and often restricted</h2>
          <p>
            Par convertibility typically applies <strong>only</strong> to verified customers of the issuer (KYC/AML, platform accounts, cut‑off times, size minimums, and fees). Ordinary holders usually depend on exchanges rather than direct issuer redemption, precisely when exchange liquidity can be impaired.
          </p>
        </div>

        <div>
          <h2 className="text-white text-xl md:text-2xl mb-2">Freeze and blacklist controls</h2>
          <p>
            Centralised stablecoins can and do freeze tokens and block transfers at the smart‑contract level. Whatever the policy rationale, the technical fact is that <strong>an administrator can render tokens non‑transferable</strong>.
          </p>
        </div>

        <div>
          <h2 className="text-white text-xl md:text-2xl mb-2">Attestations are not full audits</h2>
          <p>
            Reserve transparency typically arrives as <strong>attestations</strong> — point‑in‑time assurance reports — not comprehensive, consolidated financial <strong>audits</strong> of the issuer. Past enforcement actions document misstatements about full backing.
          </p>
        </div>

        <div>
          <h2 className="text-white text-xl md:text-2xl mb-2">Issuer capture of the yield</h2>
          <p>
            Interest on the hundreds of billions in reserve assets accrues to the <strong>issuer</strong>, not to token holders. Public disclosures show issuer profits dominated by reserve interest — with no deposit insurance, governance rights, or par‑value guarantees to the broad public beyond the issuer’s terms.
          </p>
        </div>

        <div>
          <h2 className="text-white text-xl md:text-2xl mb-2">Banking and regulatory fragility</h2>
          <p>
            Stablecoins are not bank deposits and are <strong>not</strong> insured by the FDIC. Banking‑partner failures or supervisory actions can force abrupt changes, suspensions, or wind‑downs.
          </p>
        </div>

        <div>
          <h2 className="text-white text-xl md:text-2xl mb-2">Legal and policy overhang (EU/UK/FSB)</h2>
          <p>
            MiCA in the EU and the UK’s developing regime for issuance and custody continue to evolve. Global bodies (FSB/BIS) warn about run risk, monetary‑sovereignty concerns, and the unsuitability of stablecoins as “money” without central‑bank support and strict regulation.
          </p>
        </div>

        <div>
          <h2 className="text-white text-xl md:text-2xl mb-2">Platform and market‑structure risk</h2>
          <p>
            Stablecoins depend on exchanges, custodians, and bridges that can fail, be hacked, or be shut down. Blacklisting and pausing can also break DeFi applications that rely on these tokens, causing liquidations or denial‑of‑service.
          </p>
        </div>

        <div className="bg-black/20 border border-white/15 rounded-xl p-4">
          <h3 className="text-white text-lg md:text-xl mb-2">Bottom line</h3>
          <p>
            Stablecoins are private, electronic IOUs whose <strong>existence depends on electricity and the internet</strong>, that can be frozen at the issuer’s discretion, that have a history of <strong>peg breaks</strong>, that usually limit direct redemption to verified customers under issuer‑controlled terms, that are not covered by deposit insurance, and that concentrate the <strong>yield</strong> from public‑confidence reserves in the issuer rather than the holder.
          </p>
          <p className="mt-2">
            Our opinion is that Members should treat stablecoins as <strong>speculative, run‑prone credit products</strong>, not cash — with credible risks of <strong>sudden loss of access</strong>, <strong>loss of par value</strong>, and operational failure precisely when stability is most needed.
          </p>
        </div>
      </section>

      {/* Sources */}
      <section className="glass nv-glass--inner-hairline border border-white/10 rounded-2xl p-6 md:p-10 mb-8">
        <h2 className="trajan-text text-2xl md:text-3xl text-white mb-4">Selected sources</h2>
        <ul className="list-disc pl-6 space-y-2 text-gray-200/95">
          <li><a href="https://www.sec.gov/newsroom/press-releases/2024-73" target="_blank" rel="noopener noreferrer">SEC — Terraform Labs verdict</a></li>
          <li><a href="https://www.fdic.gov/news/fact-sheets/crypto-fact-sheet-7-28-22.pdf" target="_blank" rel="noopener noreferrer">FDIC — Crypto fact sheet</a></li>
          <li><a href="https://www.reuters.com/technology/bitcoin-usdc-stablecoin-rally-after-us-intervenes-svb-2023-03-13/" target="_blank" rel="noopener noreferrer">Reuters — USDC de‑peg around SVB</a></li>
          <li><a href="https://www.reuters.com/markets/us/crypto-collapse-intensifies-stablecoin-tether-slides-below-dollar-peg-2022-05-12/" target="_blank" rel="noopener noreferrer">Reuters — USDT de‑peg episodes</a></li>
          <li><a href="https://www.cftc.gov/media/6646/enftetherholdingsorder101521/download" target="_blank" rel="noopener noreferrer">CFTC — Order against Tether</a></li>
          <li><a href="https://ag.ny.gov/press-release/2021/attorney-general-james-ends-virtual-currency-trading-platform-bitfinexs-illegal" target="_blank" rel="noopener noreferrer">NYAG — Bitfinex/Tether settlement</a></li>
          <li><a href="https://www.reuters.com/technology/us-imposes-sanctions-virtual-currency-mixer-tornado-cash-2022-08-08/" target="_blank" rel="noopener noreferrer">OFAC Tornado Cash sanction / freezes</a></li>
          <li><a href="https://assets.ctfassets.net/vyse88cgwfbl/2SGAAXnsb1wKByIzkhcbSx/9efa4682b3cd4c62d87a4c88ee729693/ISAE_3000R_-_Opinion_Tether_International_Financial_Figure_RC187322025BD0201.pdf" target="_blank" rel="noopener noreferrer">ISAE 3000 — Tether assurance opinions</a></li>
          <li><a href="https://www.bloomberg.com/news/articles/2025-04-01/stablecoin-issuer-circle-files-publicly-for-ipo-as-revenue-grows" target="_blank" rel="noopener noreferrer">Bloomberg — Circle revenue from reserve interest</a></li>
          <li><a href="https://www.bloomberg.com/news/articles/2025-01-31/stablecoin-issuer-tether-says-profit-was-13-billion-last-year" target="_blank" rel="noopener noreferrer">Bloomberg — Tether profit disclosures</a></li>
          <li><a href="https://www.dfs.ny.gov/consumers/alerts/Paxos_and_Binance" target="_blank" rel="noopener noreferrer">NYDFS — BUSD actions</a></li>
          <li><a href="https://www.esma.europa.eu/esmas-activities/digital-finance-and-innovation/markets-crypto-assets-regulation-mica" target="_blank" rel="noopener noreferrer">ESMA — MiCA</a></li>
          <li><a href="https://www.fsb.org/uploads/P170723-3.pdf" target="_blank" rel="noopener noreferrer">FSB — High‑level recommendations</a></li>
          <li><a href="https://etherauthority.io/usdc-token-smart-contract-audit/" target="_blank" rel="noopener noreferrer">USDC smart‑contract audit (freeze/blacklist)</a></li>
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


