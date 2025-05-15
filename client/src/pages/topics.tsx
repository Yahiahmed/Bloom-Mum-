import { Link } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { Skeleton } from "@/components/ui/skeleton";
import TopicCard from "@/components/topic-card";
import ResourceCard from "@/components/resource-card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { defaultTopics } from "@/lib/utils";

export default function Topics() {
  // Fetch topics
  const { data: topics, isLoading: isLoadingTopics } = useQuery({
    queryKey: ["/api/topics"],
  });

  // Fetch resources
  const { data: resources, isLoading: isLoadingResources } = useQuery({
    queryKey: ["/api/resources"],
  });

  // Display either server data or fallback data for topics
  const displayTopics = topics || defaultTopics;

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
          <h1 className="text-xl font-bold text-neutral-800">Pregnancy Topics</h1>
        </div>
      </header>

      {/* Tabs for Topics and Resources */}
      <Tabs defaultValue="topics" className="mb-8">
        <TabsList className="grid w-full grid-cols-2 mb-6">
          <TabsTrigger value="topics">Topics</TabsTrigger>
          <TabsTrigger value="resources">Resources</TabsTrigger>
        </TabsList>
        
        {/* Topics Tab */}
        <TabsContent value="topics">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {isLoadingTopics ? (
              // Skeleton loading state
              Array.from({ length: 8 }).map((_, i) => (
                <Skeleton key={i} className="h-24 rounded-xl" />
              ))
            ) : (
              // Display topics
              displayTopics.map((topic) => (
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
        </TabsContent>
        
        {/* Resources Tab */}
        <TabsContent value="resources">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {isLoadingResources ? (
              // Skeleton loading state
              Array.from({ length: 5 }).map((_, i) => (
                <Skeleton key={i} className="h-32 rounded-xl" />
              ))
            ) : resources?.length ? (
              // Display resources
              resources.map((resource: any) => (
                <ResourceCard
                  key={resource.id}
                  id={resource.id}
                  title={resource.title}
                  description={resource.description}
                  link={resource.link}
                />
              ))
            ) : (
              <div className="col-span-2 text-center py-10">
                <div className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 mb-4">
                  <i className="ri-book-read-line text-2xl text-primary"></i>
                </div>
                <h3 className="text-lg font-medium text-neutral-800 mb-2">No resources available</h3>
                <p className="text-neutral-500">Check back later for pregnancy resources</p>
              </div>
            )}
          </div>
        </TabsContent>
      </Tabs>

      {/* Disclaimer */}
      <div className="bg-neutral-100 rounded-lg p-3 mb-6">
        <p className="text-sm text-neutral-700">
          <i className="ri-information-line text-primary mr-1"></i> 
          Information provided is for educational purposes only and not a substitute for professional medical advice.
        </p>
      </div>
    </div>
  );
}
