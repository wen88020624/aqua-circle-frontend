// 餵食記錄 API（真實 API）
import { apiRequest } from './client';
import type { FeedingRecord, CreateFeedingRecordDto, UpdateFeedingRecordDto } from '../types';

export const feedingApi = {
  // 取得所有餵食記錄
  findAll: async (): Promise<FeedingRecord[]> => {
    return apiRequest<FeedingRecord[]>('/feeding-records');
  },

  // 根據魚缸 ID 取得餵食記錄
  findByAquariumId: async (aquariumId: number): Promise<FeedingRecord[]> => {
    return apiRequest<FeedingRecord[]>(`/feeding-records?aquariumId=${aquariumId}`);
  },

  // 建立新餵食記錄
  create: async (data: CreateFeedingRecordDto): Promise<FeedingRecord> => {
    return apiRequest<FeedingRecord>('/feeding-records', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  // 更新餵食記錄
  update: async (data: UpdateFeedingRecordDto): Promise<FeedingRecord> => {
    const { id, ...updateData } = data;
    return apiRequest<FeedingRecord>(`/feeding-records/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(updateData),
    });
  },

  // 刪除餵食記錄
  remove: async (id: number): Promise<void> => {
    await apiRequest<void>(`/feeding-records/${id}`, {
      method: 'DELETE',
    });
  },
};

