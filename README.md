# 🧠 NeuralForge v11 — Multi-Agent AI Software Company

<div align="center">

![NeuralForge](https://img.shields.io/badge/NeuralForge-v11.0-7c6af7?style=for-the-badge&logo=data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNCAyNCI+PHBhdGggZmlsbD0id2hpdGUiIGQ9Ik0xMiAyQzYuNDggMiAyIDYuNDggMiAxMnM0LjQ4IDEwIDEwIDEwIDEwLTQuNDggMTAtMTBTMTcuNTIgMiAxMiAyem0wIDE4Yy00LjQxIDAtOC0zLjU5LTgtOHMzLjU5LTggOC04IDggMy41OSA4IDgtMy41OSA4LTggOHoiLz48L3N2Zz4=)
![Agents](https://img.shields.io/badge/AI%20Agents-14-00d4ff?style=for-the-badge)
![Providers](https://img.shields.io/badge/AI%20Providers-20+-00e5a0?style=for-the-badge)
![Zero Install](https://img.shields.io/badge/Zero%20Install-Single%20HTML-ffd166?style=for-the-badge)
![License](https://img.shields.io/badge/License-MIT-f07178?style=for-the-badge)

**A fully browser-based, multi-agent AI platform that simulates an entire software company — 14 specialized AI agents working in sequence to plan, design, code, review, test, and ship your project.**

[🚀 Live Demo](#) · [📖 Documentation](#how-it-works) · [⚙️ Setup](#getting-started) · [🤖 Agents](#the-14-agent-pipeline)

</div>

---

## ✨ What Is NeuralForge?

NeuralForge v11 is a complete AI software development company in your browser. You describe a project — *"Build a weather app with live API and dark mode"* — and 14 specialized AI agents automatically collaborate to produce:

- 📄 Complete, production-ready source files (HTML, CSS, JS, Python, etc.)
- 🏗 Architectural documentation and sprint plans
- 🎨 Full UI design systems with tokens and component specs
- 🧪 Test reports, accessibility audits, and deployment guides
- 📦 A downloadable ZIP of your entire project

No server. No backend. No installation. **Just open the file.**

---

## 🌟 Feature Overview (13 Core Features)

| # | Feature | Description |
|---|---------|-------------|
| 1 | **Folder Tree File System** | Grouped, collapsible file explorer organized by type (HTML, CSS, JS, etc.) |
| 2 | **ZIP Download** | Download all generated project files as a single `.zip` |
| 3 | **AbortGuard** | Token-per-build safety cap (100K / 200K / 300K / 500K modes) |
| 4 | **Parallel Agent Execution** | Multiple agents can work concurrently where the pipeline allows |
| 5 | **Budget Caps & Cost Tracker** | Per-build USD budget cap with live cost bar and warnings |
| 6 | **Feedback Loop Engine** | Enforced Developer → Reviewer → Developer retry cycle (up to 3× loops) |
| 7 | **Self-Evaluation Scoring** | AI judges code on Correctness / Quality / Completeness (1–10 each) |
| 8 | **Dynamic Model Routing** | Routes each agent to the optimal model based on task type |
| 9 | **Live Error Monitor** | Floating panel capturing real-time errors, warnings, and info logs |
| 10 | **Test Agent** | Final QA sandbox with static analysis, functional tests, and security scan |
| 11 | **Web Searcher Agent** | Pre-build research agent fetching libraries, patterns, and pitfalls |
| 12 | **User Persona Mode** | Adapts agent communication style (Beginner / Developer / Enterprise) |
| 13 | **Build Replay** | Step-by-step replay of the entire build pipeline with progress scrubber |

---

## 🤖 The 14-Agent Pipeline

NeuralForge routes your project through a **strict sequential pipeline** of 14 specialized agents. Each agent receives the output of the previous one as context and builds upon it.

```
🌐 WebSearcher → 👔 CEO → ✍️ PromptAgent → 👨‍💼 Manager → 🗺 Planner → 📋 ProductMgr →
🎨 UIDesigner → 💻 Developer → 🔍 Reviewer → 🚀 Optimizer → ♿ A11y → 🐛 Debugger →
📦 DevOps → 🧪 TestAgent
```

### Agent Details

| # | Agent | Role | Primary Task | Model (OpenRouter) |
|---|-------|------|-------------|-------------------|
| 0 | 🌐 **Web Searcher** | Research & Intel | Pre-build technical research: best libraries, architecture patterns, common pitfalls, performance tips | `llama-3.3-70b-instruct:free` |
| 1 | 👔 **CEO** | Chief Executive | Strategic vision, scope assessment, tech stack confirmation, quality bar definition | `deepseek-r1:free` |
| 2 | ✍️ **Prompt Agent** | Prompt Engineer | Refines the raw user prompt into a structured master brief used by all 11 downstream agents | `deepseek-r1:free` |
| 3 | 👨‍💼 **Manager** | Engineering Manager | Sprint breakdown, file structure planning, risk assessment, definition of done | `deepseek-r1:free` |
| 4 | 🗺 **Planner** | System Architect | Component architecture, state management, API design, performance targets | `deepseek-r1:free` |
| 5 | 📋 **Product Mgr** | Feature Strategist | P0/P1/P2 feature specs, acceptance criteria, every screen and modal needed | `deepseek-chat-v3:free` |
| 6 | 🎨 **UI Designer** | Visual System Lead | Complete design system: CSS tokens, typography, animations, dark/light mode, responsive breakpoints | `gemma-3-12b-it:free` |
| 7 | 💻 **Developer** | Full-Stack Engineer | 100% complete, production-ready source code for all files in the selected framework | `llama-3.3-70b-instruct:free` |
| 8 | 🔍 **Code Reviewer** | Quality Assurance | Best practices, security issues, missing features, performance problems, /10 rating | `llama-3.1-8b-instruct:free` |
| 9 | 🚀 **Optimizer** | Performance Engineer | Framework-specific optimization (memoization, lazy loading, caching, bundle size) | `mistral-7b-instruct:free` |
| 10 | ♿ **A11y Agent** | Accessibility Expert | WCAG AA audit: ARIA labels, color contrast, keyboard nav, screen reader, focus management | `gemma-3-12b-it:free` |
| 11 | 🐛 **Debugger** | Bug Hunter | Concrete BEFORE→AFTER fixes for runtime errors, missing implementations, and error handling | `deepseek-chat-v3:free` |
| 12 | 📦 **DevOps** | Build & Deploy Lead | Full README.md, run/deploy instructions, environment variables, project stats | `llama-3.1-8b-instruct:free` |
| 13 | 🧪 **Test Agent** | QA Sandbox Runner | Final gate: static analysis, functional test cases, browser compat, security scan, pass/fail verdict | `deepseek-chat-v3:free` |

### Agent Badges

Three agents carry special pipeline badges:

| Badge | Agent | Position | Purpose |
|-------|-------|----------|---------|
| `PRE-BUILD` | 🌐 Web Searcher | Before CEO | Research before any decisions are made |
| `REFINER` | ✍️ Prompt Agent | After CEO | Transforms the raw request into a structured brief |
| `POST-BUILD` | 🧪 Test Agent | After DevOps | Final quality gate before delivery |

---

## 🏗 How The AI System Works

### 1. Pipeline Orchestration

When you click **Build**, the orchestrator (`go()`) fires the 14-agent sequence. Each agent:

1. Receives a **cross-agent context** object (`ctx`) containing the outputs of every prior agent
2. Gets a **role-specific system prompt** from the `PROMPTS` dictionary
3. Calls the best available AI model via `streamAgentLive()`
4. Streams its output live into the chat with token count
5. Stores its output in `ctx[agentId]` for downstream agents

```
User Prompt → SEQ[0] (WebSearcher) → ctx.websearcher
           → SEQ[1] (CEO)          → ctx.ceo
           → SEQ[2] (PromptAgent)  → ctx.promptagent
           → ... → SEQ[13] (Tester)
```

### 2. Cross-Agent Context Passing

Each agent explicitly sees what the previous agent decided via `_buildCrossAgentContext()`:

```
ceo        ← reads: ctx.websearcher (Web Research Brief)
promptagent← reads: ctx.ceo         (CEO Strategy)
manager    ← reads: ctx.promptagent (Refined Project Brief)
planner    ← reads: ctx.manager     (Manager Plan)
pm         ← reads: ctx.planner     (Architect Plan)
designer   ← reads: ctx.pm          (PM Specs)
developer  ← reads: ctx.designer    (Design System)
reviewer   ← reads: ctx.developer   (Developer Code)
optimizer  ← reads: ctx.reviewer    (Reviewer Notes)
a11y       ← reads: ctx.developer   (Code Files)
debugger   ← reads: ctx.a11y        (A11y Report)
devops     ← reads: ctx.debugger    (Debug Fixes)
tester     ← reads: ctx.devops      (DevOps Package)
```

### 3. Feedback Loop Engine (Developer ↔ Reviewer)

The `FEEDBACK` module enforces a **strict iterative quality loop**:

```
Developer (Pass 1) → Reviewer evaluates:
  ├─ Correctness score (1-10)
  ├─ Quality score (1-10)
  └─ Completeness score (1-10)
      ├─ All ≥ 7: ✅ PASS → continue pipeline
      └─ Any < 7: ❌ RETRY → feedback injected → Developer (Pass 2)
          └─ Repeat up to maxLoops (1×, 2×, or 3×)
```

Issues found in review are injected into the next developer prompt as **MANDATORY FIXES**. The loop runs 1–3 times based on your `Max Loops` setting.

### 4. Meeting Engine

At four key pipeline milestones, agents hold **real-time team meetings**:

| Meeting | Participants | Purpose |
|---------|-------------|---------|
| 🚀 Kickoff | CEO + Manager + Planner | Align on vision, scope, strategy |
| 🎨 Design Review | PM + UI Designer + Developer | Agree on UX, components, technical approach |
| 💻 Build Sync | Developer + Reviewer + Optimizer | Code quality, performance, correctness |
| 🚢 Ship Check | A11y + Debugger + DevOps | Accessibility, bugs, deployment readiness |

In each meeting, reviewers generate honest reactions tagged as:
- `✅ Agree` — consensus, may add a detail
- `⚠️ Concern` — real issue raised (triggers main agent response)
- `➕ Adding` — extends the proposal
- `❓ Question` — requests clarification

If concerns reach a threshold, a **live vote** determines whether to proceed or iterate.

### 5. Dynamic Model Routing

`MODEL_ROUTER` assigns the optimal model to each agent based on **task type**:

| Task Type | Description | Routed To |
|-----------|-------------|-----------|
| `coding` | File generation, implementation | Best coding model in vault |
| `reasoning` | Architecture, strategy, planning | Best reasoning model |
| `quality` | Review, QA, evaluation | Balanced quality model |
| `creative` | Design, UI, naming | Creative-optimized model |
| `fast` | Meeting reactions, small tasks | Fastest available model |
| `review` | Code review, security audit | Review-specialized model |

### 6. Codebase Intelligence

`CODEBASE` module performs **deep semantic indexing** of all generated files:

- Extracts functions, classes, imports, exports, API calls, and DOM references
- Builds cross-file dependency maps (which files reference which)
- Provides role-specific context to each agent (reviewer sees full code with line numbers; optimizer sees API call counts and DOM reference density)
- Enables `Ctrl+F` search across all generated files
- Persists the index to localStorage between sessions

### 7. Long-Term Memory System

`MEM` module maintains **persistent memory across sessions**:

- **Facts** — auto-extracted patterns: tech stack, file names, libraries used
- **Project Context** — architecture decisions, design system, current project
- **Conversation Summaries** — every 8 messages, the conversation is summarized and stored
- **Manual Memory** — users can add custom memories via the 🧠 Memory panel
- Memory is injected into every agent's context as `memCtx` for continuity

### 8. Web Searcher Agent (Pre-Build)

Before the first agent runs, `WEB_SEARCHER` researches the project:

```
Research Brief Covers:
  1. Best Libraries & Packages (top 3-5 with CDN links)
  2. Recommended Architecture (2-3 sentences, project-specific)
  3. Key Browser/External APIs (Canvas, Web Audio, Geolocation, etc.)
  4. Common Pitfalls to Avoid (top 3 mistakes)
  5. Performance Considerations (specific tips)
  6. Accessibility Checklist (3 key a11y requirements)
```

The brief is stored in `ctx._webResearch` and injected into the CEO and Prompt Agent contexts.

### 9. Prompt Agent (Prompt Refiner)

The Prompt Agent runs **between CEO and Manager** to transform the raw user request into a structured master brief:

```
Refined Master Prompt Sections:
  • Core Goal (1 sentence)
  • User Stories (5-7 "As a user, I want…")
  • Technical Requirements (stack, libraries, APIs, data structures)
  • UI/UX Requirements (layout, color scheme, animations, breakpoints)
  • Quality Gates (performance targets, WCAG AA checklist, error handling)
  • Out of Scope (what NOT to build)
  • Definition of Done
```

This project becomes the **north star** for all 11 downstream agents.

---

## 🔑 AI Provider System (20+ Providers)

NeuralForge includes a **multi-provider key vault** supporting both free and paid tiers.

### Free Tier Providers (No Credit Card)

| Provider | Icon | Models | Notes |
|----------|------|--------|-------|
| **OpenRouter** | 🌐 | Llama 3.3 70B, DeepSeek R1, Gemma 3, Mistral 7B | ⭐ Recommended — best CORS support for browser use |
| **Groq** | ⚡ | Llama 3.3 70B, Mixtral 8×7B, Gemma 2 9B | Ultra-fast inference |
| **Together AI** | 🟣 | Llama 3.3 70B, Mixtral, Qwen 2.5 | Strong free tier |
| **Mistral** | 🔷 | Mistral 7B, Mixtral, Codestral | European models |
| **Perplexity** | 🔵 | Llama 3.1 Sonar | Web-search capable |
| **Sarvam AI** | 🇮🇳 | Sarvam-M | Multilingual (Indian languages) |
| **Cohere** | 🔶 | Command R, Command R+ | Strong for long context |
| **HuggingFace** | 🤗 | Open model hub | Many free models |
| **WisdomGate** | 🧠 | WG-Pro, WG-Lite | Free + paid |

### Paid Tier Providers

| Provider | Icon | Best Models | Strength |
|----------|------|-------------|----------|
| **OpenAI** | 🟢 | GPT-4o, o3-mini | ⭐⭐⭐⭐⭐ Most capable |
| **Anthropic** | 🔶 | Claude Sonnet 4, Haiku | ⭐⭐⭐⭐⭐ Top reasoning |
| **DeepSeek** | 🐋 | DeepSeek R1, DeepSeek Coder | ⭐⭐⭐⭐ Best value |
| **xAI Grok** | 𝕏 | Grok 3, Grok 3 Mini | ⭐⭐⭐⭐ Real-time X data |
| **Fireworks AI** | 🔴 | DeepSeek V3, Llama 3.1 70B | ⭐⭐⭐⭐ Fast production |
| **DeepInfra** | 🌊 | Llama 3.1 70B, Qwen 2.5 72B | ⭐⭐⭐ Affordable |
| **Alibaba Qwen** | ☁ | Qwen Max, Qwen Coder Turbo | ⭐⭐⭐⭐ Strong multilingual |
| **AI21 Labs** | 🧬 | Jamba 1.5 (256K context) | ⭐⭐⭐ Long context |
| **ElevenLabs** | 🎙 | Multilingual v2 | TTS / Speech synthesis |
| **Lepton AI** | ⚛ | Llama 3.1 70B / 8B | ⭐⭐⭐ Fast Llama inference |

### Vault & Fallback System

The `VAULT` manages all stored keys with automatic **fallback chains**:

```
callWithRetry(agent) →
  VAULT.getFallbackChain(task) →
    [primary provider] → fail? → [fallback 1] → fail? → [fallback 2]
```

Fallback model lists per provider:
- **OpenRouter**: `llama-3.3-70b → deepseek-chat → gemma-3-12b → llama-3.1-8b`
- **Groq**: `llama-3.3-70b-versatile → mixtral-8x7b → llama-3.1-8b → gemma2-9b`

Keys persist in `localStorage` and automatically recover from stale failure states on next session load.

---

## 🖥 Dual Mode System

NeuralForge operates in two distinct modes toggled via the top tab bar:

### 💬 Chat Mode
- General-purpose AI assistant for dev questions
- Markdown rendering with syntax highlighting
- Supports file/image attachments
- Conversation history with copy/export
- Multi-turn context (last 8 messages)

### 🏗 Build Mode
- Full 14-agent pipeline execution
- Real-time file extraction and preview
- Framework selector (7 stacks)
- Live token counter and build timer
- Export to ZIP or GitHub Gist

**Intent detection** (`detectIntent()`) automatically routes short questions to Chat Mode and project descriptions to Build Mode, even when in Build Mode.

---

## 🛠 Framework Support

NeuralForge generates complete, runnable projects for 7 tech stacks:

| Framework | Icon | Preview | Files Generated |
|-----------|------|---------|----------------|
| **Vanilla JS** | 🌐 | ✅ In-browser | `index.html`, `style.css`, `script.js` |
| **React** | ⚛️ | ⚠️ Guide | Components, hooks, `App.jsx`, `index.css` |
| **Vue 3** | 💚 | ⚠️ Guide | Composition API components, `main.js`, `App.vue` |
| **Svelte** | 🔥 | ⚠️ Guide | `.svelte` components, `app.js` |
| **Next.js** | ▲ | ⚠️ Guide | App Router, `page.tsx`, `layout.tsx`, Tailwind config |
| **Node.js** | 🟢 | ⚠️ Guide | Express routes, `server.js`, `package.json`, `.env.example`, `README.md` |
| **Python** | 🐍 | ⚠️ Guide | Flask/FastAPI `app.py`, `requirements.txt`, Jinja2 templates, frontend |

Each framework has tailored developer instructions, file naming conventions, and DevOps deployment guides embedded in its `FW_CONFIG` entry.

---

## ⚡ Inline AI Editor

The **✏️ AI Edit** panel (inspired by Cursor) lets you edit any generated file with AI:

| Action | Description |
|--------|-------------|
| 🐛 **Fix Bug** | Find and fix all bugs, return corrected code |
| 🚀 **Optimize** | Improve for performance and readability |
| ♻️ **Refactor** | Restructure following best practices |
| 💡 **Explain** | Explain what the selected code does |
| 🔷 **Add Types** | Add TypeScript types or JSDoc annotations |
| 🧪 **Write Tests** | Generate unit tests for the selected code |
| ✏️ **Custom** | Free-text instruction for any edit |

Select code in the editor, open AI Edit, choose an action, and click **Apply to File** to write the change directly into the file.

---

## ⌨️ Keyboard Shortcuts

| Shortcut | Action |
|----------|--------|
| `Ctrl + Enter` | Build / Send |
| `Ctrl + Shift + E` | Enhance prompt |
| `Ctrl + Shift + N` | New session |
| `Ctrl + Shift + P` | Run preview |
| `Ctrl + Shift + D` | Download ZIP |
| `Ctrl + T` | Open templates |
| `Ctrl + F` | Search in code |
| `Ctrl + [` | Toggle sidebar |
| `Ctrl + ]` | Toggle code panel |
| `Ctrl + Shift + L` | Toggle theme |
| `Ctrl + .` | Stop build |
| `/` | Focus input |
| `Esc` | Close modal |

---

## 📐 Project Templates

12 pre-built templates to instantly load detailed project prompts:

| Template | Tags | Description |
|----------|------|-------------|
| 🌤 Weather App | API, Maps | Live API, animated icons, 5-day forecast, geolocation |
| 📝 Todo Manager | CRUD, DnD | Drag & drop, categories, priorities, due dates |
| 🛒 E-Commerce | Cart, UX | Product grid, cart, filters, checkout flow |
| 💬 Chat Interface | Messages, UI | Bubbles, emoji picker, typing indicators |
| 🎵 Music Player | Audio, Canvas | Canvas waveform, playlist, animated art |
| 📊 Analytics Dashboard | Charts, Data | Charts, KPI cards, date range, data tables |
| 🔐 Auth System | Forms, Security | Login, register, 2FA, user profile |
| 🗓 Calendar App | Events, DnD | Month/week/day views, drag events |
| 🎮 Browser Game | Game, Canvas | Canvas game with levels, score, particles |
| 📖 Note Taking App | Notes, MD | Rich text, markdown preview, tags, search |
| 🎨 Color Palette Tool | Design, CSS | Harmony rules, CSS export, contrast check |
| 🔗 URL Shortener | URL, Tools | Shorten, analytics, QR code generator |

---

## 🚀 Getting Started

### Zero-Install Method (Recommended)

1. Download the project
2. Open it in any modern browser (Chrome, Firefox, Edge, Safari)
3. Click ⚙️ **Settings** in the top-right
4. Add a free API key (OpenRouter recommended — no credit card needed):
   - [OpenRouter](https://openrouter.ai/keys) → free, no credit card, works best in browser
   - [Groq](https://console.groq.com/keys) → free, ultra-fast
5. Click **Save Vault**
6. Type your project idea and click **Build** or press `Ctrl + Enter`

### Getting a Free API Key

**OpenRouter (Best for Browser Use)**
```
1. Go to https://openrouter.ai/keys
2. Sign up (free, no credit card)
3. Create a new key
4. Paste it into NeuralForge Settings
```

**Groq (Fastest Free Option)**
```
1. Go to https://console.groq.com/keys
2. Sign up for free
3. Create an API key
4. Add to NeuralForge Settings
```

> ⚠️ **CORS Note**: Most providers block browser-side API calls. OpenRouter explicitly supports browser usage. If other providers fail, this is the reason — add an OpenRouter key for best results.

---

## ⚙️ Configuration Options

All settings are accessible via the ⚙️ button and persist in `localStorage`.

| Setting | Options | Description |
|---------|---------|-------------|
| **Provider** | OpenRouter, Groq, + 18 more | Primary AI provider |
| **Model** | Auto (routed) or manual | AI model override |
| **Max Loops** | 1× / 2× / 3× | Developer→Reviewer feedback iterations |
| **Dynamic Routing** | Enabled / Disabled | Auto-route agents to optimal models |
| **Self-Evaluation** | Enabled / Disabled | AI-powered code quality scoring |
| **Budget Cap** | $0.01–$50 | Max USD spend per build |
| **Token Guard** | 100K / 200K / 300K / 500K | Max tokens per build |

---

## 🧩 Architecture & State

### Global State Object (`S`)

```javascript
S = {
  building: false,          // Is a build in progress?
  aborted: false,           // Has the user stopped the build?
  project: null,            // Current project description
  sid: null,                // Session ID (timestamp-based)
  files: {},                // Generated files: { filename: { c, lang, icon, color } }
  chatLog: [],              // Full conversation log
  ctx: {},                  // Agent output context map
  memory: { facts, summaries, projectCtx }, // Long-term memory
  codebaseIndex: {},        // Semantic index of all files
  webSearchResults: [],     // Pre-build research results
  evalScores: {},           // Self-evaluation scores per loop
  loopCount: 0,             // Current feedback loop iteration
  framework: 'vanilla',     // Selected tech stack
  cfg: { key, provider, model, maxLoops, dynamicRouting, selfEval, budgetCap }
}
```

### Build Stage Sequence

| Step | Stage ID | Agent | Milestone |
|------|----------|-------|-----------|
| 1 | `websearch` | 🌐 Web Searcher | Research brief ready |
| 2 | `ceo` | 👔 CEO | Strategy & kickoff meeting |
| 3 | `prompt` | ✍️ Prompt Agent | Master brief generated |
| 4 | `manage` | 👨‍💼 Manager | Sprint plan ready |
| 5 | `analyze` | 🗺 Planner | Architecture document |
| 6 | `plan` | 📋 Product Mgr | Feature specs + design review meeting |
| 7 | `design` | 🎨 UI Designer | Design system CSS |
| 8 | `develop` | 💻 Developer | **Code generated** + build sync meeting |
| 9 | `review` | 🔍 Reviewer | Quality review (or in feedback loop) |
| 10 | `optimize` | 🚀 Optimizer | Performance pass |
| 11 | `a11y` | ♿ A11y Agent | Accessibility audit + ship check meeting |
| 12 | `debug` | 🐛 Debugger | Bug fixes |
| 13 | `deploy` | 📦 DevOps | README.md + deployment guide |
| 14 | `test` | 🧪 Test Agent | Final test report |

---

## 🎙 Additional Capabilities

### Voice Input
Click the 🎙 microphone button to dictate your project description using the Web Speech API (Chrome/Edge required).

### Build Interrupt
During an active build, click **📢 Redirect** to inject a mid-build instruction (e.g., *"Switch to React instead of vanilla JS"*) that takes effect on the next agent's context.

### GitHub Gist Export
After a build, export all files to a public GitHub Gist (automatically copies the URL to clipboard).

### Session History
Up to 20 sessions are stored in `localStorage`. Click 🕓 **History** to restore any past build — all chat logs and generated files are fully restored.

### Build Replay
Use the Replay bar to step through each agent's contribution one at a time with a visual progress scrubber.

### Smart Title Generation
After each build starts, a title generator runs in the background to shorten long prompts into clean session names:
- *"Build a weather app with OpenWeatherMap API, animations, dark mode"* → **Weather App**
- *"Create a Kanban board with drag and drop and local storage"* → **Kanban Board**

---

## 🔧 Development Notes

### File Structure

```
neuralforge
├── index.html         
├── styles        
     └── main.css
├── scripts
     └── app.js 
```

### localStorage Keys

| Key | Contents |
|-----|----------|
| `nf8_cfg` | User configuration (provider, model, settings) |
| `nf8_hist` | Session history (up to 20 sessions) |
| `nf8_theme` | Dark / light theme preference |
| `nf8_mem` | Long-term memory (facts, summaries, project context) |
| `nf8_cb` | Codebase semantic index |
| `nf11_vault` | API key vault (all providers) |
| `nf11_budget` | Per-build budget cap setting |
| `nf11_mainMode` | Last active mode (chat / build) |

---

## 🛡 Safety & Privacy

- **All API keys are stored locally** in your browser's `localStorage` — never sent to any NeuralForge server (there is none)
- **No telemetry** — the app makes no requests except directly to AI providers you configure
- **AbortGuard** prevents runaway token usage with configurable per-build limits (100K–500K tokens)
- **Budget Cap** ($0.01–$50) halts the build before exceeding your spending limit
- Stale failure states (rate limits, network errors) are automatically cleared on next session load

---

---

## 🙏 Acknowledgements

Built with:
- Sonnet 4.5 / Sonnet 4.6 / Haiku 4.5
- GPT-4o / GPT-5
- Grok-4.20
- Google Fonts — Space Grotesk, Fira Code, Outfit

---

<div align="center">

**NeuralForge v11** — *Your AI Software Company*

Made with 🧠 and lots of tokens

</div>
