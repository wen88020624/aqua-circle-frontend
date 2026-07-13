---
description: 從本機 NestJS Swagger 抓取 OpenAPI 規格並覆寫前端 swagger.json
---

從 AquaCircle 後端（預設 port 3000）抓取最新 OpenAPI／Swagger 規格，覆寫 `aqua-circle-frontend/swagger.json`。

後端：`SwaggerModule.setup('api', ...)` → JSON 通常在 `http://localhost:3000/api-json`（UI：`/api`）。

## 執行步驟

1. 確認 `aqua-circle-server` 已啟動
2. `curl` 抓取（若 `api-json` 404，再試 `api/json`）
3. pretty-print 寫入前端根目錄 `swagger.json`
4. 回報摘要

```bash
# 在 aqua-circle-frontend 根目錄（建議用 pnpm 工作區）
curl -s http://localhost:3000/api-json | python3 -m json.tool > swagger.json
```

若失敗，告知使用者先啟動後端。

## 成功回報格式

- 寫入路徑：`swagger.json`
- `paths` key 數量
- `info.title`／`info.version`（若有）

## 後續

- 新增 saga／API 常數前必先對齊本檔與後端 DTO。
- 本 skill 不自動 codegen；types 仍維護於 `packages/shared/src/types/`。
