🛡️ Cyber Chase — Plataforma Educacional de Cibersegurança

> **Sua segurança começa aqui.**

Site educativo que ensina pessoas comuns (sem conhecimento técnico) a se protegerem
contra golpes na internet: 6 cursos, quizzes interativos, progresso salvo no navegador
e design amigável com tema escuro.

---

## ✨ Funcionalidades

- **6 cursos** em linguagem simples: Introdução à Cibersegurança, Phishing, LGPD,
  Segurança em Redes, Senhas e Como Identificar Golpes
- **Quiz por curso** (5 perguntas com feedback imediato e explicação)
- **Quiz geral** (10 perguntas sorteadas de todos os temas)
- **Progresso salvo no navegador** (localStorage) — sem login, sem cadastro
- **Dashboard** com barra de progresso e sugestão do próximo curso
- **Tema escuro por padrão**, modo de leitura com fonte maior (acessibilidade)
- **Responsivo** (celular, tablet e desktop) e **100% gratuito**

---

## 🐳 Como executar com Docker Compose

Pré-requisito: [Docker](https://docs.docker.com/get-docker/) com Docker Compose.

```bash
# 1. Inicie o site (em segundo plano)
docker compose up -d

# 2. Abra no navegador
#    http://localhost:8080
```

O site é um conjunto de arquivos estáticos dentro do container.
Como a pasta do projeto é montada diretamente no container, qualquer edição nos
arquivos aparece na hora (basta atualizar a página).

### Comandos úteis

| Comando | O que faz |
|---|---|
| `docker compose up -d` | Inicia o site em segundo plano |
| `docker compose ps` | Mostra o status (aguarde ficar `healthy`) |
| `docker compose logs -f` | Acompanha os logs do nginx |
| `docker compose restart` | Reinicia (necessário após alterar o `nginx.conf`) |
| `docker compose down` | Para e remove o container |

### Trocar a porta

A porta padrão é **8080**. Para usar outra:

```bash
CYBER_CHASE_PORT=9090 docker compose up -d
# ou crie um arquivo .env com: CYBER_CHASE_PORT=9090
```

---

## 🚀 Como executar sem Docker (alternativa)

Como o site é estático, qualquer servidor HTTP simples funciona:

```bash
# Opção A: com Python
python3 -m http.server 8080

# Opção B: com Node.js
npx serve .

# Depois abra http://localhost:8080
```

> ⚠️ Importante: abrir o `index.html` direto (duplo clique) **não funciona**,
> porque o navegador bloqueia o carregamento do `data/cursos.json` via `file://`.
> Use sempre um servidor HTTP.

---

## 📁 Estrutura do projeto

```
.
├── docker-compose.yml   # Orquestração do container (nginx)
├── nginx.conf           # Configuração do servidor (gzip, cache, 404)
├── index.html           # Página inicial (hero, estatísticas, depoimentos)
├── cursos.html          # Lista dos 6 cursos
├── curso.html           # Página do curso (?id=1..6) com quiz
├── quiz.html            # Quiz geral (10 perguntas sorteadas)
├── dashboard.html       # Progresso do usuário
├── sobre.html           # Sobre o projeto + fontes + privacidade
├── contato.html         # Formulário de contato (demonstrativo)
├── 404.html             # Página de erro amigável
├── css/
│   └── style.css        # Estilos globais (tokens, tema escuro, responsivo)
├── js/
│   ├── main.js          # Comportamentos globais (tema, menu, formulário)
│   ├── cursos.js        # Carregamento e renderização dos cursos
│   ├── quiz.js          # Motor de quizzes (perguntas, feedback, pontuação)
│   └── progresso.js     # Gerenciamento do localStorage
├── assets/
│   └── img/logo.svg     # Logotipo (escudo com cadeado)
└── data/
    └── cursos.json      # Conteúdo dos 6 cursos + 30 perguntas de quiz
```

---

## 🧭 Como funciona

1. **Cursos** — todo o conteúdo (títulos, tópicos, vídeos e quizzes) fica em
   `data/cursos.json` e é carregado pelo JavaScript. Para adicionar ou editar um
   curso, basta alterar esse arquivo.
2. **Progresso** — ao clicar em "Concluir Curso", o progresso é salvo no
   `localStorage` do navegador (chave `cc_progresso`) e recuperado ao recarregar.
3. **Quizzes** — feedback imediato com explicação após cada resposta, pontuação
   final (X/5 ou X/10) e opção de refazer quantas vezes quiser.
4. **Vídeos** — embutidos do YouTube em modo de privacidade
   (`youtube-nocookie.com`) e carregados só quando você clica (site mais rápido).

---

## 🔒 Privacidade

O Cyber Chase **não coleta dados pessoais** e não usa cookies. Todo o progresso fica
apenas no seu navegador. Veja a [Política de Privacidade](sobre.html#privacidade).

---

## 📄 Licença

Conteúdo educativo gratuito, criado para fins de aprendizado e conscientização.
