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
  let channels=[];
  let channelDataReady=false;
  const roles={
   household:{label:"LOCAL CONSUMERS / HOUSEHOLD",title:"Household water outlook",description:"Local water context and practical conservation guidance.",location:true},
   farmer:{label:"FIELD & FARM / AGRICULTURE",title:"Your field water outlook",description:"Understand the risk, then decide what to do today.",location:true},
   authority:{label:"PLANNING / AUTHORITY WORKSPACE",title:"Madurai water intelligence",description:"Review tank and channel conditions, potential risks and decision options.",location:false}
  };

  const farmerTamil={
   "Overview":"கண்ணோட்டம்","Trends & outlook":"போக்குகள் மற்றும் முன்னோக்கு","Recommended actions":"பரிந்துரைக்கப்படும் நடவடிக்கைகள்","Feedback & reports":"கருத்துகள் மற்றும் அறிக்கைகள்","Switch workspace ↗":"பணியிடத்தை மாற்று ↗",
   "CONNECTED TANK":"இணைக்கப்பட்ட நீர்நிலை","LATEST RECORDED STORAGE":"சமீபத்திய பதிவுசெய்யப்பட்ட நீர் இருப்பு","CROP WATER RISK":"பயிர் நீர் அபாயம்","Needs inputs":"தகவல்கள் தேவை","Not assessed":"மதிப்பீடு செய்யப்படவில்லை","repository tank metadata":"நீர்நிலைத் தரவுத்தள விவரங்கள்","Latest CSV storage ÷ listed capacity":"சமீபத்திய பதிவில் உள்ள நீர் ÷ குறிப்பிடப்பட்ட கொள்ளளவு",
   "RISK CHECK":"அபாயச் சரிபார்ப்பு","Check conditions before irrigation.":"பாசனம் செய்வதற்கு முன் நிலைமைகளைச் சரிபார்க்கவும்.","Field risk cannot be verified without a validated forecast, crop stage and local observations.":"சரிபார்க்கப்பட்ட வானிலை முன்னறிவிப்பு, பயிரின் வளர்ச்சி நிலை மற்றும் உள்ளூர் கண்காணிப்புத் தகவல்கள் இல்லாமல் வயல் அபாயத்தை உறுதிப்படுத்த முடியாது.",
   "Tank storage history":"நீர்நிலையின் நீர் இருப்பு வரலாறு","Daily historical readings from the repository CSV":"தரவுக் கோப்பிலிருந்து பெறப்பட்ட தினசரி வரலாற்றுப் பதிவுகள்","What should I do today?":"இன்று நான் என்ன செய்ய வேண்டும்?","Practical precautions":"நடைமுறை முன்னெச்சரிக்கைகள்",
   "Check soil moisture first":"முதலில் மண்ணின் ஈரப்பதத்தைச் சரிபார்க்கவும்","Plan irrigation using field conditions and crop needs, not tank percentage alone.":"நீர்நிலையின் சதவீதத்தை மட்டும் நம்பாமல், வயல் நிலை மற்றும் பயிரின் தேவைக்கேற்ப பாசனத்தைத் திட்டமிடுங்கள்.",
   "If heavy rain is forecast":"கனமழை முன்னறிவிப்பு இருந்தால்","Inspect drains, protect equipment and follow official flood guidance. Do not enter flooded channels.":"வடிகால்களைச் சரிபார்த்து, கருவிகளைப் பாதுகாத்து, அதிகாரப்பூர்வ வெள்ள வழிகாட்டுதலைப் பின்பற்றுங்கள். வெள்ளம் சூழ்ந்த கால்வாய்களுக்குள் செல்ல வேண்டாம்.",
   "Plan water-efficient irrigation":"நீரைச் சிக்கனமாகப் பயன்படுத்தும் பாசனத்தைத் திட்டமிடுங்கள்","Prioritize water-sensitive crop stages and avoid unnecessary watering.":"நீர் தேவை அதிகமுள்ள முக்கியப் பயிர் வளர்ச்சி நிலைகளுக்கு முன்னுரிமை கொடுத்து, தேவையற்ற பாசனத்தைத் தவிர்க்கவும்.",
   "Simple risk guide":"எளிய அபாய வழிகாட்டி","Conceptual guidance — not validated thresholds":"கருத்து அடிப்படையிலான வழிகாட்டி — சரிபார்க்கப்பட்ட வரம்புகள் அல்ல",
   "Flood risk":"வெள்ள அபாயம்","Protect the field":"வயலைப் பாதுகாக்கவும்","Check drainage and monitor official warnings.":"வடிகால் வசதிகளைச் சரிபார்த்து, அதிகாரப்பூர்வ எச்சரிக்கைகளைக் கவனியுங்கள்.",
   "Low water":"நீர் குறைவு","Conserve irrigation":"பாசன நீரைச் சிக்கனமாகப் பயன்படுத்துங்கள்","Check soil moisture, crop stage and approved schedule.":"மண்ணின் ஈரப்பதம், பயிரின் வளர்ச்சி நிலை மற்றும் அங்கீகரிக்கப்பட்ட அட்டவணையைச் சரிபார்க்கவும்.",
   "Normal":"சாதாரண நிலை","Keep to the plan":"திட்டத்தைப் பின்பற்றுங்கள்","Follow normal irrigation while avoiding waste.":"நீரை வீணாக்காமல் வழக்கமான பாசனத் திட்டத்தைப் பின்பற்றுங்கள்.",
   "Quality":"நீரின் தரம்","Confirm permitted use":"அனுமதிக்கப்பட்ட பயன்பாட்டை உறுதிப்படுத்தவும்","Irrigation suitability does not imply drinking-water safety.":"பாசனத்திற்குப் பொருத்தமான நீர் என்பது குடிப்பதற்கும் பாதுகாப்பானது என்று அர்த்தமல்ல.",
   "Check soil moisture":"மண்ணின் ஈரப்பதத்தைச் சரிபார்க்கவும்","Use field observations and crop stage to guide irrigation.":"வயல் கண்காணிப்பு மற்றும் பயிரின் வளர்ச்சி நிலையை அடிப்படையாகக் கொண்டு பாசனத்தைத் திட்டமிடுங்கள்.",
   "Review local forecast":"உள்ளூர் வானிலை முன்னறிவிப்பைப் பாருங்கள்","Check official rainfall and flood warnings.":"அதிகாரப்பூர்வ மழை மற்றும் வெள்ள எச்சரிக்கைகளைச் சரிபார்க்கவும்.",
   "Inspect drainage":"வடிகால் வசதிகளைச் சரிபார்க்கவும்","Prepare drainage before heavy rain; keep away from flooded channels.":"கனமழைக்கு முன் வடிகால் வசதிகளைத் தயார் செய்யுங்கள்; வெள்ளம் சூழ்ந்த கால்வாய்களை அணுக வேண்டாம்.",
   "Confirm usable water":"பயன்படுத்தக்கூடிய நீரை உறுதிப்படுத்தவும்","Check approved irrigation schedule and quality restrictions.":"அங்கீகரிக்கப்பட்ட பாசன அட்டவணை மற்றும் நீர்த் தரக் கட்டுப்பாடுகளைச் சரிபார்க்கவும்.",
   "ACTION WORKSPACE":"நடவடிக்கைப் பகுதி","Practical prompts, not official alerts":"நடைமுறை வழிகாட்டல்கள்; அதிகாரப்பூர்வ எச்சரிக்கைகள் அல்ல","Final advice must use verified local conditions.":"இறுதி ஆலோசனை சரிபார்க்கப்பட்ட உள்ளூர் நிலைமைகளின் அடிப்படையில் இருக்க வேண்டும்.",
   "Action checklist":"நடவடிக்கைச் சரிபார்ப்புப் பட்டியல்","Mark items as you complete them":"முடித்தவற்றைக் குறிக்கவும்",
   "Rainfall change (%)":"மழைப்பொழிவு மாற்றம் (%)","Demand change (%)":"நீர் தேவை மாற்றம் (%)","Usable capacity (%)":"பயன்படுத்தக்கூடிய கொள்ளளவு (%)","Illustrative scenario index · not a forecast":"விளக்கத்திற்கான சூழ்நிலை மதிப்பீடு · முன்னறிவிப்பு அல்ல","Balanced input":"சமநிலையான உள்ளீடுகள்","Adjust assumptions to compare an illustrative score only.":"விளக்க மதிப்பீட்டை மட்டும் ஒப்பிட, அனுமானங்களை மாற்றவும்.","More retention potential under these assumptions":"இந்த அனுமானங்களின்படி நீரைத் தேக்குவதற்கான வாய்ப்பு அதிகம்","Greater scarcity pressure under these assumptions":"இந்த அனுமானங்களின்படி நீர் பற்றாக்குறை அழுத்தம் அதிகம்","Balanced input assumptions":"சமநிலையான அனுமானங்கள்","Illustrative score":"விளக்க மதிப்பெண்",
   "Historical records loaded":"வரலாற்றுப் பதிவுகள் ஏற்றப்பட்டுள்ளன","Charts use dated rainfall and storage records from the repository CSV. They are historical observations, not live readings.":"வரைபடங்கள் தரவுக் கோப்பிலுள்ள தேதி வாரியான மழைப்பொழிவு மற்றும் நீர் இருப்புப் பதிவுகளைப் பயன்படுத்துகின்றன. இவை வரலாற்றுப் பதிவுகள்; நேரடி அளவீடுகள் அல்ல.",
   "Predictions require validation":"முன்னறிவிப்புகளைச் சரிபார்க்க வேண்டும்","A one-year outlook needs a validated model, forecast horizon, confidence and update timestamp.":"ஒரு வருட முன்னோக்கிற்கு சரிபார்க்கப்பட்ட மாதிரி, முன்னறிவிப்பு காலவரம்பு, நம்பகத்தன்மை அளவு மற்றும் புதுப்பித்த நேரம் தேவை.",
   "Model evaluation":"மாதிரி மதிப்பீடு","Test predictions on chronological holdout periods before presenting forecast claims.":"முன்னறிவிப்புகளை வெளியிடுவதற்கு முன், காலவரிசைப்படி ஒதுக்கப்பட்ட சோதனைத் தரவுகளில் அவற்றை மதிப்பிடுங்கள்.",
   "Hydrology and storage signals":"நீரியல் மற்றும் நீர் இருப்பு குறியீடுகள்","Historical CSV readings for the selected tank · not a forecast":"தேர்ந்தெடுக்கப்பட்ட நீர்நிலையின் வரலாற்றுப் பதிவுகள் · முன்னறிவிப்பு அல்ல","How to read this view":"இந்தப் பார்வையை எப்படிப் புரிந்துகொள்வது","Separate evidence from forecasts":"தரவு ஆதாரங்களையும் முன்னறிவிப்புகளையும் தனித்தனியாகப் பாருங்கள்","Monthly data summary":"மாதாந்திர தரவுச் சுருக்கம்","Aggregated from the selected tank's daily historical CSV readings":"தேர்ந்தெடுக்கப்பட்ட நீர்நிலையின் தினசரி வரலாற்றுப் பதிவுகளிலிருந்து தொகுக்கப்பட்டது","Scenario explorer":"சூழ்நிலை ஆராய்ச்சி","Hypothetical inputs — not an operational recommendation":"கற்பனையான உள்ளீடுகள் — செயல்பாட்டு பரிந்துரை அல்ல","Full year":"முழு ஆண்டு","From month":"தொடக்க மாதம்","To month":"இறுதி மாதம்","Print / Save as PDF ↗":"அச்சிடு / PDF ஆகச் சேமி ↗",
   "Report category":"அறிக்கை வகை","Tank / nearby eri":"நீர்நிலை / அருகிலுள்ள ஏரி","Problem / report details":"பிரச்சினை / அறிக்கை விவரங்கள்","Submit report":"அறிக்கையைச் சமர்ப்பிக்கவும்","Send feedback":"கருத்தை அனுப்பவும்","Your report is routed to the water authority, not the other audience":"உங்கள் அறிக்கை நீர்வள அதிகாரிகளுக்கு அனுப்பப்படும்","What happens next":"அடுத்து என்ன நடக்கும்","Submit → authority review → reply":"சமர்ப்பிப்பு → அதிகாரிகள் ஆய்வு → பதில்","My reports and replies":"எனது அறிக்கைகளும் பதில்களும்","No reports in this view yet":"இந்தப் பார்வையில் இன்னும் அறிக்கைகள் இல்லை","Received":"பெறப்பட்டது","In review":"ஆய்வில் உள்ளது","Resolved":"தீர்க்கப்பட்டது","Add reply":"பதிலைச் சேர்க்கவும்","Report status":"அறிக்கையின் நிலை"
  };
  function translateFarmerWorkspace(){
   if(state.role!=="farmer"||state.farmerLanguage!=="ta")return;
   const root=$("#dash-panel");if(!root)return;
   const entries=Object.entries(farmerTamil).sort((a,b)=>b[0].length-a[0].length);
   const walker=document.createTreeWalker(root,NodeFilter.SHOW_TEXT);
   const nodes=[];while(walker.nextNode())nodes.push(walker.currentNode);
   nodes.forEach(node=>{let value=node.nodeValue;entries.forEach(([en,ta])=>{value=value.split(en).join(ta);});node.nodeValue=value;});
   root.querySelectorAll("input[placeholder],textarea[placeholder],input[aria-label],canvas[aria-label]").forEach(el=>{
    if(el.placeholder)entries.forEach(([en,ta])=>{el.placeholder=el.placeholder.split(en).join(ta);});
    if(el.getAttribute("aria-label"))entries.forEach(([en,ta])=>{el.setAttribute("aria-label",el.getAttribute("aria-label").split(en).join(ta));});
   });
  }

  const loadReports=()=>{try{const raw=localStorage.getItem("awwe-reports")||sessionStorage.getItem("awwe-reports")||"[]";return JSON.parse(raw).map(r=>({...r,replies:Array.isArray(r.replies)?r.replies:(r.reply?[{text:r.reply,date:r.replyDate||""}]:[])}));}catch(_){return [];}};
  const state={role:"household",panel:"overview",pin:"625003",tank:tanks[0],chart:null,charts:{},reports:loadReports(),reportFilter:"all",nextReportId:1,formNotice:"",chartStartMonth:0,chartEndMonth:11,farmerLanguage:"en"};
  state.nextReportId=state.reports.reduce((max,r)=>Math.max(max,Number(r.id)||0),0)+1;
  const saveReports=()=>{try{localStorage.setItem("awwe-reports",JSON.stringify(state.reports));sessionStorage.setItem("awwe-reports",JSON.stringify(state.reports));}catch(_){state.formNotice="Browser storage is unavailable; export reports to preserve them.";}};
  let historicalRows=[];
  let repositoryDataReady=false;
  let repositoryDataError="";
  let repositoryLastDate=null;
  const parseCSV=text=>{
   const lines=text.trim().split(/\r?\n/);
   const splitLine=line=>{const cells=[];let value="",quoted=false;for(let i=0;i<line.length;i++){const c=line[i];if(c==='"'&&line[i+1]==='"'&&quoted){value+='"';i++;}else if(c==='"')quoted=!quoted;else if(c===","&&!quoted){cells.push(value);value="";}else value+=c;}cells.push(value);return cells;};
   const headers=splitLine(lines.shift()||"");
   return lines.filter(line=>line.trim()).map(line=>{const cells=splitLine(line);return Object.fromEntries(headers.map((h,i)=>[h,cells[i]??""]));});
  };
  const dateValue=value=>{const raw=String(value).trim();let match=raw.match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})$/);if(match)return new Date(Number(match[3]),Number(match[1])-1,Number(match[2])).getTime();match=raw.match(/^(\d{4})-(\d{1,2})-(\d{1,2})$/);if(match)return new Date(Number(match[1]),Number(match[2])-1,Number(match[3])).getTime();const parsed=Date.parse(raw);return Number.isFinite(parsed)?parsed:NaN;};
  const shortDate=timestamp=>new Date(timestamp).toLocaleDateString(state.role==="farmer"&&state.farmerLanguage==="ta"?"ta-IN":"en-IN",{day:"numeric",month:"short"});
  async function fetchRepositoryCSV(filename){
   let firstError;
   try{const response=await fetch(new URL(filename,document.baseURI).href,{cache:"no-store"});if(!response.ok)throw new Error("HTTP "+response.status+" for "+filename);return await response.text();}catch(error){firstError=error;}
   const rawUrl="https://raw.githubusercontent.com/kamal2716/Adaptive-Water-Wisdom-Engine-AWWE-/main/"+filename;
   try{const response=await fetch(rawUrl,{cache:"no-store"});if(!response.ok)throw new Error("HTTP "+response.status+" for repository fallback");return await response.text();}catch(error){throw new Error("Could not fetch "+filename+". Local request: "+(firstError?.message||"failed")+"; repository fallback: "+(error?.message||"failed"));}
  }
  async function loadRepositoryData(){
   try{
    const [metadataText,seriesText,channelText]=await Promise.all([
     fetchRepositoryCSV("madurai_tank_master_metadata.csv"),
     fetchRepositoryCSV("madurai_daily_hydrological_timeseries.csv"),
     fetchRepositoryCSV("madurai_channel_cascade_network.csv")
    ]);
    const metadata=parseCSV(metadataText);
    const channelRows=parseCSV(channelText);
    historicalRows=parseCSV(seriesText).map(r=>({...r,timestamp:dateValue(r.date)})).filter(r=>r.tank_id&&Number.isFinite(r.timestamp)).sort((a,b)=>a.timestamp-b.timestamp);
    channels=channelRows.map(c=>{
     const upstream=metadata.find(t=>t.tank_id===c.upstream_tank_id);
     const downstream=metadata.find(t=>t.tank_id===c.downstream_tank_id);
     return {id:c.channel_id,upstreamId:c.upstream_tank_id,downstreamId:c.downstream_tank_id,from:upstream?.tank_name||c.upstream_tank_id,to:downstream?.tank_name||c.downstream_tank_id,length:Number(c.channel_length_m),designed:Number(c.designed_capacity_cumecs),effective:Number(c.current_effective_capacity_cumecs),encroach:Number(c.encroachment_percentage),silt:String(c.siltation_level),integrity:Number(c.structural_integrity_score),priority:Number(c.restoration_priority_score),upstreamPin:c.upstream_tank_postcode,downstreamPin:c.downstream_tank_postcode};
    });
    channelDataReady=channels.length>0;
    repositoryLastDate=historicalRows.length?historicalRows[historicalRows.length-1].timestamp:null;
    const loaded=metadata.map(m=>{
     const rows=historicalRows.filter(r=>r.tank_id===m.tank_id);
     const latest=rows[rows.length-1];
     return {id:m.tank_id,name:m.tank_name,pin:String(m.postcode),capacity:Number(m.storage_capacity_mcm),storage:latest?Number(latest.current_storage_mcm):0,silt:Number(m.siltation_percentage),latitude:Number(m.latitude),longitude:Number(m.longitude),catchment:Number(m.catchment_area_sqkm),fullLevel:Number(m.full_reservoir_level_m),deadStorage:Number(m.dead_storage_mcm),sluiceGates:Number(m.sluice_gates_count),downstreamId:m.downstream_tank_id,downstreamName:metadata.find(x=>x.tank_id===m.downstream_tank_id)?.tank_name||"Not listed",tekHeritageScore:Number(m.tek_heritage_score),latestDate:latest?.timestamp??null,waterLevel:latest?Number(latest.current_water_level_m):NaN,inflow:latest?Number(latest.inflow_cumecs):NaN,irrigationOutflow:latest?Number(latest.irrigation_outflow_cumecs):NaN,spillway:latest?Number(latest.spillway_discharge_cumecs):NaN,rainfall:latest?Number(latest.rainfall_mm):NaN,floodRisk:latest?Number(latest.flood_risk_index):NaN,scarcityRisk:latest?Number(latest.scarcity_risk_index):NaN,groundwaterDepth:latest?Number(latest.groundwater_table_depth_m):NaN,evaporation:latest?Number(latest.evaporation_rate_mm):NaN};
    });
    if(!loaded.length)throw new Error("Tank metadata CSV contains no tank records");
    tanks.splice(0,tanks.length,...loaded);
    repositoryDataReady=true;
    repositoryDataError="";
    state.tank=tanks.find(t=>t.id===state.tank?.id)||tanks[0];
    state.pin=state.tank.pin;
   }catch(error){
    repositoryDataError="Historical CSV data could not be fetched. Check your internet connection and confirm the two CSV files are available in the repository. Details: "+(error?.message||"unknown loading error");
    console.error("AWWE data loading failed:",error);
    repositoryDataReady=true;
   }
   const modal=$("#dashboard-modal");
   if(modal?.classList.contains("open")){
    const info=roles[state.role],bar=$("#location-bar");
    if(bar)bar.outerHTML=info.location?pinBar():authorityPinBar();
    destroyCharts();refresh();
   }
  }

  const esc=v=>String(v).replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
  const pct=t=>Number.isFinite(t.capacity)&&t.capacity>0?Math.round(100*t.storage/t.capacity):0;
  const num=(value,digits=2)=>Number.isFinite(Number(value))?Number(value).toFixed(digits):"Not recorded";
  const chartOnly=id=>'<div class="chart-area"><div class="chart-wrap"><canvas id="'+id+'" aria-label="Historical tank indicators from repository CSV"></canvas></div></div>';
  function destroyCharts(){Object.values(state.charts||{}).forEach(chart=>{try{chart.destroy();}catch(_){}});state.charts={};state.chart=null;}
  const level=t=>pct(t)<30?"Low":pct(t)<58?"Moderate":"Available";
  const tone=t=>pct(t)<30?"critical":pct(t)<58?"warn":"";
  const metric=(title,value,note,chip="",cls="")=>'<article class="metric-card"><div class="metric-label">'+title+'</div><div class="metric-value">'+value+'</div>'+(chip?'<span class="metric-chip '+cls+'">'+chip+'</span>':'')+'<div class="metric-note">'+note+'</div></article>';
  const card=(title,sub,body)=>'<section class="panel-card"><div class="panel-title"><div><h3>'+title+'</h3>'+(sub?'<p>'+sub+'</p>':'')+'</div></div>'+body+'</section>';
  const tankRow=t=>'<div class="tank-row"><div><strong>'+esc(t.name)+'</strong><small>'+esc(t.id)+' · '+level(t)+'</small><div class="bar-track"><div class="bar-fill '+tone(t)+'" style="width:'+Math.min(100,pct(t))+'%"></div></div></div><div class="tank-value">'+pct(t)+'%<small>capacity</small></div></div>';
  const canvas=id=>'<div class="chart-area"><div class="chart-controls"><label for="chart-from-month">From month</label><select id="chart-from-month" aria-label="Chart starting month">'+Array.from({length:12},(_,i)=>'<option value="'+i+'" '+(i===state.chartStartMonth?"selected":"")+'>'+new Date(2025,i,1).toLocaleDateString(state.role==="farmer"&&state.farmerLanguage==="ta"?"ta-IN":"en-IN",{month:"long"})+'</option>').join("")+'</select><label for="chart-to-month">To month</label><select id="chart-to-month" aria-label="Chart ending month">'+Array.from({length:12},(_,i)=>'<option value="'+i+'" '+(i===state.chartEndMonth?"selected":"")+'>'+new Date(2025,i,1).toLocaleDateString("en-IN",{month:"long"})+'</option>').join("")+'</select><button type="button" id="chart-full-year">Full year</button></div><div class="chart-wrap"><canvas id="'+id+'" aria-label="Historical tank readings from repository CSV"></canvas></div></div>';
  const pinBar=()=>'<div class="location-bar" id="location-bar"><label for="postcode">PIN / tank search</label><input id="postcode" list="tank-options" autocomplete="off" placeholder="Search PIN or tank name" value="'+esc(state.tank?state.tank.pin+" — "+state.tank.name:state.pin)+'" aria-label="Search PIN code or tank name"><datalist id="tank-options">'+tanks.map(t=>'<option value="'+esc(t.pin+" — "+t.name)+'"></option>').join("")+'</datalist><button id="apply-postcode">Find tank</button><span id="postcode-message">Search by PIN or tank name. A shared PIN can match multiple tanks.</span></div>';
  const authorityPinBar=()=>'<div class="location-bar authority-location" id="location-bar"><label>Available PINs / eri</label><div class="pin-chips">'+[...new Map(tanks.map(t=>[t.pin,t])).values()].map(t=>'<button type="button" class="pin-chip" data-pin="'+esc(t.pin)+'" title="Select '+esc(t.name)+'">'+esc(t.pin)+'<small>'+esc(t.name)+'</small></button>').join('')+'</div><span>'+tanks.length+' tank records · select a PIN to inspect its records</span></div>';
  function household(){
   const t=state.tank;
   const advice='<div class="recommendation"><span class="rec-icon">✓</span><div><strong>Check official supply updates</strong><p>Confirm treatment, distribution timing and interruption notices with your local provider.</p></div></div><div class="recommendation"><span class="rec-icon">≈</span><div><strong>Save water where practical</strong><p>Repair leaks, reuse suitable greywater where permitted and prepare harvesting systems before heavy rain.</p></div></div><div class="recommendation warn"><span class="rec-icon">!</span><div><strong>Water quality is separate</strong><p>Untested water must not be treated as safe to drink. Check approved treatment and testing guidance.</p></div></div>';
   return '<div class="metric-grid">'+metric("NEAREST TANK CONTEXT",esc(t.name),"Repository record · PIN "+t.pin)+metric("LATEST RECORDED STORAGE",pct(t)+"%","CSV reading: "+(repositoryLastDate?shortDate(repositoryLastDate):"date unavailable")+" · storage/capacity",level(t),tone(t))+metric("HOUSEHOLD SUPPLY","Unverified","Tank storage does not confirm treated supply or tap availability","Needs supply data","warn")+'</div><div class="panel-grid">'+card("Water context","Daily historical readings from the repository CSV",canvas("main-chart"))+card("What to do now","Useful household guidance",advice)+'</div><div class="panel-grid">'+card("Tank records","Reference data, not a live service",'<div class="tank-list">'+tanks.filter(t=>t.pin===state.pin).map(tankRow).concat(tanks.filter(t=>t.pin!==state.pin)).map(tankRow).join("")+'</div>')+card("Flood & drought readiness","Follow verified local information",'<div class="recommendation warn"><span class="rec-icon">☔</span><div><strong>Heavy rain expected?</strong><p>Follow official flood warnings and watch for verified tank release advisories. Stay away from flooded channels.</p></div></div><div class="recommendation"><span class="rec-icon">☼</span><div><strong>During a dry spell</strong><p>Use water-saving practices and seek confirmed local supply schedules.</p></div></div>')+'</div>';
  }
  function farmer(){
   const t=state.tank;
   const advice='<div class="recommendation"><span class="rec-icon">✓</span><div><strong>Check soil moisture first</strong><p>Plan irrigation using field conditions and crop needs, not tank percentage alone.</p></div></div><div class="recommendation warn"><span class="rec-icon">☔</span><div><strong>If heavy rain is forecast</strong><p>Inspect drains, protect equipment and follow official flood guidance. Do not enter flooded channels.</p></div></div><div class="recommendation"><span class="rec-icon">≈</span><div><strong>Plan water-efficient irrigation</strong><p>Prioritize water-sensitive crop stages and avoid unnecessary watering.</p></div></div>';
   const guide='<div class="action-list"><div class="action-check"><span class="metric-chip critical">Flood risk</span><div><strong>Protect the field</strong><small>Check drainage and monitor official warnings.</small></div></div><div class="action-check"><span class="metric-chip warn">Low water</span><div><strong>Conserve irrigation</strong><small>Check soil moisture, crop stage and approved schedule.</small></div></div><div class="action-check"><span class="metric-chip">Normal</span><div><strong>Keep to the plan</strong><small>Follow normal irrigation while avoiding waste.</small></div></div><div class="action-check"><span class="metric-chip warn">Quality</span><div><strong>Confirm permitted use</strong><small>Irrigation suitability does not imply drinking-water safety.</small></div></div></div>';
   return '<div class="metric-grid">'+metric("CONNECTED TANK",esc(t.name),"PIN "+t.pin+" · repository tank metadata")+metric("LATEST RECORDED STORAGE",pct(t)+"%","Latest CSV storage ÷ listed capacity",level(t),tone(t))+metric("CROP WATER RISK","Needs inputs","Crop, soil moisture and forecast are not connected","Not assessed","warn")+'</div><div class="risk-banner"><span class="risk-badge">RISK CHECK</span><div><strong>Check conditions before irrigation.</strong><p>Field risk cannot be verified without a validated forecast, crop stage and local observations.</p></div></div><div class="panel-grid">'+card("Tank storage history","Daily historical readings from the repository CSV",canvas("main-chart"))+card("What should I do today?","Practical precautions",advice)+'</div>'+card("Simple risk guide","Conceptual guidance — not validated thresholds",guide);
  }
  function authority(){
   const capacity=tanks.reduce((s,t)=>s+t.capacity,0),stored=tanks.reduce((s,t)=>s+t.storage,0);
   const lats=tanks.map(t=>Number(t.latitude)).filter(Number.isFinite),lons=tanks.map(t=>Number(t.longitude)).filter(Number.isFinite);
   const minLat=Math.min(...lats),maxLat=Math.max(...lats),minLon=Math.min(...lons),maxLon=Math.max(...lons);
   const markers=tanks.map((t,i)=>{const x=10+(Number.isFinite(t.longitude)?(Number(t.longitude)-minLon)/Math.max(.0001,maxLon-minLon):i/Math.max(1,tanks.length-1))*80;const y=10+(Number.isFinite(t.latitude)?(maxLat-Number(t.latitude))/Math.max(.0001,maxLat-minLat):i/Math.max(1,tanks.length-1))*80;return '<button class="map-tank" style="left:'+x.toFixed(2)+'%;top:'+y.toFixed(2)+'%" title="'+esc(t.name)+' · '+esc(t.pin)+'" aria-label="Select '+esc(t.name)+'" data-tank="'+t.id+'"><span>'+esc(t.name)+'</span></button>';}).join("");
   const tankIndex='<div class="tank-map-index">'+tanks.map(t=>'<button type="button" class="tank-index-item '+(t.id===state.tank.id?'selected':'')+'" data-tank="'+t.id+'"><strong>'+esc(t.name)+'</strong><small>'+esc(t.pin)+' · '+esc(t.id)+'</small></button>').join("")+'</div>';
   const t=state.tank,usable=Math.max(0,(Number(t.storage)||0)-(Number(t.deadStorage)||0));
   const tankDetails='<div class="authority-detail-grid">'+
    '<div class="detail-stat"><span>Recorded storage</span><strong>'+num(t.storage)+' MCM</strong><small>'+pct(t)+'% of listed capacity ('+num(t.capacity)+' MCM)</small></div>'+
    '<div class="detail-stat"><span>Water level / full reservoir level</span><strong>'+num(t.waterLevel)+' / '+num(t.fullLevel)+' m</strong><small>Difference to FRL: '+(Number.isFinite(t.waterLevel)&&Number.isFinite(t.fullLevel)?num(t.fullLevel-t.waterLevel)+' m':'Not recorded')+'</small></div>'+
    '<div class="detail-stat"><span>Dead storage</span><strong>'+num(t.deadStorage)+' MCM</strong><small>Metadata field</small></div>'+
    '<div class="detail-stat"><span>Estimated water above dead storage</span><strong>'+num(usable)+' MCM</strong><small>Simple estimate; not a release approval</small></div>'+
    '<div class="detail-stat"><span>Inflow</span><strong>'+num(t.inflow)+' m³/s</strong><small>Latest recorded daily row</small></div>'+
    '<div class="detail-stat"><span>Irrigation outflow</span><strong>'+num(t.irrigationOutflow)+' m³/s</strong><small>Latest recorded daily row</small></div>'+
    '<div class="detail-stat"><span>Spillway discharge</span><strong>'+num(t.spillway)+' m³/s</strong><small>Latest recorded daily row</small></div>'+
    '<div class="detail-stat"><span>Daily rainfall (recorded)</span><strong>'+num(t.rainfall)+' mm</strong><small>Last dated row: '+(t.latestDate?shortDate(t.latestDate):"date unavailable")+'</small></div>'+
    '<div class="detail-stat"><span>Groundwater-table depth</span><strong>'+num(t.groundwaterDepth)+' m</strong><small>Depth value as recorded in CSV</small></div>'+
    '<div class="detail-stat"><span>Evaporation rate</span><strong>'+num(t.evaporation)+' mm</strong><small>Verify period/unit in source documentation</small></div>'+
    '<div class="detail-stat"><span>Siltation</span><strong>'+num(t.silt,1)+'%</strong><small>Tank metadata</small></div>'+
    '<div class="detail-stat"><span>Sluice gates</span><strong>'+num(t.sluiceGates,0)+'</strong><small>Tank metadata</small></div>'+
    '<div class="detail-stat"><span>Downstream connection</span><strong>'+esc(t.downstreamName||"Not listed")+'</strong><small>'+esc(t.downstreamId||"No downstream ID")+'</small></div>'+
    '</div><p class="data-caveat">Repository records through '+(repositoryLastDate?new Date(repositoryLastDate).toLocaleDateString("en-IN",{day:"numeric",month:"short",year:"numeric"}):"the latest available date")+', not live telemetry. Estimated usable water = recorded storage minus listed dead storage, floored at zero; confirm operating rules before use.</p>';
   const network=channels.slice().sort((a,b)=>b.priority-a.priority).map(c=>'<div class="channel-record"><div class="channel-heading"><strong>'+esc(c.from)+' → '+esc(c.to)+'</strong><span class="channel-id">'+esc(c.id)+'</span></div><div class="channel-metrics">'+
    '<span><small>Designed</small><b>'+num(c.designed)+' m³/s</b></span><span><small>Effective</small><b>'+num(c.effective)+' m³/s</b></span><span><small>Capacity retained</small><b>'+num(c.designed>0?c.effective/c.designed*100:NaN,1)+'%</b></span><span><small>Encroachment</small><b>'+num(c.encroach,1)+'%</b></span><span><small>Structural integrity</small><b>'+num(c.integrity,1)+' / 10</b></span><span><small>Restoration priority</small><b>'+num(c.priority,1)+' / 100</b></span><span><small>Channel length</small><b>'+num(c.length,0)+' m</b></span><span><small>Siltation label</small><b>'+esc(c.silt)+'</b></span></div><div class="bar-track"><div class="bar-fill '+(["Severe","Critical"].includes(c.silt)?"critical":"")+'" style="width:'+Math.max(0,Math.min(100,c.priority))+'%"></div></div></div>').join("");
   const priorities='<div class="recommendation danger"><span class="rec-icon">!</span><div><strong>Inspect priority channels</strong><p>Use restoration priority, effective conveyance and encroachment to guide field verification; CSV scores are not independently validated in this interface.</p></div></div><div class="recommendation warn"><span class="rec-icon">≈</span><div><strong>Investigate historical risk patterns</strong><p>Review rainfall, inflow, spillway discharge, groundwater depth and recorded flood/scarcity indices together.</p></div></div><div class="recommendation"><span class="rec-icon">✓</span><div><strong>Keep official approval in the loop</strong><p>Do not issue warnings or approve releases from historical values alone. Validate definitions, thresholds and current field conditions.</p></div></div>';
   return '<div class="metric-grid authority-kpis">'+metric("TANK RECORDS",String(tanks.length),"Tank metadata loaded from repository CSV")+metric("RECORDED CAPACITY",capacity.toFixed(2)+" MCM","Sum of listed storage capacity")+metric("LATEST RECORDED STORAGE",num(stored,2)+" MCM",Math.round(stored/capacity*100)+"% of listed capacity · "+(repositoryLastDate?shortDate(repositoryLastDate):"date unavailable"),"Historical","warn")+metric("CHANNEL LINKS",String(channels.length),channelDataReady?"Loaded directly from cascade CSV":"Channel CSV not available")+'</div>'+
    '<div class="authority-section-heading"><span>01</span><div><h3>Tank register & selection</h3><p>Select any tank to inspect its recorded operating snapshot below.</p></div></div>'+
    '<div class="panel-grid authority-layout"><div>'+card("Tank cascade overview","All repository tanks · schematic relative positions, not a navigation map",'<div class="map-panel"><div class="map-art">'+markers+'</div><div class="map-legend"><span><i></i> Tank location</span><span>Choose a marker or tank in the register</span></div></div>'+tankIndex)+'</div><div>'+card("Selected tank · "+esc(t.name),"Tank ID "+esc(t.id)+" · PIN "+esc(t.pin),tankDetails)+'</div></div>'+
    '<div class="authority-section-heading"><span>02</span><div><h3>Hydrology & risk signals</h3><p>Historical observations for the selected tank and chosen month range.</p></div></div>'+
    '<div class="panel-grid authority-layout"><div>'+card("Rainfall, storage & water movement","Rainfall and flow are plotted on the left axis; storage is on the right.",chartOnly("authority-hydrology-chart"))+'</div><div>'+card("Historical flood & scarcity indices","CSV index values are displayed as recorded. Their definitions, scale and validation are not established by this UI.",chartOnly("authority-risk-chart"))+'</div></div>'+
    '<div class="panel-grid authority-layout"><div>'+card("Groundwater & evaporation","Historical CSV values; confirm measurement definitions and units before operational interpretation.",chartOnly("authority-groundwater-chart"))+'</div><div>'+card("Review priorities","Evidence to validate before action",priorities)+'</div></div>'+
    '<div class="authority-section-heading"><span>03</span><div><h3>Tank-cascade channel condition</h3><p>All channel links and infrastructure scores loaded from madurai_channel_cascade_network.csv.</p></div></div>'+
    card("Channel register · "+channels.length+" links","Designed versus effective capacity, encroachment, integrity and restoration priority",channelDataReady?'<div class="channel-list">'+network+'</div>':'<p class="chart-message">Channel CSV could not be loaded. No hardcoded channel values are being substituted.</p>')+
    '<p class="data-caveat"><strong>Review limitation:</strong> The daily CSV spans 2025 and is historical, not live. Flood-risk and scarcity-risk indices require source-definition and validation checks before use in any public warning. Structural-integrity and restoration-priority scales should also be confirmed against their data dictionary.</p>';
  }
  function trends(){
   const notes='<div class="recommendation"><span class="rec-icon">⌁</span><div><strong>Historical records loaded</strong><p>Charts use dated rainfall and storage records from the repository CSV. They are historical observations, not live readings.</p></div></div><div class="recommendation warn"><span class="rec-icon">◷</span><div><strong>Predictions require validation</strong><p>A one-year outlook needs a validated model, forecast horizon, confidence and update timestamp.</p></div></div><div class="recommendation"><span class="rec-icon">✓</span><div><strong>Model evaluation</strong><p>Test predictions on chronological holdout periods before presenting forecast claims.</p></div></div>';
   const controls='<div class="scenario-controls"><div><label for="rain-slider">Rainfall change (%)</label><input id="rain-slider" type="range" min="-50" max="100" value="20"><output id="rain-value">+20%</output></div><div><label for="demand-slider">Demand change (%)</label><input id="demand-slider" type="range" min="-30" max="50" value="0"><output id="demand-value">0%</output></div><div><label for="capacity-slider">Usable capacity (%)</label><input id="capacity-slider" type="range" min="20" max="100" value="75"><output id="capacity-value">75%</output></div></div><div class="scenario-result"><small>Illustrative scenario index · not a forecast</small><strong id="scenario-result">Balanced input</strong><small id="scenario-detail">Adjust assumptions to compare an illustrative score only.</small></div>';
   return '<div class="workspace-toolbar"><div><strong>Trends & outlook · '+esc(state.tank.name)+'</strong><small>'+monthRangeLabel()+' · historical data</small></div><button type="button" class="toolbar-button" data-print-pdf>Print / Save as PDF ↗</button></div><p class="print-only">Tank: '+esc(state.tank.name)+' · PIN '+esc(state.tank.pin)+' · Reporting period: '+monthRangeLabel()+' · Source: repository historical CSV, not live telemetry.</p><div class="panel-grid">'+card("Hydrology and storage signals","Historical CSV readings for the selected tank · not a forecast",canvas("trend-chart"))+card("How to read this view","Separate evidence from forecasts",notes)+'</div>'+card("Monthly data summary","Aggregated from the selected tank's daily historical CSV readings",trendSummary())+card("Scenario explorer","Hypothetical inputs — not an operational recommendation",controls);
  }
  function actions(){
   let list;
   if(state.role==="authority")list=[["Validate data freshness","Check timestamps, units and gaps in tank and rainfall records."],["Verify channel condition","Confirm siltation, encroachment and structural safety on site."],["Review flood pathways","Check downstream exposure and official warning thresholds."],["Compare storage options","Balance retention and release against demand and rules."],["Verify water quality","Review recent tests and intended use."],["Publish approved advice","Share verified schedules, warnings and follow-up status."]];
   else if(state.role==="farmer")list=[["Check soil moisture","Use field observations and crop stage to guide irrigation."],["Review local forecast","Check official rainfall and flood warnings."],["Inspect drainage","Prepare drainage before heavy rain; keep away from flooded channels."],["Confirm usable water","Check approved irrigation schedule and quality restrictions."]];
   else list=[["Check official supply notices","Confirm your provider’s schedule and interruption updates."],["Reduce avoidable use","Fix leaks and use water efficiently."],["Prepare for rain safely","Keep drains clear and follow official flood guidance."],["Check water suitability","Do not drink untested or untreated water."]];
   const checklist='<div class="action-list">'+list.map(a=>'<label class="action-check"><input type="checkbox"><span><strong>'+esc(a[0])+'</strong><small>'+esc(a[1])+'</small></span></label>').join("")+'</div>';
   return '<div class="risk-banner"><span class="risk-badge">ACTION WORKSPACE</span><div><strong>Practical prompts, not official alerts</strong><p>Final advice must use verified local conditions.</p></div></div>'+card("Action checklist","Mark items as you complete them",checklist);
  }
  function reports(){
   const exportToolbar='<div class="workspace-toolbar"><div><strong>Feedback & reports</strong><small>Print this workspace or export the report register.</small></div><div class="toolbar-actions"><button type="button" class="toolbar-button secondary" data-export-csv>Download reports CSV</button><button type="button" class="toolbar-button" data-print-pdf>Print / Save as PDF ↗</button></div></div><p class="print-only">Feedback & reports · Workspace: '+esc(roles[state.role].title)+' · Generated '+esc(new Date().toLocaleString())+'</p>';
   if(state.role==="authority"){
    const all=state.reports,visible=all.filter(r=>state.reportFilter==="all"||r.audience===state.reportFilter);
    const counts={all:all.length,household:all.filter(r=>r.audience==="household").length,farmer:all.filter(r=>r.audience==="farmer").length};
    const toolbar='<div class="report-toolbar"><div><strong>Community inbox</strong><p>Review, reply and track reports from households and farmers.</p></div><label for="report-filter">Filter inbox<select id="report-filter"><option value="all" '+(state.reportFilter==="all"?"selected":"")+' >All reports ('+counts.all+')</option><option value="household" '+(state.reportFilter==="household"?"selected":"")+' >Households ('+counts.household+')</option><option value="farmer" '+(state.reportFilter==="farmer"?"selected":"")+' >Farmers ('+counts.farmer+')</option></select></label></div>';
    const workflow='<div class="recommendation"><span class="rec-icon">↗</span><div><strong>1. Receive</strong><p>Each report keeps its audience, tank, category and date.</p></div></div><div class="recommendation warn"><span class="rec-icon">✓</span><div><strong>2. Review and reply</strong><p>Add multiple replies without overwriting earlier updates.</p></div></div><div class="recommendation"><span class="rec-icon">↻</span><div><strong>3. Close the loop</strong><p>Replies are shown to the submitting audience and authority workspace.</p></div></div>';
    return exportToolbar+'<div class="metric-grid">'+metric("TOTAL REPORTS",String(counts.all),"Saved in this browser")+metric("HOUSEHOLD REPORTS",String(counts.household),"Household submissions")+metric("FARMER REPORTS",String(counts.farmer),"Farmer submissions")+'</div>'+card("Report inbox","Review each submission, reply and update its status",toolbar+'<div id="report-inbox-results">'+(visible.length?visible.map(r=>reportCard(r,true)).join(""):'<div class="empty-state"><strong>No reports match this filter</strong><p>New submissions will appear here.</p></div>')+'</div>')+card("Feedback workflow","Receive → review → reply → resolve",workflow);
   }
   const form='<form id="report-form"><div class="input-row"><label for="report-type">Report category</label><select id="report-type" required><option>Water shortage</option><option>Supply interruption</option><option>Channel blockage</option><option>Water quality concern</option><option>Flooding / overflow</option><option>Other observation</option></select></div><div class="input-row"><label for="report-pin">Tank / nearby eri</label><select id="report-pin" required>'+tanks.map(t=>'<option value="'+esc(t.id)+'" '+((state.tank?.id===t.id)?"selected":"")+'>'+esc(t.pin)+' — '+esc(t.name)+'</option>').join("")+'</select><small>Select the specific tank closest to the issue.</small></div><div class="input-row"><label for="report-detail">Problem / report details</label><textarea id="report-detail" placeholder="Describe what happened, where and when. Avoid sensitive personal details." required></textarea></div><button class="form-button" type="submit">Submit report</button><div class="form-status" id="form-status" aria-live="polite">'+esc(state.formNotice||"")+'</div></form>';
   const helper='<div class="recommendation"><span class="rec-icon">↗</span><div><strong>1. Submit your report</strong><p>Choose the specific tank, category and clear details.</p></div></div><div class="recommendation warn"><span class="rec-icon">✓</span><div><strong>2. Authority reviews it</strong><p>Authorized staff update status and add replies.</p></div></div><div class="recommendation"><span class="rec-icon">↻</span><div><strong>3. Track progress</strong><p>Print or save your report and reply history as a PDF.</p></div></div>';
   return exportToolbar+'<div class="report-privacy-note"><span>🔒</span><p><strong>Storage note:</strong> Reports persist in this browser and can be exported to CSV. Cross-device sharing requires a connected backend.</p></div><div class="field-grid">'+card("Send feedback","Your report is routed to the water authority, not the other audience",form)+card("What happens next","Submit → authority review → reply",helper)+'</div>'+card("My reports and replies","Only reports from your own audience appear here",reportTable());
  }
  function reportTable(){
   const visible=state.reports.filter(r=>state.role==="authority"||r.audience===state.role);
   if(!visible.length)return '<div class="empty-state"><span class="empty-icon">✓</span><strong>No reports in this view yet</strong><p>New submissions will appear here.</p></div>';
   return '<div class="report-list">'+visible.map(r=>reportCard(r,state.role==="authority")).join("")+'</div>';
  }
  function reportCard(r,authority){
   const status=r.status||"Received",tank=tanks.find(t=>t.id===r.tankId)||tanks.find(t=>t.pin===r.pin),replies=Array.isArray(r.replies)?r.replies:(r.reply?[{text:r.reply,date:r.replyDate||""}]:[]);
   const replyHistory=replies.length?'<div class="reply-history"><strong>Authority reply history ('+replies.length+')</strong>'+replies.map((reply,i)=>'<div class="reply-entry"><small>Reply '+(i+1)+(reply.date?' · '+esc(reply.date):'')+'</small><p>'+esc(reply.text||"")+'</p></div>').join("")+'</div>':'<p class="no-reply">No authority replies yet.</p>';
   return '<article class="report-card" data-report-card="'+r.id+'"><div class="report-card-head"><div><span class="report-type-pill">'+esc(r.type)+'</span><span class="report-audience">'+(r.audience==="farmer"?"Farmer report":"Household report")+'</span></div><span class="status-pill '+(status==="Resolved"?"resolved":status==="In review"?"in-review":"pending")+'">'+esc(status)+'</span></div><h4>'+esc(r.type)+' · '+esc(r.tankName||tank?.name||"Tank not specified")+'</h4><p class="report-detail">'+esc(r.detail)+'</p><div class="report-meta"><span>Tank ID <strong>'+esc(r.tankId||tank?.id||"N/A")+'</strong></span><span>PIN <strong>'+esc(r.pin)+'</strong></span><span>'+esc(r.date)+'</span></div>'+replyHistory+(authority?'<div class="authority-tools"><label for="status-'+r.id+'">Report status</label><select id="status-'+r.id+'" data-report-status="'+r.id+'"><option value="Received" '+(status==="Received"?"selected":"")+' >Received</option><option value="In review" '+(status==="In review"?"selected":"")+' >In review</option><option value="Resolved" '+(status==="Resolved"?"selected":"")+' >Resolved</option></select><label for="reply-'+r.id+'">Add another reply to '+(r.audience==="farmer"?"farmer":"household")+'</label><textarea id="reply-'+r.id+'" data-report-reply="'+r.id+'" placeholder="Enter a new reply; previous replies remain in the history"></textarea><div class="authority-actions"><button type="button" class="form-button" data-save-reply="'+r.id+'">Add reply</button></div></div>':'')+'</article>';
  }
  function monthRangeLabel(){const names=Array.from({length:12},(_,i)=>new Date(2025,i,1).toLocaleDateString(state.role==="farmer"&&state.farmerLanguage==="ta"?"ta-IN":"en-IN",{month:"long"}));return state.chartStartMonth===0&&state.chartEndMonth===11?"January–December 2025":names[state.chartStartMonth]+"–"+names[state.chartEndMonth]+" 2025";}
  function trendSummary(){
   const rows=historicalRows.filter(r=>r.tank_id===state.tank.id&&Number.isFinite(r.timestamp)&&new Date(r.timestamp).getMonth()>=state.chartStartMonth&&new Date(r.timestamp).getMonth()<=state.chartEndMonth);
   const groups=new Map();
   rows.forEach(r=>{const d=new Date(r.timestamp),key=d.getFullYear()+"-"+String(d.getMonth()+1).padStart(2,"0"),g=groups.get(key)||{month:d.toLocaleDateString("en-IN",{month:"long",year:"numeric"}),rain:0,storage:[],days:0};g.rain+=Number(r.rainfall_mm)||0;g.storage.push(Number(r.current_storage_mcm)||0);g.days++;groups.set(key,g);});
   if(!groups.size)return '<p class="chart-message">No historical rows are available for this month range.</p>';
   return '<div class="table-wrap trend-summary-table"><table><thead><tr><th>Month</th><th>Rainfall total (mm)</th><th>Average storage (MCM)</th><th>Peak storage (MCM)</th><th>Days</th></tr></thead><tbody>'+[...groups.values()].map(g=>'<tr><td>'+esc(g.month)+'</td><td>'+g.rain.toFixed(1)+'</td><td>'+(g.storage.reduce((a,b)=>a+b,0)/g.storage.length).toFixed(2)+'</td><td>'+Math.max(...g.storage).toFixed(2)+'</td><td>'+g.days+'</td></tr>').join("")+'</tbody></table></div>';
  }
  function csvCell(value){const text=String(value??"");return '"'+text.replace(/"/g,'""')+'"';}
  function downloadReportsCSV(){
   const headers=["Report ID","Category","Audience","Tank name","Tank ID","PIN","Problem / report details","Submitted at","Status","Authority replies (same report row)","Latest reply date"];
   const exportRows=state.reports.filter(r=>state.role==="authority"||r.audience===state.role);
   const rows=exportRows.map(r=>{const tank=tanks.find(t=>t.id===r.tankId)||tanks.find(t=>t.pin===r.pin),replies=Array.isArray(r.replies)?r.replies:(r.reply?[{text:r.reply,date:r.replyDate||""}]:[]);return [r.id,r.type,r.audience,r.tankName||tank?.name||"",r.tankId||tank?.id||"",r.pin,r.detail,r.date,r.status||"Received",replies.map((x,i)=>"Reply "+(i+1)+" ("+(x.date||"date not recorded")+"): "+(x.text||"")).join("\n"),replies.length?replies[replies.length-1].date||"":""].map(csvCell).join(",");});
   const csv="\uFEFF"+[headers.map(csvCell).join(","),...rows].join("\r\n"),blob=new Blob([csv],{type:"text/csv;charset=utf-8;"}),url=URL.createObjectURL(blob),a=document.createElement("a");a.href=url;a.download="AWWE_feedback_reports_"+new Date().toISOString().slice(0,10)+".csv";document.body.appendChild(a);a.click();a.remove();URL.revokeObjectURL(url);
  }
  function panel(){
    if(state.panel==="overview") return state.role==="authority" ? authority() : state.role==="farmer" ? farmer() : household();
    if(state.panel==="trends") return trends();
    if(state.panel==="actions") return actions();
    if(state.panel==="reports") return reports();
    return '<div class="empty-state"><strong>Section not found</strong><p>Choose another workspace section.</p></div>';
  }
  function renderChart(id,labels,sets,axisLabels={}){
   if(state.charts[id]){state.charts[id].destroy();delete state.charts[id];}
   const el=document.getElementById(id);if(!el)return;
   if(!repositoryDataReady||!historicalRows.length){
    el.parentElement.innerHTML='<div class="chart-message">'+esc(repositoryDataError||"Loading historical CSV data…")+'</div>';
    return;
   }
   if(!window.Chart){el.parentElement.innerHTML='<div class="chart-message">Chart library did not load. Check your internet connection and reload.</div>';return;}
   const scales={
    x:{grid:{display:false},ticks:{maxTicksLimit:7,color:"#879285",font:{family:"DM Sans",size:8}},border:{display:false}},
    y:{grid:{color:"#eff0e7"},ticks:{color:"#879285",font:{family:"DM Sans",size:8}},border:{display:false},title:{display:!!axisLabels.y,text:axisLabels.y||""}}
   };
   if(sets.some(set=>set.axis==="y1"))scales.y1={position:"right",grid:{drawOnChartArea:false},ticks:{color:"#879285",font:{family:"DM Sans",size:8}},border:{display:false},title:{display:!!axisLabels.y1,text:axisLabels.y1||""}};
   state.charts[id]=new Chart(el.getContext("2d"),{type:"line",data:{labels,datasets:sets.map(set=>({label:set.label,data:set.data,yAxisID:set.axis||"y",borderColor:set.color,backgroundColor:set.color+"20",borderWidth:2,fill:!!set.fill,tension:.25,pointRadius:0,pointHoverRadius:4,spanGaps:false}))},options:{responsive:true,maintainAspectRatio:false,interaction:{mode:"index",intersect:false},plugins:{legend:{display:true,position:"bottom",labels:{boxWidth:8,boxHeight:8,usePointStyle:true,font:{family:"DM Sans",size:9},color:"#68796a",padding:14}},tooltip:{backgroundColor:"#284b3a",bodyFont:{family:"DM Sans",size:10},padding:10,cornerRadius:8}},scales}});
   state.chart=state.charts[id];
  }
  function charts(){
   const selected=state.tank;
   if(!selected||!repositoryDataReady||!historicalRows.length){
    if(state.panel==="overview")renderChart("main-chart",[],[]);
    if(state.panel==="trends")renderChart("trend-chart",[],[]);
    return;
   }
   const inSelectedMonths=row=>{const month=new Date(row.timestamp).getMonth();return month>=state.chartStartMonth&&month<=state.chartEndMonth;};
   const selectedRows=historicalRows.filter(row=>row.tank_id===selected.id&&inSelectedMonths(row)).sort((a,b)=>a.timestamp-b.timestamp);
   if(state.panel==="overview"){
    if(state.role==="authority"){
     const daily=new Map();
     historicalRows.filter(inSelectedMonths).forEach(row=>{const current=daily.get(row.timestamp)||{storage:0};current.storage+=Number(row.current_storage_mcm)||0;daily.set(row.timestamp,current);});
     const points=[...daily.entries()].sort((a,b)=>a[0]-b[0]);
     const capacity=tanks.reduce((sum,t)=>sum+t.capacity,0);
     renderChart("main-chart",points.map(([date])=>shortDate(date)),[
      {label:"Recorded total storage (MCM)",data:points.map(([,v])=>+v.storage.toFixed(2)),color:"#4b8c7e",fill:true},
      {label:"Listed total capacity (MCM)",data:points.map(()=>+capacity.toFixed(2)),color:"#c69b58"}
     ],{y:"Storage (MCM)"});
     const authorityRows=historicalRows.filter(row=>row.tank_id===selected.id&&inSelectedMonths(row)).sort((a,b)=>a.timestamp-b.timestamp);
     const labels=authorityRows.map(row=>shortDate(row.timestamp));
     renderChart("authority-hydrology-chart",labels,[
      {label:"Rainfall (mm)",data:authorityRows.map(row=>Number(row.rainfall_mm)),color:"#6d9f95",fill:true},
      {label:"Storage (MCM)",data:authorityRows.map(row=>Number(row.current_storage_mcm)),color:"#c69b58",axis:"y1"},
      {label:"Inflow (m³/s)",data:authorityRows.map(row=>Number(row.inflow_cumecs)),color:"#4b8c7e"},
      {label:"Irrigation outflow (m³/s)",data:authorityRows.map(row=>Number(row.irrigation_outflow_cumecs)),color:"#ba8354"},
      {label:"Spillway discharge (m³/s)",data:authorityRows.map(row=>Number(row.spillway_discharge_cumecs)),color:"#8a79aa"}
     ],{y:"Rainfall / flow (recorded units)",y1:"Storage (MCM)"});
     renderChart("authority-risk-chart",labels,[
      {label:"Flood-risk index (CSV)",data:authorityRows.map(row=>Number(row.flood_risk_index)),color:"#b85f4a",fill:true},
      {label:"Scarcity-risk index (CSV)",data:authorityRows.map(row=>Number(row.scarcity_risk_index)),color:"#bd8c3f"}
     ],{y:"Recorded index value"});
     renderChart("authority-groundwater-chart",labels,[
      {label:"Groundwater-table depth (m)",data:authorityRows.map(row=>Number(row.groundwater_table_depth_m)),color:"#498b82",fill:true},
      {label:"Evaporation rate (CSV mm)",data:authorityRows.map(row=>Number(row.evaporation_rate_mm)),color:"#8a79aa",axis:"y1"}
     ],{y:"Groundwater depth (m)",y1:"Evaporation (CSV mm)"});
    }else{
     renderChart("main-chart",selectedRows.map(row=>shortDate(row.timestamp)),[
      {label:"Recorded storage (MCM)",data:selectedRows.map(row=>Number(row.current_storage_mcm)),color:"#4d8b7e",fill:true},
      {label:"Listed capacity (MCM)",data:selectedRows.map(()=>selected.capacity),color:"#c6a26a"}
     ],{y:"Storage (MCM)"});
    }
   }
   if(state.panel==="trends"){
    renderChart("trend-chart",selectedRows.map(row=>shortDate(row.timestamp)),[
     {label:state.role==="farmer"&&state.farmerLanguage==="ta"?"பதிவான மழைப்பொழிவு (மிமீ)":"Recorded rainfall (mm)",data:selectedRows.map(row=>Number(row.rainfall_mm)),color:"#6d9f95",fill:true},
     {label:state.role==="farmer"&&state.farmerLanguage==="ta"?"பதிவான நீர் இருப்பு (மில்லியன் கன மீட்டர்)":"Recorded storage (MCM)",data:selectedRows.map(row=>Number(row.current_storage_mcm)),color:"#c6a26a",axis:"y1"}
    ],{y:state.role==="farmer"&&state.farmerLanguage==="ta"?"மழைப்பொழிவு (மிமீ)":"Rainfall (mm)",y1:state.role==="farmer"&&state.farmerLanguage==="ta"?"நீர் இருப்பு (மில்லியன் கன மீட்டர்)":"Storage (MCM)"});
   }
  }
  function scenario(){
   const rain=Number($("#rain-slider")?.value||0),demand=Number($("#demand-slider")?.value||0),capacity=Number($("#capacity-slider")?.value||75);
   if($("#rain-value"))$("#rain-value").textContent=(rain>0?"+":"")+rain+"%";
   if($("#demand-value"))$("#demand-value").textContent=(demand>0?"+":"")+demand+"%";
   if($("#capacity-value"))$("#capacity-value").textContent=capacity+"%";
   const score=rain*.55-demand*.8+(capacity-75)*.65;
   if($("#scenario-result"))$("#scenario-result").textContent=state.role==="farmer"&&state.farmerLanguage==="ta"?(score>18?"இந்த அனுமானங்களின்படி நீரைத் தேக்குவதற்கான வாய்ப்பு அதிகம்":score< -18?"இந்த அனுமானங்களின்படி நீர் பற்றாக்குறை அழுத்தம் அதிகம்":"சமநிலையான அனுமானங்கள்"):(score>18?"More retention potential under these assumptions":score< -18?"Greater scarcity pressure under these assumptions":"Balanced input assumptions");
   if($("#scenario-detail"))$("#scenario-detail").textContent=(state.role==="farmer"&&state.farmerLanguage==="ta"?"விளக்க மதிப்பெண் ":"Illustrative score ")+score.toFixed(1)+(state.role==="farmer"&&state.farmerLanguage==="ta"?". இது உண்மையான நீர்நிலை நடத்தையையோ நீரியல் பாதுகாப்பையோ கணிக்காது.":". This does not predict actual tank behaviour or model hydraulic safety.");
  }
  function bindPanel(){
   document.querySelectorAll("[data-print-pdf]").forEach(btn=>btn.addEventListener("click",()=>window.print()));
   document.querySelectorAll("[data-export-csv]").forEach(btn=>btn.addEventListener("click",downloadReportsCSV));
   const monthFrom=$("#chart-from-month"),monthTo=$("#chart-to-month"),fullYear=$("#chart-full-year");
   if(monthFrom)monthFrom.addEventListener("change",()=>{state.chartStartMonth=Number(monthFrom.value);if(state.chartStartMonth>state.chartEndMonth)state.chartEndMonth=state.chartStartMonth;refresh();});
   if(monthTo)monthTo.addEventListener("change",()=>{state.chartEndMonth=Number(monthTo.value);if(state.chartEndMonth<state.chartStartMonth)state.chartStartMonth=state.chartEndMonth;refresh();});
   if(fullYear)fullYear.addEventListener("click",()=>{state.chartStartMonth=0;state.chartEndMonth=11;refresh();});
   const filter=$("#report-filter");
   if(filter)filter.addEventListener("change",()=>{state.reportFilter=filter.value;refresh();});
   document.querySelectorAll("[data-save-reply]").forEach(btn=>btn.addEventListener("click",()=>{
    const id=Number(btn.dataset.saveReply), report=state.reports.find(r=>r.id===id);
    if(!report)return;
    const reply=document.querySelector('[data-report-reply="'+id+'"]');
    const status=document.querySelector('[data-report-status="'+id+'"]');
    const replyText=reply?reply.value.trim():"";
    report.replies=Array.isArray(report.replies)?report.replies:[];
    if(replyText)report.replies.push({text:replyText,date:new Date().toLocaleString()});
    report.status=status?status.value:(report.status||"Received");
    saveReports();
    refresh();
   }));
   document.querySelectorAll("[data-report-status]").forEach(sel=>sel.addEventListener("change",()=>{
    const report=state.reports.find(r=>r.id===Number(sel.dataset.reportStatus));
    if(report){report.status=sel.value;saveReports();}
   }));
   document.querySelectorAll("[data-pin]").forEach(btn=>btn.addEventListener("click",()=>{
    state.pin=btn.dataset.pin;const match=tanks.find(t=>t.pin===state.pin);if(match)state.tank=match;refresh();
   }));
   document.querySelectorAll(".map-tank,.tank-index-item").forEach(btn=>btn.addEventListener("click",()=>{
    state.tank=tanks.find(t=>t.id===btn.dataset.tank)||state.tank;state.pin=state.tank.pin;refresh();
   }));
   document.querySelectorAll('#dash-panel input[type="range"]').forEach(el=>el.addEventListener("input",scenario));
   const form=$("#report-form");
   if(form)form.addEventListener("submit",e=>{
    e.preventDefault();
    const reportId=state.nextReportId++;
    const selectedTank=tanks.find(t=>t.id===$("#report-pin").value)||tanks.find(t=>t.pin===$("#report-pin").value)||state.tank;
    state.reports.unshift({id:reportId,type:$("#report-type").value,pin:selectedTank.pin,tankId:selectedTank.id,tankName:selectedTank.name,detail:$("#report-detail").value.trim(),date:new Date().toLocaleString(),audience:state.role,status:"Received",replies:[]});
    saveReports();
    state.formNotice="Submitted successfully · Reference AWWE-"+String(reportId).padStart(4,"0")+". Visible in this browser session.";
    refresh();
   });
  }
  function refresh(){const root=$("#dash-panel");if(root){destroyCharts();root.innerHTML=panel();bindPanel();charts();translateFarmerWorkspace();const langButton=$("#farmer-language-toggle");if(langButton){langButton.hidden=state.role!=="farmer";langButton.textContent=state.farmerLanguage==="en"?"தமிழ்":"English";langButton.setAttribute("aria-label",state.farmerLanguage==="en"?"தமிழில் காண்க":"View in English");}const ta=state.role==="farmer"&&state.farmerLanguage==="ta";$("#dash-kicker").textContent=ta?"விவசாயம் / வயல் பணியிடம்":roles[state.role].label;$("#dashboard-title").textContent=ta?"உங்கள் வயலுக்கான நீர் நிலவரம்":roles[state.role].title;$("#dash-description").textContent=ta?"அபாயத்தைப் புரிந்துகொண்டு, இன்று எடுக்க வேண்டிய நடவடிக்கையைத் தீர்மானிக்கவும்.":roles[state.role].description;const labels={overview:ta?"கண்ணோட்டம்":"Overview",trends:ta?"போக்குகள் மற்றும் முன்னோக்கு":"Trends & outlook",actions:ta?"பரிந்துரைக்கப்படும் நடவடிக்கைகள்":"Recommended actions",reports:ta?"கருத்துகள் மற்றும் அறிக்கைகள்":"Feedback & reports"};document.querySelectorAll(".side-link").forEach(b=>{const icon=b.querySelector("span");b.innerHTML=(icon?icon.outerHTML:"")+labels[b.dataset.panel];});$("#change-role").textContent=ta?"பணியிடத்தை மாற்று ↗":"Switch workspace ↗";}}
  function open(role){
   state.role=role||state.role;state.panel="overview";const info=roles[state.role],modal=$("#dashboard-modal");
   modal.classList.add("open");modal.setAttribute("aria-hidden","false");document.body.style.overflow="hidden";
   $("#dash-kicker").textContent=info.label;$("#dashboard-title").textContent=info.title;$("#dash-description").textContent=info.description;
   $("#location-bar").outerHTML=info.location?pinBar():authorityPinBar();
   $$(".side-link").forEach(b=>b.classList.toggle("active",b.dataset.panel==="overview"));refresh();
  }
  function close(){const modal=$("#dashboard-modal");modal.classList.remove("open");modal.setAttribute("aria-hidden","true");document.body.style.overflow="";destroyCharts();}
  function applyPin(){
   const input=$("#postcode");if(!input)return;
   const raw=input.value.trim().toLowerCase();
   const exactTank=tanks.find(t=>(t.pin+" — "+t.name).toLowerCase()===raw||t.name.toLowerCase()===raw);
   const pinMatch=raw.match(/\b\d{6}\b/);
   const pin=exactTank?exactTank.pin:(pinMatch?pinMatch[0]:"");
   if(!pin){const msg=$("#postcode-message");if(msg)msg.textContent="Choose a listed tank or enter a valid six-digit PIN.";return;}
   state.pin=pin;
   state.tank=exactTank||tanks.find(t=>t.pin===pin)||state.tank;
   refresh();
   const msg=$("#postcode-message");if(msg)msg.textContent=exactTank?"Selected "+exactTank.name+" · PIN "+pin:tanks.filter(t=>t.pin===pin).length+" tank record(s) found for PIN "+pin+".";
  }
  document.addEventListener("click",e=>{
   if(e.target.closest("#farmer-language-toggle")){state.farmerLanguage=state.farmerLanguage==="en"?"ta":"en";refresh();return;}
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
  window.addEventListener("resize",()=>{Object.values(state.charts).forEach(chart=>chart.resize());});
  loadRepositoryData();
})();