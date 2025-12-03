// Mock 水質檢測記錄資料
import type { WaterQualityRecord } from '../types';

export const mockWaterQualityRecords: WaterQualityRecord[] = [
  {
    id: 1,
    testType: 'NH3+NH4',
    testDate: '2025-01-01',
    value: 0.25,
    notes: '正常範圍',
    aquariumId: 1,
  },
  {
    id: 2,
    testType: 'PH',
    testDate: '2025-01-01',
    value: 7.2,
    notes: '略偏鹼性',
    aquariumId: 1,
  },
];

