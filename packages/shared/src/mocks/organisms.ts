// Mock 生物資料
import type { Organism } from '../types';

export const mockOrganisms: Organism[] = [
  {
    id: 1,
    name: '小丑魚',
    tag: '上層魚',
    purchaseDate: '2024-01-15',
    price: 150,
    healthStatus: '正常',
    gender: '雄',
    length: 5,
    notes: '活潑好動',
    aquariumId: 1,
  },
  {
    id: 2,
    name: '異形魚',
    tag: '異形',
    purchaseDate: '2024-02-20',
    price: 300,
    healthStatus: '正常',
    gender: '雌',
    length: 8,
    notes: '喜歡躲藏',
    aquariumId: 1,
  },
];

