/* KASITU Webs Business Manager — authenticated Phase 1 */
const STORAGE = { clients: 'kasitu_manager_clients_v1', leads: 'kasitu_manager_leads_v1' };
const seedClients = [
  { id:'KAS-2026-001', business:'Mumsy Braids Studio', contact:'', email:'', phone:'', status:'Active', service:'Website / Booking System', notes:'Existing KASITU project.' },
  { id:'KAS-2026-002', business:'Thutis Project', contact:'', email:'', phone:'', status:'Active', service:'Business Website', notes:'Existing KASITU project.' }
];

const content = document.getElementById('appContent');
const title = document.getElementById('pageTitle');
const sidebar = document.getElementById('sidebar');
const modal = document.getElementById('modalBackdrop');
const modalTitle = document.getElementById('modalTitle');
const form = document.getElementById('recordForm');

let clients = [];
let leads = [];

const esc = value => String(value ?? '').replace(/[&<>'"]/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#039;','"':'&quot;'}[c]));
function money(n){return `R${Number(n||0).toLocaleString('en-ZA',{minimumFractionDigits:2})}`;}

async function getSession(){
  const {data,error}=await window.kasituSupabase.auth.getSession();
  if(error || !data.session){ window.location.replace('login.html'); return null; }
  return data.session;
}
async function loadData(){
  const session=await getSession(); if(!session) return false;
  const [cr,lr]=await Promise.all([
    window.kasituSupabase.from('clients').select('*').order('created_at',{ascending:true}),
    window.kasituSupabase.from('leads').select('*').order('created_at',{ascending:false})
  ]);
  if(cr.error || lr.error){
    console.error(cr.error||lr.error);
    content.innerHTML='<div class="panel"><h2>Database setup required</h2><p>The login works, but the Clients/Leads tables are not ready yet. Run <strong>supabase-schema.sql</strong> in Supabase SQL Editor, then refresh.</p></div>';
    return false;
  }
  clients=cr.data.map(c=>({id:c.client_code,business:c.business_name,contact:c.contact_name,email:c.email,phone:c.phone,service:c.service,status:c.status,notes:c.notes,_id:c.id}));
  leads=lr.data.map(l=>({id:l.id,business:l.business_name,contact:l.contact_name,phone:l.phone,email:l.email,service:l.service_requested,status:l.status,followUp:l.follow_up_date||'',source:l.source||'',notes:l.notes||'',date:l.created_at?.slice(0,10)||''}));
  return true;
}

function renderDashboard(){
  title.textContent='Dashboard';
  const active=clients.filter(c=>c.status==='Active').length;
  const openLeads=leads.filter(l=>!['Won','Lost'].includes(l.status)).length;
  content.innerHTML=`
    <div class="hero-copy"><h2>Good morning, KASITU.</h2><p>Your business command centre starts here. Phase 1 is focused on Clients and Leads.</p></div>
    <div class="stats">
      <div class="stat"><div class="stat-label">Clients</div><div class="stat-value">${clients.length}</div><div class="stat-note">${active} active</div></div>
      <div class="stat"><div class="stat-label">Open Leads</div><div class="stat-value">${openLeads}</div><div class="stat-note">Follow-ups to manage</div></div>
      <div class="stat"><div class="stat-label">Quotations</div><div class="stat-value">—</div><div class="stat-note">Phase 2</div></div>
      <div class="stat"><div class="stat-label">Outstanding</div><div class="stat-value">—</div><div class="stat-note">Payments arrive in Phase 3</div></div>
    </div>
    <div class="grid-2">
      <div class="panel"><div class="panel-head"><h3>Recent Clients</h3><button class="btn" data-go="clients">View all</button></div>${clientTable(clients.slice(-5).reverse())}</div>
      <div class="panel"><div class="panel-head"><h3>Lead Pipeline</h3><button class="btn" data-go="leads">View all</button></div>${leadSummary()}</div>
    </div>`;
  bindNavigationButtons();
}
function clientTable(rows){
  if(!rows.length)return '<div class="empty">No clients yet.</div>';
  return `<div class="table-wrap"><table class="table"><thead><tr><th>Client</th><th>Service</th><th>Status</th></tr></thead><tbody>${rows.map(c=>`<tr><td><strong>${esc(c.business)}</strong><br><span style="color:var(--muted)">${esc(c.id)}</span></td><td>${esc(c.service||'—')}</td><td><span class="badge">${esc(c.status)}</span></td></tr>`).join('')}</tbody></table></div>`;
}
function leadSummary(){
  if(!leads.length)return '<div class="empty">No leads yet.<br><br><button class="btn primary" data-add="lead">Add your first lead</button></div>';
  const counts={New:0,Contacted:0,Quoted:0,Won:0,Lost:0}; leads.forEach(l=>counts[l.status]=(counts[l.status]||0)+1);
  return Object.entries(counts).map(([k,v])=>`<div style="display:flex;justify-content:space-between;padding:12px 0;border-bottom:1px solid var(--border);font-size:12px"><span>${k}</span><strong>${v}</strong></div>`).join('');
}
function renderClients(filter=''){
  title.textContent='Clients';
  const rows=clients.filter(c=>`${c.business} ${c.contact} ${c.email} ${c.id}`.toLowerCase().includes(filter.toLowerCase()));
  content.innerHTML=`<div class="section-head"><div><h2>Clients</h2><p>Your central client register and client IDs.</p></div><div style="display:flex;gap:9px"><input id="clientSearch" class="search" placeholder="Search clients..." value="${esc(filter)}"><button class="btn primary" data-add="client">+ Add Client</button></div></div><div class="panel">${clientTableDetailed(rows)}</div>`;
  document.getElementById('clientSearch').addEventListener('input',e=>renderClients(e.target.value));
}
function clientTableDetailed(rows){
  if(!rows.length)return '<div class="empty">No matching clients.</div>';
  return `<div class="table-wrap"><table class="table"><thead><tr><th>Client ID</th><th>Business</th><th>Contact</th><th>Service</th><th>Status</th><th></th></tr></thead><tbody>${rows.map(c=>`<tr><td>${esc(c.id)}</td><td><strong>${esc(c.business)}</strong></td><td>${esc(c.contact||'—')}<br><span style="color:var(--muted)">${esc(c.phone||c.email||'')}</span></td><td>${esc(c.service||'—')}</td><td><span class="badge">${esc(c.status)}</span></td><td><button class="btn" data-edit-client="${esc(c.id)}">Edit</button></td></tr>`).join('')}</tbody></table></div>`;
}
function renderLeads(filter=''){
  title.textContent='Leads';
  const rows=leads.filter(l=>`${l.business} ${l.contact} ${l.service} ${l.status}`.toLowerCase().includes(filter.toLowerCase()));
  content.innerHTML=`<div class="section-head"><div><h2>Lead Pipeline</h2><p>Track enquiries from first contact to won or lost.</p></div><div style="display:flex;gap:9px"><input id="leadSearch" class="search" placeholder="Search leads..." value="${esc(filter)}"><button class="btn primary" data-add="lead">+ Add Lead</button></div></div><div class="panel">${leadTable(rows)}</div>`;
  document.getElementById('leadSearch').addEventListener('input',e=>renderLeads(e.target.value));
}
function leadTable(rows){
  if(!rows.length)return '<div class="empty">No leads yet. Add every genuine enquiry here so no opportunity gets forgotten.</div>';
  return `<div class="table-wrap"><table class="table"><thead><tr><th>Date</th><th>Business / Person</th><th>Service</th><th>Status</th><th>Follow-up</th><th></th></tr></thead><tbody>${rows.map(l=>`<tr><td>${esc(l.date||'—')}</td><td><strong>${esc(l.business)}</strong><br><span style="color:var(--muted)">${esc(l.contact||'')}</span></td><td>${esc(l.service||'—')}</td><td><span class="badge">${esc(l.status)}</span></td><td>${esc(l.followUp||'—')}</td><td><button class="btn" data-edit-lead="${esc(l.id)}">Edit</button></td></tr>`).join('')}</tbody></table></div>`;
}
function openModal(type,existing=null){
  modal.hidden=false;document.body.style.overflow='hidden';modalTitle.textContent=existing?`Edit ${type}`:`Add ${type}`;
  form.innerHTML=type==='Client'?clientForm(existing):leadForm(existing);form.querySelector('input')?.focus();
  form.onsubmit=e=>{e.preventDefault();type==='Client'?saveClient(existing):saveLead(existing);};
}
function clientForm(c={}){return `<div class="form-grid">
<div class="field"><label>Business / Client name *</label><input name="business" required value="${esc(c.business)}"></div>
<div class="field"><label>Contact person</label><input name="contact" value="${esc(c.contact)}"></div>
<div class="field"><label>Email</label><input type="email" name="email" value="${esc(c.email)}"></div>
<div class="field"><label>Phone / WhatsApp</label><input name="phone" value="${esc(c.phone)}"></div>
<div class="field"><label>Service</label><input name="service" value="${esc(c.service)}" placeholder="e.g. Business Website"></div>
<div class="field"><label>Status</label><select name="status">${['Active','Prospect','Inactive'].map(x=>`<option ${x===(c.status||'Active')?'selected':''}>${x}</option>`).join('')}</select></div>
<div class="field" style="grid-column:1/-1"><label>Notes</label><textarea name="notes">${esc(c.notes)}</textarea></div>
</div><div class="form-actions"><button type="button" class="btn" id="cancelModal">Cancel</button><button class="btn primary">Save Client</button></div>`;}
function leadForm(l={}){return `<div class="form-grid">
<div class="field"><label>Business / Person *</label><input name="business" required value="${esc(l.business)}"></div>
<div class="field"><label>Contact person</label><input name="contact" value="${esc(l.contact)}"></div>
<div class="field"><label>Phone / WhatsApp</label><input name="phone" value="${esc(l.phone)}"></div>
<div class="field"><label>Email</label><input type="email" name="email" value="${esc(l.email)}"></div>
<div class="field"><label>Service requested</label><input name="service" value="${esc(l.service)}"></div>
<div class="field"><label>Status</label><select name="status">${['New','Contacted','Quoted','Won','Lost'].map(x=>`<option ${x===(l.status||'New')?'selected':''}>${x}</option>`).join('')}</select></div>
<div class="field"><label>Follow-up date</label><input type="date" name="followUp" value="${esc(l.followUp)}"></div>
<div class="field"><label>Source</label><input name="source" value="${esc(l.source)}" placeholder="WhatsApp, website, referral..."></div>
<div class="field" style="grid-column:1/-1"><label>Notes</label><textarea name="notes">${esc(l.notes)}</textarea></div>
</div><div class="form-actions"><button type="button" class="btn" id="cancelModal">Cancel</button><button class="btn primary">Save Lead</button></div>`;}
function values(){return Object.fromEntries(new FormData(form).entries());}
async function saveClient(existing){
  const v=values(),session=await getSession();if(!session)return;
  const payload={owner_id:session.user.id,client_code:existing?.id||nextClientId(),business_name:v.business,contact_name:v.contact||null,email:v.email||null,phone:v.phone||null,service:v.service||null,status:v.status,notes:v.notes||null};
  const result=existing
    ? await window.kasituSupabase.from('clients').update(payload).eq('id',existing._id)
    : await window.kasituSupabase.from('clients').insert(payload);
  if(result.error){alert(result.error.message);return;}
  await loadData();closeModal();renderClients();
}
async function saveLead(existing){
  const v=values(),session=await getSession();if(!session)return;
  const payload={owner_id:session.user.id,business_name:v.business,contact_name:v.contact||null,phone:v.phone||null,email:v.email||null,service_requested:v.service||null,status:v.status,follow_up_date:v.followUp||null,source:v.source||null,notes:v.notes||null};
  const result=existing
    ? await window.kasituSupabase.from('leads').update(payload).eq('id',existing.id)
    : await window.kasituSupabase.from('leads').insert(payload);
  if(result.error){alert(result.error.message);return;}
  await loadData();closeModal();renderLeads();
}
function nextClientId(){
  const year=new Date().getFullYear();
  const nums=clients.map(c=>Number(String(c.id).split('-').pop())).filter(Number.isFinite);
  return `KAS-${year}-${String(Math.max(0,...nums)+1).padStart(3,'0')}`;
}
function closeModal(){modal.hidden=true;document.body.style.overflow='';}
function bindNavigation(){
  document.querySelectorAll('.nav-item[data-view]').forEach(btn=>btn.addEventListener('click',()=>{sidebar.classList.remove('open');render(btn.dataset.view);document.querySelectorAll('.nav-item').forEach(x=>x.classList.remove('active'));btn.classList.add('active');}));
  document.getElementById('mobileMenu').addEventListener('click',()=>sidebar.classList.toggle('open'));
  document.getElementById('modalClose').addEventListener('click',closeModal);
  modal.addEventListener('click',e=>{if(e.target===modal)closeModal();});
  document.getElementById('signOutButton').addEventListener('click',async()=>{await window.kasituSupabase.auth.signOut();window.location.replace('login.html');});
}
function bindNavigationButtons(){
  document.querySelectorAll('[data-go]').forEach(b=>b.addEventListener('click',()=>document.querySelector(`[data-view="${b.dataset.go}"]`)?.click());
  document.querySelectorAll('[data-add="client"]').forEach(b=>b.addEventListener('click',()=>openModal('Client')));
  document.querySelectorAll('[data-add="lead"]').forEach(b=>b.addEventListener('click',()=>openModal('Lead')));
}
function render(view){if(view==='clients')renderClients();else if(view==='leads')renderLeads();else renderDashboard();bindNavigationButtons();}
document.addEventListener('click',e=>{
  const cid=e.target.closest('[data-edit-client]')?.dataset.editClient;if(cid){openModal('Client',clients.find(c=>c.id===cid));return;}
  const lid=e.target.closest('[data-edit-lead]')?.dataset.editLead;if(lid){openModal('Lead',leads.find(l=>l.id===lid));return;}
  if(e.target.id==='cancelModal')closeModal();
});
(async()=>{
  if(!window.supabase||!window.KASITU_SUPABASE_URL||!window.KASITU_SUPABASE_PUBLISHABLE_KEY){
    content.innerHTML='<div class="panel"><h2>Configuration missing</h2><p>Supabase configuration is missing.</p></div>';return;
  }
  window.kasituSupabase=window.supabase.createClient(window.KASITU_SUPABASE_URL,window.KASITU_SUPABASE_PUBLISHABLE_KEY);
  const ok=await loadData();if(!ok)return;
  bindNavigation();renderDashboard();
})();
