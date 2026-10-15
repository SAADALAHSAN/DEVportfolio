
/* services horizontal scroll (isolated + robust) */
(function(){
  var sec = document.querySelector('.sv-story');
  if(sec){
    var track = sec.querySelector('.sv-track');
    var ticking = false;

    function update(){
      var rect = sec.getBoundingClientRect();
      var travel = sec.offsetHeight - window.innerHeight;
      var pr = travel > 0 ? Math.max(0, Math.min(1, -rect.top / travel)) : 0;
      var max = track.scrollWidth - window.innerWidth;
      if (max > 0) {
        track.style.transform = 'translate3d(' + (-pr * max).toFixed(2) + 'px, 0, 0)';
      }
      ticking = false;
    }

    function onScroll(){
      if (!ticking) {
        requestAnimationFrame(update);
        ticking = true;
      }
    }

    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll, { passive: true });
    update();
  }

  document.querySelectorAll('.sv-toggle').forEach(function(t){
    t.addEventListener('click', function(){
      var d = t.closest('.sv-drop');
      if(d) d.classList.toggle('sv-open');
    });
  });
})();
