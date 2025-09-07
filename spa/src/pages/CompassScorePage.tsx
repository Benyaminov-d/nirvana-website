import HtmlContent from '../components/HtmlContent';

export default function CompassScorePage() {
  return (
    <main className="glass max-w-5xl mx-auto px-4 py-6 md:mt-12">
      <HtmlContent
        src="/static/html/compass_score/compass_score.html"
        baseHref="/static/html/compass_score/"
        title="The Compass Score"
      />
    </main>
  );
}



