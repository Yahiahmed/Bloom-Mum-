import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ExternalLink } from "lucide-react";

interface ResourceCardProps {
  id: number;
  title: string;
  description: string;
  link?: string;
}

export default function ResourceCard({ title, description, link }: ResourceCardProps) {
  return (
    <Card className="border-0 shadow-sm">
      <CardContent className="p-4">
        <h3 className="font-medium text-neutral-800">{title}</h3>
        <p className="text-sm text-neutral-500 mt-1 mb-3">{description}</p>
        
        {link && (
          <a href={link} target="_blank" rel="noopener noreferrer">
            <Button variant="outline" size="sm" className="w-full flex items-center gap-1">
              <span className="flex-1 text-left">View Resource</span>
              <ExternalLink className="h-4 w-4" />
            </Button>
          </a>
        )}
      </CardContent>
    </Card>
  );
}
