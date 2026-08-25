# Cyber Chase – Technical Specification (Build Spec)

> Source of truth: `requirements.md` (pt-BR). This document is the implementation spec.
> It defines architecture, contracts, and run instructions so the site can be built
> deterministically and executed with Docker Compose. UI copy and code comments are in
> Portuguese (pt-BR); this spec is written in English.

---

## 1. Project Summary

| Item | Value |
|---|---|
| Product | Cyber Chase – cybersecurity education platform for non-technical users |
| Type | Static, multi-page website (no backend, no build step, no framework) |
| Stack | HTML5 + CSS3 + Vanilla JavaScript (ES2017), data-driven from JSON |
| Persistence | Browser `localStorage` only (no accounts, no database) |
| Serving | nginx container managed by Docker Compose |
| Pages | 7 pages + custom 404 |
| Content | 6 courses, 6 course quizzes (5 questions each), 1 general quiz (10 questions) |
| Language | All UI text in pt-BR; all code comments in pt-BR (requirement 26) |

---

## 2. Goals & Non-Goals

### Goals
- Teach lay users to defend against common cyber threats (phishing, weak passwords, scams, insecure networks, LGPD rights).
- Deliver a friendly, accessible, mobile-first experience with dark theme by default.
- Work fully offline except for YouTube videos (requirement 35).
- Run reproducibly via `docker compose up` on any machine with Docker installed.

### Non-Goals
- No backend/API, no authentication, no database.
- Contact form does not send e-mail (requirement 18: "não precisa enviar de verdade").
- No service worker/PWA; offline works because all assets are local.
- No frameworks, bundlers, or transpilers (requirements section 5).

---

## 3. Architecture Overview

```
Browser (Chrome/Firefox/Edge/Safari, last 2 versions)
        │  HTTP
        ▼
┌─────────────────────────────────────────┐
│  Docker Container: cyber-chase          │
│  nginx:1.27-alpine                      │
│  • serves static files (bind-mounted)   │
│  • gzip + asset caching                 │
│  • custom 404 → 404.html                │
│  • healthcheck endpoint (/)             │
└─────────────────────────────────────────┘
        │  reads from disk (read-only mount)
        ▼
   HTML pages + CSS + JS + data/cursos.json + local fonts/icons
        │
        └── client-side: fetch(cursos.json) → render → localStorage for progress
```

The only external network dependencies at runtime are YouTube embeds
(`youtube-nocookie.com`). Fonts and icons are self-hosted (see §11.5).

---

## 4. Runtime Environment – Docker Compose

### 4.1 `docker-compose.yml`

```yaml
services:
  cyber-chase:
    image: nginx:1.27-alpine
    container_name: cyber-chase
    ports:
      - "${CYBER_CHASE_PORT:-8080}:80"
    volumes:
      - ./:/usr/share/nginx/html:ro
      - ./nginx.conf:/etc/nginx/conf.d/default.conf:ro
    restart: unless-stopped
    healthcheck:
      test: ["CMD", "wget", "-q", "-O", "/dev/null", "http://127.0.0.1/"]
      interval: 30s
      timeout: 5s
      retries: 3
```

Decisions:
- **Bind mount instead of image build**: the site has no build step, so mounting the
  repo into nginx gives live-reload behavior (edit a file, refresh the browser) and
  zero rebuild cost. This is the primary mode.
- **Port**: `8080` on the host by default, overridable via `.env`
  (`CYBER_CHASE_PORT=9090`) or inline (`CYBER_CHASE_PORT=9090 docker compose up -d`).
- **Healthcheck**: built on busybox `wget`, no extra packages needed.

### 4.2 `nginx.conf`

Requirements for the config file (single `server` block):

```nginx
server {
  listen 80;
  server_name _;
  root /usr/share/nginx/html;
  index index.html;
  charset utf-8;

  # Custom friendly 404 (keeps 404 status via internal redirect)
  error_page 404 /404.html;

  # Compression
  gzip on;
  gzip_min_length 1024;
  gzip_types text/plain text/css application/javascript application/json image/svg+xml;

  # HTML and JSON must revalidate (progress data lives in localStorage, JSON is app data)
  location ~* \.(html|json)$ {
    add_header Cache-Control "no-cache";
  }

  # Static assets: long cache
  location /assets/ {
    expires 7d;
    add_header Cache-Control "public, immutable";
  }

  # Hide infra files from the web root (bind mount exposes the whole repo)
  location ~ ^/(SPEC|requirements)\.md$ { deny all; }
  location = /nginx.conf { deny all; }
  location = /docker-compose.yml { deny all; }
}
```

Note: the bind mount publishes the entire repo under the web root; the `deny` rules
above keep infrastructure files out of HTTP reach.

### 4.3 Operations

| Command | Effect |
|---|---|
| `docker compose up -d` | Start detached; site at `http://localhost:8080` |
| `docker compose ps` | Show status; `healthy` once healthcheck passes |
| `docker compose logs -f` | Stream nginx logs |
| `docker compose restart` | Pick up nginx.conf changes |
| `docker compose down` | Stop and remove the container (data on disk untouched) |

### 4.4 Optional: portable image (variant)

If a self-contained image is ever needed, add a `Dockerfile`
(`FROM nginx:1.27-alpine`, `COPY` the site files into `/usr/share/nginx/html`) plus a
`.dockerignore` (excludes `.git`, `SPEC.md`, `requirements.md`, `README.md`,
`docker-compose.yml`, `nginx.conf`) and switch the compose service from `image:` +
bind mount to `build: .`. Not required for this project's default workflow.

---

## 5. Repository Structure

```
cyber-chase/
├── docker-compose.yml      # container orchestration (§4.1)
├── nginx.conf              # server config (§4.2)
├── index.html              # home
├── cursos.html             # course catalog (all 6 courses)
├── curso.html              # course detail (reads ?id=1..6)
├── quiz.html               # general quiz (10 random questions)
├── sobre.html              # about page (real stats + sources)
├── contato.html            # contact form (fake submit)
├── dashboard.html          # user progress dashboard
├── 404.html                # friendly error page
├── css/
│   └── style.css           # global styles + design tokens
├── js/
│   ├── main.js             # global behaviors (nav, theme, reading mode, video facade)
│   ├── cursos.js           # course catalog + course detail rendering
│   ├── quiz.js             # quiz engine (course + general quizzes)
│   └── progresso.js        # localStorage wrapper (progress, theme, reading mode)
├── assets/
│   ├── img/                # logo (SVG) e imagens locais
│   └── (ícones e fontes vêm de CDN — ver §10.5)
├── data/
│   └── cursos.json         # all course content + quizzes (§8)
├── README.md               # install/run instructions (pt-BR)
└── SPEC.md                 # this document
```

---

## 6. Pages & Routes

| Route | Purpose | Key content |
|---|---|---|
| `/` | Home | logo + slogan, hero banner with CTA "Começar Agora", stats ("6 cursos", "50+ lições", "100% gratuito"), 3 testimonials, footer links |
| `/cursos.html` | Catalog | 6 cards: icon, title, short description, duration, level (Iniciante/Intermediário) |
| `/curso.html?id={1..6}` | Course detail | full description, content topics, YouTube embed, 5-question quiz, "Concluir" button, completion badge |
| `/quiz.html` | General quiz | 10 random questions drawn from all courses |
| `/dashboard.html` | Dashboard | progress bar "X de 6 cursos concluídos", next-course suggestion, green checkmarks on completed courses |
| `/sobre.html` | About | purpose, real statistics (44% attack growth in 2025, Brazil leader in LatAm), source links |
| `/contato.html` | Contact | form: Nome, E-mail, Mensagem; submit shows success message only |
| `/404.html` | Error page | friendly message + link home; served by nginx `error_page 404` |

Invalid or missing `?id` on `curso.html` (e.g., `id=99`, no id) → redirect to `cursos.html`.

Shared layout: sticky header (logo, nav, theme toggle, reading-mode toggle) and footer
(Sobre, Contato, Política de Privacidade) on all pages. "Política de Privacidade" may be
a section of `sobre.html` or its own page; a plain anchor target is acceptable.

---

## 7. Data Model – `data/cursos.json`

Top-level shape: `{ "cursos": [Curso, ...] }` with exactly 6 entries (`id` 1–6).
All `string` content is pt-BR. The JSON must be valid and served with `Content-Type:
application/json`.

```jsonc
{
  "cursos": [
    {
      "id": 1,                                  // number, unique 1..6
      "titulo": "Introdução à Cibersegurança", // string
      "descricao_curta": "...",                 // string, ≤ 140 chars, shown on card
      "descricao_longa": "...",                 // string, shown on course page
      "nivel": "Iniciante",                     // "Iniciante" | "Intermediário"
      "duracao": "15 min",                      // string, human-readable
      "icone": "fa-shield-halved",              // Font Awesome class name
      "video": "https://www.youtube.com/embed/...", // YouTube embed URL
      "conteudo": ["tópico 1", "tópico 2", ...],    // string[], ≥ 3 topics
      "quiz": [                                 // exactly 5 Pergunta objects
        {
          "pergunta": "O que é cibersegurança?",
          "opcoes": ["A", "B", "C", "D"],       // exactly 4 options
          "resposta": 1,                        // number, index of correct option (0..3)
          "explicacao": "Cibersegurança é..."   // shown in immediate feedback
        }
      ]
    }
    // ... ids 2..6
  ]
}
```

The 6 courses, per requirements section 3:

| id | Title | Level |
|---|---|---|
| 1 | Introdução à Cibersegurança | Iniciante |
| 2 | Phishing e Engenharia Social | Iniciante |
| 3 | LGPD e Proteção de Dados | Intermediário |
| 4 | Segurança em Redes | Intermediário |
| 5 | Boas Práticas de Senhas | Iniciante |
| 6 | Como Identificar Golpes | Intermediário |

Levels are assigned here (requirements only say "Iniciante/Intermediário" without a
per-course mapping); this mapping is the implementation default and may be adjusted
during content authoring.

YouTube URLs in `requirements.md` are placeholders (`Exemplo1..6`); implementation must
replace them with real, relevant videos (see §15).

---

## 8. Client-Side Persistence – `localStorage`

All keys are prefixed `cc_` and namespaced under the site. `js/progresso.js` is the
**only** module allowed to touch `localStorage`.

| Key | Shape | Purpose |
|---|---|---|
| `cc_progresso` | `{ "1": { "concluido": true, "data": "2026-08-23" }, ... }` | Per-course completion (matches requirement 27) |
| `cc_tema` | `"escuro" \| "claro"` | Theme choice; default `"escuro"` when absent |
| `cc_leitura` | `"ativo" \| null` | Reading mode (§11.4); default off |
| `cc_quiz_geral` | `{ "melhor": 8, "ultima": "2026-08-23" }` | Best general-quiz score (for dashboard) |

Robustness rules:
- All reads go through safe `JSON.parse` inside `try/catch`; corrupted values are
  ignored and reset to defaults.
- All writes are wrapped in `try/catch` (private-mode browsers may throw on setItem).
- The storage event is not required to be handled (single-tab assumption).

---

## 9. JavaScript Module Contracts

Plain ES modules loaded with `<script type="module">` (supported by all target
browsers). No global namespace pollution; each module exposes one namespaced object.

### 9.1 `js/progresso.js` – storage wrapper
```js
Progresso.obter()                    // → { "1": {concluido, data}, ... }
Progresso.estaConcluido(id)          // → boolean
Progresso.marcarConcluido(id)        // writes {concluido:true, data:ISO-date}
Progresso.totalConcluidos()          // → number 0..6
Progresso.idsConcluidos()            // → number[]
Progresso.proximoCurso()             // → id of first non-concluded course (1..6) or null
Progresso.melhorQuizGeral()          // → number | null
Progresso.registrarQuizGeral(pontos) // keeps max score + date
Tema.obter() / Tema.alternar()       // dark default; returns new value; sets <html data-tema>
Leitura.obter() / Leitura.alternar() // toggles reading mode; sets <html class="modo-leitura">
```

### 9.2 `js/cursos.js` – catalog & course detail
- `carregarCursos()`: `fetch('data/cursos.json')` → `{cursos}`; on failure, render an
  inline error message (site must not crash; requirement 38).
- On `cursos.html`: render 6 cards from data (icon, title, short description, duration,
  level badge). Clicking navigates to `curso.html?id=N`.
- On `curso.html`: parse `?id` from `URLSearchParams`; invalid → `location.replace('cursos.html')`.
  Render title, long description, topics list, video facade (§11.6), quiz, and the
  "Concluir" button. If `Progresso.estaConcluido(id)`, button shows "✅ Curso Concluído"
  and the badge is visible (requirement 29).

### 9.3 `js/quiz.js` – quiz engine
```js
Quiz.iniciar({ perguntas, container, aoFinalizar(pontuacao, total) })
Quiz.embaralhar(array)               // Fisher–Yates; also shuffles question order per attempt
```
Behavior (requirements 10–13, 28):
- Render one question at a time: 4 option buttons.
- On answer: lock the question, highlight correct option in green and wrong selection in
  red, show the `explicacao` text, reveal "Próxima" button. Use `aria-live="polite"` on
  the feedback region.
- End: show "X/5" (course) or "X/10" (general), a motivational message by score band,
  and a "Refazer quiz" button that restarts with reshuffled questions.
- General quiz question pool: all 30 questions from `cursos.json`. Selection: pick 1
  random question from each of the 6 courses (guarantees theme coverage), then 4 more
  random from the remainder, then shuffle the 10.
- Course flow: completing the quiz (any score) enables the "Concluir" button; clicking
  it calls `Progresso.marcarConcluido(id)` and swaps the button to the completed state.

### 9.4 `js/main.js` – global behaviors
- Mobile nav toggle, active link highlighting.
- Theme toggle (default dark) and reading-mode toggle (requirement 31), both wired to
  `Tema`/`Leitura` helpers.
- Smooth scrolling: CSS `scroll-behavior: smooth` with `prefers-reduced-motion` guard
  (requirement 30).
- YouTube facade: replace every `[data-video]` placeholder with a click-to-load iframe
  (§11.6).
- Contact form handler: `preventDefault()`, validate fields, show inline success message
  (no network call).

---

## 10. Design System

### 10.1 CSS custom properties (single source of truth, `:root`)
```css
:root {
  --fundo: #0a1628;        /* main background (dark blue)   */
  --fundo-2: #111d33;      /* secondary background (cards)  */
  --texto: #ffffff;        /* primary text                  */
  --texto-2: #b0c4de;      /* secondary text (light gray)   */
  --primaria: #6c3bcb;     /* primary buttons (purple)      */
  --primaria-hover: #8b5cf6;
  --destaque: #22d3ee;     /* accent (cyan)                 */
  --sucesso: #34d399;      /* success / completed (green)   */
  --erro: #ef4444;         /* alert / error (red)           */
}
[data-tema="claro"] { /* light-theme token overrides: light background, dark text */ }
```
Light theme is optional polish; if shipped, define the full token set in the same block
so every component inherits it automatically. All components reference tokens only —
**never** hardcoded hex values in component rules.

### 10.2 Typography
- Headings: Poppins; body: Inter; loaded from Google Fonts CDN with
  `font-display: swap` and system-font fallbacks.
- Base: `16px`, line-height `1.6`, comfortable spacing; generous tap targets (≥ 44px).

### 10.3 Accessibility (requirements 21, 31)
- WCAG 2.1 AA: contrast verified for all token pairs on both themes.
- Skip-to-content link, visible `:focus-visible` outlines, full keyboard operability
  (quizzes and toggles included), semantic landmarks (`header/nav/main/footer`).
- Quiz feedback announced via `aria-live`.

### 10.4 Reading mode (requirement 31)
Header button toggles `html.modo-leitura`:
- Root font-size increases (16px → 20px).
- High-contrast palette (pure black background, white text, yellow accent for links).
- Persisted in `cc_leitura`.

### 10.5 Fonts & icons (CDN)
- Font Awesome Free and Google Fonts (Inter/Poppins) are loaded from CDN, per
  requirements section 5 ("Font Awesome CDN", "Google Fonts").
- The offline criterion (requirement 35) explicitly exempts fonts ("exceto vídeos e
  fontes"): without internet, the site renders with system fonts and icon glyphs are
  replaced by text labels, but all functionality keeps working.
- Self-hosting under `assets/` is possible later (OFL-licensed files) if full offline
  iconography is needed; not required for the default workflow.

### 10.6 Videos & performance
- Embed via `youtube-nocookie.com` (privacy-enhanced).
- Click-to-load facade: poster image + play button in the page; the iframe is injected
  only on click (keeps initial load < 3s on 4G, requirement 23).

---

## 11. Key User Flows

1. **Complete a course**: home → CTA → `cursos.html` → card → `curso.html?id=N` → read
   topics → watch video → take quiz (immediate feedback) → "Concluir" → badge shown,
   `cc_progresso` updated → dashboard reflects progress after reload.
2. **General quiz**: `quiz.html` → 10 shuffled questions across all themes → score X/10
   → "Refazer quiz" → best score stored in `cc_quiz_geral`.
3. **Dashboard**: progress bar "X de 6 cursos concluídos", suggestion =
   `Progresso.proximoCurso()`, green checkmarks on completed course cards, best general
   quiz score.

---

## 12. Non-Functional Requirements → Implementation

| # | Requirement | Implementation |
|---|---|---|
| 20 | Responsive, mobile-first | Mobile-first CSS; breakpoints ~640px / ~1024px; tested at 3 widths |
| 21 | Accessibility | §10.3 |
| 22 | Dark mode by default | `data-tema="escuro"` default in markup; tokens in §10.1 |
| 23 | < 3s on 4G | no frameworks, self-hosted assets, gzip, video facade (§10.6); target initial payload < 300 KB |
| 24 | No login | localStorage only (§8) |
| 25 | Browser support | last 2 versions Chrome/Firefox/Edge/Safari; ES2017 only, no transpilation |
| 26 | Commented code | every file commented in pt-BR explaining each section |

---

## 13. Acceptance Criteria → Test Plan

| # | Criterion | Automated/Manual check |
|---|---|---|
| 32 | 6 courses with full content | curl `data/cursos.json`; validate JSON; assert `cursos.length === 6`, each quiz has 5 questions with valid `resposta` index |
| 33 | Per-course quiz with 5 questions | rendered on `curso.html?id=N` for all N |
| 34 | Progress saved & restored on reload | mark course 1 done, reload `dashboard.html`, assert "1 de 6" |
| 35 | Works offline except videos/fonts | with network disabled: pages render, quizzes run, progress saves; fonts/icons fall back to system fonts (exempted by the requirement) |
| 36 | Consistent design | single `style.css`, token-only components |
| 37 | Responsive at 3 sizes | 375px / 768px / 1440px viewport checks |
| 38 | Zero console errors | DevTools console clean across all pages and flows |

Container-level checks:
- `docker compose up -d` → `docker compose ps` shows `healthy`.
- `curl -I http://localhost:8080/` → `200`; `curl -s http://localhost:8080/nao-existe | grep 404` → friendly 404 body; `curl -I http://localhost:8080/SPEC.md` → `403`.

---

## 14. Deliverables Checklist

- [ ] All files in §5 created, code commented in pt-BR
- [ ] `data/cursos.json` complete with real course content and 30 quiz questions
- [ ] Real YouTube video URLs replacing the `Exemplo1..6` placeholders
- [ ] Font Awesome + Google Fonts via CDN (requirements section 5)
- [ ] `docker-compose.yml` + `nginx.conf` per §4
- [ ] `README.md` (pt-BR) with Docker and non-Docker run instructions
- [ ] Acceptance criteria 32–38 verified

---

## 15. Known Limitations & Decisions

- **YouTube requires internet**: embeds are the only non-offline feature; the facade
  shows a clear "vídeo requer internet" placeholder when offline.
- **Fonts/icons via CDN**: Google Fonts and Font Awesome come from CDN; offline, the
  site falls back to system fonts (exempted by requirement 35).
- **Fake contact form**: submit is client-side only, with a success message; no data
  leaves the browser.
- **Placeholder links in requirements**: video URLs, testimonial photos, and the
  privacy policy content must be authored during implementation.
- **Bind-mounted web root**: the whole repo is mounted into nginx; infra files are
  blocked via `deny` rules (§4.2).
- **Progress is per-browser**: clearing site data resets progress (inherent to
  requirement 24).
