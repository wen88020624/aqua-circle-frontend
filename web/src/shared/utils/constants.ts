// 工具函數：取得今天的日期（格式：YYYY-MM-DD）
export function getTodayDate(): string {
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, '0');
  const day = String(today.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

// 常數定義
export const AQUARIUM_STATUSES: Array<'開缸' | '穩定' | '治療' | '閒置'> = [
  '開缸',
  '穩定',
  '治療',
  '閒置',
];

export const ORGANISM_TAGS: Array<'上層魚' | '底棲魚' | '異形' | '古代魚' | '蝦'> = [
  '上層魚',
  '底棲魚',
  '異形',
  '古代魚',
  '蝦',
];

export const HEALTH_STATUSES: Array<'過胖' | '過瘦' | '正常' | '生病' | '精神異常' | '死亡'> = [
  '過胖',
  '過瘦',
  '正常',
  '生病',
  '精神異常',
  '死亡',
];

export const GENDERS: Array<'雄' | '雌'> = ['雄', '雌'];

export const MEDICATION_TAGS: Array<'抗生素' | '病毒藥'> = ['抗生素', '病毒藥'];

export const WATER_QUALITY_TEST_TYPES: Array<'NH3+NH4' | 'PH' | 'NO3' | 'NO2'> = [
  'NH3+NH4',
  'PH',
  'NO3',
  'NO2',
];

export const CONSUMABLE_TAGS: Array<'藥品' | '濾材' | '飼料'> = ['藥品', '濾材', '飼料'];

export const CONSUMABLE_STATUSES: Array<'使用中' | '用完' | '丟棄'> = [
  '使用中',
  '用完',
  '丟棄',
];

export const EQUIPMENT_TAGS: Array<'燈具' | '過濾器'> = ['燈具', '過濾器'];

export const EQUIPMENT_STATUSES: Array<'使用中' | '閒置' | '賣掉' | '丟棄'> = [
  '使用中',
  '閒置',
  '賣掉',
  '丟棄',
];

