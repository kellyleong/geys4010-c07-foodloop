# 食得「伍」浪費｜廚餘的下一站

GEYS4010 C07 的繁體中文廚餘教育網站，從中大校園訪問與問卷出發，介紹 O·PARK、廚餘轉化、堆肥、發電、海外經驗、智能廚餘桶位置與使用方法，並提供追蹤流程地圖及廚餘運送小遊戲。

## 本機開啟

在此資料夾執行：

```sh
python3 -m http.server 8765
```

瀏覽 `http://localhost:8765`。請經由 HTTP 開啟，讓網頁能載入 `data/` 中的 JSON 資料。

## 靜態託管

此網站使用原生 HTML、CSS 與 JavaScript，無需建置、套件安裝或伺服器後端。可將整個資料夾放到支援靜態檔案的網站空間，並以 `index.html` 作為入口。

`assets/` 包含網站所需圖像及 Leaflet 地圖程式；Leaflet 授權見 `assets/leaflet-license.txt`。互動地圖的底圖需要網絡連線。`data/` 包含頁面使用的研究及回收位置 JSON；本儲存庫不包含原始 Word、PDF 或其他研究文件。
