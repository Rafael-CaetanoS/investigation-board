import { useState } from 'react';
import { CardType } from '@/types/board';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { User, Search, Lightbulb, Clock, Plus } from 'lucide-react';

const types: { value: CardType; label: string; icon: typeof User; colorClass: string }[] = [
  { value: 'suspect', label: 'Suspeito', icon: User, colorClass: 'bg-suspect text-suspect-foreground' },
  { value: 'evidence', label: 'Prova', icon: Search, colorClass: 'bg-evidence text-evidence-foreground' },
  { value: 'theory', label: 'Teoria', icon: Lightbulb, colorClass: 'bg-theory text-theory-foreground' },
  { value: 'timeline', label: 'Horário', icon: Clock, colorClass: 'bg-timeline text-timeline-foreground' },
];

interface Props {
  onAdd: (type: CardType, title: string, description: string) => void;
}

export default function AddItemDialog({ onAdd }: Props) {
  const [open, setOpen] = useState(false);
  const [selectedType, setSelectedType] = useState<CardType>('suspect');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;
    onAdd(selectedType, title.trim(), description.trim());
    setTitle('');
    setDescription('');
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="gap-2 font-detective bg-primary text-primary-foreground hover:bg-primary/90">
          <Plus size={16} />
          Adicionar
        </Button>
      </DialogTrigger>
      <DialogContent className="bg-card border-border">
        <DialogHeader>
          <DialogTitle className="font-detective text-foreground">Nova Ficha</DialogTitle>
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
                  onClick={() => setSelectedType(t.value)}
                  className={`
                    flex flex-col items-center gap-1 p-2 rounded border text-xs font-detective
                    transition-all duration-150
                    ${selectedType === t.value
                      ? `${t.colorClass} border-transparent scale-105`
                      : 'border-border text-muted-foreground hover:border-foreground/30'
                    }
                  `}
                >
                  <Icon size={18} />
                  {t.label}
                </button>
              );
            })}
          </div>

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
            Fixar no Mural
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
