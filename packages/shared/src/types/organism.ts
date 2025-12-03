// 生物類型定義（對應 spec.md 中的 Creature）
export interface Organism {
  id: number;
  name: string;
  tag: OrganismTag;
  purchaseDate?: string | null;
  price: number;
  healthStatus?: HealthStatus | null;
  gender?: Gender | null;
  length?: number | null;
  notes?: string | null;
  aquariumId: number;
}

export type OrganismTag = '上層魚' | '底棲魚' | '異形' | '古代魚' | '蝦';

export type HealthStatus = '過胖' | '過瘦' | '正常' | '生病' | '精神異常' | '死亡';

export type Gender = '雄' | '雌';

export interface CreateOrganismDto {
  name: string;
  tag: OrganismTag;
  purchaseDate?: string;
  price: number;
  healthStatus?: HealthStatus;
  gender?: Gender;
  length?: number;
  notes?: string;
  aquariumId: number;
}

export interface UpdateOrganismDto extends Partial<CreateOrganismDto> {
  id: number;
}

