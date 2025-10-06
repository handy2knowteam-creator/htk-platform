
import React from 'react';
import { Link } from 'react-router-dom';

function HTKFooter() {
  return (
    <footer className="htk-bg-secondary text-htk-platinum py-8 mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-xl font-bold htk-gold-text mb-4">Handy 2 Know</h3>
            <p className="text-sm">The premium community-first platform connecting skilled professionals with customers. Fair pricing. Quality connections. Community profit sharing.</p>
          </div>
          <div>
            <h3 className="text-xl font-bold htk-gold-text mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li><Link to="/how-it-works" className="text-htk-platinum hover:text-htk-gold">How It Works</Link></li>
              <li><Link to="/pricing" className="text-htk-platinum hover:text-htk-gold">Pricing</Link></li>
              <li><Link to="/trades" className="text-htk-platinum hover:text-htk-gold">Find a Tradesperson</Link></li>
              <li><Link to="/post" className="text-htk-platinum hover:text-htk-gold">Post a Job</Link></li>
              <li><Link to="/community" className="text-htk-platinum hover:text-htk-gold">Community</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="text-xl font-bold htk-gold-text mb-4">Contact Us</h3>
            <p className="text-sm">Email: <a href="mailto:handy2knowteam@gmail.com" className="text-htk-platinum hover:text-htk-gold">handy2knowteam@gmail.com</a></p>
            <p className="text-sm mt-2">© 2025 Handy 2 Know Platform. Live on handy2know.com</p>
          </div>
        </div>
        <div className="border-t border-htk-platinum/20 mt-8 pt-8 text-center text-sm text-htk-platinum/60">
          <p>By using this site, you agree to our <Link to="/terms" className="hover:text-htk-gold">Terms of Service</Link> and <Link to="/privacy" className="hover:text-htk-gold">Privacy Policy</Link>.</p>
        </div>
      </div>
    </footer>
  );
}

export default HTKFooter;

