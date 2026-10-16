/* Harbor & Vine live menu — reads a Google Sheet published as CSV.
   To change the sheet: replace MENU_CSV_URL (must end in output=csv, NOT pubhtml). */
(function(){
  'use strict';
  var MENU_CSV_URL='https://docs.google.com/spreadsheets/d/e/2PACX-1vSAR2_yi2SgU6hDXvAj_wbpuKoRke2ouN2kGLIK1BDvHUbGKT9j63EdihEqOe7B6zedjyU-NNo4Pkbc/pub?gid=739678643&single=true&output=csv';
  var REFRESH_MS=5*60*1000;   // re-check the sheet every 5 minutes while the page is open

  var list=document.getElementById('menu-list'), status=document.getElementById('menu-status');
  if(!list)return;

  // Accepted column headers (case/spacing ignored). Put any of these in row 1 of the sheet.
  var COLS={
    section:['section','category','course','menusection','group','type'],
    name:['name','dish','item','itemname','dishname','title'],
    description:['description','desc','details','ingredients','notes'],
    price:['price','cost','amount'],
    available:['available','availability','status','instock','active','show','visible','onmenu'],
    tags:['tags','dietary','diet','allergens','labels'],
    order:['order','sort','position']
  };
  var HIDE=/^(no|n|false|0|off|hide|hidden|unavailable|soldout|sold out|out|86|86'd|inactive)$/i;

  function norm(s){return String(s||'').toLowerCase().replace(/[^a-z0-9]/g,'');}
  function esc(s){return String(s==null?'':s).replace(/[&<>"']/g,function(c){return{'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c];});}

  function parseCSV(text){
    text=text.replace(/^\uFEFF/,'');
    var rows=[],row=[],f='',q=false;
    for(var i=0;i<text.length;i++){
      var c=text[i];
      if(q){ if(c==='"'){ if(text[i+1]==='"'){f+='"';i++;} else q=false; } else f+=c; }
      else if(c==='"')q=true;
      else if(c===','){row.push(f);f='';}
      else if(c==='\n'||c==='\r'){ if(c==='\r'&&text[i+1]==='\n')i++; row.push(f);rows.push(row);row=[];f=''; }
      else f+=c;
    }
    if(f!==''||row.length){row.push(f);rows.push(row);}
    return rows.filter(function(r){return r.some(function(v){return v.trim()!=='';});});
  }

  function mapHeaders(head){
    var idx={},h=head.map(norm);
    Object.keys(COLS).forEach(function(k){
      idx[k]=-1;
      for(var i=0;i<COLS[k].length&&idx[k]<0;i++)idx[k]=h.indexOf(COLS[k][i]);
    });
    if(idx.name<0)idx.name=0;   // no recognised name column: use the first column
    return idx;
  }

  function fmtPrice(p){p=String(p||'').trim();return /^\d+(\.\d+)?$/.test(p)?'$'+p:p;}

  var CACHE='hv-menu-csv', limit=parseInt(list.getAttribute('data-limit'),10)||0, last='';
  function store(t){try{localStorage.setItem(CACHE,t);}catch(e){}}
  function cached(){try{return localStorage.getItem(CACHE)||'';}catch(e){return '';}}

  function render(rows){
    var idx=mapHeaders(rows[0]), get=function(r,k){return idx[k]>=0?(r[idx[k]]||'').trim():'';};
    var items=rows.slice(1).map(function(r,n){
      return{section:get(r,'section')||'Menu',name:get(r,'name'),desc:get(r,'description'),price:get(r,'price'),
             avail:get(r,'available'),tags:get(r,'tags'),order:parseFloat(get(r,'order')),n:n};
    }).filter(function(it){return it.name&&!HIDE.test(it.avail);});

    if(!items.length){list.innerHTML='';say('The menu sheet loaded, but no available dishes were found.');return;}

    items.sort(function(a,b){var ao=isNaN(a.order)?1e9:a.order,bo=isNaN(b.order)?1e9:b.order;return ao-bo||a.n-b.n;});
    var groups=[],by={};
    items.forEach(function(it){if(!by[it.section]){by[it.section]=[];groups.push(it.section);}by[it.section].push(it);});

    var shown=limit?groups.slice(0,limit):groups;
    list.innerHTML=shown.map(function(g){
      return '<section class="hv-menu-section"><h3 class="hv-menu-heading">'+esc(g)+'</h3><ul class="hv-menu-items">'+
        by[g].map(function(it){
          var tags=it.tags?it.tags.split(/[,;|]/).map(function(t){return t.trim();}).filter(Boolean):[];
          return '<li class="hv-menu-item"><div class="hv-menu-line"><span class="hv-menu-name">'+esc(it.name)+'</span>'+
            (it.price?'<span class="hv-menu-dots" aria-hidden="true"></span><span class="hv-menu-price">'+esc(fmtPrice(it.price))+'</span>':'')+'</div>'+
            (it.desc?'<p class="hv-menu-desc">'+esc(it.desc)+'</p>':'')+
            (tags.length?'<p class="hv-menu-tags">'+tags.map(function(t){return '<span>'+esc(t)+'</span>';}).join('')+'</p>':'')+'</li>';
        }).join('')+'</ul></section>';
    }).join('');
    list.setAttribute('aria-busy','false');
    say(limit&&groups.length>limit?'A taste of tonight’s menu.':items.length+' dishes on tonight’s menu.');
  }

  function say(msg){if(status)status.textContent=msg;}

  function load(first){
    var url=MENU_CSV_URL+(MENU_CSV_URL.indexOf('?')>-1?'&':'?')+'_='+Date.now();
    fetch(url,{cache:'no-store'})
      .then(function(r){if(!r.ok)throw new Error('HTTP '+r.status);return r.text();})
      .then(function(t){
        if(/^\s*<(!doctype|html)/i.test(t))throw new Error('Got a web page instead of CSV — publish the tab as "Comma-separated values (.csv)".');
        if(t===last)return;                       // nothing changed: don't redraw
        var rows=parseCSV(t);
        if(rows.length<2)throw new Error('The sheet is empty.');
        last=t;store(t);render(rows);
      })
      .catch(function(err){
        if(window.console)console.warn('[menu]',err);
        list.setAttribute('aria-busy','false');
        if(first&&!last)say('The menu could not be loaded right now. Please call the restaurant for tonight’s menu.');
      });
  }

  var c=cached();
  if(c){var cr=parseCSV(c);if(cr.length>1){last=c;render(cr);}}
  else list.innerHTML=Array(limit||3).fill('<div class="hv-menu-skel" aria-hidden="true"><i></i><i></i><i></i></div>').join('');
  load(true);
  setInterval(function(){if(!document.hidden)load(false);},REFRESH_MS);
  document.addEventListener('visibilitychange',function(){if(!document.hidden)load(false);});
})();
