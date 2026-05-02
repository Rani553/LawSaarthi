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
        {
          id: "1",
          role: "user",
          content: "How do I register property in India?",
          timestamp: "10:30 AM",
        },
        {
          id: "2",
          role: "assistant",
          content:
            "Property registration in India involves several steps: 1) Prepare sale deed, 2) Pay stamp duty, 3) Visit Sub-Registrar office, 4) Submit documents and biometrics, 5) Collect registered deed.",
          timestamp: "10:31 AM",
        },
      ],
    },
    {
      id: "2",
      title: "Consumer Rights Discussion",
      timestamp: "Yesterday",
      messages: [],
    },
    {
      id: "3",
      title: "RTI Application Help",
      timestamp: "2 days ago",
      archived: true,
      messages: [],
    },
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

  // ===============================
  // CHAT HANDLERS
  // ===============================

  const handleNewChat = () => {
    setActiveChat(null);
    setMessages([]);
    setHasError(false);
    toast.success("Started new chat");
  };

  const handleSelectChat = (id: string) => {
    const chat = chats.find((c) => c.id === id);
    if (chat) {
      setActiveChat(id);
      setMessages(chat.messages);
      setHasError(false);
    }
  };

  // ===============================
  // SIDEBAR FUNCTIONS (FIXED)
  // ===============================

  const handleTogglePin = (id: string) => {
    setChats((prev) =>
      prev.map((chat) =>
        chat.id === id ? { ...chat, pinned: !chat.pinned } : chat
      )
    );
  };

  const handleToggleArchive = (id: string) => {
    setChats((prev) =>
      prev.map((chat) =>
        chat.id === id ? { ...chat, archived: !chat.archived } : chat
      )
    );
  };

  const handleDeleteChat = (id: string) => {
    setChats((prev) => prev.filter((chat) => chat.id !== id));

    if (activeChat === id) {
      setActiveChat(null);
      setMessages([]);
    }
  };

  // ===============================
  // SEND MESSAGE
  // ===============================

  const handleSendMessage = async (content: string) => {
    const newMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content,
      timestamp: new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
    };

    setMessages((prev) => [...prev, newMessage]);
    setIsLoading(true);
    setHasError(false);

    try {
      const apiUrl =
        import.meta.env.VITE_API_URL || "http://localhost:5000";

      const res = await fetch(`${apiUrl}/chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: content }),
      });

      if (!res.ok) throw new Error("API failed");

      const data = await res.json();

      const response: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: data.response,
        timestamp: new Date().toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
      };

      setMessages((prev) => [...prev, response]);
    } catch (error) {
      console.error(error);
      setHasError(true);
    }

    setIsLoading(false);
  };

  const handleRetry = () => {
    setHasError(false);
    const last = [...messages].reverse().find((m) => m.role === "user");
    if (last) handleSendMessage(last.content);
  };

  // ===============================
  // NAVBAR FUNCTIONS
  // ===============================

  const handlePin = () => toast.success("Chat pinned");
  const handleArchive = () => toast.success("Chat archived");
  const handleDelete = () => toast.success("Chat deleted");
  const handleShare = () => toast.success("Chat copied");

  const currentChatTitle =
    activeChat
      ? chats.find((c) => c.id === activeChat)?.title
      : messages.length > 0
      ? "New Conversation"
      : "New Chat";

  const activeChatData = chats.find((c) => c.id === activeChat);

  return (
    <div className="min-h-screen flex flex-col">
      {/* ================= NAVBAR ================= */}
      <Navbar
        chatTitle={currentChatTitle}
        pinned={activeChatData?.pinned}
        archived={activeChatData?.archived}
        hasActiveChat={messages.length > 0}
        onPin={handlePin}
        onArchive={handleArchive}
        onDelete={handleDelete}
        onShare={handleShare}
      />

      {/* ================= SIDEBAR ================= */}
      <ChatSidebar
        isOpen={sidebarOpen}
        onToggle={() => setSidebarOpen(!sidebarOpen)}
        chats={chats}
        activeChat={activeChat}
        onSelectChat={handleSelectChat}
        onNewChat={handleNewChat}
        onTogglePin={handleTogglePin}
        onToggleArchive={handleToggleArchive}
        onDeleteChat={handleDeleteChat}
      />

      {/* ================= MAIN ================= */}
      <main
        className={cn(
          "flex-1 flex flex-col pt-16 transition-all duration-300",
          sidebarOpen ? "ml-72" : "ml-0"
        )}
      >
        <div className="flex-1 overflow-y-auto px-4 py-6">
          {messages.length === 0 && !isLoading && !hasError ? (
            <WelcomeScreen onSelectQuestion={handleSendMessage} />
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

        {/* ================= INPUT ================= */}
        <div className="sticky bottom-0 bg-gradient-to-t from-background via-background to-transparent pt-6">
          <ChatInput onSend={handleSendMessage} isLoading={isLoading} />
        </div>
      </main>
    </div>
  );
};

export default Index;