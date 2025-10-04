import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { postJSON } from '../services/http';

type SubmitState = 'idle' | 'submitting' | 'success' | 'error' | 'invalid' | 'already';

export default function HaveACodeOrNeedOnePage() {
  const [code, setCode] = useState('');
  const [submitState, setSubmitState] = useState<SubmitState>('idle');
  const [message, setMessage] = useState<string>('');
  const [copyMsg, setCopyMsg] = useState<string>('');

  const cleanedCode = useMemo(() => code.trim().toUpperCase(), [code]);

  useEffect(() => {
    // Reset transient state on code change
    setSubmitState('idle');
    setMessage('');
  }, [cleanedCode]);

  const validateCode = (val: string): boolean => {
    // Upper-case letters, numbers, hyphens; at least 3 chars
    return /^[A-Z0-9][A-Z0-9-]{2,}$/.test(val);
  };

  const isAlreadyApplied = (): boolean => {
    try {
      const applied = localStorage.getItem('nirvana_trust_code_applied');
      return Boolean(applied);
    } catch { return false; }
  };

  // Directory categories (no filters)
  type OrgCategory = { title: string; description: string };
  const categories: OrgCategory[] = useMemo(() => ([
    { title: 'Indigenous Nations & Communities', description: 'Direct recurring support to self-determined projects under community governance.' },
    { title: 'Friends of Forests', description: 'Protect and restore native forests; support reforestation and long-term habitat stewardship.' },
    { title: 'Wildlife Protection', description: 'Safeguard threatened species and habitats; fund anti-poaching, sanctuaries, and field research.' },
    { title: 'Animal Welfare & Rescue', description: 'Improve animal welfare standards; support rescue, shelter, veterinary care, and rehoming.' },
    { title: 'Oceans & Marine Life', description: 'Protect marine habitats and coastal ecosystems; advance conservation, cleanup, and research.' },
    { title: 'Rivers, Wetlands & Freshwater', description: 'Restore watersheds and wetlands; enhance biodiversity and climate resilience.' },
    { title: 'Humanitarian Relief', description: 'Provide rapid response in crises; fund medical aid, shelter, food, and logistics.' },
    { title: 'Health Access & Outcomes', description: 'Advance public health and preventive care; strengthen clinics, hospitals, and outreach.' },
    { title: 'Education & Opportunity', description: 'Expand equitable access to education and skills; fund scholarships, classrooms, and tools.' },
    { title: 'Youth & Community Development', description: 'Back programmes that build safe communities, mentorship, and pathways to work.' },
    { title: 'Mental Health & Addiction Services', description: 'Support treatment, harm-reduction, recovery, and community mental-health initiatives.' },
    { title: 'Food Security & Poverty Alleviation', description: 'Reduce hunger and hardship; fund food banks, cash-assistance, and livelihood programmes.' },
    { title: 'Climate & Clean Energy', description: 'Accelerate emissions reduction and adaptation; support clean-energy and resilience projects.' },
    { title: 'Justice & Human Rights', description: 'Advance rule of law, civil liberties, and dignified treatment for all.' },
    { title: 'Foundations & Endowments', description: 'Channel recurring, unrestricted funding to mission-aligned programmes.' },
    { title: 'Universities & Colleges', description: 'Support scholarships, research, and campus initiatives through recurring funding.' },
    { title: 'Faith-based Organisations', description: 'Back community service, relief, and social programmes administered by faith institutions.' },
    { title: 'Associations & Membership Organisations', description: 'Provide durable, non-dues revenue to serve members and expand programmes.' },
    { title: 'Arts, Culture & Heritage', description: 'Sustain cultural institutions, creators, and heritage conservation.' },
  ]), []);

  // Institutional partners (separate block)
  type InstCategory = { title: string; description: string };
  const institutional: InstCategory[] = useMemo(() => ([
    { title: 'Banks & Credit Unions', description: 'Participating issuers introduce Members and receive a share of subscription revenue.' },
    { title: 'Investment Advisers — Referral', description: 'Associates introduce Members via Trust Codes; Nirvana handles education and support.' },
    { title: 'Investment Advisers — Seat Licence', description: 'For adviser self-use; licences activated for client seats under standard terms.' },
    { title: 'Card Networks & Issuers (Operation Causeway)', description: 'Card-network partners introduce institutions; attribution and shares under standard rules.' },
    { title: 'Insurers', description: 'Participating insurers introduce Members and support financial-wellbeing initiatives.' },
    { title: 'Enterprise Retail & E-commerce', description: 'Large retailers and platforms introduce Members at scale; no PII is shared.' },
    { title: 'Creators & Publishers', description: 'Creators, journalists, and publishers introduce audiences via codes; cohort-level reporting only.' },
    { title: 'Private Equity & Conglomerates', description: 'Portfolio-wide introductions via operating companies; single-code, first-touch attribution.' },
  ]), []);

  const handleApply = async (e: React.FormEvent) => {
    e.preventDefault();
    if (submitState === 'submitting') return;

    if (!validateCode(cleanedCode)) {
      setSubmitState('invalid');
      setMessage("That code was not recognised. Please check the spelling or choose Explore organisations.");
      return;
    }

    if (isAlreadyApplied()) {
      setSubmitState('already');
      setMessage(`Code ${cleanedCode} is already active on your account. You may change it before your first successful paid subscription.`);
      return;
    }

    try {
      setSubmitState('submitting');
      setMessage('');
      const res = await postJSON('/contact/apply-trust-code', { code: cleanedCode }) as { success: boolean; message?: string };
      if (res?.success) {
        try { localStorage.setItem('nirvana_trust_code_applied', cleanedCode); } catch {}
        setSubmitState('success');
        setMessage(`Code ${cleanedCode} applied. Your 10% discount will appear at checkout. 10% of your subscription will support your chosen organisation.`);
      } else {
        setSubmitState('error');
        setMessage(res?.message || 'An error occurred. Please try again later.');
      }
    } catch (err: any) {
      setSubmitState('error');
      setMessage(err?.message || 'An error occurred. Please try again later.');
    }
  };

  const handleCopyCode = async (trustCode: string) => {
    try {
      await navigator.clipboard.writeText(trustCode);
      setCopyMsg(`Code ${trustCode} copied to clipboard.`);
      setTimeout(() => setCopyMsg(''), 2500);
    } catch {
      try {
        const ta = document.createElement('textarea');
        ta.value = trustCode;
        document.body.appendChild(ta);
        ta.select();
        document.execCommand('copy');
        document.body.removeChild(ta);
        setCopyMsg(`Code ${trustCode} copied to clipboard.`);
        setTimeout(() => setCopyMsg(''), 2500);
      } catch {}
    }
  };

  return (
    <main className="max-w-5xl mx-auto px-4 py-8 md:py-12">
      <div className="mb-4">
        <Link to="/?fromsubpage=true" className="glass nv-glass--inner-hairline border border-white/10 rounded-lg px-3 py-2 inline-flex items-center gap-2 text-gray-200 hover:text-white">
          <span className="text-xl leading-none">←</span>
          <span className="trajan-text">Home</span>
        </Link>
      </div>
      {/* Hero */}
      <div className="glass nv-glass--inner-hairline border border-white/10 rounded-2xl p-6 md:p-10 mb-8">
        <header className="text-center mb-4">
          <h1 className="trajan-text text-3xl md:text-4xl text-white mb-2">Have a Trust Code or need one?</h1>
          <p className="trajan-text text-3xl md:text-4xl text-white mb-2">Activate your 10% discount</p>
        </header>
        <p className="text-gray-200/95 leading-relaxed text-center max-w-3xl mx-auto">
          A Trust Code gives you a 10% discount on your Nirvana membership and directs 10% of your subscription to an organisation you choose. In addition, Nirvana pledges a further 10% of total consolidated revenue to charitable causes via direct donations.
        </p>
      </div>

      {/* Primary action row */}
      <div className="glass nv-glass--inner-hairline border border-white/10 rounded-2xl p-4 md:p-6 mb-4">
        <form onSubmit={handleApply} className="flex flex-col md:flex-row gap-3 items-stretch md:items-end">
          <div className="flex-1">
            <label htmlFor="trust-code" className="block text-white mb-2">Enter Trust Code</label>
            <input
              id="trust-code"
              type="text"
              value={code}
              onChange={(e)=>setCode(e.target.value)}
              placeholder="e.g., FRIENDS-OF-FORESTS"
              className="w-full bg-black/20 border border-white/20 rounded-lg px-4 py-3 text-white placeholder:text-gray-400 focus:border-white/40 focus:outline-none"
              autoComplete="off"
              spellCheck={false}
            />
          </div>
          <div className="flex md:block">
            <button
              type="submit"
              disabled={submitState==='submitting'}
              className="w-full md:w-auto bg-[#c19658] text-black px-6 py-3 rounded-xl hover:opacity-90 font-medium disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {submitState==='submitting' ? 'Applying…' : 'Apply code'}
            </button>
          </div>
        </form>
        {/* Secondary links */}
        <div className="mt-3 text-center text-gray-300">
          <a href="#" onClick={(e)=>{e.preventDefault(); alert('Coming soon');}} className="hover:text-white">Find a code</a>
          <span className="mx-2">•</span>
          <a href="#" onClick={(e)=>{e.preventDefault(); alert('Coming soon');}} className="hover:text-white">Explore organisations</a>
          <span className="mx-2">•</span>
          <a href="#" onClick={(e)=>{e.preventDefault(); alert('Coming soon');}} className="hover:text-white">Continue without a code</a>
        </div>
        {/* Sub-label */}
        <p className="mt-4 text-gray-300 text-sm text-center">
          Use a Trust Code to save 10%. 10% of your subscription supports that organisation. In addition, Nirvana pledges a further 10% of total consolidated revenue to charitable causes via direct donations.
        </p>

        {/* Status message */}
        {message && (
          <div className={`mt-4 p-4 rounded-lg text-sm ${
            submitState==='success' ? 'bg-green-900/20 border border-green-500/30 text-green-200' :
            submitState==='invalid' ? 'bg-yellow-900/20 border border-yellow-500/30 text-yellow-200' :
            submitState==='already' ? 'bg-blue-900/20 border border-blue-500/30 text-blue-200' :
            submitState==='error' ? 'bg-red-900/20 border border-red-500/30 text-red-200' :
            'bg-gray-900/20 border border-gray-500/30 text-gray-200'
          }`}>
            {message}
          </div>
        )}
      </div>

      {/* Once you choose your Code */}
      <div className="glass nv-glass--inner-hairline border border-white/10 rounded-2xl p-6 md:p-10 mb-8">
        <h2 className="trajan-text text-2xl md:text-3xl text-white mb-6">Once you choose your Code</h2>
        <ul className="space-y-2 text-gray-200/95">
          <li>• You receive a 10% discount on the annual membership fee at checkout.</li>
          <li>• 10% of your subscription is remitted to the organisation tied to your code while your membership remains active.</li>
          <li>• Trust Codes do not affect search results or rankings; Nirvana remains a neutral search network.</li>
        </ul>
      </div>

      {/* How it works */}
      <div className="glass nv-glass--inner-hairline border border-white/10 rounded-2xl p-6 md:p-10 mb-8">
        <h2 className="trajan-text text-2xl md:text-3xl text-white mb-6">How it works</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            {n:1, t:'Choose or enter a code', d:'Select an organisation from our directory or enter a code you already have.'},
            {n:2, t:'Receive your discount', d:'Your 10% discount is applied to the annual membership fee shown at checkout.'},
            {n:3, t:'Support your organisation', d:'While your membership remains active, 10% of your subscription supports that organisation. Grace period six months on renewal failures.'},
            {n:4, t:'We donate a further 10%', d:'Separately, Nirvana pledges a further 10% of total consolidated revenue to charitable causes.'},
          ].map((s)=> (
            <div key={s.n} className="text-center flex flex-col items-center h-full">
              <div className="w-12 h-12 bg-[#c19658] rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-black font-bold text-xl">{s.n}</span>
              </div>
              <div className="mb-3 flex items-start justify-center h-[64px] md:h-[72px]">
                <h3 className="text-xl text-white m-0 leading-snug text-center">{s.t}</h3>
              </div>
              <p className="text-gray-200/95">{s.d}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Explore participating organisations */}
      <div className="glass nv-glass--inner-hairline border border-white/10 rounded-2xl p-6 md:p-10 mb-8">
        <h2 className="trajan-text text-2xl md:text-3xl text-white mb-6">Explore participating organisations</h2>
        {copyMsg && (
          <div className="mb-4 p-3 rounded-lg bg-green-900/20 border border-green-500/30 text-green-200 text-sm">
            {copyMsg}
          </div>
        )}
        {/* Directory (categories) */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 items-stretch">
          {categories.map((cat, idx) => (
            <div key={idx} className="glass nv-glass--inner-hairline border border-white/10 rounded-xl p-4 h-full flex flex-col">
              <h3 className="text-white mb-1 font-medium">{cat.title}</h3>
              <p className="text-gray-300 text-sm mb-3">{cat.description}</p>
              <button
                onClick={() => { alert('Coming soon'); }}
                className="mt-auto w-full bg-[#c19658] text-black px-4 py-2 rounded-lg hover:opacity-90 text-sm font-medium"
              >
                Explore
              </button>
            </div>
          ))}
        </div>
        {/* Institutional partners (within Explore) */}
        <div className="mt-10">
          <h3 className="trajan-text text-xl md:text-2xl text-white mb-4">Institutional partners</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 items-stretch">
            {institutional.map((item, idx) => (
              <div key={idx} className="glass nv-glass--inner-hairline border border-white/10 rounded-xl p-4 h-full flex flex-col">
                <h3 className="text-white mb-1 font-medium">{item.title}</h3>
                <p className="text-gray-300 text-sm mb-3">{item.description}</p>
                <button
                  onClick={() => { alert('Coming soon'); }}
                  className="mt-auto w-full bg-[#c19658] text-black px-4 py-2 rounded-lg hover:opacity-90 text-sm font-medium"
                >
                  Explore
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Reassurance at a glance */}
      <div className="glass nv-glass--inner-hairline border border-white/10 rounded-2xl p-6 md:p-10 mb-8">
        <h2 className="trajan-text text-2xl md:text-3xl text-white mb-6">Reassurance at a glance</h2>
        <ul className="space-y-2 text-gray-200/95">
          <li><span className="text-white font-medium">Privacy:</span> Nirvana does not share your personal information with organisations. Reporting is cohort-level only.</li>
          <li><span className="text-white font-medium">Neutrality:</span> Trust Codes do not influence eligibility, results, or ranking.</li>
          <li><span className="text-white font-medium">Clarity:</span> The 10% discount applies to the annual membership fee. Separate invocation and operational pass-through charges, taxes, refunds, and chargebacks are excluded from the organisation’s share.</li>
          <li><span className="text-white font-medium">Simplicity:</span> One code per Member. You may add or change your code any time before your first successful paid subscription.</li>
        </ul>
      </div>

      

      {/* FAQ */}
      <FaqSection />

      {/* Compliance strip */}
      <div className="glass nv-glass--inner-hairline border border-white/10 rounded-2xl p-6 md:p-10 mt-8">
        <p className="text-gray-300 text-sm">
          Nirvana is a neutral search network. Outputs are impersonal analytics and do not constitute advice, a recommendation, portfolio management, or an offer to transact. Identical inputs on the same data snapshot produce identical outputs. Values may change when data snapshots update. Trust Codes do not affect eligibility, results, or ranking.
        </p>
        <ul className="mt-4 text-gray-400 text-xs space-y-1">
          <li>• Recipients of Nirvana’s separate 10% direct-donation pledge are selected by Nirvana at its discretion.</li>
          <li>• No personal data is shared with organisations.</li>
          <li>• One code per Member, first-touch attribution. Changes are permitted before the first successful paid subscription.</li>
        </ul>
      </div>
    </main>
  );
}

function FaqSection() {
  const [open, setOpen] = useState<Record<string, boolean>>({});
  const toggle = (q: string) => setOpen((p) => ({ ...p, [q]: !p[q] }));
  const faqs = [
    { q: 'What is a Trust Code?', a: 'A Trust Code is a unique identifier for a participating organisation. When used at checkout, it applies a 10% discount to your membership and allocates 10% of your subscription to that organisation while your membership remains active.' },
    { q: 'Do I need a code to join?', a: 'No. You can join without a code. You may add or change a code any time before your first successful paid subscription. After that point, one code remains associated with your account under a first-touch rule.' },
    { q: 'How long does support last?', a: 'Support continues while your membership remains continuously active. If a renewal fails or you pause, we hold the attribution for six months. If you resume within that period, support continues.' },
    { q: 'Does a Trust Code change my search results?', a: 'No. Trust Codes do not affect eligibility, results, or ranking. Nirvana is a neutral search network and outputs are impersonal analytics.' },
    { q: 'What information is shared with organisations?', a: 'None. Nirvana provides no personally identifiable information to organisations. Reporting is provided at cohort level only.' },
    { q: 'Where can I find a Trust Code?', a: 'Many organisations publish their code on their own website or communications. You can also browse our directory and select an organisation there.' },
    { q: 'What exactly receives the 10% support?', a: 'Nirvana remits 10% of your subscription revenue to the organisation associated with your code, subject to exclusions noted below, for as long as your membership remains active.' },
    { q: 'Can I propose an organisation as a Trust Code participant?', a: 'Yes, absolutely. Please have the organisation write to us at trustcode@nirvana.bm.' },
    { q: 'What is excluded from the 10% organisation share and from the 10% discount?', a: 'The 10% discount applies to the annual membership fee shown at checkout. The organisation’s 10% share excludes separate invocation fees and operational pass-through charges, taxes, refunds, and chargebacks.' },
    { q: 'What does “in addition” mean for Nirvana’s own donations?', a: 'Separately from Trust Code remittances, Nirvana pledges a further 10% of total consolidated revenue to charitable causes via direct donations.' },
  ];
  return (
    <div className="glass nv-glass--inner-hairline border border-white/10 rounded-2xl p-6 md:p-10 mb-8">
      <h2 className="trajan-text text-2xl md:text-3xl text-white mb-6">Frequently Asked Questions</h2>
      <div className="space-y-4">
        {faqs.map((f, i) => (
          <div key={i} className="border-b border-white/10 pb-4">
            <button className="w-full text-left flex justify-between items-center py-2 text-white hover:text-gray-200" onClick={()=>toggle(f.q)}>
              <span className="font-medium">{f.q}</span>
              <span className="text-2xl">{open[f.q] ? '−' : '+'}</span>
            </button>
            {open[f.q] && (
              <div className="mt-3 text-gray-200/95 leading-relaxed">{f.a}</div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}


