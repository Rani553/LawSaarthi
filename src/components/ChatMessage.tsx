import { Scale, Copy, Share2, ThumbsUp, ThumbsDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: string;
}

interface ChatMessageProps {
  message: Message;
}

const ChatMessage = ({ message }: ChatMessageProps) => {
  const isUser = message.role === "user";

  const handleCopy = () => {
    navigator.clipboard.writeText(message.content);
    toast.success("Copied to clipboard");
  };

  return (
    <div
      className={cn(
        "flex gap-4 p-4 animate-fade-in",
        isUser ? "flex-row-reverse" : "flex-row"
      )}
    >
      {/* Avatar */}
      <div
        className={cn(
          "h-10 w-10 rounded-xl flex items-center justify-center shadow-lg flex-shrink-0",
          isUser
            ? "bg-gradient-to-br from-accent to-orange"
            : "bg-gradient-to-br from-primary to-teal"
        )}
      >
        {isUser ? (
          <span className="text-accent-foreground font-bold text-sm">U</span>
        ) : (
          <Scale className="h-5 w-5 text-primary-foreground" />
        )}
      </div>

      {/* Content */}
      <div className={cn("flex-1 max-w-[80%]", isUser && "flex flex-col items-end")}>
        <div className="flex items-center gap-2 mb-1">
          <span className={cn(
            "text-sm font-medium",
            isUser ? "text-accent" : "text-primary"
          )}>
            {isUser ? "You" : "Lawsarthi"}
          </span>
          <span className="text-xs text-muted-foreground">{message.timestamp}</span>
        </div>

        <div
          className={cn(
            "rounded-2xl px-4 py-3 text-sm leading-relaxed",
            isUser
              ? "bg-accent/20 text-foreground rounded-tr-md"
              : "glass-card rounded-tl-md"
          )}
        >
          {message.content}
        </div>

        {/* Actions */}
        {!isUser && (
          <div className="flex items-center gap-1 mt-2">
            <Button variant="ghost" size="iconSm" onClick={handleCopy}>
              <Copy className="h-3.5 w-3.5" />
            </Button>
            <Button variant="ghost" size="iconSm">
              <Share2 className="h-3.5 w-3.5" />
            </Button>
            <Button variant="ghost" size="iconSm">
              <ThumbsUp className="h-3.5 w-3.5" />
            </Button>
            <Button variant="ghost" size="iconSm">
              <ThumbsDown className="h-3.5 w-3.5" />
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatMessage;
