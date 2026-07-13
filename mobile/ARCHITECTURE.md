# AquaCircle Mobile 架構設計

> 資料流與工具鏈的**目標契約**以 `../.github/copilot-instructions.md` 為準（pnpm、Biome、Redux + Saga + axios、英文 UI）。本檔著重 Mobile 目錄與平台邊界；若與 copilot-instructions 衝突，以該文件為準。

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

1. **API + Redux 資料流**（`@aquacircle/shared`）
   - axios 封裝、`API` 路徑常數、`fetchApi`
   - saga／reducer／store 邏輯
   - ✅ **Web 和 Mobile 完全共用**（UI 只 dispatch／select）

2. **類型定義**（`@aquacircle/shared/types`）
   - TypeScript interfaces/types
   - DTO 定義
   - ✅ **Web 和 Mobile 完全共用**

3. **工具函數**（`@aquacircle/shared/utils`）
   - 資料驗證函數
   - 資料轉換函數
   - 常數定義
   - ✅ **Web 和 Mobile 完全共用**

4. **Mock 資料**（`@aquacircle/shared/mocks`）
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

3. **樣式** (`mobile/styles/` 或 Screen 內 StyleSheet)
   - StyleSheet API
   - ❌ **Web 使用 Joy UI + SCSS modules**

4. **畫面** (`mobile/screens/`)
   - Mobile 特定的畫面設計；只 dispatch Redux，不直接 axios
   - ❌ **Web 使用 `web/src/app/<path>/` 三檔契約**

## 使用共用代碼

### 導入類型與工具

```typescript
import type { Aquarium, Organism } from '@aquacircle/shared/types';
import { getTodayDate, AQUARIUM_STATUSES } from '@aquacircle/shared/utils';
```

### 資料流（Redux）

```typescript
import { useDispatch, useSelector } from 'react-redux';

const dispatch = useDispatch();
const { list } = useSelector((state) => state.aquarium);

dispatch({ type: 'FETCH_AQUARIUMS' });
// ❌ 不要在 Screen 直接呼叫 axios 或 aquariumApi.findAll()
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
3. 使用 `useDispatch`／`useSelector` 與 shared saga（UI 文案英文）

範例：

```typescript
// src/mobile/screens/OrganismListScreen.tsx
import React, { useEffect } from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';

export default function OrganismListScreen() {
  const dispatch = useDispatch();
  const organisms = useSelector((state: { organism: { list: { id: number; name: string }[] } }) => state.organism.list);

  useEffect(() => {
    dispatch({ type: 'FETCH_ORGANISMS' });
  }, [dispatch]);

  return (
    <FlatList
      data={organisms}
      keyExtractor={(item) => String(item.id)}
      renderItem={({ item }) => <Text>{item.name}</Text>}
      ListHeaderComponent={<Text style={styles.title}>Organisms</Text>}
    />
  );
}

const styles = StyleSheet.create({
  title: { fontSize: 18, fontWeight: 'bold' },
});
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
      <Text>Status: {aquarium.status}</Text>
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
| UI 元件 | Joy UI | View, Text, Pressable 等 |
| 路由 | React Router + `src/app` 三檔 | React Navigation + screens |
| 樣式 | SCSS modules | StyleSheet |
| 資料流 | 共用 Redux + Saga + axios | 相同 |
| 文案 | English | English |

