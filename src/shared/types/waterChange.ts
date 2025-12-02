// 換水記錄類型定義（對應 spec.md 中的 WaterChange）
// 換水量：1/2、1/3、全換（用數字表示：0.5 = 1/2, 0.33 = 1/3, 1.0 = 全換）
export interface WaterChangeRecord {
  id: number;
  date: string;
  waterChangeRatio: number; // 0.5 = 1/2, 0.33 = 1/3, 1.0 = 全換
  notes?: string | null;
  aquariumId: number;
}

export interface CreateWaterChangeRecordDto {
  date: string;
  waterChangeRatio: number;
  notes?: string;
  aquariumId: number;
}

export interface UpdateWaterChangeRecordDto extends Partial<CreateWaterChangeRecordDto> {
  id: number;
}

