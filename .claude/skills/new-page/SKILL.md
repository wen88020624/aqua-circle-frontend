---
description: Scaffold Web 三檔頁面（page + content + page.module.scss）或 Mobile screen
---

## A. Web — `web/src/app/<path>/` 三檔契約

**page.tsx** — 薄入口，只 render `<Content />`：

```tsx
import Content from "./content"

const Page = () => <Content />

export default Page
```

**content.tsx** — hooks、dispatch、組件組裝：

```tsx
import { useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"
import styles from "./page.module.scss"

const Content = () => {
  const dispatch = useDispatch()
  const { list } = useSelector((state: { myDomain: { list: unknown[] } }) => state.myDomain)

  useEffect(() => {
    dispatch({ type: "FETCH_MY_DOMAIN" })
  }, [dispatch])

  return <div className={styles.container}>{/* English UI copy */}</div>
}

export default Content
```

**page.module.scss** — 頁面作用域樣式：

```scss
@use "@/styles/variables.module" as vars;

.container {
  // Joy UI spacing / radius vocabulary
}
```

**接著：**
- 在 router 註冊該 Page
- 需要導覽時更新 Navbar
- 頁面專屬子元件放 `_components/`
- 表單：react-hook-form + Joy UI `Controller`
- **不要**直接呼叫 axios；走 Redux／Saga
- UI 文案一律 **英文**
- `content.tsx` 接近 500 行時拆 hooks／utils／子元件

---

## B. Mobile — screen

在 `mobile/src/mobile/screens/<Name>Screen.tsx`：

- 使用 `useDispatch`／`useSelector`（同一套 shared store）
- 樣式：`StyleSheet.create`
- 註冊 `AppNavigator` + `RootStackParamList`
- UI 文案英文；不直接 axios

```tsx
import { useEffect } from "react"
import { View, Text, StyleSheet } from "react-native"
import { useDispatch, useSelector } from "react-redux"

export default function MyListScreen() {
  const dispatch = useDispatch()
  const { list } = useSelector((state: { myDomain: { list: unknown[] } }) => state.myDomain)

  useEffect(() => {
    dispatch({ type: "FETCH_MY_DOMAIN" })
  }, [dispatch])

  return (
    <View style={styles.container}>
      <Text>My list</Text>
    </View>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1 },
})
```
