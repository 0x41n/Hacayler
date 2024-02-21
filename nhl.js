/*
ハケイラー用基本処理
fileUtil.jsも必要
*/
var nhl={wave:[],name:'',type:0,dataB:0,dataC:0,dataD:0},len,qbr;
function makeNhl(obj){//ファイル生成
    var data="926E686C";
    var str=(obj.name+"\0\0\0\0\0\0\0\0").slice(0,8);
    data+=s2h(str)+obj.type.toString(16)+obj.dataB.toString(16);
    if(obj.type==0){data+=obj.dataC.toString(16)+obj.dataD.toString(16);}
    else if(obj.type==1){data+=n2h(obj.dataC,1);}
    else if(obj.type==2){data+=n2h(obj.dataC-1,1);obj.wave=[];}
    obj.wave.flat(Infinity).forEach(n=>{data+=obj.dataD>4?n2h(n,1):n.toString(16);});
    var blob=new Blob([s2bf(data)]);
    return window.URL.createObjectURL(blob);
}
function getNhl(dv){//データ読取
    var q=structuredClone(nhl);
    if(dv.getUint32(0)!=0x926E686C){alert("読み込めないファイルです");return;}
    q.name="";
    for(let i=4;i<12;i++){
        var b=dv.getUint8(i);
        q.name+=b!=0?String.fromCharCode(b):"";
    }
    q.type=parseInt(dv.getUint8(12)/16);
    q.dataB=parseInt(dv.getUint8(12)%16);
    if(q.type==0){//波形メモリ
        q.dataC=parseInt(dv.getUint8(13)/16);
        q.dataD=parseInt(dv.getUint8(13)%16);
        var size=Math.pow(2,q.dataC);
        q.wave=Array(size);
        for(let i=0;i<size;i++){
            q.wave[i]=q.dataD>4?dv.getUint8(i+14):i%2==0?parseInt(dv.getUint8(parseInt(i/2)+14)/16):parseInt(dv.getUint8(parseInt(i/2)+14)%16);
        }
    }else if(q.type==1){//座標指定
        q.dataC=dv.getUint8(13);
        q.dataD=0;
        q.wave=Array(q.dataC).fill().map(()=>[0,0]);
        for(let i=0;i<q.dataC;i++){
            q.wave[i][0]=dv.getUint8(i*2+14);
            q.wave[i][1]=dv.getUint8(i*2+15);
        }
    }else if(q.type==2){//矩形波
        q.dataC=dv.getUint8(13)+1;q.dataD=0;
        q.wave=[];
    }
    return q;
}
function setNhl(obj,name,type,dataB,dataC,dataD){//データ整形
    obj.name=name.slice(0,8).replace(/[^ -~]/gi,'');
    obj.type=parseInt(type);obj.dataB=parseInt(dataB);
    if(type==0){//波形メモリ
        obj.dataC=parseInt(dataC<1?1:dataC>8?8:dataC);
        len=Math.pow(2,nhl.dataC);
        var a=obj.wave.length/len;
        if(a!=1){
            var tmp=Array(len);
            for(let i=0;i<len;i++){
                tmp[i]=a>1?obj.wave[i*a]:obj.wave[parseInt(i*a)];
            }
            obj.wave=Array().concat(tmp);
        }
        obj.dataD=parseInt(dataD<1?1:dataD>8?8:dataD);
        a=Math.pow(2,obj.dataD)/qbr;
        if(a!=1){obj.wave.forEach((n,i)=>{obj.wave[i]=parseInt((n+1)*a-1);});}
        qbr=Math.pow(2,nhl.dataD);
    }else if(type==1){//座標指定
        obj.dataC=parseInt(dataC<2?2:dataC>31?31:dataC);
        obj.dataD=0;
    }else if(type==2){//矩形波
        obj.dataB=parseInt(dataB>15?15:dataB<1?1:dataB);
        obj.dataC=parseInt(dataC>256?256:dataC<obj.dataB+1?obj.dataB+1:dataC);
        obj.dataD=0;
    }
    return obj;
}
function getWaveImg(obj,color,p,W,H){//波形画像生成
    var cvs=document.createElement("canvas");
    cvs.width=W;cvs.height=H;
    var ctx=cvs.getContext("2d");
    ctx.clearRect(0,0,W,H);
    ctx.fillStyle=color;
    if(obj.type==0){//波形メモリ
        let wd=W/obj.wave.length,qbr=Math.pow(2,obj.dataD),hi=H/qbr,x=0,y;
        ctx.strokeStyle=color;ctx.lineWidth=2;
        ctx.beginPath();ctx.moveTo(0,(qbr-1-obj.wave[0])*hi);
        for(let i=0;i<obj.wave.length;i++){
            ctx.lineTo(x,(qbr-1-obj.wave[i])*hi);x+=wd;
            ctx.lineTo(x,(qbr-1-obj.wave[i])*hi);
        }
        ctx.lineTo(W,p>0?0:H);ctx.lineTo(0,p>0?0:H);
    }else if(obj.type==1){//座標指定
        var m=p>0?0:H,x,y;
        ctx.strokeStyle=color;ctx.lineWidth=2;
        ctx.beginPath();ctx.moveTo(0,m);
        for(let i=0;i<obj.dataC;i++){
            x=obj.dataB==1?obj.wave[i][0]*256/200:obj.wave[i][0];
            y=obj.dataD==0?obj.wave[i][1]:128-obj.wave[i][1];
            ctx.lineTo(x*W/256,y*H/256);
        }
        y=obj.dataD==0?obj.wave[0][1]:128-obj.wave[0][1];
        ctx.lineTo(W,y);ctx.lineTo(W,m);
    }else if(obj.type==2){//矩形波
        let wd=W*obj.dataB/obj.dataC;
        ctx.fillRect(0,0,wd,p>0?0:H);
        ctx.fillRect(wd,p>0?0:H/2,W-wd,H/2);
    }
    ctx.fill();
    return ctx.getImageData(0,0,W,H);
}
function initNhl(){//初期化
    nhl.wave=[11,15,14,14,15,14,10,7,9,13,15,9,3,1,1,5,10,13,14,12,6,0,2,6,8,5,2,0,1,1,0,3];
    nhl.name="Sample";nhl.type=0;nhl.dataB=0;nhl.dataC=5;nhl.dataD=4;
    len=Math.pow(2,nhl.dataC);qbr=Math.pow(2,nhl.dataD);
}
/*
WAVファイル関係
*/
var wav={ch:0,bps:8,rate:44100,vol:50,sec:5,key:60,tail:0,len:0},edt={spd:0,d:0},n2w;
function nhl2wav(obj){//wavで書き出し
    n2w=structuredClone(obj);
    if(obj.type==0){
        wav.len=obj.wave.length;
        edt.d=(Math.pow(2,nhl.dataD)-1)/2;
    }else if(obj.type==1){
        wav.len=obj.dataB==0?256:200;
    }else if(obj.type==2){
        wav.len=obj.dataC;
    }
    return makeWav(wav);
}
function n2f(n){//鳴らす音を周波数に変換
    return 440*Math.pow(2,(n-69)/12);
}
function calcWav(o,t){//波形計算
    t*=edt.spd;
    if(n2w.type==0){
        return o.vol*((interp(o,t)-edt.d)/edt.d);
    }else if(n2w.type==1){
        let x0=0,x1,y0,y1,lerp;
        n2w.wave.forEach((x,i)=>{x0=x[0]>(t%o.len)?x0:i;});
        y0=n2w.wave[x0][1];y1=n2w.wave[(x0+1)%n2w.wave.length][1];
        x1=n2w.wave[(x0+1)%n2w.wave.length][0];x1=x1!=0?x1:o.len;x0=n2w.wave[x0][0];
        lerp=((t%o.len)-x0)/(x1-x0);
        return o.vol*(128-(y0+lerp*(y1-y0)))/256;
    }else if(n2w.type==2){
        let a=(t%o.len)<n2w.dataB?1:-1;
        return o.vol*a;
    }
}
function interp(o,now){//補間
    if(n2w.dataB==1){//線形
        let lerp=now%1;
        let y0=n2w.wave[parseInt(now%o.len)],y1=n2w.wave[parseInt((now+1)%o.len)];
        return y0+lerp*(y1-y0);
    }
    //補間なし
    return n2w.wave[parseInt(now%o.len)];
}
function makeWav(obj){//WAVファイル生成
    edt.spd=(n2f(obj.key))/(obj.rate/obj.len);
    //波形長さ調整
    let b=parseInt(obj.bps/8),l=obj.rate*obj.sec,p=obj.rate/(n2f(obj.key));
    if(obj.tail==1){l=p*parseInt(l/p);}
    else if(obj.tail==2){l=p;}
    else if(obj.tail==3){edt.spd=1;l=obj.len;obj.ch=0;}
    //波形データ計算
    var arr=[],dat="";
    for(let k=0;k<l;k++){
        if(obj.ch<1){arr.push(calcWav(obj,k));}
        else{
            arr.push((obj.ch&1)>0?calcWav(obj,k):0);
            arr.push((obj.ch&2)>0?calcWav(obj,k):0);
        }
    }
    let ch=obj.ch<1?1:2;l*=b;
    arr.forEach(t=>{dat+=b>1?n2sh(t*Math.pow(16,b),b):n2h(t+128,b);});
    //WAVファイルヘッダ
    var head=s2h("RIFF")+n2h(l+36,4)+s2h("WAVE")
    +s2h("fmt ")+n2h(16,4)+n2h(1,2)+n2h(ch,2)+n2h(obj.rate,4)
    +n2h(obj.rate*ch*b,4)+n2h(ch*b,2)+n2h(obj.bps,2)
    +s2h("data")+n2h(l,4);
    var blob=new Blob([s2bf(head+dat)]);
    return window.URL.createObjectURL(blob);
}
