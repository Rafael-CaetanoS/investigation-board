import { useState } from 'react';
import { CardType } from '@/types/board';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { User, Search, Lightbulb, Clock, Plus, ImageIcon } from 'lucide-react';
import { profileImages, evidenceImages } from '@/data/presetImages';
import { PresetImage } from '@/types/board';

const types: { value: CardType; label: string; icon: typeof User; colorClass: string }[] = [
  { value: 'suspect', label: 'Suspeito', icon: User, colorClass: 'bg-suspect text-suspect-foreground' },
  { value: 'evidence', label: 'Prova', icon: Search, colorClass: 'bg-evidence text-evidence-foreground' },
  { value: 'theory', label: 'Teoria', icon: Lightbulb, colorClass: 'bg-theory text-theory-foreground' },
  { value: 'timeline', label: 'Horário', icon: Clock, colorClass: 'bg-timeline text-timeline-foreground' },
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
        <Button className="gap-2 font-detective bg-primary text-primary-foreground hover:bg-primary/90 shadow-lg">
          <Plus size={16} />
          Adicionar
        </Button>
      </DialogTrigger>
      <DialogContent className="bg-card border-border max-w-lg">
        <DialogHeader>
          <DialogTitle className="font-detective text-foreground text-lg">Nova Ficha</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Type selector */}
          <div className="grid grid-cols-4 gap-2">
            {types.map(t => {
              const Icon = t.icon;
              return (
                <button
                  key={t.value}
                  type="button"
                  onClick={() => handleTypeChange(t.value)}
                  className={`
                    flex flex-col items-center gap-1 p-2.5 rounded border text-xs font-detective
                    transition-all duration-150
                    ${selectedType === t.value
                      ? `${t.colorClass} border-transparent scale-105 shadow-md`
                      : 'border-border text-muted-foreground hover:border-foreground/30'
                    }
                  `}
                >
                  <Icon size={20} />
                  {t.label}
                </button>
              );
            })}
          </div>

          {/* Image selector */}
          {availableImages.length > 0 && (
            <div>
              <label className="text-xs text-muted-foreground font-detective flex items-center gap-1 mb-2">
                <ImageIcon size={12} />
                Imagem (opcional)
              </label>
              <div className="grid grid-cols-5 gap-2">
                {/* No image option */}
                <button
                  type="button"
                  onClick={() => setSelectedImage(undefined)}
                  className={`
                    aspect-square rounded border-2 overflow-hidden flex items-center justify-center text-[10px] text-muted-foreground font-typewriter
                    transition-all duration-150
                    ${!selectedImage ? 'border-primary shadow-md' : 'border-border/50 opacity-60 hover:opacity-100'}
                  `}
                >
                  Sem foto
                </button>
                {availableImages.map(img => (
                  <button
                    key={img.id}
                    type="button"
                    onClick={() => setSelectedImage(img.src)}
                    className={`
                      aspect-square rounded border-2 overflow-hidden
                      transition-all duration-150
                      ${selectedImage === img.src ? 'border-primary shadow-md scale-105' : 'border-border/50 opacity-70 hover:opacity-100'}
                    `}
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
            className="font-detective bg-secondary border-border text-foreground placeholder:text-muted-foreground"
            autoFocus
          />
          <Textarea
            placeholder="Descrição / Detalhes..."
            value={description}
            onChange={e => setDescription(e.target.value)}
            className="font-typewriter bg-secondary border-border text-foreground placeholder:text-muted-foreground resize-none"
            rows={3}
          />
          <Button type="submit" className="w-full font-detective bg-primary text-primary-foreground hover:bg-primary/90" disabled={!title.trim()}>
            📌 Fixar no Mural
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
