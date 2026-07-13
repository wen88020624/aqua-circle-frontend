---
name: aqua-frontend-dev
description: >-
  實作 AquaCircle Web／Mobile／shared：三檔頁面、Redux Saga、axios、Joy UI、
  pnpm＋Biome、英文 UI。新增頁面、domain API、對齊 Swagger 時使用。
---

# AquaCircle Frontend Dev

實作前讀 `.github/copilot-instructions.md`。只採納 `docs/PRODUCT_DECISIONS.md` 的 LOCKED。

**目標契約**（新碼必遵）。Legacy：單檔 pages、元件內 `fetch` — 觸及則往本契約收斂。

## 工具鏈

- 套件：**pnpm**
- 格式／lint：**Biome**（`pnpm exec biome check --write`）
- Web UI：Joy UI + `page.module.scss`；文案 **英文**

## 切片對照

| 任務 | 做法 |
|------|------|
| 新 domain API | shared：`API` 常數 + saga + reducer + types；註冊 root saga／reducer |
| 新 Web 頁 | `web/src/app/<path>/`：`page.tsx` + `content.tsx` + `page.module.scss`；註冊 router |
| 新 Mobile 畫面 | `*Screen.tsx` + AppNavigator；只 dispatch／select |
| 更新 Swagger | `curl -s http://localhost:3000/api-json \| python3 -m json.tool > swagger.json` |

## 資料流（強制）

```
Component dispatch → saga → fetchApi (axios) → reducer → useSelector
```

```tsx
// ✅
dispatch({ type: "FETCH_AQUARIUMS" })

// ❌
await axios.get("/aquariums")
await aquariumApi.findAll() // 除非尚未遷完且任務僅修 legacy；新碼勿擴此模式
```

- 查詢／分頁：`takeLatest`；寫入：`takeEvery`
- Action：`UPPER_SNAKE_CASE`

## Web 三檔範本

```tsx
// page.tsx
import Content from "./content"
const Page = () => <Content />
export default Page
```

```tsx
// content.tsx — dispatch、hooks、Joy UI、react-hook-form
import styles from "./page.module.scss"
```

```scss
// page.module.scss
@use "@/styles/variables.module" as vars;
```

## Shared 邊界

**放 shared：** axios、API 常數、saga、reducer、types、utils、mocks。

**放平台：** Joy／RN 元件、路由、SCSS／StyleSheet、forms UI。

勿擴大 `web/src/shared` 副本。刪副本若 D14 PENDING → 先問人。

## Don't

- 不要在 page／screen 直接 axios／`fetch`
- 不要新頁用 plain CSS 單檔取代三檔契約
- 不要 shared 引入 RN／DOM
- 不要擅自 Auth（D2 PENDING）
- 完成項更新 `docs/SPRINT_BACKLOG.md`／`FEATURE_INVENTORY.md`

## 錨點

- `.github/copilot-instructions.md`
- `.claude/skills/new-api`、`new-page`、`update-swagger`
- 落地後：`packages/shared/src/redux/*`、`packages/shared/src/api/*`
