/* KASITU Webs — shared legal-page interactions */
(function(){
  const root=document.documentElement;
  const saved=localStorage.getItem('kasitu-theme');
  if(saved==='light'||saved==='dark') root.setAttribute('data-theme',saved);

  function addBackButton(){
    if(document.querySelector('.legal-back-wrap')) return;
    const main=document.querySelector('main');
    const hero=document.querySelector('.legal-hero');
    if(!main || !hero) return;

    const wrap=document.createElement('div');
    wrap.className='legal-back-wrap';

    const link=document.createElement('a');
    link.className='legal-back-btn';
    link.href='index.html';
    link.innerHTML='<i class="fas fa-arrow-left" aria-hidden="true"></i><span>Back to KASITU Webs</span>';
    link.setAttribute('aria-label','Back to KASITU Webs website');

    wrap.appendChild(link);
    hero.insertAdjacentElement('afterend',wrap);
  }

  function closeMobileMenu(){
    const links=document.querySelector('.legal-links');
    const menu=document.querySelector('[data-legal-menu]');
    if(links) links.classList.remove('open');
    if(menu) menu.setAttribute('aria-expanded','false');
  }

  function init(){
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
        links?.classList.toggle('open');
        menu.setAttribute('aria-expanded',links?.classList.contains('open')?'true':'false');
      }

      const link=e.target.closest('.legal-links a');
      if(link && window.innerWidth<=900) closeMobileMenu();
    });
  }

  if(document.readyState==='loading'){
    document.addEventListener('DOMContentLoaded',init,{once:true});
  }else{
    init();
  }
})();
