# AquaCircle Mobile

AquaCircle 的 React Native 行動應用程式，使用 Expo 開發。

## 專案結構

```
aqua-circle-mobile/
  src/
    mobile/              # Mobile 平台特定代碼
      components/        # React Native UI 組件
      screens/          # Mobile 畫面
      navigation/        # React Navigation 設定
      styles/           # StyleSheet 樣式
  App.tsx               # Mobile App 入口
  index.ts              # 應用程式啟動點
```

## 共用代碼

本專案與 `aqua-circle-web` 共用以下代碼（位於 `packages/shared/`）：

- **API 服務層** (`@aquacircle/shared/api`) - 所有 API 調用邏輯
- **類型定義** (`@aquacircle/shared/types`) - TypeScript interfaces/types
- **工具函數** (`@aquacircle/shared/utils`) - 驗證、格式化、常數等
- **Mock 資料** (`@aquacircle/shared/mocks`) - 開發和測試用的假資料

## 安裝依賴

```bash
npm install
# 或使用 pnpm: pnpm install
```

**注意：** 本專案使用 npm 或 pnpm，請不要使用 yarn。

## 啟動開發伺服器

```bash
npm start
```

這會啟動 Expo 開發伺服器，並顯示一個 QR code。

## 在手機上預覽

### 使用 Expo Go

1. 在手機上安裝 [Expo Go](https://expo.dev/client) 應用程式
   - [iOS App Store](https://apps.apple.com/app/expo-go/id982107779)
   - [Google Play Store](https://play.google.com/store/apps/details?id=host.exp.exponent)

2. 確保手機和電腦連接到同一個 Wi-Fi 網路

3. 啟動開發伺服器：
   ```bash
   npm start
   ```

4. 使用 Expo Go 掃描終端機中顯示的 QR code

### 其他啟動選項

```bash
# Android 模擬器
npm run android

# iOS 模擬器 (需要 macOS)
npm run ios

# Web 瀏覽器
npm run web
```

## 環境變數

在 `app.json` 中設定 API 基礎 URL：

```json
{
  "expo": {
    "extra": {
      "apiBaseUrl": "http://your-api-url:3000"
    }
  }
}
```

或在專案根目錄建立 `.env` 檔案：

```
EXPO_PUBLIC_API_BASE_URL=http://your-api-url:3000
```

## 開發指南

### 使用共用代碼

```typescript
// 導入 API
import { aquariumApi } from '@aquacircle/shared/api';

// 導入類型
import type { Aquarium } from '@aquacircle/shared/types';

// 使用 API
const aquariums = await aquariumApi.findAll();
```

### 建立新畫面

1. 在 `src/mobile/screens/` 建立新的畫面組件
2. 在 `src/mobile/navigation/AppNavigator.tsx` 註冊新路由

### 建立新組件

在 `src/mobile/components/` 建立 React Native 組件。

## TypeScript 配置

專案已配置 TypeScript，並設定路徑別名以引用共用代碼：

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

## 注意事項

- UI 組件必須使用 React Native 組件（View, Text, TouchableOpacity 等），不能使用 Web 的 HTML 元素
- 樣式使用 StyleSheet API，不能使用 CSS
- 導航使用 React Navigation，不是 React Router

