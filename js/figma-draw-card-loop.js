/* figma-draw card loop */
(function(){
  var stage = document.querySelector(".c-photo .fd-stage");
  if(!stage) return;
  var art = stage.querySelector(".fd-art"),
      cur = stage.querySelector(".fd-curs"),
      flab = stage.querySelector(".fd-flab"),
      dim = stage.querySelector(".fd-dim"),
      rip = stage.querySelector(".fd-rip"),
      guide = stage.querySelector(".fd-guide"),
      gapb = stage.querySelector(".fd-gapb"),
      eb = stage.querySelector(".fd-eyeb"),
      lns = stage.querySelectorAll(".fd-ln"),
      ln1 = lns[0],
      ln2 = lns[1],
      cta = stage.querySelector(".fd-cta");

  function rel(el){
    var a = el.getBoundingClientRect(),
        c = stage.getBoundingClientRect();
    return {
      l: a.left - c.left,
      t: a.top - c.top,
      r: a.right - c.left,
      b: a.bottom - c.top,
      w: a.width,
      h: a.height
    };
  }

  var timers = [], token = 0;

  function clr(){
    if(eb) eb.classList.remove("in");
    if(ln1) ln1.classList.remove("in");
    if(ln2) ln2.classList.remove("in");
    if(cta) cta.classList.remove("in");
    if(guide) guide.style.opacity = "0";
    if(gapb) gapb.style.opacity = "0";
  }

  function after(ms, fn){
    var my = token;
    timers.push(setTimeout(function(){
      if(my === token) fn();
    }, ms));
  }

  function countTo(){
    var my = token, t0 = performance.now(), dur = 980;
    (function c(){
      if(my !== token) return;
      var pp = Math.min(1, (performance.now() - t0) / dur);
      var e = 1 - Math.pow(1 - pp, 3);
      if(dim) dim.innerHTML = Math.round(40 + e * 320) + " \u00d7 " + Math.round(30 + e * 210);
      if(pp < 1) requestAnimationFrame(c);
    })();
  }

  function statc(){
    art.style.width = "84%";
    art.style.height = "72%";
    if(eb) eb.classList.add("in");
    if(ln1) ln1.classList.add("in");
    if(ln2) ln2.classList.add("in");
    if(cta) cta.classList.add("in");
    if(flab) flab.style.opacity = "1";
    art.classList.add("sel");
    if(cur) cur.style.opacity = "0";
    if(dim) {
      dim.style.opacity = "1";
      dim.style.left = "auto";
      dim.style.right = "8%";
      dim.style.top = "calc(12% + 72% + 6px)";
      dim.innerHTML = "360 \u00d7 240";
    }
  }

  function run(){
    token++;
    timers.forEach(clearTimeout);
    timers = [];
    art.classList.remove("sel");
    art.style.width = "0";
    art.style.height = "0";
    clr();
    if(flab) flab.style.opacity = "0";
    if(dim) {
      dim.style.opacity = "0";
      dim.style.left = "auto";
      dim.style.right = "8%";
      dim.style.top = "calc(12% + 72% + 6px)";
      dim.innerHTML = "40 \u00d7 30";
    }
    if(cur) {
      cur.style.opacity = "1";
      cur.style.left = "11%";
      cur.style.top = "16%";
      cur.classList.remove("press");
      cur.classList.remove("nm-left");
    }

    after(420, function(){
      if(cur) {
        cur.style.left = "8%";
        cur.style.top = "12%";
        cur.classList.add("press");
      }
    });

    after(650, function(){
      if(cur) {
        cur.classList.remove("press");
        cur.style.left = "calc(8% + 84%)";
        cur.style.top = "calc(12% + 72%)";
        cur.classList.add("nm-left");
      }
      art.style.width = "84%";
      art.style.height = "72%";
      after(300, function(){
        if(dim) {
          dim.style.opacity = "1";
          dim.style.left = "auto";
          dim.style.right = "8%";
          dim.style.top = "calc(12% + 72% + 6px)";
          countTo();
        }
      });
    });

    after(1700, function(){
      if(flab) flab.style.opacity = "1";
    });

    after(1950, function(){
      if(eb) eb.classList.add("in");
    });

    after(2200, function(){
      if(ln1) ln1.classList.add("in");
    });

    after(2380, function(){
      if(ln2) ln2.classList.add("in");
    });

    after(2750, function(){
      if(cta) cta.classList.add("in");
    });

    after(2950, function(){
      var hl = rel(ln2), bt = rel(cta);
      if(guide) {
        guide.style.left = bt.l + "px";
        guide.style.top = (hl.t - 6) + "px";
        guide.style.height = (bt.b - hl.t + 12) + "px";
        guide.style.opacity = "1";
      }
      if(gapb) {
        gapb.style.left = (bt.l + 22) + "px";
        gapb.style.top = ((hl.b + bt.t) / 2) + "px";
        gapb.style.opacity = "1";
      }
      if(cur) {
        cur.classList.remove("nm-left");
        cur.style.left = (bt.l + 14) + "px";
        cur.style.top = (bt.t + 10) + "px";
      }
    });

    after(3350, function(){
      if(cur) cur.classList.add("press");
      var bt = rel(cta);
      if(rip) {
        rip.style.left = (bt.l + 14) + "px";
        rip.style.top = (bt.t + 10) + "px";
        rip.classList.remove("go");
        void rip.offsetWidth;
        rip.classList.add("go");
      }
    });

    after(3550, function(){
      if(cur) cur.classList.remove("press");
      if(guide) guide.style.opacity = "0";
      if(gapb) gapb.style.opacity = "0";
    });

    after(3850, function(){
      art.classList.add("sel");
      if(dim) {
        dim.style.left = "auto";
        dim.style.right = "8%";
        dim.style.top = "calc(12% + 72% + 6px)";
      }
      if(cur) {
        cur.style.left = "calc(8% + 40%)";
        cur.style.top = "calc(12% + 34%)";
      }
    });

    after(6000, function(){
      clr();
      art.classList.remove("sel");
      if(flab) flab.style.opacity = "0";
      if(dim) dim.style.opacity = "0";
    });

    after(6500, function(){
      art.style.width = "0";
      art.style.height = "0";
    });

    after(7300, run);
  }

  if(window.matchMedia && matchMedia("(prefers-reduced-motion:reduce)").matches){
    statc();
    return;
  }

  var started = false;
  if("IntersectionObserver" in window){
    var io = new IntersectionObserver(function(es){
      es.forEach(function(en){
        if(en.isIntersecting && !started){
          started = true;
          run();
          io.disconnect();
        }
      });
    }, {threshold: .25});
    io.observe(stage);
  } else {
    run();
  }
})();
