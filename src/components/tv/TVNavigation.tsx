import { Button } from "@/components/ui/button";

interface TVNavigationProps {
  activeSection: string;
  onSectionChange: (section: string) => void;
}

const TVNavigation = ({ activeSection, onSectionChange }: TVNavigationProps) => {
  const navItems = [
    { id: 'tv', label: 'TV' },
    { id: 'destaques', label: 'DESTAQUES' },
    { id: 'filmes', label: 'FILMES' },
    { id: 'series', label: 'SÉRIES' },
    { id: 'kids', label: 'KIDS' },
    { id: 'explorar', label: 'EXPLORAR' }
  ];

  return (
    <nav className="flex items-center gap-8 px-8 py-4 bg-tv-nav border-b border-border">
      <div className="flex items-center gap-2">
        <div className="w-8 h-8 bg-gradient-accent rounded-full flex items-center justify-center">
          <span className="text-background font-bold text-sm">T</span>
        </div>
        <span className="text-tv-channel-text font-bold text-lg">TVAC Pro</span>
      </div>
      
      <div className="flex items-center gap-6 ml-8">
        {navItems.map((item) => (
          <Button
            key={item.id}
            variant={activeSection === item.id ? "default" : "ghost"}
            onClick={() => onSectionChange(item.id)}
            className={`px-4 py-2 text-sm font-medium transition-smooth ${
              activeSection === item.id
                ? "bg-primary text-primary-foreground shadow-glow"
                : "text-tv-channel-text hover:text-primary hover:bg-tv-sidebar-hover"
            }`}
          >
            {item.label}
          </Button>
        ))}
      </div>
      
      <div className="ml-auto flex items-center gap-4">
        <div className="text-tv-channel-text text-sm">
          Exp: 17-01-2021 | Perfs | 15:33
        </div>
      </div>
    </nav>
  );
};

export default TVNavigation;