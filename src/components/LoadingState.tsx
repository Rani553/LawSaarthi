import { Scale, Loader2 } from "lucide-react";

const LoadingState = () => {
  return (
    <div className="flex items-start gap-4 p-4 animate-fade-in">
      {/* Avatar */}
      <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-primary to-teal flex items-center justify-center shadow-lg flex-shrink-0">
        <Scale className="h-5 w-5 text-primary-foreground" />
      </div>

      {/* Loading Content */}
      <div className="flex-1 space-y-4">
        <div className="flex items-center gap-3">
          <span className="text-sm font-medium text-primary">Lawsarthi</span>
          <span className="text-xs text-muted-foreground">is thinking...</span>
        </div>

        {/* Animated Character */}
        <div className="flex items-center gap-4">
          <div className="relative">
            {/* Thinking character */}
            <div className="w-16 h-16 relative float">
              {/* Face */}
              <div className="w-12 h-12 bg-gradient-to-b from-amber-200 to-amber-300 rounded-full mx-auto shadow-md">
                {/* Eyes - animated looking */}
                <div className="absolute top-4 left-3 w-2 h-2 bg-gray-800 rounded-full animate-pulse" />
                <div className="absolute top-4 right-3 w-2 h-2 bg-gray-800 rounded-full animate-pulse" />
                {/* Thinking mouth */}
                <div className="absolute bottom-3 left-1/2 -translate-x-1/2 w-4 h-1 bg-gray-700 rounded-full" />
              </div>
              {/* Thought bubble */}
              <div className="absolute -right-6 -top-2 flex gap-1">
                <div className="w-2 h-2 bg-primary/40 rounded-full animate-pulse" />
                <div className="w-3 h-3 bg-primary/50 rounded-full animate-pulse" style={{ animationDelay: '0.2s' }} />
                <div className="w-4 h-4 bg-primary/60 rounded-full animate-pulse" style={{ animationDelay: '0.4s' }} />
              </div>
            </div>
          </div>

          <div className="flex-1">
            <div className="thinking-dots flex gap-1 text-2xl text-primary">
              <span className="inline-block">●</span>
              <span className="inline-block">●</span>
              <span className="inline-block">●</span>
            </div>
            <p className="text-sm text-muted-foreground mt-2">
              Searching through legal resources...
            </p>
          </div>
        </div>

        {/* Shimmer loading bars */}
        <div className="space-y-2">
          <div className="h-4 w-3/4 rounded shimmer" />
          <div className="h-4 w-1/2 rounded shimmer" />
          <div className="h-4 w-2/3 rounded shimmer" />
        </div>
      </div>
    </div>
  );
};

export default LoadingState;
