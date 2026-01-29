import { Moon, Flame } from 'lucide-react';
import { NotificationsDropdown } from './NotificationsDropdown';
import { Alarm, UpcomingAlarm } from '@/hooks/useAlarms';

interface HeaderProps {
  streak: number;
  alarms?: Alarm[];
  upcomingAlarms?: UpcomingAlarm[];
  nextAlarm?: UpcomingAlarm | null;
  onToggleAlarm?: (id: string) => void;
  onDeleteAlarm?: (id: string) => void;
  notificationsEnabled?: boolean;
  onRequestNotifications?: () => Promise<boolean>;
}

export function Header({ 
  streak,
  alarms = [],
  upcomingAlarms = [],
  nextAlarm = null,
  onToggleAlarm = () => {},
  onDeleteAlarm = () => {},
  notificationsEnabled = false,
  onRequestNotifications = async () => false,
}: HeaderProps) {
  return (
    <header className="relative py-8 px-6">
      {/* Decorative glow */}
      <div className="absolute inset-0 bg-gradient-to-b from-gold/5 to-transparent pointer-events-none" />
      
      <div className="relative flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="relative">
            <Moon className="h-10 w-10 text-gold animate-pulse-slow" />
            <div className="absolute inset-0 blur-lg bg-gold/30 animate-glow" />
          </div>
          <div>
            <h1 className="text-2xl font-arabic text-gradient-gold">SunnahSleep</h1>
            <p className="text-sm text-cream-dim">Prophetic Bedtime Routine</p>
          </div>
        </div>
        
        <div className="flex items-center gap-3">
          {/* Notifications Dropdown - Top Right */}
          <NotificationsDropdown
            alarms={alarms}
            upcomingAlarms={upcomingAlarms}
            nextAlarm={nextAlarm}
            onToggleAlarm={onToggleAlarm}
            onDeleteAlarm={onDeleteAlarm}
            notificationsEnabled={notificationsEnabled}
            onRequestNotifications={onRequestNotifications}
          />
          
          {/* Streak Badge */}
          {streak > 0 && (
            <div className="flex items-center gap-2 bg-secondary/50 px-4 py-2 rounded-full border border-gold/20">
              <Flame className="h-5 w-5 text-gold" />
              <span className="font-semibold text-gold">{streak}</span>
              <span className="text-sm text-cream-dim hidden sm:inline">day streak</span>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
