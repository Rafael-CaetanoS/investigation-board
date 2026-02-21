import { useState } from 'react';
import { CardType } from '@/types/board';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { User, Search, Lightbulb, Clock, Plus, ImageIcon } from 'lucide-react';
import { profileImages, evidenceImages } from '@/data/presetImages';
import { PresetImage } from '@/types/board';

const types: { value: CardType; label: string; icon: typeof User; colorVar: string }[] = [
  { value: 'suspect', label: 'Suspeito', icon: User, colorVar: '--suspect' },
  { value: 'evidence', label: 'Prova', icon: Search, colorVar: '--evidence' },
  { value: 'theory', label: 'Teoria', icon: Lightbulb, colorVar: '--theory' },
  { value: 'timeline', label: 'Horário', icon: Clock, colorVar: '--timeline-color' },
];

interface Props {
  onAdd: (type: CardType, title: string, description: string, imageUrl?: string) => void;
}

export default function AddItemDialog({ onAdd }: Props) {
  const [open, setOpen] = useState(false);
  const [selectedType, setSelectedType] = useState<CardType>('suspect');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [selectedImage, setSelectedImage] = useState<string | undefined>(undefined);

  const availableImages: PresetImage[] = 
    selectedType === 'suspect' ? profileImages :
    selectedType === 'evidence' ? evidenceImages : [];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;
    onAdd(selectedType, title.trim(), description.trim(), selectedImage);
    setTitle('');
    setDescription('');
    setSelectedImage(undefined);
    setOpen(false);
  };

  const handleTypeChange = (type: CardType) => {
    setSelectedType(type);
    setSelectedImage(undefined);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm" className="gap-1.5 font-detective text-[10px] tracking-wider bg-primary text-primary-foreground hover:bg-primary/90 h-8">
          <Plus size={13} />
          ADICIONAR
        </Button>
      </DialogTrigger>
      <DialogContent className="bg-background border-border max-w-md">
        <DialogHeader>
          <DialogTitle className="font-display text-foreground text-lg font-bold">Nova Ficha</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Type selector */}
          <div className="grid grid-cols-4 gap-1.5">
            {types.map(t => {
              const Icon = t.icon;
              const isSelected = selectedType === t.value;
              return (
                <button
                  key={t.value}
                  type="button"
                  onClick={() => handleTypeChange(t.value)}
                  className={`
                    flex flex-col items-center gap-1 p-2.5 rounded border text-[10px] font-detective tracking-wider
                    transition-all duration-150
                    ${isSelected
                      ? 'border-transparent scale-105 shadow-md'
                      : 'border-border text-muted-foreground hover:border-foreground/20'
                    }
                  `}
                  style={isSelected ? {
                    backgroundColor: `hsl(var(${t.colorVar}) / 0.15)`,
                    color: `hsl(var(${t.colorVar}))`,
                    borderColor: `hsl(var(${t.colorVar}) / 0.3)`,
                  } : {}}
                >
                  <Icon size={18} />
                  {t.label}
                </button>
              );
            })}
          </div>

          {/* Image selector */}
          {availableImages.length > 0 && (
            <div>
              <label className="text-[10px] text-muted-foreground font-detective flex items-center gap-1 mb-2 tracking-wider">
                <ImageIcon size={11} />
                IMAGEM
              </label>
              <div className="grid grid-cols-5 gap-1.5">
                <button
                  type="button"
                  onClick={() => setSelectedImage(undefined)}
                  className={`aspect-square rounded border overflow-hidden flex items-center justify-center text-[9px] text-muted-foreground font-typewriter transition-all
                    ${!selectedImage ? 'border-primary bg-primary/5' : 'border-border opacity-50 hover:opacity-80'}`}
                >
                  Sem
                </button>
                {availableImages.map(img => (
                  <button
                    key={img.id}
                    type="button"
                    onClick={() => setSelectedImage(img.src)}
                    className={`aspect-square rounded border overflow-hidden transition-all
                      ${selectedImage === img.src ? 'border-primary scale-105' : 'border-border opacity-60 hover:opacity-100'}`}
                  >
                    <img src={img.src} alt={img.label} className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            </div>
          )}

          <Input
            placeholder="Título..."
            value={title}
            onChange={e => setTitle(e.target.value)}
            className="font-detective bg-card border-border text-foreground placeholder:text-muted-foreground"
            autoFocus
          />
          <Textarea
            placeholder="Descrição..."
            value={description}
            onChange={e => setDescription(e.target.value)}
            className="font-typewriter bg-card border-border text-foreground placeholder:text-muted-foreground resize-none"
            rows={3}
          />
          <Button type="submit" className="w-full font-detective tracking-wider bg-primary text-primary-foreground hover:bg-primary/90" disabled={!title.trim()}>
            📌 Fixar no Mural
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
