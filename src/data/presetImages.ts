import male1 from '@/assets/profiles/male-1.jpg';
import male2 from '@/assets/profiles/male-2.jpg';
import female1 from '@/assets/profiles/female-1.jpg';
import female2 from '@/assets/profiles/female-2.jpg';
import unknown from '@/assets/profiles/unknown.jpg';
import knife from '@/assets/evidence/knife.jpg';
import gun from '@/assets/evidence/gun.jpg';
import poison from '@/assets/evidence/poison.jpg';
import rope from '@/assets/evidence/rope.jpg';
import letter from '@/assets/evidence/letter.jpg';
import fingerprint from '@/assets/evidence/fingerprint.jpg';
import key from '@/assets/evidence/key.jpg';
import { PresetImage } from '@/types/board';

export const profileImages: PresetImage[] = [
  { id: 'male-1', src: male1, label: 'Homem 1', category: 'profile' },
  { id: 'male-2', src: male2, label: 'Homem 2', category: 'profile' },
  { id: 'female-1', src: female1, label: 'Mulher 1', category: 'profile' },
  { id: 'female-2', src: female2, label: 'Mulher 2', category: 'profile' },
  { id: 'unknown', src: unknown, label: 'Desconhecido', category: 'profile' },
];

export const evidenceImages: PresetImage[] = [
  { id: 'knife', src: knife, label: 'Faca', category: 'evidence' },
  { id: 'gun', src: gun, label: 'Arma', category: 'evidence' },
  { id: 'poison', src: poison, label: 'Veneno', category: 'evidence' },
  { id: 'rope', src: rope, label: 'Corda', category: 'evidence' },
  { id: 'letter', src: letter, label: 'Carta', category: 'evidence' },
  { id: 'fingerprint', src: fingerprint, label: 'Impressão Digital', category: 'evidence' },
  { id: 'key', src: key, label: 'Chave', category: 'evidence' },
];

export const allImages = [...profileImages, ...evidenceImages];
