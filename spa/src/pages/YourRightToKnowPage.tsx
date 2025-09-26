import PdfContent from '../components/PdfContent';

export default function YourRightToKnowPage() {
  return (
    <main className="glass max-w-5xl mx-auto px-4 py-6 md:mt-12">
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


