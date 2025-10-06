import React from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card.jsx';
import { Button } from '@/components/ui/button.jsx';
import { ArrowLeft } from 'lucide-react';

function TermsOfService() {
  return (
    <div className="htk-bg-primary min-h-screen">
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto">
          <div className="mb-8">
            <Link to="/">
              <Button variant="ghost" className="htk-button-ghost mb-4">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Home
              </Button>
            </Link>
            <h1 className="text-4xl md:text-5xl font-bold htk-gold-text mb-4">
              Terms of Service
            </h1>
            <p className="text-xl text-htk-platinum/80">
              Last updated: October 6, 2024
            </p>
          </div>

          <Card className="htk-card mb-8">
            <CardContent className="p-8">
              <div className="prose prose-invert max-w-none">
                <section className="mb-8">
                  <h2 className="text-2xl font-bold htk-gold-text mb-4">1. Agreement to Terms</h2>
                  <p className="text-htk-platinum/90 mb-4">
                    By accessing and using HandyToKnow ("HTK", "we", "us", "our"), you accept and agree to be bound by the terms and provision of this agreement. If you do not agree to abide by the above, please do not use this service.
                  </p>
                </section>

                <section className="mb-8">
                  <h2 className="text-2xl font-bold htk-gold-text mb-4">2. Platform Description</h2>
                  <p className="text-htk-platinum/90 mb-4">
                    HTK is a premium platform connecting skilled tradespeople with customers seeking quality services. We operate on a credit-based system with no commission fees for completed work.
                  </p>
                </section>

                <section className="mb-8">
                  <h2 className="text-2xl font-bold htk-gold-text mb-4">3. User Accounts</h2>
                  <div className="text-htk-platinum/90 space-y-4">
                    <p>
                      <strong>Registration:</strong> Users must provide accurate, current, and complete information during registration.
                    </p>
                    <p>
                      <strong>Account Security:</strong> Users are responsible for maintaining the confidentiality of their account credentials.
                    </p>
                    <p>
                      <strong>Verification:</strong> Tradespeople must complete our verification process including ID checks and certification validation.
                    </p>
                  </div>
                </section>

                <section className="mb-8">
                  <h2 className="text-2xl font-bold htk-gold-text mb-4">4. Credit System</h2>
                  <div className="text-htk-platinum/90 space-y-4">
                    <p>
                      <strong>Credits Never Expire:</strong> All purchased credits remain valid indefinitely.
                    </p>
                    <p>
                      <strong>Refund Policy:</strong> Credits are non-refundable once purchased, but unused credits retain their value permanently.
                    </p>
                    <p>
                      <strong>Usage:</strong> Credits are used to access customer leads and premium features.
                    </p>
                  </div>
                </section>

                <section className="mb-8">
                  <h2 className="text-2xl font-bold htk-gold-text mb-4">5. No Commission Policy</h2>
                  <p className="text-htk-platinum/90 mb-4">
                    HTK does not charge commission fees on completed work. Tradespeople keep 100% of their earnings from jobs secured through our platform.
                  </p>
                </section>

                <section className="mb-8">
                  <h2 className="text-2xl font-bold htk-gold-text mb-4">6. Quality Guarantee</h2>
                  <p className="text-htk-platinum/90 mb-4">
                    While we verify all tradespeople and maintain quality standards, the contractual relationship for work is directly between customers and tradespeople. HTK facilitates connections but is not party to work contracts.
                  </p>
                </section>

                <section className="mb-8">
                  <h2 className="text-2xl font-bold htk-gold-text mb-4">7. Prohibited Conduct</h2>
                  <div className="text-htk-platinum/90 space-y-2">
                    <p>• Providing false or misleading information</p>
                    <p>• Attempting to circumvent our verification processes</p>
                    <p>• Harassment or inappropriate behavior toward other users</p>
                    <p>• Using the platform for illegal activities</p>
                    <p>• Attempting to damage or disrupt the platform</p>
                  </div>
                </section>

                <section className="mb-8">
                  <h2 className="text-2xl font-bold htk-gold-text mb-4">8. Limitation of Liability</h2>
                  <p className="text-htk-platinum/90 mb-4">
                    HTK's liability is limited to the amount paid by the user for our services. We are not liable for indirect, incidental, or consequential damages arising from platform use.
                  </p>
                </section>

                <section className="mb-8">
                  <h2 className="text-2xl font-bold htk-gold-text mb-4">9. Privacy</h2>
                  <p className="text-htk-platinum/90 mb-4">
                    Your privacy is important to us. Please review our Privacy Policy, which also governs your use of the platform.
                  </p>
                </section>

                <section className="mb-8">
                  <h2 className="text-2xl font-bold htk-gold-text mb-4">10. Changes to Terms</h2>
                  <p className="text-htk-platinum/90 mb-4">
                    We reserve the right to modify these terms at any time. Users will be notified of significant changes via email or platform notification.
                  </p>
                </section>

                <section className="mb-8">
                  <h2 className="text-2xl font-bold htk-gold-text mb-4">11. Contact Information</h2>
                  <div className="text-htk-platinum/90 space-y-2">
                    <p>Email: handy2knowteam@gmail.com</p>
                    <p>Phone: +44 7123 456 789</p>
                    <p>Address: HandyToKnow Ltd, UK</p>
                  </div>
                </section>
              </div>
            </CardContent>
          </Card>

          <div className="text-center">
            <Link to="/">
              <Button className="htk-button-primary">
                Return to Home
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default TermsOfService;
