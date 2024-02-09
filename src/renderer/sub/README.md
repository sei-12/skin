
# Subのルール

## Import文に関して
基本禁止
utilsをImportはOK
子モジュールをImportはOK

## ファイルサイズが大きくなった場合はフォルダを作る(子モジュール)
hello.tsではないファイルからhello/*をImportするのは禁止
Before
```
hello.ts 
```
After
```
hello.ts
hello/
    aaa.ts
    bbb.ts
```

- utilsからのImportはOK
- Import文を書かなくていい、且つ、300行を超えたぐらいでファイルを分割する(だいたいでOK)
- 寿命がstaticな変数を作らない(readonlyはおｋ)

- document.getElementById
要は引数もしくはcreateElementした要素以外のHTML要素にアクセスするな

- utilsは"絶対に仕様変更が無い処理"
例えば sum(a,b) という関数はどれだけ仕様変更が起きたとしても呼び出し元がそれを呼ばなくなることはあるが、sumの処理の内容が変わることはありえない
utils.test.tsにテストケースを追加することはできても、既存のテストを修正することは絶対にしてはいけない

