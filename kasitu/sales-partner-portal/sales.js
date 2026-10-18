(() => {
  const $ = (id) => document.getElementById(id);
  const say = (id, message) => { $(id).textContent = message || ''; };
  if (!window.supabase || !window.KASITU_SUPABASE_URL || !window.KASITU_SUPABASE_PUBLISHABLE_KEY) {
    say('loginMessage', 'Portal configuration did not load. Please refresh or contact KASITU management.'); return;
  }
  const db = window.supabase.createClient(window.KASITU_SUPABASE_URL, window.KASITU_SUPABASE_PUBLISHABLE_KEY);
  let profile = null, leads = [], currentUserId = null;
  const money = (n) => new Intl.NumberFormat('en-ZA',{style:'currency',currency:'ZAR'}).format(Number(n||0));
  const esc = (s) => String(s ?? '').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  async function loadProfile(user) {
    const {data,error}=await db.from('sales_partners').select('full_name,status,commission_rate').eq('user_id',user.id).maybeSingle();
    if(error) throw error;
    if(!data || data.status!=='active') throw new Error('This account is not an active sales partner. Please contact KASITU management.');
    profile=data; $('partnerName').textContent=data.full_name||user.email||'Sales Partner';
  }
  async function loadLeads() {
    if (!currentUserId) throw new Error('Please sign in again to view your leads.');
    $('leadList').innerHTML='<p class="muted">Refreshing leads…</p>';
    const {data,error}=await db.from('sales_partner_leads').select('id,business_name,contact_name,service_requested,status,service_price,commission_amount,commission_status,manager_notes,updated_at,created_at').eq('salesperson_id', currentUserId).order('created_at',{ascending:false});
    if(error) throw error;
    leads=data||[];
    $('totalLeads').textContent=leads.length;
    $('wonLeads').textContent=leads.filter(l=>l.status==='Won').length;
    $('commissionTotal').textContent=money(leads.filter(l=>l.status==='Won').reduce((s,l)=>s+Number(l.commission_amount||0),0));
    $('leadList').innerHTML=leads.length?leads.map(l=>{const outcome=l.status==='Won'?'<div class="manager-update success"><strong>Purchase confirmed by management</strong><p>'+(l.commission_amount==null?'Your commission will appear after management records the purchased service price.':money(l.commission_amount)+' estimated commission at 14%. Payment status: '+esc(l.commission_status)+'.')+'</p></div>':l.status==='Lost'?'<div class="manager-update lost"><strong>Management update: purchase did not proceed</strong><p>This enquiry is marked as not purchased. No commission is due for this lead.'+(l.manager_notes?' Management note: '+esc(l.manager_notes):'')+'</p></div>':l.manager_notes?'<div class="manager-update"><strong>Message from KASITU management</strong><p>'+esc(l.manager_notes)+'</p></div>':'';const priceLine=l.service_price==null?'Commission pending service price':money(l.commission_amount)+' estimated commission';return '<article class="lead-card"><div class="lead-card-head"><strong>'+esc(l.business_name)+'</strong><span class="badge '+(l.status==='Won'?'won':'')+'">'+esc(l.status)+'</span></div><p>'+esc(l.contact_name)+' · '+esc(l.service_requested)+'<br>Submitted '+esc(new Date(l.created_at).toLocaleDateString('en-ZA'))+'</p>'+outcome+'<div class="lead-card-head"><span class="commission">'+priceLine+'</span><span class="badge '+(l.commission_status==='Paid'?'paid':'')+'">'+esc(l.commission_status)+'</span></div></article>'}).join(''):'<div class="empty">No leads submitted yet. Use the form to send your first client enquiry.</div>';
  }
  async function showPortal(user) {
    currentUserId = user.id;
    await loadProfile(user);
    $('loginPanel').hidden=true; $('portal').hidden=false; $('signOut').hidden=false;
    await loadLeads();
  }
  $('loginForm').addEventListener('submit',async e=>{
    e.preventDefault(); const btn=e.submitter; if(btn)btn.disabled=true; say('loginMessage','Signing in securely…');
    try { const {error}=await db.auth.signInWithPassword({email:$('email').value.trim(),password:$('password').value}); if(error)throw error; const {data}=await db.auth.getUser(); await showPortal(data.user); say('loginMessage',''); }
    catch(err){await db.auth.signOut();say('loginMessage',err.message||'Could not sign in.');if(btn)btn.disabled=false;}
  });
  $('leadForm').addEventListener('submit',async e=>{
    e.preventDefault(); const form=e.currentTarget; const btn=$('submitLead'); btn.disabled=true; say('leadMessage','Sending lead securely to management…');
    const f=new FormData(form);
    try{
      const {data,error}=await db.rpc('submit_sales_partner_lead',{p_business_name:f.get('business_name'),p_contact_name:f.get('contact_name'),p_phone:f.get('phone'),p_email:f.get('email')||'',p_service_requested:f.get('service_requested'),p_notes:f.get('notes')||''});
      if(error)throw error;
      form.reset(); say('leadMessage','Lead sent successfully to KASITU management. Reference: '+String(data).slice(0,8).toUpperCase());
      await loadLeads();
    }catch(err){say('leadMessage',err.message||'Lead could not be sent. Please try again.');}
    finally{btn.disabled=false;}
  });
  $('refresh').addEventListener('click',()=>loadLeads().catch(e=>say('leadMessage',e.message)));
  $('signOut').addEventListener('click',async()=>{await db.auth.signOut();location.reload();});
  db.auth.onAuthStateChange((event,session)=>{if(event==='SIGNED_OUT'){profile=null;leads=[];currentUserId=null;$('portal').hidden=true;$('loginPanel').hidden=false;$('signOut').hidden=true;}});
  db.auth.getSession().then(async({data,error})=>{if(error)throw error;if(data.session){try{await showPortal(data.session.user);}catch(e){say('loginMessage',e.message);await db.auth.signOut();}}}).catch(e=>say('loginMessage',e.message));
})();