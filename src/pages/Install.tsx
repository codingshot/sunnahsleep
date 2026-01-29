import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Download, Smartphone, Share, Plus, MoreVertical, Check, Moon } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function Install() {
  const [platform, setPlatform] = useState<'ios' | 'android' | 'desktop'>('desktop');
  const [isStandalone, setIsStandalone] = useState(false);

  useEffect(() => {
    // Detect platform
    const userAgent = navigator.userAgent.toLowerCase();
    if (/iphone|ipad|ipod/.test(userAgent)) {
      setPlatform('ios');
    } else if (/android/.test(userAgent)) {
      setPlatform('android');
    } else {
      setPlatform('desktop');
    }

    // Check if already installed
    const isInStandaloneMode = window.matchMedia('(display-mode: standalone)').matches ||
      (window.navigator as any).standalone === true;
    setIsStandalone(isInStandaloneMode);
  }, []);

  const IOSInstructions = () => (
    <div className="space-y-6">
      <div className="p-4 rounded-xl bg-secondary/30 border border-border">
        <h3 className="text-lg font-semibold text-foreground mb-4">Install on iPhone/iPad</h3>
        <ol className="space-y-4">
          <li className="flex items-start gap-3">
            <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gold/20 text-gold flex items-center justify-center font-bold">1</div>
            <div>
              <p className="text-foreground font-medium">Tap the Share button</p>
              <p className="text-sm text-cream-dim">Look for the <Share className="inline h-4 w-4" /> icon at the bottom of Safari</p>
            </div>
          </li>
          <li className="flex items-start gap-3">
            <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gold/20 text-gold flex items-center justify-center font-bold">2</div>
            <div>
              <p className="text-foreground font-medium">Scroll down and tap "Add to Home Screen"</p>
              <p className="text-sm text-cream-dim">Look for the <Plus className="inline h-4 w-4" /> icon</p>
            </div>
          </li>
          <li className="flex items-start gap-3">
            <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gold/20 text-gold flex items-center justify-center font-bold">3</div>
            <div>
              <p className="text-foreground font-medium">Tap "Add"</p>
              <p className="text-sm text-cream-dim">SunnahSleep will now appear on your home screen</p>
            </div>
          </li>
        </ol>
      </div>

      <div className="p-4 rounded-xl bg-gold/10 border border-gold/30">
        <p className="text-sm text-cream-dim">
          <strong className="text-gold">Note:</strong> You must use Safari to install the app on iOS. If you're using Chrome or another browser, open this page in Safari first.
        </p>
      </div>
    </div>
  );

  const AndroidInstructions = () => (
    <div className="space-y-6">
      <div className="p-4 rounded-xl bg-secondary/30 border border-border">
        <h3 className="text-lg font-semibold text-foreground mb-4">Install on Android</h3>
        <ol className="space-y-4">
          <li className="flex items-start gap-3">
            <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gold/20 text-gold flex items-center justify-center font-bold">1</div>
            <div>
              <p className="text-foreground font-medium">Tap the menu button</p>
              <p className="text-sm text-cream-dim">Look for the <MoreVertical className="inline h-4 w-4" /> three dots in Chrome</p>
            </div>
          </li>
          <li className="flex items-start gap-3">
            <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gold/20 text-gold flex items-center justify-center font-bold">2</div>
            <div>
              <p className="text-foreground font-medium">Tap "Install app" or "Add to Home screen"</p>
              <p className="text-sm text-cream-dim">You may see a prompt at the bottom of the screen</p>
            </div>
          </li>
          <li className="flex items-start gap-3">
            <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gold/20 text-gold flex items-center justify-center font-bold">3</div>
            <div>
              <p className="text-foreground font-medium">Confirm the installation</p>
              <p className="text-sm text-cream-dim">SunnahSleep will now appear on your home screen</p>
            </div>
          </li>
        </ol>
      </div>

      <div className="p-4 rounded-xl bg-gold/10 border border-gold/30">
        <p className="text-sm text-cream-dim">
          <strong className="text-gold">Tip:</strong> If you see an "Install" banner at the bottom of the screen, you can tap it directly to install.
        </p>
      </div>
    </div>
  );

  const DesktopInstructions = () => (
    <div className="space-y-6">
      <div className="p-4 rounded-xl bg-secondary/30 border border-border">
        <h3 className="text-lg font-semibold text-foreground mb-4">Install on Desktop</h3>
        <ol className="space-y-4">
          <li className="flex items-start gap-3">
            <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gold/20 text-gold flex items-center justify-center font-bold">1</div>
            <div>
              <p className="text-foreground font-medium">Look for the install icon in your address bar</p>
              <p className="text-sm text-cream-dim">In Chrome, look for a <Download className="inline h-4 w-4" /> icon on the right side</p>
            </div>
          </li>
          <li className="flex items-start gap-3">
            <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gold/20 text-gold flex items-center justify-center font-bold">2</div>
            <div>
              <p className="text-foreground font-medium">Click "Install"</p>
              <p className="text-sm text-cream-dim">A prompt will ask you to confirm</p>
            </div>
          </li>
          <li className="flex items-start gap-3">
            <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gold/20 text-gold flex items-center justify-center font-bold">3</div>
            <div>
              <p className="text-foreground font-medium">Launch from your applications</p>
              <p className="text-sm text-cream-dim">SunnahSleep will open in its own window</p>
            </div>
          </li>
        </ol>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-night islamic-pattern">
      <div className="max-w-lg mx-auto px-6 py-8">
        <Link to="/">
          <Button variant="ghost" className="mb-6 text-gold hover:text-gold/80">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to App
          </Button>
        </Link>

        <div className="flex items-center gap-3 mb-8">
          <div className="p-3 rounded-xl bg-gold/10">
            <Moon className="h-8 w-8 text-gold" />
          </div>
          <div>
            <h1 className="text-2xl font-semibold text-foreground">Install SunnahSleep</h1>
            <p className="text-sm text-cream-dim">Add to your home screen</p>
          </div>
        </div>

        {isStandalone ? (
          <div className="p-6 rounded-2xl bg-gold/10 border border-gold/30 text-center">
            <div className="w-16 h-16 rounded-full bg-gold/20 flex items-center justify-center mx-auto mb-4">
              <Check className="h-8 w-8 text-gold" />
            </div>
            <h2 className="text-xl font-semibold text-gold mb-2">Already Installed!</h2>
            <p className="text-cream-dim">
              You're already using SunnahSleep as an installed app. Enjoy your blessed sleep routine!
            </p>
          </div>
        ) : (
          <>
            {/* Benefits */}
            <div className="p-5 rounded-2xl bg-gradient-card border border-border mb-6">
              <h2 className="text-lg font-semibold text-gold mb-4">Why Install?</h2>
              <ul className="space-y-3">
                <li className="flex items-center gap-3 text-cream-dim">
                  <Check className="h-5 w-5 text-gold flex-shrink-0" />
                  <span>Quick access from your home screen</span>
                </li>
                <li className="flex items-center gap-3 text-cream-dim">
                  <Check className="h-5 w-5 text-gold flex-shrink-0" />
                  <span>Works offline - no internet needed</span>
                </li>
                <li className="flex items-center gap-3 text-cream-dim">
                  <Check className="h-5 w-5 text-gold flex-shrink-0" />
                  <span>Full-screen experience like a native app</span>
                </li>
                <li className="flex items-center gap-3 text-cream-dim">
                  <Check className="h-5 w-5 text-gold flex-shrink-0" />
                  <span>Receive alarm notifications</span>
                </li>
              </ul>
            </div>

            {/* Platform-specific instructions */}
            {platform === 'ios' && <IOSInstructions />}
            {platform === 'android' && <AndroidInstructions />}
            {platform === 'desktop' && <DesktopInstructions />}

            {/* Platform switcher */}
            <div className="mt-6 text-center">
              <p className="text-sm text-muted-foreground mb-2">Showing instructions for:</p>
              <div className="flex justify-center gap-2">
                <Button
                  variant={platform === 'ios' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setPlatform('ios')}
                  className={platform === 'ios' ? 'bg-gold text-midnight' : 'border-gold/30 text-gold'}
                >
                  iPhone
                </Button>
                <Button
                  variant={platform === 'android' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setPlatform('android')}
                  className={platform === 'android' ? 'bg-gold text-midnight' : 'border-gold/30 text-gold'}
                >
                  Android
                </Button>
                <Button
                  variant={platform === 'desktop' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setPlatform('desktop')}
                  className={platform === 'desktop' ? 'bg-gold text-midnight' : 'border-gold/30 text-gold'}
                >
                  Desktop
                </Button>
              </div>
            </div>
          </>
        )}

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
