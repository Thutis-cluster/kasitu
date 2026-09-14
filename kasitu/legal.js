/* KASITU Webs — shared legal-page interactions */
(function(){
  const root=document.documentElement;
  const saved=localStorage.getItem('kasitu-theme');
  if(saved==='light'||saved==='dark') root.setAttribute('data-theme',saved);

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
    if(link && window.innerWidth<=900) document.querySelector('.legal-links')?.classList.remove('open');
  });
})();
