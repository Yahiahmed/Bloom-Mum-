import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { Link } from "wouter";

interface TopicCardProps {
  id: number;
  title: string;
  description: string;
  icon: string;
}

export default function TopicCard({ id, title, description, icon }: TopicCardProps) {
  return (
    <Link href={`/chat?topic=${id}`}>
      <a className="block">
        <Card className="topic-card border-0 shadow-sm hover:shadow transition-all duration-200">
          <CardContent className="p-4 flex items-start gap-3">
            <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
              <i className={cn(icon, "text-xl")}></i>
            </div>
            <div className="flex-1">
              <h3 className="font-medium text-neutral-800">{title}</h3>
              <p className="text-sm text-neutral-500 mt-1">{description}</p>
            </div>
          </CardContent>
        </Card>
      </a>
    </Link>
  );
}
