// 生物 API（真實 API）
import { apiRequest } from './client';
import type { Organism, CreateOrganismDto, UpdateOrganismDto } from '../types';

export const organismApi = {
  // 取得所有生物
  findAll: async (): Promise<Organism[]> => {
    return apiRequest<Organism[]>('/organisms');
  },

  // 根據魚缸 ID 取得生物（前端過濾）
  findByAquariumId: async (aquariumId: number): Promise<Organism[]> => {
    const all = await apiRequest<Organism[]>('/organisms');
    return all.filter(o => o.aquariumId === aquariumId);
  },

  // 建立新生物
  create: async (data: CreateOrganismDto): Promise<Organism> => {
    return apiRequest<Organism>('/organisms', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  // 更新生物
  update: async (data: UpdateOrganismDto): Promise<Organism> => {
    const { id, ...updateData } = data;
    return apiRequest<Organism>(`/organisms/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(updateData),
    });
  },

  // 刪除生物
  remove: async (id: number): Promise<void> => {
    await apiRequest<void>(`/organisms/${id}`, {
      method: 'DELETE',
    });
  },
};

