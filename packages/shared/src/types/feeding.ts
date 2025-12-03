// 餵食記錄類型定義（對應 spec.md 中的 FeedingRecord）
export interface FeedingRecord {
  id: number;
  date: string;
  consumableId: number;
  consumableName?: string; // 用於顯示，從耗材資料中取得
  notes?: string | null;
  aquariumId: number;
}

export interface CreateFeedingRecordDto {
  date: string;
  consumableId: number;
  notes?: string;
  aquariumId: number;
}

export interface UpdateFeedingRecordDto extends Partial<CreateFeedingRecordDto> {
  id: number;
}

