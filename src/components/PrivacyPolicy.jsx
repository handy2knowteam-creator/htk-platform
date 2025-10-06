import React from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card.jsx';
import { Button } from '@/components/ui/button.jsx';
import { ArrowLeft } from 'lucide-react';

function PrivacyPolicy() {
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
              Privacy Policy
            </h1>
            <p className="text-xl text-htk-platinum/80">
              Last updated: October 6, 2024
            </p>
          </div>

          <Card className="htk-card mb-8">
            <CardContent className="p-8">
              <div className="prose prose-invert max-w-none">
                <section className="mb-8">
                  <h2 className="text-2xl font-bold htk-gold-text mb-4">1. Information We Collect</h2>
                  <div className="text-htk-platinum/90 space-y-4">
                    <p>
                      <strong>Personal Information:</strong> Name, email address, phone number, postal address, and payment information.
                    </p>
                    <p>
                      <strong>Professional Information:</strong> For tradespeople - business details, certifications, insurance information, and work samples.
                    </p>
                    <p>
                      <strong>Usage Information:</strong> How you interact with our platform, including pages visited and features used.
                    </p>
                  </div>
                </section>

                <section className="mb-8">
                  <h2 className="text-2xl font-bold htk-gold-text mb-4">2. How We Use Your Information</h2>
                  <div className="text-htk-platinum/90 space-y-2">
                    <p>• To provide and improve our platform services</p>
                    <p>• To connect customers with suitable tradespeople</p>
                    <p>• To process payments and manage subscriptions</p>
                    <p>• To verify tradesperson credentials and maintain quality standards</p>
                    <p>• To send important updates and communications</p>
                    <p>• To comply with legal obligations</p>
                  </div>
                </section>

                <section className="mb-8">
                  <h2 className="text-2xl font-bold htk-gold-text mb-4">3. Information Sharing</h2>
                  <div className="text-htk-platinum/90 space-y-4">
                    <p>
                      <strong>With Other Users:</strong> We share relevant contact and professional information to facilitate connections between customers and tradespeople.
                    </p>
                    <p>
                      <strong>Service Providers:</strong> We work with trusted third parties for payment processing, email services, and data storage.
                    </p>
                    <p>
                      <strong>Legal Requirements:</strong> We may disclose information when required by law or to protect our rights and users.
                    </p>
                  </div>
                </section>

                <section className="mb-8">
                  <h2 className="text-2xl font-bold htk-gold-text mb-4">4. Data Security</h2>
                  <p className="text-htk-platinum/90 mb-4">
                    We implement appropriate technical and organizational measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction.
                  </p>
                </section>

                <section className="mb-8">
                  <h2 className="text-2xl font-bold htk-gold-text mb-4">5. Data Retention</h2>
                  <p className="text-htk-platinum/90 mb-4">
                    We retain personal information for as long as necessary to provide our services and comply with legal obligations. You may request deletion of your account and associated data at any time.
                  </p>
                </section>

                <section className="mb-8">
                  <h2 className="text-2xl font-bold htk-gold-text mb-4">6. Your Rights</h2>
                  <div className="text-htk-platinum/90 space-y-2">
                    <p>• Access your personal information</p>
                    <p>• Correct inaccurate information</p>
                    <p>• Request deletion of your data</p>
                    <p>• Object to processing of your information</p>
                    <p>• Data portability</p>
                    <p>• Withdraw consent where applicable</p>
                  </div>
                </section>

                <section className="mb-8">
                  <h2 className="text-2xl font-bold htk-gold-text mb-4">7. Cookies and Tracking</h2>
                  <p className="text-htk-platinum/90 mb-4">
                    We use cookies and similar technologies to improve your experience, analyze usage, and provide personalized content. You can control cookie preferences through your browser settings.
                  </p>
                </section>

                <section className="mb-8">
                  <h2 className="text-2xl font-bold htk-gold-text mb-4">8. Third-Party Services</h2>
                  <div className="text-htk-platinum/90 space-y-2">
                    <p>• Stripe for payment processing</p>
                    <p>• Google Sheets for data management</p>
                    <p>• Email service providers for communications</p>
                  </div>
                </section>

                <section className="mb-8">
                  <h2 className="text-2xl font-bold htk-gold-text mb-4">9. Children's Privacy</h2>
                  <p className="text-htk-platinum/90 mb-4">
                    Our services are not intended for individuals under 18 years of age. We do not knowingly collect personal information from children.
                  </p>
                </section>

                <section className="mb-8">
                  <h2 className="text-2xl font-bold htk-gold-text mb-4">10. Changes to This Policy</h2>
                  <p className="text-htk-platinum/90 mb-4">
                    We may update this privacy policy from time to time. We will notify you of any material changes via email or platform notification.
                  </p>
                </section>

                <section className="mb-8">
                  <h2 className="text-2xl font-bold htk-gold-text mb-4">11. Contact Us</h2>
                  <div className="text-htk-platinum/90 space-y-2">
                    <p>For privacy-related questions or requests:</p>
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

export default PrivacyPolicy;
