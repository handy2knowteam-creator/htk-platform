import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button.jsx';

function ComingSoon({ pageName = 'This Page' }) {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4">
      <h1 className="text-4xl md:text-5xl font-bold htk-gold-text mb-4">
        {pageName} Coming Soon!
      </h1>
      <p className="text-xl text-htk-platinum/80 mb-8 max-w-2xl">
        We're working hard to bring you this feature. Please check back later for updates.
      </p>
      <Link to="/">
        <Button className="htk-button-primary text-lg px-8 py-4">
          Back to Home
        </Button>
      </Link>
    </div>
  );
}

export default ComingSoon;

