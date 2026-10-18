/* KASITU Webs — owner-only Sales Commissions register */
async function renderSalesCommissions(){
  title.textContent='Sales Commissions';
  if(currentRole!=='owner'){
    content.innerHTML='<div class="panel"><h2>Access restricted</h2><p>Only the business owner can approve or record commission payments.</p></div>';
    return;
  }
  content.innerHTML='<div class="panel"><p>Loading commission records…</p></div>';
  const [leadResult,partnerResult]=await Promise.all([
    window.kasituSupabase.from('sales_partner_leads').select('id,salesperson_id,business_name,contact_name,service_requested,status,service_price,commission_rate,commission_amount,commission_status,manager_notes,created_at,commission_approved_at,commission_paid_at,commission_payment_reference,commission_payment_method').order('created_at',{ascending:false}),
    window.kasituSupabase.from('sales_partners').select('user_id,full_name,email')
  ]);
  if(leadResult.error||partnerResult.error){
    const err=leadResult.error||partnerResult.error;
    content.innerHTML='<div class="panel"><h2>Could not load commissions</h2><p>'+esc(err.message)+'</p><p>Check the Supabase table permissions and owner RLS policies.</p></div>';
    return;
  }
  const partners=new Map((partnerResult.data||[]).map(p=>[p.user_id,p]));
  const rows=leadResult.data||[];
  const totals={Pending:0,Approved:0,Paid:0};
  rows.forEach(r=>{if(Object.hasOwn(totals,r.commission_status))totals[r.commission_status]+=Number(r.commission_amount||0)});
  content.innerHTML='<div class="section-head"><div><h2>Sales Commissions</h2><p>Review eligible sales, approve commissions, and record payment only after it has been made.</p></div><button class="btn" id="refreshSalesCommissions" type="button">Refresh</button></div>'+
    '<div class="stats"><div class="stat"><div class="stat-label">Awaiting approval</div><div class="stat-value">'+money(totals.Pending)+'</div><div class="stat-note">Pending commissions</div></div><div class="stat"><div class="stat-label">Approved, unpaid</div><div class="stat-value">'+money(totals.Approved)+'</div><div class="stat-note">Ready for payment</div></div><div class="stat"><div class="stat-label">Recorded as paid</div><div class="stat-value">'+money(totals.Paid)+'</div><div class="stat-note">Recorded payments</div></div></div>'+
    '<div class="panel"><div class="panel-head"><div><h3>Commission register</h3><p class="panel-subtitle">Commission is fixed at 14%. Only Won leads with a positive confirmed service price are eligible.</p></div><select id="commissionFilter" class="search" aria-label="Filter commissions"><option value="all">All statuses</option><option>Pending</option><option>Approved</option><option>Paid</option><option>Not eligible</option></select></div>'+
    (rows.length?'<div class="table-wrap"><table class="table"><thead><tr><th>Salesperson</th><th>Client / Service</th><th>Lead status</th><th>Service price</th><th>Commission</th><th>Commission status</th><th>Approval / payment details</th><th>Action</th></tr></thead><tbody id="commissionRows">'+rows.map(r=>commissionRowHtml(r,partners.get(r.salesperson_id))).join('')+'</tbody></table></div>':'<div class="empty">No sales partner leads have been submitted yet.</div>')+'</div>';
  document.getElementById('commissionFilter').addEventListener('change',e=>{
    const f=e.target.value,filtered=f==='all'?rows:rows.filter(r=>r.commission_status===f),tbody=document.getElementById('commissionRows');
    if(tbody)tbody.innerHTML=filtered.map(r=>commissionRowHtml(r,partners.get(r.salesperson_id))).join('');
  });
  document.getElementById('refreshSalesCommissions').addEventListener('click',renderSalesCommissions);
}
function commissionRowHtml(r,partner){
  const eligible=r.status==='Won'&&Number(r.service_price)>0&&Number(r.commission_amount)>0;
  const action=r.commission_status==='Pending'&&eligible?'<button class="btn primary" data-approve-commission="'+esc(r.id)+'" type="button">Approve</button>':r.commission_status==='Approved'&&eligible?'<button class="btn primary" data-pay-commission="'+esc(r.id)+'" type="button">Record payment</button>':'—';
  const details=[];
  if(r.commission_approved_at)details.push('Approved '+new Date(r.commission_approved_at).toLocaleString('en-ZA'));
  if(r.commission_paid_at)details.push('Paid '+new Date(r.commission_paid_at).toLocaleString('en-ZA'));
  if(r.commission_payment_method)details.push('Method: '+r.commission_payment_method);
  if(r.commission_payment_reference)details.push('Ref: '+r.commission_payment_reference);
  return '<tr><td><strong>'+esc(partner?.full_name||partner?.email||'Salesperson')+'</strong><br><small>'+esc(partner?.email||'')+'</small></td><td><strong>'+esc(r.business_name)+'</strong><br><small>'+esc(r.service_requested)+'</small></td><td>'+esc(r.status)+'</td><td>'+money(r.service_price||0)+'</td><td><strong>'+money(r.commission_amount||0)+'</strong><br><small>'+esc(r.commission_rate||14)+'%</small></td><td><span class="badge">'+esc(r.commission_status)+'</span></td><td><small>'+esc(details.join(' · ')||r.manager_notes||'No approval or payment recorded')+'</small></td><td>'+action+'</td></tr>';
}
document.addEventListener('click',async e=>{
  const approve=e.target.closest('[data-approve-commission]')?.dataset.approveCommission;
  const pay=e.target.closest('[data-pay-commission]')?.dataset.payCommission;
  if(!approve&&!pay)return;
  if(currentRole!=='owner'){alert('Only the business owner can manage commission approval and payment.');return;}
  const id=approve||pay;
  const {data:lead,error:readError}=await window.kasituSupabase.from('sales_partner_leads').select('id,status,service_price,commission_amount,commission_status').eq('id',id).maybeSingle();
  if(readError||!lead){alert(readError?.message||'Commission record not found. Refresh and try again.');return;}
  const {data:userData,error:userError}=await window.kasituSupabase.auth.getUser();
  if(userError||!userData?.user){alert('Could not verify your signed-in account. Please sign in again.');return;}
  if(approve){
    if(lead.commission_status!=='Pending'||lead.status!=='Won'||Number(lead.service_price)<=0||Number(lead.commission_amount)<=0){alert('Only pending commissions for Won leads with a confirmed positive service price can be approved.');return;}
    if(!confirm('Approve this commission of '+money(lead.commission_amount)+'?'))return;
    const {error}=await window.kasituSupabase.from('sales_partner_leads').update({commission_status:'Approved',commission_approved_at:new Date().toISOString(),commission_approved_by:userData.user.id,updated_at:new Date().toISOString()}).eq('id',id).eq('commission_status','Pending');
    if(error){alert('Approval failed: '+error.message);return;}
    if(typeof logAudit==='function')await logAudit('approved','sales_partner_commission',id,'Sales partner commission',{amount:lead.commission_amount});
    alert('Commission approved. Record payment only after the salesperson has actually been paid.');
  }else{
    if(lead.commission_status!=='Approved'){alert('Only approved commissions can be marked paid.');return;}
    const reference=prompt('Enter the payment reference (optional):','');
    if(reference===null)return;
    const method=prompt('Enter the payment method (for example EFT):','EFT');
    if(method===null)return;
    if(!method.trim()){alert('Enter a payment method.');return;}
    if(!confirm('Confirm that '+money(lead.commission_amount)+' has actually been paid to the salesperson?'))return;
    const {error}=await window.kasituSupabase.from('sales_partner_leads').update({commission_status:'Paid',commission_paid_at:new Date().toISOString(),commission_paid_by:userData.user.id,commission_payment_reference:reference.trim()||null,commission_payment_method:method.trim(),updated_at:new Date().toISOString()}).eq('id',id).eq('commission_status','Approved');
    if(error){alert('Payment recording failed: '+error.message);return;}
    if(typeof logAudit==='function')await logAudit('paid','sales_partner_commission',id,'Sales partner commission',{amount:lead.commission_amount,reference:reference.trim(),method:method.trim()});
    alert('Payment recorded.');
  }
  await renderSalesCommissions();
});
