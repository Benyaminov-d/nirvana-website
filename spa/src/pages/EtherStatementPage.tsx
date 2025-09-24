export default function EtherStatementPage() {
  return (
    <main className="max-w-5xl mx-auto px-4 py-8 md:py-12">
      {/* Hero */}
      <div className="glass nv-glass--inner-hairline border border-white/10 rounded-2xl p-6 md:p-10 mb-8">
        <header className="text-center mb-4">
          <h1 className="trajan-text text-4xl md:text-5xl text-white mb-4">Founder statement on Ether</h1>
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
          Ether is an unbacked digital token with no intrinsic cash flows, no issuer standing behind it, and no right of redemption; its price depends on what someone else will pay at a point in time. Leading monetary authorities describe unbacked cryptoassets as having <strong>no intrinsic value</strong>, establishing no claim on future income or collateral and thus being prone to sharp corrections that can wipe out an investment.
        </p>

        <div>
          <h2 className="text-white text-xl md:text-2xl mb-2">Dependence on power and networks</h2>
          <p>
            Ethereum exists only as electronic records maintained by powered computers on an internet‑connected peer‑to‑peer network. If there is no electricity and no connectivity, the network halts, there is no authoritative ledger, and <strong>there is no Ethereum</strong>; by contrast, cash remains a bearer instrument that does not require electricity or the internet and continues to exist as your legal property during outages.
          </p>
        </div>

        <div>
          <h2 className="text-white text-xl md:text-2xl mb-2">Irreversibility and private‑key loss</h2>
          <p>
            Control equals possession of a private key. If a key is lost or stolen, access is typically permanently lost; once a transaction is confirmed on‑chain, it is <strong>irreversible</strong>. There is usually no practical mechanism to restore keys or unwind a transfer.
          </p>
        </div>

        <div>
          <h2 className="text-white text-xl md:text-2xl mb-2">No deposit insurance or issuer recourse</h2>
          <p>
            Crypto assets are <strong>not</strong> insured by the FDIC. Losses from crypto‑asset price moves, platform failures, insolvencies, or key loss are not insured events.
          </p>
        </div>

        <div>
          <h2 className="text-white text-xl md:text-2xl mb-2">Protocol‑level governance risk (history matters)</h2>
          <p>
            In 2016, “The DAO” smart contract on Ethereum was exploited; the community executed a <strong>hard fork</strong> to reverse the theft, creating a split between Ethereum and Ethereum Classic. This episode demonstrates that, in extremis, ledger outcomes depend on social‑layer decisions as much as code.
          </p>
        </div>

        <div>
          <h2 className="text-white text-xl md:text-2xl mb-2">Proof‑of‑stake introduces new failure modes</h2>
          <p>
            Under Ethereum’s PoS consensus, stake confers voting power: with about <strong>one‑third</strong> of staked ETH an actor can <strong>delay finality</strong>; larger shares enable censorship and broader control. Concentration in large staking pools aggravates these liveness and censorship risks.
          </p>
        </div>

        <div>
          <h2 className="text-white text-xl md:text-2xl mb-2">Staking is not “yield without risk”</h2>
          <p>
            Validators face <strong>slashing</strong> and other penalties; liquid‑staking tokens can <strong>depeg</strong>, and withdrawal/exit queues can delay access to funds. Restaking layers add <strong>additional slashing conditions</strong> and systemic complexity.
          </p>
        </div>

        <div>
          <h2 className="text-white text-xl md:text-2xl mb-2">Smart‑contract and DeFi risk surface</h2>
          <p>
            Bugs, admin‑key errors, upgrade mistakes, and oracle/manipulation attacks have repeatedly caused <strong>large losses</strong>. Audits and formal methods reduce but do not eliminate this risk.
          </p>
        </div>

        <div>
          <h2 className="text-white text-xl md:text-2xl mb-2">MEV, frontrunning, and user harm</h2>
          <p>
            Academic work documents MEV (maximal extractable value) on Ethereum—e.g., sandwich attacks—that systematically <strong>extract value from ordinary users</strong>.
          </p>
        </div>

        <div>
          <h2 className="text-white text-xl md:text-2xl mb-2">Censorship exposure and regulatory pressure</h2>
          <p>
            After sanctions on the Tornado Cash mixer, major stablecoin issuers <strong>froze</strong> related addresses and a large share of post‑Merge blocks were built by OFAC‑compliant relays at various times, evidencing real censorship pressure within Ethereum’s transaction pipeline.
          </p>
        </div>

        <div>
          <h2 className="text-white text-xl md:text-2xl mb-2">Stablecoin and platform interdependencies</h2>
          <p>
            A material share of Ethereum activity relies on centralized stablecoins whose issuers can freeze assets at the contract level to comply with sanctions or court orders, adding counterparty risk that can break DeFi positions or block redemptions.
          </p>
        </div>

        <div>
          <h2 className="text-white text-xl md:text-2xl mb-2">Layer‑2 fragility rolls risk back to users</h2>
          <p>
            Ethereum’s scaling stack depends on centralized sequencers; prominent rollups have suffered multi‑hour outages and stalls that halted or delayed transaction processing.
          </p>
        </div>

        <div>
          <h2 className="text-white text-xl md:text-2xl mb-2">Energy and externalities</h2>
          <p>
            The September 2022 Merge reduced network energy consumption by roughly <strong>99.95%</strong>, but the system still does not exist without power and retains non‑zero data‑center and networking footprints.
          </p>
        </div>

        <div>
          <h2 className="text-white text-xl md:text-2xl mb-2">Legal/regulatory uncertainty specific to ETH</h2>
          <p>
            The legal characterization of ether has been <strong>contested</strong>; litigation and policy positions have shifted. Regardless of ultimate outcomes, the regulatory <strong>pathway is unsettled</strong>, adding headline and enforcement risk.
          </p>
        </div>

        <div className="bg-black/20 border border-white/15 rounded-xl p-4">
          <h3 className="text-white text-lg md:text-xl mb-2">Bottom line</h3>
          <p>
            Ethereum is a purely electronic, unbacked, irreversible system that <strong>does not exist without power and connectivity</strong>, offers no claim on cash flows or collateral, and exposes users to distinctive risks from staking, restaking, MEV, smart‑contract failures, stablecoin freezes, and rollup outages—on top of underlying token volatility.
          </p>
        </div>
      </section>

      {/* Sources */}
      <section className="glass nv-glass--inner-hairline border border-white/10 rounded-2xl p-6 md:p-10 mb-8">
        <h2 className="trajan-text text-2xl md:text-3xl text-white mb-4">Sources</h2>
        <ul className="list-disc pl-6 space-y-2 text-gray-200/95">
          <li><a href="https://www.bankofengland.co.uk/financial-stability-in-focus/2022/march-2022" target="_blank" rel="noopener noreferrer">Bank of England — Financial Stability in Focus (2022)</a></li>
          <li><a href="https://blockchainlab.com/pdf/Ethereum_white_paper-a_next_generation_smart_contract_and_decentralized_application_platform-vitalik-buterin.pdf" target="_blank" rel="noopener noreferrer">Ethereum white paper</a></li>
          <li><a href="https://www.sec.gov/Archives/edgar/data/1992508/000121390024010722/fs12024a1_ark21shares.htm" target="_blank" rel="noopener noreferrer">SEC filings — Ether ETF risk factors (example)</a></li>
          <li><a href="https://www.fdic.gov/news/fact-sheets/crypto-fact-sheet-7-28-22.pdf" target="_blank" rel="noopener noreferrer">FDIC — Crypto fact sheet</a></li>
          <li><a href="https://www.gemini.com/cryptopedia/the-dao-hack-makerdao" target="_blank" rel="noopener noreferrer">The DAO hack overview</a></li>
          <li><a href="https://ethereum.org/th/developers/docs/consensus-mechanisms/pos/attack-and-defense/" target="_blank" rel="noopener noreferrer">Ethereum.org — PoS attack and defense</a></li>
          <li><a href="https://www.coindesk.com/tech/2025/08/14/figment-outpaces-rivals-in-ether-staking-growth-lido-s-decline-eases-dominance-concerns/" target="_blank" rel="noopener noreferrer">CoinDesk — staking concentration context</a></li>
          <li><a href="https://ethereum.org/developers/docs/consensus-mechanisms/pos/rewards-and-penalties/" target="_blank" rel="noopener noreferrer">Ethereum.org — rewards and penalties</a></li>
          <li><a href="https://www.coindesk.com/tech/2025/04/17/eigenlayer-adds-key-slashing-feature-completing-original-vision/" target="_blank" rel="noopener noreferrer">CoinDesk — EigenLayer slashing</a></li>
          <li><a href="https://www.reuters.com/technology/losses-crypto-hacks-jump-22-bln-2024-report-says-2024-12-19/" target="_blank" rel="noopener noreferrer">Reuters — losses to crypto hacks</a></li>
          <li><a href="https://blog.openzeppelin.com/upgrades-app-for-gnosis-safe" target="_blank" rel="noopener noreferrer">OpenZeppelin — security notes</a></li>
          <li><a href="https://arxiv.org/abs/1904.05234" target="_blank" rel="noopener noreferrer">arXiv — MEV paper</a></li>
          <li><a href="https://home.treasury.gov/news/press-releases/jy0916" target="_blank" rel="noopener noreferrer">U.S. Treasury — Tornado Cash press release</a></li>
          <li><a href="https://cointelegraph.com/news/circle-freezes-blacklisted-tornado-cash-smart-contract-addresses" target="_blank" rel="noopener noreferrer">Cointelegraph — stablecoin freezes</a></li>
          <li><a href="https://status.arbitrum.io/clq6te1l142387b8n5bmllk9es" target="_blank" rel="noopener noreferrer">Arbitrum status — outage example</a></li>
          <li><a href="https://www.investopedia.com/ethereum-completes-the-merge-6666337" target="_blank" rel="noopener noreferrer">Investopedia — The Merge</a></li>
          <li><a href="https://www.skadden.com/insights/publications/2023/03/nyag-files-action-against-crypto-trading-platform" target="_blank" rel="noopener noreferrer">Skadden — NYAG action context</a></li>
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


