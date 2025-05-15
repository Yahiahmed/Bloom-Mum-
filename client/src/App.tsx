import { Switch, Route, useLocation } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/not-found";
import Home from "@/pages/home";
import Chat from "@/pages/chat";
import Onboarding from "@/pages/onboarding";
import SavedResponses from "@/pages/saved-responses";
import Topics from "@/pages/topics";
import Navigation from "@/components/navigation";
import { useEffect, useState } from "react";

function Router() {
  const [location] = useLocation();
  const [isFirstVisit, setIsFirstVisit] = useState(false);

  useEffect(() => {
    // Check if this is the first visit
    const hasVisitedBefore = localStorage.getItem("hasVisitedBefore");
    if (!hasVisitedBefore) {
      setIsFirstVisit(true);
      localStorage.setItem("hasVisitedBefore", "true");
    }
  }, []);

  // If it's the first visit and we're on the home page, show onboarding
  if (isFirstVisit && location === "/") {
    return <Onboarding onComplete={() => setIsFirstVisit(false)} />;
  }

  return (
    <div className="min-h-screen flex flex-col bg-neutral-50">
      {/* Main content */}
      <main className="flex-1">
        <Switch>
          <Route path="/" component={Home} />
          <Route path="/chat/:id?" component={Chat} />
          <Route path="/saved" component={SavedResponses} />
          <Route path="/topics" component={Topics} />
          <Route path="/onboarding" component={() => <Onboarding onComplete={() => setIsFirstVisit(false)} />} />
          {/* Fallback to 404 */}
          <Route component={NotFound} />
        </Switch>
      </main>

      {/* Navigation footer - only show on certain routes */}
      {["/", "/chat", "/saved", "/topics"].includes(location.split("/")[1] ? `/${location.split("/")[1]}` : location) && (
        <Navigation />
      )}
    </div>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Router />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
