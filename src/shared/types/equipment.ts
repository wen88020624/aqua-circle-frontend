// 設備類型定義（對應 spec.md 中的 Equipment）
export interface Equipment {
  id: number;
  name: string;
  tag: EquipmentTag;
  status: EquipmentStatus;
  price: number;
  notes?: string | null;
  purchaseDate?: string | null;
  aquariumId?: number | null;
}

export type EquipmentTag = '燈具' | '過濾器';

export type EquipmentStatus = '使用中' | '閒置' | '賣掉' | '丟棄';

export interface CreateEquipmentDto {
  name: string;
  tag: EquipmentTag;
  status: EquipmentStatus;
  price: number;
  notes?: string;
  purchaseDate?: string;
  aquariumId?: number;
}

export interface UpdateEquipmentDto extends Partial<CreateEquipmentDto> {
  id: number;
}

