// Mock 餵食記錄資料
import type { FeedingRecord } from '../types';

export const mockFeedingRecords: FeedingRecord[] = [
  {
    id: 1,
    date: '2025-01-01',
    consumableId: 1,
    consumableName: '紅蟲',
    notes: '早上餵食',
    aquariumId: 1,
  },
  {
    id: 2,
    date: '2025-01-02',
    consumableId: 2,
    consumableName: '魚食 B',
    notes: '下午餵食',
    aquariumId: 1,
  },
];

