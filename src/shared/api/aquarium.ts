// 魚缸 API（真實 API）
import { apiRequest } from './client';
import type { Aquarium, CreateAquariumDto } from '../types';

export const aquariumApi = {
  // 取得所有魚缸
  findAll: async (): Promise<Aquarium[]> => {
    return apiRequest<Aquarium[]>('/aquariums');
  },

  // 建立新魚缸
  create: async (data: CreateAquariumDto): Promise<Aquarium> => {
    return apiRequest<Aquarium>('/aquariums', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  // 刪除魚缸
  remove: async (id: number): Promise<void> => {
    await apiRequest<void>(`/aquariums/${id}`, {
      method: 'DELETE',
    });
  },
};

