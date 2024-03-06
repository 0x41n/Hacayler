# Hacayler / ハケイラー
ちょっとした波形を作れるWeb上のツールです。<br>
作った波形はWAVとして書き出すことが出来るので<br>
Dawで取り込んだりサウンドフォントにしたりして自由に使ってください。<br>
ツールは[ここ](https://0x41n.github.io/Hacayler/)。
### 経緯
* DAWを挟まずに波形メモリ音源をWAVとして出力するだけのツールが欲しかった。<br>
* ついでにWAVファイルの勉強。
### 作れる波形
* 波形メモリ音源
  * 最大256サンプル256段階の波形メモリ音源を作れます。
  * 波形に補間をかけたりもできます。
* 座標指定音源 (調整中)
  * ピストンボイスのような形式の波形です。
  * 点を直線で結んだ波形が再生されます。
* 矩形波
  * Duty比を指定できる単純な波形です。
* ホワイトノイズ
  * ただただホワイトノイズを生成します。
### NHLファイル
ハケイラー用の波形の情報を記録したファイルです。<br>
ご自由にお使いください。
「nhl.txt」にファイルの構造が簡単にまとめられてます。
<br>
#### 更新履歴
| ver | 日付 | 備考 |
| :---: | ---- | ---- |
| 0.1.0 | 2024/03/02 | とりあえずの公開 |
| 0.1.1 | 2024/03/06 | nhlファイルの読書をビットごとに対応。<br>波形メモリ音源のデータがちょっとだけ小さくなるかも。 |
