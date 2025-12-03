// 耗材 API（真實 API）- 注意後端 API 路徑是 /supplies
import { apiRequest } from './client';
import type { Consumable, CreateConsumableDto, UpdateConsumableDto } from '../types';

export const consumableApi = {
  // 取得所有耗材
  findAll: async (): Promise<Consumable[]> => {
    return apiRequest<Consumable[]>('/supplies');
  },

  // 取得 tag 為「飼料」的耗材
  findFeedConsumables: async (): Promise<Consumable[]> => {
    const allSupplies = await apiRequest<Consumable[]>('/supplies');
    return allSupplies.filter(c => c.tag === '飼料');
  },

  // 建立新耗材
  create: async (data: CreateConsumableDto): Promise<Consumable> => {
    return apiRequest<Consumable>('/supplies', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  // 更新耗材
  update: async (data: UpdateConsumableDto): Promise<Consumable> => {
    const { id, ...updateData } = data;
    return apiRequest<Consumable>(`/supplies/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(updateData),
    });
  },

  // 刪除耗材
  remove: async (id: number): Promise<void> => {
    await apiRequest<void>(`/supplies/${id}`, {
      method: 'DELETE',
    });
  },
};

