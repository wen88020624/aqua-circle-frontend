// 生物 API（Mock）
import { mockOrganisms } from '../mocks/organisms';
import type { Organism, CreateOrganismDto, UpdateOrganismDto } from '../types';

// 模擬 API 延遲
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

let organisms = [...mockOrganisms];
let nextId = Math.max(...organisms.map(o => o.id), 0) + 1;

export const organismApi = {
  // 取得所有生物
  findAll: async (): Promise<Organism[]> => {
    await delay(300);
    return [...organisms];
  },

  // 根據魚缸 ID 取得生物
  findByAquariumId: async (aquariumId: number): Promise<Organism[]> => {
    await delay(300);
    return organisms.filter(o => o.aquariumId === aquariumId);
  },

  // 建立新生物
  create: async (data: CreateOrganismDto): Promise<Organism> => {
    await delay(300);
    
    // 驗證
    if (!data.name || data.name.trim() === '') {
      throw new Error('生物的名稱不可為空');
    }
    if (!data.tag) {
      throw new Error('生物的tag不可為空');
    }
    if (data.price < 0) {
      throw new Error('生物的金額必須 >= 0');
    }
    if (data.length !== undefined && data.length < 0) {
      throw new Error('生物的長度必須 >= 0');
    }
    
    const newOrganism: Organism = {
      id: nextId++,
      ...data,
    };
    organisms.push(newOrganism);
    return newOrganism;
  },

  // 更新生物
  update: async (data: UpdateOrganismDto): Promise<Organism> => {
    await delay(300);
    
    const index = organisms.findIndex(o => o.id === data.id);
    if (index === -1) {
      throw new Error('生物不存在');
    }
    
    // 驗證
    if (data.name !== undefined && data.name.trim() === '') {
      throw new Error('生物的名稱不可為空');
    }
    if (data.tag !== undefined && !data.tag) {
      throw new Error('生物的tag不可為空');
    }
    if (data.price !== undefined && data.price < 0) {
      throw new Error('生物的金額必須 >= 0');
    }
    if (data.length !== undefined && data.length < 0) {
      throw new Error('生物的長度必須 >= 0');
    }
    
    organisms[index] = { ...organisms[index], ...data };
    return organisms[index];
  },

  // 刪除生物
  remove: async (id: number): Promise<void> => {
    await delay(300);
    const index = organisms.findIndex(o => o.id === id);
    if (index === -1) {
      throw new Error('生物不存在');
    }
    organisms.splice(index, 1);
  },
};

