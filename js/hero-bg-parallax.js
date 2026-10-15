
(function(){
 var hb=document.querySelector('.hero-bg'),art=document.querySelector('.hb-art'); if(!art||!hb) return;
 function lit(){art.classList.add('lit');}
 if(document.fonts&&document.fonts.ready){document.fonts.ready.then(function(){requestAnimationFrame(lit);});}
 setTimeout(lit,500);
 var hero=document.querySelector('.hero');
 var grid=document.querySelector('.hb-grid'),far=document.querySelector('.pl-far'),near=document.querySelector('.pl-near');
 var reduce=matchMedia('(prefers-reduced-motion:reduce)').matches,fine=matchMedia('(pointer:fine)').matches;
 if(!hero||!fine) return;
 var tcx=0,tcy=0,cx=0,cy=0,raf=null;
 function tick(){raf=null;cx+=(tcx-cx)*0.08;cy+=(tcy-cy)*0.08;if(!reduce){if(grid)grid.style.transform='translate('+(cx*-10)+'px,'+(cy*-10)+'px)';if(far)far.style.transform='translate('+(cx*-17)+'px,'+(cy*-17)+'px)';if(near)near.style.transform='translate('+(cx*-32)+'px,'+(cy*-32)+'px)';}if(Math.abs(tcx-cx)>0.0008||Math.abs(tcy-cy)>0.0008)raf=requestAnimationFrame(tick);}
 hero.addEventListener('pointermove',function(e){tcx=(e.clientX/innerWidth-0.5);tcy=(e.clientY/innerHeight-0.5);hb.style.setProperty('--mx',e.clientX+'px');hb.style.setProperty('--my',e.clientY+'px');hb.classList.add('cursoron');if(raf===null)raf=requestAnimationFrame(tick);});
 hero.addEventListener('pointerleave',function(){tcx=0;tcy=0;hb.classList.remove('cursoron');if(raf===null)raf=requestAnimationFrame(tick);});
})();
