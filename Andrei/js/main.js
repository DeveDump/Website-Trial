document.addEventListener('DOMContentLoaded', function(){
  var nav = document.getElementById('nav');
  var toggle = document.getElementById('nav-toggle');
  if(toggle) toggle.addEventListener('click', function(){ nav.classList.toggle('open'); });

  // Smooth scroll and active nav link
  document.querySelectorAll('a[href^="#"]').forEach(function(anchor){
    anchor.addEventListener('click', function(e){
      var href = this.getAttribute('href');
      if(!href || href === '#') return;
      var target = document.querySelector(href);
      if(target){
        e.preventDefault();
        target.scrollIntoView({behavior:'smooth',block:'start'});
        if(nav && nav.classList.contains('open')) nav.classList.remove('open');
      }
    });
  });

  // Highlight active nav on scroll (if single-page sections present)
  var sections = document.querySelectorAll('main section[id]');
  var navLinks = document.querySelectorAll('.nav-link');
  function onScroll(){
    var y = window.scrollY + 120;
    sections.forEach(function(sec){
      if(sec.offsetTop <= y && sec.offsetTop + sec.offsetHeight > y){
        navLinks.forEach(function(a){ a.classList.remove('active'); if(a.getAttribute('href') === '#'+sec.id) a.classList.add('active'); });
      }
    });
  }
  if(sections.length) { window.addEventListener('scroll', onScroll); onScroll(); }

  // Theme toggle (persist)
  var themeToggle = document.getElementById('theme-toggle');
  var prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
  var stored = localStorage.getItem('theme');
  if(stored === 'dark' || (!stored && prefersDark)) document.documentElement.classList.add('dark');
  function setTheme(dark){
    if(dark) document.documentElement.classList.add('dark'); else document.documentElement.classList.remove('dark');
    if(themeToggle) themeToggle.setAttribute('aria-pressed', String(dark));
    localStorage.setItem('theme', dark ? 'dark' : 'light');
  }
  if(themeToggle) themeToggle.addEventListener('click', function(){ setTheme(!document.documentElement.classList.contains('dark')); });

  // Gallery lightbox
  var tiles = document.querySelectorAll('.tile');
  var lightbox = document.getElementById('lightbox');
  if(lightbox){
    var lbImg = lightbox.querySelector('img');
    var lbClose = lightbox.querySelector('.close');
    tiles.forEach(function(t){ t.addEventListener('click', function(){ var src = this.dataset.src; lbImg.src = src; lbImg.alt = 'Gallery image'; lightbox.setAttribute('aria-hidden','false'); }); });
    function closeLB(){ lightbox.setAttribute('aria-hidden','true'); if(lbImg) lbImg.src=''; }
    if(lbClose) lbClose.addEventListener('click', closeLB);
    lightbox.addEventListener('click', function(e){ if(e.target === lightbox) closeLB(); });
    document.addEventListener('keydown', function(e){ if(e.key==='Escape') closeLB(); });
  }

  // Reveal on scroll
  var reveals = document.querySelectorAll('.reveal');
  if('IntersectionObserver' in window){
    var io = new IntersectionObserver(function(entries){ entries.forEach(function(ent){ if(ent.isIntersecting) ent.target.classList.add('visible'); }); },{threshold:0.15});
    reveals.forEach(function(r){ io.observe(r); });
  } else { reveals.forEach(function(r){ r.classList.add('visible'); }); }

  // Enhanced contact form: validation + localStorage + mock send
  var form = document.getElementById('contact-form');
  var msg = document.getElementById('form-msg');
  if(form){
    ['name','email'].forEach(function(id){ var el = document.getElementById(id); var v = localStorage.getItem('contact.'+id); if(el && v) el.value = v; if(el) el.addEventListener('input', function(){ localStorage.setItem('contact.'+id,this.value); }); });
    form.addEventListener('submit', function(e){ e.preventDefault(); var name = document.getElementById('name').value.trim(); var email = document.getElementById('email').value.trim(); var message = document.getElementById('message').value.trim(); if(!name || !email || !message){ if(msg) { msg.style.color='crimson'; msg.textContent='Please complete all fields.'; } return; } if(msg) { msg.style.color='green'; msg.textContent='Sending…'; } setTimeout(function(){ if(msg) msg.textContent='Thanks — message sent (mock).'; form.reset(); localStorage.removeItem('contact.name'); localStorage.removeItem('contact.email'); setTimeout(function(){ if(msg) msg.textContent=''; },4000); },1000); });
  }
});
