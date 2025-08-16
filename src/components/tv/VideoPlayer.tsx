import { Play, Volume2, Maximize, Settings } from "lucide-react";
import { Button } from "@/components/ui/button";
import heroContent from "@/assets/hero-content.jpg";

interface VideoPlayerProps {
  currentChannel: {
    id: number;
    name: string;
    program: string;
    time: string;
  };
}

const VideoPlayer = ({ currentChannel }: VideoPlayerProps) => {
  return (
    <div className="flex-1 bg-gradient-player p-6">
      <div className="relative aspect-video bg-tv-player rounded-lg overflow-hidden shadow-player">
        {/* Video Content */}
        <div className="absolute inset-0">
          <img 
            src={heroContent}
            alt="TV Content"
            className="w-full h-full object-cover"
          />
          
          {/* Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
          
          {/* Controls Overlay */}
          <div className="absolute inset-0 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity duration-300 bg-black/20">
            <Button
              variant="ghost"
              size="lg"
              className="w-16 h-16 rounded-full bg-primary/80 hover:bg-primary text-primary-foreground shadow-glow"
            >
              <Play className="w-8 h-8 ml-1" />
            </Button>
          </div>
          
          {/* Bottom Controls */}
          <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/80 to-transparent">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <Button variant="ghost" size="sm" className="text-white hover:text-primary">
                  <Play className="w-4 h-4" />
                </Button>
                <Button variant="ghost" size="sm" className="text-white hover:text-primary">
                  <Volume2 className="w-4 h-4" />
                </Button>
                <div className="text-white text-sm">
                  <span className="font-medium">{currentChannel.program}</span> • {currentChannel.time}
                </div>
              </div>
              
              <div className="flex items-center gap-2">
                <Button variant="ghost" size="sm" className="text-white hover:text-primary">
                  <Settings className="w-4 h-4" />
                </Button>
                <Button variant="ghost" size="sm" className="text-white hover:text-primary">
                  <Maximize className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Program Info */}
      <div className="mt-6 p-4 bg-card rounded-lg shadow-card">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-tv-channel-text font-semibold text-lg">{currentChannel.name}</h3>
            <p className="text-muted-foreground">{currentChannel.program}</p>
            <p className="text-sm text-muted-foreground mt-1">{currentChannel.time}</p>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
            <span className="text-sm text-muted-foreground">AO VIVO</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VideoPlayer;