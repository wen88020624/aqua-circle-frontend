# AquaCircle Mobile 架構設計

## 專案結構

```
aqua-circle-mobile/
  src/
    mobile/              # Mobile 平台特定代碼
      components/        # React Native UI 組件
        layout/          # 佈局組件
        forms/           # 表單組件
        lists/           # 列表組件
      screens/          # Mobile 畫面
        HomeScreen.tsx
        AquariumListScreen.tsx
        ...
      navigation/        # React Navigation 設定
        AppNavigator.tsx
      styles/           # StyleSheet 樣式（可選）
  App.tsx               # Mobile App 入口
  index.ts              # 應用程式啟動點
```

## 共用代碼

本專案與 `aqua-circle-web` 共用代碼，位於 `packages/shared/`：

### 可共用內容

1. **API 服務層** (`@aquacircle/shared/api`)
   - 所有 API 調用邏輯
   - HTTP 客戶端配置
   - 錯誤處理
   - ✅ **Web 和 Mobile 完全共用**

2. **類型定義** (`@aquacircle/shared/types`)
   - TypeScript interfaces/types
   - DTO 定義
   - ✅ **Web 和 Mobile 完全共用**

3. **工具函數** (`@aquacircle/shared/utils`)
   - 資料驗證函數
   - 資料轉換函數
   - 常數定義
   - ✅ **Web 和 Mobile 完全共用**

4. **Mock 資料** (`@aquacircle/shared/mocks`)
   - 開發和測試用的假資料
   - ✅ **Web 和 Mobile 完全共用**

## 平台特定層

### Mobile 特定內容

1. **UI 組件** (`mobile/components/`)
   - 使用 React Native 組件
   - View, Text, TouchableOpacity 等
   - ❌ **與 Web 不同，需要重新實作**

2. **導航** (`mobile/navigation/`)
   - React Navigation
   - Stack Navigator, Tab Navigator 等
   - ❌ **Web 使用 React Router**

3. **樣式** (`mobile/styles/`)
   - StyleSheet API
   - ❌ **Web 使用 CSS/Tailwind CSS**

4. **畫面** (`mobile/screens/`)
   - Mobile 特定的畫面設計
   - 觸控優化
   - ❌ **Web 使用 pages/**

## 使用共用代碼

### 導入 API

```typescript
import { aquariumApi } from '@aquacircle/shared/api';

// 使用 API
const aquariums = await aquariumApi.findAll();
```

### 導入類型

```typescript
import type { Aquarium, Organism } from '@aquacircle/shared/types';

const aquarium: Aquarium = {
  id: 1,
  name: '我的魚缸',
  // ...
};
```

### 導入工具函數

```typescript
import { getTodayDate, AQUARIUM_STATUSES } from '@aquacircle/shared/utils';

const today = getTodayDate();
const statuses = AQUARIUM_STATUSES;
```

## 路徑別名配置

專案使用 Babel 和 TypeScript 路徑別名來引用共用代碼：

### TypeScript (`tsconfig.json`)

```json
{
  "compilerOptions": {
    "paths": {
      "@aquacircle/shared": ["../packages/shared/src"],
      "@aquacircle/shared/*": ["../packages/shared/src/*"]
    }
  }
}
```

### Babel (`babel.config.js`)

```javascript
{
  plugins: [
    [
      'module-resolver',
      {
        alias: {
          '@aquacircle/shared': '../packages/shared/src',
        },
      },
    ],
  ],
}
```

## 開發指南

### 建立新畫面

1. 在 `src/mobile/screens/` 建立新的畫面組件
2. 在 `src/mobile/navigation/AppNavigator.tsx` 註冊新路由
3. 使用共用 API 和類型

範例：

```typescript
// src/mobile/screens/OrganismListScreen.tsx
import React, { useEffect, useState } from 'react';
import { View, Text, FlatList } from 'react-native';
import { organismApi } from '@aquacircle/shared/api';
import type { Organism } from '@aquacircle/shared/types';

export default function OrganismListScreen() {
  const [organisms, setOrganisms] = useState<Organism[]>([]);
  
  useEffect(() => {
    loadOrganisms();
  }, []);

  const loadOrganisms = async () => {
    const data = await organismApi.findAll();
    setOrganisms(data);
  };

  return (
    <FlatList
      data={organisms}
      renderItem={({ item }) => <Text>{item.name}</Text>}
    />
  );
}
```

### 建立新組件

在 `src/mobile/components/` 建立 React Native 組件：

```typescript
// src/mobile/components/AquariumCard.tsx
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import type { Aquarium } from '@aquacircle/shared/types';

interface Props {
  aquarium: Aquarium;
}

export default function AquariumCard({ aquarium }: Props) {
  return (
    <View style={styles.card}>
      <Text style={styles.title}>{aquarium.name}</Text>
      <Text>容量: {aquarium.capacity}L</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    padding: 16,
    backgroundColor: '#fff',
    borderRadius: 8,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
  },
});
```

## 注意事項

- ⚠️ **不要**在 `mobile/` 中直接使用 Web 特定的 API（如 DOM API）
- ⚠️ **不要**在共用代碼中引入 React Native 或 React DOM 特定的依賴
- ✅ **可以**在 `mobile/` 中使用所有 React Native 組件和 API
- ✅ **可以**在共用代碼中使用純 JavaScript/TypeScript 函數

## 與 Web 的差異

| 功能 | Web | Mobile |
|------|-----|--------|
| UI 組件 | div, button, input | View, Text, TouchableOpacity |
| 路由 | React Router | React Navigation |
| 樣式 | CSS/Tailwind | StyleSheet API |
| 表單 | HTML form | React Native 表單組件 |
| 導航 | 側邊欄/頂部導航 | Tab Navigator/Drawer |

