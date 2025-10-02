import React, { lazy, Suspense } from 'react'

// Lazy load the signup components
const CustomerSignup = lazy(() => import('../CustomerSignup.jsx'))
const TradeSignup = lazy(() => import('../TradeSignup.jsx'))

// Loading component
const LoadingSpinner = () => (
  <div className="htk-bg-primary min-h-screen flex items-center justify-center">
    <div className="text-htk-gold">Loading...</div>
  </div>
)

// Wrapper components with Suspense
export const CustomerSignupWrapper = () => (
  <Suspense fallback={<LoadingSpinner />}>
    <CustomerSignup />
  </Suspense>
)

export const TradeSignupWrapper = () => (
  <Suspense fallback={<LoadingSpinner />}>
    <TradeSignup />
  </Suspense>
)
