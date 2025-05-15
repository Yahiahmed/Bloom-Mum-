import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link, useLocation } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { Skeleton } from "@/components/ui/skeleton";
import TopicCard from "@/components/topic-card";
import { useToast } from "@/hooks/use-toast";
import { defaultTopics } from "@/lib/utils";

export default function Home() {
  const [_, navigate] = useLocation();
  const { toast } = useToast();

  // Fetch topics
  const { data: topics, isLoading: isLoadingTopics } = useQuery({
    queryKey: ["/api/topics"],
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
  
  // Fetch recent conversations
  const { data: conversations, isLoading: isLoadingConversations } = useQuery({
    queryKey: ["/api/conversations"],
    staleTime: 1000 * 60, // 1 minute
  });

  // Start a new chat
  const startNewChat = () => {
    navigate("/chat");
  };

  // Handle image click for visual search (mock for this demo)
  const handleImageSearch = () => {
    toast({
      title: "Feature Coming Soon",
      description: "Visual search for pregnancy products will be available in the next update.",
    });
  };

  // Display either server data or fallback data for topics
  const displayTopics = topics || defaultTopics;
  
  // Get most recent conversations (up to 3)
  const recentConversations = conversations?.slice(0, 3) || [];

  return (
    <div className="container mx-auto px-4 py-6">
      {/* Header */}
      <header className="flex items-center justify-between mb-6">
        <div className="flex items-center">
          <i className="ri-parent-line text-primary text-3xl mr-2"></i>
          <h1 className="text-xl font-bold text-neutral-800">BloomMom</h1>
        </div>
      </header>

      {/* Welcome Message */}
      <section className="mb-8">
        <h2 className="font-bold text-2xl md:text-3xl text-neutral-800 mb-2">Hello, Mommy</h2>
        <p className="text-neutral-600">Get answers to your pregnancy questions with our AI assistant</p>
      </section>

      {/* Quick Action Buttons */}
      <section className="mb-8">
        <Card className="border-0 shadow-sm">
          <CardContent className="p-4">
            <Button 
              onClick={startNewChat}
              className="w-full flex items-center justify-center gap-2 bg-primary hover:bg-primary/90 py-6"
            >
              <i className="ri-chat-3-line text-xl"></i>
              <span className="text-base">Ask a Question</span>
            </Button>
          </CardContent>
        </Card>
      </section>

      {/* Popular Topics */}
      <section className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold text-lg text-neutral-800">Popular Topics</h3>
          <Link href="/topics">
            <a className="text-sm text-primary font-medium">See all</a>
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {isLoadingTopics ? (
            // Skeleton loading state
            Array.from({ length: 4 }).map((_, i) => (
              <Card key={i} className="border-0 shadow-sm">
                <CardContent className="p-4 flex items-start gap-3">
                  <Skeleton className="h-10 w-10 rounded-full" />
                  <div className="flex-1">
                    <Skeleton className="h-5 w-3/4 mb-2" />
                    <Skeleton className="h-4 w-full" />
                  </div>
                </CardContent>
              </Card>
            ))
          ) : (
            // Display popular topics (first 4)
            displayTopics.slice(0, 4).map((topic) => (
              <TopicCard
                key={topic.id}
                id={topic.id}
                title={topic.title}
                description={topic.description}
                icon={topic.icon}
              />
            ))
          )}
        </div>
      </section>

      {/* Recent Conversations */}
      {recentConversations.length > 0 && (
        <section className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-lg text-neutral-800">Recent Conversations</h3>
            <Link href="/saved">
              <a className="text-sm text-primary font-medium">See all</a>
            </Link>
          </div>

          <div className="space-y-3">
            {isLoadingConversations ? (
              // Skeleton loading state
              Array.from({ length: 3 }).map((_, i) => (
                <Card key={i} className="border-0 shadow-sm">
                  <CardContent className="p-4">
                    <Skeleton className="h-5 w-3/4 mb-2" />
                    <Skeleton className="h-4 w-1/3" />
                  </CardContent>
                </Card>
              ))
            ) : (
              // Display recent conversations
              recentConversations.map((conversation) => (
                <Link key={conversation.id} href={`/chat/${conversation.id}`}>
                  <a className="block">
                    <Card className="border-0 shadow-sm hover:shadow transition-all duration-200">
                      <CardContent className="p-4">
                        <h4 className="font-medium text-neutral-800">{conversation.title}</h4>
                        <p className="text-sm text-neutral-500 mt-1">
                          {new Date(conversation.updatedAt).toLocaleDateString()}
                        </p>
                      </CardContent>
                    </Card>
                  </a>
                </Link>
              ))
            )}
          </div>
        </section>
      )}

      {/* Resources Banner */}
      <section className="bg-gradient-to-r from-primary-light to-primary rounded-2xl p-5 text-white shadow-sm mb-8">
        <div className="flex flex-col md:flex-row items-center">
          <div className="flex-1 mb-4 md:mb-0 md:mr-4">
            <h3 className="font-bold text-xl mb-2">Need pregnancy guidance?</h3>
            <p className="text-white/90 mb-4">Explore our curated resources for expectant mothers</p>
            <Link href="/topics">
              <a className="bg-white text-primary font-medium px-5 py-2.5 rounded-lg hover:bg-neutral-50 shadow-sm inline-flex items-center">
                <i className="ri-book-read-line mr-2"></i>
                View Resources
              </a>
            </Link>
          </div>
          <div className="w-full md:w-1/3 flex justify-center">
            <img 
              src="https://images.unsplash.com/photo-1516585427167-9f4af9627e6c?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&h=300&q=80" 
              alt="Pregnancy Resources" 
              className="h-32 w-32 object-cover rounded-full border-4 border-white shadow-md"
              onClick={handleImageSearch} 
            />
          </div>
        </div>
      </section>

      {/* Disclaimer */}
      <section className="mb-8">
        <div className="bg-neutral-100 rounded-lg p-3">
          <p className="text-sm text-neutral-700">
            <i className="ri-information-line text-primary mr-1"></i> 
            Information provided is for educational purposes only and not a substitute for professional medical advice.
          </p>
        </div>
      </section>
    </div>
  );
}
