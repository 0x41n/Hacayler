/*
ハケイラー用エディタ
nhl.jsも必要
*/
/*
波形エディタ
id="nhlEdt"のdivを作っておく。
*/
var ms={b:0,x:0,y:0,wid:512,hi:256};
function nhlEditor(){//エディタの表示
    ms.wid=parseInt(right.clientWidth/256)*128;
    ms.hi=ms.wid/2;
    nhlEdt.style.width=ms.wid+'px';
    nhlEdt.style.height=ms.hi+'px';
    let f=`<canvas id='nhlL'width='${ms.wid/4}'height='${ms.hi}'style='background-color:#888'></canvas><canvas id='nhlwv'width='${ms.wid}'height='${ms.hi}'style='background-color:#CCC'><canvas id='nhlcp'width='${ms.wid}'height='${ms.hi}'></canvas></canvas><canvas id='nhlR'width='${ms.wid/4}'height='${ms.hi}'style='background-color:#888'></canvas>`;
    nhlEdt.innerHTML=f;nhlEdt.style.padding="4px";
    nhlEdt.oncontextmenu=()=>{return false;};
    nhlwv.onmousemove=(e)=>{msMov(e);};
    nhlEdt.style.width=ms.wid*3/2+"px";nhlEdt.style.height=ms.hi+"px";
    nhlEdt.style.backgroundColor='#444';
}
function prtWave(obj,m){//波形の表示
    if(m==1){nhlcp.getContext("2d").putImageData(getWaveImg(obj,'rgba(240,128,0,0.5)',0,128,256),0,0);return;}
    var img=getWaveImg(obj,'#505050',1,ms.wid,ms.hi);
    nhlL.getContext("2d").putImageData(img,nhlL.clientWidth-nhlwv.clientWidth,0);
    nhlR.getContext("2d").putImageData(img,0,0);
    nhlwv.getContext("2d").putImageData(img,0,0);
}
window.addEventListener('mousedown',e=>{ms.b=e.buttons;});
window.addEventListener('mouseup',()=>{ms.b=0;setValue();});
function msMov(e){
    if(nhl.type!=0){return;}
    c=e.currentTarget.getBoundingClientRect();
    ms.x=parseInt((e.clientX-c.left)/(e.currentTarget.clientWidth/len));
    ms.y=parseInt(qbr-(e.clientY-c.top)/(e.currentTarget.clientHeight/qbr));
    if(ms.b>0){
        ms.y=ms.y>=qbr?qbr-1:ms.y;
        nhl.wave[ms.x]=ms.b==1?ms.y:nhl.wave[ms.x];
        prtWave(nhl,0);
    }
}
/*
WAV生成のモーダル関係
HTML側にid="wMDL"のdivを作っておく
*/
function wavModal(){//ウィンドウ
    if(wMDL.style.display!="none"){wMDL.style.display="none";return;}
    let css=document.createElement('style');
    css.textContent=`#wMDLwin{user-select:none;width:30em;background-color:#DDD;color:#444;text-align:center;border-radius:1em;border:2px solid #888;padding:1em;}.wMDLtb{table-layout:fixed;width:100%;padding:0.5em 0;}.wMDL{border:0px none;background-color:#FFF;color:#444;padding:0.2em 0.6em;border-radius:0.5em;font-weight:bold;width:95%;}input.wMDL{width:80%;text-align:center;}input[type="button"].wMDL{width:98%;}input[type="button"].wMDL:hover{background-color:#AAA;cursor:pointer;}`;
    document.head.appendChild(css);
    let hz=[[8000,""],[11025,""],[22050,""],[32000,""],[44100,"selected"],[48000,""]];
    let smpl="<select class='wMDL'id='wspl'>";
    hz.forEach(v=>{smpl+=`<option value='${v[0]}'${v[1]}>${v[0]} Hz</option>`;});smpl+="</select>";
    let bit="<select class='wMDL'id='wbit'><option value='8'selected>8 bit</option><option value='16'>16 bit</option></select>";
    let ch="<select class='wMDL'id='wch'><option value='0'selected>モノラル</option><option value='3'>ステレオ</option><option value='1'>左のみ</option><option value='2'>右のみ</option></select>";
    let vol="<input type='number'class='wMDL'value='50'id='wvol'>",key="<input type='number'class='wMDL'value='60'id='wkey'>",sec="<input type='number'class='wMDL'value='5'id='wsec'>";
    let tail="<select class='wMDL'id='wtai'><option value='0'selected>秒数ピッタリ</option><option value='1'>周期ピッタリ</option><option value='2'>1周期だけ</option><option value='3'>必要最低限</option></select>";
    let dl="<table class='wMDLtb'><tr><td><input type='button'class='wMDL'value='ダウンロード'onclick='exWav()'></td><td><input type='button'class='wMDL'id='wpre'value='プレビュー'onclick='preWav()'></td><td><input type='button'class='wMDL'value='キャンセル'onclick='wavModal()'></td></tr></table>";
    let c2="colspan='2'",c3="colspan='3'";
    let tbl=`<table class='wMDLtb'><tr><td ${c3}>サンプリング周波数</td><td ${c3}>チャンネル</td><td ${c3}>サンプルビット</td></tr>`+
        `<tr><td ${c3}>${smpl}</td><td ${c3}>${ch}</td><td ${c3}>${bit}</td></tr>`+
        `<tr><td ${c2}>音量</td><td ${c2}>キー <span id='wscl'style='color:#888;'></span></td><td ${c2}>長さ[秒]</td><td ${c3}>長さ調整</td></tr>`+
        `<tr><td ${c2}>${vol}</td><td ${c2}>${key}</td><td ${c2}>${sec}</td><td ${c3}>${tail}</td></tr></table>`;
    wMDL.style.cssText=`position:fixed;top:0;left:0;width:100vw;height:100vh;background-color:rgba(0,0,0,0.3);display:flex;justify-content:center;align-items:center;`;
    wMDL.innerHTML=`<b><div id='wMDLwin'onchange='setWav()'><big>WAV出力の設定</big><small>${tbl}${dl}</small></div></b>`;
    setWav();
}
function setWav(){//WAV設定反映
    wav.ch=Number(wch.value);wch.value=wav.ch;
    wav.bps=Number(wbit.value);wbit.value=wav.bps;
    wav.rate=Number(wspl.value);wspl.value=wav.rate;
    wav.vol=parseInt(wvol.value<0?0:wvol.value);wvol.value=wav.vol;
    wav.key=parseInt(wkey.value<0?0:wkey.value>127?127:wkey.value);wkey.value=wav.key;
    wav.sec=parseInt(wsec.value<1?1:wsec.value);wsec.value=wav.sec;
    wav.tail=Number(wtai.value);wtai.value=wav.tail;
    let v=wav.key%12;
    wscl.innerHTML=v==0?'C':v==1?'C#':v==2?'D':v==3?'D#':v==4?'E':v==5?'F':v==6?'F#':v==7?'G':v==8?'G#':v==9?'A':v==10?'A#':'B';
    wscl.innerHTML+=parseInt(wav.key/12);
}
function exWav(){//WAV出力
    fileout(nhl.name+".wav",nhl2wav(nhl));
}
var wad=document.createElement('audio');
wad.addEventListener('ended',()=>{wpre.value='プレビュー';},false);
function preWav(){//プレビュー
    if(!wad.paused){wad.pause();wpre.value='プレビュー';return;}
    wad.src=nhl2wav(nhl);wad.play();wpre.value='ストップ';
}