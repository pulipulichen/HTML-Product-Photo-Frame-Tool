# HTML Product Photo Frame Tool

[English](./README.md) | [繁體中文](./README_zh_tw.md)

這是一個在瀏覽器中執行的圖片合成工具，可將下層底圖與上層框圖/浮水印疊合後輸出為 PNG。

## 線上展示

- [Live Demo](https://pulipulichen.github.io/HTML-Product-Photo-Frame-Tool/)

## 功能特色

- 上下層合成流程：上層圖片以 URL 指定（框圖/浮水印），下層圖片可拖放或點擊選取上傳。
- 下層圖片 URL 輸入：可直接貼上圖片網址作為底圖來源。
- 畫布操作：可直接在畫布上拖曳移動下層底圖位置。
- 對齊模式：`autoShort`、`width`、`height`。
- 下層縮放滑桿：可調整 10% 到 300%。
- 內建快速框圖：一鍵套用 `assets/frame.png` 預設邊框。
- PNG 下載：可輸出合成結果，檔名帶有時間戳記。
- 設定持久化：上層 URL、下層圖片（Data URL）、對齊模式、縮放比例會寫入 `localStorage`。
- URL 參數載入：可透過 `?frame=<url>&photo=<url>` 預先帶入框圖與底圖。
- Fated Finds 解析支援：搭配 `?fated_finds=true` 時，會先透過遠端 API 解析 `photo` 再載入。
- 雙語介面：可在繁體中文與 English 之間即時切換。
- PWA 基礎支援：包含 `manifest.json` 與 service worker，提供 app shell 快取能力。

## URL 參數

- `frame`：預先帶入上層框圖 URL。
- `photo`：預先帶入下層底圖 URL。
- `fated_finds=true`：將 `photo` 視為 Fated Finds 參數，先透過遠端 API 解析為圖片資料後載入。

範例：

```text
https://pulipulichen.github.io/HTML-Product-Photo-Frame-Tool/?frame=https://example.com/frame.png&photo=https://example.com/photo.jpg
```

## 專案結構

- `index.html`：UI 版面與入口。
- `scripts/main.js`：應用程式初始化、事件綁定、狀態串接、service worker 註冊。
- `scripts/core.js`：畫布繪製邏輯。
- `scripts/ui.js`：拖放上傳與畫布 pointer 拖曳行為。
- `scripts/services.js`：`localStorage` 儲存/讀取工具。
- `scripts/utils.js`：工具函式（檔名產生、檔案驗證、縮放解析）。
- `service-worker.js`：app shell 快取策略。
- `e2e/`：Playwright 端對端測試案例。

## 本機執行

本專案是純靜態前端，可用任意靜態伺服器啟動。

範例：

```bash
python -m http.server 8080
```

接著開啟 `http://localhost:8080`。

## E2E 測試（Podman Compose）

Playwright 測試透過 `compose.yml` 與 `Containerfile.test` 在 Podman Compose 內執行。

```bash
npm run start
```

或

```bash
npm run e2e
```

測試輸出目錄：

- `playwright-report/`
- `playwright-report-videos/`
