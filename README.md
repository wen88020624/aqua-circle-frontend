# AquaCircle Web

AquaCircle 魚缸管理系統的前端 Web 應用程式。

## 架構設計

本專案採用**分層架構**設計，將共用邏輯與平台特定代碼分離，以便未來擴展到 React Native。

詳細架構說明請參考 [ARCHITECTURE.md](./ARCHITECTURE.md)。

## 功能

- ✅ 魚缸管理（使用真實 API）
- ⚠️ 生物管理（Mock API）
- ⚠️ 餵食記錄管理（Mock API）
- ⚠️ 換水記錄管理（Mock API）
- ⚠️ 下藥記錄管理（Mock API）
- ⚠️ 水質檢測記錄管理（Mock API）
- ⚠️ 耗材管理（Mock API）
- ⚠️ 設備管理（Mock API）

## 開發

### 安裝依賴

```bash
npm install
```

### 設定環境變數

複製 `.env.example` 為 `.env`：

```bash
cp .env.example .env
```

根據你的後端 API 位置調整 `VITE_API_BASE_URL`。

### 啟動開發伺服器

```bash
npm run dev
```

應用程式將在 `http://localhost:5173` 啟動。

### 建置

```bash
npm run build
```

### 預覽建置結果

```bash
npm run preview
```

## 專案結構

```
src/
  shared/              # 共用層（未來可提取為獨立 package）
    api/              # API 服務層
    types/            # TypeScript 類型定義
    utils/            # 工具函數和常數
    mocks/            # Mock 資料
  web/                # Web 平台特定代碼
    components/       # Web UI 組件
    pages/            # Web 頁面
    router/           # React Router 設定
  App.tsx             # Web App 入口
  main.tsx            # 應用程式啟動點
```

## API 策略

- **魚缸管理**：使用真實 API（`/aquariums`）
- **其他功能**：使用 Mock API（在 `shared/api/` 中）

當後端 API 準備好時，只需修改 `shared/api/` 中對應的檔案，將 Mock 實作替換為真實 API 調用即可。

## 未來擴展到 React Native

所有 `shared/` 目錄下的代碼都可以在 React Native 專案中重用：

1. 複製 `shared/` 目錄到 React Native 專案
2. 建立 `mobile/` 目錄存放 React Native 特定代碼
3. 使用 React Navigation 替代 React Router
4. 使用 React Native 組件替代 Web 組件

詳細說明請參考 [ARCHITECTURE.md](./ARCHITECTURE.md)。
