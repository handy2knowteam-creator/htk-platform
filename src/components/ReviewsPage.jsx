import React, { useState } from 'react';
import HTKNavigation from './HTKNavigation';
import HTKFooter from './HTKFooter';

function ReviewsPage() {
  const [reviews, setReviews] = useState([
    {
      id: 1,
      customerName: "Sarah M.",
      tradeName: "Mike's Plumbing Services",
      rating: 5,
      comment: "Excellent work on our bathroom renovation. Professional, punctual, and great value.",
      jobType: "Bathroom Installation",
      date: "2024-09-15",
      verified: true
    },
    {
      id: 2,
      customerName: "John D.",
      tradeName: "Elite Electrical",
      rating: 5,
      comment: "Outstanding electrical work. Rewired our entire house efficiently and safely.",
      jobType: "House Rewiring",
      date: "2024-09-10",
      verified: true
    },
    {
      id: 3,
      customerName: "Emma L.",
      tradeName: "Precision Carpentry",
      rating: 4,
      comment: "Beautiful custom kitchen cabinets. Attention to detail was impressive.",
      jobType: "Kitchen Carpentry",
      date: "2024-09-05",
      verified: true
    },
  ]);

  return (
    <div className="htk-bg-primary min-h-screen">
      <HTKNavigation />
      <div className="container mx-auto px-4 py-16">
        <h1 className="text-3xl font-bold htk-gold-text text-center mb-8">Customer Reviews</h1>
        <p className="text-center text-htk-platinum/80">See what our customers say about our tradespeople.</p>
        <div className="mt-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {reviews.map((review) => (
            <div key={review.id} className="htk-card p-6">
              <div className="flex items-center mb-4">
                {[...Array(review.rating)].map((_, i) => (
                  <svg key={i} className="w-5 h-5 text-htk-gold fill-current" viewBox="0 0 24 24">
                    <path d="M12 .587l3.668 7.568 8.332 1.151-6.064 5.828 1.48 8.279L12 18.896l-7.416 3.817 1.48-8.279L0 9.306l8.332-1.151L12 .587z"/>
                  </svg>
                ))}
                <span className="ml-2 text-htk-platinum/80 text-sm">{review.rating}.0 Stars</span>
              </div>
              <p className="text-htk-platinum/90 mb-4">"{review.comment}"</p>
              <p className="text-htk-platinum/70 text-sm">- {review.customerName} (Job: {review.jobType})</p>
              <p className="text-htk-platinum/50 text-xs">{review.date}</p>
            </div>
          ))}
        </div>
      </div>
      <HTKFooter />
    </div>
  );
}

export default ReviewsPage;
