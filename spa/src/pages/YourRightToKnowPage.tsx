import PdfContent from '../components/PdfContent';
import { Link } from 'react-router-dom';

export default function YourRightToKnowPage() {
  return (
    <main className="glass max-w-5xl mx-auto px-4 py-6 md:mt-12">
      <div className="mb-4">
        <Link to="/" className="glass nv-glass--inner-hairline border border-white/10 rounded-lg px-3 py-2 inline-flex items-center gap-2 text-gray-200 hover:text-white">
          <span className="text-xl leading-none">←</span>
          <span className="trajan-text">Home</span>
        </Link>
      </div>
      {/* <h1 className="trajan-text text-2xl md:text-3xl text-center mb-8 text-white">Your right to know</h1> */}
      <PdfContent
        src={new URL("/static/pdf/NirvanaRetailFacing.pdf", import.meta.url).toString()}
        className="w-full"
        pageGapPx={12}
        title="Your right to know"
      />
    </main>
  );
}


