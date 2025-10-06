import React from 'react';
import HTKNavigation from './HTKNavigation';
import HTKFooter from './HTKFooter';

function TradeDashboard() {
  return (
    <div className="htk-bg-primary min-h-screen">
      <HTKNavigation />
      <div className="container mx-auto px-4 py-16">
        <h1 className="text-3xl font-bold htk-gold-text text-center mb-8">Trade Dashboard</h1>
        <p className="text-center text-htk-platinum/80">Manage your leads and grow your business</p>
      </div>
      <HTKFooter />
    </div>
  );
}

export default TradeDashboard;
