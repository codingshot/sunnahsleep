import { Link } from 'react-router-dom';
import { ArrowLeft, FileText, ExternalLink, Shield, Scale, HelpCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function Legal() {
  return (
    <div className="min-h-screen bg-gradient-night islamic-pattern">
      <div className="max-w-2xl mx-auto px-6 py-8">
        <Link to="/">
          <Button variant="ghost" className="mb-6 text-gold hover:text-gold/80">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to App
          </Button>
        </Link>

        <div className="flex items-center gap-3 mb-8">
          <div className="p-2 rounded-lg bg-gold/10">
            <FileText className="h-6 w-6 text-gold" />
          </div>
          <h1 className="text-3xl font-arabic text-gradient-gold">Legal Information</h1>
        </div>

        <div className="space-y-6">
          {/* Quick Links */}
          <div className="grid gap-4">
            <Link 
              to="/privacy"
              className="p-5 rounded-2xl bg-gradient-card border border-border hover:border-gold/30 transition-all group"
            >
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-xl bg-gold/10">
                  <Shield className="h-6 w-6 text-gold" />
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-foreground group-hover:text-gold transition-colors">
                    Privacy Policy
                  </h3>
                  <p className="text-sm text-cream-dim">
                    Learn how we protect your privacy - all data stays on your device
                  </p>
                </div>
              </div>
            </Link>

            <Link 
              to="/terms"
              className="p-5 rounded-2xl bg-gradient-card border border-border hover:border-gold/30 transition-all group"
            >
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-xl bg-gold/10">
                  <Scale className="h-6 w-6 text-gold" />
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-foreground group-hover:text-gold transition-colors">
                    Terms of Service
                  </h3>
                  <p className="text-sm text-cream-dim">
                    Terms and conditions for using SunnahSleep
                  </p>
                </div>
              </div>
            </Link>
          </div>

          {/* About Section */}
          <div className="p-6 rounded-2xl bg-gradient-card border border-border space-y-4">
            <h2 className="text-xl text-gold font-semibold">About SunnahSleep</h2>
            <p className="text-cream-dim">
              SunnahSleep is an open-source Islamic sleep companion app created by Ummah.Build 
              to help Muslims follow the Prophetic Sunnah before sleep.
            </p>
            <p className="text-cream-dim">
              This app is provided free of charge as a service to the Muslim community. 
              We believe technology should serve the Ummah while respecting privacy.
            </p>
          </div>

          {/* Key Points */}
          <div className="p-6 rounded-2xl bg-secondary/30 border border-gold/20 space-y-4">
            <h2 className="text-xl text-gold font-semibold">Key Points</h2>
            <ul className="space-y-3 text-cream-dim">
              <li className="flex items-start gap-3">
                <span className="text-gold mt-1">✓</span>
                <span><strong className="text-foreground">100% Free</strong> - No hidden costs, subscriptions, or in-app purchases</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-gold mt-1">✓</span>
                <span><strong className="text-foreground">Privacy First</strong> - All data stored locally on your device</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-gold mt-1">✓</span>
                <span><strong className="text-foreground">No Account Required</strong> - Use immediately without registration</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-gold mt-1">✓</span>
                <span><strong className="text-foreground">No Ads</strong> - Clean, distraction-free experience</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-gold mt-1">✓</span>
                <span><strong className="text-foreground">No Tracking</strong> - We don't collect analytics or usage data</span>
              </li>
            </ul>
          </div>

          {/* Credits */}
          <div className="p-6 rounded-2xl bg-gradient-card border border-border space-y-4">
            <h2 className="text-xl text-gold font-semibold">Credits & Attributions</h2>
            <ul className="space-y-2 text-cream-dim text-sm">
              <li>• Prayer times calculated using Al Adhan API (aladhan.com)</li>
              <li>• Quran recitations from Islamic Network (islamic.network)</li>
              <li>• Hadith references linked to Sunnah.com</li>
              <li>• Icons from Lucide Icons</li>
            </ul>
          </div>

          {/* Contact */}
          <div className="p-6 rounded-2xl bg-gradient-card border border-border">
            <h2 className="text-xl text-gold font-semibold mb-4">Contact & Support</h2>
            <p className="text-cream-dim mb-4">
              For questions, feedback, or support, visit:
            </p>
            <a 
              href="https://ummah.build" 
              target="_blank" 
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-gold/10 border border-gold/30 text-gold hover:bg-gold/20 transition-colors"
            >
              Ummah.Build <ExternalLink className="h-4 w-4" />
            </a>
          </div>
        </div>

        <footer className="mt-12 pt-6 border-t border-border text-center">
          <p className="text-muted-foreground text-sm">
            Made with ❤️ by{' '}
            <a href="https://ummah.build" target="_blank" rel="noopener noreferrer" className="text-gold hover:underline">
              Ummah.Build
            </a>
          </p>
        </footer>
      </div>
    </div>
  );
}
