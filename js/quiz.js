/* ==========================================================================
   quiz.js — MOTOR DE QUIZZES (requisitos 10 a 13, 28)
   Renderiza uma pergunta por vez com 4 alternativas, dá feedback imediato
   com explicação, calcula a pontuação final e permite refazer o quiz.
   ========================================================================== */

// Embaralha um array sem alterar o original (algoritmo Fisher–Yates).
// Usado para sortear perguntas e deixar cada tentativa diferente.
export function embaralhar(array) {
  const copia = [...array];
  for (let i = copia.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copia[i], copia[j]] = [copia[j], copia[i]];
  }
  return copia;
}

// Monta a tela de resultado com a pontuação (X/5 ou X/10) e o botão refazer
function renderizarResultado(container, pontos, total, refazerTexto) {
  const mensagens = [
    "Não desista! Releia o conteúdo e tente de novo.",
    "Bom começo! Você já sabe bastante.",
    "Muito bem! Você está no caminho certo.",
    "Excelente! Você está quase craque.",
    "Perfeito! Você é um agente de elite do Cyber Chase!",
  ];
  // Transforma a nota (0 a 1) em uma das mensagens acima
  const faixa = total === 0 ? 0 : Math.round((pontos / total) * (mensagens.length - 1));

  const caixa = document.createElement("div");
  caixa.className = "resultado-quiz";
  caixa.setAttribute("role", "status");
  caixa.innerHTML = `
    <p class="pontuacao">${pontos}/${total}</p>
    <p class="mensagem">${mensagens[faixa]}</p>`;

  const botaoRefazer = document.createElement("button");
  botaoRefazer.className = "botao botao-secundario";
  botaoRefazer.type = "button";
  botaoRefazer.innerHTML = '<i class="fa-solid fa-rotate-right" aria-hidden="true"></i> ' + refazerTexto;
  // Refazer: sorteia as perguntas de novo e reinicia sem registrar pontuação
  botaoRefazer.addEventListener("click", () => {
    iniciar(container, embaralhar(estado.perguntas), null);
  });

  caixa.append(botaoRefazer);
  container.replaceChildren(caixa);
}

/* ----------------------------- NÚCLEO ----------------------------------- */
// Estado do quiz enquanto ele roda: usado pelos callbacks de resposta
let estado = null;
let callbackFinal = null;

// Inicia o quiz dentro de um container.
// Opções: { perguntas, container, aoFinalizar(pontuacao, total), refazerTexto }
export function iniciarQuiz(opcoes) {
  callbackFinal = opcoes.aoFinalizar || (() => {});
  iniciar(opcoes.container, embaralhar(opcoes.perguntas), opcoes.refazerTexto || "Refazer quiz");
}

// Inicia (ou reinicia) uma rodada com a lista de perguntas já embaralhada
function iniciar(container, perguntas, refazerTexto) {
  estado = {
    container,
    perguntas: perguntas || estado.perguntas,
    indice: 0,
    acertos: 0,
    total: (perguntas || estado.perguntas).length,
    refazerTexto: refazerTexto || estado.refazerTexto || "Refazer quiz",
  };
  renderizarPergunta();
}

// Desenha a pergunta atual e as 4 alternativas
function renderizarPergunta() {
  const { container, perguntas, indice, total } = estado;
  const pergunta = perguntas[indice];

  const caixa = document.createElement("div");
  caixa.innerHTML = `
    <p class="quiz-progresso">Pergunta ${indice + 1} de ${total}</p>
    <h3 class="quiz-pergunta">${pergunta.pergunta}</h3>`;

  // Área das alternativas (botões)
  const opcoes = document.createElement("div");
  opcoes.className = "opcoes";
  caixa.append(opcoes);

  // Área do feedback, anunciada para leitores de tela (acessibilidade)
  const feedback = document.createElement("div");
  feedback.className = "feedback";
  feedback.setAttribute("aria-live", "polite");
  feedback.hidden = true;
  caixa.append(feedback);

  container.replaceChildren(caixa);

  // Cria um botão para cada alternativa
  pergunta.opcoes.forEach((texto, i) => {
    const botao = document.createElement("button");
    botao.className = "opcao";
    botao.type = "button";
    botao.textContent = texto;
    botao.addEventListener("click", () => responder(i, botao, feedback));
    opcoes.append(botao);
  });
}

// Processa a resposta do usuário e mostra o feedback imediato (requisito 12)
function responder(escolhida, botaoEscolhido, feedback) {
  const { perguntas, indice } = estado;
  const pergunta = perguntas[indice];
  const acertou = escolhida === pergunta.resposta;

  if (acertou) estado.acertos++;

  // Desabilita todas as alternativas e pinta a correta de verde
  const botoes = botaoEscolhido.parentElement.querySelectorAll(".opcao");
  botoes.forEach((botao, i) => {
    botao.disabled = true;
    if (i === pergunta.resposta) botao.classList.add("opcao-correta");
  });
  // Se errou, pinta a escolha do usuário de vermelho
  if (!acertou) botaoEscolhido.classList.add("opcao-errada");

  // Mostra a explicação junto com o veredito
  feedback.hidden = false;
  feedback.className = `feedback ${acertou ? "feedback-acerto" : "feedback-erro"}`;
  feedback.innerHTML = `
    <strong>${acertou ? "Certo!" : "Ops, não foi dessa vez."}</strong>
    <p>${pergunta.explicacao}</p>`;

  // Botão para avançar para a próxima pergunta
  const avancar = document.createElement("button");
  avancar.className = "botao";
  avancar.type = "button";
  const ehUltima = estado.indice === estado.total - 1;
  avancar.textContent = ehUltima ? "Ver resultado" : "Próxima";
  avancar.addEventListener("click", () => {
    if (ehUltima) {
      finalizar();
    } else {
      estado.indice++;
      renderizarPergunta();
    }
  });
  feedback.append(avancar);
}

// Mostra a pontuação final e avisa quem chamou o quiz (requisito 13)
function finalizar() {
  const { container, acertos, total, refazerTexto } = estado;
  renderizarResultado(container, acertos, total, refazerTexto);
  callbackFinal(acertos, total);
}
