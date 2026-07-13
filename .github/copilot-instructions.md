# Frontend 專案 Copilot 指導文件

> **目標契約**（新程式碼必須遵守）。現有 Vite pages／local `fetch` 視為 legacy，改動時往本契約收斂。

## 1) 技術堆疊與工具

- Monorepo：`web` / `mobile` / `packages/*`；套件管理使用 **pnpm**。
- Web：React 19 + Vite + React Router + TypeScript。
- Mobile：Expo + React Native + React Navigation。
- 共用：`@aquacircle/shared`（types、axios API、Redux store／saga／reducer、utils）。
- 程式碼品質以 **Biome** 為準（非 ESLint/Prettier 流程）。
- UI 元件優先使用 **Joy UI**（Web）。
- 樣式優先使用 **SCSS modules**（Web）。
- 全域狀態：**Redux + Redux-Saga**；HTTP：**axios**（經 shared `fetchApi`／apiService）。

參考錨點：
- `package.json` / `pnpm-workspace.yaml`（落地後）
- `biome.json`（落地後）
- `packages/shared`（redux / api）
- `mobile/ARCHITECTURE.md`（平台邊界；資料流以本文件為準）

## 2) 目錄與檔案存放契約

```
aqua-circle-frontend/
  packages/shared/src/
    api/           # axios client、API 路徑常數、apiService
    redux/         # saga / reducer / store（Web + Mobile 共用）
    types/
    utils/
    mocks/
  web/src/
    app/<path>/    # Web 頁面（三檔契約）
    components/    # Web 可重用元件（含 forms）
    styles/        # 共用 SCSS 變數
    router/        # AppRouter 註冊路由
  mobile/src/mobile/
    screens/       # Mobile 畫面（dispatch Redux，不直接 axios）
    components/
    navigation/
```

- **共用**：API 常數、axios 封裝、saga、reducer、types、純函式 → 只放 `packages/shared`。
- **平台 UI／路由**：Web 與 Mobile 分開；shared 禁止 `react-dom` / `react-native` / DOM。
- 勿再擴大 `web/src/shared` 副本；新 domain 只進 `packages/shared`。整包刪除副本若觸及 D14 PENDING → 先問人。

## 3) 路由與頁面檔案契約（Web 三檔）

- 新功能頁建立在 `web/src/app/<path>/`，固定三檔：
  - `page.tsx` — 路由入口／薄包裝，不放複雜商業邏輯
  - `content.tsx` — hooks、`dispatch`／`useSelector`、組件組裝
  - `page.module.scss` — 頁面作用域樣式
- 在 `web/src/router/AppRouter.tsx`（或現有 router）註冊對應 route。
- 頁面專屬子元件用 `_components/`，不要塞進 `packages/shared`。
- 舊的單檔 `web/src/web/pages/*.tsx` + plain CSS 視為 legacy，不作為新開發規範。

## 4) 資料流契約（Redux + Saga + axios）

- Component／Page／Screen **只 dispatch action**，不直接呼叫 axios／`fetch`。
- 流程固定：`dispatch` → saga → `fetchApi`（axios）→ reducer。
- 串接 API 前必須先參考 `swagger.json`（或 Nest `http://localhost:3000/api`），並依規格實作。
- loading、token 注入、API error handling 留在 Redux／Saga 機制內。
- action type：`UPPER_SNAKE_CASE`（例：`FETCH_AQUARIUMS`、`SET_API_ERROR`）。
- Saga watcher：查詢／切頁用 `takeLatest`；新增／更新／刪除用 `takeEvery`。

參考錨點（落地後／對齊此結構）：
- `swagger.json`
- `packages/shared/src/redux/saga/`
- `packages/shared/src/redux/reducer/`
- `packages/shared/src/api/`

## 5) Mobile 畫面契約

- 畫面：`mobile/src/mobile/screens/<Name>Screen.tsx`。
- 註冊：`navigation/AppNavigator.tsx` + `RootStackParamList`。
- 同樣只 `dispatch`／`useSelector`，共用 shared 的 saga／reducer。
- 樣式用 React Native `StyleSheet`（無 SCSS modules）；UI 文案仍為英文。

## 6) 表單契約

- 表單使用 **react-hook-form**。
- Joy UI 輸入元件用 `Controller` 整合（Web）。
- 優先复用 `web/src/components/`（或 `new-forms`）既有欄位元件；可滿足需求時不要重複封裝。
- 錯誤訊息顯示在欄位下方，以 error 樣式呈現。
- 驗證優先抽成 rule／schema／共用 helper。

## 7) 狀態管理契約

- 跨頁共享、伺服器驅動狀態 → **Redux**。
- 頁面內局部且複雜的 UI state 可用 `useImmer`／`useState`；不可取代全域狀態。

## 8) 樣式契約（Web）

- 新頁面一律 `page.module.scss`。
- 共用尺寸／顏色從 `web/src/styles/variables.module.scss`（或同等路徑）匯入。
- 維持頁面作用域，避免全域污染。
- UI 與樣式對齊 Joy UI 設計語彙（間距、圓角、陰影、色階）。

## 9) 元件組織契約

- Web 可重用元件：`web/src/components`。
- Mobile：`mobile/src/mobile/components`。
- 單一檔案原則上不超過 500 行；接近上限拆 hooks／utils／子元件。
- 匯入優先 alias（如 `@/`、`@aquacircle/shared/*`）。

## 10) 環境變數

- Web：`VITE_API_BASE_URL`（預設 `http://localhost:3000`）。
- Mobile：`EXPO_PUBLIC_API_BASE_URL`。
- Base URL／axios instance 集中在 shared api 層。

## 11) 內容與輸出規則

- UI 文案必須使用 **英文**。
- 除非明確要求，不新增額外說明文件。
- 必要註解僅限不直觀邏輯。
- 變更保持聚焦；完成任務後更新 `docs/SPRINT_BACKLOG.md`／`FEATURE_INVENTORY.md`（若有對應項）。
- 產品決策只採納 `docs/PRODUCT_DECISIONS.md` 的 `LOCKED`；`PENDING` 先問人。
- 若發現可泛用的新習慣，先詢問是否納入本文件。

## 12) Auth

- 目前無 Auth（D2 PENDING）。不可擅自加登入流程。
- 有 LOCKED 決策後，token 注入走既有 Saga／apiService，不可繞過。

## 13) 快速 Do / Don't

Do:
- 新 Web 頁遵守 `web/src/app` 三檔契約 + Joy UI + `page.module.scss`。
- API 一律走 Redux／Saga／axios（shared）。
- 雙端共用邏輯放 `packages/shared`。
- UI 英文；工具鏈 pnpm + Biome。
- 表單優先 react-hook-form + 既有欄位元件。

Don't:
- 不要在 page／screen／component 直接呼叫 axios 或 `fetch`。
- 不要用 plain CSS／單檔 page 當新頁規範。
- 不要在 shared 放平台 UI。
- 不要只改 `web/src/shared` 副本。
- 不要為 PENDING 決策自行選預設實作。
