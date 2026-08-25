/* ==========================================================================
   progresso.js — GERENCIAMENTO DO localStorage (requisito 24)
   Único módulo autorizado a ler/gravar o localStorage do site.
   Chaves usadas (prefixo "cc_"):
   - cc_progresso  → progresso por curso
   - cc_tema       → tema escolhido ("escuro" | "claro")
   - cc_leitura    → modo de leitura ("ativo" | ausente)
   - cc_quiz_geral → melhor pontuação do quiz geral
   ========================================================================== */

// Chaves centralizadas para evitar erros de digitação
const CHAVES = {
  progresso: "cc_progresso",
  tema: "cc_tema",
  leitura: "cc_leitura",
  quizGeral: "cc_quiz_geral",
};

// Lê um valor JSON do localStorage com segurança.
// Se a chave não existir ou estiver corrompida, devolve o padrão.
function lerJSON(chave, padrao) {
  try {
    const valor = localStorage.getItem(chave);
    return valor ? JSON.parse(valor) : padrao;
  } catch {
    return padrao;
  }
}

// Grava um valor JSON no localStorage sem quebrar em modo anônimo.
function salvarJSON(chave, valor) {
  try {
    localStorage.setItem(chave, JSON.stringify(valor));
  } catch {
    /* navegador sem armazenamento disponível: ignora silenciosamente */
  }
}

// Obtém o objeto completo de progresso: { "1": {concluido, data}, ... }
function obterProgresso() {
  return lerJSON(CHAVES.progresso, {});
}

// Verifica se um curso (id 1 a 6) já foi concluído
function estaConcluido(id) {
  const p = obterProgresso();
  return Boolean(p[String(id)] && p[String(id)].concluido);
}

// Marca um curso como concluído e salva a data (requisito 27)
function marcarConcluido(id) {
  const p = obterProgresso();
  p[String(id)] = { concluido: true, data: new Date().toISOString().slice(0, 10) };
  salvarJSON(CHAVES.progresso, p);
}

// Quantos cursos já foram concluídos (0 a 6)
function totalConcluidos() {
  return Object.values(obterProgresso()).filter((c) => c.concluido).length;
}

// Lista de ids dos cursos concluídos, como números
function idsConcluidos() {
  return Object.entries(obterProgresso())
    .filter(([, c]) => c.concluido)
    .map(([id]) => Number(id));
}

// Sugere o próximo curso a fazer: o primeiro ainda não concluído (1 a 6),
// ou null se todos estiverem concluídos.
function proximoCurso() {
  for (let id = 1; id <= 6; id++) {
    if (!estaConcluido(id)) return id;
  }
  return null;
}

// Melhor pontuação já obtida no quiz geral (ou null)
function melhorQuizGeral() {
  const r = lerJSON(CHAVES.quizGeral, null);
  return r && typeof r.melhor === "number" ? r.melhor : null;
}

// Registra a pontuação do quiz geral, guardando sempre a maior
function registrarQuizGeral(pontos) {
  const atual = lerJSON(CHAVES.quizGeral, null);
  const melhor = Math.max(pontos, atual ? atual.melhor : 0);
  salvarJSON(CHAVES.quizGeral, { melhor, ultima: new Date().toISOString().slice(0, 10) });
}

/* ----------------------------- TEMA ------------------------------------- */
// Tema escuro é o padrão (requisito 22)
function temaObter() {
  return localStorage.getItem(CHAVES.tema) === "claro" ? "claro" : "escuro";
}

// Alterna entre claro e escuro, aplica no <html> e devolve o novo valor
function temaAlternar() {
  const novo = temaObter() === "escuro" ? "claro" : "escuro";
  try { localStorage.setItem(CHAVES.tema, novo); } catch { /* ignora */ }
  temaAplicar(novo);
  return novo;
}

// Aplica o tema no atributo data-tema do elemento raiz
function temaAplicar(valor) {
  document.documentElement.setAttribute("data-tema", valor);
}

/* ----------------------- MODO DE LEITURA -------------------------------- */
// Modo de leitura: fonte maior e contraste reforçado (requisito 31)
function leituraObter() {
  try { return localStorage.getItem(CHAVES.leitura) === "ativo"; } catch { return false; }
}

function leituraAlternar() {
  const novo = !leituraObter();
  try {
    if (novo) localStorage.setItem(CHAVES.leitura, "ativo");
    else localStorage.removeItem(CHAVES.leitura);
  } catch { /* ignora */ }
  leituraAplicar(novo);
  return novo;
}

function leituraAplicar(ativo) {
  document.documentElement.classList.toggle("modo-leitura", ativo);
}

/* --------------------------- EXPORTAÇÕES -------------------------------- */
// Objetos com nome de módulo para manter o código legível nas páginas
export const Progresso = {
  estaConcluido,
  marcarConcluido,
  totalConcluidos,
  idsConcluidos,
  proximoCurso,
  melhorQuizGeral,
  registrarQuizGeral,
};

export const Tema = { obter: temaObter, alternar: temaAlternar, aplicar: temaAplicar };

export const Leitura = { obter: leituraObter, alternar: leituraAlternar, aplicar: leituraAplicar };
