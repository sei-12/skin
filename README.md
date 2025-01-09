# Skin
skinはタグで検索を行うブックマークマネージャーです。

![sample](https://github.com/user-attachments/assets/86b485b1-d05f-4211-9d88-061240f5bac7)

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