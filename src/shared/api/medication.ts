// 下藥記錄 API（Mock）
import { mockMedicationRecords } from '../mocks/medications';
import type { MedicationRecord, CreateMedicationRecordDto, UpdateMedicationRecordDto } from '../types';

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

let medicationRecords = [...mockMedicationRecords];
let nextId = Math.max(...medicationRecords.map(m => m.id), 0) + 1;

export const medicationApi = {
  // 取得所有下藥記錄
  findAll: async (): Promise<MedicationRecord[]> => {
    await delay(300);
    return [...medicationRecords];
  },

  // 根據魚缸 ID 取得下藥記錄
  findByAquariumId: async (aquariumId: number): Promise<MedicationRecord[]> => {
    await delay(300);
    return medicationRecords.filter(m => m.aquariumId === aquariumId);
  },

  // 建立新下藥記錄
  create: async (data: CreateMedicationRecordDto): Promise<MedicationRecord> => {
    await delay(300);
    
    // 驗證
    if (!data.medicationName || data.medicationName.trim() === '') {
      throw new Error('下藥記錄的下藥名稱不可為空');
    }
    if (!data.tag) {
      throw new Error('下藥記錄的tag不可為空');
    }
    if (data.dosage === undefined || data.dosage === null) {
      throw new Error('下藥記錄的下藥的量不可為空');
    }
    if (!data.aquariumId) {
      throw new Error('下藥記錄的所屬魚缸不可為空');
    }
    
    const newRecord: MedicationRecord = {
      id: nextId++,
      ...data,
    };
    medicationRecords.push(newRecord);
    return newRecord;
  },

  // 更新下藥記錄
  update: async (data: UpdateMedicationRecordDto): Promise<MedicationRecord> => {
    await delay(300);
    
    const index = medicationRecords.findIndex(m => m.id === data.id);
    if (index === -1) {
      throw new Error('下藥記錄不存在');
    }
    
    // 驗證
    if (data.medicationName !== undefined && data.medicationName.trim() === '') {
      throw new Error('下藥記錄的下藥名稱不可為空');
    }
    if (data.tag !== undefined && !data.tag) {
      throw new Error('下藥記錄的tag不可為空');
    }
    if (data.dosage !== undefined && data.dosage === null) {
      throw new Error('下藥記錄的下藥的量不可為空');
    }
    if (data.aquariumId !== undefined && !data.aquariumId) {
      throw new Error('下藥記錄的所屬魚缸不可為空');
    }
    
    medicationRecords[index] = { ...medicationRecords[index], ...data };
    return medicationRecords[index];
  },

  // 刪除下藥記錄
  remove: async (id: number): Promise<void> => {
    await delay(300);
    const index = medicationRecords.findIndex(m => m.id === id);
    if (index === -1) {
      throw new Error('下藥記錄不存在');
    }
    medicationRecords.splice(index, 1);
  },
};

