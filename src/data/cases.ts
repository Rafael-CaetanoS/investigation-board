export interface CaseInfo {
  id: string;
  name: string;
  subtitle: string;
  category: 'murder' | 'mystery' | 'serial' | 'heist';
  difficulty: 1 | 2 | 3;
}

export const cases: CaseInfo[] = [
  { id: 'alice-vargas', name: 'Alice Vargas', subtitle: 'Desaparecimento misterioso', category: 'murder', difficulty: 2 },
  { id: 'blackwood', name: 'Blackwood', subtitle: 'Segredos de uma família', category: 'mystery', difficulty: 2 },
  { id: 'fabricio-silva', name: 'Fabrício Silva', subtitle: 'Morte no escritório', category: 'murder', difficulty: 3 },
  { id: 'galeria-sombria', name: 'Galeria Sombria', subtitle: 'Arte e sangue', category: 'mystery', difficulty: 1 },
  { id: 'george-bailey', name: 'George Bailey', subtitle: 'O magnata caído', category: 'murder', difficulty: 3 },
  { id: 'katherin-halls', name: 'Katherin Halls', subtitle: 'A dançarina silenciosa', category: 'murder', difficulty: 2 },
  { id: 'lago-sombrio', name: 'Lago Sombrio', subtitle: 'Águas turvas', category: 'mystery', difficulty: 1 },
  { id: 'livia-montserrat', name: 'Lívia Montserrat', subtitle: 'Herança envenenada', category: 'murder', difficulty: 3 },
  { id: 'madeline-deparde', name: 'Madeline Deparde', subtitle: 'A última carta', category: 'murder', difficulty: 2 },
  { id: 'mari-luna', name: 'Mari Luna', subtitle: 'Noite sem lua', category: 'murder', difficulty: 3 },
  { id: 'mystic-falls', name: 'Mystic Falls', subtitle: 'A cidade tem segredos', category: 'mystery', difficulty: 2 },
  { id: 'pamela-miller', name: 'Pamela Miller', subtitle: 'Aparências enganam', category: 'murder', difficulty: 2 },
  { id: 'sandra-ivey', name: 'Sandra Ivey', subtitle: 'Rastros na neve', category: 'murder', difficulty: 3 },
  { id: 'teatro-abandonado', name: 'Teatro Abandonado', subtitle: 'O último ato', category: 'mystery', difficulty: 1 },
  { id: 'chronicles-crime', name: 'Chronicles of Crime', subtitle: 'Múltiplos cenários', category: 'serial', difficulty: 3 },
  { id: 'csi-ouro-preto', name: 'CSI: Ouro Preto', subtitle: 'Crime na cidade histórica', category: 'murder', difficulty: 3 },
  { id: 'murdle', name: 'Murdle', subtitle: 'Puzzle lógico (Inglês)', category: 'mystery', difficulty: 2 },
  { id: 'pensao-aurora', name: 'O Mistério da Pensão Aurora', subtitle: 'Hóspedes suspeitos', category: 'mystery', difficulty: 2 },
  { id: 'mansao-sao-bento', name: 'Assassinato na Mansão de São Bento', subtitle: 'Uma noite fatal', category: 'murder', difficulty: 3 },
  { id: 'palacio-montenegro', name: 'Palácio Montenegro', subtitle: 'Intrigas palacianas', category: 'heist', difficulty: 2 },
  { id: 'serial-killer', name: 'Quem é o Serial Killer?', subtitle: 'Padrões no caos', category: 'serial', difficulty: 3 },
  { id: 'jason-turner', name: 'Quem Matou Jason Turner?', subtitle: 'Todos são suspeitos', category: 'murder', difficulty: 2 },
];
