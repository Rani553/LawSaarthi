// Drop-in replacement for: src/components/ChatInput.tsx

import { useEffect, useRef, useState } from "react";
import { Send, Mic, MicOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

interface ChatInputProps {
  onSend: (message: string) => void;
  isLoading?: boolean;
  draft?: string;
  onDraftConsumed?: () => void;
}

const ChatInput = ({ onSend, isLoading, draft, onDraftConsumed }: ChatInputProps) => {
  const [message, setMessage] = useState("");
  const [isListening, setIsListening] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (draft) {
      setMessage(draft);
      textareaRef.current?.focus();
      onDraftConsumed?.();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [draft]);

  const handleSend = () => {
    const value = message.trim();
    if (!value || isLoading) return;
    onSend(value);
    setMessage("");
    if (textareaRef.current) textareaRef.current.style.height = "auto";
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleTextareaChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setMessage(e.target.value);
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = Math.min(textareaRef.current.scrollHeight, 200) + "px";
    }
  };

  const handleVoiceInput = () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const w = window as any;
    const SR = w.SpeechRecognition || w.webkitSpeechRecognition;
    if (!SR) {
      toast.error("Voice input is not supported in your browser");
      return;
    }
    const recognition = new SR();
    recognition.lang = "en-IN";
    recognition.continuous = false;
    recognition.interimResults = false;

    recognition.onstart = () => {
      setIsListening(true);
      toast.info("Listening… speak now");
    };
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript;
      setMessage((prev) => (prev ? prev + " " : "") + transcript);
      setIsListening(false);
    };
    recognition.onerror = () => {
      setIsListening(false);
      toast.error("Could not understand. Please try again.");
    };
    recognition.onend = () => setIsListening(false);
    recognition.start();
  };

  return (
    <div className="w-full max-w-4xl mx-auto px-4 pb-6">
      <div className="glass-card p-3">
        <div className="flex items-end gap-3">
          <textarea
            ref={textareaRef}
            value={message}
            onChange={handleTextareaChange}
            onKeyDown={handleKeyDown}
            placeholder="Ask your legal question…"
            rows={1}
            className="flex-1 bg-transparent border-none resize-none text-foreground placeholder:text-muted-foreground focus:outline-none text-sm leading-relaxed min-h-[24px] max-h-[200px] px-2 py-2"
          />

          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={handleVoiceInput}
              className={cn("h-10 w-10 rounded-full", isListening && "animate-pulse ring-2 ring-success/60")}
              title="Voice input"
            >
              {isListening ? <MicOff className="h-5 w-5" /> : <Mic className="h-5 w-5" />}
            </Button>

            <Button
              size="icon"
              onClick={handleSend}
              disabled={!message.trim() || isLoading}
              className="h-10 w-10 rounded-full bg-primary text-primary-foreground hover:opacity-90"
              title="Send"
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
