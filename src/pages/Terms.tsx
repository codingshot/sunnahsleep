import { Link } from 'react-router-dom';
import { Moon, ArrowLeft, Scale, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function Terms() {
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
            <Scale className="h-6 w-6 text-gold" />
          </div>
          <h1 className="text-3xl font-arabic text-gradient-gold">Terms of Service</h1>
        </div>

        <div className="space-y-6 text-cream-dim">
          <p className="text-sm text-muted-foreground">Last updated: January 2026</p>

          <section className="space-y-3">
            <h2 className="text-xl text-gold font-semibold">Acceptance of Terms</h2>
            <p>
              By using SunnahSleep, you agree to these terms. If you do not agree, please do not use the app.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl text-gold font-semibold">Description of Service</h2>
            <p>
              SunnahSleep is a free Islamic sleep companion application that helps Muslims follow the 
              Prophetic Sunnah before sleep. The app includes:
            </p>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li>Bedtime checklist based on authentic Hadith</li>
              <li>Tasbih counter for bedtime dhikr</li>
              <li>Quran recitation and duas</li>
              <li>Sleep tracking features</li>
              <li>Prayer time calculations and alarms</li>
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl text-gold font-semibold">Free to Use</h2>
            <p>
              SunnahSleep is provided free of charge. We do not require payment, subscriptions, 
              or account creation.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl text-gold font-semibold">Religious Content Disclaimer</h2>
            <p>
              The Islamic content in this app (Quran verses, Hadith, duas) is sourced from authentic 
              references. However:
            </p>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li>We recommend verifying religious practices with qualified scholars</li>
              <li>Prayer time calculations are based on standard algorithms and may vary slightly from local mosques</li>
              <li>This app is a tool to assist worship, not a replacement for religious education</li>
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl text-gold font-semibold">Alarm Disclaimer</h2>
            <p>
              While we strive to provide reliable alarm functionality:
            </p>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li>Alarms depend on browser/device permissions and may not work if the browser is closed</li>
              <li>We recommend using a backup alarm for critical wake times like Fajr</li>
              <li>Battery saving modes may affect alarm reliability</li>
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl text-gold font-semibold">No Warranty</h2>
            <p>
              SunnahSleep is provided "as is" without warranty of any kind. We do not guarantee 
              uninterrupted service or that the app will meet all your requirements.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl text-gold font-semibold">Intellectual Property</h2>
            <p>
              The app design, code, and original content are the property of Ummah.Build. 
              Quran text and recitations are from public domain sources.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl text-gold font-semibold">Changes to Terms</h2>
            <p>
              We may update these terms from time to time. Continued use of the app constitutes 
              acceptance of updated terms.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl text-gold font-semibold">Contact</h2>
            <a 
              href="https://ummah.build" 
              target="_blank" 
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-gold hover:text-gold/80 transition-colors"
            >
              Ummah.Build <ExternalLink className="h-4 w-4" />
            </a>
          </section>
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
