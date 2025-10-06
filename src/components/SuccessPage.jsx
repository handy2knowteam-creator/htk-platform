import React from 'react';
import { useLocation } from 'react-router-dom';
import HTKNavigation from './HTKNavigation';
import HTKFooter from './HTKFooter';

function SuccessPage() {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const type = queryParams.get('type');
  const plan = queryParams.get('plan');

  let title = 'Submission Successful!';
  let message = 'Thank you for your submission. We will process your request shortly.';

  if (type === 'customer') {
    title = 'Job Request Submitted!';
    message = 'Thank you for your job request. We\'ll connect you with verified tradespeople soon.';
  } else if (type === 'trade') {
    title = 'Trade Registration Complete!';
    message = `Thank you for registering as a trade with the ${plan} plan. Welcome to the HTK community!`;
  }

  return (
    <div className="htk-bg-primary min-h-screen">
      <HTKNavigation />
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-2xl mx-auto text-center">
          <h1 className="text-4xl font-bold htk-gold-text mb-4">{title}</h1>
          <p className="text-htk-platinum/80 text-lg mb-8">{message}</p>
          <p className="text-htk-platinum/60">You can close this page or navigate back to the home page.</p>
          <a href="/" className="mt-8 inline-block htk-button-primary">Go to Home</a>
        </div>
      </div>
      <HTKFooter />
    </div>
  );
}

export default SuccessPage;

