# 快速啟動指南

## 前置需求

- Node.js (建議 v18 或以上)
- npm 或 pnpm
- 手機上安裝 [Expo Go](https://expo.dev/client) 應用程式

## 安裝步驟

1. **安裝依賴**

```bash
cd aqua-circle-mobile
npm install
```

2. **啟動開發伺服器**

```bash
npm start
```

這會啟動 Expo 開發伺服器，並在終端機顯示 QR code。

## 在手機上預覽

### 方法 1: 使用 Expo Go 掃描 QR Code（推薦）

1. 確保手機和電腦連接到**同一個 Wi-Fi 網路**
2. 在手機上打開 Expo Go 應用程式
3. 點擊「Scan QR code」或使用相機掃描終端機中顯示的 QR code
4. 應用程式會自動載入並顯示在手機上

### 方法 2: 使用開發選單

1. 啟動開發伺服器後，按 `a` 開啟 Android 模擬器，或按 `i` 開啟 iOS 模擬器
2. 或按 `w` 在網頁瀏覽器中開啟

## 常見問題

### QR Code 無法掃描

- **確保手機和電腦在同一 Wi-Fi 網路**
- 如果使用 VPN，請暫時關閉
- 嘗試使用「Tunnel」模式：在開發伺服器中按 `s` 切換連線模式

### 無法連接到開發伺服器

- 檢查防火牆設定，確保允許 Expo 的連線
- 嘗試使用 `expo start --tunnel` 使用隧道模式

### 模組解析錯誤

- 確保已安裝所有依賴：`npm install` 或 `pnpm install`
- 清除快取並重新啟動：`expo start -c`
- 刪除 `node_modules` 並重新安裝：
  ```bash
  rm -rf node_modules
  npm install  # 或 pnpm install
  ```

## 開發提示

- 修改程式碼後，應用程式會自動重新載入（Hot Reload）
- 按 `r` 手動重新載入應用程式
- 按 `m` 切換開發選單
- 按 `j` 開啟 React Native Debugger

## 下一步

- 查看 [ARCHITECTURE.md](./ARCHITECTURE.md) 了解專案架構
- 查看 [README.md](./README.md) 了解更多資訊

