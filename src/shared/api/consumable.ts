// 耗材 API（Mock）
import { mockConsumables } from '../mocks/consumables';
import type { Consumable, CreateConsumableDto, UpdateConsumableDto } from '../types';

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

let consumables = [...mockConsumables];
let nextId = Math.max(...consumables.map(c => c.id), 0) + 1;

export const consumableApi = {
  // 取得所有耗材
  findAll: async (): Promise<Consumable[]> => {
    await delay(300);
    return [...consumables];
  },

  // 取得 tag 為「飼料」的耗材
  findFeedConsumables: async (): Promise<Consumable[]> => {
    await delay(300);
    return consumables.filter(c => c.tag === '飼料');
  },

  // 建立新耗材
  create: async (data: CreateConsumableDto): Promise<Consumable> => {
    await delay(300);
    
    // 驗證
    if (data.quantity < 0) {
      throw new Error('耗材的數量必須 >= 0');
    }
    if (!data.tag) {
      throw new Error('耗材的tag不可為空');
    }
    if (data.price < 0) {
      throw new Error('耗材的金額必須 >= 0');
    }
    
    // 自動設定狀態
    const status: Consumable['status'] = data.quantity === 0 ? '用完' : '使用中';
    
    const newConsumable: Consumable = {
      id: nextId++,
      ...data,
      status,
    };
    consumables.push(newConsumable);
    return newConsumable;
  },

  // 更新耗材
  update: async (data: UpdateConsumableDto): Promise<Consumable> => {
    await delay(300);
    
    const index = consumables.findIndex(c => c.id === data.id);
    if (index === -1) {
      throw new Error('耗材不存在');
    }
    
    // 驗證
    if (data.tag !== undefined && !data.tag) {
      throw new Error('耗材的tag不可為空');
    }
    if (data.quantity !== undefined && data.quantity < 0) {
      throw new Error('耗材的數量必須 >= 0');
    }
    if (data.price !== undefined && data.price < 0) {
      throw new Error('耗材的金額必須 >= 0');
    }
    
    // 自動更新狀態
    const quantity = data.quantity !== undefined ? data.quantity : consumables[index].quantity;
    const status: Consumable['status'] = 
      data.status || (quantity === 0 ? '用完' : '使用中');
    
    consumables[index] = { ...consumables[index], ...data, status };
    return consumables[index];
  },

  // 刪除耗材
  remove: async (id: number): Promise<void> => {
    await delay(300);
    const index = consumables.findIndex(c => c.id === id);
    if (index === -1) {
      throw new Error('耗材不存在');
    }
    consumables.splice(index, 1);
  },
};

