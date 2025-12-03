// Mock 換水記錄資料
import type { WaterChangeRecord } from '../types';

export const mockWaterChangeRecords: WaterChangeRecord[] = [
  {
    id: 1,
    date: '2025-01-01',
    waterChangeRatio: 0.5,
    notes: '定期換水',
    aquariumId: 1,
  },
  {
    id: 2,
    date: '2025-01-15',
    waterChangeRatio: 0.33,
    notes: '部分換水',
    aquariumId: 1,
  },
];

