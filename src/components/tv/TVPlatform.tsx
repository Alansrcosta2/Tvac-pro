import { useState, useEffect } from "react";
import TVNavigation from "./TVNavigation";
import ChannelSidebar from "./ChannelSidebar";
import VideoPlayer from "./VideoPlayer";
import ContentManager from "./ContentManager";

interface Channel {
  id: number;
  name: string;
  type: 'tv' | 'vod';
  program: string;
  time: string;
  url?: string;
}

const TVPlatform = () => {
  const [activeSection, setActiveSection] = useState('tv');
  const [activeChannel, setActiveChannel] = useState(1);
  const [channels, setChannels] = useState<Channel[]>([]);

  // Canais padrão/exemplo
  const defaultChannels: Channel[] = [
    { id: 1, name: 'TV Brasil Esperança', type: 'tv', program: 'Programa Especial', time: '22:00-23:30' },
    { id: 2, name: 'TV CÂMARA', type: 'tv', program: 'Sessão ao Vivo', time: '20:00-22:00' },
    { id: 3, name: 'TV Justiça', type: 'tv', program: 'Jornal da Justiça', time: '21:00-21:30' },
  ];

  // Carregar lista do localStorage ao iniciar
  useEffect(() => {
    const savedChannels = localStorage.getItem('tvac-pro-channels');
    if (savedChannels) {
      try {
        const parsedChannels = JSON.parse(savedChannels);
        setChannels(parsedChannels);
        if (parsedChannels.length > 0) {
          setActiveChannel(parsedChannels[0].id);
        }
      } catch (error) {
        console.error('Erro ao carregar canais salvos:', error);
        setChannels(defaultChannels);
      }
    } else {
      setChannels(defaultChannels);
    }
  }, []);

  // Salvar lista no localStorage quando atualizada
  const updateChannels = (newChannels: Channel[]) => {
    setChannels(newChannels);
    localStorage.setItem('tvac-pro-channels', JSON.stringify(newChannels));
  };

  // Remover canal
  const removeChannel = (channelId: number) => {
    const newChannels = channels.filter(ch => ch.id !== channelId);
    updateChannels(newChannels);
    
    // Se removeu o canal ativo, selecionar o primeiro disponível
    if (activeChannel === channelId && newChannels.length > 0) {
      setActiveChannel(newChannels[0].id);
    }
  };

  const currentChannel = channels.find(ch => ch.id === activeChannel) || channels[0];

  return (
    <div className="min-h-screen bg-gradient-main">
      <TVNavigation 
        activeSection={activeSection}
        onSectionChange={setActiveSection}
      />
      
      {/* Barra de gerenciamento de conteúdo */}
      <div className="border-b border-border bg-tv-nav px-8 py-3">
        <ContentManager 
          channels={channels}
          onChannelsUpdate={updateChannels}
        />
      </div>
      
      <div className="flex h-[calc(100vh-8rem)]">
        <ChannelSidebar
          channels={channels}
          activeChannel={activeChannel}
          onChannelSelect={setActiveChannel}
          onChannelRemove={removeChannel}
        />
        
        {currentChannel ? (
          <VideoPlayer currentChannel={currentChannel} />
        ) : (
          <div className="flex-1 bg-gradient-player p-6 flex items-center justify-center">
            <div className="text-center text-muted-foreground">
              <h3 className="text-xl font-semibold mb-2">Nenhum canal disponível</h3>
              <p>Importe ou adicione canais para começar a assistir</p>
            </div>
          </div>
        )}
      </div>
      
      {/* Ambient Glow Effects */}
      <div className="fixed top-1/4 left-1/4 w-96 h-96 bg-gradient-glow rounded-full blur-3xl opacity-30 pointer-events-none" />
      <div className="fixed bottom-1/4 right-1/4 w-64 h-64 bg-tv-purple/20 rounded-full blur-3xl opacity-40 pointer-events-none" />
    </div>
  );
};

export default TVPlatform;