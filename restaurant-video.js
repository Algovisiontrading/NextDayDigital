/* Home hero video: always muted, loops forever, no controls. Mobile file used when present. */
(function(){'use strict';
  var video=document.querySelector('video.hero-video-bg');if(!video)return;
  var mobile=matchMedia('(max-width:767px)'),motion=matchMedia('(prefers-reduced-motion:reduce)'),source='',mobileFailed=false;
  function mute(){video.muted=true;video.defaultMuted=true;video.volume=0;video.setAttribute('muted','');}
  function play(){mute();if(document.hidden||motion.matches)return;var p=video.play();if(p&&p.catch)p.catch(function(){});}
  function pick(){
    var next=(mobile.matches&&!mobileFailed)?'Restaurant-Home-Video-Mobile.mp4':'Restaurant-Home-Video.mp4';
    if(next!==source){source=next;video.src=next;video.load();}
    play();
  }
  video.loop=true;
  video.addEventListener('ended',function(){video.currentTime=0;play();});   // belt-and-braces loop
  video.addEventListener('volumechange',function(){if(!video.muted||video.volume)mute();});
  video.addEventListener('canplay',play);
  video.addEventListener('error',function(){if(source.indexOf('Mobile')>-1){mobileFailed=true;pick();}});
  document.addEventListener('visibilitychange',function(){document.hidden?video.pause():play();});
  document.addEventListener('pointerdown',play,{once:true,passive:true});
  function watch(q,fn){q.addEventListener?q.addEventListener('change',fn):q.addListener(fn);}
  watch(mobile,pick);watch(motion,function(){motion.matches?video.pause():play();});
  mute();
  if(motion.matches){video.removeAttribute('autoplay');video.preload='none';}else pick();
})();
