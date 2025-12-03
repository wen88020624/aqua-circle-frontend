// 下藥記錄 API（真實 API）
import { apiRequest } from './client';
import type { MedicationRecord, CreateMedicationRecordDto, UpdateMedicationRecordDto } from '../types';

export const medicationApi = {
  // 取得所有下藥記錄
  findAll: async (): Promise<MedicationRecord[]> => {
    return apiRequest<MedicationRecord[]>('/medication-records');
  },

  // 根據魚缸 ID 取得下藥記錄（前端過濾）
  findByAquariumId: async (aquariumId: number): Promise<MedicationRecord[]> => {
    const all = await apiRequest<MedicationRecord[]>('/medication-records');
    return all.filter(m => m.aquariumId === aquariumId);
  },

  // 建立新下藥記錄
  create: async (data: CreateMedicationRecordDto): Promise<MedicationRecord> => {
    return apiRequest<MedicationRecord>('/medication-records', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  // 更新下藥記錄
  update: async (data: UpdateMedicationRecordDto): Promise<MedicationRecord> => {
    const { id, ...updateData } = data;
    return apiRequest<MedicationRecord>(`/medication-records/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(updateData),
    });
  },

  // 刪除下藥記錄
  remove: async (id: number): Promise<void> => {
    await apiRequest<void>(`/medication-records/${id}`, {
      method: 'DELETE',
    });
  },
};

