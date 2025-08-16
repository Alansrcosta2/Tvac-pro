import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Play, Tv, Video, Trash2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface Channel {
  id: number;
  name: string;
  type: 'tv' | 'vod';
  isActive?: boolean;
  url?: string;
}

interface ChannelSidebarProps {
  channels: Channel[];
  activeChannel: number;
  onChannelSelect: (channelId: number) => void;
  onChannelRemove?: (channelId: number) => void;
}

const ChannelSidebar = ({ channels, activeChannel, onChannelSelect, onChannelRemove }: ChannelSidebarProps) => {
  const { toast } = useToast();

  const handleRemoveChannel = (channelId: number, channelName: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (onChannelRemove) {
      onChannelRemove(channelId);
      toast({
        title: "Canal removido",
        description: `${channelName} foi removido da sua lista.`
      });
    }
  };
  return (
    <div className="w-80 bg-gradient-sidebar border-r border-border h-full min-h-screen">
      <div className="p-4 border-b border-border bg-tv-nav">
        <h2 className="text-tv-channel-text font-semibold text-lg mb-2">📺 Lista de Canais</h2>
        <p className="text-muted-foreground text-xs">Clique para selecionar</p>
      </div>
      
      <ScrollArea className="h-[calc(100vh-6rem)]">
        <div className="p-3">
          {channels.length === 0 ? (
            <div className="text-center text-muted-foreground py-8">
              <Tv className="w-8 h-8 mx-auto mb-2 opacity-50" />
              <p>Nenhum canal disponível</p>
            </div>
          ) : (
            channels.map((channel) => (
              <Button
                key={channel.id}
                variant="ghost"
                onClick={() => onChannelSelect(channel.id)}
                className={`w-full justify-start mb-2 p-4 transition-glow border group ${
                  activeChannel === channel.id
                    ? "bg-tv-channel-active text-primary-foreground shadow-glow border-primary"
                    : "text-tv-channel-text hover:bg-tv-sidebar-hover hover:text-primary border-transparent hover:border-border"
                }`}
              >
              <div className="flex items-center gap-3 w-full">
                <div className="flex-shrink-0">
                  {channel.type === 'tv' ? (
                    <Tv className="w-4 h-4" />
                  ) : (
                    <Video className="w-4 h-4" />
                  )}
                </div>
                <div className="flex items-center gap-2 flex-1">
                  <span className="text-sm font-medium">{channel.id}</span>
                  <span className="text-sm truncate">{channel.name}</span>
                </div>
                <div className="flex items-center gap-1">
                  {activeChannel === channel.id && (
                    <Play className="w-3 h-3 flex-shrink-0" />
                  )}
                  {onChannelRemove && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={(e) => handleRemoveChannel(channel.id, channel.name, e)}
                      className="h-6 w-6 p-0 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-destructive hover:text-destructive-foreground"
                    >
                      <Trash2 className="w-3 h-3" />
                    </Button>
                  )}
                </div>
              </div>
              </Button>
            ))
          )}
        </div>
      </ScrollArea>
    </div>
  );
};

export default ChannelSidebar;