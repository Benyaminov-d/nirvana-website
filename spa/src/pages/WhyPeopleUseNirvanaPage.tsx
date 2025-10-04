import HtmlContent from '../components/HtmlContent';
import { Link } from 'react-router-dom';

export default function WhyPeopleUseNirvanaPage() {
  return (
    <main className="glass max-w-5xl mx-auto px-4 py-6 md:mt-12">
      <div className="mb-4">
        <Link to="/?fromsubpage=true" className="glass nv-glass--inner-hairline border border-white/10 rounded-lg px-3 py-2 inline-flex items-center gap-2 text-gray-200 hover:text-white">
          <span className="text-xl leading-none">←</span>
          <span className="trajan-text">Home</span>
        </Link>
      </div>
      <HtmlContent
        src="/static/html/why_people_use_nirvana/why_people_use_nirvana.html"
        baseHref="/static/html/why_people_use_nirvana/"
        title="Why people use Nirvana"
      />
    </main>
  );
}



