# Hacayler / ハケイラー
ちょっとした波形を作れるWeb上のツールです。<br>
作った波形はWAVとして書き出すことが出来るので<br>
Dawで取り込んだりサウンドフォントにしたりして自由に使ってください。<br>
ツールは[ここ](https://0x41n.github.io/Hacayler/)。
### 経緯
* DAWを挟まずに波形メモリ音源をWAVとして出力するだけのツールが欲しかった。<br>
* ついでにWAVファイルの勉強。
### 作れる波形
* Table
  * 最大256サンプル256段階の波形メモリ音源を作れます。
  * 波形に補間をかけたりもできます。
* Coord
  * 点を直線で結んだ波形が再生されます。
  * 最大256個の点で波形を表現できます。
* Pulse
  * Duty比を指定できるパルス波です。
* Noise
  * ホワイトノイズを生成します。
  * ノイズの種類がいくつかあります。鳴り方がちょっとだけ違う気がします。
### NHDファイル
ハケイラー用の波形の情報を記録したファイルです。<br>
ご自由にお使いください。
「nhd.txt」にファイルの構造が簡単にまとめられてます。
<br>
#### 更新履歴
| ver | 日付 | 備考 |
| :---: | ---- | ---- |
| 0.1.0 | 2024/03/02 | とりあえずの公開 |
| 0.1.1 | 2024/03/06 | NHLファイルの保存形式を少し修正 |
| 0.2.0 | 2024/04/08 | 波形ファイルを変更<br>エディタをシンプルに |
| 0.2.2 | 2024/04/16 | Noise処理の変更 |
| 0.2.3 | 2024/04/19 | Table処理の修正 |
