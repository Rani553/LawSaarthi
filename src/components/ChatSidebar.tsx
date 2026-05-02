// Drop-in replacement for: src/components/ChatSidebar.tsx

import { useState } from "react";
import {
  MessageSquarePlus,
  Search,
  History,
  Star,
  Archive,
  Trash2,
  Pin,
  PinOff,
  ArchiveRestore,
  ChevronLeft,
  ChevronRight,
  Scale,
  MoreHorizontal,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";

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

interface ChatSidebarProps {
  isOpen: boolean;
  onToggle: () => void;
  chats: ChatHistory[];
  activeChat: string | null;
  onSelectChat: (id: string) => void;
  onNewChat: () => void;
  onTogglePin: (id: string) => void;
  onToggleArchive: (id: string) => void;
  onDeleteChat: (id: string) => void;
}

const ChatSidebar = ({
  isOpen,
  onToggle,
  chats,
  activeChat,
  onSelectChat,
  onNewChat,
  onTogglePin,
  onToggleArchive,
  onDeleteChat,
}: ChatSidebarProps) => {
  const [searchQuery, setSearchQuery] = useState("");

  const q = searchQuery.toLowerCase().trim();
  const matches = (chat: ChatHistory) => {
    if (!q) return true;
    if (chat.title.toLowerCase().includes(q)) return true;
    return chat.messages.some((m) => m.content.toLowerCase().includes(q));
  };

  const filtered = chats.filter(matches);
  const pinned = filtered.filter((c) => c.pinned && !c.archived);
  const recent = filtered.filter((c) => !c.pinned && !c.archived);
  const archived = filtered.filter((c) => c.archived);

  return (
    <>
      {!isOpen && (
        <Button
          variant="outline"
          size="icon"
          onClick={onToggle}
          className="fixed left-4 top-20 z-50 glass-card"
          title="Open sidebar"
        >
          <ChevronRight className="h-5 w-5" />
        </Button>
      )}

      <aside
        className={cn(
          "fixed left-0 top-0 h-full z-40 transition-transform duration-300 ease-in-out",
          "bg-sidebar border-r border-sidebar-border w-72",
          isOpen ? "translate-x-0" : "-translate-x-full",
        )}
      >
        <div className="flex flex-col h-full p-4">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2">
              <Scale className="h-6 w-6 text-primary logo-bounce" />
              <span className="font-semibold text-lg text-gradient">Lawsarthi</span>
            </div>
            <Button variant="ghost" size="icon" onClick={onToggle} className="h-8 w-8" title="Collapse">
              <ChevronLeft className="h-5 w-5" />
            </Button>
          </div>

          <Button
            className="w-full mb-4 justify-start gap-2 bg-accent text-accent-foreground hover:opacity-90"
            onClick={onNewChat}
          >
            <MessageSquarePlus className="h-5 w-5" />
            New Chat
          </Button>

          <div className="relative mb-4">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search chats…"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-secondary/50 border border-border rounded-lg text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
            />
          </div>

          <div className="flex-1 overflow-y-auto space-y-5 pr-1">
            <Section
              icon={<Star className="h-3 w-3" />}
              label="PINNED"
              chats={pinned}
              activeChat={activeChat}
              onSelectChat={onSelectChat}
              onTogglePin={onTogglePin}
              onToggleArchive={onToggleArchive}
              onDeleteChat={onDeleteChat}
            />
            <Section
              icon={<History className="h-3 w-3" />}
              label="RECENT"
              chats={recent}
              activeChat={activeChat}
              onSelectChat={onSelectChat}
              onTogglePin={onTogglePin}
              onToggleArchive={onToggleArchive}
              onDeleteChat={onDeleteChat}
            />
            <Section
              icon={<Archive className="h-3 w-3" />}
              label="ARCHIVED"
              chats={archived}
              activeChat={activeChat}
              onSelectChat={onSelectChat}
              onTogglePin={onTogglePin}
              onToggleArchive={onToggleArchive}
              onDeleteChat={onDeleteChat}
            />

            {filtered.length === 0 && (
              <div className="text-center text-muted-foreground text-sm py-8">No chats found</div>
            )}
          </div>
        </div>
      </aside>
    </>
  );
};

interface SectionProps {
  icon: React.ReactNode;
  label: string;
  chats: ChatHistory[];
  activeChat: string | null;
  onSelectChat: (id: string) => void;
  onTogglePin: (id: string) => void;
  onToggleArchive: (id: string) => void;
  onDeleteChat: (id: string) => void;
}

const Section = ({
  icon,
  label,
  chats,
  activeChat,
  onSelectChat,
  onTogglePin,
  onToggleArchive,
  onDeleteChat,
}: SectionProps) => {
  if (chats.length === 0) return null;
  return (
    <div>
      <div className="flex items-center gap-2 text-xs text-muted-foreground mb-2 px-2 tracking-wider">
        {icon}
        {label}
      </div>
      <div className="space-y-1">
        {chats.map((chat) => (
          <ChatItem
            key={chat.id}
            chat={chat}
            isActive={activeChat === chat.id}
            onClick={() => onSelectChat(chat.id)}
            onTogglePin={() => onTogglePin(chat.id)}
            onToggleArchive={() => onToggleArchive(chat.id)}
            onDelete={() => onDeleteChat(chat.id)}
          />
        ))}
      </div>
    </div>
  );
};

interface ChatItemProps {
  chat: ChatHistory;
  isActive: boolean;
  onClick: () => void;
  onTogglePin: () => void;
  onToggleArchive: () => void;
  onDelete: () => void;
}

const ChatItem = ({ chat, isActive, onClick, onTogglePin, onToggleArchive, onDelete }: ChatItemProps) => {
  return (
    <div
      className={cn(
        "group flex items-center gap-1 rounded-lg transition-colors",
        isActive ? "bg-primary/20 text-primary" : "hover:bg-secondary/60 text-foreground",
      )}
    >
      <button onClick={onClick} className="flex-1 text-left px-3 py-2 min-w-0">
        <p className="text-sm font-medium truncate">{chat.title}</p>
        <p className="text-xs text-muted-foreground truncate">{chat.timestamp}</p>
      </button>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 mr-1 opacity-0 group-hover:opacity-100 focus:opacity-100"
            onClick={(e) => e.stopPropagation()}
            title="More"
          >
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-44">
          <DropdownMenuItem onClick={onTogglePin}>
            {chat.pinned ? (
              <>
                <PinOff className="h-4 w-4 mr-2" />
                Unpin
              </>
            ) : (
              <>
                <Pin className="h-4 w-4 mr-2" />
                Pin
              </>
            )}
          </DropdownMenuItem>
          <DropdownMenuItem onClick={onToggleArchive}>
            {chat.archived ? (
              <>
                <ArchiveRestore className="h-4 w-4 mr-2" />
                Unarchive
              </>
            ) : (
              <>
                <Archive className="h-4 w-4 mr-2" />
                Archive
              </>
            )}
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={onDelete} className="text-destructive">
            <Trash2 className="h-4 w-4 mr-2" />
            Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};

export default ChatSidebar;
