// 餵食記錄 API（Mock）
import { mockFeedingRecords } from '../mocks/feedings';
import { mockConsumables } from '../mocks/consumables';
import type { FeedingRecord, CreateFeedingRecordDto, UpdateFeedingRecordDto } from '../types';

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

let feedingRecords = [...mockFeedingRecords];
let nextId = Math.max(...feedingRecords.map(f => f.id), 0) + 1;

export const feedingApi = {
  // 取得所有餵食記錄
  findAll: async (): Promise<FeedingRecord[]> => {
    await delay(300);
    return feedingRecords.map(record => ({
      ...record,
      consumableName: mockConsumables.find(c => c.id === record.consumableId)?.name,
    }));
  },

  // 根據魚缸 ID 取得餵食記錄
  findByAquariumId: async (aquariumId: number): Promise<FeedingRecord[]> => {
    await delay(300);
    return feedingRecords
      .filter(f => f.aquariumId === aquariumId)
      .map(record => ({
        ...record,
        consumableName: mockConsumables.find(c => c.id === record.consumableId)?.name,
      }));
  },

  // 建立新餵食記錄
  create: async (data: CreateFeedingRecordDto): Promise<FeedingRecord> => {
    await delay(300);
    
    // 驗證
    if (!data.date || data.date.trim() === '') {
      throw new Error('餵食記錄的日期不可為空');
    }
    
    // 檢查耗材是否為飼料
    const consumable = mockConsumables.find(c => c.id === data.consumableId);
    if (!consumable) {
      throw new Error('耗材不存在');
    }
    if (consumable.tag !== '飼料') {
      throw new Error('只能選擇 tag 為「飼料」的耗材');
    }
    
    const newRecord: FeedingRecord = {
      id: nextId++,
      ...data,
    };
    feedingRecords.push(newRecord);
    return {
      ...newRecord,
      consumableName: consumable.name,
    };
  },

  // 更新餵食記錄
  update: async (data: UpdateFeedingRecordDto): Promise<FeedingRecord> => {
    await delay(300);
    
    const index = feedingRecords.findIndex(f => f.id === data.id);
    if (index === -1) {
      throw new Error('餵食記錄不存在');
    }
    
    // 驗證
    if (data.date !== undefined && data.date.trim() === '') {
      throw new Error('餵食記錄的日期不可為空');
    }
    
    // 如果更新耗材，檢查是否為飼料
    if (data.consumableId !== undefined) {
      const consumable = mockConsumables.find(c => c.id === data.consumableId);
      if (!consumable) {
        throw new Error('耗材不存在');
      }
      if (consumable.tag !== '飼料') {
        throw new Error('只能選擇 tag 為「飼料」的耗材');
      }
    }
    
    feedingRecords[index] = { ...feedingRecords[index], ...data };
    const consumable = mockConsumables.find(
      c => c.id === feedingRecords[index].consumableId
    );
    return {
      ...feedingRecords[index],
      consumableName: consumable?.name,
    };
  },

  // 刪除餵食記錄
  remove: async (id: number): Promise<void> => {
    await delay(300);
    const index = feedingRecords.findIndex(f => f.id === id);
    if (index === -1) {
      throw new Error('餵食記錄不存在');
    }
    feedingRecords.splice(index, 1);
  },
};

