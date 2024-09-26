# This folder contains Storipress' Builder, Storipress' site builder designed for Broadsheet layouts

## Overview (EN)

The main pages in this project are the 'Function Page' and 'Preview Page', a set of two different pages. The 'Function Page' provides users with a variety of style controls, whilst the 'Preview Page' provides a live rendering of the results.

| `Feature Page` URL       | `Feature Page` File Location    | `Preview Page` URL | `Preview Page` File Location    | Description                |
| ------------------------ | ------------------------------- | ------------------ | ------------------------------- | -------------------------- |
| `/:clientID/front-page`  | `src/views/front-builder.vue`   | `/front-preview`   | `src/views/front-preview.vue`   | Customise Home Page Styles |
| `/:clientID/article/:id` | `src/views/article-builder.vue` | `/article-preview` | `src/views/article-preview.vue` | Customise Article Styles   |

### `src/components` Table of Contents

Main components are placed here. Currently, they are categorised by the filename of the page (`views`), e.g., only the components used in `src/views/article-builder.vue` will be placed under `src/components/article-builder`, with the addition of several special folders:

- `common`: Common components, refer to README.md for details
- `article-templates`: Article Templates
- `blocks`: Components which can be used from the home page.

### Cross-iframe data synchronization

As the content in Vuex is automatically synchronised to the main/subframe, it must only store data that can be converted to json (e.g. functions or regex will not work)

### TroubleShooting

1. If you see an error related to `hardsource` delete the `node_modules/.cache/hard-source` and re-run `yarn serve`

# 這個資料夾下的是 Builder ，是個可以讓使用者自訂首頁與文章頁面的樣式的地方

## Overview (CN)

這個專案下主要頁面都是「功能頁面」與「預覽頁面」的兩頁一組，「功能頁面」是提供使用者各種控制按鈕，「預覽頁面」則主要只提供結果的預覽

| 功能頁面網址             | 功能頁面檔案位置                | 預覽頁面網址       | 預覽頁面檔案位置                | description  |
| ------------------------ | ------------------------------- | ------------------ | ------------------------------- | ------------ |
| `/:clientID/front-page`  | `src/views/front-builder.vue`   | `/front-preview`   | `src/views/front-preview.vue`   | 自訂首頁樣式 |
| `/:clientID/article/:id` | `src/views/article-builder.vue` | `/article-preview` | `src/views/article-preview.vue` | 自訂文章樣式 |

### `src/components` 目錄

主要的元件都放在這邊，目前以頁面 (`views`) 的檔名做分類，比如只在 `src/views/article-builder.vue` 用到的元件會放在 `src/components/article-builder` 下，另外還有幾個特殊的資料夾：

- `common`: 共用的元件，詳細請參考 `common` 下的 README.md
- `article-templates`: 文章的樣版
- `blocks`: 可以用來組成首頁的元件

### 關於跨 iframe 的資料同步

由於存在 Vuex 中的內容都會自動雙向同步到主/子頁框，因此務必只能存能被轉成 json 的資料 (比如 function 或 regex 就不行)

### TroubleShooting

1. 如果看到 `hardsource` 相關的錯誤，請把 `node_modules/.cache/hard-source` 資料夾刪掉再重新執行 `yarn serve`

# Project setup

```
yarn gql-gen
yarn install
```

### Compiles and hot-reloads for development

```
yarn serve
```

### Compiles and minifies for production

```
yarn build
```

### Lints and fixes files

```
yarn lint
```

### Customize configuration

See [Configuration Reference](https://cli.vuejs.org/config/).
