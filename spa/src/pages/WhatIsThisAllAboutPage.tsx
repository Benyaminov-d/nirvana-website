import HtmlContent from '../components/HtmlContent';
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

export default function WhatIsThisAllAboutPage() {
  const [audioReady, setAudioReady] = useState(false);

  // Wait for component to mount before rendering audio to ensure DOM is ready
  useEffect(() => {
    setAudioReady(true);
  }, []);
  
  return (
    <main className="glass max-w-5xl mx-auto px-4 py-6 md:mt-12">
      <div className="mb-4">
        <Link to="/?fromsubpage=true" className="glass nv-glass--inner-hairline border border-white/10 rounded-lg px-3 py-2 inline-flex items-center gap-2 text-gray-200 hover:text-white">
          <span className="text-xl leading-none">←</span>
          <span className="trajan-text">Home</span>
        </Link>
      </div>
      <h2 className="text-center pt-[32pt] mb-16">
        <div className="trajan-text text-2xl md:text-3xl">Messages from the founder</div>
        {/* <div className="trajan-text text-2xl md:text-3xl">a message from the founder</div> */}
      </h2>
      
      {audioReady && (
        <div>
          <div className="w-full text-center flex flex-col justify-center mt-6 mb-20">
            <audio 
              controls 
              className="w-full max-w-xl mx-auto"
              controlsList="nodownload"
              preload="metadata"
              playsInline
            >
              <source src="/static/audio/what_is_this_all_about.mp3" type="audio/mpeg" />
              Your browser does not support the audio element.
            </audio>
            <div className='block mb-4'>
              <p>What is this all about</p>
            </div>
          </div>

          <div className="w-full text-center flex flex-col justify-center mt-6 mb-20">
            <audio 
              controls 
              className="w-full max-w-xl mx-auto"
              controlsList="nodownload"
              preload="metadata"
              playsInline
            >
              <source src="/static/audio/on_earnestness.mp3" type="audio/mpeg" />
              Your browser does not support the audio element.
            </audio>
            <div className='block mb-4'>
              <p>On earnestness</p>
            </div>
          </div>
          
          <div className='max-w-[560px] mx-auto'>
            <video 
              controls 
              className="w-full rounded-lg"
              controlsList="nodownload"
              preload="metadata"
              poster="/static/video/arman_video_thumbnail.jpg"
              playsInline
            >
              <source src="/static/video/arman_video.mp4" type="video/mp4" />
              Your browser does not support the video tag.
            </video>
          </div>
        </div>
      )}
      
      {/* <HtmlContent
        src="/static/html/what_is_this_all_about/what_is_this_all_about.html"
        baseHref="/static/html/what_is_this_all_about/"
        title="What is this all about - message from the founder"
      /> */}
    </main>
  );
}
