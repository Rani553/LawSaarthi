import { useState, useRef } from "react";
import { 
  Send, 
  Mic, 
  MicOff,
  Copy, 
  Edit3, 
  RefreshCw,
  Paperclip
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

interface ChatInputProps {
  onSend: (message: string) => void;
  isLoading?: boolean;
}

const ChatInput = ({ onSend, isLoading }: ChatInputProps) => {
  const [message, setMessage] = useState("");
  const [isListening, setIsListening] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleSend = () => {
    if (message.trim() && !isLoading) {
      onSend(message.trim());
      setMessage("");
      if (textareaRef.current) {
        textareaRef.current.style.height = "auto";
      }
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleTextareaChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setMessage(e.target.value);
    // Auto-resize
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = Math.min(textareaRef.current.scrollHeight, 200) + "px";
    }
  };

  const handleVoiceInput = () => {
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
      toast.error("Voice input is not supported in your browser");
      return;
    }

    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    const recognition = new SpeechRecognition();
    recognition.lang = 'en-IN';
    recognition.continuous = false;
    recognition.interimResults = false;

    if (isListening) {
      recognition.stop();
      setIsListening(false);
      return;
    }

    recognition.onstart = () => {
      setIsListening(true);
      toast.info("Listening... Speak now");
    };

    recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript;
      setMessage(prev => prev + " " + transcript);
      setIsListening(false);
    };

    recognition.onerror = () => {
      setIsListening(false);
      toast.error("Could not understand. Please try again.");
    };

    recognition.onend = () => {
      setIsListening(false);
    };

    recognition.start();
  };

  const handleCopy = () => {
    if (message) {
      navigator.clipboard.writeText(message);
      toast.success("Copied to clipboard");
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto px-4 pb-6">
      <div className="glass-card p-3 glow-effect">
        {/* Quick Actions */}
        <div className="flex items-center gap-2 mb-2 pb-2 border-b border-border/30">
          <Button 
            variant="ghost" 
            size="iconSm" 
            onClick={() => setIsEditing(!isEditing)}
            className={cn(isEditing && "text-primary bg-primary/10")}
          >
            <Edit3 className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="iconSm" onClick={handleCopy}>
            <Copy className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="iconSm" onClick={() => setMessage("")}>
            <RefreshCw className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="iconSm">
            <Paperclip className="h-4 w-4" />
          </Button>
        </div>

        {/* Input Area */}
        <div className="flex items-end gap-3">
          <textarea
            ref={textareaRef}
            value={message}
            onChange={handleTextareaChange}
            onKeyDown={handleKeyDown}
            placeholder="Ask your legal question here..."
            rows={1}
            className="flex-1 bg-transparent border-none resize-none text-foreground placeholder:text-muted-foreground focus:outline-none text-sm leading-relaxed min-h-[24px] max-h-[200px]"
          />
          
          <div className="flex items-center gap-2">
            <Button
              variant="voice"
              size="icon"
              onClick={handleVoiceInput}
              className={cn(
                isListening && "animate-pulse ring-2 ring-success/50"
              )}
            >
              {isListening ? <MicOff className="h-5 w-5" /> : <Mic className="h-5 w-5" />}
            </Button>
            
            <Button
              variant="send"
              size="icon"
              onClick={handleSend}
              disabled={!message.trim() || isLoading}
            >
              <Send className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </div>
      
      <p className="text-xs text-center text-muted-foreground mt-3">
        Lawsarthi can make mistakes. Please verify important legal information.
      </p>
    </div>
  );
};

export default ChatInput;
