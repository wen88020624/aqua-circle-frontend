// 耗材類型定義（對應 spec.md 中的 Consumable）
export interface Consumable {
  id: number;
  name: string;
  tag: ConsumableTag;
  quantity: number;
  status: ConsumableStatus;
  price: number;
  notes?: string | null;
  purchaseDate?: string | null;
  expiryDate?: string | null;
  aquariumId?: number | null;
}

export type ConsumableTag = '藥品' | '濾材' | '飼料';

export type ConsumableStatus = '使用中' | '用完' | '丟棄';

export interface CreateConsumableDto {
  name: string;
  tag: ConsumableTag;
  quantity: number;
  price: number;
  notes?: string;
  purchaseDate?: string;
  expiryDate?: string;
  aquariumId?: number;
}

export interface UpdateConsumableDto extends Partial<CreateConsumableDto> {
  id: number;
}

