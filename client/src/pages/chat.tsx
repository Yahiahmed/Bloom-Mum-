import { useEffect, useRef, useState } from "react";
import { useLocation, useParams, Link } from "wouter";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import ChatMessage from "@/components/chat-message";
import { Skeleton } from "@/components/ui/skeleton";
import { Send } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";

export default function Chat() {
  const { id } = useParams();
  const [location] = useLocation();
  const params = new URLSearchParams(window.location.search);
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  // Parse topic from URL if present
  const topicId = params.get("topic");

  // If topicId is present, fetch the topic details
  const { data: topicData } = useQuery({
    queryKey: topicId ? [`/api/topics/${topicId}`] : ['no-topic'],
    enabled: !!topicId,
  }) as { data?: { title: string, description: string } };

  // Fetch conversation if id is provided
  const { data: conversation } = useQuery({
    queryKey: id ? [`/api/conversations/${id}`] : ['no-conversation'],
    enabled: !!id,
  }) as { data?: { title: string } };

  // Fetch messages if conversation id is provided
  const { data: messages = [], isLoading: isLoadingMessages } = useQuery({
    queryKey: id ? [`/api/conversations/${id}/messages`] : ['no-messages'],
    enabled: !!id,
  }) as { data: any[], isLoading: boolean };

  // Mutation for sending messages
  const sendMessageMutation = useMutation({
    mutationFn: async (data: { message: string; conversationId?: number }) => {
      return apiRequest("POST", "/api/chat", data);
    },
    onSuccess: async (response) => {
      const data = await response.json();
      setMessage("");
      setIsLoading(false);

      // Invalidate the conversation cache
      if (data.conversationId) {
        queryClient.invalidateQueries({ queryKey: [`/api/conversations/${data.conversationId}/messages`] });
        queryClient.invalidateQueries({ queryKey: [`/api/conversations/${data.conversationId}`] });
        queryClient.invalidateQueries({ queryKey: [`/api/conversations`] });
        
        // If this is a new conversation (no id in params), navigate to the conversation
        if (!id) {
          navigate(`/chat/${data.conversationId}`);
        }
      }
    },
    onError: (error) => {
      setIsLoading(false);
      toast({
        title: "Failed to send message",
        description: `${error}`,
        variant: "destructive",
      });
    },
  });

  // Scroll to bottom of messages when new messages arrive
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  // Focus input when component mounts
  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, [id]);

  // Pre-populate message if topic is selected
  useEffect(() => {
    if (topicData?.title && !id) {
      setMessage(`Tell me about ${topicData.title.toLowerCase()}`);
    }
  }, [topicData, id]);

  const navigate = (path: string) => {
    window.location.href = path;
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!message.trim()) return;
    
    setIsLoading(true);
    
    // Add a temporary user message to UI
    const tempUserMessage = {
      id: Date.now(),
      content: message,
      role: "user" as const,
      createdAt: new Date(),
    };
    
    if (id) {
      // Update local messages state optimistically
      queryClient.setQueryData([`/api/conversations/${id}/messages`], (oldData: any) => {
        return [...(oldData || []), tempUserMessage];
      });
    }
    
    // Send message to server
    await sendMessageMutation.mutateAsync({
      message,
      conversationId: id ? parseInt(id) : undefined,
    });
  };

  return (
    <div className="container mx-auto px-4 py-6">
      {/* Chat Header */}
      <div className="flex items-center mb-6">
        <Link href="/">
          <a className="p-2 mr-3 bg-white rounded-full shadow-sm text-neutral-800">
            <i className="ri-arrow-left-s-line"></i>
          </a>
        </Link>
        <h2 className="font-bold text-xl text-neutral-800">
          {conversation?.title || topicData?.title || "New Conversation"}
        </h2>
      </div>

      {/* Disclaimer */}
      <div className="bg-neutral-100 rounded-lg p-3 mb-6">
        <p className="text-sm text-neutral-700">
          <i className="ri-information-line text-primary mr-1"></i> 
          Information provided is for educational purposes only and not a substitute for professional medical advice.
        </p>
      </div>

      {/* Topic suggestion prompt if new chat */}
      {!id && !topicId && (
        <Card className="mb-6 border-0 shadow-sm bg-primary/5">
          <div className="p-4">
            <h3 className="font-medium text-primary mb-2">Suggested Questions:</h3>
            <div className="space-y-2">
              {[
                "What foods should I avoid during pregnancy?",
                "How can I manage morning sickness?",
                "Is it safe to exercise during pregnancy?",
                "What prenatal vitamins should I take?",
              ].map((suggestion, index) => (
                <button
                  key={index}
                  className="block w-full text-left p-2 rounded-lg bg-white text-sm hover:bg-primary/5 transition-colors"
                  onClick={() => setMessage(suggestion)}
                >
                  {suggestion}
                </button>
              ))}
            </div>
          </div>
        </Card>
      )}

      {/* Chat Messages */}
      <div className="mb-4 space-y-4">
        {isLoadingMessages ? (
          // Skeleton loading state
          Array.from({ length: 3 }).map((_, index) => (
            <div key={index} className={cn("flex items-start", index % 2 === 0 ? "" : "justify-end")}>
              <Skeleton
                className={cn(
                  "rounded-2xl p-4 h-24 w-4/5",
                  index % 2 === 0 ? "rounded-tl-none" : "rounded-tr-none"
                )}
              />
            </div>
          ))
        ) : (
          // Display messages or welcome message if no messages yet
          Array.isArray(messages) && messages.length > 0 ? (
            messages.map((msg: any) => (
              <ChatMessage
                key={msg.id}
                content={msg.content}
                role={msg.role}
                timestamp={msg.createdAt}
              />
            ))
          ) : (
            <ChatMessage
              content="Hello! I'm your pregnancy assistant. How can I help you today?"
              role="assistant"
            />
          )
        )}
        
        {/* Invisible div for scrolling to bottom */}
        <div ref={messagesEndRef} />
        
        {/* Loading indicator for AI response */}
        {isLoading && (
          <div className="flex items-start">
            <div className="bg-primary/10 rounded-2xl rounded-tl-none p-4 chat-message flex items-center">
              <div className="animate-pulse flex space-x-2">
                <div className="h-2 w-2 bg-primary rounded-full"></div>
                <div className="h-2 w-2 bg-primary rounded-full"></div>
                <div className="h-2 w-2 bg-primary rounded-full"></div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Chat Input */}
      <div className="sticky bottom-0 bg-neutral-50 pt-3 pb-6">
        <form onSubmit={handleSendMessage} className="flex items-center">
          <Input
            ref={inputRef}
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Type your question..."
            className="rounded-full border-neutral-200 bg-white shadow-sm"
            disabled={isLoading}
          />
          <Button 
            type="submit" 
            size="icon" 
            className="rounded-full ml-2 bg-primary hover:bg-primary/90"
            disabled={isLoading || !message.trim()}
          >
            <Send className="h-5 w-5" />
          </Button>
        </form>
      </div>
    </div>
  );
}
