# store

各個頁面的 store 放在 modules 下，這邊要介紹其它檔案

- `history`: 提供 undo/redo 的功能的共用部份，處理 step 的新增與回復
- `step`: 紀錄一次操作的物件，以 json patch 格式記錄如何對 store 進行改變

## History

這邊使用了 immer 這個套件來紀錄並產生 json patch
