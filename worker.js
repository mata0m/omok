let M=null,curId=0;
self.onmessage=function(e){
  const d=e.data;
  if(d.t==='init'){
    try{
      importScripts('rapfi-single-simd128.js');
      Rapfi({
        locateFile:function(f){return f.endsWith('.data')?'rapfi-data.wasm':f;},
        onReceiveStdout:function(l){postMessage({t:'out',l:l,id:curId});},
        onReceiveStderr:function(l){postMessage({t:'err',l:l});}
      }).then(function(m){
        M=m;
        M.sendCommand('START 15');
        M.sendCommand('INFO rule 4');
        postMessage({t:'ready'});
      }).catch(function(err){postMessage({t:'fail',e:String(err&&err.message||err)});});
    }catch(err){postMessage({t:'fail',e:String(err&&err.message||err)});}
  }else if(d.t==='think'){
    if(!M){postMessage({t:'fail',e:'not ready'});return;}
    curId=d.id;M.sendCommand('INFO timeout_turn '+d.ms);
    M.sendCommand('INFO timeout_match 100000000');
    if(d.nb){M.sendCommand('YXBOARD\n'+d.stones+'\nDONE');M.sendCommand('YXNBEST '+d.nb);}else{M.sendCommand('BOARD\n'+d.stones+'\nDONE');}
    postMessage({t:'done',id:d.id});
  }
};
