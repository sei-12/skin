<p align="center">
<a >
<img src="src-tauri/icons/icon.png" alt="Slidev" height="250" width="250"/>
</a>
</p>
<h1 align="center">skin</h1>
<div align="center">

  ![workflow](https://github.com/sei-12/skin/actions/workflows/ci.yml/badge.svg)
  ![workflow](https://github.com/sei-12/skin/actions/workflows/publish.yml/badge.svg)
  ![GitHub License](https://img.shields.io/github/license/sei-12/skin)
<br/>
<a align="center">タグで検索を行うブックマークマネージャー</a>
</div>


![sample](assets/readme3.gif)

# 特徴
 - グローバルホットキーからウィンドウを表示します
 - ほとんどの操作がキーボードでできます。
 - タグの入力時にはIDEのようにポップアップウィンドウが表示され補完します。


# インストール

### Mac
無料の証明書なので警告が出ます.<br>
```sh
brew tap sei-12/formulae
brew install --cask skin
```

### ソースからビルドする場合
```sh
git checkout $(git tag -l "app-v*" | sort -V | tail -n 1)
yarn run tauri build
```
