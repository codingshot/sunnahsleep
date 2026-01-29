import { useState, useEffect } from 'react';
import { Clock } from 'lucide-react';
import { cn } from '@/lib/utils';

interface CountdownTimerProps {
  targetTime: string; // HH:MM format
  label?: string;
  className?: string;
  showIcon?: boolean;
}

export function CountdownTimer({ targetTime, label, className, showIcon = true }: CountdownTimerProps) {
  const [timeRemaining, setTimeRemaining] = useState<string>('');
  const [isPast, setIsPast] = useState(false);

  useEffect(() => {
    const calculateRemaining = () => {
      const now = new Date();
      const [hours, minutes] = targetTime.split(':').map(Number);
      
      const target = new Date();
      target.setHours(hours, minutes, 0, 0);
      
      // If target time is earlier than now, it's for tomorrow
      if (target <= now) {
        target.setDate(target.getDate() + 1);
      }
      
      const diff = target.getTime() - now.getTime();
      
      if (diff <= 0) {
        setIsPast(true);
        setTimeRemaining('Now');
        return;
      }
      
      setIsPast(false);
      
      const hoursRemaining = Math.floor(diff / (1000 * 60 * 60));
      const minutesRemaining = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      
      if (hoursRemaining > 0) {
        setTimeRemaining(`${hoursRemaining}h ${minutesRemaining}m`);
      } else {
        setTimeRemaining(`${minutesRemaining}m`);
      }
    };

    calculateRemaining();
    const interval = setInterval(calculateRemaining, 1000 * 30); // Update every 30 seconds

    return () => clearInterval(interval);
  }, [targetTime]);

  return (
    <span className={cn(
      "inline-flex items-center gap-1 text-xs",
      isPast ? "text-primary" : "text-gold/80",
      className
    )}>
      {showIcon && <Clock className="h-3 w-3" />}
      {label && <span className="text-muted-foreground">{label}</span>}
      <span className="font-medium">{timeRemaining}</span>
    </span>
  );
}
