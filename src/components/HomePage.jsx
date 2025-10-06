import React from 'react';

function HomePage() {
  return (
    <div className="htk-bg-primary">
      <div className="container mx-auto px-4 py-16">
        <div className="text-center">
          <h1 className="text-5xl font-bold htk-gold-text mb-4">Built by Trades, for Trades</h1>
          <p className="text-xl text-htk-platinum/80 mb-8">The premium community-first platform connecting skilled professionals with customers. Fair pricing. Quality connections. Community profit sharing.</p>
          <div>
            <a href="/trades" className="htk-button-primary mr-4">Find Premium Tradespeople</a>
            <a href="/trade-signup" className="htk-button-secondary">Join as Professional Trade</a>
          </div>
        </div>
      </div>
    </div>
  );
}

export default HomePage;
