(function(){
  function pad(n){return(n<10?"0":"")+n;}
  function bstHM(){
    try {
      var options = { timeZone: 'Asia/Dhaka', hour: '2-digit', minute: '2-digit', hour12: false };
      var parts = new Intl.DateTimeFormat('en-GB', options).formatToParts(new Date());
      var h = parts.find(function(p){ return p.type === 'hour'; }).value;
      var m = parts.find(function(p){ return p.type === 'minute'; }).value;
      return h + ":" + m;
    } catch(e) {
      var m = Date.now() + 21600000;
      return pad(Math.floor(m / 3600000) % 24) + ":" + pad(Math.floor(m / 60000) % 60);
    }
  }
  function bstHour(){
    try {
      var options = { timeZone: 'Asia/Dhaka', hour: 'numeric', hour12: false };
      var hStr = new Intl.DateTimeFormat('en-US', options).format(new Date());
      var h = parseInt(hStr, 10);
      return isNaN(h) ? 0 : (h % 24);
    } catch(e) {
      return Math.floor((Date.now() + 21600000) / 3600000) % 24;
    }
  }
  function ray(list){return list.map(function(a){var r=a*Math.PI/180;return "<line x1=\""+(60+37*Math.cos(r)).toFixed(1)+"\" y1=\""+(60+37*Math.sin(r)).toFixed(1)+"\" x2=\""+(60+50*Math.cos(r)).toFixed(1)+"\" y2=\""+(60+50*Math.sin(r)).toFixed(1)+"\"/>";}).join("");}
  var SUN='<svg viewBox="0 0 120 120" width="112" height="112" class="float"><circle cx="60" cy="60" r="25" fill="#F0531C"/><g stroke="#F0531C" stroke-width="5" stroke-linecap="round">'+ray([0,45,90,135,180,225,270,315])+'</g></svg>';
  var MOON='<svg viewBox="0 0 120 120" width="108" height="108" class="float"><path d="M82 60a32 32 0 1 1-32-32 26 26 0 0 0 32 32z" fill="#14202B"/><circle cx="92" cy="34" r="2.6" fill="#14202B"/><circle cx="80" cy="20" r="1.8" fill="#14202B"/><circle cx="100" cy="52" r="1.8" fill="#14202B"/></svg>';
  function horizon(rays,sunY){return '<svg viewBox="0 0 140 110" width="150" height="112"><g stroke="#F0531C" stroke-width="4" stroke-linecap="round">'+rays.map(function(a){var r=a*Math.PI/180;return "<line x1=\""+(70+30*Math.cos(r)).toFixed(1)+"\" y1=\""+(sunY+30*Math.sin(r)).toFixed(1)+"\" x2=\""+(70+42*Math.cos(r)).toFixed(1)+"\" y2=\""+(sunY+42*Math.sin(r)).toFixed(1)+"\"/>";}).join("")+'</g><circle cx="70" cy="'+sunY+'" r="23" fill="#F0531C"/><rect x="6" y="'+(sunY+2)+'" width="128" height="34" fill="#A6D6F3"/><line x1="8" y1="'+(sunY+2)+'" x2="132" y2="'+(sunY+2)+'" stroke="#14202B" stroke-width="3" stroke-linecap="round"/></svg>';}
  var DAWN=horizon([200,225,250,290,315,340],84);
  var DUSK=horizon([200,235,270,305,340],78);
  var ST={
    dawn:{hl:'First coffee,<br>then <span class="o">you.</span>',tape:"sunrise in bangladesh",glyph:DAWN,sub:"It\u2019s {t} at my desk. I\u2019m booting up, and your idea is first in line.",cta:"Talk with me"},
    day:{hl:'So am <span class="o">I.</span>',tape:"the sun\u2019s up in bangladesh",glyph:SUN,sub:"It\u2019s {t} at my desk. Perfect light for building, so send it over.",cta:"Talk with me"},
    dusk:{hl:'Still <span class="o">building.</span>',tape:"golden hour in bangladesh",glyph:DUSK,sub:"It\u2019s {t} at my desk. The best ideas always seem to land about now.",cta:"Talk with me"},
    night:{hl:'Ideas don\u2019t <span class="o">sleep.</span>',tape:"it\u2019s late in bangladesh",glyph:MOON,sub:"It\u2019s {t} at my desk. Leave your idea, I\u2019ll grab it at dawn.",cta:"Leave your idea"}
  };
  function stateFor(h){if(h>=5&&h<8)return"dawn";if(h>=8&&h<17)return"day";if(h>=17&&h<20)return"dusk";return"night";}
  var head=document.getElementById("dnHead"),tape=document.getElementById("dnTape"),glyph=document.getElementById("dnGlyph"),sub=document.getElementById("dnSub"),cta=document.getElementById("dnCta"),cur=null;
  if(!head)return;
  function apply(){
    var k=stateFor(bstHour()),v=ST[k];
    if(k!==cur){
      cur=k;head.innerHTML=v.hl;
      if(window.__omReheadline)window.__omReheadline(head);
      tape.textContent=v.tape;
      glyph.innerHTML=v.glyph;
      cta.textContent=v.cta;
    }
    sub.innerHTML=v.sub.replace("{t}","<b>"+bstHM()+"</b>");
  }
  apply();
  setInterval(apply,1000);

  // Floating Idea Sticky Note Modal Controls
  var modal = document.getElementById("ideaModal"),
      closeBtn = document.getElementById("closeIdeaModal"),
      form = document.getElementById("ideaMemoForm"),
      success = document.getElementById("ideaSuccess"),
      modalTime = document.getElementById("ideaModalTime");

  function openIdeaModal(e){
    if(e) e.preventDefault();
    if(!modal) return;
    if(modalTime) modalTime.textContent = "🌙 MIDNIGHT IDEA DROP // " + bstHM() + " DHAKA";
    if(form) form.style.display = "flex";
    if(success) success.style.display = "none";
    modal.style.display = "flex";
  }

  function closeIdeaModal(){
    if(modal) modal.style.display = "none";
  }

  if(cta) {
    cta.addEventListener("click", function(e){
      openIdeaModal(e);
    });
  }

  if(closeBtn) closeBtn.addEventListener("click", closeIdeaModal);
  if(modal) {
    modal.addEventListener("click", function(e){
      if(e.target === modal) closeIdeaModal();
    });
  }

  if(form) {
    form.addEventListener("submit", function(e){
      e.preventDefault();
      form.style.display = "none";
      if(success) success.style.display = "block";
      setTimeout(closeIdeaModal, 3200);
    });
  }
})();
