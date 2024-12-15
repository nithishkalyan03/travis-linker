import { useState, useRef, useEffect } from "react";
import { ChatMessage } from "@/components/ChatMessage";
import { ChatInput } from "@/components/ChatInput";
import { useToast } from "@/components/ui/use-toast";
import { IntegrationsPanel } from "@/components/IntegrationsPanel";

interface Message {
  role: "user" | "assistant";
  content: string;
}

const Index = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content: "Hi! I'm Travis, your AI assistant. How can I help you today?",
    },
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async (content: string) => {
    const newMessage: Message = { role: "user", content };
    setMessages((prev) => [...prev, newMessage]);
    setIsLoading(true);

    try {
      // TODO: Implement Gemini API call here
      const response = "I'm Travis, and I'm still learning. Soon I'll be able to help you with various tasks and connect with other apps!";
      
      setTimeout(() => {
        setMessages((prev) => [
          ...prev,
          { role: "assistant", content: response },
        ]);
        setIsLoading(false);
      }, 1000);
    } catch (error) {
      console.error("Error:", error);
      toast({
        title: "Error",
        description: "Failed to get a response. Please try again.",
        variant: "destructive",
      });
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-screen max-h-screen bg-gradient-to-b from-secondary/50 to-background">
      <header className="glass-panel p-4 text-center">
        <h1 className="text-2xl font-semibold">Travis AI Assistant</h1>
      </header>
      
      <main className="flex-1 overflow-y-auto p-4">
        <div className="max-w-3xl mx-auto space-y-6">
          <IntegrationsPanel />
          <div className="message-container">
            {messages.map((message, index) => (
              <ChatMessage
                key={index}
                role={message.role}
                content={message.content}
                animate={index === messages.length - 1}
              />
            ))}
            {isLoading && (
              <ChatMessage
                role="assistant"
                content="Thinking..."
                animate={true}
              />
            )}
            <div ref={messagesEndRef} />
          </div>
        </div>
      </main>
      
      <footer className="glass-panel">
        <div className="max-w-3xl mx-auto">
          <ChatInput onSend={handleSendMessage} disabled={isLoading} />
        </div>
      </footer>
    </div>
  );
};

export default Index;