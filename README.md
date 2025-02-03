skinはタグで検索を行うブックマークマネージャーです。

![workflow](https://github.com/sei-12/skin/actions/workflows/ci.yml/badge.svg)
![workflow](https://github.com/sei-12/skin/actions/workflows/publish.yml/badge.svg)

![sample](assets/readme1.gif)

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
