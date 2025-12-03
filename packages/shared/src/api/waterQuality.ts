// 水質檢測記錄 API（真實 API）
import { apiRequest } from './client';
import type { WaterQualityRecord, CreateWaterQualityRecordDto, UpdateWaterQualityRecordDto } from '../types';

export const waterQualityApi = {
  // 取得所有水質檢測記錄
  findAll: async (): Promise<WaterQualityRecord[]> => {
    return apiRequest<WaterQualityRecord[]>('/water-quality-records');
  },

  // 根據魚缸 ID 取得水質檢測記錄（前端過濾）
  findByAquariumId: async (aquariumId: number): Promise<WaterQualityRecord[]> => {
    const all = await apiRequest<WaterQualityRecord[]>('/water-quality-records');
    return all.filter(w => w.aquariumId === aquariumId);
  },

  // 建立新水質檢測記錄
  create: async (data: CreateWaterQualityRecordDto): Promise<WaterQualityRecord> => {
    return apiRequest<WaterQualityRecord>('/water-quality-records', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  // 更新水質檢測記錄
  update: async (data: UpdateWaterQualityRecordDto): Promise<WaterQualityRecord> => {
    const { id, ...updateData } = data;
    return apiRequest<WaterQualityRecord>(`/water-quality-records/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(updateData),
    });
  },

  // 刪除水質檢測記錄
  remove: async (id: number): Promise<void> => {
    await apiRequest<void>(`/water-quality-records/${id}`, {
      method: 'DELETE',
    });
  },
};

