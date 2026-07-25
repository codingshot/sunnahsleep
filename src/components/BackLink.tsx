import { Link, useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { cn } from '@/lib/utils';

interface BackLinkProps {
  fallbackTo: string;
  label: string;
  className?: string;
}

/**
 * Prefer in-app history when available; otherwise go to fallbackTo.
 * Avoids navigate(-1) sending users off-site after external referrers.
 */
export function BackLink({ fallbackTo, label, className }: BackLinkProps) {
  const navigate = useNavigate();

  return (
    <Link
      to={fallbackTo}
      onClick={(e) => {
        // history.length > 1 is unreliable cross-browser; use React Router index when present
        const idx = (window.history.state as { idx?: number } | null)?.idx;
        if (typeof idx === 'number' && idx > 0) {
          e.preventDefault();
          navigate(-1);
        }
      }}
      className={cn(
        'inline-flex items-center gap-2 text-gold hover:text-gold/80 transition-colors text-sm',
        className,
      )}
    >
      <ArrowLeft className="h-4 w-4" />
      {label}
    </Link>
  );
}
