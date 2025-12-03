// 設備 API（真實 API）- 注意後端 API 路徑是 /equipments
import { apiRequest } from './client';
import type { Equipment, CreateEquipmentDto, UpdateEquipmentDto } from '../types';

export const equipmentApi = {
  // 取得所有設備
  findAll: async (): Promise<Equipment[]> => {
    return apiRequest<Equipment[]>('/equipments');
  },

  // 建立新設備
  create: async (data: CreateEquipmentDto): Promise<Equipment> => {
    return apiRequest<Equipment>('/equipments', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  // 更新設備
  update: async (data: UpdateEquipmentDto): Promise<Equipment> => {
    const { id, ...updateData } = data;
    return apiRequest<Equipment>(`/equipments/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(updateData),
    });
  },

  // 刪除設備
  remove: async (id: number): Promise<void> => {
    await apiRequest<void>(`/equipments/${id}`, {
      method: 'DELETE',
    });
  },
};

