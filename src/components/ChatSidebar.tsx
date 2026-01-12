import { useState } from "react";
import { 
  MessageSquarePlus, 
  Search, 
  History, 
  Star, 
  Archive, 
  Trash2, 
  ChevronLeft, 
  ChevronRight,
  Settings,
  HelpCircle,
  Scale
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface ChatHistory {
  id: string;
  title: string;
  timestamp: string;
  pinned?: boolean;
  archived?: boolean;
}

interface ChatSidebarProps {
  isOpen: boolean;
  onToggle: () => void;
  chats: ChatHistory[];
  activeChat: string | null;
  onSelectChat: (id: string) => void;
  onNewChat: () => void;
  userEmail: string;
}

const ChatSidebar = ({ 
  isOpen, 
  onToggle, 
  chats, 
  activeChat, 
  onSelectChat, 
  onNewChat,
  userEmail 
}: ChatSidebarProps) => {
  const [searchQuery, setSearchQuery] = useState("");

  const filteredChats = chats.filter(chat => 
    chat.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const pinnedChats = filteredChats.filter(chat => chat.pinned && !chat.archived);
  const regularChats = filteredChats.filter(chat => !chat.pinned && !chat.archived);
  const archivedChats = filteredChats.filter(chat => chat.archived);

  return (
    <>
      {/* Collapsed toggle button */}
      {!isOpen && (
        <Button
          variant="icon"
          size="icon"
          onClick={onToggle}
          className="fixed left-4 top-20 z-50 glass-card"
        >
          <ChevronRight className="h-5 w-5" />
        </Button>
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          "fixed left-0 top-0 h-full z-40 transition-all duration-300 ease-in-out",
          "bg-sidebar border-r border-sidebar-border",
          isOpen ? "w-72 translate-x-0" : "w-72 -translate-x-full"
        )}
      >
        <div className="flex flex-col h-full p-4">
          {/* Header with bouncing logo */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2">
              <Scale className="h-6 w-6 text-primary logo-bounce" />
              <span className="font-semibold text-lg text-gradient">Lawsarthi</span>
            </div>
            <Button variant="ghost" size="iconSm" onClick={onToggle} className="icon-hover">
              <ChevronLeft className="h-5 w-5" />
            </Button>
          </div>

          {/* New Chat Button */}
          <Button 
            variant="accent" 
            className="w-full mb-4 justify-start icon-hover"
            onClick={onNewChat}
          >
            <MessageSquarePlus className="h-5 w-5" />
            New Chat
          </Button>

          {/* Search */}
          <div className="relative mb-4">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search chats..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-secondary/50 border border-border rounded-lg text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
            />
          </div>

          {/* Chat Lists */}
          <div className="flex-1 overflow-y-auto space-y-4">
            {/* Pinned Chats */}
            {pinnedChats.length > 0 && (
              <div>
                <div className="flex items-center gap-2 text-xs text-muted-foreground mb-2 px-2">
                  <Star className="h-3 w-3" />
                  PINNED
                </div>
                <div className="space-y-1">
                  {pinnedChats.map((chat) => (
                    <ChatItem 
                      key={chat.id} 
                      chat={chat} 
                      isActive={activeChat === chat.id}
                      onClick={() => onSelectChat(chat.id)}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Recent Chats */}
            {regularChats.length > 0 && (
              <div>
                <div className="flex items-center gap-2 text-xs text-muted-foreground mb-2 px-2">
                  <History className="h-3 w-3" />
                  RECENT
                </div>
                <div className="space-y-1">
                  {regularChats.map((chat) => (
                    <ChatItem 
                      key={chat.id} 
                      chat={chat} 
                      isActive={activeChat === chat.id}
                      onClick={() => onSelectChat(chat.id)}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Archived */}
            {archivedChats.length > 0 && (
              <div>
                <div className="flex items-center gap-2 text-xs text-muted-foreground mb-2 px-2">
                  <Archive className="h-3 w-3" />
                  ARCHIVED
                </div>
                <div className="space-y-1">
                  {archivedChats.map((chat) => (
                    <ChatItem 
                      key={chat.id} 
                      chat={chat} 
                      isActive={activeChat === chat.id}
                      onClick={() => onSelectChat(chat.id)}
                    />
                  ))}
                </div>
              </div>
            )}

            {filteredChats.length === 0 && (
              <div className="text-center text-muted-foreground text-sm py-8">
                No chats found
              </div>
            )}
          </div>

          {/* Bottom Section */}
          <div className="border-t border-sidebar-border pt-4 mt-4 space-y-2">
            <Button variant="ghost" className="w-full justify-start icon-hover" size="sm">
              <Settings className="h-4 w-4" />
              Settings
            </Button>
            <Button variant="ghost" className="w-full justify-start icon-hover" size="sm">
              <HelpCircle className="h-4 w-4" />
              Help & FAQ
            </Button>
            
            {/* User Account */}
            <div className="flex items-center gap-3 p-2 rounded-lg bg-secondary/30 mt-2">
              <div className="h-8 w-8 rounded-full bg-primary/20 flex items-center justify-center text-primary font-medium text-sm">
                {userEmail.charAt(0).toUpperCase()}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">{userEmail}</p>
                <p className="text-xs text-muted-foreground">Free Account</p>
              </div>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
};

const ChatItem = ({ 
  chat, 
  isActive, 
  onClick 
}: { 
  chat: ChatHistory; 
  isActive: boolean; 
  onClick: () => void;
}) => {
  return (
    <button
      onClick={onClick}
      className={cn(
        "w-full text-left px-3 py-2 rounded-lg transition-colors group",
        isActive 
          ? "bg-primary/20 text-primary" 
          : "hover:bg-secondary/50 text-foreground"
      )}
    >
      <p className="text-sm font-medium truncate">{chat.title}</p>
      <p className="text-xs text-muted-foreground">{chat.timestamp}</p>
    </button>
  );
};

export default ChatSidebar;
