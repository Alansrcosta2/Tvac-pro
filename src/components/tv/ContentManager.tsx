import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Upload, Plus, Download } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import FormatGuide from "./FormatGuide";

interface Channel {
  id: number;
  name: string;
  type: 'tv' | 'vod';
  program: string;
  time: string;
  url?: string;
  protocol?: 'HLS' | 'HTTP' | 'RTSP' | 'UDP';
  logo?: string;
}

interface ContentManagerProps {
  channels: Channel[];
  onChannelsUpdate: (channels: Channel[]) => void;
}

const ContentManager = ({ channels, onChannelsUpdate }: ContentManagerProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [newChannel, setNewChannel] = useState({
    name: '',
    type: 'tv' as 'tv' | 'vod',
    program: '',
    time: '',
    url: ''
  });
  const { toast } = useToast();

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const content = e.target?.result as string;
        let importedChannels: Channel[] = [];

        if (file.type === 'application/json') {
          // Formato JSON
          importedChannels = JSON.parse(content);
        } else if (file.type === 'text/csv' || file.name.endsWith('.csv')) {
          // Formato CSV
          const lines = content.split('\n');
          importedChannels = lines.slice(1).map((line, index) => {
            const values = line.split(',');
            return {
              id: channels.length + index + 1,
              name: values[0]?.trim() || '',
              type: (values[1]?.trim() as 'tv' | 'vod') || 'tv',
              program: values[2]?.trim() || '',
              time: values[3]?.trim() || '',
              url: values[4]?.trim() || ''
            };
          }).filter(channel => channel.name);
        } else if (file.name.endsWith('.m3u') || file.name.endsWith('.m3u8')) {
          // Formato M3U/M3U8 (IPTV padrão)
          const lines = content.split('\n');
          let currentChannel: Partial<Channel> = {};
          let channelIndex = 0;
          
          lines.forEach((line) => {
            line = line.trim();
            if (line.startsWith('#EXTINF:')) {
              // Extrai informações da linha EXTINF
              const nameMatch = line.match(/,(.+)$/);
              const groupMatch = line.match(/group-title="([^"]+)"/);
              const logoMatch = line.match(/tvg-logo="([^"]+)"/);
              
              currentChannel = {
                name: nameMatch ? nameMatch[1].trim() : `Canal ${channelIndex + 1}`,
                type: 'tv',
                program: groupMatch ? groupMatch[1] : 'Ao Vivo',
                time: '24h',
                logo: logoMatch ? logoMatch[1] : undefined
              };
            } else if (line && !line.startsWith('#') && currentChannel.name) {
              // URL do stream
              currentChannel.url = line;
              currentChannel.id = channels.length + importedChannels.length + 1;
              
              // Detecta protocolo
              if (line.includes('.m3u8')) {
                currentChannel.protocol = 'HLS';
              } else if (line.startsWith('rtsp://')) {
                currentChannel.protocol = 'RTSP';
              } else if (line.startsWith('udp://')) {
                currentChannel.protocol = 'UDP';
              } else {
                currentChannel.protocol = 'HTTP';
              }
              
              importedChannels.push(currentChannel as Channel);
              currentChannel = {};
              channelIndex++;
            }
          });
        } else if (file.name.endsWith('.xspf')) {
          // Formato XSPF
          const parser = new DOMParser();
          const xmlDoc = parser.parseFromString(content, 'text/xml');
          const tracks = xmlDoc.getElementsByTagName('track');
          
          Array.from(tracks).forEach((track, index) => {
            const title = track.getElementsByTagName('title')[0]?.textContent;
            const location = track.getElementsByTagName('location')[0]?.textContent;
            
            if (title && location) {
              importedChannels.push({
                id: channels.length + index + 1,
                name: title,
                type: 'tv',
                program: 'Ao Vivo',
                time: '24h',
                url: location
              });
            }
          });
        } else if (file.name.endsWith('.pls')) {
          // Formato PLS
          const lines = content.split('\n');
          let currentIndex = 1;
          
          lines.forEach(line => {
            if (line.startsWith(`File${currentIndex}=`)) {
              const url = line.split('=')[1]?.trim();
              const titleLine = lines.find(l => l.startsWith(`Title${currentIndex}=`));
              const title = titleLine ? titleLine.split('=')[1]?.trim() : `Canal ${currentIndex}`;
              
              if (url) {
                importedChannels.push({
                  id: channels.length + currentIndex,
                  name: title,
                  type: 'tv',
                  program: 'Ao Vivo',
                  time: '24h',
                  url: url
                });
              }
              currentIndex++;
            }
          });
        } else if (file.name.endsWith('.txt')) {
          // Formato TXT (URLs simples)
          const lines = content.split('\n');
          lines.forEach((line, index) => {
            line = line.trim();
            if (line && (line.startsWith('http') || line.startsWith('rtsp') || line.startsWith('udp'))) {
              importedChannels.push({
                id: channels.length + index + 1,
                name: `Canal ${index + 1}`,
                type: 'tv',
                program: 'Ao Vivo',
                time: '24h',
                url: line
              });
            }
          });
        }

        onChannelsUpdate([...channels, ...importedChannels]);
        toast({
          title: "Lista IPTV importada!",
          description: `${importedChannels.length} canais foram adicionados. Protocolos suportados: HLS, RTSP, HTTP, UDP.`
        });
      } catch (error) {
        toast({
          title: "Erro na importação",
          description: "Verifique se o arquivo está no formato correto (M3U, M3U8, XSPF, PLS, CSV, JSON, TXT).",
          variant: "destructive"
        });
      }
    };
    reader.readAsText(file);
  };

  const addChannel = () => {
    if (!newChannel.name) return;

    const channel: Channel = {
      id: Math.max(...channels.map(c => c.id), 0) + 1,
      ...newChannel
    };

    onChannelsUpdate([...channels, channel]);
    setNewChannel({ name: '', type: 'tv', program: '', time: '', url: '' });
    setIsOpen(false);
    
    toast({
      title: "Canal adicionado!",
      description: `${channel.name} foi adicionado à sua lista.`
    });
  };

  const exportChannels = () => {
    const dataStr = JSON.stringify(channels, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
    
    const exportFileDefaultName = 'tvac-pro-channels.json';
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();

    toast({
      title: "Lista exportada!",
      description: "Sua lista de canais foi salva como arquivo JSON."
    });
  };

  return (
    <div className="flex items-center gap-3">
      {/* Upload de arquivo */}
      <div className="relative">
        <input
          type="file"
          accept=".m3u,.m3u8,.xspf,.pls,.json,.csv,.txt"
          onChange={handleFileUpload}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
        />
        <Button variant="outline" size="sm" className="text-tv-channel-text hover:text-primary">
          <Upload className="w-4 h-4 mr-2" />
          Importar IPTV
        </Button>
      </div>

      {/* Adicionar canal manualmente */}
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogTrigger asChild>
          <Button variant="outline" size="sm" className="text-tv-channel-text hover:text-primary">
            <Plus className="w-4 h-4 mr-2" />
            Adicionar Canal
          </Button>
        </DialogTrigger>
        <DialogContent className="bg-card">
          <DialogHeader>
            <DialogTitle>Adicionar Novo Canal</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="name">Nome do Canal</Label>
              <Input
                id="name"
                value={newChannel.name}
                onChange={(e) => setNewChannel({...newChannel, name: e.target.value})}
                placeholder="Ex: TV Exemplo"
              />
            </div>
            <div>
              <Label htmlFor="type">Tipo</Label>
              <Select value={newChannel.type} onValueChange={(value: 'tv' | 'vod') => setNewChannel({...newChannel, type: value})}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="tv">TV ao Vivo</SelectItem>
                  <SelectItem value="vod">Vídeo On Demand</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="program">Programa Atual</Label>
              <Input
                id="program"
                value={newChannel.program}
                onChange={(e) => setNewChannel({...newChannel, program: e.target.value})}
                placeholder="Ex: Jornal Nacional"
              />
            </div>
            <div>
              <Label htmlFor="time">Horário</Label>
              <Input
                id="time"
                value={newChannel.time}
                onChange={(e) => setNewChannel({...newChannel, time: e.target.value})}
                placeholder="Ex: 20:30-21:15"
              />
            </div>
            <div>
              <Label htmlFor="url">URL do Stream</Label>
              <Input
                id="url"
                value={newChannel.url}
                onChange={(e) => setNewChannel({...newChannel, url: e.target.value})}
                placeholder="https://exemplo.com/stream.m3u8"
              />
            </div>
            <Button onClick={addChannel} className="w-full">
              Adicionar Canal
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Exportar lista */}
      <Button variant="outline" size="sm" onClick={exportChannels} className="text-tv-channel-text hover:text-primary">
        <Download className="w-4 h-4 mr-2" />
        Exportar
      </Button>

      {/* Contador de canais e guia */}
      <div className="flex items-center gap-3">
        <div className="text-muted-foreground text-sm">
          {channels.length} canais
        </div>
        <FormatGuide />
      </div>
    </div>
  );
};

export default ContentManager;