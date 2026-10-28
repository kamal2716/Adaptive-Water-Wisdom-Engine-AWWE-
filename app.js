(() => {
  const $=(q,r=document)=>r.querySelector(q), $$=(q,r=document)=>[...r.querySelectorAll(q)];
  const tanks=[
   {id:"TN_MDU_E001",name:"Madakulam Eri",pin:"625003",capacity:2.17,storage:1.29,silt:32.8},
   {id:"TN_MDU_E002",name:"Vandiyur Kanmai",pin:"625020",capacity:2.53,storage:1.49,silt:26.4},
   {id:"TN_MDU_E003",name:"Sellur Tank",pin:"625002",capacity:5.24,storage:2.69,silt:27.7},
   {id:"TN_MDU_E004",name:"Thenur Periya Kanmai",pin:"625402",capacity:5.51,storage:2.06,silt:19.2},
   {id:"TN_MDU_E005",name:"Koodal Nagar Tank",pin:"625018",capacity:6.83,storage:3.49,silt:31.6},
   {id:"TN_MDU_E006",name:"Avaniapuram Tank",pin:"625012",capacity:5.72,storage:2.82,silt:46.5},
   {id:"TN_MDU_E007",name:"Thiruparankundram Eri",pin:"625005",capacity:4.61,storage:2.14,silt:10.6},
   {id:"TN_MDU_E008",name:"Thirupuvanam Kanmai",pin:"625402",capacity:11.12,storage:6.14,silt:34.7},
   {id:"TN_MDU_E009",name:"Samayanallur Tank",pin:"625402",capacity:7.72,storage:3.88,silt:27.9},
   {id:"TN_MDU_E010",name:"Kochadai Kanmai",pin:"625016",capacity:6.76,storage:4.01,silt:14.1},
   {id:"TN_MDU_E011",name:"Anaiyur Eri",pin:"625017",capacity:4.69,storage:2.42,silt:12.9},
   {id:"TN_MDU_E012",name:"Paravai Kanmai",pin:"625402",capacity:12.33,storage:7.8,silt:30.5}
  ];
  const channels=[
   {from:"Madakulam Eri",to:"Vandiyur Kanmai",designed:8.34,effective:5.5,encroach:10.1,silt:"Severe",priority:42},
   {from:"Vandiyur Kanmai",to:"Sellur Tank",designed:28.3,effective:15.33,encroach:39.6,silt:"Severe",priority:49.3},
   {from:"Sellur Tank",to:"Thenur Periya Kanmai",designed:16.78,effective:10.32,encroach:21.3,silt:"Severe",priority:29.5},
   {from:"Thenur Periya Kanmai",to:"Koodal Nagar Tank",designed:32.33,effective:28.01,encroach:33.4,silt:"Low",priority:35},
   {from:"Koodal Nagar Tank",to:"Avaniapuram Tank",designed:17.03,effective:10.82,encroach:53.7,silt:"Moderate",priority:33.9}
  ];
  const roles={
   household:{label:"LOCAL CONSUMERS / HOUSEHOLD",title:"Household water outlook",description:"Local water context and practical conservation guidance.",location:true},
   farmer:{label:"FIELD & FARM / AGRICULTURE",title:"Your field water outlook",description:"Understand the risk, then decide what to do today.",location:true},
   authority:{label:"PLANNING / AUTHORITY WORKSPACE",title:"Madurai water intelligence",description:"Review tank and channel conditions, potential risks and decision options.",location:false}
  };
  const state={role:"household",panel:"overview",pin:"625003",tank:tanks[0],chart:null,reports:[],reportFilter:"all",nextReportId:1};
  const esc=v=>String(v).replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
  const pct=t=>Math.round(100*t.storage/t.capacity);
  const level=t=>pct(t)<30?"Low":pct(t)<58?"Moderate":"Available";
  const tone=t=>pct(t)<30?"critical":pct(t)<58?"warn":"";
  const metric=(title,value,note,chip="",cls="")=>'<article class="metric-card"><div class="metric-label">'+title+'</div><div class="metric-value">'+value+'</div>'+(chip?'<span class="metric-chip '+cls+'">'+chip+'</span>':'')+'<div class="metric-note">'+note+'</div></article>';
  const card=(title,sub,body)=>'<section class="panel-card"><div class="panel-title"><div><h3>'+title+'</h3>'+(sub?'<p>'+sub+'</p>':'')+'</div></div>'+body+'</section>';
  const tankRow=t=>'<div class="tank-row"><div><strong>'+esc(t.name)+'</strong><small>'+esc(t.id)+' · '+level(t)+'</small><div class="bar-track"><div class="bar-fill '+tone(t)+'" style="width:'+Math.min(100,pct(t))+'%"></div></div></div><div class="tank-value">'+pct(t)+'%<small>capacity</small></div></div>';
  const canvas=id=>'<div class="chart-wrap"><canvas id="'+id+'" aria-label="Illustrative tank storage trend"></canvas></div>';
  const pinBar=()=>{const unique=[...new Map(tanks.map(t=>[t.pin,t])).values()];return '<div class="location-bar" id="location-bar"><label for="postcode">PIN / nearby eri</label><select id="postcode" aria-label="Choose PIN code">'+unique.map(t=>'<option value="'+esc(t.pin)+'" '+(state.pin===t.pin?"selected":"")+'>'+esc(t.pin)+' — '+esc(t.name)+'</option>').join("")+'</select><button id="apply-postcode">Update area</button><span id="postcode-message">Matched to repository tank metadata</span></div>'};
  function household(){
   const t=state.tank;
   const advice='<div class="recommendation"><span class="rec-icon">✓</span><div><strong>Check official supply updates</strong><p>Confirm treatment, distribution timing and interruption notices with your local provider.</p></div></div><div class="recommendation"><span class="rec-icon">≈</span><div><strong>Save water where practical</strong><p>Repair leaks, reuse suitable greywater where permitted and prepare harvesting systems before heavy rain.</p></div></div><div class="recommendation warn"><span class="rec-icon">!</span><div><strong>Water quality is separate</strong><p>Untested water must not be treated as safe to drink. Check approved treatment and testing guidance.</p></div></div>';
   return '<div class="metric-grid">'+metric("NEAREST TANK CONTEXT",esc(t.name),"Repository record · PIN "+t.pin)+metric("STORAGE SNAPSHOT",pct(t)+"%","Illustrative storage relative to listed capacity",level(t),tone(t))+metric("HOUSEHOLD SUPPLY","Unverified","Tank storage does not confirm treated supply or tap availability","Needs supply data","warn")+'</div><div class="panel-grid">'+card("Water context","Illustrative tank storage snapshot",canvas("main-chart"))+card("What to do now","Useful household guidance",advice)+'</div><div class="panel-grid">'+card("Tank records","Reference data, not a live service",'<div class="tank-list">'+tanks.slice(0,5).map(tankRow).join("")+'</div>')+card("Flood & drought readiness","Follow verified local information",'<div class="recommendation warn"><span class="rec-icon">☔</span><div><strong>Heavy rain expected?</strong><p>Follow official flood warnings and watch for verified tank release advisories. Stay away from flooded channels.</p></div></div><div class="recommendation"><span class="rec-icon">☼</span><div><strong>During a dry spell</strong><p>Use water-saving practices and seek confirmed local supply schedules.</p></div></div>')+'</div>';
  }
  function farmer(){
   const t=state.tank;
   const advice='<div class="recommendation"><span class="rec-icon">✓</span><div><strong>Check soil moisture first</strong><p>Plan irrigation using field conditions and crop needs, not tank percentage alone.</p></div></div><div class="recommendation warn"><span class="rec-icon">☔</span><div><strong>If heavy rain is forecast</strong><p>Inspect drains, protect equipment and follow official flood guidance. Do not enter flooded channels.</p></div></div><div class="recommendation"><span class="rec-icon">≈</span><div><strong>Plan water-efficient irrigation</strong><p>Prioritize water-sensitive crop stages and avoid unnecessary watering.</p></div></div>';
   const guide='<div class="action-list"><div class="action-check"><span class="metric-chip critical">Flood risk</span><div><strong>Protect the field</strong><small>Check drainage and monitor official warnings.</small></div></div><div class="action-check"><span class="metric-chip warn">Low water</span><div><strong>Conserve irrigation</strong><small>Check soil moisture, crop stage and approved schedule.</small></div></div><div class="action-check"><span class="metric-chip">Normal</span><div><strong>Keep to the plan</strong><small>Follow normal irrigation while avoiding waste.</small></div></div><div class="action-check"><span class="metric-chip warn">Quality</span><div><strong>Confirm permitted use</strong><small>Irrigation suitability does not imply drinking-water safety.</small></div></div></div>';
   return '<div class="metric-grid">'+metric("CONNECTED TANK",esc(t.name),"PIN "+t.pin+" · repository tank metadata")+metric("TANK STORAGE CONTEXT",pct(t)+"%","Illustrative storage/capacity calculation",level(t),tone(t))+metric("CROP WATER RISK","Needs inputs","Crop, soil moisture and forecast are not connected","Not assessed","warn")+'</div><div class="risk-banner"><span class="risk-badge">RISK CHECK</span><div><strong>Check conditions before irrigation.</strong><p>Field risk cannot be verified without a validated forecast, crop stage and local observations.</p></div></div><div class="panel-grid">'+card("Tank storage context","Illustrative repository snapshot",canvas("main-chart"))+card("What should I do today?","Practical precautions",advice)+'</div>'+card("Simple risk guide","Conceptual guidance — not validated thresholds",guide);
  }
  function authority(){
   const capacity=tanks.reduce((s,t)=>s+t.capacity,0),stored=tanks.reduce((s,t)=>s+t.storage,0);
   const markers=tanks.map((t,i)=>'<button class="map-tank" title="'+esc(t.name)+'" data-tank="'+t.id+'" style="left:'+(18+(i*23%70))+'%;top:'+(12+(i*37%65))+'%"><span>'+esc(t.name)+'</span></button>').join("");
   const network=channels.slice().sort((a,b)=>b.priority-a.priority).map(c=>'<div class="tank-row"><div><strong>'+esc(c.from)+' → '+esc(c.to)+'</strong><small>'+esc(c.silt)+' siltation · '+c.encroach+'% encroachment</small><div class="bar-track"><div class="bar-fill '+(c.silt==="Severe"?"critical":"")+'" style="width:'+Math.min(100,c.priority*1.8)+'%"></div></div></div><div class="tank-value">'+c.priority+'<small>priority score</small></div></div>').join("");
   const priorities='<div class="recommendation danger"><span class="rec-icon">!</span><div><strong>Inspect constrained channels</strong><p>Some network records show severe siltation and reduced conveyance. Verify in the field and review downstream risk.</p></div></div><div class="recommendation warn"><span class="rec-icon">≈</span><div><strong>Assess safe retention space</strong><p>Compare inflow with verified storage, structural safety and cascade capacity.</p></div></div><div class="recommendation"><span class="rec-icon">✓</span><div><strong>Keep the human approval step</strong><p>Authorized officials must approve releases and transfers after reviewing safe operating limits.</p></div></div>';
   return '<div class="metric-grid">'+metric("TANK RECORDS",String(tanks.length),"Tank metadata in repository CSV")+metric("RECORDED CAPACITY",capacity.toFixed(1)+" MCM","Sum of listed capacity fields")+metric("STORAGE SNAPSHOT",Math.round(stored/capacity*100)+"%","Illustrative repository values, not live","Not live","warn")+'</div><div class="panel-grid">'+card("Tank cascade overview","Select a marker to inspect a tank record",'<div class="map-panel"><div class="map-art">'+markers+'</div><div class="map-legend"><span><i></i> Repository tank location</span><span>12 tank records</span></div></div>')+card("Restoration signals","Channel metadata in repository",'<div class="tank-list">'+network+'</div>')+'</div><div class="panel-grid">'+card("Storage history context","Illustrative sample, not live readings",canvas("main-chart"))+card("Review priorities","Validate before action",priorities)+'</div>';
  }
  function trends(){
   const notes='<div class="recommendation"><span class="rec-icon">⌁</span><div><strong>Recorded data</strong><p>Timestamped hydrological records can help explain historical rainfall, inflow, level and storage.</p></div></div><div class="recommendation warn"><span class="rec-icon">◷</span><div><strong>Predictions require validation</strong><p>A one-year outlook needs a validated model, forecast horizon, confidence and update timestamp.</p></div></div><div class="recommendation"><span class="rec-icon">✓</span><div><strong>Model evaluation</strong><p>Test predictions on chronological holdout periods before presenting forecast claims.</p></div></div>';
   const controls='<div class="scenario-controls"><div><label for="rain-slider">Rainfall change (%)</label><input id="rain-slider" type="range" min="-50" max="100" value="20"><output id="rain-value">+20%</output></div><div><label for="demand-slider">Demand change (%)</label><input id="demand-slider" type="range" min="-30" max="50" value="0"><output id="demand-value">0%</output></div><div><label for="capacity-slider">Usable capacity (%)</label><input id="capacity-slider" type="range" min="20" max="100" value="75"><output id="capacity-value">75%</output></div></div><div class="scenario-result"><small>Illustrative scenario index · not a forecast</small><strong id="scenario-result">Balanced input</strong><small id="scenario-detail">Adjust assumptions to compare an illustrative score only.</small></div>';
   return '<div class="panel-grid">'+card("Hydrology and storage signals","Illustrative series · not a forecast",canvas("trend-chart"))+card("How to read this view","Separate evidence from forecasts",notes)+'</div>'+card("Scenario explorer","Hypothetical inputs — not an operational recommendation",controls);
  }
  function actions(){
   let list;
   if(state.role==="authority")list=[["Validate data freshness","Check timestamps, units and gaps in tank and rainfall records."],["Verify channel condition","Confirm siltation, encroachment and structural safety on site."],["Review flood pathways","Check downstream exposure and official warning thresholds."],["Compare storage options","Balance retention and release against demand and rules."],["Verify water quality","Review recent tests and intended use."],["Publish approved advice","Share verified schedules, warnings and follow-up status."]];
   else if(state.role==="farmer")list=[["Check soil moisture","Use field observations and crop stage to guide irrigation."],["Review local forecast","Check official rainfall and flood warnings."],["Inspect drainage","Prepare drainage before heavy rain; keep away from flooded channels."],["Confirm usable water","Check approved irrigation schedule and quality restrictions."]];
   else list=[["Check official supply notices","Confirm your provider’s schedule and interruption updates."],["Reduce avoidable use","Fix leaks and use water efficiently."],["Prepare for rain safely","Keep drains clear and follow official flood guidance."],["Check water suitability","Do not drink untested or untreated water."]];
   const checklist='<div class="action-list">'+list.map(a=>'<label class="action-check"><input type="checkbox"><span><strong>'+esc(a[0])+'</strong><small>'+esc(a[1])+'</small></span></label>').join("")+'</div>';
   return '<div class="risk-banner"><span class="risk-badge">ACTION WORKSPACE</span><div><strong>Practical prompts, not official alerts</strong><p>Final advice must use verified local conditions.</p></div></div>'+card("Action checklist","Mark items as you complete them",checklist);
  }
  function reportTable(){
   const visible=state.reports.filter(r=>state.role==="authority"||r.audience===state.role);
   if(!visible.length)return '<div class="empty-state"><span class="empty-icon">✓</span><strong>No reports in this view yet</strong><p>New reports submitted by this audience will appear here.</p></div>';
   return '<div class="report-list">'+visible.map(r=>reportCard(r,state.role==="authority")).join("")+'</div>';
  }
  function reportCard(r,authority){
   const status=r.status||"Received";
   return '<article class="report-card"><div class="report-card-head"><div><span class="report-type-pill">'+esc(r.type)+'</span><span class="report-audience">'+(r.audience==="farmer"?"Farmer report":"Household report")+'</span></div><span class="status-pill '+(status==="Resolved"?"resolved":status==="In review"?"in-review":"pending")+'">'+esc(status)+'</span></div><h4>'+esc(r.type)+'</h4><p class="report-detail">'+esc(r.detail)+'</p><div class="report-meta"><span>PIN <strong>'+esc(r.pin)+'</strong></span><span>'+esc(r.date)+'</span></div>'+(authority?'<div class="authority-tools"><label for="status-'+r.id+'">Report status</label><select id="status-'+r.id+'" data-report-status="'+r.id+'"><option value="Received" '+(status==="Received"?"selected":"")+'>Received</option><option value="In review" '+(status==="In review"?"selected":"")+'>In review</option><option value="Resolved" '+(status==="Resolved"?"selected":"")+'>Resolved</option></select><label for="reply-'+r.id+'">Reply to '+(r.audience==="farmer"?"farmer":"household")+'</label><textarea id="reply-'+r.id+'" data-report-reply="'+r.id+'" placeholder="Write a clear update or next step">'+esc(r.reply||"")+'</textarea><div class="authority-actions"><button type="button" class="form-button" data-save-reply="'+r.id+'">Save reply</button><span class="reply-status" id="reply-status-'+r.id+'"></span></div></div>':(r.reply?'<div class="authority-reply"><strong>Reply from water authority</strong><p>'+esc(r.reply)+'</p><small>Updated '+esc(r.replyDate||"")+'</small></div>':''))+'</article>';
  }
  function reports(){
   if(state.role==="authority"){
    const all=state.reports, visible=all.filter(r=>state.reportFilter==="all"||r.audience===state.reportFilter);
    const counts={all:all.length,household:all.filter(r=>r.audience==="household").length,farmer:all.filter(r=>r.audience==="farmer").length};
    const toolbar='<div class="report-toolbar"><div><strong>Community inbox</strong><p>Review, reply and track reports from households and farmers.</p></div><label for="report-filter">Filter inbox<select id="report-filter"><option value="all" '+(state.reportFilter==="all"?"selected":"")+'>All reports ('+counts.all+')</option><option value="household" '+(state.reportFilter==="household"?"selected":"")+'>Households ('+counts.household+')</option><option value="farmer" '+(state.reportFilter==="farmer"?"selected":"")+'>Farmers ('+counts.farmer+')</option></select></label></div>';
    const workflow='<div class="recommendation"><span class="rec-icon">↗</span><div><strong>1. Receive</strong><p>Each report keeps its audience, PIN, category and date.</p></div></div><div class="recommendation warn"><span class="rec-icon">✓</span><div><strong>2. Review and reply</strong><p>Set a status and save a response against that report.</p></div></div><div class="recommendation"><span class="rec-icon">↻</span><div><strong>3. Close the loop</strong><p>The reply is shown only to the same audience that submitted it.</p></div></div>';
    return '<div class="metric-grid">'+metric("TOTAL REPORTS",String(counts.all),"Demo submissions in this browser session")+metric("HOUSEHOLD REPORTS",String(counts.household),"Household submissions")+metric("FARMER REPORTS",String(counts.farmer),"Farmer submissions")+'</div>'+card("Report inbox","Review each submission, reply and update its status",toolbar+'<div id="report-inbox-results">'+(visible.length?visible.map(r=>reportCard(r,true)).join(""):'<div class="empty-state"><strong>No reports match this filter</strong><p>New submissions will appear here.</p></div>')+'</div>')+card("Feedback workflow","Receive → review → reply → resolve",workflow);
   }
   const uniquePins=[...new Map(tanks.map(t=>[t.pin,t])).values()];
   const form='<form id="report-form"><div class="input-row"><label for="report-type">Report type</label><select id="report-type" required><option>Water shortage</option><option>Supply interruption</option><option>Channel blockage</option><option>Water quality concern</option><option>Flooding / overflow</option><option>Other observation</option></select></div><div class="input-row"><label for="report-pin">Choose your PIN code / nearby eri</label><select id="report-pin" required>'+uniquePins.map(t=>'<option value="'+esc(t.pin)+'" '+(state.pin===t.pin?"selected":"")+'>'+esc(t.pin)+' — '+esc(t.name)+'</option>').join("")+'</select><small>Choose the tank/locality code closest to you from the repository records.</small></div><div class="input-row"><label for="report-detail">What did you observe?</label><textarea id="report-detail" placeholder="Describe the issue clearly. Avoid sensitive personal details." required></textarea></div><button class="form-button" type="submit">Submit report</button><div class="form-status" id="form-status" aria-live="polite"></div></form>';
   const helper='<div class="recommendation"><span class="rec-icon">↗</span><div><strong>1. Submit your report</strong><p>Choose an eri/PIN code, category and clear details.</p></div></div><div class="recommendation warn"><span class="rec-icon">✓</span><div><strong>2. Authority reviews it</strong><p>Authorized staff set a status and can reply directly.</p></div></div><div class="recommendation"><span class="rec-icon">↻</span><div><strong>3. Read your reply</strong><p>Your own workspace shows your report and any authority response.</p></div></div>';
   return '<div class="report-privacy-note"><span>🔒</span><p><strong>Audience privacy:</strong> '+(state.role==="farmer"?"Farmer reports are visible to the submitting farmer and the water authority only.":"Household reports are visible to the submitting household and the water authority only.")+' The other community group cannot view them.</p></div><div class="field-grid">'+card("Send feedback","Your report is routed to the water authority, not to the other audience",form)+card("What happens next","Submit → authority review → reply",helper)+'</div>'+card("My reports and replies","Only reports from your own audience appear here",reportTable());
  }
  function reportTable(){
   const visible=state.reports.filter(r=>state.role==="authority"||r.audience===state.role);
   if(!visible.length)return '<div class="empty-state"><span class="empty-icon">✓</span><strong>No reports in this view yet</strong><p>New submissions from this audience will appear here.</p></div>';
   return '<div class="report-list">'+visible.map(r=>reportCard(r,state.role==="authority")).join("")+'</div>';
  }
  function reportCard(r,authority){
   const status=r.status||"Received";
   return '<article class="report-card"><div class="report-card-head"><div><span class="report-type-pill">'+esc(r.type)+'</span><span class="report-audience">'+(r.audience==="farmer"?"Farmer report":"Household report")+'</span></div><span class="status-pill '+(status==="Resolved"?"resolved":status==="In review"?"in-review":"pending")+'">'+esc(status)+'</span></div><h4>'+esc(r.type)+'</h4><p class="report-detail">'+esc(r.detail)+'</p><div class="report-meta"><span>PIN <strong>'+esc(r.pin)+'</strong></span><span>'+esc(r.date)+'</span></div>'+(authority?'<div class="authority-tools"><label for="status-'+r.id+'">Report status</label><select id="status-'+r.id+'" data-report-status="'+r.id+'"><option value="Received" '+(status==="Received"?"selected":"")+'>Received</option><option value="In review" '+(status==="In review"?"selected":"")+'>In review</option><option value="Resolved" '+(status==="Resolved"?"selected":"")+'>Resolved</option></select><label for="reply-'+r.id+'">Reply to '+(r.audience==="farmer"?"farmer":"household")+'</label><textarea id="reply-'+r.id+'" data-report-reply="'+r.id+'" placeholder="Write a clear update or next step">'+esc(r.reply||"")+'</textarea><div class="authority-actions"><button type="button" class="form-button" data-save-reply="'+r.id+'">Save reply</button></div></div>':(r.reply?'<div class="authority-reply"><strong>Reply from water authority</strong><p>'+esc(r.reply)+'</p><small>Updated '+esc(r.replyDate||"")+'</small></div>':''))+'</article>';
  }
function renderChart(id,labels,sets){
   if(state.chart){state.chart.destroy();state.chart=null;}
   const el=document.getElementById(id);if(!el||!window.Chart)return;
   state.chart=new Chart(el.getContext("2d"),{type:"line",data:{labels,datasets:sets.map(s=>({label:s.label,data:s.data,borderColor:s.color,backgroundColor:s.color+"20",borderWidth:2,fill:!!s.fill,tension:.35,pointRadius:0,pointHoverRadius:4}))},options:{responsive:true,maintainAspectRatio:false,interaction:{mode:"index",intersect:false},plugins:{legend:{display:true,position:"bottom",labels:{boxWidth:8,boxHeight:8,usePointStyle:true,font:{family:"DM Sans",size:9},color:"#68796a",padding:14}},tooltip:{backgroundColor:"#284b3a",bodyFont:{family:"DM Sans",size:10},padding:10,cornerRadius:8}},scales:{x:{grid:{display:false},ticks:{maxTicksLimit:7,color:"#879285",font:{family:"DM Sans",size:8}},border:{display:false}},y:{grid:{color:"#eff0e7"},ticks:{color:"#879285",font:{family:"DM Sans",size:8}},border:{display:false}}}}});
  }
  function charts(){
   if(state.panel==="overview"){
    if(state.role==="authority")renderChart("main-chart",["Jan","Feb","Mar","Apr","May","Jun","Jul"],[{label:"Illustrative storage (MCM)",data:[1.3,1.6,1.8,2,2.4,2.7,3],color:"#4b8c7e",fill:true},{label:"Sample tank capacity",data:Array(7).fill(state.tank.capacity),color:"#c69b58"}]);
    else renderChart("main-chart",["Jan","Feb","Mar","Apr","May","Jun","Jul"],[{label:"Illustrative storage (MCM)",data:[.63,.7,.68,.77,.82,.9,1].map(v=>+(v*state.tank.storage).toFixed(2)),color:"#4d8b7e",fill:true},{label:"Capacity (MCM)",data:Array(7).fill(state.tank.capacity),color:"#c6a26a"}]);
   }
   if(state.panel==="trends")renderChart("trend-chart",["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"],[{label:"Illustrative rainfall (mm)",data:[12,18,25,38,52,48,66,83,112,145,88,29],color:"#6d9f95",fill:true},{label:"Demand index",data:[72,69,74,78,82,80,77,76,70,66,68,72],color:"#c6a26a"}]);
  }
  function scenario(){
   const rain=Number($("#rain-slider")?.value||0),demand=Number($("#demand-slider")?.value||0),capacity=Number($("#capacity-slider")?.value||75);
   if($("#rain-value"))$("#rain-value").textContent=(rain>0?"+":"")+rain+"%";
   if($("#demand-value"))$("#demand-value").textContent=(demand>0?"+":"")+demand+"%";
   if($("#capacity-value"))$("#capacity-value").textContent=capacity+"%";
   const score=rain*.55-demand*.8+(capacity-75)*.65;
   if($("#scenario-result"))$("#scenario-result").textContent=score>18?"More retention potential under these assumptions":score< -18?"Greater scarcity pressure under these assumptions":"Balanced input assumptions";
   if($("#scenario-detail"))$("#scenario-detail").textContent="Illustrative score "+score.toFixed(1)+". This does not predict actual tank behaviour or model hydraulic safety.";
  }
  function bindPanel(){
   const filter=$("#report-filter");
   if(filter)filter.addEventListener("change",()=>{state.reportFilter=filter.value;refresh();});
   document.querySelectorAll("[data-save-reply]").forEach(btn=>btn.addEventListener("click",()=>{
    const id=Number(btn.dataset.saveReply), report=state.reports.find(r=>r.id===id);
    if(!report)return;
    const reply=document.querySelector('[data-report-reply="'+id+'"]');
    const status=document.querySelector('[data-report-status="'+id+'"]');
    report.reply=reply?reply.value.trim():"";
    report.replyDate=new Date().toLocaleString();
    report.status=status?status.value:(report.status||"Received");
    refresh();
   }));
   document.querySelectorAll("[data-report-status]").forEach(sel=>sel.addEventListener("change",()=>{
    const report=state.reports.find(r=>r.id===Number(sel.dataset.reportStatus));
    if(report)report.status=sel.value;
   }));
   document.querySelectorAll("[data-pin]").forEach(btn=>btn.addEventListener("click",()=>{
    state.pin=btn.dataset.pin;const match=tanks.find(t=>t.pin===state.pin);if(match)state.tank=match;refresh();
   }));
   document.querySelectorAll(".map-tank").forEach(btn=>btn.addEventListener("click",()=>{
    state.tank=tanks.find(t=>t.id===btn.dataset.tank)||state.tank;state.pin=state.tank.pin;refresh();
   }));
   document.querySelectorAll('#dash-panel input[type="range"]').forEach(el=>el.addEventListener("input",scenario));
   const form=$("#report-form");
   if(form)form.addEventListener("submit",e=>{
    e.preventDefault();
    state.reports.unshift({id:state.nextReportId++,type:$("#report-type").value,pin:$("#report-pin").value.trim(),detail:$("#report-detail").value.trim(),date:new Date().toLocaleString(),audience:state.role,status:"Received",reply:"",replyDate:""});
    refresh();
    const msg=$("#form-status");if(msg)msg.textContent="Report submitted to the demo authority inbox. Replies will appear in your own workspace.";
   });
  }
  function refresh(){const root=$("#dash-panel");if(root){root.innerHTML=panel();bindPanel();charts();}}
  function open(role){
   state.role=role||state.role;state.panel="overview";const info=roles[state.role],modal=$("#dashboard-modal");
   modal.classList.add("open");modal.setAttribute("aria-hidden","false");document.body.style.overflow="hidden";
   $("#dash-kicker").textContent=info.label;$("#dashboard-title").textContent=info.title;$("#dash-description").textContent=info.description;
   $("#location-bar").outerHTML=info.location?pinBar():'<div class="location-bar authority-location" id="location-bar"><label>Available PINs / eri</label><div class="pin-chips">'+[...new Map(tanks.map(t=>[t.pin,t])).values()].map(t=>'<button type="button" class="pin-chip" data-pin="'+t.pin+'" title="Select '+esc(t.name)+'">'+t.pin+'<small>'+esc(t.name)+'</small></button>').join('')+'</div><span>12 tank records · select a PIN chip to inspect its tank</span></div>';
   $$(".side-link").forEach(b=>b.classList.toggle("active",b.dataset.panel==="overview"));refresh();
  }
  function close(){const modal=$("#dashboard-modal");modal.classList.remove("open");modal.setAttribute("aria-hidden","true");document.body.style.overflow="";if(state.chart){state.chart.destroy();state.chart=null;}}
  function applyPin(){
   const select=$("#postcode");if(!select)return;
   const pin=select.value.trim();
   if(!/^\d{6}$/.test(pin)){const msg=$("#postcode-message");if(msg)msg.textContent="Choose a valid 6-digit PIN code";return;}
   state.pin=pin;const match=tanks.find(t=>t.pin===pin);
   if(match)state.tank=match;
   refresh();
   const msg=$("#postcode-message");if(msg)msg.textContent=match?"Matched repository tank: "+match.name:"No exact tank match in the source data; supply availability requires provider data.";
  }
  document.addEventListener("click",e=>{
   const role=e.target.closest("[data-role]");if(role){open(role.dataset.role);return;}
   if(e.target.closest("[data-close]")){close();return;}
   const tab=e.target.closest("[data-panel]");if(tab){state.panel=tab.dataset.panel;$$(".side-link").forEach(b=>b.classList.toggle("active",b===tab));refresh();return;}
   if(e.target.closest("#apply-postcode")){applyPin();return;}
   if(e.target.closest("#change-role")){
    $("#dash-kicker").textContent="CHOOSE A WORKSPACE";$("#dashboard-title").textContent="Switch your workspace";$("#dash-description").textContent="Open the view designed for the information you need.";
    if($("#location-bar"))$("#location-bar").style.display="none";
    $("#dash-panel").innerHTML='<div class="role-switch-grid"><button class="role-switch" data-role="household"><strong>Households</strong><small>Supply context, shortage notices and conservation.</small></button><button class="role-switch" data-role="farmer"><strong>Farmers</strong><small>Tank context, field risks and irrigation precautions.</small></button><button class="role-switch" data-role="authority"><strong>Water authorities</strong><small>Cascade overview, channel signals and approval workflow.</small></button></div>';
   }
  });
  document.addEventListener("keydown",e=>{if(e.key==="Escape")close();});
  $$(".role-card").forEach(b=>b.addEventListener("click",()=>open(b.dataset.role)));
  window.addEventListener("resize",()=>{if(state.chart)state.chart.resize();});
})();