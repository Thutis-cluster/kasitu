/* KASITU Webs — shared legal-page interactions */
(function(){
  'use strict';

  const root=document.documentElement;
  const saved=localStorage.getItem('kasitu-theme');
  if(saved==='light'||saved==='dark') root.setAttribute('data-theme',saved);

  function removeFooterLinks(){
    document.querySelectorAll('.legal-footer-links').forEach(function(el){el.remove();});
  }

  function addBackButton(){
    if(document.querySelector('.legal-back-wrap')) return;
    const main=document.querySelector('main');
    const footer=document.querySelector('.legal-footer');
    if(!main || !footer) return;

    const wrap=document.createElement('div');
    wrap.className='legal-back-wrap';

    const link=document.createElement('a');
    link.className='legal-back-btn';
    link.href='index.html';
    link.innerHTML='<i class="fas fa-arrow-left" aria-hidden="true"></i><span>Back to KASITU Webs</span>';
    link.setAttribute('aria-label','Back to KASITU Webs website');

    wrap.appendChild(link);
    /* Put the button at the bottom of the page, directly above the copyright. */
    footer.insertBefore(wrap,footer.firstElementChild);
  }

  function closeMobileMenu(){
    const links=document.querySelector('.legal-links');
    const menu=document.querySelector('[data-legal-menu]');
    if(links) links.classList.remove('open');
    if(menu) menu.setAttribute('aria-expanded','false');
  }

  function init(){
    removeFooterLinks();
    addBackButton();

    document.addEventListener('click',function(e){
      const theme=e.target.closest('[data-legal-theme]');
      if(theme){
        const next=root.getAttribute('data-theme')==='light'?'dark':'light';
        root.setAttribute('data-theme',next);
        localStorage.setItem('kasitu-theme',next);
        theme.setAttribute('aria-label','Switch to '+(next==='light'?'dark':'light')+' mode');
      }

      const menu=e.target.closest('[data-legal-menu]');
      if(menu){
        const links=document.querySelector('.legal-links');
        if(links) links.classList.toggle('open');
        menu.setAttribute('aria-expanded',links && links.classList.contains('open')?'true':'false');
      }

      const link=e.target.closest('.legal-links a');
      if(link && window.innerWidth<=900) closeMobileMenu();
    });

    /* Close the small-screen menu whenever the user scrolls. */
    let scrollTimer;
    window.addEventListener('scroll',function(){
      if(window.innerWidth>900) return;
      clearTimeout(scrollTimer);
      scrollTimer=setTimeout(closeMobileMenu,20);
    },{passive:true});
  }

  if(document.readyState==='loading'){
    document.addEventListener('DOMContentLoaded',init,{once:true});
  }else{
    init();
  }
})();
