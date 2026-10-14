const CATALOG = {
  maps: {
    title:"Map Explorations", subtitle:"Choose regions, set your current progress, and calculate the remaining completion estimate.",
    kind:"maps", groups:[
      {name:"Starter Regions",items:[["Central Plains",250],["Whining Aix's Mire",300],["Dim Forest",300],["Desorock Highland",350]]},
      {name:"Advanced Regions",items:[["Wuming Bay",400],["Norfall Barrens",450],["Penitent's End",500],["Black Shores",600]]}
    ]
  },
  events: {
    title:"Events",subtitle:"Select the event tasks you want included in your service request.",
    kind:"checks",groups:[
      {name:"Event Objectives",items:[["Event progression",250],["Daily event tasks",100],["Challenge stage clear",200],["Limited-time rewards",250]]},
      {name:"Additional Requests",items:[["Full event completion",500],["Optional challenge objectives",200],["Reward collection check",75]]}
    ]
  },
  endgame: {
    title:"Endgame",subtitle:"Choose the endgame activities you need help with. Tick any items to add them to your estimate.",
    kind:"checks",groups:[
      {name:"Combat & Challenges",items:[["Tower / endgame clear",350],["Weekly challenge",150],["Boss materials run",100],["Combat objective set",200]]},
      {name:"Completion",items:[["Full weekly endgame set",500],["Repeat run / farming session",200],["Custom endgame objective",0]]}
    ]
  },
  quests: {
    title:"Quests",subtitle:"Select story or side-quest assistance. Add any details for a more accurate service request.",
    kind:"checks",groups:[
      {name:"Quest Services",items:[["Main story quest",200],["Side quests",100],["Exploration-related quest",150],["Quest chain completion",300],["Puzzle / objective assistance",100]]}
    ]
  },
  other: {
    title:"Other Services",subtitle:"Describe a custom request and select any general service options that apply.",
    kind:"checks",groups:[
      {name:"Custom Services",items:[["Resource farming",150],["Build / materials preparation",200],["Achievement assistance",150],["Account progression assistance",250],["Custom request (quote needed)",0]]}
    ]
  }
};
const page = document.body.dataset.page;
const root = document.getElementById("app");
const money = n => "₱" + Number(n).toLocaleString("en-PH",{maximumFractionDigits:2});
function esc(s){return String(s).replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));}
function header(title,subtitle){return `<header class="page-head"><a class="back-link" href="index.html">← ALL SERVICES</a><p class="eyebrow">LILITH SERVICE ORDER</p><h1>${title}</h1><p class="sub">${subtitle}</p></header>`;}
function renderChecks(data){
 root.innerHTML=header(data.title,data.subtitle)+`<div class="field"><label for="player">Player / in-game name (optional)</label><input id="player" type="text" placeholder="Enter player name"></div><div class="field"><label for="server">Server / region (optional)</label><input id="server" type="text" placeholder="Enter server or region"></div><div class="grid">${data.groups.map((g,gi)=>`<section class="eg-card"><div class="eg-head"><span class="eg-title">${g.name}</span><span class="small">${g.items.length} OPTIONS</span></div><div class="eg-rows">${g.items.map((it,i)=>`<label class="eg-row"><input type="checkbox" data-name="${esc(it[0])}" data-price="${it[1]}"><span>${esc(it[0])}</span><span class="price">${it[1]===0?"Quote":money(it[1])}</span></label>`).join("")}</div></section>`).join("")}</div>${data.kind==="checks"&&page==="other"?`<div class="field"><label for="details">Custom request details</label><textarea id="details" placeholder="Describe what you need..."></textarea></div>`:""}${summaryBlock()}`;
 bindSummary(data.title);
}
function renderMaps(data){
 root.innerHTML=header(data.title,data.subtitle)+`<div class="field"><label for="player">Player / in-game name (optional)</label><input id="player" type="text" placeholder="Enter player name"></div><div class="field"><label for="server">Server / region (optional)</label><input id="server" type="text" placeholder="Enter server or region"></div><p class="section-label">Select regions to include</p><div class="toolbar"><button class="tool-btn" id="all">Select all</button><button class="tool-btn" id="none">Clear selection</button></div><div class="grid">${data.groups.map((g,gi)=>`<section class="card"><h3>${g.name}</h3><p>Set your current completion percentage. Estimate uses remaining percentage of the sample full-clear price.</p>${g.items.map((it,i)=>`<div class="field"><label><input type="checkbox" class="map-enabled" data-name="${esc(it[0])}" data-price="${it[1]}"> ${esc(it[0])} <span style="float:right;color:var(--gold)">${money(it[1])} full clear</span></label><input class="progress" type="range" min="0" max="100" step="1" value="0" aria-label="${esc(it[0])} progress"><div class="small">Progress: <strong class="pct">0%</strong> · Remaining estimate: <strong class="remain">${money(it[1])}</strong></div></div>`).join("")}</section>`).join("")}</div>${summaryBlock()}`;
 const update=()=>{document.querySelectorAll(".card").forEach(card=>card.querySelectorAll(".field").forEach(f=>{const cb=f.querySelector(".map-enabled"),range=f.querySelector(".progress");if(!cb||!range)return;f.querySelector(".pct").textContent=range.value+"%";f.querySelector(".remain").textContent=money(Number(cb.dataset.price)*(100-Number(range.value))/100)}));updateSummary(data.title)};
 document.querySelectorAll(".map-enabled,.progress").forEach(el=>el.addEventListener("input",update));
 document.getElementById("all").onclick=()=>{document.querySelectorAll(".map-enabled").forEach(x=>x.checked=true);update()};
 document.getElementById("none").onclick=()=>{document.querySelectorAll(".map-enabled").forEach(x=>x.checked=false);update()};
 bindSummary(data.title,update);update();
}
function summaryBlock(){return `<section class="summary"><div class="summary-top"><h2>Order Summary</h2><span class="small">ESTIMATE ONLY · CONFIRM FINAL PRICE WITH LILITH</span></div><div class="summary-items"><div class="summary-item"><div class="sl">SELECTED ITEMS</div><div class="sv teal" id="count">0</div></div><div class="summary-item"><div class="sl">ESTIMATED TOTAL</div><div class="sv" id="total">₱0</div></div></div><p class="summary-note">Review your selections, then generate your order message. Prices shown are starter examples and should be edited to match your actual service price list.</p><div class="toolbar"><button class="btn primary" id="generate">Generate order summary</button><button class="btn" id="copy">Copy summary</button><button class="btn" id="send">Send via email</button></div><textarea class="output" id="output" readonly placeholder="Your generated service order will appear here..."></textarea></section><footer>LILITH SERVICES <span>◆</span> PLEASE CONFIRM AVAILABILITY AND FINAL PRICE BEFORE PAYMENT</footer>`}
function bindSummary(title,after){const gen=()=>{const selected=[...document.querySelectorAll('input[type=checkbox]:checked')];let total=0,lines=[];selected.forEach(cb=>{if(cb.classList.contains("map-enabled")){const range=cb.closest(".field").querySelector(".progress");const cost=Number(cb.dataset.price)*(100-Number(range.value))/100;total+=cost;lines.push(`• ${cb.dataset.name}: ${range.value}% complete — ${money(cost)} remaining`)}else{const p=Number(cb.dataset.price);total+=p;lines.push(`• ${cb.dataset.name}: ${p===0?"Quote required":money(p)}`)}});const player=document.getElementById("player")?.value.trim()||"Not provided";const server=document.getElementById("server")?.value.trim()||"Not provided";const details=document.getElementById("details")?.value.trim();return `LILITH SERVICES — ORDER REQUEST\nService: ${title}\nPlayer name: ${player}\nServer / region: ${server}\n\nRequested items:\n${lines.length?lines.join("\n"):"• No items selected"}${details?`\n\nCustom details:\n${details}`:""}\n\nEstimated total: ${money(total)}\nPlease confirm availability, final pricing, and service details.`};
 const update=()=>{const selected=[...document.querySelectorAll('input[type=checkbox]:checked')];document.getElementById("count").textContent=selected.length;let total=0;selected.forEach(cb=>{if(cb.classList.contains("map-enabled")){const range=cb.closest(".field").querySelector(".progress");total+=Number(cb.dataset.price)*(100-Number(range.value))/100}else total+=Number(cb.dataset.price)});document.getElementById("total").textContent=money(total);if(after)after()};
 document.querySelectorAll('input[type=checkbox],.progress').forEach(el=>el.addEventListener("input",update));
 document.getElementById("generate").onclick=()=>{document.getElementById("output").value=gen()};
 document.getElementById("copy").onclick=async()=>{const out=document.getElementById("output");if(!out.value)out.value=gen();try{await navigator.clipboard.writeText(out.value);document.getElementById("copy").textContent="Copied ✓"}catch{out.focus();out.select();document.execCommand("copy");document.getElementById("copy").textContent="Copy attempted"}};
 document.getElementById("send").onclick=()=>{const out=document.getElementById("output");if(!out.value)out.value=gen();location.href="mailto:?subject="+encodeURIComponent("Lilith Services Order Request")+"&body="+encodeURIComponent(out.value)};
 update();
}
if(page==="maps")renderMaps(CATALOG.maps);else if(CATALOG[page])renderChecks(CATALOG[page]);
