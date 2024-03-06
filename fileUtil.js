/*
ファイル用処理
HTML側にreceive(dv)を作っておく
*/
function s2h(s){//文字列→Hex
    var rtn='';
    s.split('').forEach(c=>{rtn+=('00'+c.charCodeAt().toString(16)).slice(-2);});
    return rtn;
}
function n2h(n,bytes){//数値→LHex
    n=parseInt(n);
    var rtn=bytes>0?('0'.repeat(bytes*2)+n.toString(16)).slice(bytes*-2):'0'.repeat(n.toString(16).length%2)+n.toString(16);
    return rtn.match(/.{2}/g).reverse().join('');
}
function n2sh(n,bytes){//数値→LHex(符号付)
    var max=Math.pow(2,(bytes*8-1));
    n=n<0?max*2+n:n>max-1?max-1:n;
    return n2h(n,bytes);
}
function s2bf(s){//Hex→buffer
    var bf=new ArrayBuffer(Math.floor(s.length/2));
    var vw=new DataView(bf);
    s.match(/.{2}/g).forEach((t,i)=>{vw.setUint8(i,parseInt(t,16));});
    return bf;
}
function bf2s(dv,off,l){//buffer→Hex
    var rtn="";
    for(let i=0;i<l;i++){
        rtn+=("0"+dv.getUint8(off+i).toString(16)).slice(-2);
    }
    return rtn;
}
function filein(ext){//ファイル読込
    var p=document.createElement('input');
    p.type='file';p.accept='.'+ext;
    p.click();
    p.addEventListener('change',()=>{
        var reader=new FileReader();
        reader.onload=()=>{
            var dv=new DataView(reader.result);
            receive(dv);
        }
        reader.readAsArrayBuffer(p.files[0]);
    });
}
function fileout(file,data){//ファイル保存
    var a=document.createElement('a');
    a.download=file;
    a.href=data;
    a.click();
}
function dropin(ev){//ドロップ処理
    ev.preventDefault();
    var [file]=ev.dataTransfer.files;
    var reader=new FileReader();
    reader.onload=()=>{
        var dv=new DataView(reader.result);
        receive(dv);
    }
    reader.readAsArrayBuffer(file);
}
function dragin(ev){//ドラッグ処理
    ev.preventDefault();
}