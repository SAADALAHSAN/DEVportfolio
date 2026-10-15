
(function(){var w=document.getElementById('waFloat');if(!w)return;var closed=false;
 w.querySelector('.wa-x').addEventListener('click',function(e){e.preventDefault();closed=true;w.classList.remove('show');w.style.display='none';});
 function s(){if(closed)return;var d=document.documentElement;var p=d.scrollTop/((d.scrollHeight-d.clientHeight)||1);w.classList.toggle('show',p>0.25);}
 addEventListener('scroll',s,{passive:true});s();})();
/* df-h2 hover unified with site letter-hover engine */
