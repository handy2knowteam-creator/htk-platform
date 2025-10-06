import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card.jsx';
import { AlertCircle } from 'lucide-react';

function FormUnavailable({ formName = "Form" }) {
  return (
    <div className="container mx-auto px-4 py-16">
      <div className="max-w-md mx-auto">
        <Card className="htk-card text-center">
          <CardHeader>
            <div className="flex justify-center mb-4">
              <AlertCircle className="w-12 h-12 text-htk-gold" />
            </div>
            <CardTitle className="text-2xl htk-gold-text">
              {formName} Temporarily Unavailable
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-htk-platinum/80 mb-6">
              We're currently setting up our backend systems. This feature will be available soon.
            </p>
            <p className="text-sm text-htk-platinum/60">
              Thank you for your patience as we build something amazing for the trade community.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export default FormUnavailable;
