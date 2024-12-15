import { cn } from "@/lib/utils";

interface ChatMessageProps {
  content: string;
  role: "user" | "assistant";
  animate?: boolean;
}

export const ChatMessage = ({ content, role, animate = true }: ChatMessageProps) => {
  return (
    <div
      className={cn(
        "message",
        role === "assistant" ? "assistant-message" : "user-message",
        !animate && "!opacity-100 !transform-none"
      )}
    >
      <div className="message-content">{content}</div>
    </div>
  );
};