/* Shared polish and compatibility fixes for the existing flat-file site. */
(function(){'use strict';if(window.__nddUpgrades)return;window.__nddUpgrades=true;
 document.querySelectorAll('.concept-tabs a,.drawer a').forEach(function(a){var url=new URL(a.href,location.href);if(!url.hash&&url.pathname===location.pathname)a.setAttribute('aria-current','page');});
 var tabs=Array.from(document.querySelectorAll('.concept-tabs a[href^="#"]'));
 function activeTab(){var current=null;tabs.forEach(function(a){var target=document.getElementById(a.hash.slice(1));if(target&&target.getBoundingClientRect().top<=180)current=a.hash;});tabs.forEach(function(a){if(current&&a.hash===current)a.setAttribute('aria-current','location');else a.removeAttribute('aria-current');});}
 if(tabs.length){var pending=false;addEventListener('scroll',function(){if(!pending){pending=true;requestAnimationFrame(function(){pending=false;activeTab();});}},{passive:true});activeTab();}
 // Keep staff links hidden unless explicitly requested; this is not authentication.
 if(new URLSearchParams(location.search).get('staff')==='1')document.querySelectorAll('[data-staff-link]').forEach(function(a){a.hidden=false;});
 // Anchor navigation must move keyboard focus, not just scroll the viewport.
 document.querySelectorAll('a.skip').forEach(function(a){a.addEventListener('click',function(){var target=document.getElementById('main');if(target){target.setAttribute('tabindex','-1');target.focus({preventScroll:true});}});});
 // Do not let global L/D shortcuts interrupt editable text.
 document.addEventListener('keydown',function(e){if(e.target.isContentEditable&&/^[ld]$/i.test(e.key))e.stopImmediatePropagation();},true);
 var burger=document.getElementById('burger'),drawer=document.getElementById('drawer');
 if(burger&&drawer){function sync(){var open=burger.getAttribute('aria-expanded')==='true';drawer.inert=!open;drawer.setAttribute('aria-hidden',String(!open));}sync();new MutationObserver(sync).observe(burger,{attributes:true,attributeFilter:['aria-expanded']});document.addEventListener('keydown',function(e){if(e.key==='Escape'&&drawer.contains(document.activeElement))burger.focus();});document.addEventListener('pointerdown',function(e){if(burger.getAttribute('aria-expanded')==='true'&&!drawer.contains(e.target)&&!burger.contains(e.target))burger.click();});}
})();
