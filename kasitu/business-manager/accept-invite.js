/* KASITU Webs Business Manager — secure team invitation acceptance */
(function(){
'use strict';

const app=document.getElementById('inviteApp');

function renderMessage(html){
  if(app) app.innerHTML=html;
}

function loadScript(src){
  return new Promise(resolve=>{
    const s=document.createElement('script');
    s.src=src;
    s.onload=()=>resolve(true);
    s.onerror=()=>resolve(false);
    document.head.appendChild(s);
  });
}

const esc=v=>String(v??'').replace(/[&<>'"]/g,c=>({
  '&':'&amp;',
  '<':'&lt;',
  '>':'&gt;',
  "'":'&#039;',
  '"':'&quot;'
}[c]));

async function init(){
  const params=new URLSearchParams(location.search);
  const queryToken=params.get('token')||'';
  const hashToken=new URLSearchParams(location.hash.replace(/^#\/?/, '')).get('token')||'';

  let storedToken='';
  try{
    storedToken=sessionStorage.getItem('kasitu_invite_token')||localStorage.getItem('kasitu_invite_token')||'';
  }catch(_){}

  const token=queryToken||hashToken||storedToken;

  try{
    if(queryToken||hashToken){
      sessionStorage.setItem('kasitu_invite_token',token);
      localStorage.setItem('kasitu_invite_token',token);
    }
  }catch(_){}

  if(!token){
    renderMessage('<div class="report-alert">This invitation link is missing its security token.</div>');
    return;
  }

  renderMessage('<p class="report-note">Loading invitation service…</p>');

  const configLoaded=await loadScript('supabase-config.js');
  if(!configLoaded||!window.KASITU_SUPABASE_URL||!window.KASITU_SUPABASE_PUBLISHABLE_KEY){
    renderMessage('<div class="report-alert">Supabase configuration could not be loaded. Please refresh this invitation link.</div>');
    return;
  }

  if(!window.supabase){
    const supabaseLoaded=await loadScript('https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2');
    if(!supabaseLoaded||!window.supabase){
      renderMessage('<div class="report-alert">The invitation service could not load. Please check your internet connection and refresh the page.</div>');
      return;
    }
  }

  let client;
  try{
    client=window.supabase.createClient(
      window.KASITU_SUPABASE_URL,
      window.KASITU_SUPABASE_PUBLISHABLE_KEY
    );
  }catch(error){
    renderMessage('<div class="report-alert">Supabase could not start: '+esc(error?.message||error)+'</div>');
    return;
  }

  let sessionResult;
  try{
    sessionResult=await Promise.race([
      client.auth.getSession(),
      new Promise((_,reject)=>setTimeout(
        ()=>reject(new Error('Supabase authentication is taking too long to respond. Please refresh the page and try again.')),
        10000
      ))
    ]);
  }catch(error){
    renderMessage(
      '<div class="report-alert"><strong>Could not check your sign-in session.</strong><br>'+
      esc(error?.message||error)+
      '</div><p class="report-note">If this continues, make sure the invitation link is opened in a normal browser window and that your browser allows site storage.</p>'
    );
    return;
  }

  const session=sessionResult?.data?.session||null;

  if(session){
    renderMessage(
      '<h2 style="margin-top:0">Accept team invitation</h2>'+
      '<p class="report-note">Signed in as <strong>'+esc(session.user.email||'')+
      '</strong>. Complete your profile to join the business.</p>'+
      '<form id="acceptForm" class="form-grid">'+
      '<div class="field"><label>Full name</label><input name="full_name" maxlength="160" placeholder="Your full name"></div>'+
      '<div class="field"><label>Phone / WhatsApp</label><input name="phone" maxlength="40" placeholder="Optional"></div>'+
      '<div class="field" style="grid-column:1/-1"><button class="btn primary" type="submit">Accept invitation</button></div>'+
      '</form><p id="acceptMessage" class="settings-hint"></p>'
    );

    document.getElementById('acceptForm').addEventListener('submit',async e=>{
      e.preventDefault();
      const f=e.currentTarget;
      const b=f.querySelector('button');
      const msg=document.getElementById('acceptMessage');
      const v=Object.fromEntries(new FormData(f).entries());
      b.disabled=true;
      msg.textContent='Accepting invitation…';

      const {error}=await client.rpc('accept_business_invitation',{
        p_token:token,
        p_full_name:v.full_name,
        p_phone:v.phone
      });

      b.disabled=false;

      if(error){
        msg.textContent='Could not accept invitation: '+error.message;
        return;
      }

      msg.textContent='Invitation accepted. Redirecting…';
      try{
        sessionStorage.removeItem('kasitu_invite_token');
        localStorage.removeItem('kasitu_invite_token');
      }catch(_){}
      setTimeout(()=>location.replace('index.html'),700);
    });

    return;
  }

  renderMessage(
    '<h2 style="margin-top:0">Join the KASITU team</h2>'+
    '<p class="report-note">Create your Business Manager account using the invited email address.</p>'+
    '<form id="signupForm" class="form-grid">'+
    '<div class="field"><label>Full name</label><input name="full_name" maxlength="160" required></div>'+
    '<div class="field"><label>Phone / WhatsApp</label><input name="phone" maxlength="40"></div>'+
    '<div class="field" style="grid-column:1/-1"><label>Email</label><input name="email" type="email" required></div>'+
    '<div class="field"><label>Password</label><input name="password" type="password" minlength="8" required></div>'+
    '<div class="field"><label>Confirm password</label><input name="confirm" type="password" minlength="8" required></div>'+
    '<div class="field" style="grid-column:1/-1"><button class="btn primary" type="submit">Create account & continue</button></div>'+
    '</form><p id="signupMessage" class="settings-hint"></p>'
  );

  document.getElementById('signupForm').addEventListener('submit',async e=>{
    e.preventDefault();
    const f=e.currentTarget;
    const b=f.querySelector('button');
    const msg=document.getElementById('signupMessage');
    const v=Object.fromEntries(new FormData(f).entries());

    if(v.password!==v.confirm){
      msg.textContent='Passwords do not match.';
      return;
    }

    b.disabled=true;
    msg.textContent='Creating account…';

    const emailRedirectTo=new URL('accept-invite.html',window.location.href);
    emailRedirectTo.searchParams.set('token',token);

    const {data,error}=await client.auth.signUp({
      email:v.email,
      password:v.password,
      options:{
        data:{full_name:v.full_name},
        emailRedirectTo:emailRedirectTo.toString()
      }
    });

    if(error){
      b.disabled=false;
      msg.textContent=error.message;
      return;
    }

    if(!data.session){
      b.disabled=false;
      msg.textContent='Account created. Confirm your email, then return to this invitation link to finish joining the team.';
      return;
    }

    const {error:acceptError}=await client.rpc('accept_business_invitation',{
      p_token:token,
      p_full_name:v.full_name,
      p_phone:v.phone
    });

    b.disabled=false;

    if(acceptError){
      msg.textContent='Account created, but invitation could not be accepted: '+acceptError.message;
      return;
    }

    msg.textContent='Invitation accepted. Redirecting…';
    setTimeout(()=>location.replace('index.html'),700);
  });
}

window.addEventListener('DOMContentLoaded',()=>{
  init().catch(error=>{
    renderMessage('<div class="report-alert">Invitation page error: '+esc(error?.message||error)+'</div>');
  });
});
})();