---
description: Scaffold 新 domain 的 Redux Saga 資料流（shared）：API 常數 + saga + reducer
---

新增一個 domain 的完整資料流，寫在 `packages/shared`（Web + Mobile 共用）。Component 只 dispatch，不直接 axios。

## 1. `packages/shared/src/api/API.ts` — API 路徑常數

```ts
export const MY_DOMAIN = "/my-domain"
```

> 先查閱 `swagger.json` 或 `http://localhost:3000/api` 確認 endpoint 與方法。

## 2. `packages/shared/src/redux/saga/myDomain.ts` — Saga

```ts
import { put, takeEvery, takeLatest } from "redux-saga/effects"
import { MY_DOMAIN } from "../../api/API"
import { API_METHOD } from "../../api/apiService"
import { fetchApi } from "./index"

function* fetchList() {
  yield fetchApi({
    method: API_METHOD.GET,
    path: MY_DOMAIN,
    reducer: "FETCH_MY_DOMAIN_RESULT",
  })
}

function* createItem(action: { type: string; payload?: unknown }) {
  const result = yield fetchApi({
    method: API_METHOD.POST,
    path: MY_DOMAIN,
    ...action,
  })
  if (result) yield put({ type: "FETCH_MY_DOMAIN" })
}

function* mySaga() {
  yield takeLatest("FETCH_MY_DOMAIN", fetchList) // 查詢
  yield takeEvery("CREATE_MY_DOMAIN", createItem) // 寫入
}

export default mySaga
```

在 root saga 註冊。

## 3. `packages/shared/src/redux/reducer/myDomain.ts` — Reducer

```ts
const initialState = {
  list: [] as unknown[],
}

const reducer = (state = initialState, action: { type: string; data?: unknown }) => {
  switch (action.type) {
    case "FETCH_MY_DOMAIN_RESULT":
      return { ...state, list: action.data ?? [] }
    default:
      return state
  }
}

export default reducer
```

在 `combineReducers` 註冊。

## 4. Types（建議同步）

`packages/shared/src/types/myDomain.ts` + barrel export（Entity / CreateDto / UpdateDto）。

## Component 使用方式

```tsx
import { useDispatch, useSelector } from "react-redux"

const dispatch = useDispatch()
const { list } = useSelector((state: { myDomain: { list: unknown[] } }) => state.myDomain)

dispatch({ type: "FETCH_MY_DOMAIN" })
```

**Naming 規則：**
- Action types：`UPPER_SNAKE_CASE`
- Saga／reducer 檔名 camelCase、同名
- `useFormData: true` 支援檔案上傳（fetchApi 參數）
- 禁止在 page／screen 直接 import axios
