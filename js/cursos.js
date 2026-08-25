/* ==========================================================================
   cursos.js — LÓGICA DOS CURSOS (requisitos 6 a 9)
   Responsabilidades:
   - Carregar data/cursos.json uma única vez (com cache em memória)
   - Renderizar os cards na página cursos.html
   - Renderizar a página de detalhes (curso.html?id=N)
   - Preparar a fachada do vídeo do YouTube (clique para carregar)
   ========================================================================== */

import { Progresso } from "./progresso.js";
import { iniciarQuiz } from "./quiz.js";

// Cache: o JSON é baixado só uma vez por sessão
let cacheCursos = null;

// Carrega a lista de cursos. Lança erro se a rede/JSON falhar,
// para que a página possa exibir uma mensagem amigável.
export async function carregarCursos() {
  if (cacheCursos) return cacheCursos;
  const resposta = await fetch("data/cursos.json");
  if (!resposta.ok) throw new Error("Não foi possível carregar os cursos.");
  cacheCursos = await resposta.json();
  return cacheCursos;
}

// Busca um curso pelo id; devolve undefined se não existir
export function obterCursoPorId(cursos, id) {
  return cursos.cursos.find((c) => c.id === id);
}

// Cria a fachada do vídeo: mostra um cartaz com botão play.
// O iframe do YouTube só é injetado quando o usuário clica (performance).
function criarFachadaVideo(curso) {
  const moldura = document.createElement("div");
  moldura.className = "video-fachada";
  moldura.setAttribute("role", "button");
  moldura.setAttribute("tabindex", "0");
  moldura.setAttribute("aria-label", `Assistir ao vídeo: ${curso.titulo}`);

  const botao = document.createElement("button");
  botao.className = "botao-play";
  botao.innerHTML = '<i class="fa-solid fa-play" aria-hidden="true"></i>';
  botao.type = "button";

  const titulo = document.createElement("p");
  titulo.className = "titulo-video";
  titulo.textContent = `Vídeo: ${curso.titulo}`;

  // Função que troca a fachada pelo iframe real
  const carregarVideo = () => {
    const iframe = document.createElement("iframe");
    iframe.src = curso.video;
    iframe.title = `Vídeo do curso: ${curso.titulo}`;
    iframe.allow = "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture";
    iframe.allowFullscreen = true;
    moldura.replaceChildren(iframe);
  };

  moldura.addEventListener("click", carregarVideo);
  // Permite "apertar Enter" na fachada pelo teclado
  moldura.addEventListener("keydown", (e) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      carregarVideo();
    }
  });

  moldura.append(botao, titulo);
  return moldura;
}

// Renderiza os cards na página cursos.html
export function renderizarCards(cursos, destino) {
  const fragmento = document.createDocumentFragment();

  for (const curso of cursos.cursos) {
    const concluido = Progresso.estaConcluido(curso.id);

    const card = document.createElement("a");
    card.className = "card card-curso";
    card.href = `curso.html?id=${curso.id}`;

    const icone = document.createElement("span");
    icone.className = "icone-curso";
    icone.innerHTML = `<i class="fa-solid ${curso.icone}" aria-hidden="true"></i>`;

    const titulo = document.createElement("h3");
    titulo.textContent = curso.titulo;

    const descricao = document.createElement("p");
    descricao.textContent = curso.descricao_curta;

    // Metadados: duração e nível do curso
    const meta = document.createElement("div");
    meta.className = "meta-curso";
    meta.innerHTML = `
      <span><i class="fa-regular fa-clock" aria-hidden="true"></i> ${curso.duracao}</span>
      <span class="badge ${curso.nivel === "Iniciante" ? "badge-iniciante" : ""}">${curso.nivel}</span>`;

    // Marcador verde para cursos já concluídos (requisito 16)
    let marcador = null;
    if (concluido) {
      marcador = document.createElement("span");
      marcador.className = "concluido-marcador";
      marcador.innerHTML = '<i class="fa-solid fa-circle-check" aria-hidden="true"></i> Concluído';
    }

    card.append(icone, titulo, descricao, meta);
    if (marcador) card.append(marcador);
    fragmento.append(card);
  }

  destino.replaceChildren(fragmento);
}

// Renderiza a página completa do curso (curso.html)
export function renderizarCurso(curso, destino, aoConcluir) {
  const concluido = Progresso.estaConcluido(curso.id);

  const fragmento = document.createDocumentFragment();

  /* --- Cabeçalho do curso --- */
  const cabecalho = document.createElement("header");
  cabecalho.className = "cabecalho-curso";
  cabecalho.innerHTML = `
    <span class="badge ${curso.nivel === "Iniciante" ? "badge-iniciante" : ""}">${curso.nivel}</span>
    <h1>${curso.titulo}</h1>
    <div class="meta-curso">
      <span><i class="fa-regular fa-clock" aria-hidden="true"></i> ${curso.duracao}</span>
    </div>
    <p class="subtitulo-secao">${curso.descricao_longa}</p>`;

  /* --- Estrutura em duas colunas --- */
  const estrutura = document.createElement("div");
  estrutura.className = "estrutura-curso";

  // Coluna esquerda: conteúdo em tópicos + vídeo
  const colunaConteudo = document.createElement("div");
  colunaConteudo.innerHTML = `<h2>O que você vai aprender</h2>`;
  const lista = document.createElement("ul");
  lista.className = "topicos-lista";
  for (const topico of curso.conteudo) {
    const item = document.createElement("li");
    item.innerHTML = `<i class="fa-solid fa-circle-check" aria-hidden="true"></i> <span>${topico}</span>`;
    lista.append(item);
  }
  colunaConteudo.append(lista);
  colunaConteudo.append(criarFachadaVideo(curso));

  // Coluna direita: quiz do curso (requisito 10)
  const colunaQuiz = document.createElement("div");
  colunaQuiz.className = "card quiz-area";
  colunaQuiz.innerHTML = `<h2>Quiz do curso</h2>
    <p class="subtitulo-secao">Responda as 5 perguntas para testar o que você aprendeu.</p>`;

  // Área onde o quiz é renderizado
  const areaQuiz = document.createElement("div");
  areaQuiz.className = "quiz";
  colunaQuiz.append(areaQuiz);

  /* --- Botão de conclusão + selo --- */
  const rodapeCurso = document.createElement("div");
  rodapeCurso.className = "quiz-area";

  const botaoConcluir = document.createElement("button");
  botaoConcluir.className = "botao botao-sucesso";
  botaoConcluir.type = "button";
  botaoConcluir.disabled = true; // só libera depois que o quiz for respondido
  botaoConcluir.innerHTML = concluido
    ? '<i class="fa-solid fa-circle-check" aria-hidden="true"></i> Curso Concluído'
    : '<i class="fa-solid fa-flag-checkered" aria-hidden="true"></i> Concluir Curso';
  if (concluido) botaoConcluir.dataset.concluido = "true";

  const selo = document.createElement("div");
  selo.className = `selo-conclusao ${concluido ? "visivel" : ""}`;
  selo.setAttribute("role", "status");
  selo.innerHTML = `<i class="fa-solid fa-award" aria-hidden="true"></i>
    <span>Parabéns! Você concluiu este curso e ganhou um selo.</span>`;

  // Ao clicar em "Concluir": salva o progresso e atualiza a interface (requisito 29)
  botaoConcluir.addEventListener("click", () => {
    if (botaoConcluir.dataset.concluido === "true") return;
    Progresso.marcarConcluido(curso.id);
    botaoConcluir.innerHTML = '<i class="fa-solid fa-circle-check" aria-hidden="true"></i> Curso Concluído';
    botaoConcluir.dataset.concluido = "true";
    selo.classList.add("visivel");
    if (aoConcluir) aoConcluir(curso.id);
  });

  rodapeCurso.append(botaoConcluir, selo);
  colunaQuiz.append(rodapeCurso);

  estrutura.append(colunaConteudo, colunaQuiz);
  fragmento.append(cabecalho, estrutura);

  destino.replaceChildren(fragmento);

  /* --- Inicia o quiz: ao terminar, libera o botão "Concluir" --- */
  iniciarQuiz({
    perguntas: curso.quiz,
    container: areaQuiz,
    aoFinalizar: () => {
      botaoConcluir.disabled = false;
      botaoConcluir.scrollIntoView({ behavior: "smooth", block: "nearest" });
    },
  });
}
