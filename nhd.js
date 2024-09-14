const fIn=(t,e)=>{let h=document.createElement("input"),i,n;h.type="file",h.accept="."+t,h.click(),h.addEventListener("change",t=>{(i=new FileReader).onload=t=>{n=new DataView(i.result),getDV(n,e)},i.readAsArrayBuffer(h.files[0])})},fOut=(t,e)=>{var h=document.createElement("a");h.download=t,h.href=e,h.click()},drop=t=>{t.preventDefault();let[e]=t.dataTransfer.files,h=new FileReader,i;h.onload=t=>{i=new DataView(h.result),getDV(i)},h.readAsArrayBuffer(e)},drag=t=>{t.preventDefault()},int=(t,e=t,h=t)=>Math.round(e<t?e:t<h?h:t),s2a=(t,e=1)=>t.match(new RegExp(`.{${e}}`,"g")),sar=(t,i)=>t.flatMap((t,e,h)=>e%i?[]:[h.slice(e,e+i)]),rpAll=(t,e,h)=>t.replace(new RegExp(e,"g"),h),rnd=t=>Math.floor(Math.random()*t),pad=(t,e=2,h=16)=>t.toString(h).padStart(e,"0"),n2h=(t,e)=>{t=pad(Math.trunc(t<0?t+16**e:t),e);return 1<e?t.match(/.{2}/g).reverse().join(""):t},s2h=t=>t.split("").map(t=>pad(t.charCodeAt())).join(""),h2bf=t=>{var e=new ArrayBuffer(Math.trunc(t.length/2));let h=new DataView(e);return t.match(/.{2}/g).forEach((t,e)=>h.setUint8(e,parseInt(t,16))),e},bf2h=(t,e,h)=>{let i="",n;for(n=0;n<h;n++)i+=pad(t.getUint8(e+n));return i},gcd=(t,e)=>e?gcd(e,t%e):t,pak=(t,e)=>{let h="",i=[],n=t.concat().flat(1/0);return n.forEach(t=>h+=pad(t,e,2)),h.length%4&&(h+=pad(0,h.length%4)),s2a(h,4).forEach(t=>i.push(parseInt(t,2).toString(16))),i.join("")+(i.length%2?"0":"")},unpak=(t,e)=>{let h=[],i="";return s2a(t).forEach(t=>i+=pad(parseInt(t,16),4,2)),s2a(i,e).forEach(t=>h.push(parseInt(t,2))),h};class Nhd{constructor(){this.name="SampleWave",this.type=0,this.datA=0,this.datB=0,this.datC=0,this.datD=0,this.ln=0,this.qb=0,this.tmp,this.edt,this.ini(0)}ini(t){this.type=t,(this.datC=0)==t?(this.datD=[11,15,14,14,15,14,10,7,9,13,15,9,3,1,1,5,10,13,14,12,6,0,2,6,8,5,2,0,1,1,0,3],this.datA=0,this.datB=5,this.datC=4,this.ln=32,this.qb=16):1==t?(this.datA=8,this.datB=2,this.datD=[[63,255],[191,0]],this.ln=256,this.qb=256):2==t?(this.datA=1,this.datB=2,this.datD=[...Array(2)].map((t,e)=>e-1)):(this.datA=0,this.datB=4,this.ln=32767,this.datD=npr(4))}set(h){if(2439932004!=h.getUint32(0))alert("not NHD"),this.ini(0);else{let t=h.getUint8(4),e;for(this.name="",e=5;e<t+5;e++)this.name+=String.fromCharCode(h.getUint8(e));this.type=~~(h.getUint8(t+5)/16),this.datA=~~(h.getUint8(t+5)%16),this.ver(),0==this.type?(this.datB=1+~~(h.getUint8(t+6)/16),this.ln=2**this.datB,this.datC=1+~~(h.getUint8(t+6)%16),this.qb=2**this.datC,this.datD=unpak(bf2h(h,t+7,h.byteLength-t-7),this.datC),this.datD.length=this.ln):1==this.type?(this.ln=2**this.datA,this.qb=this.ln,this.datB=h.getUint8(t+6),this.datD=unpak(bf2h(h,t+7,h.byteLength-t-7),this.datA),this.datD=sar(this.datD,2),this.datD.length=this.datB):this.datB=h.getUint8(t+6)+1,this.fix()}}fix(){if(this.name=this.name.replace(/[^ -~]/g,"").substring(0,256),this.type=int(this.type,15,0),0==this.type){this.datA=int(this.datA,7,0),this.datB=int(this.datB,8,2),this.ln=2**this.datB;let h=this.datD.length/this.ln;if(1!=h){let t=Array(this.ln),e;for(e=0;e<this.ln;e++)t[e]=1<h?this.datD[e*h]:this.datD[~~(e*h)];this.datD=Array().concat(t)}this.datC=int(this.datC,8,2),1!=(h=2**this.datC/this.qb)&&this.datD.forEach((t,e)=>this.datD[e]=~~((t+1)*h-1)),this.qb=2**this.datC}else if(1==this.type){this.datA=int(this.datA,8,2),this.datB=int(this.datB,256,1),this.ln=2**this.datA;let h=this.ln/this.qb,e=(1!=h&&this.datD.forEach((t,e)=>this.datD[e]=[~~(t[0]*h),~~(t[1]*h)]),this.qb=this.ln,this.datD.length);this.datB>e&&(this.datD=this.datD.concat([...Array(this.datB-e)].map(t=>this.datD[e-1].concat()))),this.datD.length=this.datB,this.datD.forEach((t,e)=>{this.datD[e][0]=int(t[0],e+1>=this.datB?this.ln-1:this.datD[e+1][0],e<1?0:this.datD[e-1][0]),this.datD[e][1]=int(t[1],this.ln-1,0)})}else{var t,e;2==this.type?(this.datA=int(this.datA,15,0),this.datB=int(this.datB,256,this.datA+1),this.ln=this.datB):(this.datB=int(this.datB,256,0==this.datA?2:1),t=this.datA,e=this.datB,this.datD=3==t?nvc():(1==t?ngb:2==t?nfc:npr)(e),this.ln=this.datD.length,this.qb=3==t?128:0<t?2:e)}}sft(e){2&e&&1&e?this.datD.unshift(this.datD.pop()):2&e?this.datD.push(this.datD.shift()):this.datD=this.datD.map(t=>int(t+(1&e?-1:1),this.qb-1,0))}img(t,n,a){let e=document.createElement("canvas"),s;if(e.width=n,e.height=a,(s=e.getContext("2d")).clearRect(0,0,n,a),s.imageSmoothingEnabled=!1,s.strokeStyle=t,s.lineWidth=2,s.beginPath(),0==this.type){let e=n/this.ln,h=a/this.qb,i=0;this.datD.forEach(t=>{s.lineTo(i,(this.qb-.5-t)*h),i+=e,s.lineTo(i,(this.qb-.5-t)*h)})}else if(1==this.type){s.moveTo(0,a/2);let e=this.ln-1,h=this.ln;this.datD.forEach(t=>s.lineTo(t[0]*n/h,(e-t[1])*a/e)),s.lineTo(n,a/2),this.edt&&s.rect(this.datD[this.edt-1][0]*n/h-3,a-this.datD[this.edt-1][1]*a/e-3,6,6)}else if(2==this.type){t=n*this.datA/this.datB;s.lineTo(0,a/8),s.lineTo(t,a/8),s.lineTo(t,7*a/8),s.lineTo(n,7*a/8)}else for(let t=0;t<256;t++)s.lineTo(t*n/256,(this.qb-.5-this.datD[~~t%this.datD.length])*a/this.qb);return s.stroke(),s.getImageData(0,0,n,a)}blb(){this.fix();let t="916E6864"+n2h([...this.name].length,2)+s2h(this.name)+n2h(this.type,1)+n2h(this.datA,1);return 0==this.type?t+=n2h(this.datB-1,1)+n2h(this.datC-1,1)+pak(this.datD,this.datC):t+=n2h(this.datB,2),1==this.type&&(t+=pak(this.datD,this.datA)),window.URL.createObjectURL(new Blob([h2bf(t)]))}wav(t,e,h,i,n,a,s){this.fix(),a-=256<this.ln?128:0,this.tmp=1==this.type?coord([[0,(this.ln-1)/2]].concat(this.datD,[[this.ln,(this.ln-1)/2]])):0;let d,l=[],r="",o=k2f(a),u=~~(e/8),p=h*n,c=o*this.ln/h,f=h/o;for(1==s?p=f*~~(p/f):2==s?p=f:3==s&&(c=1,p=this.ln,t=0),d=0;d<p;d++)t<1?l.push(~~i*this.clc(d*c)):(l.push(1&t?~~i*this.clc(d*c):0),l.push(2&t?~~i*this.clc(d*c):0));t=t<1?1:2,p*=u,l.forEach(t=>r+=1<u?n2h(t*16**u,2*u):n2h(t+128,2*u));a="52494646"+n2h(p+36,8)+"57415645666D7420"+n2h(16,8)+n2h(1,4)+n2h(t,4)+n2h(h,8)+n2h(h*t*u,8)+n2h(t*u,4)+n2h(e,4)+"64617461"+n2h(p*t,8),n=new Blob([h2bf(a+r)]);return window.URL.createObjectURL(n)}clc(t){var e,h,i;return 0==this.type?(1==this.datA?lerp(t,this.datD):this.datD[~~(t%this.ln)])/(this.qb-1)-.5:1==this.type?lerp(t,this.tmp)/(this.ln-1)-.5:2==this.type?0==this.datA?(e=2*this.ln,this.tmp+=1/e,this.tmp%=2*e,h=this.tmp%e,i=this.tmp>e?1:-1,(2*t%e<h?i:-i)/2):(t%this.ln<this.datA?1:-1)/2:this.datD[~~(t%this.ln)]/(this.qb-1)-.5}ver(){1==this.type&&this.datA<2&&(this.datA=8)}}const k2f=t=>440*2**((t-69)/12),knm=t=>s2a("C C#D D#E F F#G G#A A#B ",2)[t%12]+~~(t/12),nfc=t=>{let e=[],h=rnd(16384),i;for(i=0;i<(t%2?93:32767);i++)h=(h>>=1)|(1&(h^h>>(t%2?6:1)))<<15,out=1&h,e.push(out);return e},ngb=t=>{let e=65535,h=1,i=[],n;for(n=0;n<(t%2?127:32767);n++)e=0==(e%=65536)?1:e,e+=e+(1&(e>>(t%2?6:14)^e>>(t%2?5:13))),h^=1&e,i.push(h);return i},nvc=t=>{let e=0;for(a=[],i,i=0;i<256;i++)e=Math.imul(e,214013)+2531011>>>0,out=e>>16&32767,a.push(~~(out<<24>>24)/2);return a},npr=e=>[...Array(32767)].map(t=>rnd(e)),nhd=(coord=h=>{let i=[],n,a;for(n=0;n<h.length-1;n++){let t=h[n][1],e=(h[n+1][1]-h[n][1])/(h[n+1][0]-h[n][0]);for(a=h[n][0];a<h[n+1][0];a++)i.push(t),t+=e}return i},lerp=(t,e)=>{var h=e[~~(t%e.length)];return h+t%1*(e[~~((t+1)%e.length)]-h)},new Nhd),lay=new Nhd,kbd=document.createElement("audio"),keybd=t=>{let e,h,i='<table style="border-collapse:collapse;cursor:pointer;table-layout:fixed;width:100%;"><tr>';for(h=0;h<6;h++)for(e=0;e<12;e++)i+=`<td style='border:solid 1.5px var(--c7);height:1.2em;background:var(--c${[1,3,6,8,10].includes(e)?6:0})'onmousedown='view(this)'></td>`;roll.innerHTML=i+"</tr></table>"},keyup=t=>{kbd.pause(),keybd()},view=t=>{var e=t.cellIndex+24;t.style.background="#9c9e9b",kbd.src=nhd.wav(0,8,44100,40,1,e,0),kbd.play()},pre=t=>{kbd.src=nhd.wav(hch.value,hbit.value,hrate.value,hvol.value,hsec.value,hkey.value,htail.value),kbd.play()},getDV=(t,e)=>{e?(lay.set(t),hlay.getContext("2d").putImageData(lay.img("#878988",512,256),0,0)):(nhd.set(t),fABC()),toHTML()},sel=t=>{let e="";return t.forEach(t=>e+=`<option value="${t[1]}">${t[0]}</option>`),e},toJS=t=>{nhd.name=hname.value,nhd.type=htype.value,nhd.datA=hA.value,nhd.datB=hB.value,nhd.datC=hC.value,toHTML()},toHTML=t=>{nhd.fix(),hname.value=nhd.name,htype.value=nhd.type,hA.value=nhd.datA,hB.value=nhd.datB,hC.value=nhd.datC,point(),pwv(),knam.innerText=knm(hkey.value)},pwv=t=>hD.getContext("2d").putImageData(nhd.img("#00F080",512,256),0,0),sft=t=>{nhd.sft(t),toHTML()},point=t=>{1==nhd.type&&(t?(nhd.datD[hP.value-1][0]=hX.value,nhd.datD[hP.value-1][1]=hY.value,nhd.fix(),point(0)):(hP.value=int(hP.value,nhd.datB,1),hX.value=nhd.datD[hP.value-1][0],hY.value=nhd.datD[hP.value-1][1],nhd.edt=hP.value))},fABC=t=>{var e=nhd.type;Ain.innerHTML='<input type="number"id="hA">',Ctx.innerHTML="-",0==e?(Atx.innerHTML="補間",Ain.innerHTML=`<select id="hA">${sel([["None",0],["Lerp",1]])}</select>`,Btx.innerHTML="よこ",Ctx.innerHTML="たて",Add.innerHTML="<input type='button'onclick='sft(2)'value='<'> <input type='button'onclick='sft(0)'value='▲'> <input type='button'onclick='sft(1)'value='▼'> <input type='button'onclick='sft(3)'value='>'>"):1==e?(Atx.innerHTML="ビット",Btx.innerHTML="座標数",Add.innerHTML=`うごかす点 <input type='number'id='hP'value='1'onchange='point(0)'>　X<input type='number'id='hX'onchange='point(1)'value='${nhd.datD[0][0]}'> Y<input type='number'id='hY'onchange='point(1)'value='${nhd.datD[0][1]}'>`):2==e?(Atx.innerHTML="H",Btx.innerHTML="T",Add.innerHTML="Duty比 H/T　H0で変な音(T>35がオススメ)"):(Atx.innerHTML="タイプ",Ain.innerHTML=`<select id="hA">${sel([["Rnd",0],["GB",1],["FC",2]])}</select>`,Btx.innerHTML="ぱらめ",Add.innerHTML="ぱらめをいじると音が変わったりする"),toHTML()},msMov=i=>{if(!(1<nhd.type)&&btn){let t=i.currentTarget.getBoundingClientRect(),e=Math.trunc((i.clientX-t.left)/(i.currentTarget.clientWidth/nhd.ln)),h=Math.trunc(nhd.qb-(i.clientY-t.top)/(i.currentTarget.clientHeight/nhd.qb));0==nhd.type?(h=h>=nhd.qb?nhd.qb-1:h,nhd.datD[e]=1==btn?h:nhd.datD[e]):1==nhd.type&&(i=hP.value-1,nhd.datD[i][0]=int(e,e,0<i?nhd.datD[i-1][0]:0),nhd.datD[i][1]=h,nhd.fix(),hX.value=nhd.datD[i][0],hY.value=nhd.datD[i][1],nhd.edt=1+i),pwv()}};htype.innerHTML=sel([["Table",0],["Coord",1],["Pulse",2],["Noise",15]]),hrate.innerHTML=sel([["8000",8e3],["11025",11025],["22050",22050],["32000",32e3],["44100",44100],["48000",48e3]]),hch.innerHTML=sel([["Mono",0],["Stereo",3],["L",1],["R",2]]),hbit.innerHTML=sel([["8 bit",8],["16 bit",16]]),htail.innerHTML=sel([["秒数ピッタリ",0],["周期ピッタリ",1],["1周期だけ",2],["必要最低限",3]]),hrate.value=44100,keybd(),fABC();let btn=0;window.addEventListener("mousedown",t=>{btn=t.buttons}),window.addEventListener("mouseup",t=>{btn=0,keyup()}),hD.onmouseenter=t=>{0<btn&&(btn=0)},hD.onmousemove=t=>msMov(t),hD.onmousedown=t=>msMov(t);