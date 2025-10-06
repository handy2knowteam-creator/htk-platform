import React from 'react';
import HTKNavigation from './HTKNavigation';
import HTKFooter from './HTKFooter';

function SignupPage() {
  return (
    <div className="htk-bg-primary min-h-screen">
      <HTKNavigation />
      <div className="container mx-auto px-4 py-16">
        <h1 className="text-3xl font-bold htk-gold-text text-center mb-8">Sign Up</h1>
        <p className="text-center text-htk-platinum/80">Join the HTK community.</p>
      </div>
      <HTKFooter />
    </div>
  );
}

export default SignupPage;
