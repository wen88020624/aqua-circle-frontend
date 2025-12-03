// Mock 設備資料
import type { Equipment } from '../types';

export const mockEquipment: Equipment[] = [
  {
    id: 1,
    name: 'LED 燈具',
    tag: '燈具',
    status: '使用中',
    price: 1500,
    purchaseDate: '2024-01-01',
    aquariumId: 1,
  },
  {
    id: 2,
    name: '外掛過濾器',
    tag: '過濾器',
    status: '使用中',
    price: 800,
    purchaseDate: '2024-01-01',
    aquariumId: 1,
  },
];

