import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { cases, CaseInfo } from '@/data/cases';
import heroBg from '@/assets/hero-bg.jpg';
import { Search, Skull, BookOpen, Eye, Star, ArrowRight, Sparkles } from 'lucide-react';

const categoryConfig = {
  murder: { label: 'Homicídio', color: 'hsl(0, 65%, 50%)', icon: '🔪' },
  mystery: { label: 'Mistério', color: 'hsl(210, 70%, 55%)', icon: '🔮' },
  serial: { label: 'Serial Killer', color: 'hsl(280, 50%, 50%)', icon: '💀' },
  heist: { label: 'Roubo', color: 'hsl(45, 80%, 50%)', icon: '💎' },
};

function DifficultyStars({ level }: { level: number }) {
  return (
    <div className="flex gap-0.5">
      {[1, 2, 3].map(i => (
        <Star key={i} size={10} className={i <= level ? 'fill-primary text-primary' : 'text-muted-foreground/30'} />
      ))}
    </div>
  );
}

export default function CaseSelector() {
  const navigate = useNavigate();
  const [filter, setFilter] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');

  const filtered = cases.filter(c => {
    if (filter !== 'all' && c.category !== filter) return false;
    if (searchTerm && !c.name.toLowerCase().includes(searchTerm.toLowerCase())) return false;
    return true;
  });

  const handleSelect = (c: CaseInfo) => {
    // Store selected case and navigate to board
    localStorage.setItem('active-case-id', c.id);
    localStorage.setItem('active-case-name', c.name);
    navigate('/board');
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Hero */}
      <div className="relative h-[340px] overflow-hidden">
        <img src={heroBg} alt="" className="absolute inset-0 w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-b from-background/40 via-background/60 to-background" />
        <div className="absolute inset-0 bg-gradient-to-r from-background/80 via-transparent to-background/80" />
        
        <div className="relative z-10 h-full flex flex-col items-center justify-center px-4">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center border border-primary/30">
              <Search size={20} className="text-primary" />
            </div>
            <h1 className="font-display text-4xl md:text-5xl font-black text-foreground tracking-tight">
              Arquivo Criminal
            </h1>
          </div>
          <p className="text-muted-foreground font-typewriter text-sm max-w-md text-center">
            Selecione um caso para investigar. Monte seu mural, conecte as pistas e descubra a verdade.
          </p>
        </div>
      </div>

      {/* Filters + Search */}
      <div className="max-w-5xl mx-auto px-4 -mt-8 relative z-20">
        <div className="glass-panel rounded-xl p-4">
          <div className="flex flex-col sm:flex-row gap-3 items-center">
            {/* Search */}
            <div className="relative flex-1 w-full">
              <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <input
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                placeholder="Buscar caso..."
                className="w-full bg-muted/50 border border-border rounded-lg pl-9 pr-3 py-2 text-sm font-typewriter text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary/50"
              />
            </div>
            {/* Category filters */}
            <div className="flex gap-1.5 flex-wrap">
              <button
                onClick={() => setFilter('all')}
                className={`px-3 py-1.5 rounded-lg text-[11px] font-detective tracking-wider transition-all ${
                  filter === 'all' ? 'bg-primary text-primary-foreground' : 'bg-muted/50 text-muted-foreground hover:text-foreground'
                }`}
              >
                TODOS
              </button>
              {Object.entries(categoryConfig).map(([key, cfg]) => (
                <button
                  key={key}
                  onClick={() => setFilter(key)}
                  className={`px-3 py-1.5 rounded-lg text-[11px] font-detective tracking-wider transition-all flex items-center gap-1 ${
                    filter === key ? 'text-primary-foreground' : 'bg-muted/50 text-muted-foreground hover:text-foreground'
                  }`}
                  style={filter === key ? { backgroundColor: cfg.color } : {}}
                >
                  <span>{cfg.icon}</span>
                  {cfg.label.toUpperCase()}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Case Grid */}
      <div className="max-w-5xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((c, i) => {
            const cat = categoryConfig[c.category];
            return (
              <button
                key={c.id}
                onClick={() => handleSelect(c)}
                className="group text-left glass-panel rounded-xl overflow-hidden hover:border-primary/30 transition-all duration-300 hover:shadow-[0_8px_30px_rgba(0,0,0,0.3)] hover:-translate-y-1"
                style={{ animationDelay: `${i * 50}ms` }}
              >
                {/* Top accent */}
                <div className="h-1 w-full" style={{ background: `linear-gradient(90deg, ${cat.color}, transparent)` }} />
                
                <div className="p-4">
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center gap-1.5">
                      <span className="text-sm">{cat.icon}</span>
                      <span className="text-[9px] font-detective tracking-[0.15em] uppercase" style={{ color: cat.color }}>
                        {cat.label}
                      </span>
                    </div>
                    <DifficultyStars level={c.difficulty} />
                  </div>

                  <h3 className="font-detective text-base text-foreground group-hover:text-primary transition-colors leading-tight mb-1">
                    {c.name}
                  </h3>
                  <p className="text-[11px] text-muted-foreground font-typewriter leading-relaxed">
                    {c.subtitle}
                  </p>

                  <div className="mt-3 flex items-center justify-between">
                    <span className="text-[9px] text-muted-foreground/50 font-typewriter">
                      CASO #{String(i + 1).padStart(3, '0')}
                    </span>
                    <div className="flex items-center gap-1 text-primary/0 group-hover:text-primary transition-all text-[10px] font-detective">
                      INVESTIGAR <ArrowRight size={10} />
                    </div>
                  </div>
                </div>
              </button>
            );
          })}
        </div>

        {filtered.length === 0 && (
          <div className="text-center py-16">
            <p className="font-detective text-lg text-muted-foreground/30">Nenhum caso encontrado</p>
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="max-w-5xl mx-auto px-4 pb-8">
        <div className="border-t border-border pt-4 flex items-center justify-center gap-2 text-[10px] text-muted-foreground/30 font-typewriter">
          <Sparkles size={10} />
          <span>{cases.length} casos disponíveis · Dados do Google Drive</span>
        </div>
      </div>
    </div>
  );
}
