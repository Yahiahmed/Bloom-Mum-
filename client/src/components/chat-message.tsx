import { cn } from "@/lib/utils";

interface ChatMessageProps {
  content: string;
  role: "user" | "assistant";
  timestamp?: Date | string;
}

export default function ChatMessage({ content, role, timestamp }: ChatMessageProps) {
  const isUser = role === "user";

  return (
    <div className={cn("flex items-start", isUser ? "justify-end" : "")}>
      <div
        className={cn(
          "rounded-2xl p-4 chat-message",
          isUser
            ? "bg-primary rounded-tr-none text-white"
            : "bg-primary/10 rounded-tl-none text-neutral-800"
        )}
      >
        <p className="whitespace-pre-line">{content}</p>
        
        {timestamp && (
          <div className="mt-2 text-xs opacity-70 text-right">
            {new Date(timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </div>
        )}
      </div>
    </div>
  );
}
