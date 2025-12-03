// 下藥記錄類型定義（對應 spec.md 中的 MedicationRecord）
export interface MedicationRecord {
  id: number;
  medicationName: string; // 下藥名稱
  tag: MedicationTag;
  dosage: number; // 下藥的量（單位：mg/L）
  date: string;
  notes?: string | null;
  aquariumId: number;
}

export type MedicationTag = '抗生素' | '病毒藥';

export interface CreateMedicationRecordDto {
  medicationName: string;
  tag: MedicationTag;
  dosage: number;
  date: string;
  notes?: string;
  aquariumId: number;
}

export interface UpdateMedicationRecordDto extends Partial<CreateMedicationRecordDto> {
  id: number;
}

