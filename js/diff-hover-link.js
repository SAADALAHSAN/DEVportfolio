
/* the-difference: hover-link each problem to its fix */
(function(){
  var them=[].slice.call(document.querySelectorAll('.diff-them .diff-list li'));
  var us=[].slice.call(document.querySelectorAll('.diff-us .diff-list li'));
  if(!them.length||!us.length)return;
  function link(i,on){if(them[i])them[i].classList.toggle('struck',on);if(us[i])us[i].classList.toggle('hot',on);}
  function wire(arr){arr.forEach(function(li,i){li.style.pointerEvents='auto';li.addEventListener('mouseenter',function(){link(i,true);});li.addEventListener('mouseleave',function(){link(i,false);});});}
  wire(them);wire(us);
})();
