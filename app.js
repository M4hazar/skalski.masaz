(function(){ try{ var isDark=document.documentElement.classList.contains('dark'); var im=document.querySelector('#pageLoader img.logo-mark'); if(im){ im.src=isDark?'assets/sygnet-white.png':'assets/sygnet.png'; } }catch(e){} })();
;
(function(){
        // Ustaw MIN i domyślną wartość na *lokalną* dzisiejszą datę (bez UTC przesunięć)
        function toLocalISODate(d){
          try{
            var tz = d.getTimezoneOffset() * 60000;
            return new Date(d.getTime() - tz).toISOString().slice(0,10);
          }catch(e){ return ''; }
        }
        var input = document.getElementById('fDate');
        if(!input) return;
        var today = new Date(); today.setHours(0,0,0,0);
        var todayIso = toLocalISODate(today);
        // Ustaw minimalną datę
        input.min = todayIso;
        // Jeśli puste lub wcześniejsze niż min -> ustaw dzisiaj
        if(!input.value || input.value < todayIso){ input.value = todayIso; }
        // Blokuj wybór dat z przeszłości
        input.addEventListener('change', function(){
          if (input.value && input.value < todayIso){ input.value = todayIso; }
        });
      })();
;
(function(){
        function ensureCalendarIcon(el){
          if(!el) return;
          // If lucide rendered SVG, it will no longer be an <i> element
          if(el.tagName.toLowerCase() !== 'i') return;
          // Inject a minimal inline SVG calendar (16x16) as fallback
          el.outerHTML = '<svg aria-hidden="true" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>';
        }
        // Run after load and shortly after to cover late script loads
        function run(){
          ensureCalendarIcon(document.querySelector('#datePickerBtn i[data-lucide="calendar"]'));
          ensureCalendarIcon(document.querySelector('a[href="#kontakt"] i[data-lucide="calendar"]'));
        }
        if(document.readyState === 'complete'){ run(); } else { window.addEventListener('load', run); }
        setTimeout(run, 1200);
      })();
;
(function(){
    var navLinks = Array.prototype.slice.call(document.querySelectorAll('header nav a[href^="#"]'));
    var sections = Array.prototype.slice.call(document.querySelectorAll('section[id]'));
    if(!navLinks.length || !sections.length) return;

    var currentId = 'home';
    applyActive(currentId);

    function band(){
      var vh = window.innerHeight || document.documentElement.clientHeight;
      return { top: vh * 0.30, bottom: vh * 0.70 }; // pasmo 30%–70%
    }

    function pickSection(){
      var b = band();
      var best = null, bestOverlap = 0;
      for(var i=0;i<sections.length;i++){
        var r = sections[i].getBoundingClientRect();
        // Pomijamy sekcje praktycznie poza ekranem
        if(r.bottom <= 0 || r.top >= window.innerHeight) continue;
        var a = Math.max(r.top, b.top);
        var c = Math.min(r.bottom, b.bottom);
        var overlap = Math.max(0, c - a);
        if(overlap > bestOverlap){
          bestOverlap = overlap;
          best = sections[i];
        }
      }
      // wymagaj minimalnego pokrycia pasa (np. 24px), aby nie migało
      if(best && bestOverlap >= 24) return best.id;
      return null;
    }

    function applyActive(id){
      navLinks.forEach(function(link){
        link.classList.remove('nav-active');
        if(id && link.getAttribute('href') === '#' + id){
          link.classList.add('nav-active');
        }
      });
    }

    var ticking = false;
    function onScroll(){
      if(ticking) return;
      ticking = true;
      window.requestAnimationFrame(function(){
        var id = pickSection() || currentId; // trzymaj poprzedni, jeśli nic nie spełnia warunku
        if(id !== currentId){
          currentId = id;
          applyActive(currentId);
        }
        ticking = false;
      });
    }

    // Reakcje
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    document.addEventListener('DOMContentLoaded', onScroll);
    window.addEventListener('load', function(){ setTimeout(onScroll, 120); });
  })();
;
(function(){
  try{
    var btn = document.getElementById('mobileMenuToggle');
    var panel = document.getElementById('mobileMenu');
    var overlay = document.getElementById('mobileMenuOverlay');
    if(!btn || !panel) return;
    function closeMenu(){ panel.classList.add('hidden'); document.documentElement.style.overflow = ''; }
    function openMenu(){ panel.classList.remove('hidden'); document.documentElement.style.overflow = 'hidden'; }
    btn.addEventListener('click', function(){
      if(panel.classList.contains('hidden')) openMenu(); else closeMenu();
    });
    if(overlay){ overlay.addEventListener('click', closeMenu); }
    panel.addEventListener('click', function(e){
      var a = e.target.closest('a'); if(a) closeMenu();
    });
    // Close on ESC
    document.addEventListener('keydown', function(e){ if(e.key==='Escape') closeMenu(); });
  }catch(e){}
})();
;
/* date-icon-handler */
(function(){
  try{
    var dateBtn = document.getElementById('datePickerBtn');
    var dateInput = document.getElementById('fDate');
    if(dateBtn && dateInput){
      dateBtn.addEventListener('click', function(){
        try{ if(typeof dateInput.showPicker==='function') dateInput.showPicker(); else dateInput.focus(); }
        catch(e){ dateInput.focus(); }
      });
    }
  }catch(e){}
})();
;
/* scrollspy-observer */
(function(){
  var ids = ['home', 'uslugi', 'jak-to-dziala', 'kontakt'];
  function $$(sel){ return Array.prototype.slice.call(document.querySelectorAll(sel)); }
  function targets(id){ return $$('a[href="#'+id+'"]'); }
  function setActive(id){
    var all = $$('nav a, #mobileMenu a');
    all.forEach(function(a){ a.classList.remove('nav-active'); });
    targets(id).forEach(function(a){ a.classList.add('nav-active'); });
  }
  if('IntersectionObserver' in window){
    var io = new IntersectionObserver(function(entries){
      entries.forEach(function(e){ if(e.isIntersecting) setActive(e.target.id); });
    }, { rootMargin:'-45% 0px -45% 0px', threshold:0.01 });
    ids.forEach(function(id){ var el=document.getElementById(id); if(el) io.observe(el); });
  } else {
    window.addEventListener('scroll', function(){
      var pos = window.scrollY + window.innerHeight * 0.5, best=null, dmin=1e9;
      ids.forEach(function(id){ var el=document.getElementById(id); if(!el) return; var r=el.getBoundingClientRect(); var mid=r.top+window.scrollY+r.height/2; var d=Math.abs(mid-pos); if(d<dmin){dmin=d;best=id;} });
      if(best) setActive(best);
    });
  }
})();
;
// validate-smsBtn (minimal; nie zmienia wyglądu)
document.addEventListener('DOMContentLoaded', function(){
  var btn = document.getElementById('smsBtn');
  var nameEl = document.getElementById('fName');
  var addrEl = document.getElementById('fWhere');
  if(!btn || !nameEl || !addrEl) return;
  btn.addEventListener('click', function(e){
    var name = (nameEl.value || '').trim();
    var where = (addrEl.value || '').trim();
    if (!name || !where) {
      e.preventDefault();
      if (!name) { try { nameEl.focus(); } catch(_){} }
      else { try { addrEl.focus(); } catch(_){} }
    }
  }, true); // capture: zadziała zanim przeglądarka wejdzie w href
});
