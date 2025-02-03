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

-   グローバルホットキーからウィンドウを表示します
-   ほとんどの操作がキーボードでできます。
-   タグの入力時には IDE のようにポップアップウィンドウが表示され補完します。

# インストール

### ソースからビルドする場合


ubuntuの場合は以下のパッケージが必要です。
```sh
sudo apt-get update
sudo apt-get install javascriptcoregtk-4.1 libsoup-3.0 webkit2gtk-4.1 librsvg2-dev -y
```

```sh
git clone https://github.com/sei-12/skin.git
cd skin
git checkout master
yarn
yarn run tauri build
```

### Homebrew

無料の証明書なので警告が出ます.<br>

```sh
brew tap sei-12/formulae
brew install --cask skin
```


# データベースの保存場所

-   Linux : `$XDG_DATA_HOME/com.skin.app/database.sqlite` or `$HOME/.local/share/com.skin.app/database.sqlite`
-   macOS : `$HOME/Library/Application Support/com.skin.app/database.sqlite`
-   Windows: `{FOLDERID_RoamingAppData}/com.skin.app/database.sqlite`

詳しくは以下を参照してください<br>
https://jonaskruckenberg.github.io/tauri-sys/tauri_sys/path/fn.app_data_dir.html
