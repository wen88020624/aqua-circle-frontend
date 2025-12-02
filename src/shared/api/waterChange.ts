// 換水記錄 API（Mock）
import { mockWaterChangeRecords } from '../mocks/waterChanges';
import type { WaterChangeRecord, CreateWaterChangeRecordDto, UpdateWaterChangeRecordDto } from '../types';

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

let waterChangeRecords = [...mockWaterChangeRecords];
let nextId = Math.max(...waterChangeRecords.map(w => w.id), 0) + 1;

export const waterChangeApi = {
  // 取得所有換水記錄
  findAll: async (): Promise<WaterChangeRecord[]> => {
    await delay(300);
    return [...waterChangeRecords];
  },

  // 根據魚缸 ID 取得換水記錄
  findByAquariumId: async (aquariumId: number): Promise<WaterChangeRecord[]> => {
    await delay(300);
    return waterChangeRecords.filter(w => w.aquariumId === aquariumId);
  },

  // 建立新換水記錄
  create: async (data: CreateWaterChangeRecordDto): Promise<WaterChangeRecord> => {
    await delay(300);
    
    // 驗證
    if (!data.date || data.date.trim() === '') {
      throw new Error('換水記錄的日期不可為空');
    }
    if (data.waterChangeRatio === undefined || data.waterChangeRatio === null) {
      throw new Error('換水記錄的換水量不可為空');
    }
    if (!data.aquariumId) {
      throw new Error('換水記錄的所屬魚缸不可為空');
    }
    
    const newRecord: WaterChangeRecord = {
      id: nextId++,
      ...data,
    };
    waterChangeRecords.push(newRecord);
    return newRecord;
  },

  // 更新換水記錄
  update: async (data: UpdateWaterChangeRecordDto): Promise<WaterChangeRecord> => {
    await delay(300);
    
    const index = waterChangeRecords.findIndex(w => w.id === data.id);
    if (index === -1) {
      throw new Error('換水記錄不存在');
    }
    
    // 驗證
    if (data.date !== undefined && data.date.trim() === '') {
      throw new Error('換水記錄的日期不可為空');
    }
    if (data.waterChangeRatio !== undefined && data.waterChangeRatio === null) {
      throw new Error('換水記錄的換水量不可為空');
    }
    if (data.aquariumId !== undefined && !data.aquariumId) {
      throw new Error('換水記錄的所屬魚缸不可為空');
    }
    
    waterChangeRecords[index] = { ...waterChangeRecords[index], ...data };
    return waterChangeRecords[index];
  },

  // 刪除換水記錄
  remove: async (id: number): Promise<void> => {
    await delay(300);
    const index = waterChangeRecords.findIndex(w => w.id === id);
    if (index === -1) {
      throw new Error('換水記錄不存在');
    }
    waterChangeRecords.splice(index, 1);
  },
};

