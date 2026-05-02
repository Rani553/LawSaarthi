export interface Message {
    id: string;
    role: "user" | "assistant";
    content: string;
    timestamp: string;
  }
  
  export interface ChatHistory {
    id: string;
    title: string;
    timestamp: string;
    pinned?: boolean;
    archived?: boolean;
    messages: Message[];
  }
  
  export const nowTime = () =>
    new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  