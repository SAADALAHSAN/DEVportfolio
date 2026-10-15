(function(){
 var cv = document.getElementById('phPc');
 if(!cv) return;
 var ctx = cv.getContext('2d');
 var W = 0, H = 0, dpr = 1;
 
 // 3 Distinct Isolated Particle Groups:
 var pGroup1 = []; // Line 1: "FULL STACK" (Deep Dark Slate - 100% solid & locked)
 var pGroup2 = []; // Line 2: Kinetic words (Vibrant Brand Orange - high contrast)
 var pGroup3 = []; // Line 3: "& FOUNDER." (Deep Dark Slate - 100% solid & locked)

 var mouse = { x: -9999, y: -9999 }, fine = matchMedia('(pointer:fine)').matches;

 // High-contrast, crystal-clear color palette per line
 var colLine1 = ['#0F172A', '#14202B', '#0F172A']; // Ultra-crisp dark slate
 var colLine2 = ['#F0531C', '#FF4E11', '#F0531C']; // Vibrant Brand Orange
 var colLine3 = ['#0F172A', '#14202B', '#1E293B']; // Sharp dark charcoal
 var PSIZE = 2.45;

 var words = [
   "DEVELOPER",
   "ИНЖЕНЕР",
   "개발자",
   "ENGINEER",
   "工程师"
 ];
 var currentWordIndex = 0;
 // Open, geometric, high-clarity font stack (prevents letters from clogging)
 var fontStack = "'Outfit', 'Clash Display', 'Archivo', 'Anton', sans-serif";

 // Calibrated High-Density Poster Layout
 var layout = {
   line1Size: 120,
   line2Size: 96,
   line3Size: 82,
   y1: 0,
   y2: 0,
   y3: 0,
   tightGap: 18,
   sampleStep: 2.2
 };

 function size(){
   dpr = Math.min(window.devicePixelRatio || 1, 2);
   var r = cv.getBoundingClientRect();
   W = Math.max(1, r.width);
   H = Math.max(1, r.height);
   cv.width = W * dpr;
   cv.height = H * dpr;
   ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

   computeLayout();
 }

 function computeLayout(){
   var off = document.createElement('canvas');
   off.width = W; off.height = H;
   var o = off.getContext('2d');

   // 1. Calculate Bold Line 1 (Dominant) Font Size
   o.font = '900 100px ' + fontStack;
   var w1 = o.measureText('FULL STACK').width;
   var maxFsByW = (W * 0.90) / (w1 / 100);
   var maxFsByH = (H * 0.82) / 2.70;
   layout.line1Size = Math.floor(Math.min(maxFsByW, maxFsByH, 126));
   layout.line1Size = Math.max(layout.line1Size, 64);

   // 2. Proportional Line Sizes
   layout.line2Size = Math.floor(layout.line1Size * 0.80); // ~96px - 100px
   layout.line3Size = Math.floor(layout.line1Size * 0.68); // ~82px - 86px

   // 3. Balanced Tight Vertical Gap (16px - 20px)
   layout.tightGap = Math.max(14, Math.min(20, Math.round(layout.line1Size * 0.15)));
   
   var totalHeight = layout.line1Size + layout.line2Size + layout.line3Size + (layout.tightGap * 2);
   var startY = (H - totalHeight) / 2;

   layout.y1 = startY + (layout.line1Size / 2);
   layout.y2 = layout.y1 + (layout.line1Size / 2) + layout.tightGap + (layout.line2Size / 2);
   layout.y3 = layout.y2 + (layout.line2Size / 2) + layout.tightGap + (layout.line3Size / 2);

   // 4. Ultra High-Density Sampling (Step = 2.2 for ultra crisp resolution)
   layout.sampleStep = 2.2;
   PSIZE = 2.45;
 }

 // Dynamic Auto-Fit Font Size for Line 2
 function getLine2FontSize(text){
   var off = document.createElement('canvas');
   var o = off.getContext('2d');
   var dynamicFs = layout.line2Size;
   var maxAllowedW = W * 0.88;

   o.font = '900 ' + dynamicFs + 'px ' + fontStack;
   while (o.measureText(text).width > maxAllowedW && dynamicFs > 24) {
     dynamicFs -= 2;
     o.font = '900 ' + dynamicFs + 'px ' + fontStack;
   }
   return dynamicFs;
 }

 function extractLineTargets(text, fontSize, centerY, weight, minYBound, maxYBound){
   var off = document.createElement('canvas');
   off.width = W; off.height = H;
   var o = off.getContext('2d');
   o.fillStyle = '#000';
   o.textAlign = 'center';
   o.textBaseline = 'middle';
   o.font = (weight || '900') + ' ' + fontSize + 'px ' + fontStack;
   
   // Enable letter spacing for crisp separation
   try { o.letterSpacing = '1.5px'; } catch(e){}
   o.fillText(text, W / 2, centerY);

   var step = layout.sampleStep || 2.2;
   var data = o.getImageData(0, 0, W, H).data;
   var targets = [];

   var minY = Math.max(0, Math.floor(minYBound));
   var maxY = Math.min(H, Math.ceil(maxYBound));

   for(var y = minY; y < maxY; y += step){
     for(var x = 0; x < W; x += step){
       var px = Math.floor(x), py = Math.floor(y);
       if(data[(py * W + px) * 4 + 3] > 95){
         targets.push(px + (py << 16));
       }
     }
   }
   return targets;
 }

 function buildStaticLines(){
   // Line 1: "FULL STACK" (Solid Dark Slate)
   var targets1 = extractLineTargets(
     'FULL STACK',
     layout.line1Size,
     layout.y1,
     '900',
     0,
     layout.y2 - (layout.line2Size / 2) - 2
   );
   pGroup1 = [];
   for(var i = 0; i < targets1.length; i++){
     var tx1 = targets1[i] & 0xffff, ty1 = targets1[i] >> 16;
     pGroup1.push({
       x: Math.random() * W,
       y: Math.random() * H,
       tx: tx1,
       ty: ty1,
       vx: 0,
       vy: 0,
       c: colLine1[i % colLine1.length]
     });
   }

   // Line 3: "& FOUNDER." (Solid Dark Slate)
   var targets3 = extractLineTargets(
     '& FOUNDER.',
     layout.line3Size,
     layout.y3,
     '900',
     layout.y2 + (layout.line2Size / 2) + 2,
     H
   );
   pGroup3 = [];
   for(var j = 0; j < targets3.length; j++){
     var tx3 = targets3[j] & 0xffff, ty3 = targets3[j] >> 16;
     pGroup3.push({
       x: Math.random() * W,
       y: Math.random() * H,
       tx: tx3,
       ty: ty3,
       vx: 0,
       vy: 0,
       c: colLine3[j % colLine3.length]
     });
   }
 }

 function updateLine2(isMorph){
   var currentWord = words[currentWordIndex];
   var dynamicFs = getLine2FontSize(currentWord);

   // Extract targets for Line 2 (Vibrant Brand Orange)
   var targets2 = extractLineTargets(
     currentWord,
     dynamicFs,
     layout.y2,
     '900',
     layout.y1 + (layout.line1Size / 2) + 2,
     layout.y3 - (layout.line3Size / 2) - 2
   );
   var np2 = [];

   for(var k = 0; k < targets2.length; k++){
     var tx = targets2[k] & 0xffff, ty = targets2[k] >> 16;
     if(pGroup2[k]){
       var pt = pGroup2[k];
       pt.tx = tx;
       pt.ty = ty;
       pt.c = colLine2[k % colLine2.length];
       if(isMorph){
         pt.vx += (Math.random() - 0.5) * 1.4;
         pt.vy += (Math.random() - 0.5) * 1.4;
       }
       np2.push(pt);
     } else {
       var sx = isMorph ? (W / 2 + (Math.random() - 0.5) * 60) : (Math.random() * W);
       var sy = isMorph ? (layout.y2 + (Math.random() - 0.5) * 30) : (Math.random() * H);
       np2.push({
         x: sx,
         y: sy,
         tx: tx,
         ty: ty,
         vx: (Math.random() - 0.5) * 2,
         vy: (Math.random() - 0.5) * 2,
         c: colLine2[k % colLine2.length]
       });
     }
   }
   pGroup2 = np2;
 }

 function initAll(){
   size();
   buildStaticLines();
   updateLine2(false);
 }

 var rotationTimer = null;
 function startRotationLoop(){
   if(rotationTimer) clearInterval(rotationTimer);
   rotationTimer = setInterval(function(){
     if(document.hidden) return;
     currentWordIndex = (currentWordIndex + 1) % words.length;
     updateLine2(true);
   }, 3500);
 }

 function updateAndDrawGroup(group){
   var R = 92;
   for(var i = 0; i < group.length; i++){
     var p = group[i];
     var dxT = p.tx - p.x, dyT = p.ty - p.y;
     var ax = dxT * 0.042, ay = dyT * 0.042;
     
     if(fine){
       var dx = p.x - mouse.x, dy = p.y - mouse.y, d2 = dx * dx + dy * dy;
       if(d2 < R * R){
         var d = Math.sqrt(d2) || 1, f = (R - d) / R * 4.5;
         ax += dx / d * f;
         ay += dy / d * f;
       }
     }
     p.vx = (p.vx + ax) * 0.82;
     p.vy = (p.vy + ay) * 0.82;
     p.x += p.vx;
     p.y += p.vy;

     // Anti-jitter snap when at rest
     if(Math.abs(dxT) < 0.25 && Math.abs(dyT) < 0.25 && Math.abs(p.vx) < 0.1 && Math.abs(p.vy) < 0.1){
       p.x = p.tx;
       p.y = p.ty;
       p.vx = 0;
       p.vy = 0;
     }

     ctx.fillStyle = p.c;
     ctx.fillRect(p.x, p.y, PSIZE, PSIZE);
   }
 }

 function frame(){
   ctx.clearRect(0, 0, W, H);
   updateAndDrawGroup(pGroup1); // Line 1: Solid Dark Slate
   updateAndDrawGroup(pGroup2); // Line 2: Vibrant Electric Orange
   updateAndDrawGroup(pGroup3); // Line 3: Solid Dark Slate
   requestAnimationFrame(frame);
 }

 cv.addEventListener('pointermove', function(e){
   var r = cv.getBoundingClientRect();
   mouse.x = e.clientX - r.left;
   mouse.y = e.clientY - r.top;
 });
 cv.addEventListener('pointerleave', function(){
   mouse.x = -9999;
   mouse.y = -9999;
 });

 var rt;
 window.addEventListener('resize', function(){
   clearTimeout(rt);
   rt = setTimeout(function(){
     initAll();
   }, 200);
 });

 function start(){
   if(matchMedia('(max-width:680px)').matches) return;
   initAll();
   startRotationLoop();
   requestAnimationFrame(frame);
 }

 if(document.fonts && document.fonts.load){
   document.fonts.load('900 100px Outfit').then(function(){ return document.fonts.ready; }).then(start).catch(start);
 } else {
   start();
 }
})();
