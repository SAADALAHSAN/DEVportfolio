(function(){
  var form = document.getElementById('chatThreadForm');
  var input = document.getElementById('chatThreadInput');
  var body = document.getElementById('chatThreadBody');
  var typing = document.getElementById('dynamicTyping');

  if(!form || !input || !body || !typing) return;

  function getTimeString(){
    var d = new Date();
    var h = d.getHours();
    var m = d.getMinutes().toString().padStart(2, '0');
    var ampm = h >= 12 ? 'PM' : 'AM';
    h = h % 12 || 12;
    return h + ':' + m + ' ' + ampm;
  }

  function escapeHtml(text){
    var div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  }

  function getAutoReply(userText){
    var q = userText.toLowerCase().trim();

    // Rates / Pricing / Cost
    if(q.includes('rate') || q.includes('price') || q.includes('pricing') || q.includes('cost') || q.includes('charge') || q.includes('budget') || q.includes('how much') || q.includes('taka') || q.includes('টাকা') || q.includes('খরচ') || q.includes('$') || q.includes('dollar')){
      return 'I work on transparent milestone pricing or weekly sprints with zero agency bloat. Small fixes start around $150, full apps/bots depend on scope. Drop your brief to <a href="mailto:saadalahsanmain@gmail.com">saadalahsanmain@gmail.com</a> or DM me on Telegram <a href="https://t.me/Steven0_o" target="_blank" rel="noopener">@Steven0_o</a>! 💰';
    }

    // Availability / Start / Timeline
    if(q.includes('start') || q.includes('when') || q.includes('avail') || q.includes('kobe') || q.includes('shuru') || q.includes('timeline') || q.includes('turnaround') || q.includes('how long') || q.includes('busy')){
      return 'I\'m currently <strong>available and open for new builds</strong>! I move fast — typically deliver initial v1 prototypes in 48 hours. Let\'s sync up on Telegram: <a href="https://t.me/Steven0_o" target="_blank" rel="noopener">@Steven0_o</a> ⚡';
    }

    // Bot / Trading / Web3 / Solana / Python
    if(q.includes('bot') || q.includes('trading') || q.includes('solana') || q.includes('sniper') || q.includes('crypto') || q.includes('python') || q.includes('web3') || q.includes('script') || q.includes('token')){
      return 'Built trading bots, sniper tools, and automated pipelines across Solana and CEXs (MEXC, Bybit, Binance). Tell me what exchange or trigger logic we\'re targeting! 🤖';
    }

    // Web / UI / UX / Figma / Design / Website
    if(q.includes('web') || q.includes('design') || q.includes('figma') || q.includes('site') || q.includes('ui') || q.includes('ux') || q.includes('frontend') || q.includes('react') || q.includes('landing')){
      return 'Pixel-perfection with zero fluff. High-conversion interfaces in Figma, smooth micro-interactions, and fast Next.js/React code. Do you have an existing design or starting from zero? 🎨';
    }

    // Call / Talk / Contact
    if(q.includes('call') || q.includes('talk') || q.includes('meet') || q.includes('zoom') || q.includes('cal') || q.includes('contact') || q.includes('kotha') || q.includes('jogajog')){
      return 'Let\'s cut the back-and-forth! Grab 15–30 mins directly on my calendar: <a href="https://cal.com/saadalahsan/30min" target="_blank" rel="noopener">cal.com/saadalahsan/30min</a> or ping me on Telegram <a href="https://t.me/Steven0_o" target="_blank" rel="noopener">@Steven0_o</a> 📅';
    }

    // Greetings
    if(q.startsWith('hi') || q.startsWith('hey') || q.startsWith('hello') || q.startsWith('salam') || q.startsWith('assalamu') || q.includes('kemon') || q.includes('ki khobor') || q.includes('bro') || q.includes('mama') || q.includes('sup') || q.includes('yo')){
      return 'Hey! Saad here 👋 Good to see you. Got a product idea, need something built, or have a question? Fire away!';
    }

    // Default
    return 'Love the vibe! Drop your repo, Figma link, or rough thoughts to <a href="mailto:saadalahsanmain@gmail.com">saadalahsanmain@gmail.com</a> or ping me on Telegram <a href="https://t.me/Steven0_o" target="_blank" rel="noopener">@Steven0_o</a> — let\'s build it! 🚀';
  }

  var isReplying = false;

  function sendMessage(text){
    if(!text || isReplying) return;

    var clientMsg = document.createElement('div');
    clientMsg.className = 'msg client new-msg';
    clientMsg.innerHTML = '<div class="av">Y</div><div class="body"><div class="meta"><span class="nm">You</span><span class="tm">' + getTimeString() + '</span></div><div class="tx">' + escapeHtml(text) + '</div></div>';
    body.insertBefore(clientMsg, typing);

    typing.style.display = 'flex';
    body.appendChild(typing);
    isReplying = true;

    setTimeout(function(){
      clientMsg.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }, 50);

    var replyDelay = Math.min(1300, Math.max(850, text.length * 25));
    setTimeout(function(){
      typing.style.display = 'none';

      var replyHtml = getAutoReply(text);
      var studioMsg = document.createElement('div');
      studioMsg.className = 'msg studio new-msg';
      studioMsg.innerHTML = '<div class="av av-logo">S</div><div class="body"><div class="meta"><span class="nm">Saad</span><span class="tm">' + getTimeString() + '</span></div><div class="tx">' + replyHtml + '</div></div>';
      body.insertBefore(studioMsg, typing);
      isReplying = false;

      setTimeout(function(){
        studioMsg.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      }, 50);
    }, replyDelay);
  }

  form.addEventListener('submit', function(e){
    e.preventDefault();
    var val = input.value.trim();
    if(!val) return;
    input.value = '';
    sendMessage(val);
  });
})();
