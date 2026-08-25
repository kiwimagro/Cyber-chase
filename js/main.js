/* ==========================================================================
   main.js — FUNCIONALIDADES GLOBAIS DO SITE
   Ativa em todas as páginas:
   - Aplicação do tema (escuro por padrão) e modo de leitura
   - Alternância de tema e modo de leitura pelos botões do cabeçalho
   - Menu hambúrguer no celular
   - Formulário de contato (envio falso, requisito 18)
   - Ano atual no rodapé
   ========================================================================== */

import { Tema, Leitura } from "./progresso.js";

// Executa assim que o DOM estiver pronto
document.addEventListener("DOMContentLoaded", () => {
  // Aplica preferências salvas antes de mostrar a página (evita "piscar" de tema)
  Tema.aplicar(Tema.obter());
  Leitura.aplicar(Leitura.obter());

  configurarCabecalho();
  configurarFormularioContato();
  configurarRodape();
});

/* ------------------------- CABEÇALHO ------------------------------------- */
function configurarCabecalho() {
  // Botão do menu no celular
  const botaoMenu = document.querySelector(".botao-menu");
  const navegacao = document.querySelector(".navegacao");
  if (botaoMenu && navegacao) {
    botaoMenu.addEventListener("click", () => {
      const aberta = navegacao.classList.toggle("aberta");
      botaoMenu.setAttribute("aria-expanded", String(aberta));
      botaoMenu.innerHTML = aberta
        ? '<i class="fa-solid fa-xmark" aria-hidden="true"></i>'
        : '<i class="fa-solid fa-bars" aria-hidden="true"></i>';
    });
  }

  // Botão de alternância de tema (requisito 22: escuro por padrão)
  const botaoTema = document.querySelector(".botao-tema");
  if (botaoTema) {
    botaoTema.addEventListener("click", () => {
      const novo = Tema.alternar();
      botaoTema.innerHTML =
        novo === "escuro"
          ? '<i class="fa-solid fa-moon" aria-hidden="true"></i>'
          : '<i class="fa-solid fa-sun" aria-hidden="true"></i>';
      botaoTema.setAttribute(
        "aria-label",
        novo === "escuro" ? "Ativar tema claro" : "Ativar tema escuro"
      );
    });
  }

  // Botão do modo de leitura (requisito 31: fonte maior e mais contraste)
  const botaoLeitura = document.querySelector(".botao-leitura");
  if (botaoLeitura) {
    botaoLeitura.addEventListener("click", () => {
      const ativo = Leitura.alternar();
      botaoLeitura.setAttribute("aria-pressed", String(ativo));
      botaoLeitura.setAttribute(
        "aria-label",
        ativo ? "Desativar modo de leitura" : "Ativar modo de leitura"
      );
    });
  }
}

/* ---------------------- FORMULÁRIO DE CONTATO ----------------------------- */
// O formulário não envia de verdade (requisito 18): só valida e confirma.
function configurarFormularioContato() {
  const formulario = document.querySelector(".formulario");
  if (!formulario) return;

  formulario.addEventListener("submit", (evento) => {
    evento.preventDefault();
    let valido = true;

    // Valida cada campo obrigatório
    formulario.querySelectorAll("[required]").forEach((campo) => {
      const invalido = campo.value.trim() === "";
      campo.closest(".campo").classList.toggle("invalido", invalido);
      if (invalido) valido = false;
    });

    // Validação extra do e-mail (precisa ter @ e ponto)
    const email = formulario.querySelector('input[type="email"]');
    if (email) {
      const campoEmail = email.closest(".campo");
      const formatoValido = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value.trim());
      campoEmail.classList.toggle("invalido", !formatoValido);
      if (!formatoValido) valido = false;
    }

    if (!valido) return;

    // Sucesso: mostra a mensagem e limpa os campos
    const sucesso = document.querySelector(".mensagem-sucesso");
    if (sucesso) {
      sucesso.classList.add("visivel");
      sucesso.textContent =
        "Mensagem recebida! Em breve nossa equipe entrará em contato. (Demonstração: nada foi enviado de verdade.)";
    }
    formulario.reset();
  });
}

/* ----------------------------- RODAPÉ ------------------------------------ */
function configurarRodape() {
  // Mantém o ano do copyright sempre atual
  const ano = document.querySelector(".ano-atual");
  if (ano) ano.textContent = new Date().getFullYear();
}
