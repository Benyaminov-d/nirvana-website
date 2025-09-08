import HtmlContent from '../components/HtmlContent';
import { useState, useEffect } from 'react';

export default function WhatIsThisAllAboutPage() {
  const [audioReady, setAudioReady] = useState(false);

  // Wait for component to mount before rendering audio to ensure DOM is ready
  useEffect(() => {
    setAudioReady(true);
  }, []);
  
  return (
    <main className="glass max-w-5xl mx-auto px-4 py-6 md:mt-12">
      <h2 className="text-center pt-[32pt] mb-8">
        <span className="trajan-text text-2xl md:text-3xl">What is this all about – message from the founder</span>
      </h2>
      
      {audioReady && (
        <div className="w-full flex justify-center mb-12">
          <audio 
            controls 
            className="w-full max-w-xl"
            controlsList="nodownload"
            preload="auto"
          >
            <source src="/static/audio/what_is_this_all_about.mp3" type="audio/mp4" />
            Your browser does not support the audio element.
          </audio>
        </div>
      )}
      
      <HtmlContent
        src="/static/html/what_is_this_all_about/what_is_this_all_about.html"
        baseHref="/static/html/what_is_this_all_about/"
        title="What is this all about - message from the founder"
      />
    </main>
  );
}
