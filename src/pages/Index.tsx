import { useState, useRef, useEffect } from "react";
import Navbar from "@/components/Navbar";
import ChatSidebar from "@/components/ChatSidebar";
import ChatInput from "@/components/ChatInput";
import ChatMessage from "@/components/ChatMessage";
import WelcomeScreen from "@/components/WelcomeScreen";
import LoadingState from "@/components/LoadingState";
import ErrorState from "@/components/ErrorState";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: string;
}

interface ChatHistory {
  id: string;
  title: string;
  timestamp: string;
  pinned?: boolean;
  archived?: boolean;
  messages: Message[];
}

const Index = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [chats, setChats] = useState<ChatHistory[]>([
    {
      id: "1",
      title: "Property Registration Query",
      timestamp: "Today",
      pinned: true,
      messages: [
        { id: "1", role: "user", content: "How do I register property in India?", timestamp: "10:30 AM" },
        { id: "2", role: "assistant", content: "Property registration in India involves several steps: 1) Prepare sale deed, 2) Pay stamp duty, 3) Visit Sub-Registrar office, 4) Submit documents and biometrics, 5) Collect registered deed. The process typically takes 1-2 days.", timestamp: "10:31 AM" }
      ]
    },
    {
      id: "2",
      title: "Consumer Rights Discussion",
      timestamp: "Yesterday",
      messages: []
    },
    {
      id: "3",
      title: "RTI Application Help",
      timestamp: "2 days ago",
      archived: true,
      messages: []
    }
  ]);
  const [activeChat, setActiveChat] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [hasError, setHasError] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleNewChat = () => {
    setActiveChat(null);
    setMessages([]);
    setHasError(false);
    toast.success("Started new chat");
  };

  const handleSelectChat = (id: string) => {
    const chat = chats.find(c => c.id === id);
    if (chat) {
      setActiveChat(id);
      setMessages(chat.messages);
      setHasError(false);
    }
  };

  const handleSendMessage = async (content: string) => {
    const newMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, newMessage]);
    setIsLoading(true);
    setHasError(false);

    try {
      // Call your Flask API
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';
      const res = await fetch(`${apiUrl}/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: content })
      });

      if (!res.ok) throw new Error('API request failed');

      const data = await res.json();

      const response: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: data.response,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };

      setMessages(prev => [...prev, response]);
      setIsLoading(false);
    } catch (error) {
      console.error('Chat API error:', error);
      setIsLoading(false);
      setHasError(true);
    }
  };

  const handleRetry = () => {
    setHasError(false);
    if (messages.length > 0) {
      const lastUserMessage = [...messages].reverse().find(m => m.role === "user");
      if (lastUserMessage) {
        handleSendMessage(lastUserMessage.content);
      }
    }
  };

  const handlePin = () => toast.success("Chat pinned");
  const handleArchive = () => toast.success("Chat archived");
  const handleDelete = () => toast.success("Chat deleted");
  const handleShare = () => toast.success("Share link copied");

  const currentChatTitle = activeChat 
    ? chats.find(c => c.id === activeChat)?.title 
    : messages.length > 0 
      ? "New Conversation" 
      : "New Chat";

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar 
        chatTitle={currentChatTitle}
        onPin={handlePin}
        onArchive={handleArchive}
        onDelete={handleDelete}
        onShare={handleShare}
      />
      
      <ChatSidebar
        isOpen={sidebarOpen}
        onToggle={() => setSidebarOpen(!sidebarOpen)}
        chats={chats}
        activeChat={activeChat}
        onSelectChat={handleSelectChat}
        onNewChat={handleNewChat}
        userEmail="user@lawsarthi.com"
      />

      <main
        className={cn(
          "flex-1 flex flex-col pt-16 transition-all duration-300",
          sidebarOpen ? "ml-72" : "ml-0"
        )}
      >
        {/* Chat Area */}
        <div className="flex-1 overflow-y-auto px-4 py-6">
          {messages.length === 0 && !isLoading && !hasError ? (
            <WelcomeScreen />
          ) : (
            <div className="max-w-4xl mx-auto space-y-4">
              {messages.map((message) => (
                <ChatMessage key={message.id} message={message} />
              ))}
              
              {isLoading && <LoadingState />}
              {hasError && <ErrorState onRetry={handleRetry} />}
              
              <div ref={messagesEndRef} />
            </div>
          )}
        </div>

        {/* Input Area */}
        <div className="sticky bottom-0 bg-gradient-to-t from-background via-background to-transparent pt-6">
          <ChatInput onSend={handleSendMessage} isLoading={isLoading} />
        </div>
      </main>
    </div>
  );
};

export default Index;
