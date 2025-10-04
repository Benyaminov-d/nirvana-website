import React from 'react';
import { Link } from 'react-router-dom';

export default function CryptoPage() {
  return (
    <div className="w-full px-3 md:px-6 py-8 md:py-10">
      <div className="max-w-[980px] mx-auto flex flex-col gap-6">
        <div className="mb-2">
          <Link to="/?fromsubpage=true" className="glass nv-glass--inner-hairline border border-white/10 rounded-lg px-3 py-2 inline-flex items-center gap-2 text-gray-200 hover:text-white">
            <span className="text-xl leading-none">←</span>
            <span className="trajan-text">Home</span>
          </Link>
        </div>
        <h1 className="trajan-text text-3xl md:text-4xl text-white text-center">Is crypto always bad?</h1>
        <p className="text-gray-200 text-center text-lg">Not necessarily. There is Krypto the Superdog.</p>

        <div className="glass nv-glass--inner-hairline border border-white/10 rounded-2xl overflow-hidden mx-auto">
          <img
            src={new URL('../assets/krypto.jpeg', import.meta.url).toString()}
            alt="Krypto the Superdog"
            className="w-full h-auto max-h-[520px] object-contain bg-black/10"
          />
        </div>

        <p className="text-gray-200 text-center text-lg">Such a good boy.</p>

        <div className="flex flex-col md:flex-row gap-3 md:gap-4 justify-center mt-2">
          <a
            role="button"
            href="/founder-statement-on-cryptocurrencies/bitcoin"
            className="glass trajan-text nv-glass--inner-hairline border border-white/10 rounded-lg px-3 py-2 inline-block text-gray-200 hover:text-white text-center"
          >
            Statement on Bitcoin
          </a>
          <a
            role="button"
            href="/founder-statement-on-cryptocurrencies/ether"
            className="glass trajan-text nv-glass--inner-hairline border border-white/10 rounded-lg px-3 py-2 inline-block text-gray-200 hover:text-white text-center"
          >
            Statement on Etherium
          </a>
          <a
            role="button"
            href="/founder-statement-on-cryptocurrencies/stablecoins"
            className="glass trajan-text nv-glass--inner-hairline border border-white/10 rounded-lg px-3 py-2 inline-block text-gray-200 hover:text-white text-center"
          >
            Statement on Stablecoins
          </a>
        </div>
      </div>
    </div>
  );
}


