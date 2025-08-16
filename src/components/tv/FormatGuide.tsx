import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { FileText, Download, Info } from "lucide-react";
import { Separator } from "@/components/ui/separator";

const FormatGuide = () => {
  const formats = [
    {
      category: "🔴 Listas IPTV (Recomendado)",
      items: [
        { name: "M3U / M3U8", desc: "Padrão IPTV mais usado. Suporta HLS, RTSP, HTTP, UDP" },
        { name: "XSPF", desc: "Playlist XML. Usado em alguns players" },
        { name: "PLS", desc: "Formato Winamp/VLC. Simples e compatível" },
        { name: "TXT", desc: "URLs simples, uma por linha" }
      ]
    },
    {
      category: "📊 Dados Estruturados", 
      items: [
        { name: "JSON", desc: "Formato estruturado com metadados completos" },
        { name: "CSV", desc: "Planilha: nome,tipo,programa,horário,url" }
      ]
    },
    {
      category: "🎬 Protocolos Suportados",
      items: [
        { name: "HLS (.m3u8)", desc: "HTTP Live Streaming - mais estável" },
        { name: "HTTP/HTTPS", desc: "Links diretos de vídeo" },
        { name: "RTSP", desc: "Tempo real - câmeras, TV corporativa" },
        { name: "UDP/Multicast", desc: "Redes locais, operadoras" }
      ]
    }
  ];

  const exampleM3U = `#EXTM3U
#EXTINF:-1 tvg-logo="logo.png" group-title="Notícias",Globo News
https://exemplo.com/globonews.m3u8
#EXTINF:-1 group-title="Esportes",ESPN Brasil  
https://exemplo.com/espn.m3u8`;

  const exampleCSV = `nome,tipo,programa,horário,url
Globo News,tv,Jornal das 10,24h,https://exemplo.com/globonews.m3u8
ESPN Brasil,tv,SportsCenter,24h,https://exemplo.com/espn.m3u8`;

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-primary">
          <Info className="w-4 h-4 mr-2" />
          Formatos
        </Button>
      </DialogTrigger>
      <DialogContent className="bg-card max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>📺 Formatos IPTV Suportados</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          {formats.map((category, idx) => (
            <div key={idx}>
              <h3 className="font-semibold text-lg mb-3">{category.category}</h3>
              <div className="space-y-2">
                {category.items.map((item, itemIdx) => (
                  <div key={itemIdx} className="flex justify-between items-start p-3 bg-muted/50 rounded-lg">
                    <div>
                      <span className="font-medium text-primary">{item.name}</span>
                      <p className="text-sm text-muted-foreground mt-1">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
          
          <Separator />
          
          <div>
            <h3 className="font-semibold text-lg mb-3">📝 Exemplos de Formato</h3>
            
            <div className="space-y-4">
              <div>
                <h4 className="font-medium mb-2">M3U/M3U8:</h4>
                <pre className="bg-muted p-3 rounded text-xs overflow-x-auto">
                  {exampleM3U}
                </pre>
              </div>
              
              <div>
                <h4 className="font-medium mb-2">CSV:</h4>
                <pre className="bg-muted p-3 rounded text-xs overflow-x-auto">
                  {exampleCSV}
                </pre>
              </div>
            </div>
          </div>
          
          <div className="bg-primary/10 p-4 rounded-lg">
            <h4 className="font-medium text-primary mb-2">💡 Dica Profissional:</h4>
            <p className="text-sm text-muted-foreground">
              Para melhor compatibilidade, use <strong>M3U8 com links HLS</strong>. 
              Formato mais estável e suportado por praticamente todos os players IPTV modernos.
            </p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default FormatGuide;