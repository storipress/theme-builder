# src

- `api.ts`: 整個專案的 API 呼叫都要在這邊建一個包裝的函式，不能直接使用 graphql (apollo)
- `bootstrap.ts`: 如果有什麼一定要在專案一開始就執行就放這邊
- `persistent.ts`: 可以將 Vuex 的 store 儲存到 localStorage 或從 localStorage 回復，主要用來存 token
- `global-bus.ts`: 全域的 event bus ，另外這邊用的是 evt 而不是 Vue 自己的 `$on`/`$off`
