// 換水記錄 API（真實 API）
import { apiRequest } from './client';
import type { WaterChangeRecord, CreateWaterChangeRecordDto, UpdateWaterChangeRecordDto } from '../types';

export const waterChangeApi = {
  // 取得所有換水記錄
  findAll: async (): Promise<WaterChangeRecord[]> => {
    return apiRequest<WaterChangeRecord[]>('/water-changes');
  },

  // 根據魚缸 ID 取得換水記錄（前端過濾）
  findByAquariumId: async (aquariumId: number): Promise<WaterChangeRecord[]> => {
    const all = await apiRequest<WaterChangeRecord[]>('/water-changes');
    return all.filter(w => w.aquariumId === aquariumId);
  },

  // 建立新換水記錄
  create: async (data: CreateWaterChangeRecordDto): Promise<WaterChangeRecord> => {
    return apiRequest<WaterChangeRecord>('/water-changes', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  // 更新換水記錄
  update: async (data: UpdateWaterChangeRecordDto): Promise<WaterChangeRecord> => {
    const { id, ...updateData } = data;
    return apiRequest<WaterChangeRecord>(`/water-changes/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(updateData),
    });
  },

  // 刪除換水記錄
  remove: async (id: number): Promise<void> => {
    await apiRequest<void>(`/water-changes/${id}`, {
      method: 'DELETE',
    });
  },
};

