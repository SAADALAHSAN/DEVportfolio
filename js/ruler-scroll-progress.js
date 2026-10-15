
(function(){var fill=document.getElementById('rFill'),pct=document.getElementById('rPct');if(!fill||!pct)return;var ticks=fill.parentNode,ticking=false;
function upd(){ticking=false;var max=(document.documentElement.scrollHeight||document.body.scrollHeight)-window.innerHeight;var p=max>0?Math.min(1,Math.max(0,(window.scrollY||window.pageYOffset)/max)):0;fill.style.width=(p*100).toFixed(2)+'%';var done=p>=0.998;fill.classList.toggle('done',done);pct.classList.toggle('done',done);pct.textContent=done?'SHIPPED':(Math.round(p*100)+'%');var tw=ticks.clientWidth,pw=pct.offsetWidth,head=p*tw;var left=Math.min(Math.max(head-pw-4,4),Math.max(4,tw-pw-4));pct.style.left=left+'px';}
function onScroll(){if(!ticking){ticking=true;requestAnimationFrame(upd);}}
addEventListener('scroll',onScroll,{passive:true});addEventListener('resize',onScroll);addEventListener('load',upd);upd();})();
