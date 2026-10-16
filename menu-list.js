(function () {
  "use strict";
  var config = window.HARBOR_MENU_CONFIG || {};
  var root = document.getElementById("menu-list");
  var status = document.getElementById("menu-status");
  if (!root || !status) return;

  function parseCSV(text) {
    var rows = [], row = [], field = "", quoted = false;
    text = String(text || "").replace(/^\uFEFF/, "");
    for (var i = 0; i < text.length; i++) {
      var ch = text[i], next = text[i + 1];
      if (ch === '"' && quoted && next === '"') { field += '"'; i++; }
      else if (ch === '"') quoted = !quoted;
      else if (ch === "," && !quoted) { row.push(field); field = ""; }
      else if ((ch === "\n" || ch === "\r") && !quoted) {
        if (ch === "\r" && next === "\n") i++;
        row.push(field); field = "";
        if (row.some(function (v) { return v.trim(); })) rows.push(row);
        row = [];
      } else field += ch;
    }
    if(quoted)throw new Error("Unclosed quoted CSV field");
    row.push(field);
    if (row.some(function (v) { return v.trim(); })) rows.push(row);
    if (!rows.length) throw new Error("Empty CSV");
    var headers = rows.shift().map(function (v) { return v.trim().toLowerCase().replace(/[_-]+/g," ").replace(/\s+/g," "); });
    if(!headers.some(function(h){return /^(item|name|dish)$/.test(h);}))throw new Error("Expected an Item, Name or Dish column");
    return rows.map(function (values) {
      var item = Object.create(null);
      headers.forEach(function (key, index) { item[key] = (values[index] || "").trim(); });
      return {
        category: item.category || "Menu",
        name: item.item || item.name || item.dish || "",
        description: item.description || item.details || "",
        price: item.price || "",
        priceNote: item["price note"] || item.note || "",
        available: item.available || "Yes",
        featured: item.featured || "No",
        dietary: item.dietary || "",
        order: Number(item["sort order"] || item.order || 9999)
      };
    }).filter(function (item) {
      return item.name && !/^(no|false|0|out|sold out|out of stock|unavailable)$/i.test(item.available);
    });
  }

  function esc(value) {
    return String(value || "").replace(/[&<>"']/g, function (ch) {
      return {"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[ch];
    });
  }

  function render(items) {
    var groups = Object.create(null);
    items.sort(function (a, b) { return a.order - b.order; }).forEach(function (item) {
      (groups[item.category] = groups[item.category] || []).push(item);
    });
    root.innerHTML = Object.keys(groups).map(function (category) {
      return '<section class="menu-col reveal in"><h3>' + esc(category) + '</h3><div class="rows">' +
        groups[category].map(function (item) {
          var tags = item.dietary ? '<span class="menu-dietary">' + esc(item.dietary) + '</span>' : '';
          var featured = /^(yes|true|1)$/i.test(item.featured) ? ' menu-row--featured' : '';
          return '<div class="row menu-row' + featured + '"><div><h4>' + esc(item.name) + '</h4><p>' + esc(item.description) + '</p>' + tags + '</div>' +
            '<span class="price">' + esc(item.price) + (item.priceNote ? '<span class="meta">' + esc(item.priceNote) + '</span>' : '') + '</span></div>';
        }).join('') + '</div></section>';
    }).join('');
    status.textContent = items.length ? items.length + ' current menu items · checked ' + new Date().toLocaleTimeString([], {hour:'numeric',minute:'2-digit'}) : 'No menu items are currently available.';
    root.setAttribute('aria-busy', 'false');
  }

  if (!config.csvUrl) {
    status.textContent = 'Menu inventory is not connected.';
    root.setAttribute('aria-busy', 'false');
    return;
  }
  var loading=false,loaded=false;
  async function load(){if(loading||document.hidden)return;loading=true;var controller=new AbortController(),timer=setTimeout(function(){controller.abort();},15000);
    try{var response=await fetch(config.csvUrl,{cache:'no-store',signal:controller.signal});if(!response.ok)throw Error('HTTP '+response.status);var text=await response.text();if(/^\s*</.test(text))throw Error('Expected CSV, received HTML');var items=parseCSV(text);render(items);loaded=true;}
    catch(error){console.warn('Menu inventory:',error.message);status.textContent=loaded?'Refresh unavailable. Showing the last successfully loaded menu; prices and availability may have changed.':'The current menu is temporarily unavailable. Please refresh or contact the restaurant.';root.setAttribute('aria-busy','false');}
    finally{clearTimeout(timer);loading=false;}
  }
  var minutes=Number(config.refreshMinutes)||10;setInterval(load,Math.max(1,minutes)*60000);document.addEventListener('visibilitychange',function(){if(!document.hidden)load();});load();
})();
