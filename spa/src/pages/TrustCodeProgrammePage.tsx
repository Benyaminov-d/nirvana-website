import { useState } from 'react';
import { postJSON } from '../services/http';

export default function TrustCodeProgrammePage() {
  const [formData, setFormData] = useState({
    organizationName: '',
    website: '',
    country: '',
    vertical: '',
    audienceSize: '',
    contactName: '',
    email: '',
    timeframe: '',
    acknowledgeTerms: false
  });

  const [showFaq, setShowFaq] = useState<Record<string, boolean>>({});
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');
  const [submitMessage, setSubmitMessage] = useState<string>('');

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (submitStatus === 'submitting') return;
    
    setSubmitStatus('submitting');
    setSubmitMessage('');
    
    try {
      const response = await postJSON('/contact/trust-code-request', formData) as { success: boolean; message?: string };
      
      if (response.success) {
        setSubmitStatus('success');
        setSubmitMessage(response.message || 'Thank you for your interest! We will be in touch soon.');
        
        // Clear form on success
        setFormData({
          organizationName: '',
          website: '',
          country: '',
          vertical: '',
          audienceSize: '',
          contactName: '',
          email: '',
          timeframe: '',
          acknowledgeTerms: false
        });
      } else {
        throw new Error(response.message || 'Submission failed');
      }
    } catch (error: any) {
      console.error('Form submission error:', error);
      setSubmitStatus('error');
      setSubmitMessage(error.message || 'An error occurred. Please try again later.');
    }
  };

  const toggleFaq = (question: string) => {
    setShowFaq(prev => ({ ...prev, [question]: !prev[question] }));
  };

  const verticals = [
    'Charities, NGOs & non-profits',
    'Financial institutions',
    'Registered investment advisers (referral channel)',
    'RIA self-use (seat licence)',
    'Credit card networks and issuers',
    'Insurers',
    'Enterprise retailers',
    'Creators and publishers',
    'Associations & membership organisations',
    'Private equity & conglomerates',
    'Faith-based organisations'
  ];

  const onePagers = [
    { title: 'Indigenous Nations & Communities', filename: 'Indigenous_Nations_and_Communities_Nirvana_Trust_Code_programme.pdf' },
    { title: 'Charities, NGOs & non-profits', filename: 'Charities_NGOs_and_non_profits_Nirvana_Trust_Code_programme.pdf' },
    { title: 'Foundations', filename: 'Foundations - Nirvana Trust Code programme_compressed.pdf' },
    { title: 'Associations', filename: 'Associations - Nirvana Trust Code Programme.pdf' },
    { title: 'Faith-based Organisations', filename: 'Faith-based Organisations - Nirvana Trust Code Programme.pdf' },
    { title: 'Enterprise Retailers', filename: 'Enterprise  Retailers - Nirvana Trust Code Programme.pdf' },
    { title: 'Credit Card Networks', filename: 'Credit Card Networks - Nirvana Trust Code Programme.pdf' },
    { title: 'Financial Institutions', filename: 'Financial Institutions - Nirvana Trust Code Programme.pdf' },
    { title: 'RIA self-use plan (seat licence)', filename: 'Investment Advisers self-use plan (seat licence).pdf' },
    { title: 'RIA Referral Channel', filename: 'Investment_Advisers_Referral_Channel_Nirvana_Trust_Code_Programme.pdf' },
    { title: 'Private equity and conglomerates', filename: 'Conglomerates_and_Private_Equity_Nirvana_Trust_Code_Programme.pdf' },
    { title: 'Insurers', filename: 'Insurers One - Nirvana Trust Code Programme.pdf' },
    { title: 'Creators & publishers', filename: 'Creators and Publishers - Nirvana Trust Code Programme.pdf' }
  ];

  const faqs = [
    {
      question: 'What do partners earn and for how long?',
      answer: 'Partners earn 10% of each attributed Member\'s net subscription payments for five years from that Member\'s first paid subscription using the code.'
    },
    {
      question: 'What does the Member receive?',
      answer: 'A 10% subscription discount when subscribing with your code.'
    },
    {
      question: 'What is excluded from the revenue share?',
      answer: 'The scope is subscription revenue. Your deck and one-pagers specify the share is "10% of the monthly subscription fee for five years" and show subscription-only economics.'
    },
    {
      question: 'Is there any onboarding, servicing, or data handling required of the partner?',
      answer: 'No onboarding or servicing is required. We provide cohort-level reporting only; there is no PII transfer to partners.'
    },
    {
      question: 'Does a Trust Code influence search results or scores?',
      answer: 'No. Codes do not affect the Nirvana Standard gate or the Compass Score ordering. Neutrality is a core principle of the programme.'
    },
    {
      question: 'Can a Member switch codes later?',
      answer: 'Attribution is single-touch and locks at first paid subscription for five years.'
    },
    {
      question: 'How are payouts calculated and settled?',
      answer: 'Payouts are calculated on net collected subscription revenue for the prior month (after refunds/chargebacks/taxes) and settled monthly.'
    },
    {
      question: 'Can institutions pursue exclusivity?',
      answer: 'Operation Causeway supports performance-based exclusivity constructs at the country level on a 3+2 cycle. The Trust Code economics remain the same 10%/10% single tier.'
    },
    {
      question: 'What about RIAs that wish to use Nirvana directly with clients?',
      answer: 'RIAs may purchase seat licences at USD 569 per client per year, billed annually. When the RIA pays centrally, Trust Code payouts and discounts do not apply to those seats.'
    },
    {
      question: 'What is the customer billing model?',
      answer: 'Annual billing in advance via Nirvana\'s Merchant-of-Record. Partners receive monthly revenue-share statements.'
    }
  ];

  return (
    <main className="max-w-5xl mx-auto px-4 py-8 md:py-12">
      {/* Hero Section */}
      <div className="glass nv-glass--inner-hairline border border-white/10 rounded-2xl p-6 md:p-10 mb-8">
        <header className="text-center mb-8">
          <h1 className="trajan-text text-4xl md:text-5xl text-white mb-4">Trust Code programme</h1>
          <p className="text-xl md:text-2xl text-gray-200 mb-8">
            Publish your Trust Code and earn 10% of our subscription revenue for each subscriber who chooses your Code.
          </p>
          <div className="flex flex-col md:flex-row gap-4 justify-center">
            <button
              onClick={() => document.getElementById('lead-form')?.scrollIntoView({ behavior: 'smooth' })}
              className="bg-[#c19658] text-black px-8 py-3 rounded-xl hover:opacity-90 font-medium"
            >
              Request a Trust Code
            </button>
            <button
              onClick={() => document.getElementById('downloads')?.scrollIntoView({ behavior: 'smooth' })}
              className="glass nv-glass--inner-hairline border border-white/10 rounded-xl px-8 py-3 text-gray-200 hover:text-white"
            >
              Download your one-pager
            </button>
          </div>
        </header>
      </div>

      {/* What it is Section */}
      <div className="glass nv-glass--inner-hairline border border-white/10 rounded-2xl p-6 md:p-10 mb-8">
        <h2 className="trajan-text text-2xl md:text-3xl text-white mb-6">What it is</h2>
        <div className="text-gray-200/95 leading-relaxed space-y-4">
          <p>
            The Trust Code programme is Nirvana's universal, single-tier partner model. When someone subscribes using your Trust Code, they receive a 10% discount on the Nirvana subscription and you receive 10% of their net subscription payments for five years. There is no onboarding or servicing burden for you, and reporting is cohort-level only. Search outputs remain neutral, impersonal analytics.
          </p>
          
          <div className="mt-8">
            <h3 className="text-xl text-white mb-4 font-medium">Economics at a glance</h3>
            <ul className="space-y-2 text-gray-200/95">
              <li>• List price: USD 569 per Member per year (billed annually in advance)</li>
              <li>• Member with Trust Code: 10% off</li>
              <li>• Partner share: 10% of net subscription revenue for five years per first-touch Member</li>
              <li>• Scope: subscription revenue only</li>
              <li>• Example annual flows shown in your materials at 50,000 to 2,000,000 active Members.</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Who it is for Section */}
      <div className="glass nv-glass--inner-hairline border border-white/10 rounded-2xl p-6 md:p-10 mb-8">
        <h2 className="trajan-text text-2xl md:text-3xl text-white mb-6">Who it is for — choose your one-pager</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-gray-200/95">
          <div className="space-y-3">
            <p><strong>Indigenous Nations & Communities</strong> – download the Nations one-pager.</p>
            <p><strong>Charities, NGOs & non-profits</strong> – download the causes one-pager.</p>
            <p><strong>Foundations</strong> – download the foundations one-pager.</p>
            <p><strong>Associations & membership organisations</strong> – download associations one-pager.</p>
            <p><strong>Faith-based organisations</strong> – download the faith-based one-pager.</p>
            <p><strong>Enterprise retailers</strong> – download retailer one-pager.</p>
            <p><strong>Credit card networks and issuers</strong> – Operation Causeway one-pager.</p>
          </div>
          <div className="space-y-3">
            <p><strong>Financial institutions</strong> – banks, credit unions, and other FIs – download the FI one-pager.</p>
            <p><strong>RIA self-use (seat licence)</strong> – terms for adviser-paid client seats; separate from Trust Code payouts when the RIA pays centrally.</p>
            <p><strong>Registered investment advisers (referral channel)</strong> – download the RIA referral one-pager.</p>
            <p><strong>Private equity & conglomerates</strong> – portfolio-company distribution model.</p>
            <p><strong>Insurers</strong> – download insurer one-pager.</p>
            <p><strong>Creators and publishers</strong> – download creators one-pager.</p>
          </div>
        </div>
      </div>

      {/* How it works Section */}
      <div className="glass nv-glass--inner-hairline border border-white/10 rounded-2xl p-6 md:p-10 mb-8">
        <h2 className="trajan-text text-2xl md:text-3xl text-white mb-6">How it works</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center">
            <div className="w-12 h-12 bg-[#c19658] rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-black font-bold text-xl">1</span>
            </div>
            <h3 className="text-xl text-white mb-3">Request your Trust Code</h3>
            <p className="text-gray-200/95">Complete a short form. We issue your unique code.</p>
          </div>
          <div className="text-center">
            <div className="w-12 h-12 bg-[#c19658] rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-black font-bold text-xl">2</span>
            </div>
            <h3 className="text-xl text-white mb-3">Share your code</h3>
            <p className="text-gray-200/95">Place it in emails, apps, statements, or websites.</p>
          </div>
          <div className="text-center">
            <div className="w-12 h-12 bg-[#c19658] rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-black font-bold text-xl">3</span>
            </div>
            <h3 className="text-xl text-white mb-3">Receive monthly payouts</h3>
            <p className="text-gray-200/95">We handle billing, support, and cohort-level reporting.</p>
          </div>
        </div>
      </div>

      {/* Compliance and neutrality Section */}
      <div className="glass nv-glass--inner-hairline border border-white/10 rounded-2xl p-6 md:p-10 mb-8">
        <h2 className="trajan-text text-2xl md:text-3xl text-white mb-6">Compliance and neutrality</h2>
        <p className="text-gray-200/95 leading-relaxed">
          Nirvana is a neutral search network. Outputs are impersonal analytics and do not constitute advice, a recommendation, portfolio management, or an offer to transact. Codes never affect eligibility or ranking. There is no transfer of PII to partners; reporting is cohort-level; optional read-only endpoints are customer-initiated and sit outside critical outsourcing perimeters.
        </p>
      </div>

      {/* Downloads Section */}
      <div id="downloads" className="glass nv-glass--inner-hairline border border-white/10 rounded-2xl p-6 md:p-10 mb-8">
        <h2 className="trajan-text text-2xl md:text-3xl text-white mb-6">Downloads by vertical</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {onePagers.map((pager, index) => (
            <div key={index} className="glass nv-glass--inner-hairline border border-white/10 rounded-xl p-4 hover:border-white/20 transition-colors">
              <h3 className="text-white mb-2 font-medium">{pager.title}</h3>
              <p className="text-gray-300 text-sm mb-3">Nirvana Trust Code Programme</p>
              <a 
                href={`/static/pdf/${encodeURIComponent(pager.filename)}`}
                download={pager.filename}
                className="w-full bg-[#c19658] text-black px-4 py-2 rounded-lg hover:opacity-90 text-sm font-medium inline-block text-center"
              >
                Download PDF
              </a>
            </div>
          ))}
        </div>
      </div>

      {/* FAQ Section */}
      <div className="glass nv-glass--inner-hairline border border-white/10 rounded-2xl p-6 md:p-10 mb-8">
        <h2 className="trajan-text text-2xl md:text-3xl text-white mb-6">Frequently Asked Questions</h2>
        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <div key={index} className="border-b border-white/10 pb-4">
              <button
                className="w-full text-left flex justify-between items-center py-2 text-white hover:text-gray-200"
                onClick={() => toggleFaq(faq.question)}
              >
                <span className="font-medium">{faq.question}</span>
                <span className="text-2xl transform transition-transform">
                  {showFaq[faq.question] ? '−' : '+'}
                </span>
              </button>
              {showFaq[faq.question] && (
                <div className="mt-3 text-gray-200/95 leading-relaxed">
                  {faq.answer}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Lead Form Section */}
      <div id="lead-form" className="glass nv-glass--inner-hairline border border-white/10 rounded-2xl p-6 md:p-10">
        <h2 className="trajan-text text-2xl md:text-3xl text-white mb-6">Request your Trust Code</h2>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-white mb-2" htmlFor="organizationName">
                Organisation name *
              </label>
              <input
                type="text"
                id="organizationName"
                name="organizationName"
                value={formData.organizationName}
                onChange={handleInputChange}
                required
                className="w-full bg-black/20 border border-white/20 rounded-lg px-4 py-3 text-white placeholder:text-gray-400 focus:border-white/40 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-white mb-2" htmlFor="website">
                Website *
              </label>
              <input
                type="url"
                id="website"
                name="website"
                value={formData.website}
                onChange={handleInputChange}
                required
                className="w-full bg-black/20 border border-white/20 rounded-lg px-4 py-3 text-white placeholder:text-gray-400 focus:border-white/40 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-white mb-2" htmlFor="country">
                Country *
              </label>
              <input
                type="text"
                id="country"
                name="country"
                value={formData.country}
                onChange={handleInputChange}
                required
                className="w-full bg-black/20 border border-white/20 rounded-lg px-4 py-3 text-white placeholder:text-gray-400 focus:border-white/40 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-white mb-2" htmlFor="vertical">
                Vertical *
              </label>
              <select
                id="vertical"
                name="vertical"
                value={formData.vertical}
                onChange={handleInputChange}
                required
                className="w-full bg-black/20 border border-white/20 rounded-lg px-4 py-3 text-white focus:border-white/40 focus:outline-none"
              >
                <option value="">Select vertical</option>
                {verticals.map((vertical, index) => (
                  <option key={index} value={vertical} className="bg-black text-white">
                    {vertical}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-white mb-2" htmlFor="audienceSize">
                Audience size band *
              </label>
              <select
                id="audienceSize"
                name="audienceSize"
                value={formData.audienceSize}
                onChange={handleInputChange}
                required
                className="w-full bg-black/20 border border-white/20 rounded-lg px-4 py-3 text-white focus:border-white/40 focus:outline-none"
              >
                <option value="">Select size band</option>
                <option value="0-10,000" className="bg-black text-white">0-10,000</option>
                <option value="10,000-50,000" className="bg-black text-white">10,000-50,000</option>
                <option value="50,000-250,000" className="bg-black text-white">50,000-250,000</option>
                <option value="250,000-1,000,000" className="bg-black text-white">250,000-1,000,000</option>
                <option value="1,000,000+" className="bg-black text-white">1,000,000+</option>
              </select>
            </div>
            <div>
              <label className="block text-white mb-2" htmlFor="contactName">
                Contact name *
              </label>
              <input
                type="text"
                id="contactName"
                name="contactName"
                value={formData.contactName}
                onChange={handleInputChange}
                required
                className="w-full bg-black/20 border border-white/20 rounded-lg px-4 py-3 text-white placeholder:text-gray-400 focus:border-white/40 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-white mb-2" htmlFor="email">
                Email *
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                required
                className="w-full bg-black/20 border border-white/20 rounded-lg px-4 py-3 text-white placeholder:text-gray-400 focus:border-white/40 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-white mb-2" htmlFor="timeframe">
                Preferred go-live timeframe *
              </label>
              <select
                id="timeframe"
                name="timeframe"
                value={formData.timeframe}
                onChange={handleInputChange}
                required
                className="w-full bg-black/20 border border-white/20 rounded-lg px-4 py-3 text-white focus:border-white/40 focus:outline-none"
              >
                <option value="">Select timeframe</option>
                <option value="Immediately" className="bg-black text-white">Immediately</option>
                <option value="Within 1 month" className="bg-black text-white">Within 1 month</option>
                <option value="Within 3 months" className="bg-black text-white">Within 3 months</option>
                <option value="Within 6 months" className="bg-black text-white">Within 6 months</option>
                <option value="Within 1 year" className="bg-black text-white">Within 1 year</option>
                <option value="Exploring options" className="bg-black text-white">Exploring options</option>
              </select>
            </div>
          </div>
          
          <div className="flex items-start space-x-3">
            <input
              type="checkbox"
              id="acknowledgeTerms"
              name="acknowledgeTerms"
              checked={formData.acknowledgeTerms}
              onChange={handleInputChange}
              required
              className="mt-1 w-4 h-4 text-[#c19658] bg-black/20 border-white/20 rounded focus:ring-[#c19658] focus:ring-2"
            />
            <label htmlFor="acknowledgeTerms" className="text-gray-200 text-sm">
              I acknowledge programme terms and search-neutrality policy *
            </label>
          </div>

          <button
            type="submit"
            disabled={submitStatus === 'submitting'}
            className="w-full md:w-auto bg-[#c19658] text-black px-8 py-3 rounded-xl hover:opacity-90 font-medium disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {submitStatus === 'submitting' ? 'Submitting...' : 'Submit Request'}
          </button>
          
          {/* Status Messages */}
          {submitMessage && (
            <div className={`mt-4 p-4 rounded-lg ${
              submitStatus === 'success' 
                ? 'bg-green-900/20 border border-green-500/30 text-green-200' 
                : submitStatus === 'error'
                ? 'bg-red-900/20 border border-red-500/30 text-red-200'
                : 'bg-gray-900/20 border border-gray-500/30 text-gray-200'
            }`}>
              {submitMessage}
            </div>
          )}
        </form>
      </div>
    </main>
  );
}
