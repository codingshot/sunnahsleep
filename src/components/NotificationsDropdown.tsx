import { useState } from 'react';
import { Bell, BellOff, Clock, Trash2, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { cn } from '@/lib/utils';
import { Alarm, UpcomingAlarm } from '@/hooks/useAlarms';

interface NotificationsDropdownProps {
  alarms: Alarm[];
  upcomingAlarms: UpcomingAlarm[];
  nextAlarm: UpcomingAlarm | null;
  onToggleAlarm: (id: string) => void;
  onDeleteAlarm: (id: string) => void;
  notificationsEnabled: boolean;
  onRequestNotifications: () => Promise<boolean>;
}

export function NotificationsDropdown({
  alarms,
  upcomingAlarms,
  nextAlarm,
  onToggleAlarm,
  onDeleteAlarm,
  notificationsEnabled,
  onRequestNotifications,
}: NotificationsDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  
  const enabledAlarmsCount = alarms.filter(a => a.enabled).length;
  
  const formatTime = (time: string) => {
    const [hours, minutes] = time.split(':').map(Number);
    const date = new Date();
    date.setHours(hours, minutes);
    return date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true });
  };

  const getAlarmIcon = (type: Alarm['type']) => {
    switch (type) {
      case 'fajr':
      case 'isha':
        return '🕌';
      case 'tahajjud':
        return '🌙';
      case 'fajr-before':
        return '⏰';
      default:
        return '🔔';
    }
  };

  return (
    <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
      <DropdownMenuTrigger asChild>
        <Button 
          variant="ghost" 
          size="icon" 
          className="relative h-9 w-9 rounded-full bg-secondary/50 hover:bg-secondary border border-border"
          aria-label={`Alarms and notifications${enabledAlarmsCount > 0 ? ` (${enabledAlarmsCount} active)` : ''}`}
        >
          <Bell className="h-4 w-4 text-gold" />
          {enabledAlarmsCount > 0 && (
            <span className="absolute -top-0.5 -right-0.5 h-4 w-4 rounded-full bg-gold text-[10px] font-bold text-midnight flex items-center justify-center">
              {enabledAlarmsCount}
            </span>
          )}
        </Button>
      </DropdownMenuTrigger>
      
      <DropdownMenuContent 
        align="end" 
        className="w-72 bg-midnight border-border shadow-xl"
        sideOffset={8}
      >
        <DropdownMenuLabel className="flex items-center justify-between">
          <span className="text-foreground">Alarms & Notifications</span>
          {!notificationsEnabled && (
            <button
              onClick={onRequestNotifications}
              className="text-xs text-gold hover:text-gold/80 transition-colors"
              aria-label="Enable browser notifications"
            >
              Enable
            </button>
          )}
        </DropdownMenuLabel>
        
        <DropdownMenuSeparator className="bg-border" />
        
        {/* Next Alarm Highlight */}
        {nextAlarm && (
          <div className="px-2 py-2">
            <div className="p-3 rounded-lg bg-gold/10 border border-gold/20">
              <div className="flex items-center gap-2 mb-1">
                <Clock className="h-3.5 w-3.5 text-gold" />
                <span className="text-xs text-gold uppercase tracking-wide">Next Alarm</span>
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-foreground">
                    {getAlarmIcon(nextAlarm.alarm.type)} {nextAlarm.alarm.name}
                  </p>
                  <p className="text-xs text-cream-dim">
                    {nextAlarm.dayName} at {formatTime(nextAlarm.timeString)}
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
        
        {/* Upcoming Alarms List */}
        {upcomingAlarms.length > 1 && (
          <>
            <DropdownMenuSeparator className="bg-border" />
            <DropdownMenuLabel className="text-xs text-muted-foreground">
              Upcoming ({upcomingAlarms.length - 1} more)
            </DropdownMenuLabel>
            <div className="max-h-48 overflow-y-auto">
              {upcomingAlarms.slice(1, 5).map((upcoming, idx) => (
                <DropdownMenuItem
                  key={`${upcoming.alarm.id}-${idx}`}
                  className="flex items-center justify-between py-2 cursor-default focus:bg-secondary/50"
                >
                  <div className="flex items-center gap-2">
                    <span className="text-sm">{getAlarmIcon(upcoming.alarm.type)}</span>
                    <div>
                      <p className="text-sm text-foreground">{upcoming.alarm.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {upcoming.dayName} • {formatTime(upcoming.timeString)}
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onToggleAlarm(upcoming.alarm.id);
                    }}
                    className={cn(
                      "p-1 rounded hover:bg-secondary transition-colors",
                      upcoming.alarm.enabled ? "text-gold" : "text-muted-foreground"
                    )}
                    aria-label={upcoming.alarm.enabled ? `Disable ${upcoming.alarm.name} alarm` : `Enable ${upcoming.alarm.name} alarm`}
                  >
                    {upcoming.alarm.enabled ? (
                      <Bell className="h-3.5 w-3.5" />
                    ) : (
                      <BellOff className="h-3.5 w-3.5" />
                    )}
                  </button>
                </DropdownMenuItem>
              ))}
            </div>
          </>
        )}
        
        {/* All Alarms */}
        {alarms.length > 0 && (
          <>
            <DropdownMenuSeparator className="bg-border" />
            <DropdownMenuLabel className="text-xs text-muted-foreground">
              All Alarms ({alarms.length})
            </DropdownMenuLabel>
            <div className="max-h-36 overflow-y-auto">
              {alarms.map((alarm) => (
                <DropdownMenuItem
                  key={alarm.id}
                  className="flex items-center justify-between py-2 cursor-default focus:bg-secondary/50"
                >
                  <div className="flex items-center gap-2">
                    <span className="text-sm">{getAlarmIcon(alarm.type)}</span>
                    <div>
                      <p className={cn(
                        "text-sm",
                        alarm.enabled ? "text-foreground" : "text-muted-foreground line-through"
                      )}>
                        {alarm.name}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {formatTime(alarm.time)}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-1">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onToggleAlarm(alarm.id);
                      }}
                      className={cn(
                        "p-1 rounded hover:bg-secondary transition-colors",
                        alarm.enabled ? "text-gold" : "text-muted-foreground"
                      )}
                      aria-label={alarm.enabled ? `Disable ${alarm.name} alarm` : `Enable ${alarm.name} alarm`}
                    >
                      {alarm.enabled ? (
                        <Bell className="h-3.5 w-3.5" />
                      ) : (
                        <BellOff className="h-3.5 w-3.5" />
                      )}
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onDeleteAlarm(alarm.id);
                      }}
                      className="p-1 rounded text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors"
                      aria-label={`Delete ${alarm.name} alarm`}
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </DropdownMenuItem>
              ))}
            </div>
          </>
        )}
        
        {/* Empty State */}
        {alarms.length === 0 && (
          <div className="px-4 py-6 text-center">
            <Bell className="h-8 w-8 text-muted-foreground mx-auto mb-2 opacity-50" />
            <p className="text-sm text-muted-foreground">No alarms set</p>
            <p className="text-xs text-muted-foreground mt-1">
              Add alarms from the Alarms section
            </p>
          </div>
        )}
        
        <DropdownMenuSeparator className="bg-border" />
        
        {/* Notification Status */}
        <div className="px-3 py-2 flex items-center justify-between">
          <span className="text-xs text-muted-foreground">
            Notifications {notificationsEnabled ? 'enabled' : 'disabled'}
          </span>
          <span className={cn(
            "h-2 w-2 rounded-full",
            notificationsEnabled ? "bg-emerald-500" : "bg-muted-foreground"
          )} />
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
