import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button.jsx';
import HTKNavigation from './HTKNavigation';
import HTKFooter from './HTKFooter';

function NotFoundPage() {
  return (
    <div className="htk-bg-primary min-h-screen flex flex-col">
      <HTKNavigation />
      <main className="flex-grow flex flex-col items-center justify-center text-center px-4 py-16">
        <h1 className="text-6xl md:text-8xl font-bold htk-gold-text mb-4">404</h1>
        <h2 className="text-3xl md:text-4xl font-bold text-htk-platinum mb-6">
          Page Not Found
        </h2>
        <p className="text-xl text-htk-platinum/80 mb-8 max-w-xl">
          Oops! The page you are looking for might have been removed, had its name changed, or is temporarily unavailable.
        </p>
        <Link to="/">
          <Button className="htk-button-primary text-lg px-8 py-4">
            Go to Homepage
          </Button>
        </Link>
      </main>
      <HTKFooter />
    </div>
  );
}

export default NotFoundPage;

