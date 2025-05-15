import { Link, useLocation } from "wouter";
import { cn } from "@/lib/utils";

export default function Navigation() {
  const [location] = useLocation();

  // Define navigation items
  const navItems = [
    {
      label: "Home",
      path: "/",
      icon: "ri-home-4-line",
    },
    {
      label: "Topics",
      path: "/topics",
      icon: "ri-book-read-line",
    },
    {
      label: "Chat",
      path: "/chat",
      icon: "ri-chat-3-line",
    },
    {
      label: "Saved",
      path: "/saved",
      icon: "ri-bookmark-line",
    },
  ];

  // Check if the current location matches the nav item's path
  const isActive = (path: string) => {
    if (path === "/") {
      return location === path;
    }
    return location.startsWith(path);
  };

  return (
    <footer className="bg-white border-t border-neutral-200 py-2 sticky bottom-0 z-10">
      <div className="container mx-auto">
        <nav>
          <ul className="flex justify-around">
            {navItems.map((item) => (
              <li key={item.path}>
                <Link href={item.path}>
                  <a 
                    className={cn(
                      "flex flex-col items-center p-2 transition-colors",
                      isActive(item.path) 
                        ? "text-primary" 
                        : "text-neutral-400 hover:text-primary"
                    )}
                  >
                    <i className={`${item.icon} text-xl`}></i>
                    <span className="text-xs mt-1">{item.label}</span>
                  </a>
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </footer>
  );
}
