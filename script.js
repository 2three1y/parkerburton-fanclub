(function(){
  "use strict";
  var reduce=window.matchMedia&&window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  // Calm mode (photosensitivity notice at the top, on by default) or the system Reduce Motion setting: no confetti, no motion.
  function calm(){return window.calmMode?window.calmMode():reduce;}
  function fmt(x){return x.toLocaleString("en-US");}

  // Ticker: duplicate items for a seamless loop (copies hidden from assistive tech)
  var track=document.getElementById("tickerTrack");
  if(track){Array.prototype.slice.call(track.children).forEach(function(li){var c=li.cloneNode(true);c.setAttribute("aria-hidden","true");track.appendChild(c);});}

  // Ever-rising fan counter (starts at his TikTok following (3.6M), then keeps going)
  var el=document.getElementById("fanCount"),live=document.getElementById("fanLive");
  var n=3600000001,paused=false;
  function paint(){if(el) el.textContent=fmt(n);}
  setInterval(function(){if(document.hidden) return;if(paused) return;n+=Math.floor(Math.random()*9)+1;paint();},800);

  // Pause control for everything that moves or updates on its own
  var pb=document.getElementById("pauseBtn");
  if(pb) pb.addEventListener("click",function(){
    paused=!paused;document.body.classList.toggle("paused",paused);
    pb.setAttribute("aria-pressed",String(paused));pb.textContent=paused?"Play":"Pause";
    if(live) live.textContent=paused?"Live updates paused. Fan count is "+fmt(n)+".":"Live updates resumed.";
  });

  // Confetti (green bubble edition)
  var canvas=document.getElementById("confetti"),ctx=canvas.getContext("2d");
  var parts=[],running=false,colors=["#3ddc84","#a6f4c5","#1f8bff","#c6ff3d","#3ddc84"];
  function size(){var d=window.devicePixelRatio||1;canvas.width=innerWidth*d;canvas.height=innerHeight*d;ctx.setTransform(d,0,0,d,0,0);}
  size();addEventListener("resize",size);
  function burst(x,y,count){
    if(calm()||document.hidden) return;
    count=Math.min(count,36); // gentle: fewer, slower pieces, no white
    for(var i=0;i<count;i++){
      var a=Math.random()*Math.PI*2,s=4+Math.random()*9;
      parts.push({x:x,y:y,vx:Math.cos(a)*s,vy:Math.sin(a)*s-6,w:6+Math.random()*6,h:8+Math.random()*8,r:Math.random()*6,vr:(Math.random()-.5)*.12,c:colors[i%colors.length],life:0,icon:Math.random()<.07});
    }
    if(!running){running=true;requestAnimationFrame(tick);}
  }
  function tick(){
    ctx.clearRect(0,0,innerWidth,innerHeight);
    for(var i=parts.length-1;i>=0;i--){
      var p=parts[i];p.vy+=.28;p.vx*=.985;p.x+=p.vx;p.y+=p.vy;p.r+=p.vr;p.life++;
      if(p.y>innerHeight+40||p.life>260){parts.splice(i,1);continue;}
      ctx.save();ctx.translate(p.x,p.y);ctx.rotate(p.r);
      if(p.icon){ctx.font="22px serif";ctx.fillText("\u{1F4F1}",-11,8);}
      else{ctx.fillStyle=p.c;ctx.fillRect(-p.w/2,-p.h/2,p.w,p.h);}
      ctx.restore();
    }
    if(parts.length){requestAnimationFrame(tick);}else{running=false;ctx.clearRect(0,0,innerWidth,innerHeight);}
  }
  function center(e){var r=e.getBoundingClientRect();return [r.left+r.width/2,r.top+r.height/2];}

  // Send a green bubble
  var sent=0;
  var lines=[
    "The chat is quiet. Too quiet. Press the button.",
    "One green bubble sent. An iPhone somewhere felt that.",
    "Two! The group chat is turning green.",
    "Three. Someone just asked “wait, what phone is that?”",
    "Four. A blue bubble left the chat.",
    "Five! You are officially Ultra Unlocked."
  ];
  var msgs=["PARKER POSTED","native camera supremacy","green bubbles only in here","he reviewed the FRIDGE","snapdragon goes brrr","That Android Guy for president","120 Hz of pure glaze","no blue bubbles were harmed"];
  var hb=document.getElementById("hypeBtn"),hl=document.getElementById("hypeLine"),bc=document.getElementById("bubbleCount"),th=document.getElementById("thread");
  if(hb) hb.addEventListener("click",function(){
    sent++;if(bc) bc.textContent=fmt(sent);
    if(th){var m=document.createElement("p");m.className="msg out";m.textContent=msgs[(sent-1)%msgs.length];th.appendChild(m);
      while(th.children.length>4) th.removeChild(th.firstChild);}
    var c=center(hb);burst(c[0],c[1],150);
    if(navigator.vibrate) navigator.vibrate(30);
    hl.textContent=sent<lines.length?lines[sent]:sent+" green bubbles sent. The whole internet is green now. He deserves "+(sent*10)+".";
    n+=1000*sent;paint();
  });

  // Join
  var jb=document.getElementById("joinBtn"),jm=document.getElementById("joinedMsg"),joined=false;
  if(jb) jb.addEventListener("click",function(){
    var c=center(jb);burst(c[0],c[1],180);
    if(!joined){joined=true;n+=1;paint();
      jm.textContent="Welcome, Fan #"+fmt(n)+". Your imaginary stylus is in the mail.";
      jb.textContent="You're in. Press again to celebrate";}
    else{jm.textContent="Still a fan. Always a fan. Always green.";}
  });
  // No confetti on load: nothing moves until the visitor asks for it.
})();
