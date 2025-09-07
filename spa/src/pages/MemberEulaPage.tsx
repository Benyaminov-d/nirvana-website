import HtmlContent from '../components/HtmlContent';

export default function MemberEulaPage() {
  return (
    <main className="glass max-w-5xl mx-auto px-4 py-6">
      <HtmlContent 
        src="/static/html/member_eula/member_eula.html" 
        baseHref="/static/html/member_eula/" 
        title="Nirvana Member EULA"
      />
    </main>
  );
}



