import { Link } from "wouter";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";
import { Trash2 } from "lucide-react";
import { formatDate } from "@/lib/utils";

export default function SavedResponses() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  // Fetch all conversations
  const { data: conversations = [], isLoading } = useQuery({
    queryKey: ["/api/conversations"],
  });

  // Delete conversation mutation
  const deleteConversationMutation = useMutation({
    mutationFn: async (id: number) => {
      return apiRequest("DELETE", `/api/conversations/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/conversations"] });
      toast({
        title: "Conversation deleted",
        description: "The conversation has been removed from your saved responses.",
      });
    },
    onError: (error) => {
      toast({
        title: "Failed to delete conversation",
        description: `${error}`,
        variant: "destructive",
      });
    },
  });

  // Handle delete conversation
  const handleDelete = (id: number, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (confirm("Are you sure you want to delete this conversation?")) {
      deleteConversationMutation.mutateAsync(id);
    }
  };

  return (
    <div className="container mx-auto px-4 py-6">
      {/* Header */}
      <header className="flex items-center justify-between mb-6">
        <div className="flex items-center">
          <Link href="/">
            <a className="p-2 mr-3 bg-white rounded-full shadow-sm text-neutral-800">
              <i className="ri-arrow-left-s-line"></i>
            </a>
          </Link>
          <h1 className="text-xl font-bold text-neutral-800">Saved Responses</h1>
        </div>
      </header>

      {/* Saved Conversations List */}
      <div className="space-y-4">
        {isLoading ? (
          // Skeleton loading state
          Array.from({ length: 5 }).map((_, i) => (
            <Card key={i} className="border-0 shadow-sm">
              <CardContent className="p-4">
                <Skeleton className="h-6 w-3/4 mb-2" />
                <Skeleton className="h-4 w-1/3 mb-2" />
                <div className="flex justify-end">
                  <Skeleton className="h-8 w-20" />
                </div>
              </CardContent>
            </Card>
          ))
        ) : conversations.length > 0 ? (
          // Display saved conversations
          conversations.map((conversation: any) => (
            <Link key={conversation.id} href={`/chat/${conversation.id}`}>
              <a className="block">
                <Card className="border-0 shadow-sm hover:shadow transition-all duration-200">
                  <CardContent className="p-4">
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="font-medium text-neutral-800">{conversation.title}</h4>
                        <p className="text-sm text-neutral-500 mt-1">
                          {formatDate(conversation.updatedAt)}
                        </p>
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={(e) => handleDelete(conversation.id, e)}
                        className="text-neutral-400 hover:text-destructive"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </a>
            </Link>
          ))
        ) : (
          // Empty state
          <div className="text-center py-10">
            <div className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 mb-4">
              <i className="ri-chat-3-line text-2xl text-primary"></i>
            </div>
            <h3 className="text-lg font-medium text-neutral-800 mb-2">No saved conversations yet</h3>
            <p className="text-neutral-500 mb-6">Start a chat to save your conversations</p>
            <Link href="/chat">
              <a>
                <Button className="bg-primary hover:bg-primary/90">Start a New Chat</Button>
              </a>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
