// 設備 API（Mock）
import { mockEquipment } from '../mocks/equipment';
import type { Equipment, CreateEquipmentDto, UpdateEquipmentDto } from '../types';

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

let equipment = [...mockEquipment];
let nextId = Math.max(...equipment.map(e => e.id), 0) + 1;

export const equipmentApi = {
  // 取得所有設備
  findAll: async (): Promise<Equipment[]> => {
    await delay(300);
    return [...equipment];
  },

  // 建立新設備
  create: async (data: CreateEquipmentDto): Promise<Equipment> => {
    await delay(300);
    
    // 驗證
    if (!data.name || data.name.trim() === '') {
      throw new Error('設備的名稱不可為空');
    }
    if (!data.status) {
      throw new Error('設備的狀態不可為空');
    }
    if (!data.tag) {
      throw new Error('設備的tag不可為空');
    }
    if (data.price < 0) {
      throw new Error('設備的金額必須 >= 0');
    }
    
    const newEquipment: Equipment = {
      id: nextId++,
      ...data,
    };
    equipment.push(newEquipment);
    return newEquipment;
  },

  // 更新設備
  update: async (data: UpdateEquipmentDto): Promise<Equipment> => {
    await delay(300);
    
    const index = equipment.findIndex(e => e.id === data.id);
    if (index === -1) {
      throw new Error('設備不存在');
    }
    
    // 驗證
    if (data.name !== undefined && data.name.trim() === '') {
      throw new Error('設備的名稱不可為空');
    }
    if (data.status !== undefined && !data.status) {
      throw new Error('設備的狀態不可為空');
    }
    if (data.tag !== undefined && !data.tag) {
      throw new Error('設備的tag不可為空');
    }
    if (data.price !== undefined && data.price < 0) {
      throw new Error('設備的金額必須 >= 0');
    }
    
    equipment[index] = { ...equipment[index], ...data };
    return equipment[index];
  },

  // 刪除設備
  remove: async (id: number): Promise<void> => {
    await delay(300);
    const index = equipment.findIndex(e => e.id === id);
    if (index === -1) {
      throw new Error('設備不存在');
    }
    equipment.splice(index, 1);
  },
};

