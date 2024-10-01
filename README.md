# Hacayler / ハケイラー
ちょっとした波形を作れるWeb上のツールです。<br>
作った波形はWAVとして書き出すことが出来るので<br>
Dawで取り込んだりサウンドフォントにしたりして自由に使ってください。<br>
ツールは[ここ](https://0x41n.github.io/Hacayler/)。
### 作れる波形
* Table
  * 最大256サンプル256段階の波形メモリ音源を作れます。
  * 波形に補間をかけたりもできます。
  * 縦横それぞれ2^nで長さを指定。
* Coord
  * 点を直線で結んだ波形が再生されます。
  * 最大256個の点で波形を表現できます。
  * ビットは縦横の長さ。
* Pulse
  * Duty比を指定できるパルス波です。
  * Duty比はH/T。1/2で50%。
* FMpoi
  * FM音源のような音が作れます。
  * C：キャリア、元の波形。左上の波形。
    * CFB：C波形自身を変調させるときの音量。
  * M：モジュレータ、中央上の波形。
    * C波形を読み取る速度をM波形で動かす。(位相変調させる)
    * M回：周波数、M音量：振幅<br> (値を動かしながら波形を見ると分かりやすいかも)
  * A：M波形を減衰させる。右上の波形。エンベロープみたいな…
    * A時：減衰完了までの時間。16で約1秒。
    * A音量：減衰完了時のM波形の振幅。
* Noise
  * ホワイトノイズを生成します。
  * ノイズの種類がいくつかあります。<br>鳴り方がちょっとだけ違う気がします。

### NHDファイル
ハケイラー用の波形の情報を記録したファイルです。<br>
ご自由にお使いください。<br>
「nhd.txt」にファイルの構造がテキトーにまとめられてます。
### WAVファイル
作った波形をWAVファイルとして出力できます。<br>
* rate：サンプリング周波数
* ch
  * Mono：モノラル
  * Stereo：ステレオ
  * L：左のみ
  * R：右のみ
* bit：量子化ビット数
* 長さ
  * 秒数ピッタリ：指定した秒数で出力
  * 周期ピッタリ：指定した秒数くらいで波形の周期に合わせて出力
  * 1周期だけ：波形1周期分のみを出力
  * 必要最低限：音量以外の値を最小にして出力
* vol：音量
* key：音の高さ
* sec：秒数

波形の周期に合わせて出力すると<br>ループの設定が楽になる、かも…
### 更新履歴
| ver | 日付 | 備考 |
| :---: | ---- | ---- |
| 0.1.0 | 2024/03/02 | とりあえずの公開 |
| 0.1.1 | 2024/03/06 | NHLファイルの保存形式を少し修正 |
| 0.2.0 | 2024/04/08 | 波形ファイルを変更<br>エディタをシンプルに |
| 0.2.2 | 2024/04/16 | Noise処理の変更 |
| 0.2.3 | 2024/04/19 | Table処理の修正 |
| 0.3.1 | 2024/09/06 | Coord処理の変更<br>エディタの改修 |
| 0.3.2 | 2024/09/08 | Coord編集の修正<br>保存処理の修正 |
| 0.3.3 | 2024/09/14 | Pulse変な音の修正 |
| 0.3.4 | 2024/09/18 | 読込処理の修正<br>Coord処理の変更 |
| 0.4.0 | 2024/10/01 | FMpoiの追加 |