// 水質檢測記錄 API（Mock）
import { mockWaterQualityRecords } from '../mocks/waterQuality';
import type { WaterQualityRecord, CreateWaterQualityRecordDto, UpdateWaterQualityRecordDto } from '../types';

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

let waterQualityRecords = [...mockWaterQualityRecords];
let nextId = Math.max(...waterQualityRecords.map(w => w.id), 0) + 1;

export const waterQualityApi = {
  // 取得所有水質檢測記錄
  findAll: async (): Promise<WaterQualityRecord[]> => {
    await delay(300);
    return [...waterQualityRecords];
  },

  // 根據魚缸 ID 取得水質檢測記錄
  findByAquariumId: async (aquariumId: number): Promise<WaterQualityRecord[]> => {
    await delay(300);
    return waterQualityRecords.filter(w => w.aquariumId === aquariumId);
  },

  // 建立新水質檢測記錄
  create: async (data: CreateWaterQualityRecordDto): Promise<WaterQualityRecord> => {
    await delay(300);
    
    // 驗證
    if (!data.testType) {
      throw new Error('水質檢測記錄的檢測種類不可為空');
    }
    if (!data.testDate || data.testDate.trim() === '') {
      throw new Error('水質檢測記錄的檢測日期不可為空');
    }
    if (data.value === undefined || data.value === null) {
      throw new Error('水質檢測記錄的數值不可為空');
    }
    if (!data.aquariumId) {
      throw new Error('水質檢測記錄的所屬魚缸不可為空');
    }
    
    const newRecord: WaterQualityRecord = {
      id: nextId++,
      ...data,
    };
    waterQualityRecords.push(newRecord);
    return newRecord;
  },

  // 更新水質檢測記錄
  update: async (data: UpdateWaterQualityRecordDto): Promise<WaterQualityRecord> => {
    await delay(300);
    
    const index = waterQualityRecords.findIndex(w => w.id === data.id);
    if (index === -1) {
      throw new Error('水質檢測記錄不存在');
    }
    
    // 驗證
    if (data.testType !== undefined && !data.testType) {
      throw new Error('水質檢測記錄的檢測種類不可為空');
    }
    if (data.testDate !== undefined && data.testDate.trim() === '') {
      throw new Error('水質檢測記錄的檢測日期不可為空');
    }
    if (data.value !== undefined && data.value === null) {
      throw new Error('水質檢測記錄的數值不可為空');
    }
    if (data.aquariumId !== undefined && !data.aquariumId) {
      throw new Error('水質檢測記錄的所屬魚缸不可為空');
    }
    
    waterQualityRecords[index] = { ...waterQualityRecords[index], ...data };
    return waterQualityRecords[index];
  },

  // 刪除水質檢測記錄
  remove: async (id: number): Promise<void> => {
    await delay(300);
    const index = waterQualityRecords.findIndex(w => w.id === id);
    if (index === -1) {
      throw new Error('水質檢測記錄不存在');
    }
    waterQualityRecords.splice(index, 1);
  },
};

