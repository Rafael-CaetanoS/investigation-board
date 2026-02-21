import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { cases, CaseInfo } from '@/data/cases';
import { Search, Star, ArrowRight, Eye, Skull, Crown, Gem } from 'lucide-react';

const categoryConfig = {
  murder: { label: 'Homicídio', icon: Skull, accent: 'hsl(0, 80%, 50%)' },
  mystery: { label: 'Mistério', icon: Eye, accent: 'hsl(270, 60%, 55%)' },
  serial: { label: 'Serial Killer', icon: Skull, accent: 'hsl(0, 90%, 40%)' },
  heist: { label: 'Roubo', icon: Gem, accent: 'hsl(45, 80%, 50%)' },
};

function DifficultyStars({ level }: { level: number }) {
  return (
    <div className="flex gap-0.5">
      {[1, 2, 3].map(i => (
        <Star key={i} size={9} className={i <= level ? 'fill-primary text-primary' : 'text-muted-foreground/20'} />
      ))}
    </div>
  );
}

export default function CaseSelector() {
  const navigate = useNavigate();
  const [filter, setFilter] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [hoveredId, setHoveredId] = useState<string | null>(null);

  const filtered = cases.filter(c => {
    if (filter !== 'all' && c.category !== filter) return false;
    if (searchTerm && !c.name.toLowerCase().includes(searchTerm.toLowerCase())) return false;
    return true;
  });

  const handleSelect = (c: CaseInfo) => {
    localStorage.setItem('active-case-id', c.id);
    localStorage.setItem('active-case-name', c.name);
    navigate('/board');
  };

  return (
    <div className="min-h-screen noir-gradient">
      {/* Hero Section */}
      <div className="relative py-16 px-4 overflow-hidden">
        {/* Dramatic red gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-primary/5 via-transparent to-transparent" />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-primary/3 rounded-full blur-[120px]" />
        
        <div className="relative z-10 max-w-5xl mx-auto text-center">
          {/* Logo mark */}
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full border border-primary/30 mb-6 red-glow">
            <Skull size={28} className="text-primary" />
          </div>
          
          <h1 className="font-display text-5xl md:text-6xl font-black text-foreground tracking-tight mb-3">
            Arquivo <span className="text-primary">Criminal</span>
          </h1>
          <div className="w-24 h-[2px] bg-gradient-to-r from-transparent via-primary to-transparent mx-auto mb-4" />
          <p className="text-muted-foreground font-typewriter text-sm max-w-md mx-auto leading-relaxed">
            Selecione um caso. Monte o mural. Conecte as pistas. Descubra a verdade.
          </p>
        </div>
      </div>

      {/* Filters */}
      <div className="max-w-5xl mx-auto px-4 mb-8">
        <div className="flex flex-col sm:flex-row gap-3 items-center">
          <div className="relative flex-1 w-full">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <input
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              placeholder="Buscar caso..."
              className="w-full bg-card border border-border rounded-lg pl-9 pr-3 py-2.5 text-sm font-typewriter text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/20 transition-all"
            />
          </div>
          <div className="flex gap-1">
            <button
              onClick={() => setFilter('all')}
              className={`px-4 py-2 rounded-lg text-[10px] font-detective tracking-[0.15em] transition-all border ${
                filter === 'all' 
                  ? 'bg-primary text-primary-foreground border-primary' 
                  : 'border-border text-muted-foreground hover:text-foreground hover:border-foreground/20'
              }`}
            >
              TODOS
            </button>
            {Object.entries(categoryConfig).map(([key, cfg]) => (
              <button
                key={key}
                onClick={() => setFilter(key)}
                className={`px-4 py-2 rounded-lg text-[10px] font-detective tracking-[0.15em] transition-all border ${
                  filter === key
                    ? 'text-primary-foreground border-transparent'
                    : 'border-border text-muted-foreground hover:text-foreground hover:border-foreground/20'
                }`}
                style={filter === key ? { backgroundColor: cfg.accent, borderColor: cfg.accent } : {}}
              >
                {cfg.label.toUpperCase()}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Cases Grid */}
      <div className="max-w-5xl mx-auto px-4 pb-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {filtered.map((c, i) => {
            const cat = categoryConfig[c.category];
            const CatIcon = cat.icon;
            const isHovered = hoveredId === c.id;
            return (
              <button
                key={c.id}
                onClick={() => handleSelect(c)}
                onMouseEnter={() => setHoveredId(c.id)}
                onMouseLeave={() => setHoveredId(null)}
                className="group text-left relative rounded-lg overflow-hidden transition-all duration-300 hover:-translate-y-0.5 border border-border hover:border-primary/30 bg-card"
                style={{
                  opacity: 0,
                  animation: `fade-in 0.4s ease-out ${i * 40}ms forwards`,
                }}
              >
                {/* Red accent on hover */}
                <div
                  className="absolute inset-0 transition-opacity duration-300"
                  style={{
                    background: `radial-gradient(ellipse at bottom, ${cat.accent}08 0%, transparent 70%)`,
                    opacity: isHovered ? 1 : 0,
                  }}
                />

                {/* Top accent line */}
                <div className="h-[2px]" style={{ background: `linear-gradient(90deg, ${cat.accent}, transparent 80%)` }} />
                
                <div className="relative p-4">
                  {/* Category + difficulty */}
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-1.5">
                      <CatIcon size={11} style={{ color: cat.accent }} />
                      <span className="text-[9px] font-detective tracking-[0.2em] uppercase" style={{ color: cat.accent }}>
                        {cat.label}
                      </span>
                    </div>
                    <DifficultyStars level={c.difficulty} />
                  </div>

                  {/* Title */}
                  <h3 className="font-display text-[15px] font-bold text-foreground group-hover:text-primary transition-colors leading-snug mb-1.5">
                    {c.name}
                  </h3>
                  <p className="text-[10px] text-muted-foreground font-typewriter leading-relaxed line-clamp-2">
                    {c.subtitle}
                  </p>

                  {/* Footer */}
                  <div className="mt-4 flex items-center justify-between pt-3 border-t border-border/50">
                    <span className="text-[9px] text-muted-foreground/40 font-typewriter tracking-wider">
                      CASO #{String(i + 1).padStart(3, '0')}
                    </span>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => {
                          const current = localStorage.getItem(`case-doc-url:${c.id}`) || '';
                          const url = window.prompt('Cole o link público do Google Drive (PDF) para este caso:', current || '');
                          if (url !== null) {
                            if (url.trim() === '') {
                              localStorage.removeItem(`case-doc-url:${c.id}`);
                              alert('Link removido.');
                            } else {
                              localStorage.setItem(`case-doc-url:${c.id}`, url.trim());
                              alert('Link salvo.');
                            }
                          }
                        }}
                        className="opacity-0 group-hover:opacity-100 transition-all text-[10px] font-detective tracking-wider px-2 py-1 rounded border border-border hover:bg-card"
                        title="Vincular PDF do caso"
                      >
                        VINCULAR
                      </button>
                      <div className="flex items-center gap-1 text-primary opacity-0 group-hover:opacity-100 transition-all text-[10px] font-detective tracking-wider">
                        INVESTIGAR <ArrowRight size={10} />
                      </div>
                    </div>
                  </div>
                </div>
              </button>
            );
          })}
        </div>

        {filtered.length === 0 && (
          <div className="text-center py-20">
            <Skull size={32} className="text-muted-foreground/10 mx-auto mb-3" />
            <p className="font-display text-lg text-muted-foreground/20">Nenhum caso encontrado</p>
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="max-w-5xl mx-auto px-4 pb-8">
        <div className="border-t border-border pt-4 flex items-center justify-center gap-3 text-[10px] text-muted-foreground/25 font-typewriter">
          <div className="w-8 h-[1px] bg-primary/20" />
          <span>{cases.length} casos disponíveis</span>
          <div className="w-8 h-[1px] bg-primary/20" />
        </div>
      </div>
    </div>
  );
}
