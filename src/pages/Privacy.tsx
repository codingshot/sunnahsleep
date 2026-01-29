import { Link } from 'react-router-dom';
import { Moon, ArrowLeft, Shield, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function Privacy() {
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
            <Shield className="h-6 w-6 text-gold" />
          </div>
          <h1 className="text-3xl font-arabic text-gradient-gold">Privacy Policy</h1>
        </div>

        <div className="space-y-6 text-cream-dim">
          <p className="text-sm text-muted-foreground">Last updated: January 2026</p>

          <section className="space-y-3">
            <h2 className="text-xl text-gold font-semibold">Our Commitment to Privacy</h2>
            <p>
              SunnahSleep is built with your privacy as our top priority. We believe that your spiritual 
              journey and personal data should remain completely private.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl text-gold font-semibold">No Data Collection</h2>
            <p>
              <strong className="text-foreground">We do not collect, store, or transmit any of your personal data.</strong> 
              All information you enter into SunnahSleep stays on your device and is never sent to any server.
            </p>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li>Your checklist progress is stored only in your browser's local storage</li>
              <li>Your sleep tracking data remains on your device</li>
              <li>Your prayer times and alarm settings are stored locally</li>
              <li>Your location data (if provided) is only used to calculate prayer times and is not transmitted</li>
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl text-gold font-semibold">Local Storage Only</h2>
            <p>
              SunnahSleep uses your browser's localStorage and IndexedDB to save your preferences 
              and progress. This means:
            </p>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li>Your data stays on your device</li>
              <li>No account creation is required</li>
              <li>No cloud sync means no data leaves your device</li>
              <li>Clearing your browser data will reset the app</li>
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl text-gold font-semibold">External Services</h2>
            <p>
              We use minimal external services, solely for functionality:
            </p>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li><strong>Prayer Times API (aladhan.com):</strong> To calculate accurate prayer times based on your location. Only coordinates are sent, no personal identifiers.</li>
              <li><strong>IP Geolocation (optional):</strong> To auto-detect your approximate location for prayer times. You can override this with manual location entry.</li>
              <li><strong>Quran Audio (islamic.network):</strong> For Quran recitation audio files.</li>
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl text-gold font-semibold">No Tracking or Analytics</h2>
            <p>
              We do not use any tracking pixels, analytics tools, or advertising networks. 
              Your usage of SunnahSleep is completely private.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl text-gold font-semibold">Your Rights</h2>
            <p>
              Since all data is stored locally on your device, you have complete control:
            </p>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li>Clear your browser's localStorage to delete all app data</li>
              <li>Use your browser's privacy/incognito mode for temporary sessions</li>
              <li>Export your data using browser developer tools if needed</li>
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl text-gold font-semibold">Contact</h2>
            <p>
              For questions about this privacy policy, contact us at:
            </p>
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
