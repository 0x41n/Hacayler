var ms={b:0,x:0,y:0,wid:512,hi:256};
//id="nhlEdt"のdivを作っておく
function nhlEditor(){//エディタの表示
    ms.wid=parseInt(body.clientWidth/256)*128;
    ms.hi=ms.wid/2;
    let f=`<canvas id='nhlL'width='${ms.wid/4}'height='${ms.hi}'></canvas><canvas id='nhlwv'width='${ms.wid}'height='${ms.hi}'style='background-color:#00F080;'></canvas><canvas id='nhlR'width='${ms.wid/4}'height='${ms.hi}'></canvas>
    <canvas id='nhlcp'width='${ms.wid}'height='${ms.hi}'style='position:absolute;top:0;left:${ms.wid/4}px;'></canvas></div>
    <canvas id='nhlgrid'width='${ms.wid}'height='${ms.hi}'style='position:absolute;top:0;left:${ms.wid/4}px;'></canvas>`;
    nhlEdt.innerHTML=f;nhlEdt.style.padding="0";
    nhlEdt.oncontextmenu=()=>{return false;};
    nhlgrid.onmousemove=(e)=>{msMov(e);};
    nhlEdt.style.width=ms.wid*3/2+"px";nhlEdt.style.height=ms.hi+"px";
    divSet();wavModal();
}
function prtWave(o,m){//波形の表示
    if(m==1){return;}
    var img=getWaveImg(o,'#063232',1,ms.wid,ms.hi);
    nhlL.getContext("2d").putImageData(img,nhlL.clientWidth-nhlwv.clientWidth,0);
    nhlR.getContext("2d").putImageData(img,0,0);
    nhlwv.getContext("2d").putImageData(img,0,0);
}
window.addEventListener('mousedown',e=>{ms.b=e.buttons;});
window.addEventListener('mouseup',()=>{ms.b=0;setValue()});
function msMov(e){
    if(nhl.type!=0){return;}
    c=e.currentTarget.getBoundingClientRect();
    ms.x=parseInt((e.clientX-c.left)/(e.currentTarget.clientWidth/nhl.len));
    ms.y=parseInt(nhl.qbr-(e.clientY-c.top)/(e.currentTarget.clientHeight/nhl.qbr));
    if(ms.b>0){
        ms.y=ms.y>=nhl.qbr?nhl.qbr-1:ms.y;
        nhl.wave[ms.x]=ms.b==1?ms.y:nhl.wave[ms.x];
        prtWave(nhl,0);
    }
}
//id="wMDL"のdivを作っておく
function wavModal(){//ウィンドウ
    if(wMDL.style.display!="none"){wMDL.style.display="none";return;}
    let smpl=cSel("wspl",pSel.smp,44100);
    let bit=cSel("wbit",pSel.bit,0);
    let ch=cSel("wch",pSel.ch,0);
    let vol="<input type='number'value='50'id='wvol'>",key="<input type='number'value='60'id='wkey'>",sec="<input type='number'value='5'id='wsec'>";
    let tail=cSel("wtai",pSel.len,0);
    let dl="<table class='wMDLtb'><tr><td><input type='button'value='ダウンロード'onclick='exWav()'></td><td><input type='button'id='wpre'style='width:6em;'value='プレビュー'onclick='preWav()'></td><td><input type='button'value='キャンセル'onclick='wavModal()'></td></tr></table>";
    let str=`<span id="fl">
    <div>周波数 ${smpl}<br>チャンネル ${ch}<br>サンプルビット ${bit}</div>
    <div>音量 ${vol}<br>キー ${key}<br> 秒数 ${sec}</div>
    </span><div>長さ調整 ${tail}</div>`;
    wMDL.style.cssText=`position:fixed;top:0;left:0;width:100vw;height:100vh;background-color:rgba(0,0,0,0.3);display:flex;justify-content:center;align-items:center;border:none;`;
    wMDL.innerHTML=`<div id='wMDLwin'onchange='setWav()'>Export wav <span id='wscl'style='color:#7D877D;'></span>${str}${dl}</div>`;
    setWav();
}
function setWav(){//WAV設定反映
    wav.ch=Number(wch.value);wch.value=wav.ch;
    wav.bps=Number(wbit.value);wbit.value=wav.bps;
    wav.rate=Number(wspl.value);wspl.value=wav.rate;
    wop.vol=parseInt(wvol.value<0?0:wvol.value);wvol.value=wop.vol;
    wop.key=parseInt(wkey.value<0?0:wkey.value>127?127:wkey.value);wkey.value=wop.key;
    wop.sec=parseInt(wsec.value<1?1:wsec.value);wsec.value=wop.sec;
    wop.tail=Number(wtai.value);wtai.value=wop.tail;
    let v=wop.key%12;
    wscl.innerHTML=v==0?'C':v==1?'C#':v==2?'D':v==3?'D#':v==4?'E':v==5?'F':v==6?'F#':v==7?'G':v==8?'G#':v==9?'A':v==10?'A#':'B';
    wscl.innerHTML+=parseInt(wop.key/12);
}
function exWav(){//WAV出力
    let n=nhl.name==""?"noname":nhl.name;
    fileout(n+".wav",nhl2wav(nhl));
}
var wad=document.createElement('audio');
wad.addEventListener('ended',()=>{wpre.value='プレビュー';},false);
function preWav(){//プレビュー
    if(!wad.paused){wad.pause();wpre.value='プレビュー';return;}
    wad.src=nhl2wav(nhl);wad.play();wpre.value='ストップ';
}

function cSel(id,arr,ini){//selectタグ生成
    let s=`<select id="${id}">`;
    arr.forEach(t=>{s+=`<option value="${t[1]}"${t[1]==ini?"selected":""}>${t[0]}</option>`;});
    return s+"</select>";
}
const pSel={//選択肢プリセット
    typ:[["波形メモリ",0],["座標指定",1],["矩形波",2],["ノイズ",15]],
    erp:[["なし",0],["線形補間",1]],
    coo:[["Hacayler",0],["ptVoice (old)",1]],
    noi:[["ノーマル",0],["GBモドキ",1],["FCモドキ",2]],
    smp:[["8000 Hz",8000],["11025 Hz",11025],["220250 Hz",22050],["32000 Hz",32000],["44100 Hz",44100],["48000 Hz",48000]],
    ch:[["モノラル",0],["ステレオ",3],["左のみ",1],["右のみ",2]],
    bit:[["8 bit",8],["16 bit",16]],
    len:[["秒数ピッタリ",0],["周期ピッタリ",1],["1周期だけ",2],["必要最低限",3]],
    num:[["10進数",0],["16進数",1]]
};
//id="common"のdivを作っておく
function divSet(){//表示のセット
    common.innerHTML=`名前 <input type='text'id='hname'placeholder='半角 8文字まで'style='width:8em;'> 
    タイプ ${cSel('htype"onchange="selType()',pSel.typ,0)} 数値表示 ${cSel("hhex",pSel.num,0)}`;
}
//id="info"のdivを作っておく
function prtType(){//波形タイプごとの表示切替
    let B,C,D,add="";
    if(htype.value==0){
        B=`補間形式 ${cSel("hB",pSel.erp,0)} `;
        C="サンプル数 <input type='number'class='num'value='5'id='hC'> ";
        D="量子化ビット数 <input type='number'class='num'value='4'id='hD'>";
        add=`<span id='r'>
        <input type='button'onclick='wavShf(1)'value='▲'><input type='button'onclick='wavShf(-1)'value='▼'></span>`;
        //<input type='button'onclick='getTextValue()'value='Import Text'>
    }else if(htype.value==1){
        B=`仕様 ${cSel("hB",pSel.coo,0)} `;
        C="座標数 <input type='number'class='num'id='hC'value='2'> ";
        D="hoge <input type='number'id='hD'disabled>";
        add="まだ準備中です…";
    }else if(htype.value==2){
        B="Duty部分 <input type='number'id='hB'value='1'> ";
        C="Duty全体 <input type='number'id='hC'value='2'> ";
        D="hoge <input type='number'id='hD'disabled>";
    }else{
        B=`仕様 ${cSel("hB",pSel.noi,0)}`;
        C="パラメータ1 <input type='number'id='hC'value='0'> ";
        D="空き <input type='number'id='hD'disabled> ";
    }
    info.innerHTML=`${B}<br>${C}<br>${D}<br>${add}`;
}
function selType(){
    initNhl(htype.value);
    prtType();
}
function wavShf(a){
    nhl=waveShift(nhl,a);setValue();
}
function layor(){//ファイル読込
    var p=document.createElement('input');
    p.type='file';p.accept='.nhl';
    p.click();
    p.addEventListener('change',()=>{
        var reader=new FileReader();
        reader.onload=()=>{
            var dv=new DataView(reader.result);
            var o=getNhl(dv);
            nhlcp.getContext("2d").putImageData(getWaveImg(o,'rgba(255,129,33,0.5)',0,ms.wid,ms.hi),0,0);
        }
        reader.readAsArrayBuffer(p.files[0]);
    });
}
function getTextValue(){
    let arr=hhex.value==0?tval.value.split(','):tval.value.match(/.{2}/g);
    if(hhex.value==1){arr.forEach((t,i)=>{arr[i]=parseInt(t,16);});}
    if(arr.length==nhl.len){
        arr.forEach((t,i)=>{nhl.wave[i]=t>nhl.qbr?nhl.qbr:t<0?0:t});
    }
    setValue();
}
//プレビュー関係
var aud=document.createElement('audio');
aud.addEventListener('ended',()=>{prev.value='Play';},false);
function preview(){//プレビュー
    if(!aud.paused){aud.pause();prev.value='Play';return;}
    wav.ch=0;wav.bps=8;wav.rate=44100;wop.vol=50;wop.sec=2;wop.tail=0;wop.key=prekey.value;
    aud.src=nhl2wav(nhl);aud.play();prev.value='Stop';
}