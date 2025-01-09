# Skin
skinはタグで検索を行うブックマークマネージャーです。

![sample](https://github.com/user-attachments/assets/21b72303-4a8a-4188-84ce-5248a6649b4a)

# 特徴

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
