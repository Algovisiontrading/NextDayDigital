/* Demo forms (reservations + event enquiry). Shows a preview; never sends anything. */
(function(){'use strict';
  function today(){var d=new Date();return d.getFullYear()+'-'+String(d.getMonth()+1).padStart(2,'0')+'-'+String(d.getDate()).padStart(2,'0');}
  document.querySelectorAll('form[data-demo="true"]').forEach(function(form){
    var status=document.getElementById(form.dataset.status),preview=document.getElementById(form.dataset.preview),date=form.elements.date;
    if(date){date.min=today();date.addEventListener('input',function(){date.setCustomValidity('');});}
    form.addEventListener('submit',function(e){
      e.preventDefault();
      if(date){date.min=today();date.setCustomValidity(date.value&&date.value<date.min?'Choose today or a future date.':'');}
      if(!form.reportValidity())return;
      var lines=['DEMONSTRATION ONLY: nothing has been sent.',''];
      new FormData(form).forEach(function(v,k){if(String(v).trim())lines.push(k.charAt(0).toUpperCase()+k.slice(1).replace(/_/g,' ')+': '+v);});
      if(preview){preview.textContent=lines.join('\n');preview.hidden=false;preview.scrollIntoView({behavior:'smooth',block:'nearest'});}
      if(status)status.textContent='Preview shown below. No email was sent and nothing is booked.';
    });
  });
})();
