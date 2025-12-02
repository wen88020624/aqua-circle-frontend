# AquaCircle 前端架構設計

## 架構概述

本專案採用**分層架構**設計，將共用邏輯與平台特定代碼分離，以便未來擴展到 React Native。

## 目錄結構

```
aqua-circle-web/
  src/
    shared/              # 共用層（未來可提取為獨立 package）
      api/              # API 服務層
        aquarium.ts     # 魚缸 API（真實）
        organism.ts     # 生物 API（Mock）
        feeding.ts      # 餵食記錄 API（Mock）
        waterChange.ts  # 換水記錄 API（Mock）
        medication.ts   # 下藥記錄 API（Mock）
        waterQuality.ts # 水質檢測 API（Mock）
        consumable.ts   # 耗材 API（Mock）
        equipment.ts    # 設備 API（Mock）
        client.ts       # API 客戶端配置
      types/            # TypeScript 類型定義
        aquarium.ts
        organism.ts
        feeding.ts
        ...
        index.ts
      utils/            # 工具函數
        validation.ts   # 驗證函數
        formatters.ts   # 格式化函數
        constants.ts    # 常數定義
      mocks/            # Mock 資料（開發用）
        organisms.ts
        feedings.ts
        ...
    web/                # Web 平台特定代碼
      components/       # Web UI 組件
        layout/
        forms/
        tables/
      pages/            # Web 頁面
        AquariumList.tsx
        OrganismList.tsx
        ...
      styles/           # CSS 樣式
      router/           # React Router 設定
        routes.tsx
        AppRouter.tsx
    App.tsx             # Web App 入口
    main.tsx            # Web 應用程式啟動點
```

## 共用層（Shared Layer）

### 可共用內容

1. **API 服務層** (`shared/api/`)
   - 所有 API 調用邏輯
   - HTTP 客戶端配置
   - 錯誤處理
   - ✅ **Web 和 Mobile 完全共用**

2. **類型定義** (`shared/types/`)
   - TypeScript interfaces/types
   - DTO 定義
   - ✅ **Web 和 Mobile 完全共用**

3. **業務邏輯** (`shared/utils/`)
   - 資料驗證函數
   - 資料轉換函數
   - 計算函數（如換水量計算）
   - ✅ **Web 和 Mobile 完全共用**

4. **常數定義** (`shared/utils/constants.ts`)
   - 狀態選項（魚缸狀態、生物健康程度等）
   - Tag 選項
   - ✅ **Web 和 Mobile 完全共用**

5. **Mock 資料** (`shared/mocks/`)
   - 開發和測試用的假資料
   - ✅ **Web 和 Mobile 完全共用**

## 平台特定層（Platform-Specific Layer）

### Web 特定內容

1. **UI 組件** (`web/components/`)
   - 使用 React DOM
   - HTML 元素（div, button, input 等）
   - ❌ **需要為 Mobile 重新實作**

2. **路由** (`web/router/`)
   - React Router
   - BrowserRouter/HashRouter
   - ❌ **Mobile 使用 React Navigation**

3. **樣式** (`web/styles/`)
   - CSS/CSS Modules
   - Tailwind CSS（如果使用）
   - ❌ **Mobile 使用 StyleSheet**

4. **表單處理**
   - Web 表單元素
   - ❌ **Mobile 可能需要不同庫**

5. **導航結構**
   - Web 導航欄/側邊欄
   - ❌ **Mobile 使用 Tab Navigator 或 Drawer**

## 未來擴展到 React Native

### 建議的目錄結構（未來）

```
aqua-circle-mobile/     # 新的 React Native 專案
  src/
    shared/              # 從 web 專案複製或共用
      api/              # 完全共用
      types/            # 完全共用
      utils/            # 完全共用
      mocks/            # 完全共用
    mobile/             # Mobile 特定代碼
      components/       # React Native 組件
        layout/
        forms/
        lists/
      screens/          # Mobile 畫面
        AquariumList.tsx
        OrganismList.tsx
        ...
      navigation/       # React Navigation 設定
        AppNavigator.tsx
        TabNavigator.tsx
      styles/           # StyleSheet
    App.tsx             # Mobile App 入口
```

### 更好的方案：Monorepo + Shared Package

未來可以考慮將 `shared/` 提取為獨立 package：

```
aqua-circle/
  packages/
    shared/             # 共用 package
      src/
        api/
        types/
        utils/
        mocks/
      package.json
    web/                # Web app
      src/
        web/
        App.tsx
      package.json
    mobile/             # Mobile app（未來）
      src/
        mobile/
        App.tsx
      package.json
  package.json          # Workspace root
```

## API 策略

### 目前實作
- ✅ **魚缸管理**：使用真實 API (`/aquariums`)
- ⚠️ **其他功能**：使用 Mock API（在 `shared/api/` 中）

### Mock API 實作方式
- 在 `shared/api/` 中建立 Mock 實作
- 使用本地資料陣列模擬 API 回應
- 保持與真實 API 相同的介面
- 未來替換為真實 API 時只需修改 `shared/api/` 中的實作

### 範例：Mock API 結構

```typescript
// shared/api/organism.ts
import { Organism, CreateOrganismDto } from '../types';

// Mock 資料
let mockOrganisms: Organism[] = [...];

export const organismApi = {
  findAll: async (): Promise<Organism[]> => {
    // 模擬 API 延遲
    await new Promise(resolve => setTimeout(resolve, 300));
    return mockOrganisms;
  },
  
  create: async (data: CreateOrganismDto): Promise<Organism> => {
    // Mock 實作
    const newOrganism = { id: Date.now(), ...data };
    mockOrganisms.push(newOrganism);
    return newOrganism;
  },
  
  // ... 其他方法
};
```

## 開發建議

1. **優先使用共用層**
   - 所有業務邏輯放在 `shared/`
   - UI 組件只負責展示和互動

2. **保持 API 介面一致**
   - Mock API 和真實 API 使用相同的函數簽名
   - 方便未來切換

3. **類型安全**
   - 所有資料結構都有 TypeScript 類型定義
   - 避免使用 `any`

4. **可測試性**
   - 共用邏輯易於單元測試
   - Mock 資料便於測試

5. **未來遷移路徑**
   - 當後端 API 準備好時，只需修改 `shared/api/` 中的實作
   - 不需要修改頁面或組件代碼

## 注意事項

- ⚠️ **不要**在 `shared/` 中引入任何 Web 或 Mobile 特定的依賴
- ⚠️ **不要**在 `shared/` 中使用 DOM API 或 React Native API
- ✅ **可以**在 `shared/` 中使用純 JavaScript/TypeScript 函數
- ✅ **可以**在 `shared/` 中使用通用的第三方庫（如 date-fns, lodash）

