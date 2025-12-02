// 魚缸類型定義
export interface Aquarium {
  id: number;
  name: string;
  length: number;
  width: number;
  height: number;
  status: AquariumStatus;
  setupDate: string;
  notes?: string | null;
  createdAt?: string;
  updatedAt?: string;
}

export type AquariumStatus = '開缸' | '穩定' | '治療' | '閒置';

export interface CreateAquariumDto {
  name: string;
  length: number;
  width: number;
  height: number;
  status: AquariumStatus;
  setupDate: string;
  notes?: string;
}

