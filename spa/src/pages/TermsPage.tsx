import HtmlContent from '../components/HtmlContent';

export default function TermsPage() {
  return (
    <main className="glass max-w-5xl mx-auto px-4 py-6 md:mt-12">
      <HtmlContent
        src="/static/html/public_terms_of_use/public_terms_of_use.html"
        baseHref="/static/html/public_terms_of_use/"
        title="Public Terms of Use"
      />
    </main>
  );
}


