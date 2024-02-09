
# Subのルール

- 一切のImport文を禁止 (
    ファイルサイズがおおきくなって分割したい場合は、フォルダを追加、”型情報”はフォルダ内でimport/exportしてOK
)
- Import文を書かなくていい、且つ、300行を超えたぐらいでファイルを分割する(だいたいでOK)
- 寿命がstaticな変数を作らない(readonlyはおｋ)

- document.getElementById
要は引数もしくはcreateElementした要素以外のHTML要素にアクセスするな

