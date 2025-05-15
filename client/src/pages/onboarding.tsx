import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useLocation } from "wouter";

interface OnboardingProps {
  onComplete: () => void;
}

const onboardingSlides = [
  {
    image: "https://images.unsplash.com/photo-1515088126420-76ef05b449f2?ixlib=rb-4.0.3&auto=format&fit=crop&w=1024&h=600&q=80",
    title: "Your Pregnancy Helper",
    description: "Ask questions and get guidance throughout your pregnancy journey",
  },
  {
    image: "https://images.unsplash.com/photo-1516585427167-9f4af9627e6c?ixlib=rb-4.0.3&auto=format&fit=crop&w=1024&h=600&q=80",
    title: "Expert Information",
    description: "Access reliable information based on trusted medical sources",
  },
  {
    image: "https://images.unsplash.com/photo-1617187222314-36ac8e479aaa?ixlib=rb-4.0.3&auto=format&fit=crop&w=1024&h=600&q=80",
    title: "Stay Connected",
    description: "Save conversations and track your pregnancy questions and answers",
  },
];

export default function Onboarding({ onComplete }: OnboardingProps) {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [_, navigate] = useLocation();

  // Handle next slide
  const handleNext = () => {
    if (currentSlide < onboardingSlides.length - 1) {
      setCurrentSlide(currentSlide + 1);
    } else {
      // Complete onboarding
      onComplete();
      navigate("/");
    }
  };

  // Skip onboarding
  const handleSkip = () => {
    onComplete();
    navigate("/");
  };

  const slide = onboardingSlides[currentSlide];

  return (
    <div className="min-h-screen flex flex-col bg-white">
      {/* Onboarding Slider */}
      <div className="flex-1 flex flex-col">
        {/* Image section */}
        <div 
          className="h-1/2 bg-cover bg-center" 
          style={{ backgroundImage: `url('${slide.image}')` }}
        />
        
        {/* Content section */}
        <div className="h-1/2 flex flex-col items-center justify-center p-6 text-center">
          <div className="w-full max-w-md">
            <h2 className="font-bold text-3xl mb-3 text-neutral-800">{slide.title}</h2>
            <p className="text-neutral-600 mb-6">{slide.description}</p>
            
            {/* Pagination Dots */}
            <div className="flex justify-center mb-8">
              {onboardingSlides.map((_, index) => (
                <span 
                  key={index}
                  className={`h-2 w-2 rounded-full mx-1 ${
                    index === currentSlide ? "bg-primary" : "bg-neutral-300"
                  }`}
                />
              ))}
            </div>
            
            <Button 
              onClick={handleNext} 
              className="w-full bg-primary hover:bg-primary/90 py-6 mb-3"
            >
              {currentSlide < onboardingSlides.length - 1 ? "Continue" : "Get Started"}
            </Button>
            
            {currentSlide < onboardingSlides.length - 1 && (
              <Button 
                variant="outline" 
                onClick={handleSkip}
                className="w-full border-primary text-primary hover:bg-primary/5 py-6"
              >
                Skip
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
