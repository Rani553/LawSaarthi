import { 
  MoreVertical, 
  Pin, 
  Archive, 
  Trash2, 
  Share2,
  Scale
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface NavbarProps {
  chatTitle?: string;
  onPin?: () => void;
  onArchive?: () => void;
  onDelete?: () => void;
  onShare?: () => void;
}

const Navbar = ({ 
  chatTitle = "New Chat", 
  onPin, 
  onArchive, 
  onDelete, 
  onShare 
}: NavbarProps) => {
  return (
    <nav className="fixed top-0 left-0 right-0 h-16 z-30 glass-card border-b border-border/50">
      <div className="flex items-center justify-between h-full px-6">
        {/* Logo with bounce animation */}
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-primary to-teal flex items-center justify-center shadow-lg logo-bounce">
            <Scale className="h-6 w-6 text-primary-foreground" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-gradient">Lawsarthi</h1>
            <p className="text-xs text-muted-foreground">Your Legal AI Assistant</p>
          </div>
        </div>

        {/* Center - Chat Title */}
        <div className="hidden md:block absolute left-1/2 -translate-x-1/2">
          <h2 className="text-sm font-medium text-foreground/80 max-w-xs truncate">
            {chatTitle}
          </h2>
        </div>

        {/* Right - Actions with hover zoom */}
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" onClick={onShare} className="icon-hover">
            <Share2 className="h-5 w-5" />
          </Button>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="icon-hover">
                <MoreVertical className="h-5 w-5" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48 bg-popover border-border">
              <DropdownMenuItem onClick={onPin} className="cursor-pointer">
                <Pin className="h-4 w-4 mr-2" />
                Pin Chat
              </DropdownMenuItem>
              <DropdownMenuItem onClick={onArchive} className="cursor-pointer">
                <Archive className="h-4 w-4 mr-2" />
                Archive Chat
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={onDelete} className="cursor-pointer text-destructive">
                <Trash2 className="h-4 w-4 mr-2" />
                Delete Chat
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
