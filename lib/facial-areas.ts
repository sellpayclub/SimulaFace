import type { FacialArea } from '@/types'

export const FACIAL_AREAS: FacialArea[] = [
  {
    id: 'testa',
    label: 'Testa',
    icon: '🧠',
    options: [
      { id: 'rugas', label: 'Reduzir Rugas', promptKey: 'smooth_forehead' },
      { id: 'suavizar', label: 'Suavizar Linhas', promptKey: 'soften_lines' },
    ],
  },
  {
    id: 'olhos',
    label: 'Olhos',
    icon: '👁️',
    options: [
      { id: 'pe_galinha', label: 'Reduzir Pé de Galinha', promptKey: 'reduce_crows_feet' },
      { id: 'palpebra', label: 'Levantar Pálpebra', promptKey: 'lift_eyelid' },
    ],
  },
  {
    id: 'nariz',
    label: 'Nariz',
    icon: '👃',
    options: [
      { id: 'afinar', label: 'Afinar', promptKey: 'slim_nose' },
      { id: 'empinar', label: 'Empinar', promptKey: 'lift_tip' },
      { id: 'reduzir', label: 'Reduzir', promptKey: 'reduce_size' },
      { id: 'engrossar', label: 'Engrossar', promptKey: 'widen_bridge' },
    ],
  },
  {
    id: 'boca',
    label: 'Boca',
    icon: '👄',
    options: [
      { id: 'volume', label: 'Aumentar Volume', promptKey: 'fuller_lips' },
      { id: 'contorno', label: 'Definir Contorno', promptKey: 'define_contour' },
    ],
  },
  {
    id: 'sulco_nasogeniano',
    label: 'Bigode Chinês',
    icon: '〰️',
    options: [
      { id: 'suavizar', label: 'Suavizar', promptKey: 'soften_folds' },
      { id: 'preencher', label: 'Preencher', promptKey: 'fill_folds' },
    ],
  },
  {
    id: 'maca_rosto',
    label: 'Maçã do Rosto',
    icon: '🍎',
    options: [
      { id: 'volume', label: 'Aumentar Volume', promptKey: 'enhance_cheekbones' },
      { id: 'definir', label: 'Definir', promptKey: 'define_cheekbones' },
    ],
  },
  {
    id: 'queixo',
    label: 'Queixo',
    icon: '🔻',
    options: [
      { id: 'projetar', label: 'Projetar', promptKey: 'project_chin' },
      { id: 'reduzir', label: 'Reduzir', promptKey: 'reduce_chin' },
      { id: 'definir', label: 'Definir', promptKey: 'define_chin' },
    ],
  },
  {
    id: 'mandibula',
    label: 'Mandíbula',
    icon: '📐',
    options: [
      { id: 'afinar', label: 'Afinar', promptKey: 'slim_jaw' },
      { id: 'definir', label: 'Definir Ângulo', promptKey: 'define_jaw' },
    ],
  },
  {
    id: 'pescoco',
    label: 'Pescoço',
    icon: '🦢',
    options: [
      { id: 'papada', label: 'Reduzir Papada', promptKey: 'reduce_double_chin' },
      { id: 'definir', label: 'Definir', promptKey: 'define_neck' },
    ],
  },
  {
    id: 'bigode',
    label: 'Bigode',
    icon: '🥸',
    options: [
      { id: 'suavizar', label: 'Suavizar Linhas', promptKey: 'soften_mustache_lines' },
      { id: 'preencher', label: 'Preencher Área', promptKey: 'fill_mustache_area' },
    ],
  },
]

