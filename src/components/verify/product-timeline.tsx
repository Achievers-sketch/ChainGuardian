import type { SupplyChainEvent } from '@/lib/types';
import { format } from 'date-fns';

type ProductTimelineProps = {
  events: SupplyChainEvent[];
};

export default function ProductTimeline({ events }: ProductTimelineProps) {
  return (
    <div className="relative pl-6">
      {/* Vertical line */}
      <div className="absolute left-9 top-0 h-full w-0.5 bg-border -translate-x-1/2"></div>
      
      <div className="space-y-8">
        {events.map((event, index) => (
          <div key={index} className="flex items-start gap-4">
            <div className="relative z-10 flex h-6 w-6 items-center justify-center rounded-full bg-primary text-primary-foreground">
              <event.icon className="h-4 w-4" />
            </div>
            <div className="flex-1 pt-0.5">
              <p className="font-semibold">{event.status}</p>
              <p className="text-sm text-muted-foreground">{event.handler} - {event.location}</p>
              <time className="text-xs text-muted-foreground">
                {format(new Date(event.timestamp), 'PPP p')}
              </time>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
