import React from 'react';
import HTKNavigation from './HTKNavigation';
import HTKFooter from './HTKFooter';

function CustomerDashboard() {
  return (
    <div className="htk-bg-primary min-h-screen">
      <HTKNavigation />
      <div className="container mx-auto px-4 py-16">
        <h1 className="text-3xl font-bold htk-gold-text text-center mb-8">Customer Dashboard</h1>
        <p className="text-center text-htk-platinum/80">Manage your jobs and find tradespeople</p>
      </div>
      <HTKFooter />
    </div>
  );
}

export default CustomerDashboard;
