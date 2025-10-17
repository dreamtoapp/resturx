import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { RefreshCcw, Target } from "lucide-react";
import { AutoLocationRowProps, LocationProgress } from './types';

// Enhanced accuracy display function
const getAccuracyDisplay = (accuracy: number) => {
  if (accuracy <= 3) return { text: 'دقة ممتازة', color: 'text-green-500', icon: '🎯', bgColor: 'bg-green-500/20', borderColor: 'border-green-500/30' };
  if (accuracy <= 8) return { text: 'دقة جيدة', color: 'text-green-400', icon: '📍', bgColor: 'bg-green-400/20', borderColor: 'border-green-400/30' };
  if (accuracy <= 15) return { text: 'دقة مقبولة', color: 'text-yellow-500', icon: '📌', bgColor: 'bg-yellow-500/20', borderColor: 'border-yellow-500/30' };
  if (accuracy <= 25) return { text: 'دقة ضعيفة', color: 'text-orange-500', icon: '⚠️', bgColor: 'bg-orange-500/20', borderColor: 'border-orange-500/30' };
  return { text: 'دقة غير موثوقة', color: 'text-red-500', icon: '❌', bgColor: 'bg-red-500/20', borderColor: 'border-red-500/30' };
};

// Location progress loader component
const LocationProgressLoader = ({ progress }: { progress: LocationProgress }) => (
  <div className="flex items-center gap-3 p-3 bg-muted/30 rounded-lg border border-border/50">
    <div className="flex items-center gap-2">
      <div className="w-5 h-5 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
      <span className="text-sm text-primary font-medium">
        جاري البحث عن أفضل موقع...
      </span>
    </div>
    <div className="flex items-center gap-2">
      <Badge variant="outline" className="text-xs">
        المحاولة {progress.attempts}/3
      </Badge>
      <Badge variant="secondary" className="text-xs">
        ±{progress.accuracy.toFixed(1)}م
      </Badge>
    </div>
  </div>
);

// Auto Location Row Component
export const AutoLocationRow = ({ userLocation, onRecenter, locationProgress, inline }: AutoLocationRowProps) => {
  if (!userLocation && !locationProgress) return null;

  // Show loader while searching for location
  if (locationProgress?.isSearching) {
    return (
      <div className={`${inline ? 'flex items-center justify-start gap-3 border-none m-0 p-0' : `mb-4`}`}>
        <LocationProgressLoader progress={locationProgress} />
      </div>
    );
  }

  // Show location when found
  if (userLocation) {
    const accuracyDisplay = getAccuracyDisplay(userLocation.accuracy || 0);

    return (
      <div className={`${inline ? ' flex items-center justify-start gap-3 border-none m-0 p-0' : `mb-4`}`}>
        <div className="w-full p-4 bg-card rounded-lg border border-border/50 shadow-sm">
          <div className="flex items-start justify-between gap-4">
            {/* Left side - Location info */}
            <div className="flex items-start gap-3 flex-1">
              <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
                <Target className="h-4 w-4 text-primary" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-2">
                  <h3 className="text-sm font-semibold text-foreground">تحديد   جوجل</h3>
                  <Badge variant="outline" className="text-xs font-mono">
                    [{userLocation.lat.toFixed(6)}, {userLocation.lng.toFixed(6)}]
                  </Badge>
                  {userLocation.accuracy && (
                    <div className="flex items-center gap-2">
                      <div className={`flex items-center gap-1 px-2 py-1 rounded-md ${accuracyDisplay.bgColor} border ${accuracyDisplay.borderColor}`}>
                        <span className={`text-xs ${accuracyDisplay.color}`}>
                          {accuracyDisplay.icon}
                        </span>
                        {/* <span className={`text-xs ${accuracyDisplay.color} font-medium`}>
                        {accuracyDisplay.text}
                      </span> */}
                      </div>
                      <span className="text-xs text-muted-foreground">
                        ±{userLocation.accuracy.toFixed(1)}م
                      </span>
                    </div>
                  )}
                </div>

                {/* Enhanced accuracy display */}


              </div>
            </div>

            {/* Right side - Action button */}
            <Button
              variant="outline"
              onClick={onRecenter}
              className="h-8 w-8 text-muted-foreground hover:text-foreground border-border/50 hover:border-primary/50 flex-shrink-0"
              title="العودة إلى موقعك"
            >
              <RefreshCcw className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return null;
};
