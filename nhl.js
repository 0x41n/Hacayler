//ハケイラー用基本処理 (fileUtil.js必須)
var nhl={wave:[],name:'',type:0,dataB:0,dataC:0,dataD:0,len:0,qbr:0};
function makeNhl(o){//ファイル生成
    var data="926E686C";
    var str=(o.name+"\0\0\0\0\0\0\0\0").slice(0,8);
    data+=s2h(str)+o.type.toString(16)+o.dataB.toString(16);
    if(o.type==0){data+=o.dataC.toString(16)+o.dataD.toString(16);}
    else if(o.type==1){data+=n2h(o.dataC-1,1);o.wave.shift();}
    else if(o.type==2){data+=n2h(o.dataC-1,1);o.wave=[];}
    else{data+=n2h(o.dataC,1);o.wave=[];}
    o.wave.flat(Infinity).forEach(n=>{data+=o.dataD>4||o.type==1?n2h(n,1):n.toString(16);});
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
    if(q.type==0){
        q.dataC=parseInt(dv.getUint8(13)/16);
        q.dataD=parseInt(dv.getUint8(13)%16);
        q.len=Math.pow(2,q.dataC);
        q.qbr=Math.pow(2,q.dataD);
        q.wave=Array(q.len);
        for(let i=0;i<q.len;i++){
            q.wave[i]=q.dataD>4?dv.getUint8(i+14):i%2==0?parseInt(dv.getUint8(parseInt(i/2)+14)/16):parseInt(dv.getUint8(parseInt(i/2)+14)%16);
        }
    }else if(q.type==1){
        q.dataC=dv.getUint8(13)+1;
        q.dataD=0;
        q.wave=Array(q.dataC).fill().map(()=>[0,128]);
        for(let i=1;i<q.dataC;i++){
            q.wave[i][0]=dv.getUint8((i-1)*2+14);
            q.wave[i][1]=dv.getUint8((i-1)*2+15);
        }
        q.wave.sort();
    }else if(q.type==2){
        q.dataC=dv.getUint8(13)+1;q.dataD=0;q.wave=[];
    }else{
        q.dataC=dv.getUint8(13);q.dataD=0;q.wave=[];
    }
    return q;
}
function setNhl(o,name,type,B,C,D){//データ整形
    o.name=name.slice(0,8).replace(/[^ -~]/gi,'');
    o.type=parseInt(type);o.dataB=parseInt(B);
    if(type==0){
        o.dataC=parseInt(C<1?1:C>8?8:C);
        o.len=Math.pow(2,C);
        var a=o.wave.length/o.len;
        if(a!=1){
            var tmp=Array(o.len);
            for(let i=0;i<o.len;i++){
                tmp[i]=a>1?o.wave[i*a]:o.wave[parseInt(i*a)];
            }
            o.wave=Array().concat(tmp);
        }
        o.dataD=parseInt(D<1?1:D>8?8:D);
        a=Math.pow(2,o.dataD)/o.qbr;
        if(a!=1){o.wave.forEach((n,i)=>{o.wave[i]=parseInt((n+1)*a-1);});}
        o.qbr=Math.pow(2,o.dataD);
    }else if(type==1){
        
    }else if(type==2){
        o.dataB=parseInt(B>15?15:B<0?0:B);
        o.dataC=parseInt(C>256?256:C<o.dataB+1?o.dataB+1:C);
        o.dataD=0;
    }else{
        o.dataB=parseInt(B>15?15:B<0?0:B);
        o.dataC=parseInt(C>255?255:C<0?0:C);
        o.dataD=0;
    }
    return o;
}
function waveShift(o,a){//波形上下移動
    if(o.type==0){
        o.wave.forEach((v,i)=>{o.wave[i]=v+a>=o.qbr?o.qbr-1:v+a<0?0:v+a});
    }
    return o;
}
function initNhl(type){//初期化
    if(type==0){
        nhl.wave=[11,15,14,14,15,14,10,7,9,13,15,9,3,1,1,5,10,13,14,12,6,0,2,6,8,5,2,0,1,1,0,3];
        nhl.dataB=0;nhl.dataC=5;nhl.dataD=4;
        nhl.len=32;nhl.qbr=16;
    }else if(type==1){
        nhl.wave=[[0,128],[1,0],[255,255]];
        nhl.dataB=0;nhl.dataC=3;nhl.dataD=0;
    }else if(type==2){
        nhl.wave=[];nhl.dataB=1;nhl.dataC=2;nhl.dataD=0;
    }else{
        nhl.wave=[];nhl.dataB=0;nhl.dataC=0;nhl.dataD=0;type=15;
    }
    nhl.name="";nhl.type=type;
}
function getWaveImg(o,col,p,W,H){//波形画像生成
    var cvs=document.createElement("canvas");
    cvs.width=W;cvs.height=H;
    var ctx=cvs.getContext("2d");
    ctx.clearRect(0,0,W,H);
    ctx.fillStyle=col;
    if(o.type==0){
        let wd=W/o.len,hi=H/o.qbr,x=0,y;
        ctx.strokeStyle=col;ctx.lineWidth=2;
        ctx.beginPath();ctx.moveTo(0,(o.qbr-1-o.wave[0])*hi);
        for(let i=0;i<o.len;i++){
            ctx.lineTo(x,(o.qbr-1-o.wave[i])*hi);x+=wd;
            ctx.lineTo(x,(o.qbr-1-o.wave[i])*hi);
        }
        ctx.lineTo(W,p>0?0:H);ctx.lineTo(0,p>0?0:H);
    }else if(o.type==1){
        var m=p>0?0:H,x,y;
        ctx.strokeStyle=col;ctx.lineWidth=2;
        ctx.beginPath();ctx.moveTo(0,m);
        for(let i=0;i<o.dataC;i++){
            x=o.dataB==1?o.wave[i][0]*256/200:o.wave[i][0];
            y=256-o.wave[i][1];
            ctx.lineTo(x*W/256,y*H/256);
        }
        ctx.lineTo(W,256-o.wave[0][1]);ctx.lineTo(W,m);
    }else if(o.type==2){
        let wd=W*o.dataB/o.dataC;
        ctx.fillRect(0,0,wd,p>0?0:H);
        ctx.fillRect(wd,p>0?0:H/2,W-wd,H/2);
    }
    ctx.fill();
    return ctx.getImageData(0,0,W,H);
}
//WAVファイル関係
var wav={ch:0,bps:8,rate:44100};
var wop={vol:50,sec:5,key:60,len:0,tail:0,spd:0,d:0},n2w;
var wns={rg:0,out:0};
function nhl2wav(o){//wavで書き出し
    n2w=structuredClone(o);
    if(o.type==0){
        wop.len=o.wave.length;
        wop.d=(o.qbr-1)/2;
    }else if(o.type==1){
        wop.len=o.dataB==0?256:200;
    }else if(o.type==2){
        wop.len=o.dataC;
        wop.d=1;wns.rg=1;
    }else{
        wop.len=256;
        wop.d=0;
        wns.rg=n2w.dataB==0?0xFFFF:1<<14;
        wns.out=1;
    }
    return makeWav();
}
function makeWav(){//WAVファイル生成
    wop.spd=(n2f(wop.key))/(wav.rate/wop.len);
    //波形長さ調整
    let b=parseInt(wav.bps/8),l=wav.rate*wop.sec,p=wav.rate/(n2f(wop.key));
    if(wop.tail==1){l=p*parseInt(l/p);}
    else if(wop.tail==2){l=p;}
    else if(wop.tail==3){wop.spd=1;l=wop.len;wav.ch=0;}
    //波形データ計算
    var arr=[],dat="";
    for(let k=0;k<l;k++){
        if(wav.ch<1){arr.push(calcWav(k));}
        else{
            arr.push((wav.ch&1)>0?calcWav(k):0);
            arr.push((wav.ch&2)>0?calcWav(k):0);
        }
    }
    let ch=wav.ch<1?1:2;l*=b;
    arr.forEach(t=>{dat+=b>1?n2sh(t*Math.pow(16,b),b):n2h(t+128,b);});
    //WAVファイルヘッダ
    var head=s2h("RIFF")+n2h(l+36,4)+s2h("WAVE")
    +s2h("fmt ")+n2h(16,4)+n2h(1,2)+n2h(ch,2)+n2h(wav.rate,4)
    +n2h(wav.rate*ch*b,4)+n2h(ch*b,2)+n2h(wav.bps,2)
    +s2h("data")+n2h(l,4);
    var blob=new Blob([s2bf(head+dat)]);
    return window.URL.createObjectURL(blob);
}
function calcWav(t){//波形計算
    t*=wop.spd;
    if(n2w.type==0){
        return wop.vol*((interp(t)-wop.d)/wop.d);
    }else if(n2w.type==1){
        let x0=0,x1,y0,y1,lerp;
        n2w.wave.forEach((x,i)=>{x0=x[0]>(t%wop.len)?x0:i;});
        y0=n2w.wave[x0][1];y1=n2w.wave[(x0+1)%n2w.wave.length][1];
        x1=n2w.wave[(x0+1)%n2w.wave.length][0];x1=x1!=0?x1:wop.len;x0=n2w.wave[x0][0];
        lerp=((t%wop.len)-x0)/(x1-x0);
        return wop.vol*((y0+lerp*(y1-y0))-128)/256;
    }else if(n2w.type==2){
        if(n2w.dataB==0){
            wop.d=wns.rg>=wop.len?-1:wns.rg<=0?1:wop.d;
            wns.rg+=(wop.d/(wop.len*2));
            return wop.vol*((t%(wop.len-(wop.len*wop.d/256)))<wns.rg?1:-1);
        }else{
            return wop.vol*((t%wop.len)<n2w.dataB?1:-1);
        }
    }else{
        for(let i=0;i<parseInt(parseInt(t)-wop.d);i++){
            if(n2w.dataB==0){
                wns.out=Math.floor(Math.random()*256)/256;
            }else if(n2w.dataB==1){
                if(wns.rg==0){wns.rg=1;}
                wns.rg%=0x10000;
                wns.rg+=wns.rg+(((wns.rg>>(n2w.dataC>0?6:14))^(wns.rg>>(n2w.dataC>0?5:13)))&1);
                wns.out^=wns.rg&1;
            }else if(n2w.dataB==2){
                //wns.rg%=0x8000;
                wns.rg>>=1;
                wns.rg|=((wns.rg^(wns.rg>>(n2w.dataC>0?6:1)))&1)<<14;
                wns.out=wns.rg&1;
                //wns.rg=wns.rg&0b011_1111_1111_1111|wns.out<<14;
            }
        }
        wop.d=parseInt(t);
        return (wns.out-0.5)*wop.vol;
    }
}
function interp(now){//補間
    if(n2w.dataB==1){//線形
        let lerp=now%1;
        let y0=n2w.wave[parseInt(now%wop.len)],y1=n2w.wave[parseInt((now+1)%wop.len)];
        return y0+lerp*(y1-y0);
    }
    //補間なし
    return n2w.wave[parseInt(now%wop.len)];
}
function n2f(n){//キーを周波数に変換
    return 440*Math.pow(2,(n-69)/12);
}