let filein=(t,e)=>{let a=document.createElement("input");a.type="file",a.accept="."+t,a.click(),a.addEventListener("change",t=>{let n=new FileReader;n.onload=(t=>{let a=new DataView(n.result);getDV(a,e)}),n.readAsArrayBuffer(a.files[0])})},fileout=(t,e)=>{let a=document.createElement("a");a.download=t,a.href=e,a.click()},dropin=t=>{t.preventDefault();let[e]=t.dataTransfer.files,a=new FileReader;a.onload=(t=>{let e=new DataView(a.result);getDV(e,0)}),a.readAsArrayBuffer(e)},dragin=t=>{t.preventDefault()},nhd={name:"",type:0,datA:0,datB:0,datC:0,datD:0,ln:0,qb:0},getNHD=t=>{if(2439932004!=t.getUint32(0))return alert("読み込めないファイルです。"),nhd;let e,a=structuredClone(nhd),n=t.getUint8(4);for(a.name="",e=5;e<n+5;e++)a.name+=String.fromCharCode(t.getUint8(e));if(a.type=~~(t.getUint8(n+5)/16),a.datA=~~(t.getUint8(n+5)%16),0==a.type)a.datB=1+~~(t.getUint8(n+6)/16),a.ln=2**a.datB,a.datC=1+~~(t.getUint8(n+6)%16),a.qb=2**a.datC,a.datD=unpak(bf2h(t,n+7,a.ln<pakln(a.ln,a.datC)?a.ln:pakln(a.ln,a.datC)),a.datC,a.ln);else if(1==a.type)for(a.datB=t.getUint8(n+6)+1,a.datD=[...Array(a.datB)].map(t=>[0,128]),e=1;e<a.datB;e++)a.datD[e][0]=t.getUint8(2*e+n+5),a.datD[e][1]=t.getUint8(2*e+n+6);else 2==a.type?a.datB=t.getUint8(n+6)+1:14==a.type?a.datB=t.getUint16(n+6):a.datB=t.getUint8(n+6)+1;return fixNHD(a)},exNHD=t=>{t=fixNHD(t);let e="916E6864"+n2h(t.name.length,2)+s2h(t.name)+n2h(t.type,1)+n2h(t.datA,1);0==t.type?e+=n2h(t.datB-1,1)+n2h(t.datC-1,1):14==t.type?e+=n2h(t.datB,4):e+=n2h(t.datB-1,2),0==t.type?e+=pak(t.datD,t.datC):1==t.type&&(t.datD.shift(),t.datD.flat(1/0).forEach(t=>{e+=n2h(t,2)}));let a=new Blob([h2bf(e)]);return window.URL.createObjectURL(a)},fixNHD=t=>{if(t.name=t.name.replace(/[^ -~]/g,""),t.type=rd1(t.type,15,0),t.datA=rd1(t.datA,7,0),0==t.type){t.datB=rd1(t.datB,8,1),t.ln=2**t.datB;let e=t.datD.length/t.ln;if(1!=e){let a=Array(t.ln);for(let n=0;n<t.ln;n++)a[n]=e>1?t.datD[n*e]:t.datD[~~(n*e)];t.datD=Array().concat(a)}t.datC=rd1(t.datC,8,1),1!=(e=2**t.datC/t.qb)&&t.datD.forEach((a,n)=>{t.datD[n]=~~((a+1)*e-1)}),t.qb=2**t.datC}else if(1==t.type){t.ln=256,t.qb=256,t.datC=1,t.datB=rd1(t.datB,256,2);let e=t.datD.length;t.datB>e&&(t.datD=t.datD.concat([...Array(t.datB-e)].map(a=>t.datD[e-1].concat()))),t.datD.length=t.datB,t.datD.forEach((e,a)=>{t.datD[a][0]=rd1(e[0],a<1?0:a+1<t.datB?t.datD[a+1][0]-1:255,a<1?0:t.datD[a-1][0]+1),t.datD[a][1]=rd1(e[1],255,0)})}else 2==t.type?(t.datB=rd1(t.datB,256,t.datA+1),t.ln=t.datB,t.datD=[]):14==t.type?(t.datB=rd1(t.datB,65535,0),t.ln=22050,t.datD=ar4n(t.datD)):(t.datB=rd1(t.datB,256,0==t.datA?2:1),t.datD=[],t.ln=3==t.datA?256:32767,t.qb=0==t.datA?t.datB-1:3==t.datA?128:1,1==t.datA&&1&t.datB&&(t.ln=127),2==t.datA&&1&t.datB&&(t.ln=93));return structuredClone(t)},iniNHD=t=>(q=structuredClone(nhd),q.type=t,0==t?(q.datD=[11,15,14,14,15,14,10,7,9,13,15,9,3,1,1,5,10,13,14,12,6,0,2,6,8,5,2,0,1,1,0,3],q.datA=0,q.datB=5,q.datC=4,q.ln=32,q.qb=16):1==t?(q.datB=3,q.datD=[[0,128],[63,255],[191,0]]):2==t?(q.datA=1,q.datB=2):14==t?(q.datA=1,q.datB=22050,q.datD=[...Array(3)].map(t=>[[0,60],[0,0,32,0],[[0,15],[64,15],[128,15],[255,15]]])):(q.datA=0,q.datB=2,q.ln=32767),q),setNHD=(t,e,a,n,d,l)=>(q=structuredClone(nhd),q.name=t,q.type=e,q.datA=a,q.datB=n,q.datC=d,q.datD=l,fixNHD(q)),wvSft=(t,e)=>(2&e&&1&e?t.datD.unshift(t.datD.pop()):2&e?t.datD.push(t.datD.shift()):t.datD=t.datD.map(a=>rd1(a+(1&e?-1:1),t.qb-1,0)),t),wvImg=(t,e,a,n)=>{const d=document.createElement("canvas");d.width=a,d.height=n;const l=d.getContext("2d");if(l.clearRect(0,0,a,n),l.imageSmoothingEnabled=!1,l.strokeStyle=e,l.lineWidth=2,l.beginPath(),0==t.type){let e=a/t.ln,d=n/t.qb,r=0;t.datD.forEach(a=>{l.lineTo(r,(t.qb-.5-a)*d),r+=e,l.lineTo(r,(t.qb-.5-a)*d)})}else if(1==t.type){let e,d;t.datD.forEach(t=>{e=t[0],d=256-t[1],l.lineTo(e*a/256,d*n/256)}),l.lineTo(a,t.datD[0][1]*n/256),t.datC>0&&l.rect(t.datD[hP.value][0]*a/256-3,n-t.datD[hP.value][1]*n/256-3,6,6)}else if(2==t.type){let e=a*t.datA/t.datB;l.lineTo(0,n/8),l.lineTo(e,n/8),l.lineTo(e,7*n/8),l.lineTo(a,7*n/8)}else if(14==t.type){let e,d=ntone(t);for(e=0;e<256;e++)l.lineTo(e*a/256,(128-d[e*~~(t.datB/256)])*n/256)}else{let e=noise(t);for(i=0;i<256;i++)l.lineTo(i*a/256,e[~~i%e.length]/t.qb*3*n/4+n/8)}return l.stroke(),l.getImageData(0,0,a,n)},rd1=(t,e,a)=>Math.round(t>e?e:t<a?a:t),rnd=t=>Math.floor(Math.random()*t),n2h=(t,e)=>{let a=(t=Math.trunc(t<0?t+16**e:t)).toString(16).padStart(e,"0");return e>1?a.match(/.{2}/g).reverse().join(""):a},s2h=t=>t.split("").map(t=>t.charCodeAt().toString(16).padStart(2,"0")).join(""),h2bf=t=>{let e=new ArrayBuffer(Math.trunc(t.length/2)),a=new DataView(e);return t.match(/.{2}/g).forEach((t,e)=>{a.setUint8(e,parseInt(t,16))}),e},bf2h=(t,e,a)=>{let n,d="";for(n=0;n<a;n++)d+=t.getUint8(e+n).toString(16).padStart(2,"0");return d},ar4n=t=>t instanceof Array?t.map(t=>ar4n(t)):Number(t),gcd=(t,e)=>e?gcd(e,t%e):t,pak=(t,e)=>{if(t.length<pakln(t.length,e))return dat="",t.forEach(t=>{dat+=n2h(t,2)}),dat;let a,n,d,l=gcd(e,4),r=[];for(n=0;n<t.length;n+=4/l){for(a="",d=0;d<4/l;d++)a+=(void 0===t[n+d]?"":t[n+d].toString(2)).padStart(e,"0");a.match(/.{4}/g).forEach(t=>{r.push(parseInt(t,2).toString(16))})}return r.join("")+"0"},unpak=(t,e,a)=>{if(a<pakln(a,e))return(t=t.match(/.{2}/g)).forEach((e,a)=>{t[a]=parseInt(e,16)}),t;let n=[],d="",l=`.{${e}}`;return l=new RegExp(l,"g"),(t=t.match(/.{1}/g)).forEach(t=>{d+=parseInt(t,16).toString(2).padStart(4,"0")}),(d=d.match(l)).forEach(t=>n.push(parseInt(t,2))),n.slice(0,a)},pakln=(t,e)=>{let a=gcd(e,4);return Math.ceil(t*a/4)*e/(2*a)};const wav={d:0,rg:0,out:0};let nhd2WAV=(t,e,a,n,d,l,r,h)=>{1==(t=fixNHD(t)).type?t.qb=coord(t.datD.concat([[256,128]])):2==t.type?(wav.d=1,wav.rg=1):14==t.type?(t.qb=ntone(t),r-=96):15==t.type&&(t.datD=noise(t),t.ln=t.ln>128?128:t.ln);let u=k2f(r),i=~~(a/8),p=n*l,o=u*t.ln/n,v=n/u;1==h?p=v*~~(p/v):2==h?p=v:3==h&&(o=1,p=t.ln,e=0);let c=[],s="";for(let a=0;a<p;a++)e<1?c.push(calcWv(a,t,d,o)):(c.push((1&e)>0?calcWv(a,t,d,o):0),c.push((2&e)>0?calcWv(a,t,d,o):0));e=e<1?1:2,p*=i,c.forEach(t=>s+=n2h(i>1?t*16**i:t+128,2*i));let D=s2h("RIFF")+n2h(p+36,8)+s2h("WAVE")+s2h("fmt ")+n2h(16,8)+n2h(1,4)+n2h(e,4)+n2h(n,8)+n2h(n*e*i,8)+n2h(e*i,4)+n2h(a,4)+s2h("data")+n2h(p*e,8),b=new Blob([h2bf(D+s)]);return window.URL.createObjectURL(b)},k2f=t=>440*2**((t-69)/12),interp=(t,e,a)=>{if(1==e){let e=t%1,n=a[~~(t%a.length)];return n+e*(a[~~((t+1)%a.length)]-n)}return a[~~(t%a.length)]},calcWv=(t,e,a,n)=>{if(t*=n,0==e.type)return a*(interp(t,e.datA,e.datD)/(e.qb-1)-.5);if(1==e.type)return a*(interp(t,1,e.qb)/256-.5);if(2==e.type){if(0==e.datA){wav.d+=1;let n=wav.d/e.ln%(2*e.ln);return a*(n>e.ln?-1:1)*(t%e.ln<n%e.ln?1:-1)/2}return a*(t%e.ln<e.datA?1:-1)/2}return 14==e.type?~~(a*e.qb[~~t]/128):a*(e.datD[~~(t%e.datD.length)]/e.qb-.5)},coord=t=>{let e,a,n=[];for(e=0;e<t.length-1;e++){let d=t[e][1],l=(t[e+1][1]-t[e][1])/(t[e+1][0]-t[e][0]);for(a=t[e][0];a<t[e+1][0];a++)n.push(d),d+=l}return n},noise=t=>{let e,a=[],n=2==t.datA?rnd(16384):3==t.datA?0:65535,d=1;for(e=0;e<t.ln;e++)0==t.datA?d=rnd(t.datB):1==t.datA?(n=0==(n%=65536)?1:n,d^=1&(n+=n+(1&(n>>(1&t.datB?6:14)^n>>(1&t.datB?5:13))))):2==t.datA?(n>>=1,d=1&(n|=(1&(n^n>>(1&t.datB?6:1)))<<15)):3==t.datA&&(d=64+~~((((n=Math.imul(n,214013)+2531011>>>0)>>>16&32767)<<24>>24)/2)),a.push(d);return a},rndaaa=0,ntrnd=t=>(rndaaa=Math.imul(rndaaa,214013)+2531011>>>0)>>>16&32767;const ntwv=[[...Array(256)].map((t,e)=>~~(64*Math.sin(2*Math.fround(Math.PI)*e/256))),[...Array(256)].map((t,e)=>e<64?e:e<192?128-e:e-256),[...Array(256)].map((t,e)=>64-~~(e/2)),[...Array(256)].map((t,e)=>e<128?64:-64),[...Array(256)].map(t=>~~((ntrnd()<<24>>24)/2))];let ntone=t=>{let e,a,n,d,l,r,h=[...Array(t.datB)].map(t=>0);for(d=0;d<t.datA;d++)for(e=coord(t.datD[d][2].concat([[256,0]])),a=ntwv[t.datD[d][1][0]],n=ntwv[t.datD[d][0][0]],r=0,l=0;l<t.datB;l++){let u=256*l/t.datB;r+=256*k2f(t.datD[d][0][1]+a[~~(u*t.datD[d][1][1]%256)]*t.datD[d][1][2]/128)/22050,h[l]+=e[~~u]*n[~~(r%256)]/15}return h=h.map(t=>rd1(t,127,-128))};const kbd=document.createElement("audio");let keybd=t=>{let e='<table style="border-collapse:collapse;cursor:pointer;table-layout:fixed;width:100%;"><tr>';for(let t=0;t<6;t++)for(let t=0;t<12;t++)e+=`<td style='border:solid 1.5px var(--c7);height:1em;background:var(--c${[1,3,6,8,10].includes(t)?6:0})'onmousedown='view(this)'></td>`;roll.innerHTML=e+"</tr></table>"};keybd();let keyup=t=>{kbd.pause(),keybd()},view=t=>{let e=t.cellIndex+24;t.style.background="#9c9e9b",kbd.src=nhd2WAV(nhd,0,8,44100,40,1,e,0),kbd.play()};const aud=document.createElement("audio");let preview=t=>{aud.src=exWAV(),aud.play()},getDV=(t,e)=>{if(0==e)return pType(getNHD(t)),void toHTML(nhd);let a=getNHD(t);a.datC=0,hlay.getContext("2d").putImageData(wvImg(a,"#878988",512,256),0,0)};const pSel={typ:[["Table",0],["Coord",1],["Pulse",2],["Noise",15]],erp:[["None",0],["Lerp",1]],noi:[["Normal",0],["GB-ish",1],["FC-ish",2],["nTone",3]],spl:[["8000",8e3],["11025",11025],["22050",22050],["32000",32e3],["44100",44100],["48000",48e3]],ch:[["Mono",0],["Stereo",3],["L",1],["R",2]],bit:[["8 bit",8],["16 bit",16]],len:[["秒数ピッタリ",0],["周期ピッタリ",1],["1周期だけ",2],["必要最低限",3]],num:[["DEC",0],["HEX",1]],mdl:[["Sine",0],["Triangle",1],["Saw",2],["Square",3],["Noise",4]]};let cSel=(t,e,a)=>{let n=""==t?"":`<select id=${t}>`;return e.forEach(t=>{n+=`<option value="${t[1]}"${t[1]==a?"selected":""}>${t[0]}</option>`}),n+(""==t?"":"</select>")};htype.innerHTML=cSel("",pSel.typ,0),hrate.innerHTML=cSel("",pSel.spl,44100),hch.innerHTML=cSel("",pSel.ch,0),hbit.innerHTML=cSel("",pSel.bit,8),htail.innerHTML=cSel("",pSel.len,0);let exWAV=t=>nhd2WAV(nhd,hch.value,hbit.value,hrate.value,hvol.value,hsec.value,hkey.value,htail.value),toJS=t=>{nhd=setNHD(hname.value,htype.value,hA.value,hB.value,hC.value,nhd.datD),toHTML(nhd)},toHTML=t=>{hname.value=t.name,htype.value=t.type,hA.value=t.datA,hB.value=t.datB,hC.value=t.datC,pWave(t)},pType=t=>{nhd=t;let e,a,n,d="";wd=512,0==t.type?(e=`補間${cSel("hA",pSel.erp,0)} `,a=`サンプル数<input type='number'class='num'value='${t.datB}'id='hB'> `,n=`ビット<input type='number'class='num'value='${t.datC}'id='hC'>`,d="<input type='button'onclick='shift(2)'value='<'> <input type='button'onclick='shift(0)'value='▲'> <input type='button'onclick='shift(1)'value='▼'> <input type='button'onclick='shift(3)'value='>'><br>補間: 波形が滑らかになる<br>サンプル数: 横軸の長さ<br>ビット: 縦軸の長さ"):1==t.type?(e=`座標数<input type='number'class='num'id='hB'value='${t.datB}'onchange="hP.value=rd1(hP.value,this.value-1,1)"> `,a="<input type='number'id='hA'disabled> ",n="<input type='number'id='hC'disabled>",d=`うごかす点 <input type='number'id='hP'value='1'onchange='point(0)'><br>X: <input type='number'id='hX'onchange='point(1)'value='${t.datD[1][0]}'> Y: <input type='number'id='hY'onchange='point(1)'value='${t.datD[1][1]}'><br><br>両端の座標は固定`):2==t.type?(e=`分子<input type='number'id='hA'value='${t.datA}'> `,a=`分母<input type='number'id='hB'value='${t.datB}'> `,n="<input type='number'id='hC'disabled>",d="分子: 値が高い部分 (左側) の長さ<br>分母: 全体の長さ<br><br>分子が0だと変な音になる<br>分母の値で速度調整"):14==t.type?(wd=384,e=`トラック数<input type='number'id='hA'value='${t.datA}'onchange='this.value=rd1(this.value,3,1)'> `,a=`サンプル数<input type='number'id='hB'style='width:4em'value='${t.datB}'> `,n="<input type='number'id='hC'disabled>",d=`<span onchange="ntedt()">編集トラック<input type="number"id="htrack"value="1"onchange="ntml(nhd)"><br>-メイン-<br>　波形${cSel("h1mdl",pSel.mdl,0)} キー<input type="number"id="h1frq"value="60"onchange="this.value=rd1(this.value,127,0)"><br>-ピッチ-<br>　波形${cSel("h2mdl",pSel.mdl,0)} 回数<input type="number"id="h2frq"value="0"onchange="this.value=rd1(this.value,127,0)"> 振幅<input type="number"id="h2top"value="32"onchange="this.value=rd1(this.value,63,0)"> 周期ずらし<input type="number"id="h2off"value="0"onchange="this.value=rd1(this.value,255,0)"><br>-エンベロープ-<br>　初期音量<input type="number"id="hES0"value="15"onchange="this.value=rd1(this.value,15,0)"><br>　時間1<input type="number"id="hED1"value="64"onchange="this.value=rd1(this.value,255,0)">  時間2<input type="number"id="hED2"value="128"onchange="this.value=rd1(this.value,255,0)"> 時間3<input type="number"id="hED3"value="255"onchange="this.value=rd1(this.value,255,0)"><br>　音量1<input type="number"id="hES1"value="15"onchange="this.value=rd1(this.value,15,0)"> 音量2<input type="number"id="hES2"value="15"onchange="this.value=rd1(this.value,15,0)"> 音量3<input type="number"id="hES3"value="15"onchange="this.value=rd1(this.value,15,0)"></span>`):(e=`タイプ${cSel("hA",pSel.noi,0)} `,a=`ぱらめ<input type='number'id='hB'value='${t.datB}'> `,n="<input type='number'id='hC'disabled>",d="ぱらめをいじると音が変わったりする"),hopt.innerHTML=e+a+n,hadd.innerHTML=d,hlay.width=wd,hD.width=wd},shift=t=>{nhd=wvSft(nhd,t),pWave(nhd)},point=t=>{if(0==t)return hP.value=rd1(hP.value,nhd.datB-1,1),hX.value=nhd.datD[hP.value][0],void(hY.value=nhd.datD[hP.value][1]);nhd.datD[hP.value][0]=hX.value,nhd.datD[hP.value][1]=hY.value,nhd=fixNHD(nhd),point(0)},ntml=t=>{let e=rd1(htrack.value,hA.value,1)-1;hB.value=t.datB,h1mdl.value=t.datD[e][0][0],h1frq.value=t.datD[e][0][1],h2mdl.value=t.datD[e][1][0],h2frq.value=t.datD[e][1][1],h2top.value=t.datD[e][1][2],h2off.value=t.datD[e][1][3],hES0.value=t.datD[e][2][0][1],hED1.value=t.datD[e][2][1][0],hES1.value=t.datD[e][2][1][1],hED2.value=t.datD[e][2][2][0],hES2.value=t.datD[e][2][2][1],hED3.value=t.datD[e][2][3][0],hES3.value=t.datD[e][2][3][1],htrack.value=e+1},ntedt=t=>{nhd.datB=hB.value,nhd.datD[htrack.value-1]=[[h1mdl.value,h1frq.value],[h2mdl.value,h2frq.value,h2top.value,h2off.value],[[0,hES0.value],[hED1.value,hES1.value],[hED2.value,hES2.value],[hED3.value,hES3.value]]],nhd=fixNHD(nhd)},btn=0;window.addEventListener("mousedown",t=>{btn=t.buttons}),window.addEventListener("mouseup",t=>{btn=0,keyup()}),hD.onmousemove=(t=>{msMov(t)}),hD.onmousedown=(t=>{msMov(t)});let msMov=t=>{if(nhd.type>1)return;if(0==btn)return;let e=t.currentTarget.getBoundingClientRect(),a=Math.trunc((t.clientX-e.left)/(t.currentTarget.clientWidth/nhd.ln)),n=Math.trunc(nhd.qb-(t.clientY-e.top)/(t.currentTarget.clientHeight/nhd.qb));0==nhd.type?(n=n>=nhd.qb?nhd.qb-1:n,nhd.datD[a]=1==btn?n:nhd.datD[a]):1==nhd.type&&(nhd.datD[hP.value][0]=rd1(a,a,nhd.datD[hP.value-1][0]+1),nhd.datD[hP.value][1]=n,nhd=fixNHD(nhd),hX.value=nhd.datD[hP.value][0],hY.value=nhd.datD[hP.value][1]),pWave(nhd)},pWave=t=>{hD.getContext("2d").putImageData(wvImg(t,"#00F080",512,256),0,0)};window.addEventListener("dragover",t=>dragin(t)),window.addEventListener("drop",t=>dropin(t));const SVG="data:image/svg+xml;charset=utf8,"+encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="#141E32"><path d="M3 4v17h6v-12h6v12h6v-16a2 2 0 0 0 -2 -2h-14a2 2 0 0 0 -2 2M4.5 16.5h3v3h-3v-3M16.5 16.5h3v3h-3v-3"/><style>@media(prefers-color-scheme:dark){path{fill:#BBB;}}</style></svg>');fav.href=SVG,pType(iniNHD(0)),pWave(iniNHD(0));