import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Send } from "lucide-react";

interface Message {
  id: string;
  username: string;
  text: string;
  timestamp: number;
}

interface ChatPanelProps {
  channel: any;
  username: string;
}

export const ChatPanel = ({ channel, username }: ChatPanelProps) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState("");
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!channel) return;

    channel.on("broadcast", { event: "chat-message" }, ({ payload }: any) => {
      setMessages((prev) => [...prev, payload]);
    });

    return () => {
      channel.off("broadcast", { event: "chat-message" });
    };
  }, [channel]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const sendMessage = () => {
    if (!inputValue.trim() || !channel) return;

    const message: Message = {
      id: Math.random().toString(36).substring(7),
      username,
      text: inputValue,
      timestamp: Date.now(),
    };

    channel.send({
      type: "broadcast",
      event: "chat-message",
      payload: message,
    });

    setMessages((prev) => [...prev, message]);
    setInputValue("");
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      sendMessage();
    }
  };

  return (
    <div className="fixed right-6 top-20 bottom-32 w-80 glass-card rounded-xl p-4 flex flex-col">
      <h3 className="text-lg font-semibold mb-4 text-foreground">Chat</h3>
      
      <ScrollArea className="flex-1 pr-4" ref={scrollRef}>
        <div className="space-y-3">
          {messages.map((msg) => (
            <div key={msg.id} className="space-y-1">
              <div className="flex items-baseline gap-2">
                <span className="text-sm font-medium text-foreground">
                  {msg.username}
                </span>
                <span className="text-xs text-muted-foreground">
                  {new Date(msg.timestamp).toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </span>
              </div>
              <p className="text-sm text-foreground/90 bg-secondary rounded-lg px-3 py-2">
                {msg.text}
              </p>
            </div>
          ))}
        </div>
      </ScrollArea>

      <div className="flex gap-2 mt-4">
        <Input
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="Type a message..."
          className="flex-1"
        />
        <Button onClick={sendMessage} size="icon">
          <Send className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};
