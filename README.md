# 棒球看台筆記

以中華職棒觀賽為情境，幫助新球迷理解球隊、守備位置與數據。這個作業的重點是建立可重複使用的 AI 協作規則與文章格式，而不只有單一首頁。

- 網站：https://linweichen716.github.io/baseball-note/
- Repository：https://github.com/LINWeiChen716/baseball-note
- AI 協作規則：[AGENTS.md](AGENTS.md)

以上為本專案使用的發布路徑；最新部署結果請至 Repository 的 Settings → Pages 確認。

## 本機開啟

直接雙擊 `index.html`，不需要安裝套件、金鑰或啟動後端。JavaScript 必須啟用。也可以使用 VS Code Live Server 開啟本資料夾。

## 功能與內容

- 5 篇完整筆記，包含來源、情境、重點與小測驗。
- 可交叉使用分類與關鍵字搜尋，包含無結果提示。
- 九個守備位置互動圖，支援滑鼠與鍵盤。
- 打擊率計算器，處理零打數、負數、小數與安打大於打數。
- 共用文章頁、手機版面、回首頁與文章不存在提示。

| 文章代號 | 主題 |
| --- | --- |
| first-game | 第一次看中職的準備 |
| cpbl-teams | 認識六支球隊與官方資訊 |
| field-positions | 守備位置代號 |
| batting-average | 打擊率教學 |
| double-play | 6－4－3 雙殺 |

## 新增文章，不必重做網頁

1. 先閱讀 `AGENTS.md`。
2. 複製 `templates/lesson.js` 的物件至 `assets/content.js` 陣列；維持 JSON 格式，物件間用逗號分隔，不加註解或尾端逗號。
3. 填好唯一 id、分類、段落、範例、測驗與來源。每篇至少三節；資料需查證並標日期。
4. Windows PowerShell 執行 `powershell -ExecutionPolicy Bypass -File scripts/check.ps1`。
5. 以 `article.html?id=新代號` 開啟文章，確認首頁、搜尋與分類都出現新內容。
6. 手動檢查手機排版、測驗回饋與來源連結，更新這份內容清單。

可交給 AI 的範例指令：

> 請先閱讀 AGENTS.md，依 templates/lesson.js 格式新增一篇「犧牲觸擊」筆記，id 使用 sacrifice-bunt，分類觀賽入門。查詢官方來源並標示適用聯盟與日期，提供至少三節解說、教學假設情境與小測驗。不要複製 article.html，維持既有版型，確認新文章出現在搜尋與分類，並更新 README。

這個指令是未來擴充的示例，本站目前未包含犧牲觸擊文章。

## GitHub Pages 發布

把本資料夾「裡面的內容」上傳至 Repository 第一層，讓第一層直接有 `index.html`、`article.html`、`AGENTS.md`、`assets/`、`templates/`、`scripts/`、`README.md`、`SUBMISSION.md`。不要多包一層資料夾，也不要上傳整個舊作業目錄。

Settings → Pages → Deploy from a branch → main → / (root) → Save。等待 Actions 的 Pages 部署成功，再用 Pages 提供的網址檢查。之後修改檔案並 Commit，Pages 會重新部署。

## 驗收與資料界線

用首頁進入五篇文章；嘗試分類加搜尋、無結果、無效文章 id、測驗對錯選項、全部守備位置。計算器檢查 3/10 = .300、0/10 = .000、10/10 = 1.000；零打數、空白、負數、小數與安打超過打數都必須提示。320px 手機寬度無水平溢出，Tab 可操作連結與按鈕。資料檢查腳本不等於瀏覽器排版驗證。

本站不是官方網站，不含即時比分，不使用球隊商標與球員照片。CPBL 官方資料用於球隊與資訊入口，一般棒球概念引用 MLB 官方 glossary；內容以繁體中文自行整理，數字範例均為教學假設。AI 協助程式與草稿撰寫，作者需閱讀、理解並依自己的想法調整後繳交。
