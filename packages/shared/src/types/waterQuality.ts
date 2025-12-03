// 水質檢測記錄類型定義（對應 spec.md 中的 WaterQualityRecord）
export interface WaterQualityRecord {
  id: number;
  testType: WaterQualityTestType; // 檢測種類
  testDate: string; // 檢測日期
  value: number; // 數值
  notes?: string | null;
  aquariumId: number;
}

export type WaterQualityTestType = 'NH3+NH4' | 'PH' | 'NO3' | 'NO2';

export interface CreateWaterQualityRecordDto {
  testType: WaterQualityTestType;
  testDate: string;
  value: number;
  notes?: string;
  aquariumId: number;
}

export interface UpdateWaterQualityRecordDto extends Partial<CreateWaterQualityRecordDto> {
  id: number;
}

