// Mock 耗材資料
import type { Consumable } from '../types';

export const mockConsumables: Consumable[] = [
  {
    id: 1,
    name: '紅蟲',
    tag: '飼料',
    quantity: 10,
    status: '使用中',
    price: 100,
    purchaseDate: '2024-12-01',
    expiryDate: '2025-06-01',
    aquariumId: 1,
  },
  {
    id: 2,
    name: '魚食 B',
    tag: '飼料',
    quantity: 0,
    status: '用完',
    price: 150,
    purchaseDate: '2024-11-01',
    expiryDate: '2024-12-31',
    aquariumId: 1,
  },
  {
    id: 3,
    name: '藥品 A',
    tag: '藥品',
    quantity: 5,
    status: '使用中',
    price: 200,
    purchaseDate: '2024-12-15',
    expiryDate: '2025-12-15',
  },
];

