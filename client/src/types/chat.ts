export interface User {
  id: string;
  name: string;
}

export interface ChatMessage {
  id: string;
  type: "chat" | "system";
  userId?: string;
  sender?: string;
  text: string;
  timestamp: number;
}

export type ServerEvent =
  | { type: "init"; id: string; users: User[]; messages: ChatMessage[] }
  | { type: "message"; message: ChatMessage }
  | { type: "users"; users: User[] }
  | {
      type: "typing";
      userId: string;
      sender: string;
      isTyping: boolean;
    };
