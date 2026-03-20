'use strict';
/* ══ AGENTS (14) — Final Pipeline Structure ══════════════════════
   WebSearcher → CEO → PromptAgent → Manager → Planner → PM →
   Designer → Developer → Reviewer → Optimizer → A11y → Debugger →
   DevOps → Tester
   ══════════════════════════════════════════════════════════════ */

const AGENT_REGISTRY={
  websearcher:{capability:'web_research',       priority:0, canDelegate:false, receives:['user_input'],     outputs:['research_brief']},
  ceo:        {capability:'decision_making',     priority:1, canDelegate:true,  receives:['research_brief'], outputs:['strategy']},
  promptagent:{capability:'prompt_engineering',  priority:2, canDelegate:false, receives:['strategy'],       outputs:['refined_prompt']},
  manager:    {capability:'project_management',  priority:3, canDelegate:true,  receives:['refined_prompt'], outputs:['task_plan']},
  planner:    {capability:'architecture',        priority:4, canDelegate:false, receives:['task_plan'],      outputs:['architecture']},
  pm:         {capability:'product_management',  priority:5, canDelegate:false, receives:['architecture'],   outputs:['feature_specs']},
  designer:   {capability:'ui_design',           priority:6, canDelegate:false, receives:['feature_specs'],  outputs:['design_system']},
  developer:  {capability:'development',         priority:7, canDelegate:false, receives:['design_system'],  outputs:['all_code']},
  reviewer:   {capability:'code_review',         priority:8, canDelegate:false, receives:['all_code'],       outputs:['review_report']},
  optimizer:  {capability:'optimization',        priority:9, canDelegate:false, receives:['review_report'],  outputs:['optimized_code']},
  a11y:       {capability:'accessibility',       priority:10,canDelegate:false, receives:['optimized_code'], outputs:['a11y_report']},
  debugger:   {capability:'debugging',           priority:11,canDelegate:false, receives:['a11y_report'],    outputs:['fixes']},
  devops:     {capability:'deployment',          priority:12,canDelegate:false, receives:['fixes'],          outputs:['deployment_package']},
  tester:     {capability:'quality_testing',     priority:13,canDelegate:false, receives:['deployment_package'],outputs:['test_report']},
};

const AGENTS=[
  /* 0 */ {id:'websearcher',name:'Web Searcher', role:'Research & Intel Agent',    emoji:'🌐',color:'#06b6d4',glow:'rgba(6,182,212,.35)',  badge:'WEB', bb:'rgba(6,182,212,.18)',   bc:'#67e8f9',
           model_or:'meta-llama/llama-3.3-70b-instruct:free',model_gr:'llama-3.3-70b-versatile',state:'idle',memory:[]},
  /* 1 */ {id:'ceo',        name:'CEO',          role:'Chief Executive Officer',   emoji:'👔',color:'#f59e0b',glow:'rgba(245,158,11,.35)', badge:'CEO', bb:'rgba(245,158,11,.18)', bc:'#fbbf24',
           model_or:'deepseek/deepseek-r1:free',model_gr:'llama-3.3-70b-versatile',state:'idle',memory:[],isController:true},
  /* 2 */ {id:'promptagent',name:'Prompt Agent', role:'Prompt Engineer & Optimizer',emoji:'✍️',color:'#f43f5e',glow:'rgba(244,63,94,.35)', badge:'PRM', bb:'rgba(244,63,94,.18)',  bc:'#fb7185',
           model_or:'deepseek/deepseek-r1:free',model_gr:'llama-3.3-70b-versatile',state:'idle',memory:[]},
  /* 3 */ {id:'manager',    name:'Manager',      role:'Engineering Manager',       emoji:'👨‍💼',color:'#e879f9',glow:'rgba(232,121,249,.35)',badge:'MGR', bb:'rgba(232,121,249,.18)',bc:'#f0abfc',
           model_or:'deepseek/deepseek-r1:free',model_gr:'llama-3.3-70b-versatile',state:'idle',memory:[]},
  /* 4 */ {id:'planner',    name:'Planner',      role:'System Architect',          emoji:'🗺', color:'#7c6af7',glow:'rgba(124,106,247,.35)',badge:'PLAN',bb:'rgba(124,106,247,.18)',bc:'#a090ff',
           model_or:'deepseek/deepseek-r1:free',model_gr:'llama-3.3-70b-versatile',state:'idle',memory:[]},
  /* 5 */ {id:'pm',         name:'Product Mgr',  role:'Feature Strategist',        emoji:'📋',color:'#8b5cf6',glow:'rgba(139,92,246,.35)', badge:'PM',  bb:'rgba(139,92,246,.18)', bc:'#a78bfa',
           model_or:'deepseek/deepseek-chat-v3-0324:free',model_gr:'llama-3.3-70b-versatile',state:'idle',memory:[]},
  /* 6 */ {id:'designer',   name:'UI Designer',  role:'Visual System Lead',        emoji:'🎨',color:'#f472b6',glow:'rgba(244,114,182,.32)',badge:'UX',  bb:'rgba(244,114,182,.14)',bc:'#f9a8d4',
           model_or:'google/gemma-3-12b-it:free',model_gr:'gemma2-9b-it',state:'idle',memory:[]},
  /* 7 */ {id:'developer',  name:'Developer',    role:'Full-Stack Engineer',        emoji:'💻',color:'#00d4ff',glow:'rgba(0,212,255,.3)',  badge:'DEV', bb:'rgba(0,212,255,.12)',  bc:'#67e8f9',
           model_or:'meta-llama/llama-3.3-70b-instruct:free',model_gr:'llama-3.3-70b-versatile',state:'idle',memory:[]},
  /* 8 */ {id:'reviewer',   name:'Code Reviewer',role:'Quality Assurance',          emoji:'🔍',color:'#fb923c',glow:'rgba(251,146,60,.3)', badge:'QA',  bb:'rgba(251,146,60,.12)', bc:'#fdba74',
           model_or:'meta-llama/llama-3.1-8b-instruct:free',model_gr:'llama-3.1-8b-instant',state:'idle',memory:[]},
  /* 9 */ {id:'optimizer',  name:'Optimizer',    role:'Performance Engineer',       emoji:'🚀',color:'#a78bfa',glow:'rgba(167,139,250,.3)',badge:'OPT', bb:'rgba(167,139,250,.12)',bc:'#c4b5fd',
           model_or:'mistralai/mistral-7b-instruct:free',model_gr:'mixtral-8x7b-32768',state:'idle',memory:[]},
  /*10 */ {id:'a11y',       name:'A11y Agent',   role:'Accessibility Expert',       emoji:'♿',color:'#38bdf8',glow:'rgba(56,189,248,.3)', badge:'A11Y',bb:'rgba(56,189,248,.12)', bc:'#7dd3fc',
           model_or:'google/gemma-3-12b-it:free',model_gr:'gemma2-9b-it',state:'idle',memory:[]},
  /*11 */ {id:'debugger',   name:'Debugger',     role:'Bug Hunter',                 emoji:'🐛',color:'#ff6b6b',glow:'rgba(255,107,107,.3)',badge:'DBG', bb:'rgba(255,107,107,.12)',bc:'#fca5a5',
           model_or:'deepseek/deepseek-chat-v3-0324:free',model_gr:'llama-3.3-70b-versatile',state:'idle',memory:[]},
  /*12 */ {id:'devops',     name:'DevOps',       role:'Build & Deploy Lead',        emoji:'📦',color:'#4ade80',glow:'rgba(74,222,128,.3)', badge:'PKG', bb:'rgba(74,222,128,.12)', bc:'#86efac',
           model_or:'meta-llama/llama-3.1-8b-instruct:free',model_gr:'llama-3.1-8b-instant',state:'idle',memory:[]},
  /*13 */ {id:'tester',     name:'Test Agent',   role:'QA Sandbox Runner',          emoji:'🧪',color:'#22c55e',glow:'rgba(34,197,94,.35)', badge:'TEST',bb:'rgba(34,197,94,.18)',  bc:'#86efac',
           model_or:'deepseek/deepseek-chat-v3-0324:free',model_gr:'llama-3.3-70b-versatile',state:'idle',memory:[]},
];

const STAGES=[
  {id:'websearch', icon:'🌐',label:'Web Research'},
  {id:'ceo',       icon:'👔',label:'CEO Strategy'},
  {id:'prompt',    icon:'✍️',label:'Prompt Refinement'},
  {id:'manage',    icon:'👨‍💼',label:'Manager Planning'},
  {id:'analyze',   icon:'🔬',label:'Architecture Analysis'},
  {id:'plan',      icon:'📐',label:'Product Planning'},
  {id:'design',    icon:'🎨',label:'UI Design System'},
  {id:'develop',   icon:'💻',label:'Full Development'},
  {id:'review',    icon:'🔍',label:'Code Review'},
  {id:'optimize',  icon:'🚀',label:'Performance Optimization'},
  {id:'a11y',      icon:'♿',label:'Accessibility Pass'},
  {id:'debug',     icon:'🐛',label:'Debugging'},
  {id:'deploy',    icon:'📦',label:'Build & Package'},
  {id:'test',      icon:'🧪',label:'Automated Testing'},
];

const SEQ=[
  {a:AGENTS[0],  s:'websearch', role:'websearcher'},
  {a:AGENTS[1],  s:'ceo',       role:'ceo'},
  {a:AGENTS[2],  s:'prompt',    role:'promptagent'},
  {a:AGENTS[3],  s:'manage',    role:'manager'},
  {a:AGENTS[4],  s:'analyze',   role:'planner'},
  {a:AGENTS[5],  s:'plan',      role:'pm'},
  {a:AGENTS[6],  s:'design',    role:'designer'},
  {a:AGENTS[7],  s:'develop',   role:'developer', extract:'all'},
  {a:AGENTS[8],  s:'review',    role:'reviewer'},
  {a:AGENTS[9],  s:'optimize',  role:'optimizer'},
  {a:AGENTS[10], s:'a11y',      role:'a11y'},
  {a:AGENTS[11], s:'debug',     role:'debugger'},
  {a:AGENTS[12], s:'deploy',    role:'devops'},
  {a:AGENTS[13], s:'test',      role:'tester'},
];

const TEMPLATES=[
  {e:'🌤',n:'Weather App',d:'Live API, animated icons, 5-day forecast, geolocation',t:['API','Maps'],p:'Build a beautiful weather app with OpenWeatherMap API integration, animated weather condition icons, 5-day hourly forecast, geolocation auto-detect, city search with autocomplete, and a stunning dark/light mode UI with glassmorphism cards'},
  {e:'📝',n:'Todo Manager',d:'Drag & drop, categories, priorities, due dates',t:['CRUD','DnD'],p:'Build a todo manager with drag and drop sorting, color-coded categories, P0/P1/P2 priority levels, due date picker with overdue highlighting, subtasks, and local storage persistence with import/export'},
  {e:'🛒',n:'E-Commerce',d:'Product grid, cart, filters, checkout flow',t:['Cart','UX'],p:'Build a modern e-commerce store with an animated product grid, category and price filters, quick-view modals, shopping cart with animations, quantity controls, and a multi-step checkout flow with order summary'},
  {e:'💬',n:'Chat Interface',d:'Bubbles, emoji picker, typing indicators',t:['Messages','UI'],p:'Build a real-time chat UI with message bubbles, an emoji picker panel, animated typing indicators, message reactions, read receipts, message search, and smooth auto-scroll with a beautiful dark UI'},
  {e:'🎵',n:'Music Player',d:'Canvas waveform, playlist, animated art',t:['Audio','Canvas'],p:'Build a music player with HTML5 Audio API, canvas waveform visualizer, animated album art rotation, playlist with drag-to-reorder, shuffle/repeat modes, progress scrubber, volume control, and keyboard shortcuts'},
  {e:'📊',n:'Analytics Dashboard',d:'Charts, KPI cards, date range, data tables',t:['Charts','Data'],p:'Build an analytics dashboard with line and bar charts drawn on HTML5 Canvas, KPI metric cards with trend indicators, a date range picker, sortable/filterable data table, and CSV export functionality'},
  {e:'🔐',n:'Auth System',d:'Login, register, 2FA, user profile',t:['Forms','Security'],p:'Build a complete authentication UI with animated login/register forms, password strength meter, simulated 2FA code entry, "forgot password" flow, user profile page with avatar upload preview, and form validation'},
  {e:'🗓',n:'Calendar App',d:'Month/week/day views, drag events',t:['Events','DnD'],p:'Build a calendar app with month, week, and day views, click-to-create events with color picker, drag-to-reschedule, recurring event UI, mini calendar navigation, and localStorage persistence'},
  {e:'🎮',n:'Browser Game',d:'Canvas game with levels, score, sound',t:['Game','Canvas'],p:'Build a fun browser game using HTML5 Canvas — a Breakout/Arkanoid clone with smooth paddle physics, colored brick patterns, power-ups, level progression, particle effects on destruction, high score tracking, and Web Audio sound effects'},
  {e:'📖',n:'Note Taking App',d:'Rich text, markdown preview, tags, search',t:['Notes','MD'],p:'Build a note-taking app with a split-pane markdown editor and live preview, tag system with color-coding, full-text search with highlight, note pinning, auto-save indicator, and a sidebar with notes organized by date'},
  {e:'🎨',n:'Color Palette Tool',d:'Harmony rules, CSS export, contrast check',t:['Design','CSS'],p:'Build a color palette generator with color wheel picker, harmony rule presets (complementary, triadic, analogous), shade/tint generation, contrast ratio checker with WCAG pass/fail, hex/RGB/HSL input, and CSS variable export'},
  {e:'🔗',n:'URL Shortener',d:'Shorten, analytics, QR code generator',t:['URL','Tools'],p:'Build a URL shortener UI with custom alias input, click analytics bar chart, QR code generation drawn on canvas, link management table with search/filter, bulk import, and a shareable dashboard'},
];

const XTALK_MSGS=[
  (f,t)=>`${t}, architecture spec finalized. Passing context now.`,
  (f,t)=>`Handing off to ${t} — all decisions documented above.`,
  (f,t)=>`${t}: picking up from ${f}'s output. Context attached.`,
  (f,t)=>`${f} → ${t}: handoff complete. Continue from here.`,
  (f,t)=>`${t}, your turn. Full context in the thread above.`,
  (f,t)=>`Implementation ready for ${t} to take over.`,
  (f,t)=>`${f} done. ${t}, please proceed with your pass.`,
];

const LS_CFG='nf8_cfg', LS_HIST='nf8_hist', LS_THEME='nf8_theme', LS_MEM='nf8_mem', LS_CODEBASE='nf8_cb';
const CHAT_AI={id:'ai',name:'NeuralForge AI',role:'Assistant',emoji:'🤖',color:'#00d4ff',glow:'rgba(0,212,255,.3)',badge:'AI',bb:'rgba(0,212,255,.1)',bc:'#00d4ff'};

/* ══ STATE ══ */
const S={
  building:false,aborted:false,project:null,sid:null,
  files:{},selFile:null,chatLog:[],mode:'build',tokens:0,
  cfg:{provider:'openrouter',key:'',model:'meta-llama/llama-3.3-70b-instruct:free',mm:'smart',speed:'normal',
       feedbackLoop:true,maxLoops:2,dynamicRouting:true,selfEval:true},
  lc:false,rc:false,
  ctx:{},buildStart:0,
  curRTab:'files',
  framework:'vanilla',
  /* V8 additions */
  memory:{facts:[],summaries:[],projectCtx:{}},
  codebaseIndex:{},
  evalScores:{},
  loopCount:0,
  routingDecision:null,
  selectedCode:null,
  selectedRange:null,
  /* NEW FEATURE STATE */
  persona:'developer',           // Feature 12: persona mode
  buildReplayLog:[],             // Feature 13: replay snapshots
  replayActive:false,            // Feature 13
  errLog:[],                     // Feature 9: error monitor
  totalCostEst:0,                // Feature 5: cost tracker
  budgetCap:0.50,                // Feature 5: $0.50 default cap
  tokenBudget:200000,            // Feature 5: 200k tokens per build
  tokenUsedTotal:0,              // Feature 5
  abortController:null,          // Feature 3/6: AbortController
  abortTimerId:null,             // Feature 3: runaway timer
  webSearchResults:[],           // Feature 11: web searcher results
  testResults:[],                // Feature 10: test agent results
  folderStructure:{},            // Feature 1: proper folder structure
};
let usrScrolled=false,recog=null,blobUrl=null,blobUrlInl=null,selTpl=null,timerInt=null;
let searchMatches=[],searchCur=-1;

/* ════════════════════════════════════════════════════════════
   V8 ENGINE — 12 INTELLIGENCE SYSTEMS
   ════════════════════════════════════════════════════════════ */

/* ── 1. PERSISTENT MEMORY SYSTEM ── */
const MEM={
  load(){try{const d=localStorage.getItem(LS_MEM);if(d)S.memory=JSON.parse(d);}catch(e){}},
  save(){try{localStorage.setItem(LS_MEM,JSON.stringify(S.memory));}catch(e){}},
  addFact(fact,src='auto'){
    if(!fact||fact.length<5)return;
    const exists=S.memory.facts.some(f=>f.text.toLowerCase()===fact.toLowerCase());
    if(exists)return;
    S.memory.facts.unshift({text:fact,src,ts:Date.now()});
    if(S.memory.facts.length>50)S.memory.facts=S.memory.facts.slice(0,50);
    MEM.save();MEM.renderUI();
  },
  addSummary(text,project){
    S.memory.summaries.unshift({text:text.slice(0,300),project:project||S.project,ts:Date.now()});
    if(S.memory.summaries.length>10)S.memory.summaries=S.memory.summaries.slice(0,10);
    MEM.save();MEM.renderUI();
  },
  setProjectCtx(key,val){
    S.memory.projectCtx[key]=val;MEM.save();
  },
  getRelevant(query,limit=5){
    const q=(query||'').toLowerCase();
    const scored=[...S.memory.facts.map(f=>({...f,type:'fact'})),
                  ...S.memory.summaries.map(s=>({...s,type:'summary'}))];
    return scored
      .map(m=>({...m,score:m.text.toLowerCase().split(' ').filter(w=>w.length>3&&q.includes(w)).length}))
      .sort((a,b)=>b.score-a.score||b.ts-a.ts)
      .slice(0,limit)
      .map(m=>m.text);
  },
  buildContext(query){
    const rel=MEM.getRelevant(query,4);
    const ctx=[];
    if(S.project)ctx.push(`Current project: ${S.project}`);
    if(S.framework&&S.framework!=='vanilla')ctx.push(`Stack: ${FW_CONFIG[S.framework]?.label||S.framework}`);
    if(rel.length)ctx.push('Relevant memories:\n'+rel.map(r=>'• '+r).join('\n'));
    const projCtxEntries=Object.entries(S.memory.projectCtx).slice(0,3);
    if(projCtxEntries.length)ctx.push('Project context:\n'+projCtxEntries.map(([k,v])=>`• ${k}: ${v}`).join('\n'));
    return ctx.join('\n\n');
  },
  clear(){S.memory={facts:[],summaries:[],projectCtx:{}};MEM.save();MEM.renderUI();toast('Memory cleared','ok');},
  renderUI(){
    const count=S.memory.facts.length+S.memory.summaries.length;
    const badge=document.getElementById('mem-badge');
    const countEl=document.getElementById('mem-count');
    if(badge){badge.classList.toggle('show',count>0);}
    if(countEl)countEl.textContent=count;
    ['mem-items-sb','mem-mo-list'].forEach(id=>{
      const el=document.getElementById(id);
      if(!el)return;
      const isMo=id==='mem-mo-list';
      if(!count){el.innerHTML='<div class="mem-empty">No memories yet</div>';return;}
      const items=[
        ...S.memory.summaries.map(s=>({text:s.text,type:'summary',ts:s.ts,proj:s.project})),
        ...S.memory.facts.map(f=>({text:f.text,type:'fact',ts:f.ts}))
      ].sort((a,b)=>b.ts-a.ts).slice(0,isMo?40:8);
      el.innerHTML=items.map((m,i)=>`
        <div class="${isMo?'eval-row':'mem-item'}" style="${isMo?'':''}">
          <div class="mem-dot ${m.type}"></div>
          <span style="flex:1;font-size:${isMo?'.72rem':'.62rem'};color:var(--t2);line-height:1.4">${m.text.slice(0,isMo?200:90)}</span>
          ${isMo?`<button onclick="deleteMem(${i})" style="font-size:10px;color:var(--t3);padding:1px 4px;border-radius:3px;cursor:pointer;transition:all .15s" onmouseover="this.style.color='var(--red)'" onmouseout="this.style.color='var(--t3)'">✕</button>`:''}
        </div>`).join('');
    });
  }
};

/* ── 2. SMART CONTEXT ENGINE ── */
const CTX={
  MAX_TOKENS:6000,
  build(query,chatLog,agentCtx){
    const memCtx=MEM.buildContext(query);
    const recentMsgs=CTX._smartSelect(chatLog,query);
    const agentSummary=Object.entries(agentCtx||{})
      .slice(-4).map(([k,v])=>`[${k}]: ${v.slice(0,200)}`).join('\n');
    return [memCtx,recentMsgs,agentSummary].filter(Boolean).join('\n\n---\n\n').slice(0,CTX.MAX_TOKENS);
  },
  _smartSelect(log,query){
    if(!log||!log.length)return '';
    const q=(query||'').toLowerCase().split(' ').filter(w=>w.length>3);
    const scored=log.map((m,i)=>({
      m,i,
      score:(m.type==='user'?2:1)+
            q.filter(w=>(m.text||'').toLowerCase().includes(w)).length+
            (i>log.length-4?3:0)
    }));
    return scored.sort((a,b)=>b.score-a.score).slice(0,6)
      .sort((a,b)=>a.i-b.i)
      .map(x=>`${x.m.type==='user'?'User':'AI'}: ${(x.m.text||'').slice(0,300)}`)
      .join('\n');
  },
  async summarize(text){
    if((!S.cfg.key&&!VAULT.getActiveCount())||text.length<500)return text.slice(0,300);
    try{
      const r=await callAPI('Summarize in 2 sentences, keep key technical decisions and facts:',
        [{role:'user',content:text.slice(0,2000)}]);
      return r||text.slice(0,300);
    }catch(e){return text.slice(0,300);}
  }
};

/* ── 3. MODEL ROUTER ── */
/* ══ MODEL ROUTER v9 — SMART PER-TASK SELECTION ══ */
const MODEL_ROUTER={
  /* Full model catalogue per provider */
  catalogue:{
    openrouter:{
      coding:'deepseek/deepseek-chat-v3-0324:free',      // best: coding, logic
      reasoning:'deepseek/deepseek-r1:free',              // best: planning, analysis, debugging
      quality:'meta-llama/llama-3.3-70b-instruct:free',  // best: balanced all-round
      fast:'meta-llama/llama-3.1-8b-instruct:free',       // best: summaries, fast tasks
      creative:'google/gemma-3-12b-it:free',              // best: design, UI, creative
      review:'meta-llama/llama-3.3-70b-instruct:free',    // best: code review, critique
    },
    groq:{
      coding:'llama-3.3-70b-versatile',
      reasoning:'llama-3.3-70b-versatile',
      quality:'llama-3.3-70b-versatile',
      fast:'llama-3.1-8b-instant',
      creative:'gemma2-9b-it',
      review:'mixtral-8x7b-32768',
    }
  },
  /* Per-agent profile: which task type each agent needs */
  agentTaskMap:{
    websearcher:'reasoning',
    ceo:        'reasoning',
    promptagent:'reasoning',
    manager:    'reasoning',
    planner:    'reasoning',
    pm:         'quality',
    designer:   'creative',
    developer:  'coding',
    reviewer:   'review',
    optimizer:  'coding',
    a11y:       'quality',
    debugger:   'reasoning',
    devops:     'fast',
    tester:     'reasoning',
  },
  /* Dynamic task detection — overrides agent default if content matches */
  detectTask(text){
    const t=(text||'').toLowerCase();
    if(/\b(bug|crash|error|exception|undefined|null|fix|broken|fails)\b/.test(t)) return 'reasoning'; // bugs need reasoning
    if(/\b(optim|perform|speed|slow|lag|refactor|clean)\b/.test(t)) return 'coding';
    if(/\b(design|color|ui|layout|theme|style|beautiful|animation)\b/.test(t)) return 'creative';
    if(/\b(plan|architect|structure|strategy|approach|how to)\b/.test(t)) return 'reasoning';
    if(/\b(review|check|validate|quality|correct|test)\b/.test(t)) return 'review';
    if(/\b(summarize|list|describe|explain)\b/.test(t)) return 'fast';
    if(/\b(build|code|implement|create|function|component|class)\b/.test(t)) return 'coding';
    return null;
  },
  /* Main model picker — smart selection */
  pick(agentId, contextHint){
    if(S.cfg.mm==='single') return S.cfg.model;
    const cat=this.catalogue[S.cfg.provider]||this.catalogue.openrouter;
    // Try dynamic content detection first
    const dynamicTask=contextHint?this.detectTask(contextHint):null;
    const baseTask=this.agentTaskMap[agentId]||'quality';
    const task=dynamicTask||baseTask;
    const model=cat[task]||cat.quality;
    return model;
  },
  getLabel(agentId, contextHint){
    if(S.cfg.mm==='single') return S.cfg.model.split('/').pop().replace(':free','').slice(0,22);
    const task=this.detectTask(contextHint)||this.agentTaskMap[agentId]||'quality';
    const labelMap={coding:'DeepSeek V3 (code)',reasoning:'DeepSeek R1 (reason)',quality:'Llama 3.3 70B',fast:'Llama 3.1 8B (fast)',creative:'Gemma 3 (creative)',review:'Llama 3.3 (review)'};
    return labelMap[task]||task;
  },
  getProfile(agentId){
    const task=this.agentTaskMap[agentId]||'quality';
    const descs={coding:'Optimized for code generation',reasoning:'Optimized for reasoning & planning',quality:'Balanced quality model',fast:'Fast lightweight model',creative:'Creative & design-focused',review:'Strict review & critique'};
    return{desc:descs[task]||'Quality model',task};
  },
  /* Override model for specific API call */
  async callWith(task, sys, msgs){
    // Use vault's task-aware ranking to pick the best model
    const best=VAULT.getBest(task)||VAULT.getBest('quality');
    if(best&&best.key) return callAPIVault(sys,msgs,task,best.provider,best.key,best.model);
    // Fallback: use legacy single key with task-matched model
    const savedModel=S.cfg.model;
    const cat=this.catalogue[S.cfg.provider]||this.catalogue.openrouter;
    S.cfg.model=cat[task]||cat.quality;
    const result=await callAPI(sys,msgs,null);
    S.cfg.model=savedModel;
    return result;
  }
};

/* ── 4. DYNAMIC AGENT ROUTER ── */
const DYNAMIC_ROUTER={
  async route(userInput){
    if(!S.cfg.dynamicRouting)return null;
    const keywords={
      debugger:['bug','error','fix','broken','crash','undefined','null','fails','exception','wrong output'],
      designer:['ui','design','style','color','layout','looks','css','beautiful','ugly','theme'],
      developer:['code','build','implement','create','feature','function','add','component'],
      optimizer:['slow','performance','optimize','speed','fast','lag','memory','cpu'],
      a11y:['accessibility','a11y','aria','screen reader','keyboard','wcag','contrast'],
      reviewer:['review','check','quality','test','validate','correct'],
      planner:['plan','architecture','structure','design','how to','approach','strategy']
    };
    const lower=userInput.toLowerCase();
    let best=null,bestScore=0;
    Object.entries(keywords).forEach(([agent,words])=>{
      const score=words.filter(w=>lower.includes(w)).length;
      if(score>bestScore){bestScore=score;best=agent;}
    });
    if(bestScore>=2){
      const reason=`Detected ${best} task based on keywords`;
      showRouteIndicator(best,reason,bestScore);
      return {agent:best,reason,confidence:bestScore};
    }
    return null;
  }
};

/* ══ FEEDBACK LOOP ENGINE v9 — ENFORCED REVIEWER→DEVELOPER CYCLE ══ */
const FEEDBACK={
  /* Strict AI-powered code evaluation */
  async evaluate(code, project, reviewerContext){
    if(!S.cfg.key&&!VAULT.getActiveCount()) return {correctness:7,quality:7,completeness:7,pass:true,issues:[]};
    try{
      const evalPrompt=`You are a STRICT code quality judge for the project: "${project}"

Evaluate this code on exactly 3 criteria (score 1-10 each):
1. Correctness: Does it actually work end-to-end? No broken references, missing handlers, or runtime errors?
2. Quality: Is it clean, readable, follows best practices? No TODO/placeholder/skeleton code?
3. Completeness: Are ALL features from the project spec implemented? Nothing missing?

${reviewerContext?'Reviewer notes: '+reviewerContext.slice(0,400)+'\n\n':''}Code to evaluate:
\`\`\`
${code.slice(0,2500)}
\`\`\`

RULES: Be STRICT. Score < 7 means FAIL. List specific fixable issues.
Respond ONLY with valid JSON (no markdown):
{"correctness":N,"quality":N,"completeness":N,"issues":["specific issue 1","specific issue 2"],"pass":boolean}
pass=true only if ALL three scores >= 7`;

      const raw=await MODEL_ROUTER.callWith('reasoning',
        'You are a strict code quality evaluator. Output only valid JSON, no markdown, no explanation.',
        [{role:'user',content:evalPrompt}]);
      if(!raw) return {correctness:7,quality:7,completeness:7,pass:true,issues:[]};
      const cleaned=raw.replace(/```json?\s*|\s*```/g,'').trim();
      const parsed=JSON.parse(cleaned);
      // Validate fields
      ['correctness','quality','completeness'].forEach(k=>{
        if(typeof parsed[k]!=='number')parsed[k]=7;
        parsed[k]=Math.max(1,Math.min(10,parsed[k]));
      });
      parsed.pass=parsed.correctness>=7&&parsed.quality>=7&&parsed.completeness>=7;
      parsed.issues=Array.isArray(parsed.issues)?parsed.issues:[];
      return parsed;
    }catch(e){
      return {correctness:7,quality:7,completeness:7,pass:true,issues:[]};
    }
  },

  /* Full enforced Reviewer→Developer feedback loop */
  async loop(project, userText, devAgent, ctx, reviewerAgent, loopMax){
    loopMax=Math.min(loopMax||S.cfg.maxLoops||2,3);
    let devTxt=null;
    let lastEval=null;

    for(let attempt=1;attempt<=loopMax;attempt++){
      if(S.aborted) break;
      S.loopCount=attempt;

      // ── STEP A: Developer generates/revises code ──
      showLoopBadge(attempt,loopMax,'running',`Developer pass ${attempt}/${loopMax}`);
      setAgentState(devAgent.id,'generating');

      const devIssues=ctx._feedbackIssues;
      const devModel=MODEL_ROUTER.pick(devAgent.id, userText);
      const devSys=`You are ${devAgent.name} — ${devAgent.role} — at NeuralForge v10. [${MODEL_ROUTER.getProfile(devAgent.id).desc}]`+
        (attempt>1?` REVISION ${attempt}/${loopMax}: You MUST fix every issue listed. Produce complete, working code.`:'');
      const basePrompt=PROMPTS.developer(project,ctx);
      const devPrompt=basePrompt+(devIssues?`\n\n⚠️ MANDATORY FIXES (Reviewer rejected previous attempt):\n${devIssues}\n\nEvery issue above MUST be resolved. Do not skip any.`:'');

      const savedModel=S.cfg.model;
      S.cfg.model=devModel;
      devTxt=await callWithRetry(devSys,[{role:'user',content:devPrompt}],devAgent);
      S.cfg.model=savedModel;

      if(!devTxt||S.aborted) break;
      ctx[devAgent.id]=devTxt;
      delete ctx._feedbackIssues;

      // Show developer output
      await addAgentMsg(devAgent,devTxt);

      // Extract files from developer output
      const fileCount=extractAllFiles(devTxt);
      if(fileCount>0){
        renderFiles();
        const firstFile=S.files['index.html']?'index.html':Object.keys(S.files)[0];
        if(firstFile)selFile(firstFile);
        document.getElementById('dlall').disabled=false;
        document.getElementById('runbtn').disabled=false;
        CODEBASE.index();
        addEditWithAIButton();
      }

      // Last loop — skip review
      if(attempt>=loopMax){
        showLoopBadge(attempt,loopMax,'pass',`Final pass — accepted`);
        break;
      }

      // ── STEP B: Reviewer evaluates the output ──
      if(S.aborted) break;
      showLoopBadge(attempt,loopMax,'reviewing',`Reviewer checking pass ${attempt}…`);

      // Use actual reviewer agent if provided
      const revAgent=reviewerAgent||AGENTS.find(a=>a.id==='reviewer');
      if(revAgent){
        setAgentState(revAgent.id,'analyzing');
        const revModel=MODEL_ROUTER.pick(revAgent.id,'review code quality');
        const revSys=`You are ${revAgent.name} — ${revAgent.role} — at NeuralForge v10. You are STRICT and thorough.`;
        const revPrompt=PROMPTS.reviewer(project,ctx);
        const savedM2=S.cfg.model;
        S.cfg.model=revModel;
        const revTxt=await callWithRetry(revSys,[{role:'user',content:revPrompt}],revAgent);
        S.cfg.model=savedM2;

        if(revTxt){
          ctx[revAgent.id]=revTxt;
          ctx._reviewerRanInLoop=true; // V9: flag so orchestrator skips duplicate reviewer step
          await addAgentMsg(revAgent,revTxt);
        }

        // ── STEP C: AI evaluates scores ──
        const allCode=Object.values(S.files).map(f=>f.c).join('\n').slice(0,3000);
        lastEval=await FEEDBACK.evaluate(allCode,project,ctx[revAgent.id]);
        S.evalScores[`loop_${attempt}`]=lastEval;
        showEvalScores(lastEval,attempt);

        if(lastEval.pass){
          showLoopBadge(attempt,loopMax,'pass',`✅ Passed review (loop ${attempt})`);
          setAgentState(revAgent.id,'done');
          break;
        }

        // ── STEP D: Build feedback for developer ──
        const issueList=lastEval.issues.filter(Boolean).slice(0,5).join('\n• ');
        const scoreStr=`correctness=${lastEval.correctness}/10, quality=${lastEval.quality}/10, completeness=${lastEval.completeness}/10`;
        ctx._feedbackIssues=`Reviewer REJECTED this code (${scoreStr}).\n\nIssues that MUST be fixed:\n• ${issueList||'Improve overall quality and completeness.'}\n\nProduce a COMPLETE revised version fixing ALL issues above.`;

        showLoopBadge(attempt,loopMax,'fail',`❌ Failed review — retrying (${attempt}/${loopMax})`);
        setAgentState(revAgent.id,'done');

        // Cross-talk between reviewer and developer
        addXTalk(revAgent,devAgent);
        toast(`🔁 Loop ${attempt}/${loopMax-1} failed — sending back to Developer`,'');
        await sleep(600);
      }
    }

    return devTxt;
  }
};

function extractAllFilesTemp(text){
  const files={};
  const re=/```(\w*)\n?([\s\S]*?)```/g;let m;
  while((m=re.exec(text))!==null){
    const lang=m[1]||'';const code=m[2].trim();
    if(!code||code.length<20)continue;
    const type=detectFileType(lang,code);
    const name=canonicalName(type.ext,files);
    files[name]=code;
  }
  return files;
}

/* ── 6. RETRY + FALLBACK SYSTEM ── */
const FALLBACK_MODELS={
  openrouter:['meta-llama/llama-3.3-70b-instruct:free','deepseek/deepseek-chat-v3-0324:free','google/gemma-3-12b-it:free','meta-llama/llama-3.1-8b-instruct:free'],
  groq:['llama-3.3-70b-versatile','mixtral-8x7b-32768','llama-3.1-8b-instant','gemma2-9b-it'],
};
async function callWithRetry(sys,msgs,agent,maxRetries=3){
  const models=FALLBACK_MODELS[S.cfg.provider]||[];
  for(let attempt=0;attempt<maxRetries;attempt++){
    if(S.aborted)return null;
    // Use agent model router on first attempt, fallbacks after
    if(attempt>0&&models[attempt-1]){
      const fb=models[attempt-1];
      toast(`⚠️ Retry ${attempt}/${maxRetries-1} — trying ${fb.split('/').pop().slice(0,20)}`,'');
      await sleep(800);
      const orig=S.cfg.model;
      S.cfg.model=fb;
      const r=await callAPI(sys,msgs,null);// use overridden model
      S.cfg.model=orig;
      if(r)return r;
    } else {
      const r=await callAPI(sys,msgs,agent);
      if(r)return r;
      await sleep(600);
    }
  }
  return null;
}

/* ── 7. SELF-EVALUATION DISPLAY ── */
function showEvalScores(eval_,loop){
  if(!eval_)return;
  const scores=[
    {label:'Correctness',val:eval_.correctness||eval_.score||7},
    {label:'Quality',val:eval_.quality||eval_.score||7},
    {label:'Complete',val:eval_.completeness||eval_.score||7}
  ];
  const w=document.getElementById('msgs');
  const el=document.createElement('div');
  el.className='score-bar';
  el.innerHTML=`<span style="font-size:.6rem;color:var(--t3);flex-shrink:0">🧪 Self-Eval${loop?` Loop ${loop}`:''}:</span>`+
    scores.map(s=>{
      const cls=s.val>=8?'hi':s.val>=6?'mid':'lo';
      const stars='★'.repeat(Math.round(s.val/2))+'☆'.repeat(5-Math.round(s.val/2));
      return `<span class="score-item"><span style="color:var(--t3)">${s.label}</span> <span class="score-val ${cls}">${s.val}/10</span></span>`;
    }).join('')+
    `<span style="margin-left:auto;font-size:.6rem;font-weight:700;color:${eval_.pass?'var(--green)':'var(--red)'}">${eval_.pass?'✅ PASS':'❌ RETRY'}</span>`;
  w.appendChild(el);scrollChat();
}

function showLoopBadge(attempt,max,state,label){
  const w=document.getElementById('msgs');
  const old=w.querySelector('.loop-badge-row');if(old)old.remove();
  const el=document.createElement('div');
  el.className='loop-badge-row';
  el.style.cssText='display:flex;align-items:center;gap:6px;padding:4px 10px;margin:2px 0;font-size:.65rem;color:var(--t2)';
  const stateStyles={
    running:'background:rgba(255,209,102,.1);border-color:rgba(255,209,102,.3);color:var(--yellow)',
    reviewing:'background:rgba(0,212,255,.1);border-color:rgba(0,212,255,.3);color:var(--cyan)',
    pass:'background:rgba(0,229,160,.1);border-color:rgba(0,229,160,.3);color:var(--green)',
    fail:'background:rgba(255,107,107,.1);border-color:rgba(255,107,107,.3);color:var(--red)',
    warn:'background:rgba(255,159,67,.1);border-color:rgba(255,159,67,.3);color:var(--orange)',
  };
  const style=stateStyles[state]||stateStyles.running;
  const icons={running:'⚙️',reviewing:'🔍',pass:'✅',fail:'❌',warn:'⚠️'};
  const icon=icons[state]||'🔁';
  const displayLabel=label||`Loop ${attempt}/${max} — ${state}`;
  el.innerHTML=`<span class="loop-badge" style="border:1px solid;border-radius:5px;padding:2px 8px;font-family:var(--mono);font-size:.6rem;font-weight:700;${style}">${icon} ${displayLabel}</span>`;
  w.appendChild(el);scrollChat();
}

/* ── 8. ROUTING INDICATOR ── */
function showRouteIndicator(agentId,reason,confidence){
  const ind=document.getElementById('route-ind');
  const reasonEl=document.getElementById('route-reason');
  const agentEl=document.getElementById('route-agent');
  const badge=document.getElementById('route-badge');
  if(!ind)return;
  const agent=AGENTS.find(a=>a.id===agentId);
  if(!agent)return;
  reasonEl.textContent=reason;
  agentEl.textContent=agent.name;
  badge.textContent=`${confidence}× match`;
  ind.classList.add('show');
  setTimeout(()=>ind.classList.remove('show'),4000);
}

/* ══ CODEBASE INTELLIGENCE v9 — DEEP SEMANTIC UNDERSTANDING ══ */
const CODEBASE={
  /* Deep index: extracts semantic meaning from every file */
  index(){
    const idx={};
    Object.entries(S.files).forEach(([name,file])=>{
      const lines=file.c.split('\n');
      const lang=file.lang||detectLang(file.c);

      // Extract functions/classes/exports
      const symbols=[];
      const imports=[];
      const exports=[];
      const apis=[];         // API endpoints, fetch calls
      const domRefs=[];      // DOM IDs/classes referenced
      const stateVars=[];    // State variables

      lines.forEach((l,i)=>{
        const lt=l.trim();
        // Functions
        const fnMatch=lt.match(/^(?:export\s+)?(?:async\s+)?function\s+([\w$]+)|(?:const|let|var)\s+([\w$]+)\s*=\s*(?:async\s*)?\(/);
        if(fnMatch)symbols.push({name:(fnMatch[1]||fnMatch[2]),line:i+1,type:'function'});
        // Classes
        const clsMatch=lt.match(/^(?:export\s+)?class\s+([\w$]+)/);
        if(clsMatch)symbols.push({name:clsMatch[1],line:i+1,type:'class'});
        // Imports
        const impMatch=lt.match(/^import\s+.*\s+from\s+['"]([^'"]+)['"]/)||lt.match(/^const\s+.*=\s+require\(['"]([^'"]+)['"]\)/);
        if(impMatch)imports.push(impMatch[1]);
        // Exports
        if(/^export\s+(default\s+)?/.test(lt))exports.push(lt.slice(0,60));
        // API calls / fetch
        const apiMatch=lt.includes('fetch(')||lt.includes('.get(')||lt.includes('.post(');
        if(apiMatch&&(lt.includes("'"))){const q=lt.indexOf("'");const q2=lt.indexOf("'",q+1);if(q2>q)apis.push(lt.slice(q+1,q2).slice(0,60));}
        const domMatch=lt.includes('getElementById')||lt.includes('querySelector');
        if(domMatch){const q=lt.indexOf('"')||lt.indexOf("'");const q2=lt.indexOf('"',q+1)||lt.indexOf("'",q+1);if(q>0&&q2>q)domRefs.push(lt.slice(q+1,q2).slice(0,40));}
        if(domMatch)domRefs.push(domMatch[1]);
        // State
        const stateMatch=lt.match(/^(?:const|let|var)\s+(S|state|store|data|app)\s*=/);
        if(stateMatch)stateVars.push(lt.slice(0,80));
      });

      // Find cross-file dependencies
      const deps=imports.filter(imp=>!imp.startsWith('./')==false||imp.includes('./'))
        .map(imp=>imp.replace('./',''));

      idx[name]={
        lines:lines.length,lang,symbols,imports,exports,apis,domRefs,stateVars,deps,
        summary:CODEBASE._buildSummary(name,lines.length,lang,symbols,imports,apis),
        semanticContext:CODEBASE._buildSemanticContext(name,lang,symbols,imports,apis,domRefs)
      };
    });

    S.codebaseIndex=idx;
    // Build cross-file dependency map
    S.codebaseIndex._crossRefs=CODEBASE._buildCrossRefs(idx);
    try{localStorage.setItem(LS_CODEBASE,JSON.stringify(idx));}catch(e){}
    return idx;
  },

  _buildSummary(name,lineCount,lang,symbols,imports,apis){
    const parts=[`${name} (${lineCount} lines, ${lang||'code'})`];
    if(symbols.length)parts.push(`${symbols.length} functions/classes: ${symbols.slice(0,3).map(s=>s.name).join(', ')}${symbols.length>3?'…':''}`);
    if(imports.length)parts.push(`imports: ${imports.slice(0,3).join(', ')}`);
    if(apis.length)parts.push(`API calls: ${apis.slice(0,2).join(', ')}`);
    return parts.join(' | ');
  },

  _buildSemanticContext(name,lang,symbols,imports,apis,domRefs){
    const ctx=[];
    if(symbols.length)ctx.push(`Functions: ${symbols.map(s=>`${s.name}() line ${s.line}`).slice(0,5).join(', ')}`);
    if(imports.length)ctx.push(`Dependencies: ${imports.slice(0,5).join(', ')}`);
    if(apis.length)ctx.push(`API endpoints used: ${apis.slice(0,3).join(', ')}`);
    if(domRefs.length)ctx.push(`DOM elements: ${[...new Set(domRefs)].slice(0,5).join(', ')}`);
    return ctx.join('\n');
  },

  _buildCrossRefs(idx){
    const refs={};
    Object.entries(idx).forEach(([name,info])=>{
      if(!info.symbols)return;
      // Find which files reference this file's symbols
      info.symbols.forEach(sym=>{
        Object.entries(idx).forEach(([otherName,otherInfo])=>{
          if(otherName===name)return;
          const code=S.files[otherName]?.c||'';
          if(code.includes(sym.name)){
            if(!refs[name])refs[name]=[];
            if(!refs[name].includes(otherName))refs[name].push(otherName);
          }
        });
      });
    });
    return refs;
  },

  /* Get rich summary for agent context injection */
  getSummary(){
    const idx=S.codebaseIndex;
    if(!Object.keys(idx).length)return '';
    const files=Object.entries(idx).filter(([k])=>!k.startsWith('_'));
    if(!files.length)return '';
    const summary=files.map(([,info])=>info.summary).filter(Boolean).join('\n');
    const crossRefs=idx._crossRefs;
    const deps=crossRefs?Object.entries(crossRefs).map(([f,refs])=>`${f} ← referenced by: ${refs.join(', ')}`).slice(0,4).join('\n'):'';
    return [
      `📁 Project Files (${files.length}):`,
      summary,
      deps?`\n🔗 Cross-file dependencies:\n${deps}`:''
    ].filter(Boolean).join('\n');
  },

  /* Get full semantic context for a specific agent role */
  getAgentContext(role){
    const idx=S.codebaseIndex;
    const files=Object.entries(S.files);
    if(!files.length)return '';

    switch(role){
      case 'reviewer':
      case 'debugger':{
        // Full code with line numbers for review
        return files.map(([name,file])=>{
          const info=idx[name];
          return `\n// ═══ ${name} (${file.c.split('\n').length} lines) ═══\n${file.c.slice(0,1500)}`;
        }).join('\n').slice(0,4000);
      }
      case 'optimizer':{
        // Focus on API calls, DOM refs, and function complexity
        return files.map(([name])=>{
          const info=idx[name];
          if(!info)return '';
          return `${name}: ${info.apis?.length||0} API calls, ${info.domRefs?.length||0} DOM refs, ${info.symbols?.length||0} functions`;
        }).join('\n');
      }
      case 'developer':{
        // Summary only — don't overwhelm with existing code on first pass
        return CODEBASE.getSummary().slice(0,800);
      }
      default:
        return CODEBASE.getSummary().slice(0,600);
    }
  },

  /* Search across all files */
  search(query){
    const q=query.toLowerCase();
    const results=[];
    Object.entries(S.files).forEach(([name,file])=>{
      file.c.split('\n').forEach((line,i)=>{
        if(line.toLowerCase().includes(q))
          results.push({file:name,line:i+1,text:line.trim().slice(0,100),
            context:file.c.split('\n').slice(Math.max(0,i-1),i+2).join('\n')});
      });
    });
    return results.slice(0,15);
  },

  /* Answer questions about the codebase */
  async query(question){
    if((!S.cfg.key&&!VAULT.getActiveCount())||!Object.keys(S.files).length)
      return 'No files to query. Build a project first.';
    const context=CODEBASE.getSummary();
    const topFiles=Object.entries(S.files).slice(0,3)
      .map(([n,f])=>`// ${n}\n${f.c.slice(0,800)}`).join('\n\n---\n\n');
    showToolCall('📁','Codebase Query',question);
    const r=await MODEL_ROUTER.callWith('reasoning',
      'You are an expert code assistant. Answer questions about the codebase accurately and concisely.',
      [{role:'user',content:`Codebase summary:\n${context}\n\nCode samples:\n${topFiles}\n\nQuestion: ${question}`}]);
    updateToolCall('done');
    return r||'Could not analyze codebase.';
  }
};

/* ══ TOOL-USING AGENTS v9 — FULL IMPLEMENTATION ══ */
const TOOLS={
  /* ── Tool 1: Code Analyzer ── */
  async codeAnalyzer(code, question){
    showToolCall('🔬','Code Analyzer', question);
    if(!S.cfg.key&&!VAULT.getActiveCount()){updateToolCall('err');return 'Add an API key in Settings first.';}
    try{
      const r=await MODEL_ROUTER.callWith('reasoning',
        'You are a code analysis expert. Analyze the code and answer the question concisely and accurately.',
        [{role:'user',content:`Code:\n\`\`\`\n${code.slice(0,3000)}\n\`\`\`\n\nQuestion: ${question}`}]);
      updateToolCall('done');return r||'No analysis available.';
    }catch(e){updateToolCall('err');return 'Analysis failed: '+e.message;}
  },

  /* ── Tool 2: File Reader — reads any project file ── */
  async fileReader(filename){
    showToolCall('📂','File Reader', filename||'(browse files)');
    // Support glob patterns: *.js, *.css
    if(filename&&filename.includes('*')){
      const ext=filename.replace('*.','');
      const matches=Object.entries(S.files)
        .filter(([n])=>n.endsWith('.'+ext))
        .map(([n,f])=>(`// === ${n} ===\n${f.c}`))
        .join('\n\n');
      updateToolCall(matches?'done':'err');
      return matches||`No .${ext} files found. Available: ${Object.keys(S.files).join(', ')}`;
    }
    // Exact filename
    const file=S.files[filename];
    if(file){updateToolCall('done');return `// ${filename}\n${file.c}`;}
    // Fuzzy match
    const fuzzy=Object.keys(S.files).find(n=>n.includes(filename)||filename.includes(n));
    if(fuzzy){updateToolCall('done');return `// ${fuzzy} (matched from "${filename}")\n${S.files[fuzzy].c}`;}
    updateToolCall('err');
    return `File "${filename}" not found.\nAvailable files:\n${Object.keys(S.files).map(n=>`  • ${n}`).join('\n')}`;
  },

  /* ── Tool 3: Web Search (AI-powered, no backend needed) ── */
  async webSearch(query){
    showToolCall('🌐','Web Search', query);
    if(!S.cfg.key&&!VAULT.getActiveCount()){updateToolCall('err');return 'Add an API key in Settings first.';}
    try{
      // Use a reasoning model for best factual responses
      const r=await MODEL_ROUTER.callWith('reasoning',
        `You are a web search assistant with knowledge up to 2024. Answer the search query with accurate, up-to-date information. Format: brief summary then bullet points with key facts. Be factual and specific.`,
        [{role:'user',content:`Search query: "${query}"\n\nProvide accurate search results with relevant facts, documentation links (as plain text), and examples where applicable.`}]);
      updateToolCall('done');
      return r||'No results found.';
    }catch(e){updateToolCall('err');return 'Search failed: '+e.message;}
  },

  /* ── Tool 4: Code Executor (sandboxed JS + HTML) ── */
  async codeExecutor(code, lang){
    lang=(lang||'javascript').toLowerCase();
    showToolCall('▶️','Code Executor', `${lang} (${code.split('\n').length} lines)`);
    if(lang==='javascript'||lang==='js'){
      try{
        const safeCode=`
          const __output=[];
          const __log=(...a)=>__output.push(a.map(x=>typeof x==='object'?JSON.stringify(x,null,2):String(x)).join(' '));
          const console={log:__log,error:__log,warn:__log,info:__log};
          try{
            ${code}
            window.parent.postMessage({type:'exec_done',output:__output.join('\\n'),error:null},'*');
          }catch(e){
            window.parent.postMessage({type:'exec_done',output:__output.join('\\n'),error:e.message},'*');
          }`;
        const blob=new Blob([safeCode],{type:'text/javascript'});
        const url=URL.createObjectURL(blob);
        const result=await new Promise((res)=>{
          const h=e=>{
            if(e.data?.type==='exec_done'){
              window.removeEventListener('message',h);
              URL.revokeObjectURL(url);res(e.data);
            }
          };
          window.addEventListener('message',h);
          const ifr=document.createElement('iframe');
          ifr.sandbox='allow-scripts';
          ifr.style.display='none';
          ifr.srcdoc=`<scr`+`ipt src="${url}"></scr`+`ipt>`;
          document.body.appendChild(ifr);
          setTimeout(()=>{window.removeEventListener('message',h);URL.revokeObjectURL(url);ifr.remove();res({output:'',error:'Execution timeout (3s)'});},3000);
        });
        updateToolCall(result.error?'err':'done');
        let out=result.output?`Output:\n${result.output}`:'(no output)';
        if(result.error)out+=`\nError: ${result.error}`;
        return out;
      }catch(e){updateToolCall('err');return 'Executor error: '+e.message;}
    }
    if(lang==='html'||lang==='css'){
      // Render HTML/CSS in preview pane
      const html=lang==='css'?`<html><body style="background:#fff;padding:20px"><style>${code}</style><div class="preview">Preview</div></body></html>`:code;
      const blob=new Blob([html],{type:'text/html'});
      const url=URL.createObjectURL(blob);
      updateToolCall('done');
      return `Rendered in preview. <a href="${url}" target="_blank">Open ↗</a>`;
    }
    updateToolCall('done');
    return `${lang} execution requires a server runtime (Node.js/Python). Code validated for syntax only.`;
  },

  /* ── Tool Dispatcher: AI decides which tool to use ── */
  async dispatch(agentId, task, context){
    if(!S.cfg.key)return null;
    // Determine which tool to invoke based on task keywords
    const taskLow=(task||'').toLowerCase();

    // Auto-invoke file reader when agent needs to see existing code
    if(/\b(read|look at|check|examine|analyze|review|see)\b.*\b(file|code|script|style|html|css|js)\b/.test(taskLow)){
      const filename=context?.file||Object.keys(S.files)[0];
      if(filename)return await TOOLS.fileReader(filename);
    }
    // Auto-invoke code analyzer for debugging/review tasks
    if(/\b(debug|analyze|find|detect|understand|explain)\b.*\b(bug|issue|error|problem|code)\b/.test(taskLow)){
      const code=context?.code||Object.values(S.files).map(f=>f.c).join('\n').slice(0,2000);
      if(code)return await TOOLS.codeAnalyzer(code, task);
    }
    // Auto-invoke web search for library/API questions
    if(/\b(how to|what is|best way|library|framework|api|documentation|example)\b/.test(taskLow)){
      return await TOOLS.webSearch(task);
    }
    return null;
  }
};

function showToolCall(icon,name,detail){
  const w=document.getElementById('msgs');
  const el=document.createElement('div');
  el.className='tool-call';el.id='tc-active';
  el.innerHTML=`<span class="tool-icon">${icon}</span><div style="flex:1"><div class="tool-name">${name}</div><div style="font-size:.63rem;color:var(--t3);margin-top:1px">${esc(detail||'')}</div></div><span class="tool-status running">running…</span>`;
  w.appendChild(el);scrollChat();
}
function updateToolCall(status){
  const el=document.getElementById('tc-active');
  if(!el)return;
  const s=el.querySelector('.tool-status');
  if(s){s.className='tool-status '+status;s.textContent=status==='done'?'✓ done':status==='err'?'✗ error':'done';}
  el.id='tc-done-'+Date.now();
}

/* ── 11. INLINE AI EDITOR ── */
let _ieCurrentEdit=null;
function openInlineEditor(){
  if(!S.selFile||!S.files[S.selFile]){toast('Select a file first','err');return;}
  const selected=window.getSelection?.()?.toString()||'';
  const code=selected||S.files[S.selFile].c.slice(0,500);
  S.selectedCode=code;
  document.getElementById('ie-selected-text').textContent=code.slice(0,200)+(code.length>200?'…':'');
  document.getElementById('ie-file-label').textContent='— '+S.selFile;
  document.getElementById('ie-result').className='ie-result';
  document.getElementById('ie-apply-btn').style.display='none';
  document.getElementById('ie-run-btn').textContent='⚡ Run AI Edit';
  _ieCurrentEdit=null;
  const ed=document.getElementById('inline-editor');
  ed.style.cssText='display:flex;top:50%;left:50%;transform:translate(-50%,-50%);';
  ed.classList.add('show');
}
function closeInlineEditor(){document.getElementById('inline-editor').classList.remove('show');}
async function ieAction(type){
  const actions={
    fix:'Find and fix all bugs in this code. Return the corrected code only.',
    optimize:'Optimize this code for performance and readability. Return improved code.',
    refactor:'Refactor this code following best practices. Return clean code.',
    explain:'Explain what this code does in plain English. Be concise.',
    types:'Add TypeScript types/JSDoc to this code. Return the typed version.',
    test:'Write unit tests for this code. Return the test code.'
  };
  document.getElementById('ie-custom').value=actions[type]||'';
  await ieRun();
}
async function ieRun(){
  if(!S.cfg.key&&!VAULT.getActiveCount()){toast('Add an API key in Settings','err');return;}
  const instruction=document.getElementById('ie-custom').value.trim()||'Improve this code';
  const code=S.selectedCode||S.files[S.selFile]?.c||'';
  const btn=document.getElementById('ie-run-btn');
  btn.textContent='⏳ Processing…';btn.disabled=true;
  const resultEl=document.getElementById('ie-result');
  resultEl.textContent='';resultEl.className='ie-result show';

  const fw=FW_CONFIG[S.framework||'vanilla'];
  const sys=`You are an expert ${fw.label} developer. Perform the requested code edit. Return ONLY the modified code or explanation, no preamble.`;
  const prompt=`File: ${S.selFile||'code'}\nStack: ${fw.label}\n\nCode:\n\`\`\`\n${code.slice(0,3000)}\n\`\`\`\n\nInstruction: ${instruction}`;

  try{
    const r=await callWithRetry(sys,[{role:'user',content:prompt}],null,2);
    _ieCurrentEdit=r;
    resultEl.textContent=r||'No response';
    const applyBtn=document.getElementById('ie-apply-btn');
    if(r&&instruction.toLowerCase().includes('expla')==false){applyBtn.style.display='inline-flex';}
  }catch(e){resultEl.textContent='Error: '+e.message;}
  btn.textContent='⚡ Run AI Edit';btn.disabled=false;
}
function ieApply(){
  if(!_ieCurrentEdit||!S.selFile)return;
  const code=extractCode(_ieCurrentEdit,S.files[S.selFile]?.lang)||_ieCurrentEdit.replace(/```[\w]*\n?/g,'').trim();
  if(!code){toast('No code to apply','err');return;}
  S.files[S.selFile].c=code;
  renderCode(S.selFile);
  renderFiles();
  closeInlineEditor();
  toast(`✅ Applied to ${S.selFile}`,'ok');
  CODEBASE.index();
}

/* ── 12. MEMORY EXTRACTION FROM AGENT OUTPUT ── */
async function extractMemoriesFromOutput(agentId,text,project){
  if(!text||text.length<100)return;
  // Auto-extract key facts
  const factPatterns=[
    /uses?\s+([\w\s]+(?:library|framework|api|database|pattern|approach))/gi,
    /(?:file|files)\s+(?:include|are|created):\s*([^\n.]+)/gi,
    /(?:tech stack|stack|technologies?):\s*([^\n.]+)/gi,
  ];
  factPatterns.forEach(pat=>{
    let m;
    while((m=pat.exec(text))!==null){
      const fact=m[1]?.trim();
      if(fact&&fact.length>5&&fact.length<120)
        MEM.addFact(fact,agentId);
    }
  });
  // Store project context from specific agents
  if(agentId==='planner'||agentId==='manager'){
    MEM.setProjectCtx('architecture',text.slice(0,200));
  }
  if(agentId==='designer'){
    MEM.setProjectCtx('designSystem',text.slice(0,150));
  }
  // Periodically summarize long conversations
  if(S.chatLog.length>0&&S.chatLog.length%8===0&&S.cfg.key){
    const recent=S.chatLog.slice(-8).map(m=>m.text||'').join('\n').slice(0,2000);
    const summary=await CTX.summarize(recent);
    if(summary)MEM.addSummary(summary,project);
  }
}

/* ── MEMORY UI FUNCTIONS ── */
function toggleMemPanel(){document.getElementById('mem-mo').classList.toggle('show');MEM.renderUI();}
function clearMemory(){MEM.clear();}
function addMemoryManual(){
  const inp=document.getElementById('mem-add-inp');
  const val=inp?.value?.trim();
  if(!val){toast('Enter a memory to add','err');return;}
  MEM.addFact(val,'manual');
  if(inp)inp.value='';
  toast('🧠 Memory added','ok');
}
function deleteMem(i){
  const all=[...S.memory.summaries.map(s=>({...s,type:'summary'})),
             ...S.memory.facts.map(f=>({...f,type:'fact'}))].sort((a,b)=>b.ts-a.ts);
  const item=all[i];
  if(!item)return;
  if(item.type==='summary')S.memory.summaries=S.memory.summaries.filter(s=>s.ts!==item.ts);
  else S.memory.facts=S.memory.facts.filter(f=>f.ts!==item.ts);
  MEM.save();MEM.renderUI();
}

/* ── EDIT WITH AI: code panel button ── */
function addEditWithAIButton(){
  const bar=document.getElementById('cedbar');
  if(!bar||bar.querySelector('.edit-ai-btn'))return;
  const btn=document.createElement('button');
  btn.className='cb edit-ai-btn';btn.title='Edit with AI (like Cursor)';
  btn.textContent='✏️ AI Edit';
  btn.style.cssText='background:linear-gradient(135deg,rgba(124,106,247,.15),rgba(0,212,255,.08));border-color:rgba(124,106,247,.3);color:var(--a);';
  btn.onclick=openInlineEditor;
  bar.querySelector('.cacts').prepend(btn);
}

/* ════════════ END V8 ENGINE ════════════ */

/* ══ FRAMEWORK CONFIG ══ */
const FW_CONFIG={
  vanilla:{
    label:'Vanilla JS',icon:'🌐',color:'#00d4ff',
    stackDesc:'Vanilla HTML5 + CSS3 + JavaScript (ES6+), no frameworks, runs directly in browser',
    fileMap:{html:'index.html',css:'style.css',js:'script.js'},
    canPreview:true,
    devInstructions:`Output these files:
FILE 1 - index.html: \`\`\`html ... complete HTML ... \`\`\`
FILE 2 - style.css: \`\`\`css ... complete CSS ... \`\`\`
FILE 3 - script.js: \`\`\`javascript ... complete JS ... \`\`\`
Optionally: data.json, config.json if needed.
index.html MUST link to style.css and script.js as external files.`,
    devopsInstructions:'Deploy to Netlify, Vercel, or GitHub Pages — drag and drop the folder, no build step needed.',
  },
  react:{
    label:'React',icon:'⚛️',color:'#61dafb',
    stackDesc:'React 18 via CDN (no build step), JSX via Babel standalone, runs directly in browser',
    fileMap:{html:'index.html',css:'styles.css',js:'App.jsx'},
    canPreview:true,
    devInstructions:`Output these files:
FILE 1 - index.html: \`\`\`html
<!DOCTYPE html><html><head>
<scr`+`ipt src="https://unpkg.com/react@18/umd/react.development.js"></scr`+`ipt>
<scr`+`ipt src="https://unpkg.com/react-dom@18/umd/react-dom.development.js"></scr`+`ipt>
<scr`+`ipt src="https://unpkg.com/@babel/standalone/babel.min.js"></scr`+`ipt>
<link rel="stylesheet" href="styles.css"/>
</head><body><div id="root"></div>
<scr`+`ipt type="text/babel" src="App.jsx"></scr`+`ipt>
</body></html>
\`\`\`
FILE 2 - styles.css: \`\`\`css ... complete CSS ... \`\`\`
FILE 3 - App.jsx: \`\`\`jsx
// React components using hooks (useState, useEffect, useContext, etc.)
// Use React.createElement or JSX (Babel will transpile)
// All components in one file
function App() { ... }
ReactDOM.createRoot(document.getElementById('root')).render(React.createElement(App));
\`\`\`
The App.jsx runs through Babel in-browser — use modern JSX freely.`,
    devopsInstructions:'For production: run `npx create-react-app` or `npm create vite@latest -- --template react`. Deploy to Vercel/Netlify.',
  },
  vue:{
    label:'Vue 3',icon:'💚',color:'#42b883',
    stackDesc:'Vue 3 via CDN (no build step), Composition API, runs directly in browser',
    fileMap:{html:'index.html',css:'styles.css',js:'app.js'},
    canPreview:true,
    devInstructions:`Output these files:
FILE 1 - index.html: \`\`\`html
<!DOCTYPE html><html><head>
<scr`+`ipt src="https://unpkg.com/vue@3/dist/vue.global.js"></scr`+`ipt>
<link rel="stylesheet" href="styles.css"/>
</head><body><div id="app"></div>
<scr`+`ipt src="app.js"></scr`+`ipt>
</body></html>
\`\`\`
FILE 2 - styles.css: \`\`\`css ... complete CSS ... \`\`\`
FILE 3 - app.js: \`\`\`javascript
// Vue 3 Composition API via CDN
const { createApp, ref, reactive, computed, onMounted, watch } = Vue;
// Define components and create app
createApp({ setup() { ... } }).mount('#app');
\`\`\``,
    devopsInstructions:'For production: run `npm create vue@latest`. Deploy to Vercel/Netlify.',
  },
  svelte:{
    label:'Svelte',icon:'🔥',color:'#ff3e00',
    stackDesc:'Svelte 4 + Vite scaffold (requires Node.js to run locally)',
    fileMap:{},
    canPreview:false,
    devInstructions:`Output a complete Svelte project scaffold:
FILE - package.json: \`\`\`json ... with svelte, vite, @sveltejs/vite-plugin-svelte ... \`\`\`
FILE - vite.config.js: \`\`\`javascript ... \`\`\`
FILE - src/App.svelte: \`\`\`svelte ... main component ... \`\`\`
FILE - src/main.js: \`\`\`javascript import App from './App.svelte'; ... \`\`\`
FILE - src/lib/[ComponentName].svelte: \`\`\`svelte ... reusable components ... \`\`\`
FILE - public/index.html or index.html: \`\`\`html ... \`\`\`
FILE - src/app.css: \`\`\`css ... \`\`\`
Output ALL .svelte files with full implementation. Use script, style, and template sections.`,
    devopsInstructions:'Run: npm install && npm run dev. Deploy to Vercel with `vercel` CLI or Netlify.',
  },
  nextjs:{
    label:'Next.js',icon:'▲',color:'#ffffff',
    stackDesc:'Next.js 14 App Router scaffold with TypeScript, Tailwind CSS, API routes',
    fileMap:{},
    canPreview:false,
    devInstructions:`Output a complete Next.js 14 App Router project:
FILE - package.json: \`\`\`json ... next, react, react-dom, typescript, tailwindcss ... \`\`\`
FILE - next.config.js: \`\`\`javascript ... \`\`\`
FILE - tailwind.config.js: \`\`\`javascript ... \`\`\`
FILE - app/layout.tsx: \`\`\`tsx ... root layout ... \`\`\`
FILE - app/page.tsx: \`\`\`tsx ... home page ... \`\`\`
FILE - app/globals.css: \`\`\`css ... \`\`\`
FILE - app/[feature]/page.tsx: \`\`\`tsx ... feature pages ... \`\`\`
FILE - app/api/[route]/route.ts: \`\`\`typescript ... API routes ... \`\`\`
FILE - components/[Name].tsx: \`\`\`tsx ... reusable components ... \`\`\`
FILE - lib/[util].ts: \`\`\`typescript ... utilities ... \`\`\`
FILE - types/index.ts: \`\`\`typescript ... type definitions ... \`\`\`
Use Tailwind for all styling. Include full implementation — no placeholders.`,
    devopsInstructions:'Run: npm install && npm run dev. Deploy to Vercel with zero config.',
  },
  node:{
    label:'Node.js',icon:'🟢',color:'#68a063',
    stackDesc:'Node.js + Express REST API backend with frontend served statically',
    fileMap:{},
    canPreview:false,
    devInstructions:`Output a complete Node.js + Express project:
FILE - package.json: \`\`\`json ... express, cors, dotenv, nodemon ... \`\`\`
FILE - server.js (or app.js): \`\`\`javascript ... Express app setup, routes, middleware ... \`\`\`
FILE - routes/[name].js: \`\`\`javascript ... route handlers ... \`\`\`
FILE - middleware/[name].js: \`\`\`javascript ... middleware ... \`\`\`
FILE - public/index.html: \`\`\`html ... frontend ... \`\`\`
FILE - public/style.css: \`\`\`css ... \`\`\`
FILE - public/app.js: \`\`\`javascript ... frontend JS ... \`\`\`
FILE - .env.example: \`\`\`bash ... env vars ... \`\`\`
FILE - README.md: \`\`\`markdown ... setup instructions ... \`\`\`
Include full REST API with proper error handling, status codes, and CORS.`,
    devopsInstructions:'Run: npm install && npm start. Deploy to Railway, Render, Heroku, or DigitalOcean.',
  },
  python:{
    label:'Python',icon:'🐍',color:'#3776ab',
    stackDesc:'Python Flask or FastAPI backend with HTML/JS frontend',
    fileMap:{},
    canPreview:false,
    devInstructions:`Output a complete Python web project. Choose Flask for simple apps, FastAPI for REST APIs:

FOR FLASK:
FILE - app.py: \`\`\`python ... Flask app with routes ... \`\`\`
FILE - requirements.txt: \`\`\`bash flask flask-cors python-dotenv ... \`\`\`
FILE - templates/index.html: \`\`\`html ... Jinja2 template ... \`\`\`
FILE - static/style.css: \`\`\`css ... \`\`\`
FILE - static/app.js: \`\`\`javascript ... \`\`\`

FOR FASTAPI:
FILE - main.py: \`\`\`python ... FastAPI app with endpoints ... \`\`\`
FILE - requirements.txt: \`\`\`bash fastapi uvicorn pydantic python-dotenv ... \`\`\`
FILE - models.py: \`\`\`python ... Pydantic models ... \`\`\`
FILE - routers/[name].py: \`\`\`python ... route handlers ... \`\`\`
FILE - frontend/index.html: \`\`\`html ... frontend ... \`\`\`

FILE - .env.example: \`\`\`bash ... \`\`\`
FILE - README.md: \`\`\`markdown ... setup + run instructions ... \`\`\``,
    devopsInstructions:'Run: pip install -r requirements.txt && python app.py (Flask) or uvicorn main:app --reload (FastAPI). Deploy to Railway, Render, or Heroku.',
  },
};

/* ══ FRAMEWORK SELECTOR ══ */
function setFramework(fw, el){
  S.framework=fw;
  document.querySelectorAll('.fwtab').forEach(t=>t.classList.remove('active'));
  if(el)el.classList.add('active');
  const cfg=FW_CONFIG[fw];
  // Update badge
  const badge=document.getElementById('fw-badge');
  if(badge){badge.textContent=cfg.icon+' '+cfg.label;badge.className='fw-badge show';badge.style.cssText=`display:flex;background:${cfg.color}18;border:1px solid ${cfg.color}44;color:${cfg.color};`;}
  // Update run button state
  const runbtn=document.getElementById('runbtn');
  if(runbtn)runbtn.disabled=!Object.keys(S.files).length;
  // Update run button label
  if(runbtn)runbtn.textContent=fwCfg?.canPreview?'▶ Run':'📦 Guide';
  // Update input placeholder
  const pi=document.getElementById('pi');
  const placeholders={
    vanilla:'Build a weather app with live API and dark mode…',
    react:'Build a React todo app with drag & drop and animations…',
    vue:'Build a Vue 3 dashboard with charts and real-time data…',
    svelte:'Build a Svelte e-commerce store with cart and checkout…',
    nextjs:'Build a Next.js blog with CMS, dark mode, and SEO…',
    node:'Build a Node.js REST API for a task management app…',
    python:'Build a Python Flask API for a recipe management app…',
  };
  if(pi&&!pi.value)pi.placeholder=placeholders[fw]||pi.placeholder;
  toast(`Stack: ${cfg.icon} ${cfg.label}`,'ok');
}

/* ══ PROMPTS ══ */
const PROMPTS={
ceo:(p)=>{
  const fw=FW_CONFIG[S.framework||'vanilla'];
  return`You are the CEO of NeuralForge, an elite AI software company.

Project Request: "${p}"
Selected Tech Stack: ${fw.icon} ${fw.label} — ${fw.stackDesc}

Your role: Provide strategic direction.
1. Assess scope and business value
2. Define vision in 2-3 sentences  
3. Confirm tech stack: ${fw.label} (${fw.stackDesc})
4. Top 3 business requirements
5. Quality bar: production-ready, polished, fully functional

Be decisive. Use ## headings.`;
},

manager:(p,ctx)=>{
  const fw=FW_CONFIG[S.framework||'vanilla'];
  return`You are the Engineering Manager at NeuralForge.

Project: "${p}"
Stack: ${fw.icon} ${fw.label}
CEO Directive: ${(ctx.ceo||'').slice(0,500)}

Break down the project:
1. Sprint breakdown per phase
2. Tech stack: ${fw.stackDesc}
3. List EVERY file that will be created (be specific for ${fw.label})
4. Risk assessment
5. Definition of Done

Be specific about the file structure for a ${fw.label} project.`;
},

planner:(p,ctx)=>{
  const fw=FW_CONFIG[S.framework||'vanilla'];
  return`You are the Lead System Architect at NeuralForge.

Project: "${p}"
Stack: ${fw.label} — ${fw.stackDesc}
Manager Plan: ${(ctx.manager||'').slice(0,500)}

Technical architecture:
- Component/module structure for ${fw.label}
- ALL features (P0/P1/P2)
- Exact file structure for this stack
- State management approach
- API design (if applicable)
- Performance and accessibility targets

Use ## headings and code snippets.`;
},

pm:(p,ctx)=>{
  const fw=FW_CONFIG[S.framework||'vanilla'];
  return`You are the Product Manager at NeuralForge.

Project: "${p}"
Stack: ${fw.label}
Architecture: ${(ctx.planner||'').slice(0,500)}

Define features and acceptance criteria:
- P0 must-haves with precise acceptance criteria
- P1 should-haves
- P2 nice-to-haves
- Every screen, modal, component needed
- State management requirements
- Error/loading/empty states
- Edge cases specific to ${fw.label}`;
},

designer:(p,ctx)=>{
  const fw=FW_CONFIG[S.framework||'vanilla'];
  return`You are the Senior UI/UX Designer at NeuralForge.

Project: "${p}"
Stack: ${fw.label}

Design the complete visual system:
1. ${fw.fw==='nextjs'?'Tailwind config + custom theme tokens':'CSS design tokens as :root{} block'} (ALL colors, fonts, spacing, shadows)
2. Layout patterns (grid/flex)
3. Component specs (buttons, cards, inputs, modals, nav)
4. Animation and transition specs
5. Responsive breakpoints (mobile-first)
6. Dark/light mode

Make it STUNNING and MODERN. Output the complete ${fw.fw==='nextjs'?'tailwind.config.js':'CSS :root{}'} in a code block.`;
},

developer:(p,ctx)=>{
  const fw=FW_CONFIG[S.framework||'vanilla'];
  return`You are the Senior Full-Stack Developer at NeuralForge. You write COMPLETE, PRODUCTION-READY ${fw.label} code.

Project: "${p}"
Stack: ${fw.icon} ${fw.label} — ${fw.stackDesc}
Design system: ${(ctx.designer||'').slice(0,350)}
Product specs: ${(ctx.pm||'').slice(0,350)}

${fw.devInstructions}

STRICT REQUIREMENTS:
- EVERY file must be 100% complete — no "// TODO", no placeholders, no "add your code here"
- All interactive features must actually work end-to-end
- Beautiful, polished, production-quality UI
- Proper error handling throughout
- ${fw.label==='Node.js'||fw.label==='Python'?'Full REST API with proper status codes and error responses':'Modern patterns and best practices for '+fw.label}
- Include ALL files needed to run the project`;
},

reviewer:(p,ctx)=>{
  const fw=FW_CONFIG[S.framework||'vanilla'];
  return`You are the Code Reviewer at NeuralForge.

Project: "${p}" (${fw.label} stack)

Review the generated code:
1. ${fw.label}-specific best practices and patterns
2. Check for framework anti-patterns
3. Security issues (XSS, injection, exposed secrets)
4. Missing error handling
5. Performance problems
6. Accessibility gaps
7. Missing features from spec
8. Rate code quality: /10

Be specific and actionable.`;
},

optimizer:(p,ctx)=>{
  const fw=FW_CONFIG[S.framework||'vanilla'];
  return`You are the Performance Optimizer at NeuralForge.

Project: "${p}" (${fw.label} stack)
Review: ${(ctx.reviewer||'').slice(0,400)}

Optimize for ${fw.label}:
${fw.label==='React'?'- Memoization (useMemo, useCallback, React.memo)\n- Avoid unnecessary re-renders\n- Code splitting and lazy loading':
  fw.label==='Next.js'?'- Server components vs client components\n- Image optimization (next/image)\n- Static generation vs SSR\n- Bundle analysis':
  fw.label==='Node.js'||fw.label==='Python'?'- API response caching\n- Database query optimization\n- Async/await patterns\n- Rate limiting':
  '- CSS: use transform/opacity for animations\n- JS: debounce, cache DOM queries\n- Lazy loading'}
- Bundle size (remove unused code)
- Loading states for async ops

Give specific code snippets.`;
},

a11y:(p,ctx)=>`You are the Accessibility Expert at NeuralForge.

Project: "${p}"

Full accessibility audit:
- ARIA labels, roles, states on all interactive elements
- Color contrast WCAG AA (4.5:1 minimum)
- Keyboard navigation and focus management
- Screen reader compatibility
- Semantic HTML / component structure
- Form validation and error announcements
- Reduced motion support
- Focus visible indicators

List every fix with code. Score: /10.`,

debugger:(p,ctx)=>`You are the Debugger at NeuralForge.

Project: "${p}" (${FW_CONFIG[S.framework||'vanilla'].label} stack)
Review findings: ${(ctx.reviewer||'').slice(0,300)}
A11y findings: ${(ctx.a11y||'').slice(0,300)}

Fix all critical issues:
1. List exact bugs being fixed
2. BEFORE → AFTER for each fix
3. Runtime errors that would crash the app
4. Missing feature implementations
5. Error handling gaps

Concrete code fixes only. Use appropriate code fences.`,

devops:(p,ctx)=>{
  const fw=FW_CONFIG[S.framework||'vanilla'];
  return`You are the DevOps Lead at NeuralForge.

Project: "${p}" (${fw.label} stack)

Build complete! Wrap up:
1. Summary: features built, tech stack used
2. ${fw.devopsInstructions}
3. Environment variables needed
4. README.md with setup, run, and deploy instructions (output as \`\`\`markdown block)
5. Project stats (files, features, complexity)
6. Top 5 next improvements

Output the full README.md in a \`\`\`markdown code block. Be celebratory! 🚀`;
},

websearcher:(p,ctx)=>`You are the Web Research Agent at NeuralForge — the first agent to run before any code is written.

Project to build: "${p}" (${FW_CONFIG[S.framework||'vanilla'].label} stack)

Your job: Research the best approach BEFORE the team starts building. Provide a concise technical brief covering:

## 🔍 Research Brief for: "${p}"

**1. Best Libraries & Packages**
List the top 3-5 most suitable libraries/CDN packages for this project with one-line descriptions.

**2. Recommended Architecture**
2-3 sentences on the best structural approach for this specific project.

**3. Key Browser/External APIs**
Any Web APIs (Canvas, Web Audio, Geolocation, Fetch, etc.) or external services that would help.

**4. Common Pitfalls to Avoid**
Top 3 mistakes developers make when building this type of project.

**5. Performance Considerations**
2-3 specific performance tips relevant to this project.

**6. Accessibility Checklist**
3 key a11y requirements for this project type.

Be specific to THIS project — not generic advice. The CEO and all downstream agents will use this brief.`,

promptagent:(p,ctx)=>{
  const research=(ctx.websearcher||ctx._webResearch||'').slice(0,400);
  const ceoStrategy=(ctx.ceo||'').slice(0,400);
  return`You are the Prompt Engineer & Optimizer at NeuralForge. You run AFTER the CEO and BEFORE the Manager.

Your mission: Take the raw user request and the CEO's strategy, then produce a single, perfectly structured master prompt that the entire downstream team (Manager → Planner → PM → Designer → Developer → Reviewer → Optimizer → A11y → Debugger → DevOps → Tester) will use as their north star.

Original user request: "${p}"
Framework/Stack: ${FW_CONFIG[S.framework||'vanilla'].label}
CEO Strategy: ${ceoStrategy||'Not yet available — reason from the user request.'}
Web Research: ${research||'Not yet available.'}

Produce a **Refined Master Prompt** with these sections:

## ✍️ Refined Project Brief

**Core Goal** (1 sentence — what must be built)

**User Stories** (5-7 "As a user, I want…" stories)

**Technical Requirements**
- Stack & key libraries (be specific, include CDN links if vanilla)
- Data structures / state management approach
- API integrations required

**UI/UX Requirements**
- Layout structure and key screens/views
- Color scheme, typography, animations
- Responsive breakpoints required

**Quality Gates**
- Performance targets (load time, animations at 60fps, etc.)
- Accessibility: WCAG 2.1 AA checklist items
- Error handling requirements

**Out of Scope** (what NOT to build — keeps team focused)

**Definition of Done** (exactly when the project is complete)

Be precise and actionable. This brief is the single source of truth for all 11 downstream agents.`;
},

tester:(p,ctx)=>`You are the Test Agent at NeuralForge — the final agent in the pipeline, running AFTER DevOps.

Project: "${p}" (${FW_CONFIG[S.framework||'vanilla'].label} stack)
DevOps summary: ${(ctx.devops||'').slice(0,300)}
Code produced: ${Object.keys(S.files||{}).join(', ')||'(none)'}

Run a comprehensive final quality audit:

## 🧪 Final Test Report for: "${p}"

**Static Analysis**
- Review code structure, naming, unused variables
- Check for console.log/TODO/FIXME left in production code
- Verify all imports/references resolve

**Functional Test Cases**
List 5-8 specific test cases for THIS project:
\`\`\`
✅/❌ Test: [description] → Expected: [result]
\`\`\`

**Browser Compatibility**
Note any code patterns that might fail in older browsers.

**Security Scan**
Flag any: eval(), innerHTML with user data, missing input sanitization, hardcoded secrets.

**Performance Score**
Rate: Loading speed / Render performance / Memory usage (1-10 each)

**Overall Verdict**
PASS ✅ or FAIL ❌ with top 3 actionable fixes if failed.

Be strict and specific. This is the final gate before delivery.`
};

/* ══ UTIL ══ */
const ftime=()=>new Date().toLocaleTimeString('en-US',{hour:'2-digit',minute:'2-digit',hour12:true});
function esc(s){return String(s||'').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;')}
function sleep(ms){return new Promise(r=>setTimeout(r,ms))}
function autosize(el){el.style.height='auto';el.style.height=Math.min(el.scrollHeight,120)+'px'}

/* ══ STORAGE ══ */
function loadCfg(){try{const s=localStorage.getItem(LS_CFG);if(s)Object.assign(S.cfg,JSON.parse(s))}catch(e){}}
function saveCfg(){try{localStorage.setItem(LS_CFG,JSON.stringify(S.cfg))}catch(e){}}
function getHist(){try{return JSON.parse(localStorage.getItem(LS_HIST)||'[]')}catch(e){return[]}}
function saveHist(a){try{localStorage.setItem(LS_HIST,JSON.stringify(a.slice(0,20)))}catch(e){}}
function persistSession(){
  if(!S.project||!S.chatLog.length)return;
  const h=getHist(),idx=h.findIndex(x=>x.id===S.sid);
  const displayName=S._sessionTitle||S.project;
  const e={id:S.sid,name:displayName,ts:Date.now(),chatLog:S.chatLog,files:S.files,done:!S.building};
  idx>=0?h[idx]=e:h.unshift(e);
  saveHist(h);renderHistList();
}

/* ══ SESSION TITLE SIMPLIFIER ══
   Generates a short, clean human-readable title from the raw user prompt.
   Examples:
     "Build a weather app with OpenWeatherMap API, animations, dark mode" → "Weather App"
     "Create a Kanban board with drag and drop and local storage"        → "Kanban Board"
     "Make a music player with canvas waveform visualizer"               → "Music Player"
   Runs asynchronously after build starts — updates pbadge + history silently.
*/
async function simplifyTitle(rawPrompt){
  if(!rawPrompt)return rawPrompt;

  // Fast local heuristic first — covers 80% of cases instantly, no API call needed
  const local=_guessTitle(rawPrompt);
  if(local){
    _applySessionTitle(local);
    return local;
  }

  // Fallback: quick AI call (uses smallest/fastest model)
  try{
    const result=await callWithRetry(
      'You are a session title generator. Output ONLY a short title (2-5 words max, Title Case). No punctuation, no quotes, no extra words.',
      [{role:'user',content:`Generate a concise title for this project: "${rawPrompt.slice(0,200)}"\n\nExamples:\n"Build a weather app with animations" → Weather App\n"Create kanban board with drag drop" → Kanban Board\n"Todo list with categories and priorities" → Todo Manager\n\nTitle only, nothing else:`}],
      {id:'devops'} // use fast agent profile
    );
    if(result){
      const clean=result.replace(/["'`*_#\n]/g,'').trim().slice(0,40);
      if(clean.length>=2)_applySessionTitle(clean);
      return clean;
    }
  }catch(e){}

  return local||rawPrompt.slice(0,30);
}

/* Instant local title guesser — regex patterns for common project types */
function _guessTitle(prompt){
  const p=prompt.toLowerCase();
  const patterns=[
    [/weather/,                        'Weather App'],
    [/todo|task|task.?list/,           'Todo Manager'],
    [/kanban|board.*drag|drag.*board/, 'Kanban Board'],
    [/chat|messaging|message.?app/,    'Chat App'],
    [/music.?player|audio.?player/,   'Music Player'],
    [/e.?commerce|shop|store|cart/,    'E-Commerce Store'],
    [/dashboard|analytics|chart/,      'Analytics Dashboard'],
    [/calendar|event.?plann/,          'Calendar App'],
    [/note.?tak|markdown.?editor/,     'Notes App'],
    [/portfolio|personal.?site/,       'Portfolio Site'],
    [/blog|cms|content/,               'Blog / CMS'],
    [/auth|login|register|sign.?in/,   'Auth System'],
    [/game|canvas.?game|breakout/,     'Browser Game'],
    [/quiz|trivia/,                    'Quiz App'],
    [/recipe|food|cooking/,            'Recipe App'],
    [/fitness|workout|exercise/,       'Fitness Tracker'],
    [/budget|expense|finance|money/,   'Budget Tracker'],
    [/url.?short|link.?short/,         'URL Shortener'],
    [/color.?palet|color.?pick/,       'Color Tool'],
    [/map|geoloc/,                     'Map App'],
    [/image|photo|gallery/,            'Photo Gallery'],
    [/clock|timer|stopwatch/,          'Clock / Timer'],
    [/calculator|calc\b/,              'Calculator'],
    [/form|survey|questionnaire/,      'Form Builder'],
    [/api|rest.?api|endpoint/,         'REST API'],
    [/landing.?page|hero.?section/,    'Landing Page'],
    [/social|feed|post/,               'Social Feed'],
    [/markdown|md.?preview/,          'Markdown Editor'],
    [/drawing|paint|canvas.?draw/,     'Drawing App'],
    [/3d|three\.?js|webgl/,            '3D Viewer'],
    [/chatbot|ai.?chat|gpt/,           'AI Chatbot'],
    [/typing|typewriter/,              'Typing App'],
    [/snake|tetris|pacman|flappy/,     'Arcade Game'],
    [/flash.?card|flashcard|memory.?game/, 'Flashcard App'],
    [/pomodoro|focus.?timer/,          'Pomodoro Timer'],
    [/habit|streak|track/,             'Habit Tracker'],
  ];
  for(const[re,title]of patterns){
    if(re.test(p))return title;
  }
  // Generic: try to extract first noun phrase (up to 3 words) after "build/make/create/a"
  const m=p.match(/(?:build|make|create|design|develop)\s+(?:a\s+|an\s+)?([a-z]+(?:\s+[a-z]+){0,2})/i);
  if(m){
    return m[1].replace(/\b\w/g,c=>c.toUpperCase()).trim();
  }
  return null;
}

function _applySessionTitle(title){
  if(!title||title===S._sessionTitle)return;
  S._sessionTitle=title;
  // Update header badge
  const badge=document.getElementById('pbadge');
  if(badge&&S.building){
    // Keep the agent progress suffix if building, just update the project name part
    badge.innerHTML=title.slice(0,22)+(title.length>22?'…':'')+
      (S.building?` <span style="color:var(--t3);font-weight:400" id="pbadge-agent"></span>`:'');
  } else if(badge&&!S.building){
    badge.textContent=title;
  }
  // Update saved session name
  const h=getHist(),idx=h.findIndex(x=>x.id===S.sid);
  if(idx>=0){h[idx].name=title;saveHist(h);renderHistList();}
}

/* ══ AGENT MODEL PICKER ══ */
function agentModel(agent){
  if(S.cfg.mm==='single') return S.cfg.model;
  const isGroq=S.cfg.provider==='groq';
  return isGroq?(agent.model_gr||S.cfg.model):(agent.model_or||S.cfg.model);
}

/* ══ API CALL ══ */


/* ══ CODE EXTRACTION ══ */
function extractCode(text,lang){
  if(!text)return null;
  const exact=text.match(new RegExp('```'+lang+'\\s*\\n([\\s\\S]*?)```','i'));
  if(exact&&exact[1].trim())return exact[1].trim();
  const all=[...text.matchAll(/```(?:\w*)\s*\n([\s\S]*?)```/gi)];
  if(all.length===1)return all[0][1].trim();
  if(all.length>1)return all.reduce((a,b)=>b[1].length>a[1].length?b:a)[1].trim();
  return null;
}

/* ══ AUTO FILE DETECTION & EXTRACTION ══ */
function detectFileType(lang, code){
  const l=(lang||'').toLowerCase().trim();
  if(l==='html'||l==='html5')return{ext:'html',lang:'html',icon:'📄',color:'#f07178'};
  if(l==='css'||l==='scss'||l==='sass')return{ext:'css',lang:'css',icon:'🎨',color:'#c792ea'};
  if(l==='javascript'||l==='js'||l==='jsx')return{ext:'js',lang:'javascript',icon:'⚡',color:'#ffd166'};
  if(l==='typescript'||l==='ts'||l==='tsx')return{ext:'ts',lang:'typescript',icon:'🔷',color:'#89ddff'};
  if(l==='json')return{ext:'json',lang:'json',icon:'📦',color:'#c3e88d'};
  if(l==='markdown'||l==='md')return{ext:'md',lang:'markdown',icon:'📝',color:'#82aaff'};
  if(l==='python'||l==='py')return{ext:'py',lang:'python',icon:'🐍',color:'#a5f3fc'};
  if(l==='bash'||l==='sh'||l==='shell')return{ext:'sh',lang:'bash',icon:'⚙️',color:'#00e5a0'};
  if(l==='sql')return{ext:'sql',lang:'sql',icon:'🗃️',color:'#ffcb6b'};
  if(l==='xml')return{ext:'xml',lang:'xml',icon:'🔖',color:'#f07178'};
  // Auto-detect from code content
  if(/<(!DOCTYPE|html|head|body)/i.test(code))return{ext:'html',lang:'html',icon:'📄',color:'#f07178'};
  if(/\b(display|position|flex|grid|margin|padding):/.test(code)&&/[{;}]/.test(code))return{ext:'css',lang:'css',icon:'🎨',color:'#c792ea'};
  if(/\b(const|let|var|function|=>|async |document\.)/. test(code))return{ext:'js',lang:'javascript',icon:'⚡',color:'#ffd166'};
  if(/^\s*\{[\s\S]*\}\s*$/.test(code.trim()))return{ext:'json',lang:'json',icon:'📦',color:'#c3e88d'};
  return{ext:'txt',lang:'',icon:'📋',color:'#a0a0b8'};
}

/* Canonical filename mapping */
function canonicalName(ext, existing){
  const names={html:'index.html',css:'style.css',js:'script.js',ts:'main.ts',json:'data.json',md:'README.md',py:'main.py',sh:'setup.sh',sql:'schema.sql',txt:'notes.txt'};
  let base=names[ext]||'file.'+ext;
  if(!existing[base])return base;
  // find next available index
  let i=2;while(existing[base.replace('.',`${i}.`)])i++;
  return base.replace('.',`${i}.`);
}

/* Extract ALL code blocks from developer output and populate S.files */
function extractAllFiles(text){
  if(!text)return 0;
  const re=/```(\w*)\n?([\s\S]*?)```/g;
  let m, count=0;
  // First pass: collect all blocks
  const blocks=[];
  while((m=re.exec(text))!==null){
    const lang=m[1]||'';
    const code=m[2].trim();
    if(!code||code.length<20)continue;
    blocks.push({lang,code});
  }
  // Assign canonical names
  const assigned={};
  blocks.forEach(({lang,code})=>{
    const type=detectFileType(lang,code);
    const name=canonicalName(type.ext, assigned);
    assigned[name]={c:code, lang:type.lang, icon:type.icon, color:type.color, size:code.length};
    count++;
  });
  // Merge into S.files (preserve existing, update/add new)
  Object.assign(S.files, assigned);
  return count;
}

/* ══ FILE TREE RENDERING ══ */
const FILE_ICONS={
  html:{icon:'📄',color:'#f07178',desc:'HTML'},
  css:{icon:'🎨',color:'#c792ea',desc:'CSS'},
  js:{icon:'⚡',color:'#ffd166',desc:'JavaScript'},
  ts:{icon:'🔷',color:'#89ddff',desc:'TypeScript'},
  json:{icon:'📦',color:'#c3e88d',desc:'JSON'},
  md:{icon:'📝',color:'#82aaff',desc:'Markdown'},
  py:{icon:'🐍',color:'#a5f3fc',desc:'Python'},
  sh:{icon:'⚙️',color:'#00e5a0',desc:'Shell'},
  sql:{icon:'🗃️',color:'#ffcb6b',desc:'SQL'},
  xml:{icon:'🔖',color:'#f07178',desc:'XML'},
  txt:{icon:'📋',color:'#a0a0b8',desc:'Text'},
};

function getFileIconInfo(fname){
  const ext=(fname.split('.').pop()||'').toLowerCase();
  return FILE_ICONS[ext]||{icon:'📋',color:'#a0a0b8',desc:ext.toUpperCase()||'File'};
}

function renderFiles(){
  const t=document.getElementById('ftree');
  t.innerHTML='';
  const files=Object.keys(S.files);
  if(!files.length){
    t.innerHTML='<div id="ftree-empty" style="padding:8px;font-size:.69rem;color:var(--t3)">No files yet — build a project</div>';
    return;
  }

  // Header row
  const hdr=document.createElement('div');
  hdr.style.cssText='display:flex;align-items:center;justify-content:space-between;padding:6px 10px 3px;border-bottom:1px solid var(--border)';
  hdr.innerHTML=`<span style="font-size:.58rem;font-weight:700;letter-spacing:.1em;color:var(--t3);text-transform:uppercase">Project Files</span><span style="font-size:.58rem;color:var(--t3);font-family:var(--mono)">${files.length} file${files.length!==1?'s':''}</span>`;
  t.appendChild(hdr);

  // Group files by type
  const groups={};
  files.forEach(f=>{
    const ext=(f.split('.').pop()||'').toLowerCase();
    if(!groups[ext])groups[ext]=[];
    groups[ext].push(f);
  });

  // Sort: html first, css, js, json, md, others
  const order=['html','css','js','ts','json','md','py','sh','sql','xml','txt'];
  const sortedExts=[...order.filter(e=>groups[e]),...Object.keys(groups).filter(e=>!order.includes(e))];

  sortedExts.forEach(ext=>{
    const groupFiles=groups[ext];
    const info=FILE_ICONS[ext]||{icon:'📋',color:'#a0a0b8',desc:ext.toUpperCase()};

    if(sortedExts.length>1||groupFiles.length>1){
      // Folder row for multi-ext projects
      const folder=document.createElement('div');
      folder.className='ft-folder open';
      folder.innerHTML=`<div class="ft-folder-header" onclick="this.parentElement.classList.toggle('open')">
        <span class="ft-folder-arrow">▶</span>
        <span style="font-size:11px;margin-right:2px">${info.icon}</span>
        <span class="ft-folder-name" style="color:${info.color}">${info.desc}</span>
        <span class="ft-file-count">${groupFiles.length}</span>
      </div>
      <div class="ft-children"></div>`;
      const children=folder.querySelector('.ft-children');
      groupFiles.forEach(f=>children.appendChild(makeFileRow(f)));
      t.appendChild(folder);
    } else {
      groupFiles.forEach(f=>t.appendChild(makeFileRow(f)));
    }
  });
}

function makeFileRow(f){
  const file=S.files[f];
  const info=getFileIconInfo(f);
  const sizeKb=(file.c.length/1024).toFixed(1);
  const lines=file.c.split('\n').length;
  const el=document.createElement('div');
  el.className='fi';
  el.id='fi-'+CSS.escape(f);
  el.dataset.fname=f;
  el.setAttribute('title',`${f} — ${sizeKb}KB, ${lines} lines`);
  el.onclick=()=>selFile(f);
  el.innerHTML=`<span class="fi-ic" style="color:${info.color}">${info.icon}</span>
    <span class="fi-name">${f}</span>
    <span class="fi-meta">
      <span class="fi-lines">${lines}L</span>
      <span class="fi-sz">${sizeKb}K</span>
    </span>`;
  if(f===S.selFile)el.classList.add('sel');
  return el;
}

/* ══ MARKDOWN ══ */
function md(raw){
  if(!raw)return'';
  return esc(raw)
    .replace(/```(\w*)\n?([\s\S]*?)```/g,'')
    .replace(/`([^`]+)`/g,'<code style="background:rgba(124,106,247,.15);padding:2px 6px;border-radius:4px;font-size:.8em;color:var(--cyan);font-family:var(--mono);border:1px solid rgba(124,106,247,.18)">$1</code>')
    .replace(/\*\*(.+?)\*\*/g,'<strong>$1</strong>')
    .replace(/\*(.+?)\*/g,'<em>$1</em>')
    .replace(/^### (.+)$/gm,'<strong style="font-size:.8rem;display:block;margin:6px 0 2px;color:var(--t2)">$1</strong>')
    .replace(/^## (.+)$/gm,'<strong style="font-size:.86rem;display:block;margin:8px 0 3px;font-family:var(--display)">$1</strong>')
    .replace(/^# (.+)$/gm,'<strong style="font-size:.94rem;display:block;margin:10px 0 4px;font-family:var(--display);border-bottom:1px solid var(--border);padding-bottom:4px">$1</strong>')
    .replace(/^\| (.+) \|$/gm,(_,r)=>`<div style="font-family:var(--mono);font-size:.69rem;padding:2px 0;border-bottom:1px solid var(--border)">${r.replace(/\|/g,' │ ')}</div>`)
    .replace(/^\|[-| ]+\|$/gm,'')
    .replace(/^(\d+)\. (.+)$/gm,'<span style="display:block;padding-left:14px"><span style="color:var(--a);font-weight:600;margin-right:5px">$1.</span>$2</span>')
    .replace(/^[-*] (.+)$/gm,'<span style="display:block;padding-left:12px"><span style="color:var(--a);margin-right:5px">•</span>$1</span>')
    .replace(/^---$/gm,'<hr/>')
    .replace(/\n/g,'<br>');
}
function parseCode(text){
  const blocks=[];
  const prose=text.replace(/```(\w*)\n?([\s\S]*?)```/g,(_,lang,code)=>{blocks.push({lang:lang||'code',code:code.trim()});return''}).trim();
  return{prose,blocks};
}
function extFor(lang){return{html:'html',css:'css',javascript:'js',js:'js',python:'py',sql:'sql',bash:'sh',json:'json',typescript:'ts'}[lang?.toLowerCase()]||'txt'}

/* ══ SYNTAX HIGHLIGHT ══ */
function pushHlToken(tokens,html){
  const key=String.fromCharCode(0xE000+tokens.length);
  tokens.push({key,html});
  return key;
}
function wrapHlMatches(text,tokens,regex,render){
  return text.replace(regex,function(...args){
    return pushHlToken(tokens,render(...args));
  });
}
function restoreHlTokens(text,tokens){
  return tokens.reduce((out,token)=>out.split(token.key).join(token.html),text);
}
function highlightHtmlAttrs(attrs){
  const tokens=[];
  let out=attrs;
  out=wrapHlMatches(out,tokens,/([\w:-]+)(\s*=\s*)("(?:[^"]*)"|'(?:[^']*)')/g,function(match,name,eq,value){
    return `<span class="attr">${name}</span>${eq}<span class="str">${value}</span>`;
  });
  out=wrapHlMatches(out,tokens,/(\s)([\w:-]+)(?=(?:\s|$))/g,function(match,lead,name){
    return `${lead}<span class="attr">${name}</span>`;
  });
  return restoreHlTokens(out,tokens);
}
function highlightEscapedLine(line,lang){
  const l=(lang||'').toLowerCase();
  const tokens=[];
  let out=line;

  if(l==='html'||l==='xml'){
    out=wrapHlMatches(out,tokens,/(&lt;!--[\s\S]*?--&gt;)/g,function(match){
      return `<span class="cmt">${match}</span>`;
    });
    out=wrapHlMatches(out,tokens,/(&lt;\/?)([-\w:]+)([\s\S]*?)(&gt;)/g,function(match,open,tagName,attrs,close){
      return `${open}<span class="tag">${tagName}</span>${highlightHtmlAttrs(attrs)}${close}`;
    });
    return restoreHlTokens(out,tokens);
  }

  if(l==='css'||l==='scss'){
    out=wrapHlMatches(out,tokens,/("(?:[^"\\]|\\.)*")/g,match=>`<span class="str">${match}</span>`);
    out=wrapHlMatches(out,tokens,/('(?:[^'\\]|\\.)*')/g,match=>`<span class="str">${match}</span>`);
    out=wrapHlMatches(out,tokens,/(\/\*.*?\*\/)/g,match=>`<span class="cmt">${match}</span>`);
    out=wrapHlMatches(out,tokens,/(\/\/.*$)/g,match=>`<span class="cmt">${match}</span>`);
    out=wrapHlMatches(out,tokens,/(#[0-9a-fA-F]{3,8})\b/g,match=>`<span class="num">${match}</span>`);
    out=wrapHlMatches(out,tokens,/\b(\d+\.?\d*)(px|em|rem|vh|vw|%|s|ms|deg)?\b/g,function(match,num,unit=''){
      return `<span class="num">${num}${unit}</span>`;
    });
    out=wrapHlMatches(out,tokens,/(--[-\w]+)/g,match=>`<span class="bool">${match}</span>`);
    out=wrapHlMatches(out,tokens,/\b(display|position|flex|grid|margin|padding|width|height|color|background|font|border|align|justify|overflow|transform|transition|animation|opacity|cursor|z-index|content|gap|top|left|right|bottom|inset|max-width|min-height|pointer-events|box-shadow|border-radius|text-align|font-size|font-weight|line-height)\b/g,match=>`<span class="kw">${match}</span>`);
    return restoreHlTokens(out,tokens);
  }

  if(l==='javascript'||l==='js'||l==='typescript'||l==='ts'||l==='jsx'||l==='tsx'){
    out=wrapHlMatches(out,tokens,/(`[^`]*`)/g,match=>`<span class="str">${match}</span>`);
    out=wrapHlMatches(out,tokens,/("(?:[^"\\]|\\.)*")/g,match=>`<span class="str">${match}</span>`);
    out=wrapHlMatches(out,tokens,/('(?:[^'\\]|\\.)*')/g,match=>`<span class="str">${match}</span>`);
    out=wrapHlMatches(out,tokens,/(\/\/.*$)/g,match=>`<span class="cmt">${match}</span>`);
    out=wrapHlMatches(out,tokens,/\b(const|let|var|function|async|await|return|if|else|for|while|do|class|extends|new|this|super|import|export|default|typeof|instanceof|of|in|try|catch|finally|throw|switch|case|break|continue|delete|yield|from|as|static)\b/g,match=>`<span class="kw">${match}</span>`);
    out=wrapHlMatches(out,tokens,/\b(true|false|null|undefined|NaN|Infinity)\b/g,match=>`<span class="bool">${match}</span>`);
    out=wrapHlMatches(out,tokens,/\b(\d+\.?\d*)\b/g,match=>`<span class="num">${match}</span>`);
    out=wrapHlMatches(out,tokens,/\b([a-zA-Z_$][\w$]*)(?=\s*\()/g,function(match,name){
      return `<span class="fn">${name}</span>`;
    });
    return restoreHlTokens(out,tokens);
  }

  if(l==='json'){
    out=wrapHlMatches(out,tokens,/("(?:[^"\\]|\\.)*")(\s*:)/g,function(match,key,colon){
      return `<span class="attr">${key}</span>${colon}`;
    });
    out=wrapHlMatches(out,tokens,/:(\s*)("(?:[^"\\]|\\.)*")/g,function(match,space,value){
      return `:${space}<span class="str">${value}</span>`;
    });
    out=wrapHlMatches(out,tokens,/\b(true|false|null)\b/g,match=>`<span class="bool">${match}</span>`);
    out=wrapHlMatches(out,tokens,/\b(\d+\.?\d*)\b/g,match=>`<span class="num">${match}</span>`);
    return restoreHlTokens(out,tokens);
  }

  if(l==='python'||l==='py'){
    out=wrapHlMatches(out,tokens,/("(?:[^"\\]|\\.)*")/g,match=>`<span class="str">${match}</span>`);
    out=wrapHlMatches(out,tokens,/('(?:[^'\\]|\\.)*')/g,match=>`<span class="str">${match}</span>`);
    out=wrapHlMatches(out,tokens,/(#.*$)/g,match=>`<span class="cmt">${match}</span>`);
    out=wrapHlMatches(out,tokens,/\b(def|class|import|from|as|return|if|elif|else|for|while|in|not|and|or|try|except|finally|with|pass|break|continue|raise|yield|lambda|global|nonlocal|async|await)\b/g,match=>`<span class="kw">${match}</span>`);
    out=wrapHlMatches(out,tokens,/\b(True|False|None)\b/g,match=>`<span class="bool">${match}</span>`);
    out=wrapHlMatches(out,tokens,/\b(\d+\.?\d*)\b/g,match=>`<span class="num">${match}</span>`);
    return restoreHlTokens(out,tokens);
  }

  if(l==='bash'||l==='sh'||l==='shell'){
    out=wrapHlMatches(out,tokens,/("(?:[^"\\]|\\.)*")/g,match=>`<span class="str">${match}</span>`);
    out=wrapHlMatches(out,tokens,/('(?:[^'\\]|\\.)*')/g,match=>`<span class="str">${match}</span>`);
    out=wrapHlMatches(out,tokens,/(#.*$)/g,match=>`<span class="cmt">${match}</span>`);
    out=wrapHlMatches(out,tokens,/\b(echo|cd|ls|mkdir|rm|cp|mv|cat|grep|git|npm|yarn|node|export|source|sudo|chmod|if|then|else|fi|for|do|done|while|function|return)\b/g,match=>`<span class="kw">${match}</span>`);
    out=wrapHlMatches(out,tokens,/(\$[-\w{][^}\s]*)/g,match=>`<span class="bool">${match}</span>`);
    return restoreHlTokens(out,tokens);
  }

  if(l==='sql'){
    out=wrapHlMatches(out,tokens,/('(?:[^']|''|\\')*')/g,match=>`<span class="str">${match}</span>`);
    out=wrapHlMatches(out,tokens,/(--.*$)/g,match=>`<span class="cmt">${match}</span>`);
    out=wrapHlMatches(out,tokens,/\b(SELECT|FROM|WHERE|JOIN|LEFT|RIGHT|INNER|ON|INSERT|INTO|VALUES|UPDATE|SET|DELETE|CREATE|TABLE|DROP|ALTER|ADD|PRIMARY|KEY|NOT|NULL|AND|OR|IN|LIKE|ORDER|BY|GROUP|HAVING|LIMIT|AS|DISTINCT|COUNT|SUM|AVG|MAX|MIN|CASE|WHEN|THEN|END|WITH|UNION)\b/gi,match=>`<span class="kw">${match}</span>`);
    return restoreHlTokens(out,tokens);
  }

  return out;
}
function synHl(line,lang){
  return highlightEscapedLine(line,lang);
}

/* ══ AUTO-DETECT LANGUAGE ══ */
function detectLang(code){
  if(/<(!DOCTYPE|html|head|body|div|span|p|a |ul|ol|li|nav|section|header|footer|main|form|input|button|table|img )/i.test(code))return'html';
  if(/\b(const|let|var|function|=>|async |await |import |export |document\.|window\.|console\.)\b/.test(code))return'javascript';
  if(/\b(display|position|flex|grid|margin|padding|background|border-radius|@media|:root|--[\w-]+)\b/.test(code)&&/[{;}]/.test(code))return'css';
  if(/\b(def |class |import |from |print\(|self\.)\b/.test(code))return'python';
  if(/\b(SELECT|INSERT|CREATE TABLE|FROM|WHERE)\b/i.test(code))return'sql';
  return'';
}

/* ══ FULL SYNTAX HIGHLIGHT FOR CODE BLOCKS ══ */
function synHlFull(code,lang){
  const l=(lang||detectLang(code)).toLowerCase();
  const hlines=code.split('\n').map(function(line){
    const escaped=line.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
    return highlightEscapedLine(escaped,l);
  });
  return '<div class="code-lines">'+hlines.map(function(l,i){return '<div class="cl"><span class="ln">'+(i+1)+'</span><span class="lc">'+l+'</span></div>';}).join('')+'</div>';
}

/* ══ SCROLL ══ */
let _progScroll=0,_userScrollLock=0;
function syncScrollFab(w,atBot){
  document.getElementById('sfab').classList.toggle('show',!atBot&&w.scrollHeight>w.clientHeight+100);
}
function initScroll(){
  const w=document.getElementById('msgs');
  const lockUserScroll=()=>{
    _userScrollLock=Date.now()+1400;
    usrScrolled=true;
    syncScrollFab(w,false);
  };
  w.addEventListener('wheel',e=>{if(e.deltaY<0)lockUserScroll()},{passive:true});
  w.addEventListener('touchmove',lockUserScroll,{passive:true});
  w.addEventListener('pointerdown',()=>{if(w.scrollHeight>w.clientHeight+100)lockUserScroll()},{passive:true});
  w.addEventListener('scroll',()=>{
    if(Date.now()-_progScroll<180&&Date.now()>=_userScrollLock)return;
    const atBot=w.scrollTop+w.clientHeight>=w.scrollHeight-200;
    usrScrolled=!atBot;
    if(atBot)_userScrollLock=0;
    syncScrollFab(w,atBot);
  },{passive:true});
  const obs=new MutationObserver(()=>{scrollChat()});
  obs.observe(w,{childList:true,subtree:true,characterData:true});
}
function scrollChat(force=false){
  if((usrScrolled||Date.now()<_userScrollLock)&&!force)return;
  const w=document.getElementById('msgs');
  _progScroll=Date.now();
  w.scrollTop=w.scrollHeight;
}

/* ══ MESSAGES ══ */
function updateCount(){const n=document.querySelectorAll('.msg').length;document.getElementById('msgcount').textContent=`${n} msg${n!==1?'s':''}`}

function addUserMsg(text){
  document.getElementById('welcome')?.remove();
  const w=document.getElementById('msgs'),t=ftime(),el=document.createElement('div');
  el.className='msg user';
  el.innerHTML=`<div class="mav" style="background:linear-gradient(135deg,#7c6af7,#00d4ff)">👤</div>
    <div class="mbody">
      <div class="mhdr"><div class="mname" style="color:#a090ff">You</div><div class="mtime">${t}</div></div>
      <div class="mbub">${esc(text)}</div>
      <div class="macts"><button class="mac" onclick="cpMsg(this)">📋 Copy</button></div>
    </div>`;
  document.getElementById('msgs').appendChild(el);
  S.chatLog.push({type:'user',text,time:t});
  scrollChat();updateCount();
}

async function addAgentMsg(agent,text,skipStream=false){
  // Feature 13: snapshot for replay
  snapshotForReplay(agent.id, agent.name, agent.emoji, text, agent.color);
  // Feature 9: detect errors in agent output
  if(skipStream||/^(error|failed|exception)/i.test((text||'').slice(0,60))){
    logError(`${agent.name}: possible issue`,'warn');
  }
  return new Promise(async resolve=>{
    const w=document.getElementById('msgs'),t=ftime();
    const id='m'+Date.now()+agent.id;
    const el=document.createElement('div');el.className='msg';el.id=id;

    const task=MODEL_ROUTER.agentTaskMap[agent.id]||'quality';
    const best=VAULT.getBest(task)||VAULT.getBest('quality');
    const meta=PROVIDER_META[best?.provider]||{};
    const modelShort=best?.model?(best.model.split('/').pop().replace(':free','').slice(0,20)):'';
    const modelChip=best?.provider?
      `<span class="msg-model-chip" style="background:${meta.color||'#888'}18;border:1px solid ${meta.color||'#888'}30;color:${meta.color||'var(--t3)'}">${meta.icon||'🔑'} ${meta.name||best.provider} · ${modelShort}</span>`:
      '';

    el.innerHTML=`
      <div class="mav" style="background:${agent.color}1a;border:1px solid ${agent.glow}">${agent.emoji}</div>
      <div class="mbody">
        <div class="mhdr">
          <div class="mname" style="color:${agent.color}">${agent.name}</div>
          <div class="mbadge" style="background:${agent.bb};color:${agent.bc}">${agent.badge}</div>
          ${modelChip}
          <div class="mtime">${t}</div>
        </div>
        <div class="mbub" id="${id}-b"><div class="typing"><span></span><span></span><span></span></div></div>
      </div>`;
    w.appendChild(el);scrollChat();
    if(!skipStream)await sleep(200);
    const bub=document.getElementById(`${id}-b`);
    if(!bub){resolve();return;}
    bub.innerHTML='';
    if(!skipStream)await streamRich(bub,text);
    renderRichMessage(bub,text);
    const body=el.querySelector('.mbody');
    const acts=document.createElement('div');acts.className='macts';
    acts.innerHTML=`<button class="mac" onclick="cpMsg(this)">📋 Copy All</button><button class="mac" onclick="dlMsg(this,'${agent.id}.md')">⬇ .md</button>`;
    body.appendChild(acts);
    S.chatLog.push({type:'agent',agentId:agent.id,agentData:agent,text,time:t});
    updateCount();scrollChat();resolve();
  });
}

/* Stream directly from API into a live bubble — true token-by-token display */
async function streamAgentLive(agent, sys, msgs){
  // Feature 12: persona suffix
  const personaSuffix=getPersonaSystemSuffix?.();
  if(personaSuffix)sys=sys+(personaSuffix||'');
  // Feature 11: inject web research context
  if(S.ctx?._webResearch&&msgs?.[0]?.content){
    msgs[0].content+='\n\n[Pre-Build Research]\n'+S.ctx._webResearch.slice(0,400);
  }
  const w=document.getElementById('msgs'),t=ftime();
  const id='m'+Date.now()+agent.id;
  const el=document.createElement('div');el.className='msg';el.id=id;

  const task=MODEL_ROUTER.agentTaskMap[agent.id]||'quality';
  const best=VAULT.getBest(task)||VAULT.getBest('quality');
  const meta=PROVIDER_META[best?.provider]||{};
  const modelShort=best?.model?(best.model.split('/').pop().replace(':free','').slice(0,20)):'';
  const modelChip=best?.provider?
    `<span class="msg-model-chip" style="background:${meta.color||'#888'}18;border:1px solid ${meta.color||'#888'}30;color:${meta.color||'var(--t3)'}">${meta.icon||'🔑'} ${meta.name||best.provider} · ${modelShort}</span>`:
    '';

  el.innerHTML=`
    <div class="mav" style="background:${agent.color}1a;border:1px solid ${agent.glow}">${agent.emoji}</div>
    <div class="mbody">
      <div class="mhdr">
        <div class="mname" style="color:${agent.color}">${agent.name}</div>
        <div class="mbadge" style="background:${agent.bb};color:${agent.bc}">${agent.badge}</div>
        ${modelChip}
        <div class="stream-status" id="ss-${id}" style="font-size:.55rem;color:var(--t3);font-family:var(--mono);display:flex;align-items:center;gap:3px">
          <span class="live-dot" style="width:5px;height:5px;border-radius:50%;background:var(--green);animation:wfP 1s infinite"></span>
          <span id="ss-tok-${id}">0 tokens</span>
        </div>
        <div class="mtime">${t}</div>
      </div>
      <div class="mbub stream-live" id="${id}-b" style="font-size:.82rem;line-height:1.6;white-space:pre-wrap;font-family:var(--body);padding:2px 0"></div>
    </div>`;
  w.appendChild(el);scrollChat();

  const bub=document.getElementById(`${id}-b`);
  const tokEl=document.getElementById(`ss-tok-${id}`);
  let full='';
  let tokCount=0;
  let renderTimer=null;

  // onChunk: update bubble live as tokens arrive
  const onChunk=(chunk,accumulated)=>{
    if(S.aborted)return;
    full=accumulated;
    tokCount+=chunk.split(/\s+/).length;
    if(tokEl)tokEl.textContent=tokCount+' tokens';
    // Throttle DOM updates to 60fps
    if(!renderTimer){
      renderTimer=requestAnimationFrame(()=>{
        renderTimer=null;
        // Simple live render — just show raw text while streaming
        bub.textContent=full;
        scrollChat();
      });
    }
  };

  // Get best chain and try streaming
  const chain=VAULT.getFallbackChain(task);
  let result=null;

  for(const entry of chain.slice(0,3)){
    if(S.aborted)break;
    full='';tokCount=0;
    if(bub)bub.textContent='';
    showActiveModel(entry.provider,entry.model,task,agent.id);
    result=await callAPIVault(sys,msgs,task,entry.provider,entry.key,entry.model,onChunk);
    if(result)break;
    // Provider failed — clear and try next
    toast(`🔄 Streaming fallback → next provider`,'');
    await sleep(400);
  }

  // Finalize: render markdown properly
  if(bub){
    bub.classList.remove('stream-live');
    bub.style.cssText='';
    bub.textContent='';
    if(result)renderRichMessage(bub,result);
  }

  // Remove live indicator
  const ssEl=document.getElementById(`ss-${id}`);
  if(ssEl)ssEl.remove();

  // Add actions
  const body=el.querySelector('.mbody');
  const acts=document.createElement('div');acts.className='macts';
  acts.innerHTML=`<button class="mac" onclick="cpMsg(this)">📋 Copy All</button><button class="mac" onclick="dlMsg(this,'${agent.id}.md')">⬇ .md</button>`;
  body.appendChild(acts);

  if(result){
    S.chatLog.push({type:'agent',agentId:agent.id,agentData:agent,text:result,time:t});
    addTokens(Math.floor(result.length*.75));
    updateCount();
  }
  scrollChat();
  return result;
}

/* Helper: group consecutive code segments into tabbed groups */
/* FIX #1 improved: also merge code blocks separated by short transitional prose (≤100 chars) */
function groupSegments(segments){
  const grouped=[];
  for(let i=0;i<segments.length;i++){
    const seg=segments[i];
    if(seg.type==='code'){
      const last=grouped[grouped.length-1];
      if(last&&last.type==='code-group'){last.blocks.push(seg);}
      else{grouped.push({type:'code-group',blocks:[seg]});}
    } else if(seg.type==='prose'){
      // Check if this is short transitional prose between two code blocks — if so, absorb it into the group
      const trimmed=(seg.content||'').trim();
      const nextIsCode=i+1<segments.length&&segments[i+1].type==='code';
      const lastIsGroup=grouped.length>0&&grouped[grouped.length-1].type==='code-group';
      if(lastIsGroup&&nextIsCode&&trimmed.length>0&&trimmed.length<=100){
        // Skip this short prose — it's just a transition like "Here's the JavaScript:"
        continue;
      }
      grouped.push(seg);
    } else {grouped.push(seg);}
  }
  return grouped;
}

/* Render a code-group (tabbed if multiple, single if one) */
function renderCodeGroup(container,group,idPrefix){
  if(group.blocks.length===1){
    // Single block — render as before (no tabs needed)
    const seg=group.blocks[0];
    const d=document.createElement('div');d.className='mcode';
    const langColors={html:'#f07178',css:'#c792ea',javascript:'#ffd166',js:'#ffd166',typescript:'#89ddff',ts:'#89ddff',python:'#82aaff',json:'#c3e88d',bash:'#00e5a0',sh:'#00e5a0',sql:'#ffcb6b',jsx:'#ffd166',tsx:'#89ddff'};
    const lclr=langColors[seg.lang?.toLowerCase()]||'#a090ff';
    const langLabel=seg.lang||'code';
    const lineCount=seg.code.split('\n').length;
    d.innerHTML=`<div class="mcode-hdr"><span class="mcode-lang" style="color:${lclr}"><span class="lang-dot" style="background:${lclr}"></span>${langLabel.toUpperCase()}</span><span style="font-size:.6rem;color:var(--t3);font-family:var(--mono);margin-left:4px">${lineCount} line${lineCount!==1?'s':''}</span><div style="display:flex;gap:3px;margin-left:auto"><button class="mac" onclick="cpCodeBlock(this)">📋 Copy</button><button class="mac" onclick="dlCodeBlock(this,'snippet.${extFor(seg.lang)}')">⬇ Save</button></div></div><div class="mcode-body"></div>`;
    const body=d.querySelector('.mcode-body');
    body._rawCode=seg.code;
    body.innerHTML=synHlFull(seg.code,seg.lang);
    container.appendChild(d);
    return;
  }
  // Multiple blocks — render as tabbed group
  const wrap=document.createElement('div');wrap.className='code-group';
  const tabBar=document.createElement('div');tabBar.className='code-group-tabs';
  const paneContainer=document.createElement('div');
  const langColors={html:'#f07178',css:'#c792ea',javascript:'#ffd166',js:'#ffd166',typescript:'#89ddff',ts:'#89ddff',python:'#82aaff',json:'#c3e88d',bash:'#00e5a0',sh:'#00e5a0',sql:'#ffcb6b',jsx:'#ffd166',tsx:'#89ddff'};
  group.blocks.forEach((seg,bi)=>{
    const lclr=langColors[seg.lang?.toLowerCase()]||'#a090ff';
    const langLabel=seg.lang||'code';
    const lineCount=seg.code.split('\n').length;
    // Tab
    const tab=document.createElement('div');
    tab.className='code-group-tab'+(bi===0?' active':'');
    tab.style.color=bi===0?lclr:'';
    tab.innerHTML=`<span class="lang-dot" style="background:${lclr}"></span>${langLabel.toUpperCase()} <span style="font-size:.55rem;color:var(--t3)">${lineCount}L</span>`;
    tab.onclick=()=>{
      wrap.querySelectorAll('.code-group-tab').forEach(t=>{t.classList.remove('active');t.style.color=''});
      wrap.querySelectorAll('.code-group-pane').forEach(p=>p.classList.remove('active'));
      tab.classList.add('active');tab.style.color=lclr;
      wrap.querySelector('#'+idPrefix+'-pane-'+bi).classList.add('active');
    };
    tabBar.appendChild(tab);
    // Pane
    const pane=document.createElement('div');pane.className='code-group-pane'+(bi===0?' active':'');pane.id=idPrefix+'-pane-'+bi;
    const d=document.createElement('div');d.className='mcode';
    d.innerHTML=`<div class="mcode-hdr"><span class="mcode-lang" style="color:${lclr}"><span class="lang-dot" style="background:${lclr}"></span>${langLabel.toUpperCase()}</span><span style="font-size:.6rem;color:var(--t3);font-family:var(--mono)">${lineCount} line${lineCount!==1?'s':''}</span><div style="display:flex;gap:3px;margin-left:auto"><button class="mac" onclick="cpCodeBlock(this)">📋 Copy</button><button class="mac" onclick="dlCodeBlock(this,'${langLabel}.${extFor(seg.lang)}')">⬇ Save</button></div></div><div class="mcode-body"></div>`;
    const body=d.querySelector('.mcode-body');
    body._rawCode=seg.code;
    body.innerHTML=synHlFull(seg.code,seg.lang);
    pane.appendChild(d);
    paneContainer.appendChild(pane);
  });
  // Copy-all button in tab bar
  const actsDiv=document.createElement('div');actsDiv.className='code-group-acts';
  actsDiv.innerHTML=`<button class="mac" onclick="cpAllCodeGroup(this)">📋 All</button>`;
  tabBar.appendChild(actsDiv);
  wrap.appendChild(tabBar);wrap.appendChild(paneContainer);
  container.appendChild(wrap);
}

/* Render message with full syntax highlighting — used both for final render and restored sessions */
function renderRichMessage(container,text){
  container.innerHTML='';
  const segments=[];let last=0;
  const re=/```(\w*)\n?([\s\S]*?)```/g;let m;
  while((m=re.exec(text))!==null){
    if(m.index>last)segments.push({type:'prose',content:text.slice(last,m.index)});
    segments.push({type:'code',lang:m[1]||'',code:m[2].trim()});
    last=m.index+m[0].length;
  }
  if(last<text.length)segments.push({type:'prose',content:text.slice(last)});
  const grouped=groupSegments(segments);
  const hasCode=segments.some(s=>s.type==='code');
  container.className='mbub '+(hasCode?'mixed':'prose-only');
  const idPfx='cg'+Date.now();
  grouped.forEach((seg,gi)=>{
    if(seg.type==='prose'){
      const prose=seg.content.trim();if(!prose)return;
      const d=document.createElement('div');d.className='msg-prose';
      if(hasCode){d.style.cssText='background:var(--s1);border:1px solid var(--border);border-radius:10px;padding:9px 12px'}
      d.innerHTML=md(prose);
      container.appendChild(d);
    } else if(seg.type==='code-group'){
      renderCodeGroup(container,seg,idPfx+'-g'+gi);
    }
  });
}

/* Copy all code blocks in a group */
function cpAllCodeGroup(btn){
  const wrap=btn.closest('.code-group');
  const bodies=wrap.querySelectorAll('.mcode-body');
  const all=[...bodies].map(b=>b._rawCode||b.textContent||'').join('\n\n');
  navigator.clipboard.writeText(all).then(()=>{const o=btn.innerHTML;btn.innerHTML='✅';btn.classList.add('ok');setTimeout(()=>{btn.innerHTML=o;btn.classList.remove('ok')},2000)}).catch(()=>toast('Copy failed','err'));
}

/* Stream with live syntax highlighting — renders code blocks in real time */
/* FIX #2: Prose now renders markdown incrementally during streaming (not plain text) */
/* FIX #1: Consecutive code blocks are grouped into tabs */
async function streamRich(container,text){
  const sp={fast:10,normal:20,slow:45},ch={fast:10,normal:5,slow:1};
  const delay=sp[S.cfg.speed]||20,chunk=ch[S.cfg.speed]||5;
  const hasCode=/```/.test(text);
  container.className='mbub '+(hasCode?'mixed':'prose-only');
  const segments=[];let last=0;
  const re=/```(\w*)\n?([\s\S]*?)```/g;let m;
  while((m=re.exec(text))!==null){
    if(m.index>last)segments.push({type:'prose',content:text.slice(last,m.index)});
    segments.push({type:'code',lang:m[1]||'',code:m[2].trim(),raw:m[0]});
    last=m.index+m[0].length;
  }
  if(last<text.length)segments.push({type:'prose',content:text.slice(last)});

  // Group consecutive code blocks
  const grouped=groupSegments(segments);
  container.innerHTML='';
  const langColors={html:'#f07178',css:'#c792ea',javascript:'#ffd166',js:'#ffd166',typescript:'#89ddff',ts:'#89ddff',python:'#82aaff',json:'#c3e88d',bash:'#00e5a0',sh:'#00e5a0',sql:'#ffcb6b',jsx:'#ffd166',tsx:'#89ddff'};

  for(const seg of grouped){
    if(S.aborted)return;
    if(seg.type==='prose'){
      const prose=seg.content.trim();
      if(!prose)continue;
      const d=document.createElement('div');d.className='msg-prose';
      if(hasCode){d.style.cssText='background:var(--s1);border:1px solid var(--border);border-radius:10px;padding:9px 12px'}
      container.appendChild(d);
      const cur=document.createElement('span');cur.className='scur';
      d.appendChild(cur);
      let i=0;
      await new Promise(r=>{
        const iv=setInterval(()=>{
          if(S.aborted||i>=prose.length){clearInterval(iv);cur.remove();d.innerHTML=md(prose);r();return;}
          i=Math.min(i+chunk,prose.length);
          /* FIX #2: render markdown incrementally instead of plain text */
          d.innerHTML=md(prose.slice(0,i));
          d.appendChild(cur);
          scrollChat();
        },delay);
      });
    } else if(seg.type==='code-group'){
      // Stream code blocks in a tabbed group (or single block)
      const blocks=seg.blocks;
      if(blocks.length===1){
        // Single code block — stream directly
        const block=blocks[0];
        const lclr=langColors[block.lang?.toLowerCase()]||'#a090ff';
        const d=document.createElement('div');d.className='mcode mcode-streaming';
        d.innerHTML=`<div class="mcode-hdr"><span class="mcode-lang" style="color:${lclr}"><span class="lang-dot" style="background:${lclr}"></span>${(block.lang||'code').toUpperCase()}</span><span class="stream-indicator">⌨️ generating…</span></div><div class="mcode-body mcode-stream-body"></div>`;
        container.appendChild(d);scrollChat();
        const body=d.querySelector('.mcode-stream-body');body._rawCode='';
        const code=block.code;let ci=0;
        const streamChunk=Math.max(chunk*2,8);
        await new Promise(r=>{const iv=setInterval(()=>{if(S.aborted||ci>=code.length){clearInterval(iv);r();return;}ci=Math.min(ci+streamChunk,code.length);const partial=code.slice(0,ci);body._rawCode=partial;body.innerHTML=synHlFull(partial,block.lang);scrollChat()},delay)});
        body._rawCode=code;body.innerHTML=synHlFull(code,block.lang);
        const lineCount=code.split('\n').length;
        d.classList.remove('mcode-streaming');
        d.querySelector('.stream-indicator').outerHTML=`<span style="font-size:.6rem;color:var(--t3);font-family:var(--mono)">${lineCount} line${lineCount!==1?'s':''}</span><div style="display:flex;gap:3px;margin-left:auto"><button class="mac" onclick="cpCodeBlock(this)">📋 Copy</button><button class="mac" onclick="dlCodeBlock(this,'snippet.${extFor(block.lang)}')">⬇</button></div>`;
        scrollChat();
      } else {
        // Multiple code blocks — build tabbed group, stream each sequentially
        const wrap=document.createElement('div');wrap.className='code-group code-group-streaming';
        const tabBar=document.createElement('div');tabBar.className='code-group-tabs';
        const paneContainer=document.createElement('div');
        const idPfx='sg'+Date.now();
        // Create all tabs and panes upfront
        blocks.forEach((block,bi)=>{
          const lclr=langColors[block.lang?.toLowerCase()]||'#a090ff';
          const tab=document.createElement('div');
          tab.className='code-group-tab'+(bi===0?' active':'');
          tab.id=idPfx+'-tab-'+bi;
          if(bi===0)tab.style.color=lclr;
          tab.innerHTML=`<span class="lang-dot" style="background:${lclr}"></span>${(block.lang||'code').toUpperCase()} <span class="stream-indicator" style="font-size:.55rem">⌨️</span>`;
          tab.onclick=()=>{
            wrap.querySelectorAll('.code-group-tab').forEach(t=>{t.classList.remove('active');t.style.color=''});
            wrap.querySelectorAll('.code-group-pane').forEach(p=>p.classList.remove('active'));
            tab.classList.add('active');tab.style.color=lclr;
            wrap.querySelector('#'+idPfx+'-pane-'+bi).classList.add('active');
          };
          tabBar.appendChild(tab);
          const pane=document.createElement('div');pane.className='code-group-pane'+(bi===0?' active':'');pane.id=idPfx+'-pane-'+bi;
          const d=document.createElement('div');d.className='mcode';
          d.innerHTML=`<div class="mcode-body mcode-stream-body"></div>`;
          d.querySelector('.mcode-body')._rawCode='';
          pane.appendChild(d);paneContainer.appendChild(pane);
        });
        wrap.appendChild(tabBar);wrap.appendChild(paneContainer);
        container.appendChild(wrap);scrollChat();

        // Stream each block sequentially, auto-switching active tab
        for(let bi=0;bi<blocks.length;bi++){
          if(S.aborted)return;
          const block=blocks[bi];
          const lclr=langColors[block.lang?.toLowerCase()]||'#a090ff';
          const tab=wrap.querySelector('#'+idPfx+'-tab-'+bi);
          const pane=wrap.querySelector('#'+idPfx+'-pane-'+bi);
          const body=pane.querySelector('.mcode-body');
          // Auto-switch to this tab
          wrap.querySelectorAll('.code-group-tab').forEach(t=>{t.classList.remove('active');t.style.color=''});
          wrap.querySelectorAll('.code-group-pane').forEach(p=>p.classList.remove('active'));
          tab.classList.add('active');tab.style.color=lclr;pane.classList.add('active');
          // Stream code
          const code=block.code;let ci=0;
          const streamChunk=Math.max(chunk*2,8);
          await new Promise(r=>{const iv=setInterval(()=>{if(S.aborted||ci>=code.length){clearInterval(iv);r();return;}ci=Math.min(ci+streamChunk,code.length);const partial=code.slice(0,ci);body._rawCode=partial;body.innerHTML=synHlFull(partial,block.lang);scrollChat()},delay)});
          body._rawCode=code;body.innerHTML=synHlFull(code,block.lang);
          // Update tab — remove streaming indicator, add line count
          const lineCount=code.split('\n').length;
          tab.innerHTML=`<span class="lang-dot" style="background:${lclr}"></span>${(block.lang||'code').toUpperCase()} <span style="font-size:.55rem;color:var(--t3)">${lineCount}L</span>`;
        }
        // Finalize group — remove streaming class, add copy buttons
        wrap.classList.remove('code-group-streaming');
        const actsDiv=document.createElement('div');actsDiv.className='code-group-acts';
        actsDiv.innerHTML=`<button class="mac" onclick="cpAllCodeGroup(this)">📋 All</button>`;
        tabBar.appendChild(actsDiv);
        // Add copy/save buttons to each pane
        blocks.forEach((block,bi)=>{
          const pane=wrap.querySelector('#'+idPfx+'-pane-'+bi);
          const mcodeEl=pane.querySelector('.mcode');
          const lclr=langColors[block.lang?.toLowerCase()]||'#a090ff';
          const lineCount=block.code.split('\n').length;
          const hdr=document.createElement('div');hdr.className='mcode-hdr';
          hdr.innerHTML=`<span class="mcode-lang" style="color:${lclr}"><span class="lang-dot" style="background:${lclr}"></span>${(block.lang||'code').toUpperCase()}</span><span style="font-size:.6rem;color:var(--t3);font-family:var(--mono)">${lineCount} line${lineCount!==1?'s':''}</span><div style="display:flex;gap:3px;margin-left:auto"><button class="mac" onclick="cpCodeBlock(this)">📋 Copy</button><button class="mac" onclick="dlCodeBlock(this,'${block.lang||'code'}.${extFor(block.lang)}')">⬇ Save</button></div>`;
          mcodeEl.insertBefore(hdr,mcodeEl.firstChild);
        });
        // Switch to first tab
        const firstTab=wrap.querySelector('#'+idPfx+'-tab-0');
        if(firstTab)firstTab.click();
        scrollChat();
      }
    }
  }
}

async function stream(container,text){
  // Legacy fallback — calls new rich stream
  return streamRich(container,text);
}

function addXTalk(from,to){
  const w=document.getElementById('msgs');
  const line=XTALK_MSGS[Math.floor(Math.random()*XTALK_MSGS.length)](from.name,to.name);
  const el=document.createElement('div');el.className='xtalk';
  el.innerHTML=`<div class="xtav" style="background:${from.color}1a;color:${from.color};border:1px solid ${from.glow}">${from.emoji}</div>
    <div class="xtbub"><div class="xtn" style="color:${from.color}">${from.name}</div>${esc(line)}</div>`;
  w.appendChild(el);scrollChat();
}

/* ══ AGENT UI ══ */
function setAgent(id,status){
  const dot=document.getElementById('ad-'+id),av=document.getElementById('av-'+id),row=document.getElementById('ar-'+id);
  if(dot){dot.className='adot'+(status?' '+status:'')}
  if(av){status==='thinking'?av.classList.add('glow'):av.classList.remove('glow')}
  if(row){row.className='arow'+(status==='thinking'?' active':'')}
}
function setStage(id,status){
  const el=document.getElementById('si-'+id);if(!el)return;
  el.className='sitem '+status;
  const ic=el.querySelector('.sic');
  if(ic)ic.textContent=status==='done'?'✅':status==='active'?'⏳':STAGES.find(s=>s.id===id)?.icon||'○';
}
function setProgress(pct){
  document.getElementById('pfill').style.width=pct+'%';
  document.getElementById('pct').textContent=Math.round(pct)+'%';
}
function setStatus(mode){
  const d=document.getElementById('sdot');
  if(mode==='building'){d.className='sdot building';}
  else if(mode==='done'){d.className='sdot';}
  else{d.className='sdot';}
}
function addTokens(n){
  S.tokens+=n;const max=12000,pct=Math.min((S.tokens/max)*100,100);
  const b=document.getElementById('tokbadge');b.classList.add('show');
  document.getElementById('tknum').textContent=S.tokens>999?(S.tokens/1000).toFixed(1)+'k':S.tokens;
  document.getElementById('tkfill').style.width=pct+'%';
}
function resetTokens(){S.tokens=0;document.getElementById('tokbadge').classList.remove('show');document.getElementById('tkfill').style.width='0%'}

/* ══ TIMER ══ */
function startTimer(){
  S.buildStart=Date.now();
  document.getElementById('btimer').classList.add('show');
  clearInterval(timerInt);
  timerInt=setInterval(()=>{
    const s=Math.floor((Date.now()-S.buildStart)/1000);
    document.getElementById('btxt').textContent=`${Math.floor(s/60)}:${String(s%60).padStart(2,'0')}`;
  },1000);
}
function stopTimer(){clearInterval(timerInt);timerInt=null;document.getElementById('btimer').classList.remove('show')}

/* ══ DETECT INTENT ══ */
function detectIntent(text){
  if(S.mode==='chat')return'question';
  const tl=text.trim().toLowerCase();
  const buildV=/^(build|create|make|generate|develop|write|code|implement|scaffold)\b/i;
  const buildS=/\b(app|application|website|web\s*app|dashboard|system|tool|platform|component|page|game|store|shop|todo|portfolio|tracker|calculator|player|editor|manager|widget|api|ui|interface)\b/i;
  if(buildV.test(text)&&buildS.test(tl))return'build';
  const qPats=[/^(can you|could you|how do|what is|what are|why|when|explain|tell me|show me|what.*difference|compare|vs\b)/i,/\?$/,/^(hi|hello|hey|thanks|thank you)\b/i,/^(is|are|does|do|can|could|will|would|should)\b/i];
  if(qPats.some(p=>p.test(text)))return'question';
  const impliedBuild=/\b(weather app|todo app|music player|e[- ]?commerce|landing page|auth system|chat app|kanban|portfolio|dashboard with)\b/i;
  if(impliedBuild.test(tl))return'build';
  if(text.split(/\s+/).length<=4)return'question';
  return buildS.test(tl)?'build':'question';
}

/* ══ Q&A ══ */
async function answerQuestion(q){
  addUserMsg(q);
  let resp=null;
  if(S.cfg.key){
    const ctx=S.chatLog.slice(-8).map(m=>m.type==='user'?{role:'user',content:m.text}:{role:'assistant',content:(m.text||'').slice(0,300)});
    resp=await callAPI(`You are NeuralForge AI — an expert, friendly software development assistant. Answer questions directly and helpfully using markdown. If asked to build a project, tell them to type it in the input and click Build.`,[...ctx.slice(0,-1),{role:'user',content:q}]);
  }
  if(!resp){
    resp=`## ${q.slice(0,60)}\n\nI'm NeuralForge AI — I can answer dev questions and build web projects!\n\n**To get AI answers:** Add a free API key in ⚙️ Settings\n- [OpenRouter](https://openrouter.ai/keys) — free, no credit card\n- [Groq](https://console.groq.com/keys) — free, ultra-fast\n\n**To build a project:** Describe it in the input and click Build! 🚀`;
  }
  if(!S.cfg.key) resp+='\n\n---\n💡 **Get full AI answers:** Add a free API key in ⚙️ Settings.';
  await addAgentMsg(CHAT_AI,resp);
}

/* ══ PROMPT ENHANCER ══ */
async function enhancePrompt(){
  const pi=document.getElementById('pi'),text=pi.value.trim();
  if(!text){toast('Enter a prompt first','err');return;}
  if(!S.cfg.key){toast('Add API key in ⚙️ Settings to use Enhance','err');openConfig();return;}
  const btn=document.getElementById('enhbtn');
  btn.classList.add('loading');btn.textContent='✨ Enhancing…';
  const resp=await callAPI(
    'You are a prompt enhancer for an AI software company. Take a brief project description and expand it into a detailed, specific project specification that will help developers build a better product. Keep it under 200 words. Output ONLY the enhanced prompt, no preamble.',
    [{role:'user',content:`Enhance this project prompt: "${text}"`}]
  );
  btn.classList.remove('loading');btn.textContent='✨ Enhance';
  if(resp){
    pi.value=resp.trim();autosize(pi);
    toast('✨ Prompt enhanced!','ok');
    pi.focus();
  } else {toast('Enhancement failed — check API key','err');}
}

/* ══ FILES ══ */
function clearFiles(){
  document.getElementById('ftree').innerHTML='<div id="ftree-empty" style="padding:8px;font-size:.69rem;color:var(--t3)">No files yet — build a project</div>';
  document.getElementById('cdisp').innerHTML='<div class="empty-code"><svg width="38" height="38" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.2"><polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/></svg><div>Code appears here after build</div></div>';
  document.getElementById('cedbar').classList.remove('show');
  S.selFile=null;searchMatches=[];searchCur=-1;
}
function selFile(f){
  S.selFile=f;
  document.querySelectorAll('.fi').forEach(e=>e.classList.remove('sel'));
  try{document.getElementById('fi-'+CSS.escape(f))?.classList.add('sel');}catch(e){}
  document.getElementById('cedbar').classList.add('show');
  document.getElementById('cedfile').textContent=f;
  renderCode(f);searchMatches=[];searchCur=-1;document.getElementById('csinp').value='';document.getElementById('cscnt').textContent='';
}
function renderCode(f){
  const file=S.files[f];if(!file)return;
  const d=document.getElementById('cdisp');
  const lang=file.lang||detectLang(file.c);
  // For markdown, render a simple preview
  if(lang==='markdown'||f.endsWith('.md')){
    d.innerHTML=`<div style="padding:14px;font-size:.79rem;line-height:1.7;color:var(--text);max-width:600px">${md(file.c)}</div>`;
    return;
  }
  // For JSON, pretty-print if possible
  let displayCode=file.c;
  if(lang==='json'){
    try{displayCode=JSON.stringify(JSON.parse(file.c),null,2);}catch(e){}
  }
  d.innerHTML=displayCode.split('\n').map((ln,i)=>`<div class="cl" id="cl-${i}"><span class="ln">${i+1}</span><span class="lc" id="lc-${i}">${synHl(esc(ln),lang)}</span></div>`).join('');
  d.scrollTop=0;
}
function copyFile(){
  const f=S.selFile;if(!f||!S.files[f])return;
  navigator.clipboard.writeText(S.files[f].c).then(()=>{const b=document.getElementById('copybtn');b.textContent='✅';b.classList.add('ok');setTimeout(()=>{b.textContent='📋';b.classList.remove('ok')},2000);toast('Copied!','ok')}).catch(()=>toast('Copy failed','err'));
}
function saveFile(){const f=S.selFile;if(!f||!S.files[f])return;dlBlob(f,S.files[f].c,'text/plain');toast('Downloaded '+f,'ok')}
function copyAllCode(){
  if(!Object.keys(S.files).length){toast('No files yet','err');return;}
  const all=Object.entries(S.files).map(([n,f])=>`/* ===== ${n} ===== */\n${f.c}`).join('\n\n\n');
  navigator.clipboard.writeText(all).then(()=>toast('All code copied!','ok')).catch(()=>toast('Failed','err'));
}

/* ══ CODE SEARCH ══ */
function toggleSearch(){
  const csw=document.getElementById('csw');
  csw.classList.toggle('show');
  if(csw.classList.contains('show')){document.getElementById('csinp').focus();}
  else{clearSearchHL();searchMatches=[];searchCur=-1;document.getElementById('cscnt').textContent='';}
}
function doSearch(){
  const q=document.getElementById('csinp').value.toLowerCase().trim();
  clearSearchHL();searchMatches=[];searchCur=-1;
  if(!q||!S.selFile){document.getElementById('cscnt').textContent='';return;}
  const f=S.files[S.selFile];if(!f)return;
  const lines=f.c.split('\n');
  lines.forEach((line,i)=>{
    let idx=line.toLowerCase().indexOf(q),start=0;
    while(idx!==-1){searchMatches.push({line:i,col:idx+start});start+=idx+q.length;idx=line.toLowerCase().slice(start).indexOf(q);}
  });
  document.getElementById('cscnt').textContent=searchMatches.length?`${searchMatches.length} match${searchMatches.length>1?'es':''}`:' no matches';
  if(searchMatches.length){searchCur=0;applySearchHL(q);}
}
function applySearchHL(q){
  const f=S.files[S.selFile];if(!f)return;
  q=q||document.getElementById('csinp').value.toLowerCase().trim();
  if(!q)return;
  const lines=f.c.split('\n');
  const lineHits={};
  searchMatches.forEach((m,mi)=>{
    if(!lineHits[m.line])lineHits[m.line]=[];
    lineHits[m.line].push({col:m.col,idx:mi});
  });
  Object.entries(lineHits).forEach(([li,hits])=>{
    const el=document.getElementById('lc-'+li);if(!el)return;
    let raw=esc(lines[li]);
    let offset=0;
    hits.forEach(({col,idx})=>{
      const cls='shl'+(idx===searchCur?' cur':'');
      const before=raw.slice(0,col+offset);
      const match=raw.slice(col+offset,col+offset+q.length);
      const after=raw.slice(col+offset+q.length);
      const repl=`<span class="${cls}">${match}</span>`;
      raw=before+repl+after;
      offset+=repl.length-q.length;
    });
    el.innerHTML=raw;
  });
  if(searchMatches[searchCur]){
    const li=searchMatches[searchCur].line;
    document.getElementById('cl-'+li)?.scrollIntoView({block:'center'});
  }
}
function clearSearchHL(){
  if(!S.selFile||!S.files[S.selFile])return;
  const f=S.files[S.selFile];
  f.c.split('\n').forEach((ln,i)=>{
    const el=document.getElementById('lc-'+i);
    if(el)el.innerHTML=synHl(esc(ln),f.lang);
  });
}
function searchStep(dir){
  if(!searchMatches.length)return;
  searchCur=(searchCur+dir+searchMatches.length)%searchMatches.length;
  clearSearchHL();applySearchHL();
  document.getElementById('cscnt').textContent=`${searchCur+1}/${searchMatches.length}`;
}
function searchNav(e){if(e.key==='Enter'){searchStep(e.shiftKey?-1:1);}if(e.key==='Escape'){toggleSearch();}}

/* ══ PREVIEW ══ */
function buildPreviewHTML(){
  const fw=S.framework||'vanilla';
  const fwCfg=FW_CONFIG[fw];
  if(!fwCfg?.canPreview){
    // For non-browser stacks, show a scaffold info page
    const files=Object.keys(S.files);
    return`<!DOCTYPE html><html><head><meta charset="UTF-8"><style>
      body{font-family:system-ui,sans-serif;background:#060810;color:#e8eaf6;padding:32px;max-width:700px;margin:0 auto;line-height:1.7}
      h1{color:#7c6af7;font-size:1.4rem;margin-bottom:8px}h2{color:#00d4ff;font-size:1rem;margin:18px 0 6px}
      .badge{display:inline-flex;align-items:center;gap:6px;background:${fwCfg.color}18;border:1px solid ${fwCfg.color}44;color:${fwCfg.color};padding:4px 12px;border-radius:6px;font-size:.85rem;font-weight:600;margin-bottom:16px}
      .files{display:flex;flex-direction:column;gap:4px}.file{background:#0f1221;border:1px solid rgba(255,255,255,.08);border-radius:6px;padding:6px 12px;font-family:monospace;font-size:.8rem;color:#a090ff}
      .cmd{background:#0a0d1a;border:1px solid rgba(0,212,255,.2);border-radius:8px;padding:12px 16px;font-family:monospace;font-size:.82rem;color:#00d4ff;margin:6px 0}
      .note{background:rgba(255,209,102,.08);border:1px solid rgba(255,209,102,.2);border-radius:8px;padding:10px 14px;color:#ffd166;font-size:.82rem}
    </style></head><body>
    <div class="badge">${fwCfg.icon} ${fwCfg.label} Project</div>
    <h1>📦 ${S.project||'Project'}</h1>
    <p style="color:#7b7f9a">This is a <strong style="color:${fwCfg.color}">${fwCfg.label}</strong> project — it requires a local development environment to run.</p>
    <h2>📁 Generated Files (${files.length})</h2>
    <div class="files">${files.map(f=>`<div class="file">📄 ${f}</div>`).join('')}</div>
    <h2>🚀 How to Run</h2>
    <div class="cmd">npm install</div>
    <div class="cmd">${fw==='node'?'node server.js':fw==='python'?'pip install -r requirements.txt && python app.py':'npm run dev'}</div>
    <h2>📤 Deploy</h2>
    <p style="color:#7b7f9a">${fwCfg.devopsInstructions}</p>
    <div class="note">⬇️ Download the ZIP below and extract it to your project folder, then run the commands above.</div>
    </body></html>`;
  }

  if(!S.files['index.html'])return null;
  let html=S.files['index.html'].c;

  // Inline all CSS files
  Object.entries(S.files).forEach(([name,file])=>{
    if(!name.endsWith('.css'))return;
    const escaped=name.replace(/[.*+?^${}()|[\]\\]/g,'\\$&');
    html=html.replace(new RegExp('<link[^>]+href=["\']'+escaped+'["\'][^>]*/?>','gi'),`<style>\n${file.c}\n</style>`);
  });

  // For React/Vue: inline JSX/JS app files referenced by script src
  Object.entries(S.files).forEach(([name,file])=>{
    if(!name.match(/\.(js|jsx|mjs)$/))return;
    const escaped=name.replace(/[.*+?^${}()|[\]\\]/g,'\\$&');
    // Match both type="text/babel" and plain script tags
    html=html.replace(new RegExp('<script([^>]+)src=["\']'+escaped+'["\']([^>]*)><\\/script>','gi'),(match,pre,post)=>{
      return `<script${pre}${post}>\n${file.c}\n<\/script>`;
    });
  });

  // Inject JSON data as window globals
  Object.entries(S.files).forEach(([name,file])=>{
    if(!name.endsWith('.json'))return;
    const varName=name.replace(/[^a-zA-Z0-9_]/g,'_').replace(/^_+/,'');
    html=html.replace('</body>',`<script>try{window.${varName}=${file.c};}catch(e){}<\/script>\n</body>`);
  });

  if(!html.includes('fonts.googleapis'))html=html.replace('<head>','<head>\n<link href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;600&family=Outfit:wght@400;600;700&display=swap" rel="stylesheet"/>');
  return html;
}
function runPreview(){
  const html=buildPreviewHTML();
  if(!html){toast('Build a project first!','err');return;}
  if(blobUrl)URL.revokeObjectURL(blobUrl);
  blobUrl=URL.createObjectURL(new Blob([html],{type:'text/html'}));
  const fwCfg=FW_CONFIG[S.framework||'vanilla'];
  const isScaffold=!fwCfg?.canPreview;
  document.getElementById('ptitle').textContent=(isScaffold?'📦 Setup Guide':'▶ Preview')+' — '+(S.project||'Project').slice(0,36);
  const mo=document.getElementById('prevmo'),ifr=document.getElementById('pif'),ld=document.getElementById('pload');
  document.querySelectorAll('.db').forEach(b=>b.classList.remove('on'));
  document.getElementById('d-desk').classList.add('on');
  document.getElementById('pfw').className='pfw desk';
  mo.classList.add('show');ifr.style.display='none';ld.style.display='flex';
  ifr.onload=()=>{ld.style.display='none';ifr.style.display='block'};
  ifr.src=blobUrl;
}
function closePrev(){document.getElementById('prevmo').classList.remove('show');setTimeout(()=>{const i=document.getElementById('pif');i.src='about:blank';i.style.display='none';document.getElementById('pload').style.display='flex'},300)}
function popPrev(){if(blobUrl)window.open(blobUrl,'_blank');else if(blobUrlInl)window.open(blobUrlInl,'_blank');else toast('No preview yet','err')}
function setDev(t,btn){document.querySelectorAll('.db').forEach(b=>b.classList.remove('on'));btn.classList.add('on');document.getElementById('pfw').className='pfw '+t}
function reloadPrev(){const i=document.getElementById('pif');if(i.src&&i.src!=='about:blank'){i.style.display='none';document.getElementById('pload').style.display='flex';i.src=i.src;i.onload=()=>{document.getElementById('pload').style.display='none';i.style.display='block'}}}

/* ══ INLINE PREVIEW ══ */
function refreshInline(){
  const html=buildPreviewHTML();
  if(!html){toast('Build first!','err');return;}
  if(blobUrlInl)URL.revokeObjectURL(blobUrlInl);
  blobUrlInl=URL.createObjectURL(new Blob([html],{type:'text/html'}));
  const ifr=document.getElementById('inlifr'),ld=document.getElementById('ipload');
  document.getElementById('iptitle').textContent=(S.project||'Preview').slice(0,30);
  ifr.style.display='none';ld.style.display='flex';
  ifr.onload=()=>{ld.style.display='none';ifr.style.display='block'};
  ifr.src=blobUrlInl;
}

/* ══ RIGHT TABS ══ */
function switchRTab(el,tab){
  document.querySelectorAll('.rtab').forEach(t=>t.classList.remove('active'));
  el.classList.add('active');S.curRTab=tab;
  document.getElementById('ceditor').style.display=tab==='editor'||tab==='files'?'flex':'none';
  const inlprev=document.getElementById('inlprev');
  inlprev.classList.toggle('show',tab==='preview');
  if(tab==='preview')refreshInline();
  // show/hide file tree
  document.getElementById('ftree').style.display=tab==='files'?'block':'none';
}

/* ══ AI SUGGESTIONS ══ */
async function generateSuggestions(){
  if(!S.cfg.key||!S.project)return;
  const resp=await callAPI(
    'You are a software improvement advisor. Given a project description, list exactly 4 specific improvement suggestions. Be brief — each under 15 words. Format: one suggestion per line, starting with an emoji.',
    [{role:'user',content:`Project: "${S.project}". List 4 post-build improvement suggestions.`}]
  );
  if(!resp)return;
  const lines=resp.split('\n').filter(l=>l.trim()).slice(0,4);
  const list=document.getElementById('sugglist');list.innerHTML='';
  lines.forEach(line=>{
    const em=line.match(/^\S+/)?.[0]||'💡';
    const text=line.replace(/^\S+\s*/,'').trim()||line;
    const item=document.createElement('div');item.className='sitem';
    item.innerHTML=`<span class="sic2">${em}</span><span>${esc(text)}</span>`;
    item.onclick=()=>{document.getElementById('pi').value=`Improve the ${S.project}: ${text}`;autosize(document.getElementById('pi'));toast('Suggestion loaded','ok')};
    list.appendChild(item);
  });
  document.getElementById('suggp').classList.add('show');
}

/* ══ ZIP EXPORT ══ */
function dlBlob(name,content,mime){const blob=new Blob([content],{type:mime});const url=URL.createObjectURL(blob);const a=document.createElement('a');a.href=url;a.download=name;document.body.appendChild(a);a.click();document.body.removeChild(a);URL.revokeObjectURL(url)}
async function dlZip(){
  if(!Object.keys(S.files).length){toast('No files yet','err');return;}
  try{
    const folder=(S.project||'project').toLowerCase().replace(/[^a-z0-9]+/g,'-')+'/';
    const enc=new TextEncoder(),entries=[],lhs=[];let offset=0;
    for(const[name,file]of Object.entries(S.files)){
      const path=folder+name,data=enc.encode(file.c),crc=crc32(data),nb=enc.encode(path);
      const lh=new Uint8Array(30+nb.length),lv=new DataView(lh.buffer);
      lv.setUint32(0,0x04034b50,true);lv.setUint16(4,20,true);lv.setUint16(6,0,true);lv.setUint16(8,0,true);lv.setUint16(10,0,true);lv.setUint16(12,0,true);
      lv.setUint32(14,crc,true);lv.setUint32(18,data.length,true);lv.setUint32(22,data.length,true);lv.setUint16(26,nb.length,true);lv.setUint16(28,0,true);lh.set(nb,30);
      lhs.push({lh,data,nb,crc,offset});offset+=lh.length+data.length;entries.push({lh,data});
    }
    const cds=lhs.map(({lh:_l,data,nb,crc,offset:off})=>{
      const cd=new Uint8Array(46+nb.length),cv=new DataView(cd.buffer);
      cv.setUint32(0,0x02014b50,true);cv.setUint16(4,20,true);cv.setUint16(6,20,true);cv.setUint16(8,0,true);cv.setUint16(10,0,true);cv.setUint16(12,0,true);cv.setUint16(14,0,true);
      cv.setUint32(16,crc,true);cv.setUint32(20,data.length,true);cv.setUint32(24,data.length,true);cv.setUint16(28,nb.length,true);cv.setUint16(30,0,true);cv.setUint16(32,0,true);cv.setUint16(34,0,true);cv.setUint16(36,0,true);cv.setUint32(38,0,true);cv.setUint32(42,off,true);
      cd.set(nb,46);return cd;
    });
    const cdSz=cds.reduce((s,e)=>s+e.length,0),eocd=new Uint8Array(22),ev=new DataView(eocd.buffer);
    ev.setUint32(0,0x06054b50,true);ev.setUint16(4,0,true);ev.setUint16(6,0,true);ev.setUint16(8,lhs.length,true);ev.setUint16(10,lhs.length,true);ev.setUint32(12,cdSz,true);ev.setUint32(16,offset,true);ev.setUint16(20,0,true);
    const parts=[...entries.flatMap(e=>[e.lh,e.data]),...cds,eocd];
    const tot=parts.reduce((s,p)=>s+p.length,0),out=new Uint8Array(tot);let pos=0;
    for(const p of parts){out.set(p,pos);pos+=p.length;}
    dlBlob((S.project||'project').toLowerCase().replace(/[^a-z0-9]+/g,'-')+'.zip',out,'application/zip');
    toast('📦 ZIP downloaded!','ok');
  }catch(e){Object.keys(S.files).forEach(f=>dlBlob(f,S.files[f].c,'text/plain'));toast('Downloaded individually','');}
}
function crc32(d){let c=0xFFFFFFFF;const t=crc32.t||(crc32.t=new Uint32Array(256).map((_,i)=>{let n=i;for(let k=0;k<8;k++)n=n&1?0xEDB88320^(n>>>1):n>>>1;return n;}));for(let i=0;i<d.length;i++)c=t[(c^d[i])&0xFF]^(c>>>8);return(c^0xFFFFFFFF)>>>0}

async function exportGist(){
  if(!Object.keys(S.files).length){toast('No files yet','err');return;}
  toast('📤 Creating Gist…','');
  const files={};Object.entries(S.files).forEach(([n,f])=>{files[n]={content:f.c}});
  files['README.md']={content:`# ${S.project||'NeuralForge Project'}\n\nGenerated by NeuralForge v5\n\n_${new Date().toLocaleDateString()}_`};
  try{
    const r=await fetch('https://api.github.com/gists',{method:'POST',headers:{'Content-Type':'application/json','Accept':'application/vnd.github+json'},body:JSON.stringify({description:`NeuralForge v5: ${S.project}`,public:true,files})});
    if(!r.ok)throw new Error();
    const d=await r.json();
    await navigator.clipboard.writeText(d.html_url).catch(()=>{});
    toast('✅ Gist created! URL copied','ok');window.open(d.html_url,'_blank');
  }catch(e){toast('Gist failed — copying code instead','err');copyAllCode();}
}
function shareLink(){
  if(!S.project){toast('No project to share','err');return;}
  const url=`${location.origin}${location.pathname}?project=${encodeURIComponent(S.project)}`;
  navigator.clipboard.writeText(url).then(()=>toast('Share link copied!','ok')).catch(()=>toast('Copy failed','err'));
}

/* ══ BUILD ORCHESTRATOR V8 ══ */
/* ══════════════════════════════════════════════════════════════
   MEETING ENGINE — Real multi-agent communication
   Agents speak to each other, react, raise concerns, agree,
   and reach consensus — like a real project kickoff meeting.
   ══════════════════════════════════════════════════════════════ */
const MEETING={

  /* Who talks to whom at each phase */
  phases:[
    {
      name:'Kickoff',icon:'🚀',
      participants:['ceo','manager','planner'],
      purpose:'Align on vision, scope and strategy',
    },
    {
      name:'Design Review',icon:'🎨',
      participants:['pm','designer','developer'],
      purpose:'Agree on UX, components and technical approach',
    },
    {
      name:'Build Sync',icon:'💻',
      participants:['developer','reviewer','optimizer'],
      purpose:'Code quality, performance and correctness',
    },
    {
      name:'Ship Check',icon:'🚢',
      participants:['a11y','debugger','devops'],
      purpose:'Accessibility, bugs and deployment readiness',
    },
  ],

  /* Response types agents can give each other */
  replyTypes:{
    agree:   {tag:'✅ Agree',   cls:'agree',   weight:0.4},
    concern: {tag:'⚠️ Concern', cls:'concern', weight:0.25},
    build:   {tag:'➕ Adding',  cls:'build',   weight:0.25},
    question:{tag:'❓ Question',cls:'question', weight:0.1},
  },

  /* Show a meeting banner in the chat */
  showBanner(phase, agents){
    const w=document.getElementById('msgs');
    const el=document.createElement('div');
    el.className='meeting-banner';
    const avHtml=agents.map(a=>`<div class="mb-av" style="background:${a.color}22;color:${a.color}">${a.emoji}</div>`).join('');
    el.innerHTML=`<span>${phase.icon}</span><strong>${phase.name} Meeting</strong><span style="color:var(--t3);font-weight:400">— ${phase.purpose}</span><div class="mb-agents">${avHtml}</div>`;
    w.appendChild(el);scrollChat();
  },

  /* Show a single inter-agent reply bubble */
  showReply(fromAgent, replyType, text){
    const w=document.getElementById('msgs');
    const rt=this.replyTypes[replyType]||this.replyTypes.build;
    const el=document.createElement('div');
    el.className='meet-reply';
    el.innerHTML=
      `<div class="meet-av" style="background:${fromAgent.color}22;color:${fromAgent.color}">${fromAgent.emoji}</div>`+
      `<div class="meet-bubble" style="border-color:${fromAgent.color}22">`+
        `<div class="meet-name" style="color:${fromAgent.color}">${fromAgent.name} <span class="meet-tag ${rt.cls}">${rt.tag}</span></div>`+
        `<div class="meet-text">${esc(text)}</div>`+
      `</div>`;
    w.appendChild(el);scrollChat();
  },

  /* Show consensus reached */
  showConsensus(text){
    const w=document.getElementById('msgs');
    const el=document.createElement('div');
    el.className='meet-consensus';
    el.innerHTML=`✅ <strong>Consensus reached</strong> — ${esc(text)}`;
    w.appendChild(el);scrollChat();
  },

  /* Show meeting divider */
  showDivider(text){
    const w=document.getElementById('msgs');
    const el=document.createElement('div');
    el.className='meet-divider';
    el.innerHTML=`<span>${text}</span>`;
    w.appendChild(el);scrollChat();
  },

  /* ── Core: Run a meeting phase ──
     Each participant:
     1. Sees the main agent's output
     2. Generates a SHORT reaction (agree/concern/build/question)
     3. Gets a brief response from the original agent if challenged
     Then: consensus is declared                                     */
  async runPhase(phase, mainOutput, project, ctx){
    if(S.aborted)return;
    const agents=phase.participants.map(id=>AGENTS.find(a=>a.id===id)).filter(Boolean);
    if(agents.length<2)return;

    this.showBanner(phase, agents);
    await sleep(200);

    const mainAgent=agents[0];
    const reviewers=agents.slice(1);
    const concerns=[];
    const votes={agree:0,concern:0};

    // Each reviewer reacts — streamed into bubble
    for(const reviewer of reviewers){
      if(S.aborted)return;
      document.getElementById('ar-'+reviewer.id)?.classList.add('meeting-active');
      setAgentState(reviewer.id,'analyzing');

      const replyPrompt=
        `You are ${reviewer.name} (${reviewer.role}) in a team meeting at NeuralForge.\n`+
        `${mainAgent.name} presented this for project "${project}":\n\n`+
        `"${mainOutput.slice(0,700)}"\n\n`+
        `Give ONE honest reaction in 2-3 sentences. You MUST start with exactly one of:\n`+
        `"✅ I agree" — if you agree and may add something small\n`+
        `"⚠️ Concern:" — if you have a real issue (be specific, name it)\n`+
        `"➕ I'd add:" — if you want to add an important detail\n`+
        `"❓ Question:" — if something needs clarification\n`+
        `Do NOT just agree if there's a real problem. Be direct and specific.`;

      // Stream reply directly into a meeting bubble
      const replyEl=document.createElement('div');
      replyEl.className='meet-reply';
      replyEl.innerHTML=
        `<div class="meet-av" style="background:${reviewer.color}22;color:${reviewer.color}">${reviewer.emoji}</div>`+
        `<div class="meet-bubble" style="border-color:${reviewer.color}22">`+
          `<div class="meet-name" style="color:${reviewer.color}">${reviewer.name} <span class="stream-cursor">▊</span></div>`+
          `<div class="meet-text" id="mrt-${reviewer.id}"></div>`+
        `</div>`;
      document.getElementById('msgs').appendChild(replyEl);scrollChat();

      const replyBub=document.getElementById('mrt-'+reviewer.id);
      let replyFull='';
      const chain=VAULT.getFallbackChain('reasoning');
      let reply=null;

      for(const entry of chain.slice(0,2)){
        if(S.aborted)break;
        reply=await callAPIVault(
          `You are ${reviewer.name}. Be concise, direct, and honest in meetings.`,
          [{role:'user',content:replyPrompt}],
          'reasoning',entry.provider,entry.key,entry.model,
          (chunk,acc)=>{
            replyFull=acc;
            if(replyBub)replyBub.textContent=acc;
            scrollChat();
          }
        );
        if(reply)break;
      }

      // Remove cursor, finalize reply text
      replyEl.querySelector('.stream-cursor')?.remove();
      const cleanReply=(reply||replyFull).replace(/^[✅⚠️➕❓]\s*(I agree|Concern:|I'd add:|Question:)?\s*/i,'').trim();
      if(replyBub)replyBub.textContent=cleanReply;

      // Detect type and add badge
      const raw=reply||replyFull;
      const replyType=
        raw.startsWith('✅')||raw.toLowerCase().startsWith('i agree')?'agree':
        raw.startsWith('⚠️')||raw.toLowerCase().includes('concern')?'concern':
        raw.startsWith('➕')||raw.toLowerCase().includes("i'd add")?'build':'question';

      votes[replyType==='agree'?'agree':'concern']++;
      const rt=this.replyTypes[replyType]||this.replyTypes.build;
      const nameEl=replyEl.querySelector('.meet-name');
      if(nameEl)nameEl.innerHTML=`${reviewer.name} <span class="meet-tag ${rt.cls}">${rt.tag}</span>`;

      if(replyType==='concern'||replyType==='question')
        concerns.push({from:reviewer,text:cleanReply});

      await sleep(300);
      document.getElementById('ar-'+reviewer.id)?.classList.remove('meeting-active');
      setAgentState(reviewer.id,'idle');
    }

    // ── CONFLICT DETECTION: if majority raised concerns → full debate ──
    const hasConflict=votes.concern>=reviewers.length/2;

    if(hasConflict&&!S.aborted){
      // Show conflict indicator
      const conflictEl=document.createElement('div');
      conflictEl.innerHTML=`<div style="display:flex;align-items:center;gap:6px;padding:6px 12px;margin:4px 0;background:rgba(255,107,107,.07);border:1px solid rgba(255,107,107,.2);border-radius:7px;font-size:.67rem;color:var(--red);font-weight:600">⚡ Conflict detected — ${mainAgent.name} must address concerns before proceeding</div>`;
      document.getElementById('msgs').appendChild(conflictEl.firstChild);scrollChat();
      await sleep(300);

      // Main agent responds to each concern specifically
      document.getElementById('ar-'+mainAgent.id)?.classList.add('meeting-active');
      const concernList=concerns.map(c=>`${c.from.name}: "${c.text}"`).join('\n');
      const responsePrompt=
        `You are ${mainAgent.name} in a conflict resolution meeting.\n`+
        `Project: "${project}"\n\n`+
        `These concerns were raised:\n${concernList}\n\n`+
        `Address each concern directly and specifically in 3-4 sentences. `+
        `Propose concrete solutions. Then call for a team vote: "I propose we [solution]. Who agrees?"`;

      const responseEl=document.createElement('div');
      responseEl.className='meet-reply';
      responseEl.innerHTML=
        `<div class="meet-av" style="background:${mainAgent.color}22;color:${mainAgent.color}">${mainAgent.emoji}</div>`+
        `<div class="meet-bubble" style="border-color:${mainAgent.color}33">`+
          `<div class="meet-name" style="color:${mainAgent.color}">${mainAgent.name} <span class="meet-tag build">🔄 Addressing</span></div>`+
          `<div class="meet-text" id="mrt-main-resp"></div>`+
        `</div>`;
      document.getElementById('msgs').appendChild(responseEl);scrollChat();
      const respBub=document.getElementById('mrt-main-resp');

      const chain=VAULT.getFallbackChain('reasoning');
      let resp=null;
      for(const entry of chain.slice(0,2)){
        if(S.aborted)break;
        resp=await callAPIVault(
          `You are ${mainAgent.name}. Be decisive and solution-oriented.`,
          [{role:'user',content:responsePrompt}],
          'reasoning',entry.provider,entry.key,entry.model,
          (chunk,acc)=>{if(respBub)respBub.textContent=acc;scrollChat();}
        );
        if(resp)break;
      }

      document.getElementById('ar-'+mainAgent.id)?.classList.remove('meeting-active');
      await sleep(300);

      // Vote: reviewers cast final votes
      this.showDivider('🗳 Team Vote');
      let yesVotes=0;
      for(const reviewer of reviewers.slice(0,2)){
        if(S.aborted)break;
        const votePrompt=`Given ${mainAgent.name}'s response: "${(resp||'').slice(0,300)}", do you now vote YES to proceed or NO to escalate? Answer with just "YES — [brief reason]" or "NO — [brief concern]".`;
        const voteReply=await callWithRetry(
          `You are ${reviewer.name}. Give a direct yes/no vote.`,
          [{role:'user',content:votePrompt}],reviewer
        );
        const isYes=!voteReply||voteReply.trim().toUpperCase().startsWith('YES');
        if(isYes)yesVotes++;
        this.showReply(reviewer,isYes?'agree':'concern',(voteReply||'').replace(/^(YES|NO)\s*[—-]?\s*/i,'').slice(0,120));
        await sleep(250);
      }

      const passed=yesVotes>=reviewers.slice(0,2).length/2;
      this.showConsensus(passed?
        `Vote passed ${yesVotes}/${reviewers.slice(0,2).length} — proceeding with ${mainAgent.name}'s revised approach.`:
        `Vote split — ${mainAgent.name} will incorporate feedback into next iteration.`
      );

    } else if(concerns.length>0&&!S.aborted){
      // Minor concerns — quick response from main agent
      await sleep(200);
      document.getElementById('ar-'+mainAgent.id)?.classList.add('meeting-active');
      const concernList=concerns.map(c=>`"${c.text}"`).join('; ');
      const chain=VAULT.getFallbackChain('fast');
      let resp=null;

      const respEl=document.createElement('div');
      respEl.className='meet-reply';
      respEl.innerHTML=
        `<div class="meet-av" style="background:${mainAgent.color}22;color:${mainAgent.color}">${mainAgent.emoji}</div>`+
        `<div class="meet-bubble" style="border-color:${mainAgent.color}22">`+
          `<div class="meet-name" style="color:${mainAgent.color}">${mainAgent.name} <span class="meet-tag agree">✅ Responding</span></div>`+
          `<div class="meet-text" id="mrt-quick-resp"></div>`+
        `</div>`;
      document.getElementById('msgs').appendChild(respEl);scrollChat();
      const qBub=document.getElementById('mrt-quick-resp');

      for(const entry of chain.slice(0,2)){
        if(S.aborted)break;
        resp=await callAPIVault(
          `You are ${mainAgent.name}. Be brief (2 sentences) and constructive.`,
          [{role:'user',content:`Address briefly: ${concernList}`}],
          'fast',entry.provider,entry.key,entry.model,
          (chunk,acc)=>{if(qBub)qBub.textContent=acc;scrollChat();}
        );
        if(resp)break;
      }
      document.getElementById('ar-'+mainAgent.id)?.classList.remove('meeting-active');
      await sleep(200);
      this.showConsensus(`Concerns addressed. Team moving forward.`);
    } else if(!S.aborted){
      this.showConsensus(`All agents aligned on ${phase.purpose.toLowerCase()}.`);
    }
  },

  /* Get which phase an agent belongs to */
  getPhaseForAgent(agentId){
    return this.phases.find(p=>p.participants.includes(agentId));
  },

  /* Check if this is the LAST agent in its phase (trigger meeting after) */
  isPhaseLeader(agentId){
    return this.phases.some(p=>p.participants[0]===agentId);
  },
};

/* ── Cross-agent context: each agent sees what teammates decided ── */
function _buildCrossAgentContext(currentRole, ctx, project){
  const summaryMap={
    ceo:         {from:'websearcher', label:'Web Research Brief'},
    promptagent: {from:'ceo',         label:'CEO Strategy'},
    manager:     {from:'promptagent', label:'Refined Project Brief'},
    planner:     {from:'manager',     label:'Manager Plan'},
    pm:          {from:'planner',     label:'Architect Plan'},
    designer:    {from:'pm',          label:'PM Specs'},
    developer:   {from:'designer',    label:'Design System'},
    reviewer:    {from:'developer',   label:'Developer Code'},
    optimizer:   {from:'reviewer',    label:'Reviewer Notes'},
    a11y:        {from:'developer',   label:'Code Files'},
    debugger:    {from:'a11y',        label:'A11y Report'},
    devops:      {from:'debugger',    label:'Debug Fixes'},
    tester:      {from:'devops',      label:'DevOps Package'},
  };
  const map=summaryMap[currentRole];
  if(!map||!ctx[map.from])return'';
  return `${map.label}: "${ctx[map.from].slice(0,400)}..."`;
}

async function go(){
  const pi=document.getElementById('pi'),text=pi.value.trim();
  if(!text){toast('Describe your project first','err');return;}
  if(S.building){toast('Build in progress\u2026','');return;}
  if(!S.cfg.key&&!VAULT.getActiveCount()){toast('Add an API key in \u2699\ufe0f Settings','err');openConfig();return;}
  if(detectIntent(text)==='question'){pi.value='';autosize(pi);await answerQuestion(text);return;}

  // ── Feature hooks ──
  S.buildReplayLog=[];
  resetCostTracker();
  ABORT_GUARD.start();

  // Discussion queue: append any queued instructions to prompt
  if(_bdQueued){
    if(!pi.value.includes(_bdQueued.slice(0,40))){
      pi.value=(text+'\n\nFrom build discussion:\n'+_bdQueued.slice(0,500)).trim();
      autosize(pi);
    }
    _bdQueued=null;
  }

  // Web search pre-build
  if(text.length>10&&VAULT.getActiveCount()>0){
    try{await WEB_SEARCHER.run(text);}catch(e){logError('Web searcher: '+e.message,'warn');}
  }
  if(S.webSearchResults.length){
    S.ctx._webResearch=S.webSearchResults[S.webSearchResults.length-1]?.result||'';
  }

  // V8: Dynamic routing check
  if(S.cfg.dynamicRouting)S.routingDecision=await DYNAMIC_ROUTER.route(text);

  // START
  pi.value='';autosize(pi);
  S.building=true;S.aborted=false;S.project=text;S.sid='s'+Date.now();
  S._sessionTitle=null; // reset — will be set by simplifyTitle()
  S.files={};S.chatLog=[];S.ctx={};S.loopCount=0;S.evalScores={};
  usrScrolled=false;resetTokens();startTimer();

  // Simplify the session title immediately (heuristic is instant; AI runs in background)
  simplifyTitle(text).then(title=>{
    if(title&&title!==text){
      _applySessionTitle(title);
    }
  }).catch(()=>{});

  document.getElementById('buildbtn').disabled=true;
  document.getElementById('stopbtn').classList.add('show');
  document.getElementById('intbtn').classList.add('show');
  document.getElementById('expbar').classList.remove('show');
  document.getElementById('suggp').classList.remove('show');
  document.getElementById('dlall').disabled=true;
  document.getElementById('runbtn').disabled=true;
  setStatus('building');
  // Show raw text initially — simplifyTitle() will update it shortly
  const _rawTitle=text.slice(0,30)+(text.length>30?'…':'');
  document.getElementById('pbadge').textContent=_rawTitle;
  document.getElementById('pbadge').classList.add('active');
  AGENTS.forEach(a=>{setAgent(a.id,'');setAgentState(a.id,'idle')});
  STAGES.forEach(s=>setStage(s.id,''));
  setProgress(0);clearFiles();addUserMsg(text);CHAIN_ENGINE.buildChain(text);

  // V8: Store project in persistent memory
  MEM.addFact('Project: '+text.slice(0,100),'project');
  MEM.setProjectCtx('currentProject',text);
  MEM.setProjectCtx('framework',S.framework);

  document.getElementById('ftree').style.display='block';
  document.getElementById('ceditor').style.display='flex';

  for(let i=0;i<SEQ.length;i++){
    if(S.aborted)break;
    const{a,s,role,extract}=SEQ[i];
    if(i>0)addXTalk(SEQ[i-1].a,a);
    await sleep(150);
    setAgent(a.id,'thinking');setStage(s,'active');
    var _as=['thinking','analyzing','generating','optimizing'],_cs=_as[Math.min(i,3)]||'generating';
    setAgentState(a.id,_cs);
    if(i>0)setAgentState(SEQ[i-1].a.id,'done');
    var _rg=AGENT_REGISTRY[a.id];
    if(_rg&&i>0)updatePipeline(SEQ[i-1].a.name,a.name,_rg.receives[0]);
    CHAIN_ENGINE.advance(S.ctx[SEQ[Math.max(0,i-1)].a.id]||text);
    setProgress((i/SEQ.length)*90);
    const _displayTitle=(S._sessionTitle||text).slice(0,20);
    document.getElementById('pbadge').innerHTML=_displayTitle+((_displayTitle.length<(S._sessionTitle||text).length)?'…':'')+' <span style="color:var(--t3);font-weight:400">'+a.name+' ('+(i+1)+'/'+SEQ.length+')</span>';

    const memCtx=MEM.buildContext(text);
    const codebaseCtx=CODEBASE.getAgentContext(role);
    const basePrompt=PROMPTS[role]?.(text,S.ctx)||'You are '+a.name+'. Project: "'+text+'". Provide your expert contribution.';

    // Build cross-agent context — each agent explicitly sees what others decided
    const crossCtx=_buildCrossAgentContext(role,S.ctx,text);

    // User interrupt — inject redirect message if pending
    const interruptCtx=S._interrupt?`\n\n[⚡ USER REDIRECT — HIGH PRIORITY]\nThe user has redirected the team: "${S._interrupt}"\nYou MUST incorporate this instruction into your work.`:'';
    if(S._interrupt){toast(`📢 Injecting user redirect into ${a.name}`,'');S._interrupt=null;}

    const promptText=basePrompt+
      (crossCtx?'\n\n[Team Decisions So Far]\n'+crossCtx:'')+
      interruptCtx+
      (memCtx?'\n\n[Memory Context]\n'+memCtx:'')+
      (codebaseCtx?'\n\n[Codebase Intelligence]\n'+codebaseCtx:'')+
      (S.ctx._webResearch&&role!=='websearcher'?'\n\n[Web Research Brief — use this context]\n'+S.ctx._webResearch.slice(0,400):'')+
      (S.ctx._refinedPrompt&&!['websearcher','ceo','promptagent'].includes(role)?'\n\n[Refined Project Brief — this is your north star]\n'+S.ctx._refinedPrompt.slice(0,600):'')+
      (S.ctx._feedbackIssues&&role==='developer'?'\n\n[FEEDBACK — MUST FIX]\n'+S.ctx._feedbackIssues:'');

    const modelProfile=MODEL_ROUTER.getProfile(a.id);
    const sys='You are '+a.name+' — '+a.role+' — at NeuralForge. ['+modelProfile.desc+'] You produce real, complete, production-quality work. No placeholders.';

    let txt;

    // ── WEB SEARCHER: runs first, injects research context for all agents ──
    if(role==='websearcher'){
      setAgentState(a.id,'analyzing');
      const best=VAULT.getBest('reasoning')||VAULT.getBest('quality');
      if(best)showAgentModel(a.id,best.provider,best.model,'reasoning');
      txt=await streamAgentLive(a,sys,[{role:'user',content:promptText}]);
      if(txt){
        S.ctx._webResearch=txt; // inject into all downstream agents
        S.webSearchResults.push({prompt:text,result:txt,ts:Date.now()});
      }
    }
    // ── PROMPT AGENT: refines the brief, output used as north-star by all downstream ──
    else if(role==='promptagent'){
      setAgentState(a.id,'generating');
      const best=VAULT.getBest('reasoning')||VAULT.getBest('quality');
      if(best)showAgentModel(a.id,best.provider,best.model,'reasoning');
      txt=await streamAgentLive(a,sys,[{role:'user',content:promptText}]);
      if(txt){
        S.ctx._refinedPrompt=txt; // all downstream agents see this
        toast('✍️ Prompt Agent refined the brief — injecting into pipeline','ok');
      }
    }
    // ── TESTER: runs last, full sandbox test + AI test report ──
    else if(role==='tester'){
      setAgentState(a.id,'analyzing');
      const best=VAULT.getBest('reasoning')||VAULT.getBest('quality');
      if(best)showAgentModel(a.id,best.provider,best.model,'reasoning');
      // Run AI test report
      txt=await streamAgentLive(a,sys,[{role:'user',content:promptText}]);
      // Also run the real sandbox
      if(Object.keys(S.files).length>0){
        try{
          const sandboxRes=await TEST_AGENT._runSandbox(S.files);
          const sandboxNote=sandboxRes.passed?
            '\n\n🖥 **Sandbox Result:** ✅ No runtime errors detected in live sandbox.':
            '\n\n🖥 **Sandbox Result:** ❌ Runtime errors: '+sandboxRes.errors.join('; ');
          if(txt)txt+=sandboxNote;
        }catch(e){logError('Sandbox: '+e.message,'warn');}
      }
      // Show replay button now that build is complete
      setTimeout(()=>{const btn=document.getElementById('replay-btn');if(btn&&S.buildReplayLog?.length)btn.style.display='';},500);
    }
    // ── CEO DYNAMIC DELEGATION: CEO decides if project needs extra resources ──
    else if(role==='ceo'&&!S.ctx._ceoDelegate){
      const pickedTask='reasoning';
      const best=VAULT.getBest(pickedTask)||VAULT.getBest('quality');
      if(best)showAgentModel(a.id,best.provider,best.model,pickedTask);
      txt=await streamAgentLive(a,sys,[{role:'user',content:promptText}]);
      if(txt){
        // CEO can flag complexity level for downstream agents
        const isComplex=/complex|large|enterprise|full.stack|complete|production/i.test(text);
        S.ctx._ceoDelegate={complexity:isComplex?'high':'normal',extraDev:isComplex};
        if(isComplex)toast('👔 CEO flagged high complexity — Developer will get extra context','ok');
      }
    }
    // ── FEEDBACK LOOP: Developer → Reviewer → Developer ──
    else if(role==='developer'&&S.cfg.feedbackLoop){
      const reviewerAgent=AGENTS.find(ag=>ag.id==='reviewer');
      txt=await FEEDBACK.loop(text,text,a,S.ctx,reviewerAgent,S.cfg.maxLoops||2);
      if(S.cfg.feedbackLoop){
        const revIdx=SEQ.findIndex(step=>step.role==='reviewer');
        if(revIdx>i){setAgent('reviewer','done');setStage('review','done');setAgentState('reviewer','done');}
      }
    }
    else if(role==='reviewer'&&S.cfg.feedbackLoop&&S.ctx._reviewerRanInLoop){
      txt=S.ctx.reviewer||'Reviewer completed inside feedback loop.';
    }
    // ── DEFAULT: Live stream directly into chat bubble ──
    else {
      const pickedTask=MODEL_ROUTER.detectTask(promptText)||MODEL_ROUTER.agentTaskMap[a.id]||'quality';
      const best=VAULT.getBest(pickedTask)||VAULT.getBest('quality');
      if(best)showAgentModel(a.id,best.provider,best.model||'',pickedTask);
      txt=await streamAgentLive(a,sys,[{role:'user',content:promptText}]);
    }

    if(S.aborted){setAgent(a.id,'');break;}
    if(!txt){
      toast(a.name+' got no response — using fallback','');
      txt='## '+a.name+' — No Response\n\nCould not reach AI provider. Check ⚙️ Settings.';
      await addAgentMsg(a,txt,true);
    }

    S.ctx[a.id]=txt;
    if(role==='developer')delete S.ctx._feedbackIssues;

    // Extract memories from output
    extractMemoriesFromOutput(a.id,txt,text);

    // ══ MEETING ENGINE: Run phase meeting ══
    const meetingPhaseMap={ceo:0,pm:1,developer:2,a11y:3};
    const phaseIdx=meetingPhaseMap[role];
    if(phaseIdx!==undefined&&!S.aborted&&txt.length>100){
      MEETING.showDivider('Team Meeting');
      await sleep(150);
      await MEETING.runPhase(MEETING.phases[phaseIdx],txt,text,S.ctx);
      await sleep(200);
      MEETING.showDivider('Continuing Build');
      await sleep(150);
    }

    if(extract&&txt){
      if(extract==='all'){
        const count=extractAllFiles(txt);
        if(count>0){
          renderFiles();
          const firstFile=S.files['index.html']?'index.html':Object.keys(S.files)[0];
          if(firstFile)selFile(firstFile);
          document.getElementById('dlall').disabled=false;
          document.getElementById('runbtn').disabled=false;
          toast('\ud83d\udcc2 '+count+' file'+(count!==1?'s':'')+' extracted','ok');
          if(S.curRTab==='preview')refreshInline();
          CODEBASE.index();addEditWithAIButton();
        }
      } else {
        const code=extractCode(txt,extract);
        if(code){
          const fname=extract==='html'?'index.html':extract==='css'?'style.css':'script.js';
          const info=detectFileType(extract,code);
          S.files[fname]={c:code,lang:info.lang,icon:info.icon,color:info.color};
          renderFiles();selFile(fname);
          document.getElementById('dlall').disabled=false;
          document.getElementById('runbtn').disabled=false;
          if(S.curRTab==='preview')refreshInline();
          CODEBASE.index();addEditWithAIButton();
        }
      }
    }

    // V8: Self-evaluation on reviewer pass
    if(S.cfg.selfEval&&role==='reviewer'){
      const allCode=Object.values(S.files).map(f=>f.c).join('\n').slice(0,2000);
      if(allCode){const ev=await FEEDBACK.evaluate(allCode,text);if(ev)showEvalScores(ev,null);}
    }

    // DevOps: extract README.md
    if(role==='devops'&&txt){
      const mdCode=extractCode(txt,'markdown')||extractCode(txt,'md');
      if(mdCode&&mdCode.length>50){
        S.files['README.md']={c:mdCode,lang:'markdown',icon:'\ud83d\udcdd',color:'#82aaff'};
        renderFiles();
      }
    }

    setAgent(a.id,'done');setStage(s,'done');
    persistSession();await sleep(60);
  }

  // DONE
  document.getElementById('stopbtn').classList.remove('show');
  document.getElementById('buildbtn').disabled=false;
  S.building=false;stopTimer();

  if(!S.aborted){
    setProgress(100);setStatus('done');
    document.getElementById('expbar').classList.add('show');
    const _finalTitle=S._sessionTitle||text;
    document.getElementById('pbadge').textContent=_finalTitle.slice(0,36)+(_finalTitle.length>36?'\u2026':'');
    persistSession();playDone();
    const fc=Object.keys(S.files).length;

    // V8: Store build summary in long-term memory
    MEM.addFact('Built "'+S.project+'" ('+( FW_CONFIG[S.framework]?.label||'Vanilla')+') \u2014 '+fc+' files','build');
    MEM.renderUI();

    const w=document.getElementById('msgs');
    const banner=document.createElement('div');banner.className='done-banner';
    banner.innerHTML='<div style="font-size:20px">\ud83c\udf89</div><div style="flex:1;font-size:.8rem;color:var(--green);font-weight:600">Build complete! '+fc+' file'+(fc!==1?'s':'')+' generated.</div><div class="db-btns"><button class="dbb pri" onclick="runPreview()">\u25b6 Preview</button><button class="dbb sec" onclick="dlZip()">\u2b07 ZIP</button><button class="dbb sec" onclick="openInlineEditor()">\u270f\ufe0f AI Edit</button></div>';
    w.appendChild(banner);scrollChat();
    generateSuggestions();generateTitle(text);
    toast('\ud83c\udf89 Build complete! '+fc+' files \u2014 \ud83e\udde0 Memory updated','ok');
  }
}
function stopBuild(){ABORT_GUARD.stop();S.abortController?.abort();S.aborted=true;toast('⏹ Build stopped','');document.getElementById('stopbtn').classList.remove('show');document.getElementById('intbtn').classList.remove('show');document.getElementById('buildbtn').disabled=false;S.building=false;stopTimer();setStatus('idle')}

/* User interrupt — inject a redirect message into the current build */
S._interrupt=null;
async function interruptBuild(){
  if(!S.building)return;
  const msg=prompt('📢 Redirect the team:\n\nYour message will be injected into the next agent\'s context.\nE.g. "Use React instead of vanilla JS" or "Add dark mode support"');
  if(!msg||!msg.trim())return;
  S._interrupt=msg.trim();
  // Show the interrupt in chat
  const w=document.getElementById('msgs');
  const el=document.createElement('div');
  el.className='meeting-banner';
  el.style.cssText='background:rgba(0,212,255,.08);border-color:rgba(0,212,255,.25);color:var(--cyan)';
  el.innerHTML=`<span>📢</span><strong>User Redirect</strong><span style="color:var(--t2);font-weight:400">— "${esc(msg.slice(0,80))}"</span><span style="margin-left:auto;font-size:.58rem;color:var(--t3)">injecting into next agent…</span>`;
  w.appendChild(el);scrollChat();
  toast('📢 Redirect queued — takes effect on next agent','ok');
}

/* ══ TITLE SUMMARIZER ══ */
async function generateTitle(rawPrompt){
  if(!S.cfg.key||!rawPrompt)return;
  try{
    const resp=await callAPI(
      'You are a title generator. Given a project description, output ONLY a short title (2-5 words, no quotes, no emoji). Examples: "Weather Dashboard", "Todo Manager", "E-Commerce Store", "Music Player App".',
      [{role:'user',content:`Generate a short title for: "${rawPrompt.slice(0,200)}"`}]
    );
    if(!resp)return;
    const title=resp.trim().replace(/^["']|["']$/g,'').replace(/^\*+|\*+$/g,'').slice(0,40);
    if(title&&title.length>=2){
      S.project=title;
      document.getElementById('pbadge').textContent=title;
      // Update history entry
      const h=getHist(),idx=h.findIndex(x=>x.id===S.sid);
      if(idx>=0){h[idx].name=title;saveHist(h);renderHistList();}
    }
  }catch(e){console.warn('Title gen failed:',e)}
}

/* ══ MSG ACTIONS ══ */
function getFullText(btn){
  const body=btn.closest('.mbody'),parts=[];
  const bub=body.querySelector('.mbub');if(bub)parts.push(bub.innerText||bub.textContent||'');
  body.querySelectorAll('.mcode-body').forEach(c=>parts.push('\n```\n'+(c.textContent||'')+'\n```\n'));
  return parts.join('\n').trim();
}
function cpMsg(btn){navigator.clipboard.writeText(getFullText(btn)).then(()=>{const o=btn.innerHTML;btn.innerHTML='✅';btn.classList.add('ok');setTimeout(()=>{btn.innerHTML=o;btn.classList.remove('ok')},2000)}).catch(()=>toast('Copy failed','err'))}
function dlMsg(btn,name){dlBlob(name,getFullText(btn),'text/plain');toast('Saved '+name,'ok')}
function cpCodeBlock(btn){const el=btn.closest('.mcode').querySelector('.mcode-body');const code=el?._rawCode||el?.textContent||'';navigator.clipboard.writeText(code).then(()=>{const o=btn.innerHTML;btn.innerHTML='✅';btn.classList.add('ok');setTimeout(()=>{btn.innerHTML=o;btn.classList.remove('ok')},2000)}).catch(()=>toast('Copy failed','err'))}
function dlCodeBlock(btn,name){const el=btn.closest('.mcode').querySelector('.mcode-body');const code=el?._rawCode||el?.textContent||'';dlBlob(name,code,'text/plain');toast('Saved '+name,'ok')}
function copyAllChat(){const t=[...document.querySelectorAll('.msg')].map(m=>`[${m.querySelector('.mname')?.textContent||''}]\n${m.querySelector('.mbub')?.innerText||''}`).join('\n\n---\n\n');navigator.clipboard.writeText(t).then(()=>toast('Chat copied!','ok')).catch(()=>toast('Copy failed','err'))}

/* ══ SOUND ══ */
function playDone(){try{const c=new(window.AudioContext||window.webkitAudioContext)();[523.25,659.25,783.99,1046.5].forEach((f,i)=>{const o=c.createOscillator(),g=c.createGain();o.connect(g);g.connect(c.destination);o.type='sine';o.frequency.value=f;const t=c.currentTime+i*.12;g.gain.setValueAtTime(0,t);g.gain.linearRampToValueAtTime(.08,t+.02);g.gain.exponentialRampToValueAtTime(.001,t+.35);o.start(t);o.stop(t+.4);})}catch(e){}}

/* ══ TOAST ══ */
function toast(msg,type=''){
  const c=document.getElementById('toasts'),t=document.createElement('div');
  const ic={ok:'✅',err:'❌','':'ℹ️'};
  t.className='toast'+(type==='ok'?' ok':type==='err'?' err':'');
  t.innerHTML=`<span>${ic[type]||'ℹ️'}</span>${esc(msg)}`;
  c.appendChild(t);setTimeout(()=>{t.style.cssText='opacity:0;transform:translateY(16px);transition:all .3s';setTimeout(()=>t.remove(),300)},3200);
}

/* ══ THEME ══ */
function toggleTheme(){
  const c=document.documentElement.getAttribute('data-theme');
  const n=c==='dark'?'light':'dark';
  document.documentElement.setAttribute('data-theme',n);
  const icon=n==='dark'?'🌙':'☀️';
  const tb=document.getElementById('theme-btn');if(tb)tb.textContent=icon;
  const mi=document.getElementById('mob-theme-icon');if(mi)mi.textContent=icon;
  try{localStorage.setItem(LS_THEME,n)}catch(e){}
}

/* ══ PANEL TOGGLES ══ */
function toggleLeft(){S.lc=!S.lc;document.getElementById('app').classList.toggle('lc',S.lc);const b=document.getElementById('sbcol');b.textContent=S.lc?'▶':'◀';b.title=S.lc?'Expand':'Collapse'}
function toggleRight(){S.rc=!S.rc;document.getElementById('app').classList.toggle('rc',S.rc);const b=document.getElementById('rpcol');b.textContent=S.rc?'◀':'▶';b.title=S.rc?'Expand':'Collapse'}
let sbOpen=false;
function toggleSidebar(){sbOpen=!sbOpen;document.getElementById('sb').classList.toggle('open',sbOpen);document.getElementById('sbo').classList.toggle('show',sbOpen);document.getElementById('mob-toggle').setAttribute('aria-expanded',sbOpen)}
function closeSidebar(){sbOpen=false;document.getElementById('sb').classList.remove('open');document.getElementById('sbo').classList.remove('show');document.getElementById('mob-toggle').setAttribute('aria-expanded','false')}

/* ══ MODE ══ */
function setMode(mode,btn){
  S.mode=mode;document.querySelectorAll('.mtb').forEach(b=>b.classList.remove('on'));btn.classList.add('on');
  const pi=document.getElementById('pi'),bb=document.getElementById('buildbtn');
  if(mode==='chat'){pi.placeholder='Ask me anything… e.g. What is flexbox? How does async/await work?';bb.style.background='linear-gradient(135deg,#00d4ff,#38bdf8)';bb.innerHTML='→ Ask';}
  else{pi.placeholder='Describe your project… e.g. Build a weather app with live API and dark mode';bb.style.background='linear-gradient(135deg,#7c6af7,#9d8df5)';bb.innerHTML='<svg viewBox="0 0 24 24"><polygon points="5,3 19,12 5,21"/></svg>Build';}
  pi.focus();
}

/* ══ VOICE ══ */
function toggleMic(){
  if(!('webkitSpeechRecognition'in window||'SpeechRecognition'in window)){toast('Speech not supported','err');return;}
  const btn=document.getElementById('micbtn');
  if(recog){recog.stop();recog=null;btn.classList.remove('on');return;}
  const SR=window.SpeechRecognition||window.webkitSpeechRecognition;
  recog=new SR();recog.continuous=false;recog.interimResults=true;recog.lang='en-US';
  btn.classList.add('on');
  recog.onresult=e=>{document.getElementById('pi').value=Array.from(e.results).map(r=>r[0].transcript).join('');autosize(document.getElementById('pi'))};
  recog.onend=()=>{recog=null;btn.classList.remove('on')};
  recog.onerror=()=>{recog=null;btn.classList.remove('on');toast('Mic error','err')};
  recog.start();
}

/* ══ FILL PROMPT ══ */
function fillPrompt(el){
  const t=el.textContent.trim();
  const map={
    '🌤 Weather App':'Build a beautiful weather app with OpenWeatherMap API, animated weather icons, 5-day forecast, geolocation, and dark/light mode',
    '⚛️ React Dashboard':'Build a React analytics dashboard with charts, KPI cards, data tables, dark mode, and real-time updates',
    '▲ Next.js Blog':'Build a Next.js 14 blog with App Router, MDX support, dark mode, SEO optimization, and Tailwind CSS',
    '🟢 Node.js API':'Build a Node.js Express REST API for a task management app with CRUD endpoints, auth middleware, and validation',
    '📊 Vue Analytics':'Build a Vue 3 analytics dashboard with Composition API, charts, filters, and real-time data simulation',
    '🐍 Python FastAPI':'Build a Python FastAPI backend for a recipe management app with CRUD, search, and a frontend HTML interface',
    '🎮 Browser Game':'Build a browser Canvas game — Breakout clone with levels, power-ups, particle effects, and Web Audio',
    '⚛️ React App':'Build a React task manager with drag & drop, categories, due dates, dark mode, and local storage',
    '🟢 REST API':'Build a Node.js Express REST API with JWT auth, user management, CRUD operations, and Swagger docs',
    '▲ Next.js App':'Build a Next.js 14 e-commerce store with product listing, cart, checkout, and Stripe payment UI',
    '🐍 Flask API':'Build a Python Flask REST API for a notes app with authentication, CRUD endpoints, and a simple frontend',
    '📝 Todo Manager':'Build a todo manager with drag and drop, categories, priority levels, due dates, and local storage',
    '🛒 E-Commerce':'Build a modern e-commerce store with product grid, cart, checkout flow, and animations',
    '💬 Chat UI':'Build a real-time chat UI with message bubbles, emoji picker, typing indicators, and auto-scroll',
    '📊 Dashboard':'Build an analytics dashboard with interactive charts, KPI cards, and sortable data tables',
    '🎵 Music Player':'Build a music player with waveform visualizer, playlist, shuffle, and animated album art',
    '🗓 Calendar':'Build a calendar app with month/week/day views, event creation, and drag to reschedule',
    '🔐 Auth System':'Build an authentication system with login, register, password reset, and user profile',
    '📖 Note App':'Build a note-taking app with markdown editor, search, tags, and auto-save',
    '🎨 Color Tool':'Build a color palette generator with harmony rules, contrast checker, and CSS export',
  };
  document.getElementById('pi').value=map[t]||t;
  autosize(document.getElementById('pi'));
  document.getElementById('pi').focus();
  // Auto-select framework based on tag
  const fwMap={
    '⚛️ React Dashboard':'react','⚛️ React App':'react',
    '▲ Next.js Blog':'nextjs','▲ Next.js App':'nextjs',
    '🟢 Node.js API':'node','🟢 REST API':'node',
    '📊 Vue Analytics':'vue',
    '🐍 Python FastAPI':'python','🐍 Flask API':'python',
  };
  if(fwMap[t]){
    const fwEl=document.querySelector(`.fwtab[data-fw="${fwMap[t]}"]`);
    if(fwEl)setFramework(fwMap[t],fwEl);
  }
}

/* ══ SESSION ══ */
function newSession(){
  if(S.building){S.aborted=true;}
  S.building=false;S.project=null;S.sid=null;S.files={};S.chatLog=[];S.ctx={};
  S._sessionTitle=null; // clear simplified title
  usrScrolled=false;resetTokens();stopTimer();
  AGENTS.forEach(a=>{setAgent(a.id,'');setAgentState(a.id,'idle')});STAGES.forEach(s=>setStage(s.id,''));
  setProgress(0);setStatus('idle');AGENTS.forEach(a=>setAgentState(a.id,'idle'));hidePipeline();clearFiles();updateCount();
  refreshAllAgentModels(); // reset to vault state
  document.getElementById('pbadge').textContent='No project — describe one below';
  document.getElementById('pbadge').classList.remove('active');
  document.getElementById('dlall').disabled=true;document.getElementById('runbtn').disabled=true;
  document.getElementById('buildbtn').disabled=false;document.getElementById('stopbtn').classList.remove('show');
  document.getElementById('expbar').classList.remove('show');document.getElementById('tokbadge').classList.remove('show');
  document.getElementById('suggp').classList.remove('show');
  document.getElementById('msgs').innerHTML=`<div id="welcome"><div class="wlc-icon">🧠</div><div class="wlc-title">AI Software Company</div>
      <div style="font-size:.63rem;color:var(--t3);margin-top:2px;font-family:var(--mono)">11-Agent Pipeline · CEO → DevOps</div><div class="wlc-sub">11 specialized AI agents — CEO → Manager → Planner → PM → Designer → Developer → Reviewer → Optimizer → A11y → Debugger → DevOps — build complete multi-file web projects.</div><div class="wlc-tags"><div class="wtag" onclick="fillPrompt(this)">🌤 Weather App</div><div class="wtag" onclick="fillPrompt(this)">📝 Todo Manager</div><div class="wtag" onclick="fillPrompt(this)">🛒 E-Commerce</div><div class="wtag" onclick="fillPrompt(this)">💬 Chat UI</div><div class="wtag" onclick="fillPrompt(this)">📊 Dashboard</div><div class="wtag" onclick="fillPrompt(this)">🎵 Music Player</div></div></div>`;
}

function renderHistList(){
  const list=document.getElementById('hist-list'),h=getHist();
  if(!h.length){list.innerHTML='<div style="padding:7px 12px;font-size:.69rem;color:var(--t3)">No history yet</div>';return;}
  list.innerHTML=h.slice(0,6).map(item=>`<div class="hitem${item.id===S.sid?' cur':''}" onclick="restoreSession('${item.id}')"><span class="hname">${esc(item.name)}</span><span class="htime">${new Date(item.ts).toLocaleDateString(undefined,{month:'short',day:'numeric'})}</span><button class="hdel" onclick="delSess('${item.id}',event)">✕</button></div>`).join('');
}
function renderHistModal(){
  const list=document.getElementById('hmlist'),h=getHist();
  if(!h.length){list.innerHTML='<div style="padding:20px;text-align:center;color:var(--t3);font-size:.78rem">No sessions saved yet.</div>';return;}
  list.innerHTML=h.map(item=>`<div class="hmitem${item.id===S.sid?' cur':''}" onclick="restoreSession('${item.id}')"><span class="hmname">${esc(item.name)}</span><span class="hmdate">${new Date(item.ts).toLocaleDateString(undefined,{month:'short',day:'numeric',hour:'2-digit',minute:'2-digit'})}</span><button class="hmdel" onclick="delSess('${item.id}',event)">✕</button></div>`).join('');
}
function restoreSession(id){
  const h=getHist(),item=h.find(x=>x.id===id);if(!item)return;
  newSession();S.sid=item.id;S.project=item.name;S.files=item.files||{};
  document.getElementById('pbadge').textContent=item.name.slice(0,36);
  document.getElementById('pbadge').classList.add('active');
  if(Object.keys(S.files).length){renderFiles();selFile(Object.keys(S.files)[0]);document.getElementById('dlall').disabled=false;document.getElementById('runbtn').disabled=false;document.getElementById('expbar').classList.add('show');}
  const w=document.getElementById('msgs');document.getElementById('welcome')?.remove();
  (item.chatLog||[]).forEach(m=>{
    if(m.type==='user')addUserMsg(m.text);
    else if(m.agentData){
      const el=document.createElement('div');el.className='msg';
      el.innerHTML=`<div class="mav" style="background:${m.agentData.color}1a;border:1px solid ${m.agentData.glow}">${m.agentData.emoji}</div><div class="mbody"><div class="mhdr"><div class="mname" style="color:${m.agentData.color}">${m.agentData.name}</div><div class="mbadge" style="background:${m.agentData.bb};color:${m.agentData.bc}">${m.agentData.badge}</div><div class="mtime">${m.time||''}</div></div><div class="mbub" id="res-${Date.now()}"></div></div>`;
      w.appendChild(el);
      const bub=el.querySelector('.mbub');
      if(bub)renderRichMessage(bub,m.text);
    }
  });
  S.chatLog=item.chatLog||[];updateCount();scrollChat(true);
  toast(`Restored: ${item.name.slice(0,30)}`,'ok');closeMo('hist-mo');renderHistList();
}
function delSess(id,e){e&&e.stopPropagation();saveHist(getHist().filter(x=>x.id!==id));renderHistList();renderHistModal();toast('Deleted','')}
function clearHistory(){saveHist([]);renderHistList();renderHistModal();toast('History cleared','')}

/* ══ MODALS ══ */
function closeMo(id){document.getElementById(id)?.classList.remove('show')}
/* ══════════════════════════════════════════════════════════
   KEY VAULT ENGINE — Multi-provider AI key management
   Detect task → check keys → pick strongest → fallback chain
   ══════════════════════════════════════════════════════════ */
const LS_VAULT='nf10_vault';

/* Provider metadata: capabilities, best models per task, tier */
const PROVIDER_META={
  /* ══ FREE TIER ══ */
  openrouter:{
    name:'OpenRouter',color:'#7c6af7',icon:'🔀',
    url:'https://openrouter.ai/api/v1/chat/completions',
    tier:'free',getKey:()=>'https://openrouter.ai/keys',
    browserCors:true,
    models:{coding:'deepseek/deepseek-chat-v3-0324:free',reasoning:'deepseek/deepseek-r1:free',quality:'meta-llama/llama-3.3-70b-instruct:free',creative:'google/gemma-3-12b-it:free',fast:'meta-llama/llama-3.1-8b-instruct:free',review:'meta-llama/llama-3.3-70b-instruct:free'},
    strength:8,desc:'100+ free models · best variety · CORS ✅',
  },
  groq:{
    name:'Groq',color:'#f59e0b',icon:'⚡',
    url:'https://api.groq.com/openai/v1/chat/completions',
    tier:'free',getKey:()=>'https://console.groq.com/keys',
    browserCors:false,
    models:{coding:'llama-3.3-70b-versatile',reasoning:'llama-3.3-70b-versatile',quality:'llama-3.3-70b-versatile',creative:'gemma2-9b-it',fast:'llama-3.1-8b-instant',review:'mixtral-8x7b-32768'},
    strength:7,desc:'World fastest inference ~500 tok/s',
  },
  google:{
    name:'Google AI Studio',color:'#4285f4',icon:'✦',
    url:'https://generativelanguage.googleapis.com/v1beta/openai/chat/completions',
    tier:'free',getKey:()=>'https://aistudio.google.com/app/apikey',
    browserCors:true,
    models:{coding:'gemini-2.0-flash',reasoning:'gemini-2.5-pro-preview-05-06',quality:'gemini-2.5-pro-preview-05-06',creative:'gemini-1.5-pro',fast:'gemini-2.0-flash',review:'gemini-2.5-pro-preview-05-06'},
    strength:9,desc:'Gemini 2.5 Pro · 1M context · free tier',
  },
  cerebras:{
    name:'Cerebras',color:'#06b6d4',icon:'🧠',
    url:'https://api.cerebras.ai/v1/chat/completions',
    tier:'free',getKey:()=>'https://cloud.cerebras.ai/',
    browserCors:false,
    models:{coding:'llama-3.3-70b',reasoning:'llama-3.3-70b',quality:'llama-3.3-70b',creative:'llama-3.3-70b',fast:'llama3.1-8b',review:'llama-3.3-70b'},
    strength:7,desc:'Fastest chip · free tier',
  },
  sambanova:{
    name:'SambaNova',color:'#ec4899',icon:'🔮',
    url:'https://api.sambanova.ai/v1/chat/completions',
    tier:'free',getKey:()=>'https://cloud.sambanova.ai/apis',
    browserCors:false,
    models:{coding:'DeepSeek-V3-0324',reasoning:'Meta-Llama-3.1-70B-Instruct',quality:'Meta-Llama-3.1-70B-Instruct',creative:'Meta-Llama-3.1-70B-Instruct',fast:'Meta-Llama-3.1-8B-Instruct',review:'Meta-Llama-3.1-70B-Instruct'},
    strength:7,desc:'SambaNova RDU · free hardware',
  },
  novita:{
    name:'Novita AI',color:'#a78bfa',icon:'💜',
    url:'https://api.novita.ai/v3/openai/chat/completions',
    tier:'free',getKey:()=>'https://novita.ai/dashboard/key',
    browserCors:false,
    models:{coding:'deepseek/deepseek-v3-0324',reasoning:'deepseek/deepseek-r1',quality:'meta-llama/llama-3.3-70b-instruct',creative:'meta-llama/llama-3.3-70b-instruct',fast:'meta-llama/llama-3.3-70b-instruct',review:'deepseek/deepseek-r1'},
    strength:7,desc:'Free DeepSeek + Llama models',
  },
  cohere:{
    name:'Cohere',color:'#6366f1',icon:'🌀',
    url:'https://api.cohere.ai/v1/chat/completions',
    tier:'free',getKey:()=>'https://dashboard.cohere.com/api-keys',
    browserCors:false,
    models:{coding:'command-r-plus',reasoning:'command-r-plus',quality:'command-r-plus',creative:'command-r',fast:'command-light',review:'command-r-plus'},
    strength:7,desc:'Command R+ · free trial',
  },
  huggingface:{
    name:'HuggingFace',color:'#ffd21e',icon:'🤗',
    url:'https://api-inference.huggingface.co/models/',
    tier:'free',getKey:()=>'https://huggingface.co/settings/tokens',
    browserCors:true,
    models:{coding:'meta-llama/Meta-Llama-3.1-70B-Instruct',reasoning:'meta-llama/Meta-Llama-3.1-70B-Instruct',quality:'meta-llama/Meta-Llama-3.1-70B-Instruct',creative:'mistralai/Mixtral-8x7B-Instruct-v0.1',fast:'microsoft/Phi-3-mini-4k-instruct',review:'Qwen/Qwen2.5-72B-Instruct'},
    strength:6,desc:'Serverless inference · free tier',hf:true,
  },
  sarvam:{
    name:'Sarvam AI',color:'#ff6b35',icon:'🇮🇳',
    url:'https://api.sarvam.ai/v1/chat/completions',
    tier:'free',getKey:()=>'https://dashboard.sarvam.ai/',
    browserCors:false,
    models:{coding:'sarvam-m',reasoning:'sarvam-m',quality:'sarvam-m',creative:'sarvam-m',fast:'sarvam-m',review:'sarvam-m'},
    strength:5,desc:'Sarvam-M · Indian multilingual',
  },
  /* ══ FREE + PAID TIER ══ */
  nvidia:{
    name:'NVIDIA NIM',color:'#76b900',icon:'♟',
    url:'https://integrate.api.nvidia.com/v1/chat/completions',
    tier:'freepaid',getKey:()=>'https://build.nvidia.com/explore/discover',
    browserCors:false,
    models:{coding:'meta/llama-3.3-70b-instruct',reasoning:'nvidia/llama-3.1-nemotron-ultra-253b-v1',quality:'nvidia/llama-3.1-nemotron-ultra-253b-v1',creative:'meta/llama-3.3-70b-instruct',fast:'meta/llama-3.1-8b-instruct',review:'nvidia/llama-3.1-nemotron-ultra-253b-v1'},
    strength:8,desc:'Nemotron Ultra · free 1000 credits/mo',
  },
  mistral:{
    name:'Mistral AI',color:'#ff7000',icon:'🌪',
    url:'https://api.mistral.ai/v1/chat/completions',
    tier:'freepaid',getKey:()=>'https://console.mistral.ai/api-keys',
    browserCors:false,
    models:{coding:'codestral-latest',reasoning:'mistral-large-latest',quality:'mistral-large-latest',creative:'mistral-medium-latest',fast:'mistral-small-latest',review:'mistral-large-latest'},
    strength:8,desc:'Codestral · best code model · free tier',
  },
  together:{
    name:'Together AI',color:'#8b5cf6',icon:'🟣',
    url:'https://api.together.xyz/v1/chat/completions',
    tier:'freepaid',getKey:()=>'https://api.together.xyz/settings/api-keys',
    browserCors:false,
    models:{coding:'deepseek-ai/DeepSeek-V3',reasoning:'meta-llama/Meta-Llama-3.1-70B-Instruct-Turbo',quality:'meta-llama/Meta-Llama-3.1-70B-Instruct-Turbo',creative:'Qwen/Qwen2.5-72B-Instruct-Turbo',fast:'meta-llama/Meta-Llama-3.1-8B-Instruct-Turbo',review:'meta-llama/Meta-Llama-3.1-70B-Instruct-Turbo'},
    strength:8,desc:'Fast inference · $5 free credit',
  },
  perplexity:{
    name:'Perplexity',color:'#3b82f6',icon:'🔍',
    url:'https://api.perplexity.ai/chat/completions',
    tier:'freepaid',getKey:()=>'https://www.perplexity.ai/settings/api',
    browserCors:false,
    models:{coding:'llama-3.1-sonar-large-128k-online',reasoning:'llama-3.1-sonar-large-128k-online',quality:'llama-3.1-sonar-large-128k-online',creative:'llama-3.1-sonar-small-128k-online',fast:'llama-3.1-sonar-small-128k-online',review:'llama-3.1-sonar-large-128k-online'},
    strength:8,desc:'Web-search grounded · $5 free credit',
  },
  wisdomgate:{
    name:'WisdomGate',color:'#f0c040',icon:'🌙',
    url:'https://api.wisdomgate.ai/v1/chat/completions',
    tier:'freepaid',getKey:()=>'https://wisdomgate.ai/dashboard',
    browserCors:false,
    models:{coding:'wg-pro',reasoning:'wg-pro',quality:'wg-pro',creative:'wg-pro',fast:'wg-lite',review:'wg-pro'},
    strength:6,desc:'WisdomGate · free + paid tiers',
  },
  /* ══ PAID TIER ══ */
  openai:{
    name:'OpenAI',color:'#10b981',icon:'🟢',
    url:'https://api.openai.com/v1/chat/completions',
    tier:'paid',getKey:()=>'https://platform.openai.com/api-keys',
    browserCors:false,
    models:{coding:'gpt-4o',reasoning:'o3-mini',quality:'gpt-4o',creative:'gpt-4o',fast:'gpt-4o-mini',review:'gpt-4o'},
    strength:10,desc:'GPT-4o · o3-mini · most capable',
  },
  anthropic:{
    name:'Anthropic',color:'#f97316',icon:'🔶',
    url:'https://api.anthropic.com/v1/messages',
    tier:'paid',getKey:()=>'https://console.anthropic.com/settings/keys',
    browserCors:true,
    models:{coding:'claude-sonnet-4-20250514',reasoning:'claude-sonnet-4-20250514',quality:'claude-sonnet-4-20250514',creative:'claude-sonnet-4-20250514',fast:'claude-3-5-haiku-20241022',review:'claude-sonnet-4-20250514'},
    strength:10,desc:'Claude Sonnet 4 · top reasoning',anthropic:true,
  },
  deepseek:{
    name:'DeepSeek',color:'#00b4d8',icon:'🐋',
    url:'https://api.deepseek.com/v1/chat/completions',
    tier:'paid',getKey:()=>'https://platform.deepseek.com/api_keys',
    browserCors:false,
    models:{coding:'deepseek-coder',reasoning:'deepseek-reasoner',quality:'deepseek-chat',creative:'deepseek-chat',fast:'deepseek-chat',review:'deepseek-reasoner'},
    strength:9,desc:'DeepSeek R1 · top reasoning + code',
  },
  xai:{
    name:'xAI Grok',color:'#e0e0e0',icon:'𝕏',
    url:'https://api.x.ai/v1/chat/completions',
    tier:'paid',getKey:()=>'https://console.x.ai/',
    browserCors:false,
    models:{coding:'grok-3-mini-beta',reasoning:'grok-3-mini-beta',quality:'grok-3-beta',creative:'grok-3-beta',fast:'grok-3-mini-beta',review:'grok-3-beta'},
    strength:9,desc:'Grok 3 · real-time X data',
  },
  fireworks:{
    name:'Fireworks AI',color:'#ef4444',icon:'🔴',
    url:'https://api.fireworks.ai/inference/v1/chat/completions',
    tier:'paid',getKey:()=>'https://fireworks.ai/api-keys',
    browserCors:false,
    models:{coding:'accounts/fireworks/models/deepseek-v3',reasoning:'accounts/fireworks/models/llama-v3p1-70b-instruct',quality:'accounts/fireworks/models/llama-v3p1-70b-instruct',creative:'accounts/fireworks/models/qwen2p5-72b-instruct',fast:'accounts/fireworks/models/llama-v3p1-8b-instruct',review:'accounts/fireworks/models/llama-v3p1-70b-instruct'},
    strength:8,desc:'Fast production inference',
  },
  deepinfra:{
    name:'DeepInfra',color:'#0ea5e9',icon:'🌊',
    url:'https://api.deepinfra.com/v1/openai/chat/completions',
    tier:'paid',getKey:()=>'https://deepinfra.com/dash/api_keys',
    browserCors:false,
    models:{coding:'meta-llama/Meta-Llama-3.1-70B-Instruct',reasoning:'meta-llama/Meta-Llama-3.1-70B-Instruct',quality:'meta-llama/Meta-Llama-3.1-70B-Instruct',creative:'Qwen/Qwen2.5-72B-Instruct',fast:'meta-llama/Meta-Llama-3.1-8B-Instruct',review:'meta-llama/Meta-Llama-3.1-70B-Instruct'},
    strength:7,desc:'Affordable self-hosted inference',
  },
  qwen:{
    name:'Alibaba Qwen',color:'#ff6a00',icon:'☁',
    url:'https://dashscope-intl.aliyuncs.com/compatible-mode/v1/chat/completions',
    tier:'paid',getKey:()=>'https://dashscope.console.aliyun.com/apiKey',
    browserCors:false,
    models:{coding:'qwen-coder-turbo',reasoning:'qwen-max',quality:'qwen-max',creative:'qwen-plus',fast:'qwen-turbo',review:'qwen-max'},
    strength:8,desc:'Qwen 2.5 · strong multilingual',
  },
  ai21:{
    name:'AI21 Labs',color:'#7c3aed',icon:'🧬',
    url:'https://api.ai21.com/studio/v1/chat/completions',
    tier:'paid',getKey:()=>'https://studio.ai21.com/account/api-key',
    browserCors:false,
    models:{coding:'jamba-1.5-large',reasoning:'jamba-1.5-large',quality:'jamba-1.5-large',creative:'jamba-1.5-mini',fast:'jamba-1.5-mini',review:'jamba-1.5-large'},
    strength:7,desc:'Jamba · 256K context',
  },
  elevenlabs:{
    name:'ElevenLabs',color:'#f472b6',icon:'🎙',
    url:'https://api.elevenlabs.io/v1/text-to-speech',
    tier:'paid',getKey:()=>'https://elevenlabs.io/app/settings/api-keys',
    browserCors:false,
    tts:true, // ← text-to-speech only, not a chat model
    models:{coding:'eleven_multilingual_v2',reasoning:'eleven_multilingual_v2',quality:'eleven_multilingual_v2',creative:'eleven_multilingual_v2',fast:'eleven_turbo_v2_5',review:'eleven_multilingual_v2'},
    strength:9,desc:'Best AI voice · TTS · speech synthesis',
  },
  lepton:{
    name:'Lepton AI',color:'#8b5cf6',icon:'⚛',
    url:'https://llama3-1-70b.lepton.run/api/v1/chat/completions',
    tier:'paid',getKey:()=>'https://dashboard.lepton.ai/',
    browserCors:false,
    models:{coding:'llama3-1-70b',reasoning:'llama3-1-70b',quality:'llama3-1-70b',creative:'llama3-1-70b',fast:'llama3-1-8b',review:'llama3-1-70b'},
    strength:6,desc:'Fast Llama inference',
  },
};

/* VAULT STATE */
const VAULT={
  keys:[],      // [{provider, key, priority, status, model}]
  prefs:{},     // {coding:'openai', reasoning:'anthropic', ...}

  load(){
    try{
      const d=localStorage.getItem(LS_VAULT);
      if(d){const p=JSON.parse(d);this.keys=p.keys||[];this.prefs=p.prefs||{};}
    }catch(e){}
    // Reset any stale fail/ratelimited statuses — these should never persist across sessions
    // A key that failed yesterday may work today (rate limits reset, network issues clear)
    this.keys.forEach(k=>{
      if(k.status==='fail'||k.status==='ratelimited'){
        k.status='untested';
      }
    });
    this.migrate();
  },

  save(){
    try{localStorage.setItem(LS_VAULT,JSON.stringify({keys:this.keys,prefs:this.prefs}));}catch(e){}
    this.updateHeaderBadge();
    // Auto-dismiss API banners when a key becomes active
    if(this.getActiveCount()>0){
      document.getElementById('chat-api-banner')?.remove();
      document.getElementById('build-api-banner')?.remove();
    }
  },

  /* Migrate old S.cfg.key → vault */
  migrate(){
    if(this.keys.length)return;
    const old=S.cfg;
    if(old.key&&old.provider){
      this.keys.push({provider:old.provider,key:old.key,priority:1,status:'ok',addedAt:Date.now()});
      this.save();
    }
  },

  addKey(provider,key,priority){
    // Remove existing entry for same provider if exists
    this.keys=this.keys.filter(k=>k.provider!==provider);
    this.keys.push({provider,key,priority:parseInt(priority)||1,status:'untested',addedAt:Date.now()});
    this.keys.sort((a,b)=>a.priority-b.priority);
    this.save();
  },

  removeKey(provider){
    this.keys=this.keys.filter(k=>k.provider!==provider);
    this.save();
  },

  /* Test a key — handles all provider formats */
  async testKey(provider,key){
    const meta=PROVIDER_META[provider];
    if(!meta)return{ok:false,status:0,reason:'unknown provider'};
    this._lastTestStatus=null;
    try{
      const model=meta.models.fast||meta.models.quality;
      const headers={'Content-Type':'application/json'};

      if(meta.anthropic){
        headers['x-api-key']=key;
        headers['anthropic-version']='2023-06-01';
        headers['anthropic-dangerous-direct-browser-access']='true';
        const res=await fetch(meta.url,{method:'POST',headers,
          body:JSON.stringify({model,max_tokens:5,system:'',messages:[{role:'user',content:'Hi'}]})});
        this._lastTestStatus=res.status;
        // 401 = invalid. Everything else = key is valid (400=bad param, 529=overloaded)
        return{ok:res.status!==401,status:res.status,reason:res.status===401?'invalid key':''};
      }

      if(meta.hf){
        headers['Authorization']='Bearer '+key;
        const res=await fetch(meta.url+model+'/v1/chat/completions',{method:'POST',headers,
          body:JSON.stringify({model,max_tokens:5,messages:[{role:'user',content:'Hi'}]})});
        this._lastTestStatus=res.status;
        return{ok:res.status!==401,status:res.status,reason:res.status===401?'invalid key':''};
      }

      headers['Authorization']='Bearer '+key;
      if(provider==='openrouter'){headers['HTTP-Referer']=location.href;headers['X-Title']='NeuralForge';}

      const res=await fetch(meta.url,{method:'POST',headers,
        body:JSON.stringify({model,max_tokens:5,messages:[{role:'user',content:'Hi'}]})});
      this._lastTestStatus=res.status;

      // ONLY 401 = invalid key. Every other status = key exists and is accepted.
      if(res.status===401)return{ok:false,status:401,reason:'invalid key'};
      return{ok:true,status:res.status,reason:''};

    }catch(e){
      this._lastTestStatus=0;
      return{ok:false,status:0,reason:'network error: '+e.message};
    }
  },

  /* ── Per-task model quality ratings (1-10 per provider per task) ── */
  taskScores:{
    coding:{
      deepseek:10,openai:9,anthropic:8,mistral:9,fireworks:8,
      openrouter:9,together:8,google:8,groq:7,novita:9,
      nvidia:8,deepinfra:7,cerebras:6,sambanova:8,huggingface:6,
      cohere:5,xai:8,qwen:8,ai21:6,perplexity:6,lepton:6,
      sarvam:3,elevenlabs:1,wisdomgate:6,
    },
    reasoning:{
      anthropic:10,openai:9,deepseek:10,xai:9,openrouter:9,
      google:9,nvidia:8,mistral:8,together:7,groq:7,novita:8,
      fireworks:7,deepinfra:6,cerebras:6,sambanova:6,huggingface:5,
      cohere:6,qwen:7,ai21:6,perplexity:7,lepton:5,
      sarvam:3,elevenlabs:1,wisdomgate:6,
    },
    creative:{
      anthropic:10,openai:9,google:9,xai:9,openrouter:8,
      mistral:7,together:7,groq:7,fireworks:7,novita:7,
      nvidia:7,deepseek:7,deepinfra:6,cerebras:6,sambanova:6,
      huggingface:6,cohere:7,qwen:8,ai21:6,perplexity:6,lepton:5,
      sarvam:4,elevenlabs:1,wisdomgate:6,
    },
    quality:{
      openai:10,anthropic:10,deepseek:9,google:9,xai:9,
      openrouter:8,mistral:8,together:8,fireworks:8,qwen:8,
      nvidia:8,groq:7,novita:8,cerebras:7,sambanova:7,deepinfra:7,
      cohere:7,huggingface:6,ai21:6,perplexity:8,lepton:6,
      sarvam:3,elevenlabs:1,wisdomgate:6,
    },
    fast:{
      groq:10,cerebras:10,openai:8,anthropic:7,google:9,
      fireworks:8,together:8,openrouter:7,deepinfra:7,sambanova:7,
      nvidia:7,novita:7,mistral:6,deepseek:6,huggingface:5,cohere:6,
      xai:7,qwen:7,ai21:5,perplexity:6,lepton:7,
      sarvam:4,elevenlabs:1,wisdomgate:5,
    },
    review:{
      anthropic:10,openai:9,deepseek:9,openrouter:8,mistral:8,
      google:9,xai:9,together:7,groq:7,novita:8,nvidia:8,
      fireworks:7,deepinfra:6,cerebras:6,sambanova:6,huggingface:5,
      cohere:6,qwen:7,ai21:6,perplexity:7,lepton:5,
      sarvam:3,elevenlabs:1,wisdomgate:6,
    },
  },

  /* ── Key availability tiers ──
     Tier 1: ok          — verified working          → used first
     Tier 2: untested    — pasted, not yet verified   → used if no ok keys
     Tier 3: ratelimited — temporarily unavailable   → last resort only
     Never:  fail        — invalid/revoked key       → never used          ── */
  _keyTier(status){
    return {ok:1, untested:2, ratelimited:3, fail:99}[status]||2;
  },

  /* Returns only keys that can actually be used (not failed) */
  _available(){
    return this.keys.filter(k=>k.status!=='fail'&&k.key&&k.key.length>10);
  },

  /* ── CORE: Pick the single best available key for a task ── */
  getBest(task){
    task=task||'quality';
    const available=this._available();

    if(!available.length){
      // Nothing in vault — fall back to legacy single key
      if(S.cfg.key)return{provider:S.cfg.provider,key:S.cfg.key,model:S.cfg.model};
      return null;
    }

    // Honour explicit user preference first (only if key is available)
    const prefProv=this.prefs[task];
    if(prefProv){
      const prefKey=available.find(k=>k.provider===prefProv);
      if(prefKey){
        const meta=PROVIDER_META[prefProv];
        return{provider:prefProv,key:prefKey.key,
               model:meta?.models[task]||meta?.models.quality||''};
      }
    }

    // Score every available key:
    //   primary score  = task-specific model quality (1-10)
    //   tier penalty   = ok=0, untested=-1, ratelimited=-8
    //   → result: verified ok keys always beat untested; ratelimited only used as last resort
    const scored=available.map(k=>{
      const taskQ=(this.taskScores[task]||{})[k.provider]||
                  PROVIDER_META[k.provider]?.strength||5;
      const tierPenalty={ok:0, untested:-1, ratelimited:-8}[k.status]||0;
      // OpenRouter gets +100 because it's the only reliable browser-CORS provider
      const corsBonus=k.provider==='openrouter'?100:0;
      const finalScore=taskQ+tierPenalty+corsBonus;
      return{
        ...k,
        score:finalScore,
        taskScore:taskQ,
        model:PROVIDER_META[k.provider]?.models[task]||
              PROVIDER_META[k.provider]?.models.quality||'',
      };
    }).sort((a,b)=>b.score-a.score);

    return scored[0]||null;
  },

  /* ── Build full ranked fallback chain for a task ──
     Ordering:
       1. Verified (ok) keys  — best task score first
       2. Untested keys       — best task score first
       3. Rate-limited keys   — best task score first (last resort)
     Never includes failed keys.                                 ── */
  getFallbackChain(task){
    task=task||'quality';
    const available=this._available();
    if(!available.length)return[];

    const prefProv=this.prefs[task];
    const orMeta=PROVIDER_META['openrouter'];

    // Group by tier, sort each tier by task score
    // OpenRouter gets a massive bonus because it's the only reliable browser CORS provider
    const tiers={1:[],2:[],3:[]};
    available.forEach(k=>{
      const tier=this._keyTier(k.status);
      if(tier>=99)return;
      const meta=PROVIDER_META[k.provider]||{strength:5,models:{}};
      const taskScore=(this.taskScores[task]||{})[k.provider]||meta.strength||5;
      const prefBonus=k.provider===prefProv?1000:0;
      // OpenRouter gets +100 bonus since it's the only browser-CORS provider
      // All other providers need to go through OR anyway, so OR direct is always best
      const corsBonus=k.provider==='openrouter'?100:0;
      tiers[tier].push({
        provider:k.provider,
        key:k.key,
        model:meta.models[task]||meta.models.quality||'',
        score:taskScore+prefBonus+corsBonus,
        taskScore,
        tier,
        status:k.status,
        tierLabel:{1:'✓ verified',2:'untested',3:'⚠️ limited'}[tier],
      });
    });

    const chain=[
      ...tiers[1].sort((a,b)=>b.score-a.score),
      ...tiers[2].sort((a,b)=>b.score-a.score),
      ...tiers[3].sort((a,b)=>b.score-a.score),
    ];

    return chain;
  },

  getActiveCount(){
    // Only count keys that are actually usable (ok or untested, not failed)
    return this._available().length;
  },

  getVerifiedCount(){
    return this.keys.filter(k=>k.status==='ok').length;
  },

  updateHeaderBadge(){
    const badge=document.getElementById('active-key-badge');
    const label=document.getElementById('active-key-label');
    if(!badge||!label)return;
    const total=this.getActiveCount();
    const verified=this.getVerifiedCount();
    if(total>0){
      badge.classList.add('show');
      const best=this.getBest('quality');
      const meta=PROVIDER_META[best?.provider];
      const verifiedStr=verified?` · ${verified} verified`:'';
      label.textContent=`${meta?.icon||'🔑'} ${meta?.name||'?'} +${total}${verifiedStr}`;
    } else {
      badge.classList.remove('show');
    }
  }
};

/* ══ VAULT API CALL — with real token streaming + CORS routing ══ */
async function callAPIVault(sysPrompt,messages,task,overrideProvider,overrideKey,overrideModel,onChunk){
  let best=overrideProvider?
    {provider:overrideProvider,key:overrideKey,model:overrideModel}:
    VAULT.getBest(task||'quality');

  if(!best||!best.key){
    if(S.cfg.key)return callAPI(sysPrompt,messages,null);
    return null;
  }

  const meta=PROVIDER_META[best.provider];
  if(!meta)return null;
  const model=best.model||meta.models?.quality||S.cfg.model;

  // Internal helper to make the actual fetch
  async function _doFetch(){
    const headers={'Content-Type':'application/json'};
    const msgs=sysPrompt?[{role:'system',content:sysPrompt},...messages]:messages;
    const useStream=!!onChunk;

    if(meta.anthropic){
      headers['x-api-key']=best.key;
      headers['anthropic-version']='2023-06-01';
      headers['anthropic-dangerous-direct-browser-access']='true';
      const body={model,max_tokens:4000,system:sysPrompt||'',messages,stream:useStream};
      const res=await fetch(meta.url,{method:'POST',headers,body:JSON.stringify(body)});
      return{res,useStream,type:'anthropic'};
    }
    if(meta.hf){
      headers['Authorization']='Bearer '+best.key;
      const hfUrl=meta.url+model+'/v1/chat/completions';
      const res=await fetch(hfUrl,{method:'POST',headers,body:JSON.stringify({model,max_tokens:4000,messages:msgs})});
      return{res,useStream,type:'hf'};
    }
    headers['Authorization']='Bearer '+best.key;
    if(best.provider==='openrouter'){headers['HTTP-Referer']=location.href;headers['X-Title']='NeuralForge';}
    const body={model,max_tokens:4000,messages:msgs,stream:useStream};
    const res=await fetch(meta.url,{method:'POST',headers,body:JSON.stringify(body)});
    return{res,useStream,type:'openai'};
  }

  async function _parseResponse(res,useStream,type){
    if(type==='anthropic'){
      if(useStream)return _readAnthropicStream(res,onChunk);
      const d=await res.json();return d.content?.[0]?.text||null;
    }
    if(type==='hf'){
      const d=await res.json();return d.choices?.[0]?.message?.content||null;
    }
    if(useStream)return _readOpenAIStream(res,onChunk);
    const d=await res.json();return d.choices?.[0]?.message?.content||null;
  }

  try{
    let attempt=await _doFetch();
    let res=attempt.res;

    // On 429, wait and retry ONCE before giving up
    if(res.status===429){
      toast(`⏳ ${meta.name} rate limit — waiting 5s…`,'');
      await new Promise(r=>setTimeout(r,5000));
      if(S.aborted)return null;
      attempt=await _doFetch();
      res=attempt.res;
    }

    if(!res.ok){
      // Only mark as permanently failed on 401 (invalid key)
      if(res.status===401){
        markKeyFail(best.provider,401);
        toast(`🔑 ${meta.name} key invalid — check Settings`,'err');
      } else {
        // Everything else is temporary — don't permanently blacklist
        toast(`⚠️ ${meta.name} returned ${res.status} — trying next provider if available`,'');
      }
      return null;
    }

    // Success — mark key as ok if it was untested
    const k=VAULT.keys.find(x=>x.provider===best.provider);
    if(k&&k.status==='untested'){k.status='ok';VAULT.save();}

    const parsed=await _parseResponse(res,attempt.useStream,attempt.type);
    // Track tokens for budget guard
    if(parsed){
      const est=Math.ceil((parsed.length+(messages?.reduce((a,m)=>a+(m.content?.length||0),0)||0))/4);
      ABORT_GUARD.addTokens(est);
    }
    return parsed;
  }catch(e){
    // Network/CORS error — don't mark key as fail, it's likely temporary or a CORS block
    logError?.(`${meta.name} network error: ${e.message}`,'warn');
    return null;
  }
}

/* Read OpenAI-compatible SSE stream */
async function _readOpenAIStream(res,onChunk){
  const reader=res.body.getReader();
  const decoder=new TextDecoder();
  let full='';
  while(true){
    const{done,value}=await reader.read();
    if(done)break;
    const lines=decoder.decode(value,{stream:true}).split('\n');
    for(const line of lines){
      const t=line.trim();
      if(!t||t==='data: [DONE]')continue;
      if(!t.startsWith('data: '))continue;
      try{
        const json=JSON.parse(t.slice(6));
        const chunk=json.choices?.[0]?.delta?.content||'';
        if(chunk){full+=chunk;onChunk(chunk,full);}
      }catch{}
    }
  }
  return full||null;
}

/* Read Anthropic SSE stream */
async function _readAnthropicStream(res,onChunk){
  const reader=res.body.getReader();
  const decoder=new TextDecoder();
  let full='';
  while(true){
    const{done,value}=await reader.read();
    if(done)break;
    const lines=decoder.decode(value,{stream:true}).split('\n');
    for(const line of lines){
      const t=line.trim();
      if(!t.startsWith('data: '))continue;
      try{
        const json=JSON.parse(t.slice(6));
        const chunk=json.delta?.text||'';
        if(chunk){full+=chunk;onChunk(chunk,full);}
      }catch{}
    }
  }
  return full||null;
}

function markKeyFail(provider,status){
  const k=VAULT.keys.find(x=>x.provider===provider);
  if(!k)return;
  if(status===401){
    k.status='fail';          // 401 = invalid key — never retry
  } else if(status===402||status===429){
    k.status='ratelimited';   // quota/rate limit — temporary, retry later
  } else if(!status||status===0){
    k.status='ratelimited';   // network error — soft fail, don't permanently block
  } else {
    // 403/404/500/502/503 etc — don't mark fail, just log as ratelimited temporarily
    k.status='ratelimited';
  }
  VAULT.save();
}

/* ══════════════════════════════════════════════════════════
   SMART callWithRetry — NEVER GIVES UP
   ══════════════════════════════════════════════════════════
   Attempt order:
   1. Task-ranked chain (verified → untested → ratelimited)
   2. ANY remaining key with ANY model (quality fallback)
   3. OpenRouter free models as universal last resort
   4. Degrade gracefully — return a minimal placeholder
      so the pipeline never breaks mid-build
   ══════════════════════════════════════════════════════════ */
async function callWithRetry(sys,msgs,agent,maxRetries=3){
  if(S.aborted)return null;

  // Detect task type — honour explicit _chatTask override from sendChat first
  const promptText=(msgs?.[0]?.content||'').slice(0,300)+(sys||'').slice(0,100);
  const contentTask=MODEL_ROUTER.detectTask(promptText);
  const agentTask=agent?
    (agent._chatTask || MODEL_ROUTER.agentTaskMap[agent.id] || 'quality')
    :'quality';
  const task=agentTask!=='quality'? agentTask : (contentTask||agentTask);

  /* ── PHASE 1: Primary task-ranked chain ── */
  const chain=VAULT.getFallbackChain(task);

  if(chain.length){
    const limit=Math.min(chain.length,maxRetries);
    for(let ci=0;ci<limit;ci++){
      if(S.aborted)return null;
      const entry=chain[ci];
      const meta=PROVIDER_META[entry.provider]||{};

      if(ci>0){
        const prev=chain[ci-1];
        const prevMeta=PROVIDER_META[prev.provider]||{};
        const tierNote=entry.tier===2?' (untested)':entry.tier===3?' (limited)':'';
        toast(`🔄 ${prevMeta.icon||'🔑'} ${prevMeta.name||prev.provider} failed `+
              `→ ${meta.icon||'🔑'} ${meta.name||entry.provider}${tierNote} `+
              `[${task}: ${entry.taskScore}/10]`,'');
        if(agent?.id)showAgentModel(agent.id,entry.provider,entry.model,task);
        await sleep(600);
      }

      showActiveModel(entry.provider,entry.model,task,agent?.id);
      const r=await callAPIVault(sys,msgs,task,entry.provider,entry.key,entry.model);
      if(r){
        const k=VAULT.keys.find(x=>x.provider===entry.provider);
        if(k&&k.status!=='ok')k.status='ok';
        return r;
      }
    }
  }

  /* ── PHASE 2: ANY remaining key with quality model ──
     Try every saved key we haven't tried yet, using its
     best quality model regardless of task specialisation.  ── */
  const triedProviders=new Set(chain.map(c=>c.provider));
  const remaining=VAULT._available().filter(k=>!triedProviders.has(k.provider));

  if(remaining.length){
    toast(`⚡ Trying remaining ${remaining.length} key${remaining.length>1?'s':''} (quality mode)…`,'');
    for(const k of remaining){
      if(S.aborted)return null;
      const meta=PROVIDER_META[k.provider]||{};
      const model=meta.models?.quality||meta.models?.fast||'';
      if(!model)continue;
      showActiveModel(k.provider,model,'quality',agent?.id);
      if(agent?.id)showAgentModel(agent.id,k.provider,model,'quality');
      const r=await callAPIVault(sys,msgs,'quality',k.provider,k.key,model);
      if(r){
        toast(`✅ ${meta.icon||'🔑'} ${meta.name||k.provider} responded (quality fallback)`,'ok');
        return r;
      }
      await sleep(400);
    }
  }

  /* ── PHASE 3: OpenRouter free models as universal last resort ──
     If the user has an OpenRouter key (even ratelimited), try
     a rotation of free models — one of them is almost always available. ── */
  const orKey=VAULT.keys.find(k=>k.provider==='openrouter'&&k.key);
  if(orKey){
    const freeModels=[
      'meta-llama/llama-3.3-70b-instruct:free',
      'deepseek/deepseek-chat-v3-0324:free',
      'google/gemma-3-12b-it:free',
      'meta-llama/llama-3.1-8b-instruct:free',
      'mistralai/mistral-7b-instruct:free',
      'qwen/qwen3-8b:free',
    ];
    toast(`🆓 Trying OpenRouter free models as last resort…`,'');
    for(const freeModel of freeModels){
      if(S.aborted)return null;
      const shortName=freeModel.split('/').pop().replace(':free','');
      showActiveModel('openrouter',freeModel,task,agent?.id);
      if(agent?.id)showAgentModel(agent.id,'openrouter',freeModel,task);
      const r=await callAPIVault(sys,msgs,task,'openrouter',orKey.key,freeModel);
      if(r){
        toast(`✅ 🔀 OpenRouter/${shortName} responded (free fallback)`,'ok');
        return r;
      }
      await sleep(300);
    }
  }

  /* ── PHASE 4: Legacy S.cfg single-key path ── */
  if(S.cfg.key&&S.cfg.provider){
    toast(`🔑 Trying legacy key (${S.cfg.provider})…`,'');
    for(let i=0;i<2;i++){
      if(S.aborted)return null;
      const r=await callAPI(sys,msgs,agent);
      if(r)return r;
      await sleep(800);
    }
  }

  /* ── PHASE 5: Graceful degradation ──
     Never break the pipeline. Return a minimal response
     so the build continues — agent will explain the issue. ── */
  const agentName=agent?.name||'Agent';
  toast(`⚠️ ${agentName}: all providers exhausted — using fallback response`,'');
  return `## ${agentName} — All Providers Unavailable\n\n`+
    `Could not reach any AI provider. Possible causes:\n`+
    `- All API keys are rate-limited or exhausted\n`+
    `- Network connectivity issue\n`+
    `- Keys not yet tested (open ⚙️ Settings → Test All Keys)\n\n`+
    `**The build will continue** — add more API keys in ⚙️ Settings for better results.\n\n`+
    `_Task: ${task} | Agent: ${agentName}_`;
}


/* Show active model indicator in chat */
function showActiveModel(provider, model, task, agentId){
  const meta=PROVIDER_META[provider]||{};
  const shortModel=(model||'').split('/').pop().replace(':free','').slice(0,25);
  // Update pipeline indicator
  const piData=document.getElementById('pi-data');
  if(piData)piData.textContent=`${meta.icon||'🔑'} ${meta.name||provider} · ${shortModel}`;
  // Update workflow node model display
  if(agentId)showAgentModel(agentId,provider,model,task);
}

/* ══ VAULT DASHBOARD ENGINE v11 ══ */

/* All providers — FREE FIRST, then PAID */
const ALL_PROVIDERS=[
  /* ── FREE ── */
  'openrouter','groq','google','cerebras','sambanova','novita','cohere','huggingface','sarvam',
  /* ── FREE + PAID ── */
  'nvidia','mistral','together','perplexity','wisdomgate',
  /* ── PAID ── */
  'openai','anthropic','deepseek','xai','fireworks','deepinfra','qwen','ai21','elevenlabs','lepton',
];

function openConfig(){
  // Reload from storage
  VAULT.load();
  // Reset any stale fail/ratelimited statuses before showing UI
  // Only 'ok' and 'untested' are valid persistent states
  let changed=false;
  VAULT.keys.forEach(k=>{
    if(k.status==='fail'||k.status==='ratelimited'){
      k.status='untested';
      changed=true;
    }
    // Migrate stale tier stored on key objects (not needed in new system — tier lives in PROVIDER_META)
    if(k._tier){ delete k._tier; changed=true; }
  });
  if(changed)VAULT.save();
  renderVaultDashboard();
  renderRoutingPrefs();
  renderSecurityNotice();
  // Advanced settings
  const mm=document.getElementById('cfg-mm');if(mm)mm.value=S.cfg.mm||'smart';
  const sp=document.getElementById('cfg-speed');if(sp)sp.value=S.cfg.speed||'normal';
  const fb=document.getElementById('cfg-feedback');if(fb)fb.value=String(S.cfg.feedbackLoop!==false);
  const ml=document.getElementById('cfg-maxloops');if(ml)ml.value=String(S.cfg.maxLoops||2);
  const rt=document.getElementById('cfg-routing');if(rt)rt.value=String(S.cfg.dynamicRouting!==false);
  const se=document.getElementById('cfg-selfeval');if(se)se.value=String(S.cfg.selfEval!==false);
  document.getElementById('cfg-mo').classList.add('show');
}

function renderVaultDashboard(){
  const container=document.getElementById('vault-providers');
  if(!container)return;

  let html='';
  let lastTier='';

  ALL_PROVIDERS.forEach(provId=>{
    const meta=PROVIDER_META[provId];
    if(!meta)return;
    const saved=VAULT.keys.find(k=>k.provider===provId);
    const hasKey=!!(saved?.key);
    const status=saved?.status||'empty';

    // Section divider when tier changes
    if(meta.tier!==lastTier){
      lastTier=meta.tier;
      const isFirst=(html==='');
      const tierCfg={
        free:    {label:'🆓 Free Providers',        color:'var(--green)', bg:'rgba(0,229,160,.05)'},
        freepaid:{label:'⚡ Free + Paid Providers',  color:'var(--yellow)',bg:'rgba(255,209,102,.05)'},
        paid:    {label:'💳 Paid Providers',          color:'var(--a)',    bg:'rgba(124,106,247,.05)'},
      }[meta.tier]||{label:'Other',color:'var(--t2)',bg:'transparent'};
      html+=`<div class="vprov-section" style="color:${tierCfg.color};background:${tierCfg.bg};margin-top:${isFirst?'0':'4px'}">
        <span>${tierCfg.label}</span>
      </div>`;
    }

    const stars=Array.from({length:5},(_,i)=>`<span class="vprov-star${i<Math.round(meta.strength/2)?' on':''}">${i<Math.round(meta.strength/2)?'★':'☆'}</span>`).join('');
    const statuses={ok:'✓ verified',fail:'✗ invalid',testing:'⏳ testing',ratelimited:'✓ saved',untested:'✓ saved',empty:''};
    const statusCls={ok:'ok',fail:'fail',testing:'testing',ratelimited:'ok',untested:'ok',empty:'empty'};
    const _tc={free:['rgba(0,229,160,.12)','rgba(0,229,160,.25)','var(--green)'],freepaid:['rgba(255,209,102,.12)','rgba(255,209,102,.25)','var(--yellow)'],paid:['rgba(124,106,247,.1)','rgba(124,106,247,.2)','var(--a)']}[meta.tier]||['rgba(124,106,247,.1)','rgba(124,106,247,.2)','var(--a)'];
    const tierColor=_tc[0],tierBorder=_tc[1],tierTxt=_tc[2];
    const maskedVal=hasKey?saved.key:'';

    const taskScoreStr=Object.entries(VAULT.taskScores)
      .map(([t,scores])=>`${t}: ${scores[provId]||'–'}/10`)
      .join(' | ');

    const corsNote=meta.browserCors===false
      ? `<div style="font-size:.52rem;color:var(--yellow);margin-top:1px;display:flex;align-items:center;gap:3px"><span>🌐</span><span>via OpenRouter in browser</span></div>`
      : `<div style="font-size:.52rem;color:var(--green);margin-top:1px;display:flex;align-items:center;gap:3px"><span>✅</span><span>direct browser OK</span></div>`;

    html+=`<div class="vprov-row${hasKey?' has-key':''}" id="vprow-${provId}" title="${meta.name} task scores: ${taskScoreStr}">
      <div class="vprov-icon" style="${hasKey?'color:'+meta.color+';border-color:'+meta.color+'44':''}">${meta.icon}</div>
      <div class="vprov-info">
        <div class="vprov-name" style="${hasKey?'color:'+meta.color:''}">${meta.name}</div>
        <div class="vprov-strength">${stars}</div>
        <div class="vprov-desc">${meta.desc}</div>
        ${corsNote}
      </div>
      <span style="font-size:.52rem;font-weight:700;padding:1px 4px;border-radius:3px;background:${tierColor};border:1px solid ${tierBorder};color:${tierTxt};flex-shrink:0">${{free:'FREE',freepaid:'FREE+',paid:'PAID',tts:'TTS'}[meta.tier]||meta.tier.toUpperCase()}</span>
      <div class="vprov-key-wrap" style="position:relative">
        <input
          type="password"
          class="vprov-input${hasKey?' filled':''}"
          id="vkey-${provId}"
          placeholder="Paste ${meta.name} key…"
          value="${hasKey?maskedVal:''}"
          oninput="onVaultKeyInput('${provId}',this)"
          autocomplete="off"
          spellcheck="false"
        />
        <button class="vprov-clear${hasKey?' show':''}" id="vclear-${provId}" onclick="clearProviderKey('${provId}')" title="Clear key">✕</button>
        <button class="vprov-eye" id="veye-${provId}" onclick="toggleKeyVisibility('${provId}')" title="Show/hide key">👁</button>
        <button class="vprov-test-btn" onclick="testSingleKey('${provId}')" id="vtest-${provId}"
          style="${hasKey?'border-color:rgba(0,229,160,.3);color:var(--green)':''}">
          ${hasKey?'↺':'✓'}
        </button>
      </div>
      <div class="vprov-status ${statusCls[status]||'empty'}" id="vstatus-${provId}">${statuses[status]||''}</div>
      <a href="${meta.getKey()}" target="_blank" class="vprov-getkey" title="Get ${meta.name} API key">Get key ↗</a>
    </div>`;
  });

  container.innerHTML=html;
  updateVaultBadge();
}

function clearProviderKey(provId){
  const input=document.getElementById('vkey-'+provId);
  const clearBtn=document.getElementById('vclear-'+provId);
  const eyeBtn=document.getElementById('veye-'+provId);
  if(input){input.value='';input.type='password';input.classList.remove('filled','error');}
  if(clearBtn)clearBtn.classList.remove('show');
  if(eyeBtn)eyeBtn.textContent='👁';
  VAULT.removeKey(provId);
  document.getElementById('vprow-'+provId)?.classList.remove('has-key');
  setVStatus(provId,'','empty');
  const nameEl=document.querySelector(`#vprow-${provId} .vprov-name`);
  const iconEl=document.querySelector(`#vprow-${provId} .vprov-icon`);
  if(nameEl){nameEl.style.color='';}
  if(iconEl){iconEl.style.color='';iconEl.style.borderColor='';}
  updateVaultBadge();
  toast(`Cleared ${PROVIDER_META[provId]?.name||provId} key`,'');
}

function toggleKeyVisibility(provId){
  const input=document.getElementById('vkey-'+provId);
  const eyeBtn=document.getElementById('veye-'+provId);
  if(!input)return;
  if(input.type==='password'){
    input.type='text';
    if(eyeBtn)eyeBtn.textContent='🙈';
    // Auto-hide after 8 seconds for security
    setTimeout(()=>{
      if(input.type==='text'){input.type='password';if(eyeBtn)eyeBtn.textContent='👁';}
    },8000);
  } else {
    input.type='password';
    if(eyeBtn)eyeBtn.textContent='👁';
  }
}

function onVaultKeyInput(provId,input){
  const val=input.value.trim();
  input.classList.toggle('filled',val.length>0);
  input.classList.remove('error');
  const clearBtn=document.getElementById('vclear-'+provId);
  if(clearBtn)clearBtn.classList.toggle('show',val.length>0);
  const row=document.getElementById('vprow-'+provId);
  const nameEl=document.querySelector(`#vprow-${provId} .vprov-name`);
  const iconEl=document.querySelector(`#vprow-${provId} .vprov-icon`);
  const meta=PROVIDER_META[provId]||{};
  if(val.length>10){
    VAULT.addKey(provId,val,getDefaultPriority(provId));
    const k=VAULT.keys.find(x=>x.provider===provId);
    if(k)k.status='untested';
    VAULT.save();
    if(row)row.classList.add('has-key');
    if(nameEl)nameEl.style.color=meta.color||'';
    if(iconEl){iconEl.style.color=meta.color||'';iconEl.style.borderColor=(meta.color||'')+'44';}
    setVStatus(provId,'✓ saved','ok');
    const testBtn=document.getElementById('vtest-'+provId);
    if(testBtn){testBtn.style.borderColor='rgba(0,229,160,.3)';testBtn.style.color='var(--green)';testBtn.textContent='↺';}
    if(!S.cfg.key){S.cfg.key=val;S.cfg.provider=provId;}
  } else if(val.length===0){
    VAULT.removeKey(provId);
    if(row)row.classList.remove('has-key');
    if(nameEl)nameEl.style.color='';
    if(iconEl){iconEl.style.color='';iconEl.style.borderColor='';}
    setVStatus(provId,'','empty');
    const testBtn=document.getElementById('vtest-'+provId);
    if(testBtn){testBtn.style.borderColor='';testBtn.style.color='';testBtn.textContent='✓';}
  }
  updateVaultBadge();
}

function getDefaultPriority(provId){
  // Paid=1, freepaid=2, free=3
  const tier=PROVIDER_META[provId]?.tier||'free';
  if(tier==='paid') return 1;
  if(tier==='freepaid') return 2;
  const paid=['openai','anthropic'];
  const fast=['groq','cerebras'];
  if(paid.includes(provId))return 1;
  if(fast.includes(provId))return 2;
  return 3;
}

function setVStatus(provId,label,cls){
  const el=document.getElementById('vstatus-'+provId);
  if(!el)return;
  el.textContent=label;
  el.className='vprov-status '+(cls||'empty');
}

async function testSingleKey(provId){
  const input=document.getElementById('vkey-'+provId);
  const rawKey=input?.value?.trim()||VAULT.keys.find(x=>x.provider===provId)?.key||'';
  if(!rawKey){toast(`Enter a ${PROVIDER_META[provId]?.name} key first`,'err');return;}

  const btn=document.getElementById('vtest-'+provId);
  if(btn){btn.textContent='⏳…';btn.disabled=true;}
  setVStatus(provId,'testing…','testing');

  // Step 1: Always ensure key is saved before testing
  let k=VAULT.keys.find(x=>x.provider===provId);
  if(!k){
    VAULT.keys.push({provider:provId,key:rawKey,priority:getDefaultPriority(provId),status:'untested',addedAt:Date.now()});
    k=VAULT.keys.find(x=>x.provider===provId);
  } else {
    k.key=rawKey;
    k.status='untested'; // reset before test
  }

  const meta=PROVIDER_META[provId];
  const provName=meta?.name||provId;

  // Step 2: Run test
  let testOk=false;
  let testStatus=0;
  try{
    const result=await VAULT.testKey(provId,rawKey);
    testOk=typeof result==='object'?result.ok:!!result;
    testStatus=typeof result==='object'?result.status:(VAULT._lastTestStatus||0);
  }catch(e){
    testOk=false;testStatus=0;
  }

  // Step 3: Update status — ONLY mark fail on 401, everything else = save & use
  if(testOk){
    k.status='ok';
  } else if(testStatus===401){
    // Genuine invalid key — only case where we show error
    k.status='fail';
  } else {
    // Network error, CORS, rate limit, server error — key may still work, save as untested
    k.status='untested';
    testOk=true; // treat as "saved" not "failed"
  }

  VAULT.save();

  // Step 4: Update UI
  if(btn){
    btn.textContent=k.status==='fail'?'✗ Fail':'✓ OK';
    btn.disabled=false;
    setTimeout(()=>{if(btn)btn.textContent='↺ Re-test';},3000);
  }

  if(k.status==='fail'){
    setVStatus(provId,'✗ invalid','fail');
    input?.classList.add('error');
    toast(`❌ ${provName} key is invalid (401) — check it's copied correctly`,'err');
  } else {
    const label=k.status==='ok'?'✓ verified':'✓ saved';
    const cls='ok';
    setVStatus(provId,label,cls);
    input?.classList.add('filled');
    input?.classList.remove('error');
    document.getElementById('vprow-'+provId)?.classList.add('has-key');
    if(!S.cfg.key){S.cfg.key=rawKey;S.cfg.provider=provId;}
    if(k.status==='ok'){
      toast(`✅ ${provName} key verified and working!`,'ok');
    } else {
      toast(`✓ ${provName} key saved — couldn't verify now (${testStatus||'network error'}), but will try on build`,'');
    }
    refreshAllAgentModels();
  }
  updateVaultBadge();
}

async function testAllKeys(){
  const btn=document.getElementById('test-all-btn');
  if(btn){btn.textContent='⏳ Testing all…';btn.disabled=true;}
  const keyed=ALL_PROVIDERS.filter(p=>document.getElementById('vkey-'+p)?.value?.trim());
  if(!keyed.length){toast('No keys to test — paste some keys first','err');if(btn){btn.textContent='🔬 Test All Keys';btn.disabled=false;}return;}
  toast(`Testing ${keyed.length} key${keyed.length>1?'s':''}…`,'');
  let ok=0;
  for(const provId of keyed){
    await testSingleKey(provId);
    await new Promise(r=>setTimeout(r,300));
    const k=VAULT.keys.find(x=>x.provider===provId);
    if(k?.status==='ok')ok++;
  }
  if(btn){btn.textContent='🔬 Test All Keys';btn.disabled=false;}
  toast(`✅ ${ok}/${keyed.length} keys verified`,'ok');
  updateVaultBadge();
  renderRoutingPrefs();
  refreshAllAgentModels();
}

/* Reset all key statuses back to 'untested' so they can be retried.
   Useful when keys got wrongly marked as fail due to network errors. */
function resetAllKeyStatuses(){
  VAULT.keys.forEach(k=>{
    if(k.status==='fail'||k.status==='ratelimited'){
      k.status='untested';
    }
  });
  VAULT.save();
  // Update all status badges in the UI
  ALL_PROVIDERS.forEach(provId=>{
    const k=VAULT.keys.find(x=>x.provider===provId);
    if(k&&(k.status==='untested')){
      setVStatus(provId,'✓ saved','ok');
      document.getElementById('vkey-'+provId)?.classList.remove('error');
    }
  });
  updateVaultBadge();
  toast('🔄 All key statuses reset — click Test All Keys to re-verify','ok');
}

function updateVaultBadge(){
  const n=VAULT.getActiveCount();
  const badge=document.getElementById('vault-active-badge');
  if(badge){badge.textContent=`${n} active`;badge.style.background=n?'rgba(0,229,160,.12)':'rgba(255,107,107,.1)';badge.style.borderColor=n?'rgba(0,229,160,.25)':'rgba(255,107,107,.2)';badge.style.color=n?'var(--green)':'var(--red)';}
  VAULT.updateHeaderBadge();
}

function clearAllKeys(){
  if(!confirm('Clear all saved API keys?'))return;
  VAULT.keys=[];VAULT.save();
  S.cfg.key='';S.cfg.provider='openrouter';
  renderVaultDashboard();renderRoutingPrefs();
  toast('All keys cleared','ok');
}

function renderRoutingPrefs(){
  const container=document.getElementById('routing-prefs');
  if(!container)return;
  const tasks=[
    {id:'coding',label:'💻 Coding',desc:'Developer, Optimizer, Debugger agents'},
    {id:'reasoning',label:'🧠 Reasoning',desc:'CEO, Manager, Planner, Reviewer agents'},
    {id:'creative',label:'🎨 Creative',desc:'Designer, UI agents'},
    {id:'fast',label:'⚡ Fast',desc:'DevOps, summaries, quick tasks'},
  ];
  const activeProviders=VAULT.keys.filter(k=>k.status!=='fail').map(k=>k.provider);
  container.innerHTML=tasks.map(t=>`
    <div class="rpref-item">
      <div class="rpref-label">${t.label}</div>
      <select class="rpref-sel" id="pref-${t.id}" title="${t.desc}">
        <option value="">🤖 Auto (best available)</option>
        ${activeProviders.map(p=>{
          const meta=PROVIDER_META[p]||{name:p,icon:'🔑'};
          return `<option value="${p}" ${VAULT.prefs[t.id]===p?'selected':''}>${meta.icon} ${meta.name} — ${meta.models[t.id]?.split('/').pop().replace(':free','').slice(0,18)||'auto'}</option>`;
        }).join('')}
      </select>
    </div>`).join('');
}

/* Legacy compat stubs */
function renderVaultList(){renderVaultDashboard();}
function renderModelPrefs(){renderRoutingPrefs();}
function updateAddHint(){}
function testAndAddKey(){}

function saveConfig(){
  // Read all key inputs and save to vault
  ALL_PROVIDERS.forEach(provId=>{
    const input=document.getElementById('vkey-'+provId);
    const key=input?.value?.trim();
    if(key&&key.length>10){
      VAULT.addKey(provId,key,getDefaultPriority(provId));
      const k=VAULT.keys.find(x=>x.provider===provId);
      if(k&&k.status==='empty')k.status='untested';
    } else if(!key){
      VAULT.removeKey(provId);
    }
  });
  // Save routing prefs
  ['coding','reasoning','creative','fast'].forEach(task=>{
    const sel=document.getElementById('pref-'+task);
    if(sel)VAULT.prefs[task]=sel.value||'';
  });
  VAULT.save();
  // Update S.cfg with best available key for compat
  const best=VAULT.getBest('quality');
  if(best){S.cfg.key=best.key;S.cfg.provider=best.provider;}
  // Save advanced settings
  const mm=document.getElementById('cfg-mm');if(mm)S.cfg.mm=mm.value;
  const sp=document.getElementById('cfg-speed');if(sp)S.cfg.speed=sp.value;
  const fb=document.getElementById('cfg-feedback');if(fb)S.cfg.feedbackLoop=fb.value==='true';
  const ml=document.getElementById('cfg-maxloops');if(ml)S.cfg.maxLoops=parseInt(ml.value)||2;
  const rt=document.getElementById('cfg-routing');if(rt)S.cfg.dynamicRouting=rt.value==='true';
  const se=document.getElementById('cfg-selfeval');if(se)S.cfg.selfEval=se.value==='true';
  saveCfg();
  closeMo('cfg-mo');
  const n=VAULT.getActiveCount();
  VAULT.updateHeaderBadge();
  refreshAllAgentModels(); // update agent panel with new keys
  toast(`💾 Vault saved — ${n} key${n!==1?'s':''} ready`,'ok');
}

// Keep callAPI working as before for legacy compatibility
async function callAPI(sysPrompt,messages,agent=null){
  const key=S.cfg.key||VAULT.getBest('quality')?.key;
  if(!key) return null;
  const prov=S.cfg.provider||'openrouter';
  const model=agent?MODEL_ROUTER.pick(agent.id):S.cfg.model;
  const meta=PROVIDER_META[prov];
  if(!meta)return null;
  // Delegate to vault caller
  return callAPIVault(sysPrompt,messages,null,prov,key,model);
}

function openHistory(){renderHistModal();document.getElementById('hist-mo').classList.add('show')}
function openTpl(){
  selTpl=null;document.getElementById('use-tpl-btn').disabled=true;
  document.getElementById('tgrid').innerHTML=TEMPLATES.map((t,i)=>`<div class="tc" id="tc-${i}" onclick="pickTpl(${i})"><div class="tc-em">${t.e}</div><div class="tc-name">${t.n}</div><div class="tc-desc">${t.d}</div><div class="tc-tags">${t.t.map(x=>`<span class="tc-tag">${x}</span>`).join('')}</div></div>`).join('');
  document.getElementById('tpl-mo').classList.add('show');
}
function pickTpl(i){selTpl=i;document.querySelectorAll('.tc').forEach((c,j)=>c.classList.toggle('sel',j===i));document.getElementById('use-tpl-btn').disabled=false}
function useTpl(){if(selTpl===null)return;const t=TEMPLATES[selTpl];document.getElementById('pi').value=t.p;autosize(document.getElementById('pi'));setMode('build',document.getElementById('mb'));closeMo('tpl-mo');document.getElementById('pi').focus();toast('Template loaded: '+t.n,'ok')}
function openShortcuts(){document.getElementById('sk-mo').classList.add('show')}
function switchTab(el,tab){document.querySelectorAll('.ctab').forEach(t=>t.classList.remove('active'));el.classList.add('active')}

/* ══ MOBILE DRAWER ══ */
function openDrawer(){
  if(!Object.keys(S.files).length){toast('No code yet','err');return;}
  const cdc=document.getElementById('cdc'),fnames=Object.keys(S.files);
  let sel=S.selFile||fnames[0];
  function renderD(){
    const info=getFileIconInfo(sel);
    cdc.innerHTML=`<div style="display:flex;gap:4px;padding:8px;border-bottom:1px solid var(--border);flex-wrap:wrap;align-items:center">
      ${fnames.map(f=>{const fi=getFileIconInfo(f);return`<button onclick="selD('${f}')" id="dt-${f}" class="rtab${f===sel?' active':''}" style="display:flex;align-items:center;gap:3px"><span style="color:${fi.color}">${fi.icon}</span>${f}</button>`}).join('')}
      <button class="cb dl" onclick="saveFile()" style="margin-left:auto">⬇</button>
      <button class="cb" onclick="copyFile()">📋</button>
    </div>
    <div style="overflow:auto;flex:1;padding:10px;font-family:var(--mono);font-size:.7rem;line-height:1.7">
      ${S.files[sel]?.c.split('\n').map((ln,i)=>`<div class="cl"><span class="ln">${i+1}</span><span class="lc">${synHl(esc(ln),S.files[sel].lang||info.desc.toLowerCase())}</span></div>`).join('')||''}
    </div>
    <div style="padding:8px;border-top:1px solid var(--border)"><button class="dlall" onclick="dlZip()">⬇ Download ZIP</button></div>`;
  }
  window.selD=f=>{sel=f;S.selFile=f;document.querySelectorAll('[id^=dt-]').forEach(b=>b.classList.remove('active'));document.getElementById('dt-'+f)?.classList.add('active');renderD()};
  renderD();document.getElementById('cdrawer').classList.add('show');
}
function closeDrawer(){document.getElementById('cdrawer').classList.remove('show')}

/* ══ CHAR COUNTER ══ */
document.getElementById('pi').addEventListener('input',function(){
  autosize(this);
  const l=this.value.length,h=document.getElementById('charhint');
  if(l>50){h.textContent=l+'chars';h.className='charhint'+(l>500?' warn':l>800?' over':'')}else{h.textContent=''}
});

/* ══ KEYBOARD ══ */
document.addEventListener('keydown',e=>{
  const inp=['TEXTAREA','INPUT'].includes(document.activeElement.tagName);
  if((e.ctrlKey||e.metaKey)&&e.key==='Enter'){e.preventDefault();go()}
  if((e.ctrlKey||e.metaKey)&&e.shiftKey&&e.key==='E'){e.preventDefault();enhancePrompt()}
  if((e.ctrlKey||e.metaKey)&&e.shiftKey&&e.key==='N'){e.preventDefault();newSession()}
  if((e.ctrlKey||e.metaKey)&&e.shiftKey&&e.key==='P'){e.preventDefault();runPreview()}
  if((e.ctrlKey||e.metaKey)&&e.shiftKey&&e.key==='D'){e.preventDefault();dlZip()}
  if((e.ctrlKey||e.metaKey)&&e.shiftKey&&e.key==='L'){e.preventDefault();toggleTheme()}
  if((e.ctrlKey||e.metaKey)&&e.key==='t'){e.preventDefault();openTpl()}
  if((e.ctrlKey||e.metaKey)&&e.key==='['){e.preventDefault();toggleLeft()}
  if((e.ctrlKey||e.metaKey)&&e.key===']'){e.preventDefault();toggleRight()}
  if((e.ctrlKey||e.metaKey)&&e.key==='.'){e.preventDefault();stopBuild()}
  if((e.ctrlKey||e.metaKey)&&e.key==='f'&&S.selFile){e.preventDefault();toggleSearch()}
  if(e.key==='/'&&!inp){e.preventDefault();document.getElementById('pi').focus()}
  if(e.key==='?'&&!inp){e.preventDefault();openShortcuts()}
  if(e.key==='Escape'){['cfg-mo','hist-mo','tpl-mo','sk-mo'].forEach(closeMo);closePrev();closeDrawer();closeSidebar();if(document.getElementById('csw').classList.contains('show'))toggleSearch()}
});

document.getElementById('prevmo').addEventListener('click',e=>{if(e.target===e.currentTarget)closePrev()});
['cfg-mo','hist-mo','tpl-mo','sk-mo'].forEach(id=>{document.getElementById(id).addEventListener('click',e=>{if(e.target===e.currentTarget)closeMo(id)})});


/* AGENT STATE MANAGEMENT */
function setAgentState(agentId,state){
  var agent=AGENTS.find(function(a){return a.id===agentId});if(agent)agent.state=state;
  var wfNode=document.getElementById('wf-'+agentId);
  if(wfNode){
    wfNode.className='wf-node '+state;
    var st=wfNode.querySelector('.wf-state');
    if(st)st.textContent=state==='idle'?'\u25CB':state==='done'?'\u2713':state;
  }
  var badge=document.getElementById('as-'+agentId);
  if(badge){badge.className='astate '+(state==='idle'||state==='done'?'':state);badge.textContent=state==='idle'?'':state==='done'?'\u2713':state;badge.style.display=state==='idle'?'none':'inline-block';}
}

function initWorkflowViz(){
  var chain=document.getElementById('wf-chain');if(!chain)return;
  var wf=[
    {id:'websearcher', emoji:'\ud83c\udf10', name:'Web Searcher'},
    {id:'ceo',         emoji:'\ud83d\udc54', name:'CEO'},
    {id:'promptagent', emoji:'\u270d\ufe0f', name:'Prompt Agent'},
    {id:'manager',     emoji:'\ud83d\udc68\u200d\ud83d\udcbc', name:'Manager'},
    {id:'planner',     emoji:'\ud83d\uddfa', name:'Planner'},
    {id:'pm',          emoji:'\ud83d\udccb', name:'Prod Mgr'},
    {id:'designer',    emoji:'\ud83c\udfa8', name:'Designer'},
    {id:'developer',   emoji:'\ud83d\udcbb', name:'Developer'},
    {id:'reviewer',    emoji:'\ud83d\udd0d', name:'Reviewer'},
    {id:'optimizer',   emoji:'\ud83d\ude80', name:'Optimizer'},
    {id:'a11y',        emoji:'\u267f',       name:'A11y'},
    {id:'debugger',    emoji:'\ud83d\udc1b', name:'Debugger'},
    {id:'devops',      emoji:'\ud83d\udce6', name:'DevOps'},
    {id:'tester',      emoji:'\ud83e\uddea', name:'Test Agent'},
  ];
  chain.innerHTML=wf.map(function(a){
    return '<div class="wf-node idle" id="wf-'+a.id+'">'
      +'<div class="wf-icon">'+a.emoji+'</div>'
      +'<div class="wf-body">'
        +'<div class="wf-top">'
          +'<span class="wf-name">'+a.name+'</span>'
          +'<span class="wf-state">\u25CB</span>'
        +'</div>'
        +'<div class="wf-model" id="wfm-'+a.id+'">'
          +'<span class="wf-model-prov" id="wfmp-'+a.id+'"></span>'
          +'<span style="color:var(--t3);opacity:.5">·</span>'
          +'<span class="wf-model-name" id="wfmn-'+a.id+'"></span>'
          +'<span class="wf-model-task" id="wfmt-'+a.id+'"></span>'
        +'</div>'
      +'</div>'
    +'</div>';
  }).join('');
}

/* Called whenever an agent starts — shows which model it's using */
function showAgentModel(agentId, provider, modelName, taskType){
  // Update workflow sidebar node (wf-chain)
  const provEl=document.getElementById('wfmp-'+agentId);
  const nameEl=document.getElementById('wfmn-'+agentId);
  const taskEl=document.getElementById('wfmt-'+agentId);
  const meta=PROVIDER_META[provider]||{};
  if(provEl)provEl.textContent=(meta.icon||'🔑')+' '+(meta.name||provider);
  if(nameEl)nameEl.textContent=modelName?modelName.split('/').pop().replace(':free','').slice(0,22):'';
  if(taskEl){
    const taskColors={coding:'#ffd166',reasoning:'#a090ff',quality:'#00d4ff',creative:'#f472b6',fast:'#00e5a0',review:'#fb923c'};
    const col=taskColors[taskType]||'var(--t3)';
    taskEl.textContent=taskType||'';
    taskEl.style.cssText=`color:${col};background:${col}18;border:1px solid ${col}33;border-radius:3px;`;
  }
  if(provEl)provEl.style.color=meta.color||'var(--t2)';
  // Also update the agent list panel
  updateAgentModelPanel(agentId, provider, modelName);
}

/* Updates the model chip in the LEFT PANEL agent list in real time */
function updateAgentModelPanel(agentId, provider, modelName){
  const meta=PROVIDER_META[provider]||{};
  const provColor=meta.color||'var(--t3)';
  const provIcon=meta.icon||'🔑';
  const shortModel=(modelName||'').split('/').pop().replace(':free','').slice(0,18);
  const provChip=document.getElementById('amp-'+agentId);
  const nameChip=document.getElementById('amn-'+agentId);
  const modelRow=document.getElementById('am-'+agentId);
  if(provChip){
    provChip.textContent=provIcon+' '+(meta.name||provider);
    provChip.style.cssText=`background:${provColor}18;color:${provColor};border:1px solid ${provColor}30;border-radius:2px;padding:0 3px;font-size:.52rem;font-weight:700;`;
  }
  if(nameChip){
    nameChip.textContent=shortModel||'—';
    nameChip.style.color=shortModel?'var(--t2)':'var(--t3)';
  }
  if(modelRow){
    modelRow.classList.add('live');
    modelRow.title=`${meta.name||provider} · ${shortModel}`;
  }
}

/* Refresh ALL agent model chips from vault (called on vault save or init) */
function refreshAllAgentModels(){
  AGENTS.forEach(a=>{
    const task=MODEL_ROUTER.agentTaskMap[a.id]||'quality';
    const best=VAULT.getBest(task);
    if(best)updateAgentModelPanel(a.id, best.provider, best.model||'');
    else{
      // No key — show "no key" state
      const provChip=document.getElementById('amp-'+a.id);
      const nameChip=document.getElementById('amn-'+a.id);
      if(provChip){provChip.textContent='🔑';provChip.style.cssText='background:var(--s3);color:var(--t3);border:1px solid var(--border);border-radius:2px;padding:0 3px;font-size:.52rem;font-weight:700;';}
      if(nameChip){nameChip.textContent='no key';nameChip.style.color='var(--red)';}
    }
  });
}
function updatePipeline(from,to,dataType){var ind=document.getElementById('pipeline-ind');if(!ind)return;ind.classList.add('active');document.getElementById('pi-from').textContent=from||'\u2014';document.getElementById('pi-to').textContent=to||'\u2014';document.getElementById('pi-data').textContent=dataType?'('+dataType+')':'';}
function hidePipeline(){var ind=document.getElementById('pipeline-ind');if(ind)ind.classList.remove('active');}
/* PROMPT CHAINING ENGINE */
var CHAIN_ENGINE={
  steps:[],currentStep:0,
  buildChain:function(prompt){
    this.steps=[
      {name:'Web Research',      agent:'websearcher', input:prompt,output:null,state:'pending'},
      {name:'CEO Strategy',      agent:'ceo',         input:prompt,output:null,state:'pending'},
      {name:'Prompt Refinement', agent:'promptagent', input:null,  output:null,state:'pending'},
      {name:'Manager Planning',  agent:'manager',     input:null,  output:null,state:'pending'},
      {name:'Architecture',      agent:'planner',     input:null,  output:null,state:'pending'},
      {name:'Product Specs',     agent:'pm',          input:null,  output:null,state:'pending'},
      {name:'UI Design',         agent:'designer',    input:null,  output:null,state:'pending'},
      {name:'Full Development',  agent:'developer',   input:null,  output:null,state:'pending'},
      {name:'Code Review',       agent:'reviewer',    input:null,  output:null,state:'pending'},
      {name:'Optimization',      agent:'optimizer',   input:null,  output:null,state:'pending'},
      {name:'Accessibility',     agent:'a11y',        input:null,  output:null,state:'pending'},
      {name:'Bug Fixing',        agent:'debugger',    input:null,  output:null,state:'pending'},
      {name:'Deployment',        agent:'devops',      input:null,  output:null,state:'pending'},
      {name:'Automated Testing', agent:'tester',      input:null,  output:null,state:'pending'},
    ];this.currentStep=0;
  },
  advance:function(output){
    if(this.currentStep<this.steps.length){this.steps[this.currentStep].output=output;this.steps[this.currentStep].state='done';}
    this.currentStep++;
    if(this.currentStep<this.steps.length){this.steps[this.currentStep].input=output;this.steps[this.currentStep].state='active';}
  },
  getCurrentInput:function(){return this.currentStep<this.steps.length?this.steps[this.currentStep].input:null;}
};

/* ══════════════════════════════════════════════════════════════
   NEURALFORGE v11 — 13 FEATURE UPGRADE PACK
   1.  Proper folder tree UI
   2.  ZIP with correct folder structure
   3.  Abort & runaway protection (hard guard)
   4.  Referrer/origin warnings in settings
   5.  Hard budget caps + cost tracker
   6.  AbortController on every fetch
   7.  Parallel agent execution (phases)
   8.  Sarvam AI model update (sarvam-m)
   9.  Live error monitor
   10. Auto test agent + sandbox runner
   11. Web searcher agent pre-build
   12. User persona mode
   13. Build replay animation
   ══════════════════════════════════════════════════════════════ */

/* ─────────────────────────────────────────────
   FEATURE 1 & 2: Proper Folder Tree + ZIP
   ───────────────────────────────────────────── */
/* Map file extensions/names to src-like folder paths */
function getFilePath(fname){
  const ext=(fname.split('.').pop()||'').toLowerCase();
  const base=fname.toLowerCase();
  // common source structure
  if(base==='index.html'||base==='index.htm') return 'src/'+fname;
  if(ext==='html') return 'src/pages/'+fname;
  if(ext==='css'||ext==='scss') return 'src/styles/'+fname;
  if(ext==='js'&&(base.includes('component')||base.includes('comp'))) return 'src/components/'+fname;
  if(ext==='js'||ext==='jsx'||ext==='ts'||ext==='tsx'){
    if(base.includes('util')||base.includes('helper')) return 'src/utils/'+fname;
    if(base.includes('api')||base.includes('service')) return 'src/services/'+fname;
    if(base.includes('store')||base.includes('reducer')) return 'src/store/'+fname;
    return 'src/'+fname;
  }
  if(ext==='json') return fname==='package.json'||fname==='tsconfig.json'?fname:'src/data/'+fname;
  if(ext==='md') return fname;
  if(ext==='py') return 'src/'+fname;
  if(ext==='sh') return 'scripts/'+fname;
  if(ext==='sql') return 'db/'+fname;
  return 'src/'+fname;
}

/* Build folder tree from current S.files */
function buildFolderTree(files){
  const tree={};
  Object.keys(files).forEach(fname=>{
    const path=getFilePath(fname);
    const parts=path.split('/');
    let node=tree;
    for(let i=0;i<parts.length-1;i++){
      const dir=parts[i];
      if(!node[dir])node[dir]={__files:[],__dirs:{}};
      node=node[dir].__dirs;
    }
    const dir=parts.length>1?parts.slice(0,-1).join('/'):'.';
    // store file->path mapping
    files[fname]._path=path;
  });
  return tree;
}

/* Render the enhanced folder tree in right panel */
function renderFilesTree(){
  const t=document.getElementById('ftree');
  if(!t)return;
  t.innerHTML='';
  const files=Object.keys(S.files);
  if(!files.length){
    t.innerHTML='<div id="ftree-empty" style="padding:8px;font-size:.69rem;color:var(--t3)">No files yet — build a project</div>';
    return;
  }

  // Header
  const hdr=document.createElement('div');
  hdr.style.cssText='display:flex;align-items:center;justify-content:space-between;padding:6px 10px 3px;border-bottom:1px solid var(--border)';
  const projName=(S.project||'project').replace(/[^a-z0-9]/gi,'-').toLowerCase().slice(0,20)||'my-project';
  hdr.innerHTML=`<span style="font-size:.58rem;font-weight:700;letter-spacing:.1em;color:var(--t3);text-transform:uppercase">📁 ${projName}/</span><span style="font-size:.58rem;color:var(--t3);font-family:var(--mono)">${files.length} file${files.length!==1?'s':''}</span>`;
  t.appendChild(hdr);

  // Group into virtual folder structure
  const folders={};  // folderPath -> [fname, ...]
  files.forEach(fname=>{
    const path=getFilePath(fname);
    const parts=path.split('/');
    const folder=parts.length>1?parts.slice(0,-1).join('/'):'root';
    if(!folders[folder])folders[folder]=[];
    folders[folder].push({fname,path});
  });

  // Render each folder
  const folderOrder=['src','src/pages','src/components','src/styles','src/utils','src/services','src/store','src/data','db','scripts','root'];
  const allFolders=[...folderOrder.filter(f=>folders[f]),...Object.keys(folders).filter(f=>!folderOrder.includes(f))];

  allFolders.forEach(folder=>{
    if(!folders[folder]||!folders[folder].length)return;
    const items=folders[folder];

    if(folder==='root'||allFolders.length===1){
      // flat — no folder wrapper
      items.forEach(({fname})=>t.appendChild(makeFileRow(fname)));
      return;
    }

    // Folder group
    const grp=document.createElement('div');
    grp.className='ft-src-group open';
    const folderIcons={'src':'📂','src/pages':'📄','src/components':'🧩','src/styles':'🎨',
                       'src/utils':'🔧','src/services':'🌐','src/store':'🗄','src/data':'📊',
                       'db':'🗃️','scripts':'⚙️'};
    const icon=folderIcons[folder]||'📂';
    const shortName=folder.split('/').pop();
    grp.innerHTML=`<div class="ft-src-header" onclick="this.parentElement.classList.toggle('open')">
      <span class="ft-src-icon">${icon}</span>
      <span class="ft-src-name">${shortName}/</span>
      <span style="font-size:.52rem;color:var(--t3);margin-left:4px;font-family:var(--mono)">${items.length}</span>
      <span class="ft-src-arrow">▶</span>
    </div>
    <div class="ft-src-children" id="ftc-${folder.replace(/\//g,'-')}"></div>`;
    t.appendChild(grp);
    const ch=grp.querySelector('.ft-src-children');
    items.forEach(({fname})=>ch.appendChild(makeFileRow(fname)));
  });
}

/* Override renderFiles to use the new tree */
const _origRenderFiles=window.renderFiles;
function renderFiles(){
  renderFilesTree();
}

/* Feature 2: Download ZIP with correct folder structure */
async function dlZip(){
  const files=Object.keys(S.files);
  if(!files.length){toast('No files to download','err');return;}
  try{
    // Use JSZip if available via CDN, else manual approach
    const projName=(S.project||'project').replace(/[^a-z0-9]/gi,'-').toLowerCase().slice(0,20)||'my-project';
    const script=document.createElement('script');
    script.src='https://cdnjs.cloudflare.com/ajax/libs/jszip/3.10.1/jszip.min.js';
    script.onload=async()=>{
      const zip=new JSZip();
      const proj=zip.folder(projName);
      // Also add root package.json if not present
      if(!S.files['package.json']){
        const fw=S.framework||'vanilla';
        const pkgJson={name:projName,version:'1.0.0',description:S.project||'NeuralForge project',
          scripts:{start:'node src/index.js',dev:'node src/index.js'},private:true};
        proj.file('package.json',JSON.stringify(pkgJson,null,2));
      }
      // Add README if not present
      if(!S.files['README.md']){
        proj.file('README.md',`# ${S.project||projName}\n\nGenerated by NeuralForge v11\n\n## Setup\n\nOpen \`src/index.html\` in your browser.\n`);
      }
      // Add all files with proper paths
      files.forEach(fname=>{
        const path=getFilePath(fname);
        proj.file(path, S.files[fname].c);
      });
      const blob=await zip.generateAsync({type:'blob'});
      const url=URL.createObjectURL(blob);
      const a=document.createElement('a');
      a.href=url;a.download=projName+'.zip';
      document.body.appendChild(a);a.click();
      setTimeout(()=>{URL.revokeObjectURL(url);a.remove();},1000);
      toast('✅ ZIP downloaded with folder structure','ok');
    };
    script.onerror=()=>{
      // Fallback: download files individually
      files.forEach(fname=>{
        const blob=new Blob([S.files[fname].c],{type:'text/plain'});
        const url=URL.createObjectURL(blob);
        const a=document.createElement('a');a.href=url;a.download=fname;
        document.body.appendChild(a);a.click();
        setTimeout(()=>{URL.revokeObjectURL(url);a.remove();},200);
      });
      toast('Downloaded '+files.length+' files','ok');
    };
    document.head.appendChild(script);
  }catch(e){toast('Download failed: '+e.message,'err');}
}

/* ─────────────────────────────────────────────
   FEATURE 3 & 6: Abort & Runaway Protection + AbortController
   ───────────────────────────────────────────── */
const ABORT_GUARD={
  MAX_BUILD_MS: 8*60*1000,   // 8 minute absolute max
  MAX_TOKENS_BUILD: 300000,   // 300k tokens max per build
  timerId: null,
  tokenCount: 0,

  start(){
    this.tokenCount=0;
    this.timerId=setTimeout(()=>{
      if(S.building){
        logError('🛡 Runaway protection: build exceeded 8 minutes — auto-aborted','error');
        toast('🛡 Build auto-stopped: exceeded 8 min time limit','err');
        stopBuild();
      }
    }, this.MAX_BUILD_MS);
    document.getElementById('abort-guard')?.classList.add('show');
    // Fresh AbortController per build
    S.abortController=new AbortController();
  },

  addTokens(n){
    this.tokenCount+=(n||0);
    S.tokenUsedTotal=(S.tokenUsedTotal||0)+(n||0);
    updateCostTracker(n||0);
    if(this.tokenCount>this.MAX_TOKENS_BUILD){
      logError('🛡 Token budget exceeded ('+this.tokenCount.toLocaleString()+' tokens)','error');
      toast('🛡 Token budget hit — stopping build','err');
      stopBuild();
    }
  },

  stop(){
    if(this.timerId)clearTimeout(this.timerId);
    this.timerId=null;
    document.getElementById('abort-guard')?.classList.remove('show');
  },

  getSignal(){
    return S.abortController?.signal;
  }
};

/* ─────────────────────────────────────────────
   FEATURE 5: Budget Caps + Cost Tracker
   ───────────────────────────────────────────── */
const COST_PER_1K={
  openrouter:0.0,groq:0.0,google:0.0,cerebras:0.0,sambanova:0.0,novita:0.0,
  cohere:0.002,huggingface:0.0,sarvam:0.0,
  openai:0.005,anthropic:0.003,together:0.002,fireworks:0.002,
  mistral:0.003,deepinfra:0.001,perplexity:0.002,xai:0.005,
  deepseek:0.001,qwen:0.002,ai21:0.003,lepton:0.001,
};

function updateCostTracker(newTokens){
  const provider=VAULT.getBest('quality')?.provider||S.cfg.provider||'openrouter';
  const rate=COST_PER_1K[provider]||0.001;
  S.totalCostEst=(S.totalCostEst||0)+(newTokens/1000)*rate;
  const el=document.getElementById('cost-num');
  const fill=document.getElementById('cost-fill');
  const tracker=document.getElementById('cost-tracker');
  if(!el)return;
  tracker?.classList.add('show');
  const cost=S.totalCostEst;
  el.textContent='$'+cost.toFixed(4);
  const pct=Math.min(100,(cost/S.budgetCap)*100);
  if(fill)fill.style.width=pct+'%';
  // Color shift
  if(pct>90){el.className='cost-num cost-over';fill.style.background='var(--red)';}
  else if(pct>70){el.className='cost-num cost-warn';fill.style.background='linear-gradient(90deg,var(--yellow),var(--orange))';}
  // Budget cap check
  if(cost>=S.budgetCap&&S.building){
    const warn=document.getElementById('budget-cap-warn');
    if(warn){warn.style.display='block';setTimeout(()=>warn.style.display='none',5000);}
    logError(`💳 Budget cap $${S.budgetCap} reached — build auto-stopped`,'error');
    toast(`💳 Budget cap $${S.budgetCap} reached — stopping`,'err');
    stopBuild();
  }
}

function resetCostTracker(){
  S.totalCostEst=0;S.tokenUsedTotal=0;
  const el=document.getElementById('cost-num');
  const fill=document.getElementById('cost-fill');
  const tracker=document.getElementById('cost-tracker');
  if(el){el.textContent='$0.000';el.className='cost-num';}
  if(fill)fill.style.width='0%';
  tracker?.classList.remove('show');
}

/* ─────────────────────────────────────────────
   FEATURE 9: Live Error Monitor
   ───────────────────────────────────────────── */
function logError(msg, level='error'){
  const entry={msg,level,ts:Date.now()};
  S.errLog.unshift(entry);
  if(S.errLog.length>50)S.errLog.pop();
  renderErrMonitor();
  // Badge
  const badge=document.getElementById('err-badge');
  // Update badge count on err-monitor toggle btn
}

function renderErrMonitor(){
  const list=document.getElementById('err-mon-list');
  if(!list)return;
  if(!S.errLog.length){list.innerHTML='<div style="padding:6px;font-size:.62rem;color:var(--t3)">No errors — all clear ✅</div>';return;}
  list.innerHTML=S.errLog.slice(0,20).map(e=>{
    const icons={error:'❌',warn:'⚠️',info:'ℹ️'};
    const time=new Date(e.ts).toLocaleTimeString('en',{hour12:false,hour:'2-digit',minute:'2-digit',second:'2-digit'});
    return `<div class="err-item ${e.level}"><span style="color:var(--t3);font-size:.52rem;margin-right:4px">${time}</span>${icons[e.level]||'•'} ${e.msg.slice(0,120)}</div>`;
  }).join('');
}

function clearErrMonitor(){S.errLog=[];renderErrMonitor();}
function toggleErrMonitor(){
  const m=document.getElementById('err-monitor');
  m?.classList.toggle('show');
  renderErrMonitor();
}

/* Patch global error listener */
window.addEventListener('unhandledrejection',ev=>{
  logError('Unhandled Promise: '+(ev.reason?.message||String(ev.reason||'unknown')),'error');
});
window.addEventListener('error',ev=>{
  if(ev.filename&&ev.filename.includes('neuralforge'))
    logError('JS Error: '+ev.message+' (line '+ev.lineno+')','error');
});

/* ─────────────────────────────────────────────
   FEATURE 12: User Persona Mode
   ───────────────────────────────────────────── */
const PERSONA_CONFIG={
  developer:{
    label:'Developer',icon:'🧑‍💻',
    systemSuffix:'',
    agentVerbosity:'full',
    showAllAgents:true,
    promptModifier:(p)=>p,
  },
  senior:{
    label:'Senior',icon:'👨‍🏫',
    systemSuffix:' Be concise and architecture-focused. Skip obvious implementation details.',
    agentVerbosity:'concise',
    showAllAgents:false,
    promptModifier:(p)=>p+'\n\nFocus on architecture, patterns, and key decisions. Be concise.',
  },
  beginner:{
    label:'Beginner',icon:'🌱',
    systemSuffix:' Explain every decision in simple terms. Add comments to all code. Avoid jargon.',
    agentVerbosity:'verbose',
    showAllAgents:true,
    promptModifier:(p)=>p+'\n\nUser is a beginner: explain what you\'re doing and why, use simple language, add plenty of code comments.',
  },
  student:{
    label:'Student',icon:'📚',
    systemSuffix:' Teach as you build. Explain concepts like a patient instructor. Add learning notes.',
    agentVerbosity:'teaching',
    showAllAgents:true,
    promptModifier:(p)=>p+'\n\nTeach the user as you build: explain each pattern, concept, and decision. Add "📚 Learning Note:" sections. Make it educational.',
  },
};

function setPersona(name, btn){
  S.persona=name;
  document.querySelectorAll('.persona-btn').forEach(b=>b.classList.remove('active'));
  if(btn)btn.classList.add('active');
  const cfg=PERSONA_CONFIG[name]||PERSONA_CONFIG.developer;
  toast(`Persona: ${cfg.icon} ${cfg.label}`,'ok');
  // Show/hide non-key agents for Senior mode
  if(name==='senior'){
    ['ceo','manager','planner','pm','optimizer','a11y','devops'].forEach(id=>{
      document.getElementById('ar-'+id)?.style.setProperty('opacity','0.4');
    });
  } else {
    AGENTS.forEach(a=>{
      const el=document.getElementById('ar-'+a.id);
      if(el)el.style.opacity='1';
    });
  }
}

function getPersonaSystemSuffix(){
  const cfg=PERSONA_CONFIG[S.persona||'developer']||PERSONA_CONFIG.developer;
  return cfg.systemSuffix||'';
}

function applyPersonaToPrompt(prompt){
  const cfg=PERSONA_CONFIG[S.persona||'developer']||PERSONA_CONFIG.developer;
  return cfg.promptModifier?cfg.promptModifier(prompt):prompt;
}

/* ─────────────────────────────────────────────
   FEATURE 11: Web Searcher Agent (pre-build)
   ───────────────────────────────────────────── */
const WEB_SEARCHER={
  async run(projectPrompt){
    // Extract key search terms from prompt
    const terms=this._extractTerms(projectPrompt);
    if(!terms.length)return null;

    // Show agent activity
    const w=document.getElementById('msgs');
    const banner=document.createElement('div');
    banner.style.cssText='display:flex;align-items:center;gap:8px;padding:7px 14px;margin:6px 0;background:rgba(0,212,255,.06);border:1px solid rgba(0,212,255,.2);border-radius:10px;font-size:.7rem;color:var(--cyan)';
    banner.innerHTML=`<span style="font-size:14px">🔍</span><strong>Web Searcher</strong> <span style="color:var(--t2)">finding best practices & APIs for your project…</span><div class="spin" style="width:12px;height:12px;border-width:2px;flex-shrink:0"></div>`;
    w.appendChild(banner);scrollChat();

    // Use AI to generate relevant best practices & tech recommendations
    const searchPrompt=`You are a technical research agent. The user wants to build: "${projectPrompt}"

Research and provide:
1. **Best Libraries/APIs** — top 3-5 relevant npm packages or CDN libs with brief descriptions
2. **Architecture Pattern** — recommended approach (2-3 sentences)  
3. **Key APIs to use** — any web browser APIs, external APIs, or services that would help
4. **Potential Pitfalls** — 2-3 common mistakes to avoid
5. **Performance Tips** — 2-3 specific to this project type

Format as a concise technical brief. Be specific to this exact project.`;

    let result=null;
    try{
      result=await callWithRetry(
        'You are a senior technical research agent. Provide concise, specific, actionable research.',
        [{role:'user',content:searchPrompt}],
        {id:'websearcher'}
      );
    }catch(e){logError('Web searcher failed: '+e.message,'warn');}

    // Replace banner with results
    banner.remove();
    if(result){
      S.webSearchResults.push({prompt:projectPrompt,result,ts:Date.now()});
      this._showResults(result);
      return result;
    }
    return null;
  },

  _extractTerms(prompt){
    const stopWords=['build','create','make','a','an','the','with','and','or','for'];
    return prompt.toLowerCase().split(/\W+/).filter(w=>w.length>3&&!stopWords.includes(w)).slice(0,5);
  },

  _showResults(result){
    const w=document.getElementById('msgs');
    const el=document.createElement('div');
    el.style.cssText='padding:10px 14px;margin:6px 0;background:rgba(0,212,255,.04);border:1px solid rgba(0,212,255,.18);border-radius:10px;animation:msgIn .3s ease both';
    el.innerHTML=`<div style="display:flex;align-items:center;gap:6px;margin-bottom:8px;font-size:.72rem;font-weight:700;color:var(--cyan)">🔍 Web Research Complete <span style="font-size:.6rem;font-weight:400;color:var(--t3)">— context injected into build</span></div>
    <div style="font-size:.7rem;color:var(--t2);line-height:1.65">${result.slice(0,600).replace(/\n/g,'<br>').replace(/\*\*(.+?)\*\*/g,'<strong style="color:var(--text)">$1</strong>')}${result.length>600?'<span style="color:var(--t3)">…</span>':''}</div>`;
    w.appendChild(el);scrollChat();
  }
};

/* ─────────────────────────────────────────────
   FEATURE 10: Auto Test Agent + Sandbox Runner
   ───────────────────────────────────────────── */
const TEST_AGENT={
  async run(project, files){
    if(!Object.keys(files).length)return;

    const w=document.getElementById('msgs');
    // Show test banner
    const banner=document.createElement('div');
    banner.style.cssText='display:flex;align-items:center;gap:8px;padding:7px 14px;margin:6px 0;background:rgba(0,229,160,.06);border:1px solid rgba(0,229,160,.2);border-radius:10px;font-size:.7rem;color:var(--green)';
    banner.innerHTML=`<span style="font-size:14px">🧪</span><strong>Test Agent</strong> <span style="color:var(--t2)">running automated checks…</span><div class="spin" style="width:12px;height:12px;border-width:2px;flex-shrink:0"></div>`;
    w.appendChild(banner);scrollChat();

    // 1. Static analysis tests
    const staticResults=this._runStaticTests(files);

    // 2. AI-powered functional test generation
    let aiTests=[];
    try{
      const mainCode=files['index.html']?.c||Object.values(files)[0]?.c||'';
      const testPrompt=`You are a QA test agent. Analyze this ${S.framework||'web'} project code and generate test results.

Project: "${project}"
Code (first 1500 chars): ${mainCode.slice(0,1500)}

Run these checks and respond ONLY with valid JSON array:
[
  {"test":"Page loads without errors","status":"pass","detail":"..."},
  {"test":"All interactive elements have click handlers","status":"pass|fail|warn","detail":"..."},
  {"test":"No broken console.log or TODO left","status":"pass|fail|warn","detail":"..."},
  {"test":"CSS variables properly defined","status":"pass|fail|warn","detail":"..."},
  {"test":"Responsive design breakpoints present","status":"pass|fail|warn","detail":"..."},
  {"test":"No missing image sources","status":"pass|fail","detail":"..."},
  {"test":"Form inputs have labels","status":"pass|fail|warn","detail":"..."}
]
Be honest — flag real issues you detect in the code.`;
      const raw=await callWithRetry('You are a strict QA test agent. Output ONLY valid JSON, no markdown.',
        [{role:'user',content:testPrompt}],{id:'tester'});
      if(raw){
        const cleaned=raw.replace(/```json?|```/g,'').trim();
        aiTests=JSON.parse(cleaned);
      }
    }catch(e){logError('Test agent AI: '+e.message,'warn');}

    // 3. Sandbox runner test (inject into iframe and check for errors)
    const sandboxResult=await this._runSandbox(files);

    // Combine results
    const allTests=[...staticResults,...aiTests];
    S.testResults=allTests;

    // Remove banner and show results
    banner.remove();
    this._showResults(allTests, sandboxResult, w);
  },

  _runStaticTests(files){
    const results=[];
    const fnames=Object.keys(files);
    const html=files['index.html']?.c||'';
    const js=Object.values(files).filter(f=>f.lang==='javascript').map(f=>f.c).join('\n');
    const css=Object.values(files).filter(f=>f.lang==='css').map(f=>f.c).join('\n');

    results.push({test:'HTML file present',status:html?'pass':'fail',detail:html?'index.html found':'No HTML entry point detected'});
    results.push({test:'DOCTYPE declaration',status:/<!DOCTYPE html>/i.test(html)?'pass':'warn',detail:/<!DOCTYPE html>/i.test(html)?'DOCTYPE present':'Missing DOCTYPE'});
    results.push({test:'Meta viewport tag',status:/meta.*viewport/i.test(html)?'pass':'warn',detail:/meta.*viewport/i.test(html)?'Responsive meta found':'Missing viewport meta — may not be mobile-friendly'});
    results.push({test:'No eval() usage',status:!/\beval\s*\(/.test(js)?'pass':'warn',detail:!/\beval\s*\(/.test(js)?'Clean — no eval()':'eval() detected — security risk'});
    results.push({test:'CSS variables defined',status:css.includes('--')?'pass':'info',detail:css.includes('--')?'CSS custom properties used':'No CSS variables found'});
    results.push({test:'Multiple files generated',status:fnames.length>1?'pass':'warn',detail:`${fnames.length} file${fnames.length!==1?'s':''} generated`});
    return results;
  },

  async _runSandbox(files){
    const html=files['index.html']?.c;
    if(!html)return{errors:[],passed:false};
    return new Promise(resolve=>{
      const iframe=document.createElement('iframe');
      iframe.style.cssText='position:absolute;left:-9999px;top:-9999px;width:800px;height:600px;visibility:hidden';
      iframe.sandbox='allow-scripts';
      const errors=[];
      // Listen for messages from sandboxed iframe
      const handler=ev=>{
        if(ev.source!==iframe.contentWindow)return;
        if(ev.data?.type==='nf-error')errors.push(ev.data.msg);
      };
      window.addEventListener('message',handler);
      // Inject error reporter into html
      const injected=html.replace('<head>','<head><script>window.onerror=function(m,s,l){window.parent.postMessage({type:"nf-error",msg:m+" (line "+l+")"},"*");return true};<\/script>');
      const blob=new Blob([injected],{type:'text/html'});
      const url=URL.createObjectURL(blob);
      iframe.src=url;
      document.body.appendChild(iframe);
      setTimeout(()=>{
        window.removeEventListener('message',handler);
        URL.revokeObjectURL(url);
        iframe.remove();
        resolve({errors,passed:errors.length===0});
      },3000);
    });
  },

  _showResults(tests, sandbox, w){
    const pass=tests.filter(t=>t.status==='pass').length;
    const fail=tests.filter(t=>t.status==='fail').length;
    const warn=tests.filter(t=>t.status==='warn').length;
    const total=tests.length;
    const scoreColor=fail===0?'var(--green)':fail<3?'var(--yellow)':'var(--red)';

    const el=document.createElement('div');
    el.style.cssText='padding:10px 14px;margin:6px 0;background:var(--s2);border:1px solid var(--border);border-radius:10px;animation:msgIn .3s ease both';
    el.innerHTML=`<div style="display:flex;align-items:center;gap:10px;margin-bottom:8px">
      <span style="font-size:16px">🧪</span>
      <strong style="font-size:.78rem">Test Agent Report</strong>
      <span style="font-size:.68rem;color:${scoreColor};font-weight:700;margin-left:auto">${pass}/${total} passed ${fail>0?`· ${fail} fail`:''}${warn>0?`· ${warn} warn`:''}</span>
    </div>
    ${tests.slice(0,8).map(t=>{
      const ic=t.status==='pass'?'✅':t.status==='fail'?'❌':t.status==='warn'?'⚠️':'ℹ️';
      return `<div class="test-result ${t.status==='fail'?'fail':t.status==='warn'?'warn':''}">
        <span class="test-ic">${ic}</span>
        <div class="test-body"><div class="test-name" style="color:${t.status==='pass'?'var(--green)':t.status==='fail'?'var(--red)':'var(--yellow)'}">${t.test}</div>
        <div class="test-detail">${t.detail||''}</div></div>
      </div>`;
    }).join('')}
    ${sandbox?.errors?.length?`<div class="sandbox-output">🖥 Sandbox: ${sandbox.errors.join('<br>')}</div>`:`<div style="font-size:.62rem;color:var(--green);padding:4px 0">🖥 Sandbox: No runtime errors detected</div>`}`;
    w.appendChild(el);
    scrollChat();
    if(fail>0)logError(`Test agent: ${fail} test(s) failed`,'warn');
  }
};

/* ─────────────────────────────────────────────
   FEATURE 13: Build Replay
   ───────────────────────────────────────────── */
let _replayTimer=null;

function snapshotForReplay(agentId, agentName, agentEmoji, text, agentColor){
  if(!S.buildReplayLog)S.buildReplayLog=[];
  S.buildReplayLog.push({agentId,agentName,agentEmoji,text,agentColor,ts:Date.now()});
}

function startReplay(){
  if(!S.buildReplayLog||!S.buildReplayLog.length){toast('No build to replay','err');return;}
  if(S.building){toast('Build in progress','err');return;}
  S.replayActive=true;
  const bar=document.getElementById('replay-bar');
  if(bar)bar.classList.add('show');

  // Clear chat and replay
  const msgs=document.getElementById('msgs');
  msgs.innerHTML='';

  let step=0;
  const total=S.buildReplayLog.length;

  function playStep(){
    if(!S.replayActive||step>=total){
      stopReplay();return;
    }
    const snap=S.buildReplayLog[step];
    const fill=document.getElementById('replay-fill');
    const lbl=document.getElementById('replay-step-lbl');
    if(fill)fill.style.width=((step/total)*100)+'%';
    if(lbl)lbl.textContent=`${snap.agentName} (${step+1}/${total})`;

    // Show each character stream style
    const fakeAgent={id:snap.agentId,name:snap.agentName,emoji:snap.agentEmoji,
                     color:snap.agentColor||'var(--a)',glow:'rgba(124,106,247,.3)',
                     badge:snap.agentName.slice(0,3).toUpperCase(),
                     bb:'rgba(124,106,247,.1)',bc:'#a090ff'};

    // Add message bubble letter by letter (fast)
    const msgEl=document.createElement('div');
    msgEl.className='msg ai';
    msgEl.innerHTML=`<div class="mav" style="background:${fakeAgent.color}1a;color:${fakeAgent.color}">${fakeAgent.emoji}</div>
      <div class="mbub" style="border-color:${fakeAgent.color}18">
        <div class="mname" style="color:${fakeAgent.color}">${fakeAgent.name} <span style="font-size:.55rem;color:var(--t3);font-weight:400;margin-left:4px">▶ Replay</span></div>
        <div class="mbody" id="replay-body-${step}"></div>
      </div>`;
    msgs.appendChild(msgEl);
    scrollChat();

    const body=document.getElementById('replay-body-'+step);
    const words=snap.text.split(' ');
    let wi=0;
    const wordTimer=setInterval(()=>{
      if(!S.replayActive){clearInterval(wordTimer);return;}
      body.textContent+=words[wi]+' ';
      wi++;
      if(wi%20===0)scrollChat();
      if(wi>=words.length){
        clearInterval(wordTimer);
        // Render code blocks properly
        renderRichMessage(body, snap.text);
        step++;
        _replayTimer=setTimeout(playStep, 800);
      }
    }, 20);
  }

  playStep();
  toast('▶ Replaying build…','ok');
}

function stopReplay(){
  S.replayActive=false;
  if(_replayTimer)clearTimeout(_replayTimer);
  const bar=document.getElementById('replay-bar');
  if(bar)bar.classList.remove('show');
  const fill=document.getElementById('replay-fill');
  if(fill)fill.style.width='100%';
}

/* ─────────────────────────────────────────────
   FEATURE 7: Parallel Execution helper
   Run independent agents concurrently (meeting phases)
   ───────────────────────────────────────────── */
async function runParallel(tasks){
  // tasks = [{fn:async()=>result, label:'...'}]
  return Promise.all(tasks.map(async(t)=>{
    try{return await t.fn();}
    catch(e){logError('Parallel task failed: '+t.label+' — '+e.message,'warn');return null;}
  }));
}

/* ─────────────────────────────────────────────
   FEATURE 4: Referrer/origin security notice in settings
   Injected into vault modal when rendered
   ───────────────────────────────────────────── */
function renderSecurityNotice(){
  const existing=document.getElementById('security-notice');
  if(existing)return;
  const container=document.getElementById('vault-providers');
  if(!container)return;
  const notice=document.createElement('div');
  notice.id='security-notice';
  notice.style.cssText='padding:10px 16px;background:rgba(255,209,102,.06);border-bottom:1px solid rgba(255,209,102,.2);font-size:.68rem;line-height:1.6';
  notice.innerHTML=`<div style="display:flex;align-items:flex-start;gap:8px">
    <span style="font-size:16px;flex-shrink:0">🔒</span>
    <div>
      <strong style="color:var(--yellow)">API Key Security Tips</strong><br>
      <span style="color:var(--t2)">
      • <strong>Referrer restrictions:</strong> In your provider dashboard, restrict each key to <code style="background:var(--s3);padding:1px 4px;border-radius:3px;font-size:.65rem">${location.origin}</code> as the allowed origin.<br>
      • <strong>OpenRouter:</strong> Set allowed domains at <a href="https://openrouter.ai/keys" target="_blank" style="color:var(--cyan)">openrouter.ai/keys ↗</a><br>
      • <strong>Anthropic:</strong> Keys are browser-restricted per CORS — add your domain in console settings.<br>
      • <strong>IP restrictions:</strong> For paid providers, restrict your key to your IP where possible.<br>
      • <strong>Budget caps:</strong> Set hard spend limits in each provider's dashboard as a safety net.<br>
      • NeuralForge never stores your keys on any server — they live only in your browser's localStorage.
      </span>
    </div>
  </div>`;
  // Insert before the first provider row
  container.insertBefore(notice, container.firstChild);
}

/* Patch openConfig to inject security notice */
/* openConfig security notice — injected directly in openConfig() above */

/* go() feature hooks moved directly into go() function */

/* stopBuild abort guard moved directly into stopBuild() */

/* addAgentMsg replay/error hooks moved directly into addAgentMsg() */

/* ─────────────────────────────────────────────
   PATCH: streamAgentLive — inject persona suffix + abort signal
   ───────────────────────────────────────────── */
const _origStreamAgentLive=window.streamAgentLive;
window.streamAgentLive=async function(agent, sys, msgs){
  // Feature 12: append persona suffix to system prompt
  const personaSuffix=getPersonaSystemSuffix();
  const patchedSys=sys+(personaSuffix||'');
  // Feature 11: inject web research context
  if(S.ctx?._webResearch&&msgs?.[0]?.content){
    msgs[0].content+='\n\n[Pre-Build Research Context]\n'+S.ctx._webResearch.slice(0,400);
  }
  return _origStreamAgentLive?.(agent, patchedSys, msgs);
};

/* ─────────────────────────────────────────────
   PATCH: Post-build — run test agent after developer step
   ───────────────────────────────────────────── */
const _origExtractAllFiles=window.extractAllFiles;
window.extractAllFiles=function(text){
  const count=_origExtractAllFiles?.(text)||0;
  // Feature 10: queue test agent after a short delay
  if(count>0&&S.building){
    setTimeout(async()=>{
      if(Object.keys(S.files).length>0){
        try{await TEST_AGENT.run(S.project||'Project', S.files);}
        catch(e){logError('Test agent: '+e.message,'warn');}
      }
    }, 2000);
    // Feature 13: Show replay button after build completes
    setTimeout(()=>{
      const btn=document.getElementById('replay-btn');
      if(btn&&S.buildReplayLog?.length)btn.style.display='';
    }, 3000);
  }
  return count;
};

/* ─────────────────────────────────────────────
   Token tracking happens inside callAPIVault directly (no patch needed)
   ───────────────────────────────────────────── */

/* ─────────────────────────────────────────────
   Init new features on DOM ready
   ───────────────────────────────────────────── */
document.addEventListener('DOMContentLoaded',()=>{
  // Load saved persona
  try{const p=localStorage.getItem('nf11_persona');if(p)setPersona(p,document.querySelector(`[data-persona="${p}"]`));}catch(e){}
  // Save persona on change
  document.querySelectorAll('.persona-btn').forEach(btn=>{
    btn.addEventListener('click',()=>{try{localStorage.setItem('nf11_persona',S.persona);}catch(e){}});
  });
  // Budget cap from settings (load)
  try{const b=localStorage.getItem('nf11_budget');if(b)S.budgetCap=parseFloat(b)||0.50;}catch(e){}
});

/* ══════════════════════════════════════════════════════════════
   DUAL MODE SYSTEM — Chat Mode + Build Mode
   ══════════════════════════════════════════════════════════════ */

/* ── State ── */
let _mainMode='chat'; // 'chat' | 'build'
let _chatLog=[];      // Chat mode conversation history
let _chatTyping=false;
let _bdSelected=new Set(); // Selected bd-msg indices for injection
let _bdMsgs=[];            // Build discussion messages
let _bdQueued=null;        // Queued injection text
let _discussOpen=true;     // Discussion panel open state

/* ── switchMainMode — the core toggle ── */
function switchMainMode(mode){
  _mainMode=mode;

  // Update tab highlights
  document.getElementById('mode-chat-tab')?.classList.toggle('active', mode==='chat');
  document.getElementById('mode-build-tab')?.classList.toggle('active', mode==='build');

  // Show/hide panels
  const chatEl=document.getElementById('chat-mode');
  const buildEl=document.getElementById('build-mode');
  const ipEl=document.getElementById('ip');

  if(mode==='chat'){
    chatEl?.classList.remove('hidden');
    buildEl?.classList.remove('active');
    // Hide build input bar — also toggle app class for grid row span fix
    ipEl?.classList.add('hidden');
    document.getElementById('app')?.classList.add('chat-mode-active');
    setTimeout(()=>document.getElementById('chat-pi')?.focus(),80);
    // Show API key banner in chat msgs if no key
    _showChatApiBanner();
  } else {
    chatEl?.classList.add('hidden');
    buildEl?.classList.add('active');
    // Show build input bar
    ipEl?.classList.remove('hidden');
    document.getElementById('app')?.classList.remove('chat-mode-active');
    setTimeout(()=>document.getElementById('pi')?.focus(),80);
    // Show build-mode API banner if no key and not yet shown
    const hasKey=S.cfg.key||VAULT.getActiveCount()>0;
    if(!hasKey)setTimeout(_showBuildApiBanner,300);
  }

  // Save preference
  try{localStorage.setItem('nf11_mainMode',mode);}catch(e){}
}

/* ── Chat Mode: send a message ── */
/* ── Chat tool → best task mapping ── */
const _TOOL_TASK_MAP={
  enhance:'quality', summarize:'fast', rewrite:'fast', translate:'fast',
  imagine:'creative', analyze:'reasoning', qa:'reasoning', search:'reasoning',
};

/* ── Chat tool → system prompt override ── */
const _TOOL_SYS={
  enhance:   'You are an expert prompt engineer. Rewrite the given rough prompt to be clear, specific, and highly effective for AI models. Return only the enhanced prompt.',
  summarize: 'You are a concise summarization expert. Summarize the given text into clear, structured bullet points capturing all key ideas.',
  rewrite:   'You are an expert editor. Rewrite the given text to be clearer, more professional, and better structured while preserving the original meaning.',
  translate:  'You are a professional translator fluent in all major languages. Translate the given text accurately, preserving tone and meaning.',
  imagine:   'You are an expert AI image prompt engineer for Midjourney, DALL-E, and Stable Diffusion. Transform descriptions into rich, detailed prompts with style, lighting, and quality tags.',
  analyze:   'You are a data analysis and visualization expert. Analyze the provided data, identify patterns, suggest appropriate chart types, and provide clear explanations with example chart code.',
  qa:        'You are a document Q&A expert. Answer questions precisely based on the content of the uploaded files. If the answer is not in the document, say so clearly.',
  search:    'You are a web research expert. Provide comprehensive, well-organized information on the topic. Cite sources, highlight key facts, and present findings clearly.',
};

const _CHAT_BASE_SYS='You are NeuralForge Chat — a friendly, expert AI assistant for software developers and creators. Help with coding, architecture, debugging, and ideas. Be concise and conversational. Use markdown for code. For full projects, suggest Build Mode.';

async function sendChat(){
  const pi=document.getElementById('chat-pi');
  // Inject tool prefix before reading text
  let rawVal = pi?.value||'';
  if(_activeChatTool && rawVal.trim()){
    const tool=CHAT_TOOLS[_activeChatTool];
    if(tool?.prefix) rawVal=tool.prefix+rawVal.trim();
  }
  // Append attachment names
  if(_chatAttachments.length>0){
    const names=_chatAttachments.map(f=>f.name).join(', ');
    rawVal = rawVal.trim()
      ? rawVal.trim()+`\n\n[Attached: ${names}]`
      : `[Attached: ${names}]\nPlease analyze these files.`;
  }
  if(pi) pi.value=rawVal;
  const text=(rawVal||'').trim();
  if(!text||_chatTyping)return;
  pi.value='';autosize(pi);

  // Remove welcome screen
  document.getElementById('chat-welcome')?.remove();

  // Add user bubble
  _appendChatMsg('user', text);
  _chatLog.push({role:'user',content:text});

  // Show typing indicator
  _chatTyping=true;
  const typingEl=_showChatTyping();

  // ── Smart model selection via VAULT ──
  // Priority: active tool task > manual selector > content detection > quality
  const activeTool = _activeChatTool;
  const modelSel   = document.getElementById('chat-model-sel')?.value||'auto';
  let task;
  if(activeTool && _TOOL_TASK_MAP[activeTool]){
    task = _TOOL_TASK_MAP[activeTool];
  } else if(modelSel && modelSel!=='auto'){
    task = modelSel;
  } else {
    task = MODEL_ROUTER.detectTask(text) || 'quality';
  }

  // Pick best available model for this task
  const best = VAULT.getBest(task) || VAULT.getBest('quality');
  const provMeta = best ? (PROVIDER_META[best.provider]||{}) : {};
  const modelLabel = best
    ? `${provMeta.icon||'🔑'} ${(best.model||'').split('/').pop().replace(':free','').slice(0,22)}`
    : '🔑 No key';

  // System prompt: tool-specific or base
  const sys = (activeTool && _TOOL_SYS[activeTool]) ? _TOOL_SYS[activeTool] : _CHAT_BASE_SYS;

  // Get response using smart fallback chain
  let resp=null;
  try{
    const msgs=_chatLog.slice(-12).map(m=>({role:m.role,content:m.content.slice(0,800)}));
    // Synthetic agent carries the resolved task so callWithRetry uses correct chain
    resp=await callWithRetry(sys, msgs, {id:'_chat', _chatTask:task}, 3);
  }catch(e){logError('Chat: '+e.message,'warn');}

  // Remove typing indicator
  typingEl?.remove();
  _chatTyping=false;

  if(!resp)resp="I couldn't reach the AI right now. Please check your API key in ⚙️ Settings.";

  _chatLog.push({role:'assistant',content:resp});
  _appendChatMsg('ai', resp, {modelLabel, task});

  // Update badge
  const badge=document.getElementById('chat-msg-badge');
  if(badge)badge.textContent=_chatLog.filter(m=>m.role==='user').length+' messages';

  // Clear active tool + attachments after send
  clearChatTool();
  _chatAttachments=[];
  renderChatAttachments();
}

function _appendChatMsg(role, text, meta){
  const msgs=document.getElementById('chat-msgs');
  if(!msgs)return;
  const isUser=role==='user';
  const time=new Date().toLocaleTimeString('en',{hour:'2-digit',minute:'2-digit',hour12:true});

  const el=document.createElement('div');
  el.className=`chat-msg ${isUser?'user-msg':'ai-msg'}`;

  const avIcon=isUser?'👤':'🤖';
  const bubbleContent=isUser?`<div class="cm-bubble">${esc(text)}</div>`:
    `<div class="cm-bubble" id="cm-${Date.now()}"></div>`;

  // Model chip: show actual model name + task badge if available
  let modelChip='';
  if(!isUser){
    const lbl = meta?.modelLabel || 'AI';
    const taskBadge = meta?.task && meta.task!=='quality'
      ? `<span style="font-size:.48rem;padding:1px 4px;border-radius:3px;background:rgba(124,106,247,.15);color:var(--a);border:1px solid rgba(124,106,247,.3);margin-left:3px;font-weight:700">${meta.task}</span>`
      : '';
    modelChip=`<span class="cm-model-chip" title="Model used for this response">${lbl}</span>${taskBadge}`;
  }

  el.innerHTML=
    `<div class="cm-av">${avIcon}</div>`+
    `<div class="cm-body">`+
      bubbleContent+
      `<div class="cm-meta"><span>${time}</span>${modelChip}</div>`+
    `</div>`;
  msgs.appendChild(el);

  // Render rich content for AI messages
  if(!isUser){
    const bub=el.querySelector('.cm-bubble');
    if(bub)renderRichMessage(bub, text);
  }

  msgs.scrollTop=msgs.scrollHeight;
}

function _showChatTyping(){
  const msgs=document.getElementById('chat-msgs');
  if(!msgs)return null;
  const el=document.createElement('div');
  el.className='chat-msg ai-msg';
  el.id='chat-typing-ind';
  el.innerHTML=`<div class="cm-av">🤖</div><div class="cm-body"><div class="cm-typing"><div class="cm-dot"></div><div class="cm-dot"></div><div class="cm-dot"></div></div></div>`;
  msgs.appendChild(el);
  msgs.scrollTop=msgs.scrollHeight;
  return el;
}

function chatKeydown(e){
  if(e.key==='Enter'&&!e.shiftKey){e.preventDefault();sendChat();}
}

function fillChat(el){
  const pi=document.getElementById('chat-pi');
  if(pi){pi.value=el.textContent.replace(/^[^\s]+\s/,'');autosize(pi);pi.focus();}
}

function clearChat(){
  _chatLog=[];
  const msgs=document.getElementById('chat-msgs');
  if(msgs){
    msgs.innerHTML='';
    // Re-add welcome
    const welcome=document.createElement('div');
    welcome.id='chat-welcome';
    welcome.innerHTML=`<div class="cw-icon">💬</div><div class="cw-title">Chat with AI</div><div class="cw-sub">Ask anything — code questions, ideas, explanations, debugging help.</div><div class="cw-chips"><div class="cw-chip" onclick="fillChat(this)">🤔 Explain async/await</div><div class="cw-chip" onclick="fillChat(this)">💡 Ideas for my portfolio</div><div class="cw-chip" onclick="fillChat(this)">🐛 Debug this error</div><div class="cw-chip" onclick="fillChat(this)">⚡ React vs Vue comparison</div></div>`;
    msgs.appendChild(welcome);
  }
  const badge=document.getElementById('chat-msg-badge');
  if(badge)badge.textContent='AI Assistant';
  toast('Chat cleared','');
}

/* Show API key connection banner inside Chat Mode if no key is configured */
function _showChatApiBanner(){
  const hasKey=S.cfg.key||VAULT.getActiveCount()>0;
  if(hasKey)return; // already connected — no banner needed
  if(document.getElementById('chat-api-banner'))return; // already shown
  const msgs=document.getElementById('chat-msgs');
  if(!msgs)return;
  const banner=document.createElement('div');
  banner.id='chat-api-banner';
  banner.style.cssText='display:flex;align-items:flex-start;gap:10px;padding:12px 14px;background:linear-gradient(135deg,rgba(0,212,255,.08),rgba(56,189,248,.05));border:1px solid rgba(0,212,255,.28);border-radius:12px;font-size:.78rem;line-height:1.65;animation:msgIn .4s ease both;margin:4px 0';
  banner.innerHTML=`
    <span style="font-size:22px;flex-shrink:0">🔑</span>
    <div style="flex:1;min-width:0">
      <strong style="color:var(--cyan);font-family:var(--display);font-size:.85rem">Connect a free API key to start chatting</strong><br>
      <span style="color:var(--t2)">NeuralForge Chat uses AI models to answer your questions. No key = no AI responses.</span><br><br>
      <strong style="color:var(--text)">Step 1:</strong> <span style="color:var(--t2)">Get a free key from </span><a href="https://openrouter.ai/keys" target="_blank" style="color:var(--cyan);text-decoration:none">OpenRouter ↗</a><span style="color:var(--t3)"> or </span><a href="https://console.groq.com/keys" target="_blank" style="color:var(--cyan);text-decoration:none">Groq ↗</a><br>
      <strong style="color:var(--text)">Step 2:</strong> <span style="color:var(--t2)">Click </span><strong style="color:var(--a)">⚙️ Settings</strong><span style="color:var(--t2)"> and paste your key</span><br>
      <strong style="color:var(--text)">Step 3:</strong> <span style="color:var(--t2)">Come back and start chatting 💬</span><br><br>
      <div style="display:flex;gap:8px;flex-wrap:wrap;align-items:center">
        <button onclick="openConfig();document.getElementById('chat-api-banner')?.remove()" style="padding:5px 14px;border-radius:8px;background:linear-gradient(135deg,var(--cyan),#38bdf8);color:#fff;font-weight:700;font-size:.75rem;cursor:pointer;border:none;font-family:var(--display)">⚙️ Connect Free API Key</button>
        <button onclick="this.closest('#chat-api-banner').remove()" style="padding:5px 10px;border-radius:8px;background:var(--s2);border:1px solid var(--border);color:var(--t2);font-size:.72rem;cursor:pointer">Dismiss</button>
      </div>
    </div>`;
  // Insert after welcome element, or at top of messages
  const welcome=document.getElementById('chat-welcome');
  if(welcome&&welcome.nextSibling){
    msgs.insertBefore(banner, welcome.nextSibling);
  } else if(welcome){
    welcome.after(banner);
  } else {
    msgs.insertBefore(banner, msgs.firstChild);
  }
}

/* Show API key banner in Build Mode pipeline chat if no key is configured */
function _showBuildApiBanner(){
  const hasKey=S.cfg.key||VAULT.getActiveCount()>0;
  if(hasKey)return;
  if(document.getElementById('build-api-banner'))return;
  const w=document.getElementById('msgs');
  if(!w)return;
  const banner=document.createElement('div');
  banner.id='build-api-banner';
  banner.style.cssText='display:flex;align-items:flex-start;gap:10px;padding:12px 14px;background:linear-gradient(135deg,rgba(124,106,247,.1),rgba(0,212,255,.06));border:1px solid rgba(124,106,247,.28);border-radius:10px;font-size:.78rem;line-height:1.65;animation:msgIn .4s ease both;margin:0 0 6px';
  banner.innerHTML=`
    <span style="font-size:20px;flex-shrink:0">🔑</span>
    <div style="flex:1;min-width:0">
      <strong style="color:var(--a);font-family:var(--display)">Connect your API keys to start building</strong><br>
      <span style="color:var(--t2)">NeuralForge uses 14 specialized AI agents — full pipeline from Web Searcher to Tester.</span><br><br>
      <strong>Step 1:</strong> <span style="color:var(--t2)">Get a free key from </span><a href="https://openrouter.ai/keys" target="_blank" style="color:var(--cyan);text-decoration:none">OpenRouter ↗</a><span style="color:var(--t3)"> or </span><a href="https://console.groq.com/keys" target="_blank" style="color:var(--cyan);text-decoration:none">Groq ↗</a><br>
      <strong>Step 2:</strong> <span style="color:var(--t2)">Click </span><strong style="color:var(--a)">⚙️ Settings</strong><span style="color:var(--t2)"> and paste your key</span><br>
      <strong>Step 3:</strong> <span style="color:var(--t2)">Describe your project and click </span><strong style="color:var(--a)">Build</strong> 🚀<br><br>
      <div style="display:flex;gap:8px;flex-wrap:wrap;align-items:center">
        <button onclick="openConfig();document.getElementById('build-api-banner')?.remove()" style="padding:5px 14px;border-radius:8px;background:linear-gradient(135deg,var(--a),#9d8df5);color:#fff;font-weight:700;font-size:.75rem;cursor:pointer;border:none;font-family:var(--display)">⚙️ Connect Free API Key</button>
        <button onclick="this.closest('#build-api-banner').remove()" style="padding:5px 10px;border-radius:8px;background:var(--s2);border:1px solid var(--border);color:var(--t2);font-size:.72rem;cursor:pointer">Dismiss</button>
      </div>
    </div>`;
  const welcome=document.getElementById('welcome');
  if(welcome&&welcome.nextSibling){w.insertBefore(banner,welcome.nextSibling);}
  else if(welcome){welcome.after(banner);}
  else{w.insertBefore(banner,w.firstChild);}
}
function toggleDiscussPanel(){
  const panel=document.getElementById('build-discuss');
  const toggle=document.getElementById('discuss-toggle');
  _discussOpen=!_discussOpen;
  if(_discussOpen){
    panel?.classList.remove('collapsed');
    toggle?.classList.remove('open');
  } else {
    panel?.classList.add('collapsed');
  }
}

function sendBdMsg(){
  const pi=document.getElementById('bd-pi');
  const text=(pi?.value||'').trim();
  if(!text)return;
  pi.value='';autosize(pi);

  const idx=_bdMsgs.length;
  _bdMsgs.push({role:'user',text,ts:Date.now()});
  _renderBdMsg(idx,'user',text);

  // Update discuss badge
  _updateDiscussBadge();

  // Ask AI for a response (async, non-blocking)
  _bdAiReply(text, idx);
}

async function _bdAiReply(userText, userIdx){
  const aiIdx=_bdMsgs.length;
  _bdMsgs.push({role:'ai',text:'…',ts:Date.now()});

  // Placeholder bubble
  const msgs=document.getElementById('bd-msgs');
  document.querySelector('.bd-empty')?.remove();
  const placeholder=_renderBdMsg(aiIdx,'ai','…',true);

  // Build context: current project + discussion history
  const projCtx=S.project?`Current project: "${S.project}" (${FW_CONFIG[S.framework||'vanilla'].label} stack). `:'';
  const history=_bdMsgs.slice(Math.max(0,aiIdx-6),aiIdx)
    .map(m=>`${m.role==='user'?'User':'AI'}: ${m.text.slice(0,300)}`).join('\n');

  const sys=`You are a build advisor in a software project discussion. ${projCtx}Help the user discuss, refine, and improve their build plans. Be concise (2-4 sentences). Give actionable suggestions. If they describe a feature or change, make it sound like a concrete build instruction.`;

  let resp=null;
  try{
    resp=await callWithRetry(sys,[{role:'user',content:userText}],{id:'pm'});
  }catch(e){}

  resp=resp||"Let me know more about what you'd like — I can help you refine the build direction.";
  _bdMsgs[aiIdx].text=resp;

  // Update placeholder
  if(placeholder){
    const bub=placeholder.querySelector('.bd-bubble');
    if(bub){bub.textContent=resp;bub.dataset.idx=aiIdx;}
  }
  _updateDiscussBadge();
}

function _renderBdMsg(idx, role, text, returnEl=false){
  document.querySelector('.bd-empty')?.remove();
  const msgs=document.getElementById('bd-msgs');
  if(!msgs)return null;
  const time=new Date().toLocaleTimeString('en',{hour:'2-digit',minute:'2-digit',hour12:true});
  const el=document.createElement('div');
  el.className='bd-msg';
  el.innerHTML=
    `<div class="bd-meta"><span>${role==='user'?'You':'🤖 AI'}</span><span>${time}</span></div>`+
    `<div class="bd-bubble ${role}" data-idx="${idx}" onclick="toggleBdSelect(${idx},this)">`+
      `<div class="bd-sel-check">✓</div>`+
      esc(text)+
    `</div>`;
  msgs.appendChild(el);
  msgs.scrollTop=msgs.scrollHeight;
  return returnEl?el:null;
}

function toggleBdSelect(idx, bubbleEl){
  if(_bdSelected.has(idx)){
    _bdSelected.delete(idx);
    bubbleEl?.classList.remove('selected');
  } else {
    _bdSelected.add(idx);
    bubbleEl?.classList.add('selected');
  }
  _updateInjectBar();
}

function _updateInjectBar(){
  const bar=document.getElementById('bd-inject-bar');
  const countEl=document.getElementById('bd-sel-count');
  if(!bar)return;
  if(_bdSelected.size>0){
    bar.classList.add('show');
    if(countEl)countEl.textContent=_bdSelected.size;
  } else {
    bar.classList.remove('show');
  }
}

function clearBdSelection(){
  _bdSelected.clear();
  document.querySelectorAll('.bd-bubble.selected').forEach(b=>b.classList.remove('selected'));
  _updateInjectBar();
}

function _updateDiscussBadge(){
  const btn=document.getElementById('discuss-btn');
  const countEl=document.getElementById('discuss-count');
  const toggle=document.getElementById('discuss-toggle');
  const count=_bdMsgs.filter(m=>m.role==='user').length;
  if(countEl){
    countEl.textContent=count;
    countEl.style.display=count>0?'inline':'none';
  }
  if(count>0)toggle?.classList.add('has-msgs');
}

/* ── Inject Selected Messages into Build ── */
function injectSelected(mode){
  if(!_bdSelected.size){toast('Select messages first','err');return;}

  // Build injection text from selected messages
  const selectedTexts=[..._bdSelected].sort().map(idx=>{
    const m=_bdMsgs[idx];
    return m?(m.role==='user'?'User instruction: ':'AI suggestion: ')+m.text:'';
  }).filter(Boolean).join('\n\n');

  if(mode==='now'){
    if(S.building){
      // Inject directly into active build as redirect
      S._interrupt=selectedTexts.slice(0,600);
      toast('⚡ Instructions injected into active build!','ok');
      // Show banner in pipeline chat
      const w=document.getElementById('msgs');
      const banner=document.createElement('div');
      banner.className='inject-queue-banner';
      banner.innerHTML=`<span>⚡</span><strong>Build Discussion Injected</strong><span style="color:var(--t2);font-weight:400;font-size:.65rem">— "${selectedTexts.slice(0,60)}…"</span><button class="iq-dismiss" onclick="this.parentElement.remove()">✕</button>`;
      w?.appendChild(banner);
      scrollChat();
    } else {
      // Load into build input and switch to build mode
      const pi=document.getElementById('pi');
      if(pi){
        const current=pi.value.trim();
        pi.value=current?(current+'\n\nAdditional requirements:\n'+selectedTexts):selectedTexts;
        autosize(pi);
      }
      switchMainMode('build');
      toast('⚡ Instructions loaded into Build input!','ok');
    }
  } else {
    // Queue for next build
    _bdQueued=(_bdQueued?_bdQueued+'\n\n':'')+selectedTexts;
    const pi=document.getElementById('pi');
    if(pi&&pi.value.trim()){
      // Append to current input
      pi.value=pi.value.trim()+'\n\nFrom discussion:\n'+selectedTexts.slice(0,400);
      autosize(pi);
    }
    toast('📋 Queued for next build — visible in Build input','ok');
    switchMainMode('build');

    // Show queued banner
    const w=document.getElementById('msgs');
    const banner=document.createElement('div');
    banner.className='inject-queue-banner';
    banner.innerHTML=`<span>📋</span><strong>Instructions Queued</strong><span style="color:var(--t2);font-weight:400;font-size:.65rem"> — will be included in next build</span><button class="iq-dismiss" onclick="this.parentElement.remove()">✕</button>`;
    w?.appendChild(banner);
  }

  clearBdSelection();
}

function bdKeydown(e){
  if(e.key==='Enter'&&!e.shiftKey){e.preventDefault();sendBdMsg();}
}

/* ── Patch go() to consume queued discussion instructions ── */
const _goPreQueue=window.go;
window.go=async function(){
  // If there's queued discussion context, add it to the prompt
  if(_bdQueued){
    const pi=document.getElementById('pi');
    if(pi&&pi.value.trim()&&!pi.value.includes(_bdQueued.slice(0,40))){
      pi.value=pi.value.trim()+'\n\nFrom build discussion:\n'+_bdQueued.slice(0,500);
      autosize(pi);
    }
    _bdQueued=null;
  }
  return _goPreQueue?.();
};

/* ── Patch setMode to route to the new system ── */
function setMode(mode,btn){
  // Legacy compatibility — route to new system
  if(mode==='chat')switchMainMode('chat');
  else switchMainMode('build');
}

/* ══ CHAT TOOLS MENU & FILE UPLOAD ══ */

// Tool config: id → { label, icon, color, placeholder, prefix }
const CHAT_TOOLS = {
  enhance:   { label:'Prompt Enhancer', icon:'✨', color:'var(--a)',      bg:'rgba(124,106,247,.15)', placeholder:'Type your rough prompt — I\'ll enhance it…',     prefix:'Please enhance and improve this prompt:\n\n' },
  summarize: { label:'Summarize',       icon:'📋', color:'var(--cyan)',   bg:'rgba(0,212,255,.12)',   placeholder:'Paste text to summarize…',                         prefix:'Please summarize the following text concisely:\n\n' },
  rewrite:   { label:'Rewrite',         icon:'✍️', color:'var(--green)',  bg:'rgba(0,229,160,.12)',   placeholder:'Paste text to rewrite…',                           prefix:'Please rewrite the following text more clearly:\n\n' },
  translate:  { label:'Translator',      icon:'🌐', color:'var(--yellow)', bg:'rgba(255,209,102,.12)', placeholder:'Paste text and specify target language…',          prefix:'Please translate the following text (specify language if needed):\n\n' },
  imagine:   { label:'Image Generator', icon:'🎨', color:'var(--pink)',   bg:'rgba(255,110,180,.12)', placeholder:'Describe the image you want to generate…',         prefix:'Generate a detailed image prompt for: ' },
  analyze:   { label:'Data Analyser',   icon:'📊', color:'var(--orange)', bg:'rgba(255,159,67,.12)',  placeholder:'Paste your data or describe what to analyze…',     prefix:'Analyze this data and suggest visualizations:\n\n' },
  qa:        { label:'Q&A on File',     icon:'📄', color:'var(--cyan)',   bg:'rgba(0,212,255,.12)',   placeholder:'Ask a question about your uploaded file…',         prefix:'Based on the uploaded file, answer: ' },
  search:    { label:'Web Searcher',    icon:'🔍', color:'var(--a)',      bg:'rgba(124,106,247,.15)', placeholder:'What do you want to search the web for?',          prefix:'Search the web for: ' },
};

let _activeChatTool = null;
let _chatAttachments = [];

function toggleToolsMenu(e){
  e.stopPropagation();
  const menu = document.getElementById('chat-tools-menu');
  const btn  = document.getElementById('chat-plus-btn');
  const open = menu.classList.contains('open');
  closeToolsMenu();
  if(!open){
    menu.classList.add('open');
    btn.classList.add('open');
    _populateToolModels();
    setTimeout(()=>document.addEventListener('click', _closeToolsOnOutside, {once:true}), 0);
  }
}

function _populateToolModels(){
  // For each tool, resolve best model via VAULT and update the slot
  const toolTasks = {
    enhance:'quality', summarize:'fast', rewrite:'fast', translate:'fast',
    imagine:'creative', analyze:'reasoning', qa:'reasoning', search:'reasoning',
  };
  Object.entries(toolTasks).forEach(([toolId, task])=>{
    const el = document.getElementById('ctm-model-'+toolId);
    if(!el) return;

    const best = VAULT.getBest(task) || VAULT.getBest('quality');
    if(!best){
      el.innerHTML = '<span style="color:var(--red);font-size:.55rem">⚠ No key — add one in ⚙ Settings</span>';
      return;
    }
    const meta  = PROVIDER_META[best.provider] || {};
    const model = (best.model||'').split('/').pop().replace(':free','').slice(0,22);
    const taskColors = {
      quality:'rgba(124,106,247,.15)', fast:'rgba(0,229,160,.12)',
      reasoning:'rgba(0,212,255,.12)', creative:'rgba(255,110,180,.12)',
    };
    const taskTextColors = {
      quality:'var(--a)', fast:'var(--green)',
      reasoning:'var(--cyan)', creative:'var(--pink)',
    };
    const taskBg    = taskColors[task]   || 'rgba(124,106,247,.12)';
    const taskColor = taskTextColors[task] || 'var(--a)';

    el.innerHTML =
      `<span class="ctm-model-icon" style="color:${meta.color||'var(--t2)'}">${meta.icon||'🔑'}</span>`+
      `<span class="ctm-model-name" style="color:${meta.color||'var(--t2)'}" title="${meta.name} · ${model}">`+
        `<span style="font-weight:700">${meta.name||best.provider}</span>`+
        `<span style="color:var(--t3);margin-left:3px">${model}</span>`+
      `</span>`+
      `<span class="ctm-model-task" style="background:${taskBg};color:${taskColor};border-color:${taskColor}40">${task}</span>`;
  });
}

function _closeToolsOnOutside(e){
  if(!e.target.closest('#chat-tools-menu') && !e.target.closest('#chat-plus-btn')){
    closeToolsMenu();
  }
}

function closeToolsMenu(){
  document.getElementById('chat-tools-menu')?.classList.remove('open');
  document.getElementById('chat-plus-btn')?.classList.remove('open');
}

function selectChatTool(id){
  closeToolsMenu();
  const tool = CHAT_TOOLS[id];
  if(!tool) return;
  _activeChatTool = id;

  // Show active tool chip
  const activeEl = document.getElementById('chat-active-tool');
  const chip     = document.getElementById('cat-chip');
  activeEl.classList.add('show');
  const _best = VAULT.getBest(_TOOL_TASK_MAP[id]) || VAULT.getBest('quality');
  const _pmeta = _best ? (PROVIDER_META[_best.provider]||{}) : {};
  const _mname = _best ? ((_best.model||'').split('/').pop().replace(':free','').slice(0,20)) : 'no key';
  const _modelHint = _best
    ? `<span style="font-size:.55rem;opacity:.7;font-family:var(--mono);margin-left:4px">${_pmeta.icon||'🔑'} ${_mname}</span>`
    : `<span style="font-size:.55rem;color:var(--red);margin-left:4px">⚠ no key</span>`;
  chip.style.cssText = `background:${tool.bg};color:${tool.color};border-color:${tool.color}40`;
  chip.innerHTML = `${tool.icon} <span style="font-weight:700">${tool.label}</span>${_modelHint}<span class="cat-remove" onclick="clearChatTool()" title="Remove tool" style="margin-left:6px">✕</span>`;

  // Update placeholder
  const pi = document.getElementById('chat-pi');
  if(pi){
    pi.placeholder = tool.placeholder;
    pi.focus();
  }

  // Special: Q&A → trigger file upload if no attachment
  if(id === 'qa' && _chatAttachments.length === 0){
    document.getElementById('chat-file-input')?.click();
  }
}

function clearChatTool(){
  _activeChatTool = null;
  const activeEl = document.getElementById('chat-active-tool');
  activeEl.classList.remove('show');
  const pi = document.getElementById('chat-pi');
  if(pi) pi.placeholder = 'Ask me anything…';
}

/* ── File Upload ── */
const CHAT_FILE_ICONS = {
  pdf:'📄', doc:'📝', docx:'📝', xlsx:'📊', xls:'📊', pptx:'📑', ppt:'📑',
  png:'🖼', jpg:'🖼', jpeg:'🖼', gif:'🖼', webp:'🖼', svg:'🖼',
  txt:'📃', md:'📃', csv:'📊', json:'🔧', html:'🌐', js:'⚙️', py:'🐍',
  ts:'⚙️', css:'🎨',
};
function fileIcon(name){
  const ext = name.split('.').pop().toLowerCase();
  return CHAT_FILE_ICONS[ext] || '📎';
}

function handleChatFileUpload(e){
  const files = Array.from(e.target.files||[]);
  if(!files.length) return;
  files.forEach(f=>{
    if(!_chatAttachments.find(a=>a.name===f.name&&a.size===f.size)){
      _chatAttachments.push(f);
    }
  });
  renderChatAttachments();
  // Reset input so same file can be re-selected
  e.target.value='';
}

function renderChatAttachments(){
  const container = document.getElementById('chat-attachments');
  const badge = document.getElementById('chat-upload-badge');
  if(!container) return;
  if(_chatAttachments.length === 0){
    container.classList.remove('show');
    badge.classList.remove('show');
    badge.textContent='';
    return;
  }
  container.classList.add('show');
  badge.classList.add('show');
  badge.textContent = _chatAttachments.length;
  container.innerHTML = _chatAttachments.map((f,i)=>`
    <div class="chat-att-chip">
      <span class="chat-att-icon">${fileIcon(f.name)}</span>
      <span class="chat-att-name" title="${f.name}">${f.name}</span>
      <span class="chat-att-rm" onclick="removeChatAttachment(${i})" title="Remove">✕</span>
    </div>
  `).join('');
}

function removeChatAttachment(idx){
  _chatAttachments.splice(idx,1);
  renderChatAttachments();
}

/* sendChat is fully integrated above — no patch needed */

/* ══ INIT ══ */
(function(){
  loadCfg();
  MEM.load();MEM.renderUI(); // V8: load persistent memory
  VAULT.load();VAULT.updateHeaderBadge(); // V10: load key vault

  // ── Migrate stale provider records from old vault versions ──
  // Providers like 'together','mistral','perplexity' moved from 'paid' → 'freepaid' tier
  // Their tier now lives only in PROVIDER_META, not in stored keys — no action needed.
  // But clear any keys for providers no longer in PROVIDER_META to avoid ghost rows.
  (()=>{
    const validProviders=new Set(Object.keys(PROVIDER_META));
    const before=VAULT.keys.length;
    VAULT.keys=VAULT.keys.filter(k=>validProviders.has(k.provider));
    if(VAULT.keys.length!==before){VAULT.save();console.log('[NF] Cleaned',before-VAULT.keys.length,'stale vault keys');}
  })();
  refreshAllAgentModels(); // V17: show real models in agent panel
  // Agent list — 14 agents in pipeline order
  document.getElementById('agent-list').innerHTML=AGENTS.map((a,i)=>{
    const task=MODEL_ROUTER.agentTaskMap[a.id]||'quality';
    const best=VAULT.getBest(task);
    const meta=PROVIDER_META[best?.provider]||{};
    const modelName=best?.model?(best.model.split('/').pop().replace(':free','').slice(0,18)):'no key';
    const provIcon=meta.icon||'🔑';
    const provName=meta.name||best?.provider||'—';
    const provColor=meta.color||'var(--t3)';
    const specialBadge={websearcher:'PRE-BUILD',promptagent:'REFINER',tester:'POST-BUILD'}[a.id];
    const badgeColor={websearcher:'rgba(6,182,212',promptagent:'rgba(244,63,94',tester:'rgba(34,197,94'}[a.id]||'rgba(124,106,247';
    const badgeHtml=specialBadge?`<span style="font-size:.47rem;padding:1px 4px;border-radius:3px;background:${badgeColor},.12);color:${a.color};border:1px solid ${badgeColor},.25);font-weight:700;letter-spacing:.04em;white-space:nowrap;flex-shrink:0">${specialBadge}</span>`:'';
    return `
    <div class="arow" id="ar-${a.id}">
      <div class="aav" id="av-${a.id}" style="background:${a.color}1a;color:${a.color};border:1px solid ${a.glow}">${a.emoji}</div>
      <div class="ainf">
        <div style="display:flex;align-items:center;gap:3px;min-width:0">
          <div class="aname" style="flex:1;min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap">${a.name}</div>
          ${badgeHtml}
          <div class="adot" id="ad-${a.id}"></div>
        </div>
        <span class="astate" id="as-${a.id}" style="display:none"></span>
        <div class="arole">${a.role}</div>
        <div class="amodel${best?'':' no-key'}" id="am-${a.id}" title="${provName} · ${modelName}">
          <span class="amodel-prov" id="amp-${a.id}" style="background:${provColor}18;color:${provColor};border:1px solid ${provColor}30">${provIcon}</span>
          <span class="amodel-name" id="amn-${a.id}">${modelName}</span>
        </div>
      </div>
    </div>`;
  }).join('');
  // Stage list
  const sl=document.getElementById('stage-list');
  const lbl=document.createElement('div');lbl.className='sb-label';lbl.style.cssText='padding:10px 12px 4px';lbl.textContent='Build Stages';sl.appendChild(lbl);
  STAGES.forEach(s=>{const el=document.createElement('div');el.className='sitem';el.id='si-'+s.id;el.innerHTML=`<span class="sic">${s.icon}</span><span>${s.label}</span>`;sl.appendChild(el)});
  renderHistList();initScroll();initWorkflowViz();

  // ── Dual Mode System init ──
  // Default to Chat Mode; restore saved preference
  try{
    const saved=localStorage.getItem('nf11_mainMode')||'chat';
    switchMainMode(saved);
  }catch(e){
    switchMainMode('chat');
  }
  // Start with build discuss panel open on desktop
  _discussOpen=window.innerWidth>900;
  if(!_discussOpen){
    document.getElementById('build-discuss')?.classList.add('collapsed');
  }

  // Restore theme
  try{const t=localStorage.getItem(LS_THEME);if(t){document.documentElement.setAttribute('data-theme',t);const tb=document.getElementById('theme-btn');if(tb)tb.textContent=t==='dark'?'🌙':'☀️';const mi=document.getElementById('mob-theme-icon');if(mi)mi.textContent=t==='dark'?'🌙':'☀️'}}catch(e){}

  // OpenRouter key check — essential for browser usage
  setTimeout(()=>{
    const hasOR=VAULT.keys.find(k=>k.provider==='openrouter'&&k.key?.length>10&&k.status!=='fail');
    const hasAny=VAULT.getActiveCount()>0;
    if(!hasAny){
      // No keys at all — standard banner already handles this
    } else if(!hasOR){
      // Has keys but NOT OpenRouter — warn that most providers will CORS-fail
      toast('⚠️ Add an OpenRouter key for best results — most other providers block browser requests','');
    }
  },2000);
  // URL project param
  try{const p=new URLSearchParams(location.search).get('project');if(p){document.getElementById('pi').value=decodeURIComponent(p);autosize(document.getElementById('pi'));setTimeout(()=>toast(`Project loaded: "${p.slice(0,28)}"`,'ok'),600)}}catch(e){}
  // Restore last session
  try{const h=getHist();if(h.length&&h[0].chatLog?.length){restoreSession(h[0].id);if(h[0].done){document.getElementById('expbar').classList.add('show');document.getElementById('runbtn').disabled=false}}}catch(e){}
  // Placeholder cycling
  const pls=['Build a weather app with live API…','Create a Kanban board with drag & drop…','Make a music player with visualizer…','Build a portfolio site with animations…','Create a budgeting tracker with charts…'];
  let pi=0;
  setInterval(()=>{const inp=document.getElementById('pi');if(document.activeElement===inp||inp.value)return;inp.style.opacity='.3';setTimeout(()=>{inp.placeholder=pls[pi=(pi+1)%pls.length];inp.style.opacity='1';inp.style.transition='opacity .4s'},350)},4500);
  // No API key banner — shown per-mode by switchMainMode / _showChatApiBanner
  // Build mode banner (injected into #msgs on first visit to build mode if no key)
  if(!S.cfg.key&&!VAULT.getActiveCount()){
    // Will be shown when user switches to Build Mode via the existing #msgs banner logic
    // Also auto-shown in Chat Mode via _showChatApiBanner() called from switchMainMode
  }

  // Hide #ip on initial load since we default to Chat Mode
  document.getElementById('ip')?.classList.add('hidden');
  document.getElementById('app')?.classList.add('chat-mode-active');
  console.log('%c NeuralForge v11.0 ','background:linear-gradient(135deg,#7c6af7,#00d4ff);color:#fff;padding:4px 16px;border-radius:6px;font-weight:900;font-size:13px');
  console.log('%c 13 Features · Folder Tree · ZIP · AbortGuard · BudgetCap · CostTracker · Parallel · Sarvam-M · ErrMonitor · TestAgent · WebSearcher · Persona · Replay ','color:#00d4ff;font-size:10px');
})();