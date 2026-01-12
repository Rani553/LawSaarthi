import { Scale, AlertCircle, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ErrorStateProps {
  onRetry?: () => void;
}

const ErrorState = ({ onRetry }: ErrorStateProps) => {
  return (
    <div className="flex items-start gap-4 p-4 animate-fade-in">
      {/* Avatar */}
      <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-destructive/80 to-destructive flex items-center justify-center shadow-lg flex-shrink-0">
        <Scale className="h-5 w-5 text-destructive-foreground" />
      </div>

      {/* Error Content */}
      <div className="flex-1">
        <div className="flex items-center gap-3 mb-4">
          <span className="text-sm font-medium text-destructive">Lawsarthi</span>
          <span className="text-xs text-muted-foreground">encountered an issue</span>
        </div>

        {/* Sad Character */}
        <div className="flex items-center gap-6 mb-4">
          <div className="relative">
            <div className="w-20 h-20 relative">
              {/* Face */}
              <div className="w-16 h-16 bg-gradient-to-b from-amber-200 to-amber-300 rounded-full mx-auto shadow-md relative">
                {/* Sad eyes */}
                <div className="absolute top-5 left-3 w-3 h-2 border-t-2 border-gray-800 rounded-t-full" />
                <div className="absolute top-5 right-3 w-3 h-2 border-t-2 border-gray-800 rounded-t-full" />
                {/* Tear drops */}
                <div className="absolute top-8 left-4 w-1.5 h-2 bg-blue-400 rounded-full animate-pulse" />
                {/* Sad mouth */}
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 w-6 h-3 border-t-2 border-gray-700 rounded-t-full" />
              </div>
              {/* Sweat drops */}
              <div className="absolute -right-1 top-3 w-2 h-3 bg-blue-300/50 rounded-full" />
            </div>
          </div>

          <div className="flex-1">
            <div className="glass-card p-4 border-destructive/30">
              <div className="flex items-center gap-2 text-destructive mb-2">
                <AlertCircle className="h-4 w-4" />
                <span className="font-medium">Sorry, I couldn't find an answer</span>
              </div>
              <p className="text-sm text-muted-foreground">
                I apologize for the inconvenience. This might be due to a network issue or the question may need to be rephrased. Please try again.
              </p>
            </div>
          </div>
        </div>

        {/* Retry Button */}
        {onRetry && (
          <Button variant="outline" size="sm" onClick={onRetry} className="mt-2">
            <RefreshCw className="h-4 w-4 mr-2" />
            Try Again
          </Button>
        )}

        {/* Suggestions */}
        <div className="mt-4 p-3 bg-secondary/30 rounded-lg">
          <p className="text-xs text-muted-foreground mb-2">You can try:</p>
          <ul className="text-sm text-muted-foreground space-y-1">
            <li>• Rephrasing your question</li>
            <li>• Being more specific about your legal query</li>
            <li>• Checking your internet connection</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default ErrorState;
