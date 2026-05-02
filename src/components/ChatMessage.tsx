// Drop-in replacement for: src/components/ChatMessage.tsx

import { Scale, Copy, Share2, Pencil } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: string;
}

interface Props {
  message: Message;
  onEdit?: (message: Message) => void;
}

const ChatMessage = ({ message, onEdit }: Props) => {
  const isUser = message.role === "user";

  const handleCopy = async () => {
    await navigator.clipboard.writeText(message.content);
    toast.success("Copied to clipboard");
  };

  const handleShare = async () => {
    const text = `${isUser ? "You" : "Lawsarthi"} (${message.timestamp}):\n${message.content}`;
    await navigator.clipboard.writeText(text);
    toast.success("Message copied — ready to share");
  };

  return (
    <div className={cn("flex gap-4 p-4 animate-fade-in", isUser ? "flex-row-reverse" : "flex-row")}>
      <div
        className={cn(
          "h-10 w-10 rounded-xl flex items-center justify-center shadow-lg flex-shrink-0",
          isUser ? "bg-gradient-to-br from-accent to-orange" : "bg-gradient-to-br from-primary to-teal",
        )}
      >
        {isUser ? (
          <span className="text-accent-foreground font-bold text-sm">U</span>
        ) : (
          <Scale className="h-5 w-5 text-primary-foreground" />
        )}
      </div>

      <div className={cn("flex-1 max-w-[80%]", isUser && "flex flex-col items-end")}>
        <div className="flex items-center gap-2 mb-1">
          <span className={cn("text-sm font-medium", isUser ? "text-accent" : "text-primary")}>
            {isUser ? "You" : "Lawsarthi"}
          </span>
          <span className="text-xs text-muted-foreground">{message.timestamp}</span>
        </div>

        <div
          className={cn(
            "rounded-2xl px-4 py-3 text-sm leading-relaxed whitespace-pre-wrap",
            isUser ? "bg-accent/20 text-foreground rounded-tr-md" : "glass-card rounded-tl-md",
          )}
        >
          {message.content}
        </div>

        <div className="flex items-center gap-1 mt-2">
          <Button variant="ghost" size="icon" onClick={handleCopy} className="h-8 w-8" title="Copy">
            <Copy className="h-3.5 w-3.5" />
          </Button>
          <Button variant="ghost" size="icon" onClick={handleShare} className="h-8 w-8" title="Share">
            <Share2 className="h-3.5 w-3.5" />
          </Button>
          {isUser && onEdit && (
            <Button
              variant="ghost"
              size="icon"
              onClick={() => onEdit(message)}
              className="h-8 w-8"
              title="Edit & resend"
            >
              <Pencil className="h-3.5 w-3.5" />
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ChatMessage;
