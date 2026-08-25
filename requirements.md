📄 ESPECIFICAÇÃO TÉCNICA – CYBER CHASE

1. VISÃO GERAL DO PROJETO

Item Descrição
Nome do Projeto Cyber Chase – Plataforma Educacional de Cibersegurança
Objetivo Ensinar usuários comuns (leigos em tecnologia) a se protegerem
contra ataques cibernéticos através de cursos interativos, quizzes e
conteúdo acessível.
Público-alvo Pessoas sem conhecimento técnico em TI: idosos, funcionários
de empresas, estudantes, usuários comuns da internet.
Tom do site Amigável, acolhedor, educativo, sem jargões técnicos. Linguagem
simples e direta.

---

2. REQUISITOS FUNCIONAIS (O que o site DEVE fazer)

2.1. PÁGINA INICIAL (Home)

# Funcionalidade Descrição
1 Logo e identidade visual Exibir logo "Cyber Chase" com slogan "Sua
segurança começa aqui"
2 Hero Banner Chamada principal: "Proteja-se contra golpes na internet" +
botão CTA "Começar Agora"
3 Estatísticas Exibir números: "6 cursos", "50+ lições", "100% gratuito"
4 Depoimentos 3 depoimentos fictícios de usuários (com foto, nome e texto)
5 Rodapé Links para Sobre, Contato, Política de Privacidade

2.2. SISTEMA DE CURSOS

# Funcionalidade Descrição
6 Listar cursos Exibir 6 cursos em cards com: ícone, título, descrição
curta, duração, nível (Iniciante/Intermediário)
7 Página do curso Conter: título, descrição completa, conteúdo em texto
dividido em tópicos, vídeo embutido (YouTube), botão "Concluir"
8 Progresso Salvar no localStorage qual curso já foi concluído
9 Selo de conclusão Exibir selo/certificado ao final de cada curso

2.3. SISTEMA DE QUIZZES

# Funcionalidade Descrição
10 Quiz por curso Ao final de cada curso, 5 perguntas de múltipla escolha
sobre o tema
11 Quiz geral Página com 10 perguntas sorteadas de todos os temas
12 Feedback imediato Após cada resposta, mostrar se acertou ou errou e a
explicação
13 Pontuação Mostrar pontuação final (X/5 ou X/10)

2.4. DASHBOARD DO USUÁRIO

# Funcionalidade Descrição
14 Barra de progresso Mostrar progresso geral: "2 de 6 cursos concluídos"
15 Sugestão Indicar qual curso fazer a seguir
16 Cursos concluídos Marcar cursos com checkmark verde

2.5. PÁGINAS COMPLEMENTARES

# Funcionalidade Descrição
17 Sobre Explicar o propósito, incluir estatísticas reais (crescimento de
44% em 2025, Brasil líder na AL) e fontes
18 Contato Formulário com: Nome, E-mail, Mensagem (não precisa enviar de
verdade)
19 404 Página de erro amigável

---

3. CONTEÚDO DOS 6 CURSOS

Curso 1: Introdução à Cibersegurança

Campo Conteúdo
Título Introdução à Cibersegurança
Descrição Entenda o que é cibersegurança, por que ela é importante no dia a
dia e como você já está vulnerável sem saber.
Tópicos O que é cibersegurança, principais ameaças, por que você é um alvo,
o que fazer em caso de ataque
Quiz 5 perguntas sobre conceitos básicos
Vídeo https://www.youtube.com/watch?v=Exemplo1 (link real sobre
cibersegurança)

Curso 2: Phishing e Engenharia Social

Campo Conteúdo
Título Phishing e Engenharia Social
Descrição Aprenda a identificar e-mails e mensagens falsas que tentam
roubar seus dados pessoais e financeiros.
Tópicos O que é phishing, exemplos reais (Banco, Correios, Netflix), como
verificar o remetente, o que fazer se cair
Quiz 5 perguntas sobre identificação de golpes
Vídeo https://www.youtube.com/watch?v=Exemplo2

Curso 3: LGPD e Proteção de Dados

| Título | LGPD e Proteção de Dados |

| Descrição | Conheça seus direitos segundo a Lei Geral de Proteção de
Dados e aprenda a proteger suas informações pessoais. |

| Tópicos | O que é a LGPD, seus direitos, como as empresas devem tratar
seus dados, dicas para proteger informações |

| Quiz | 5 perguntas sobre LGPD |

| Vídeo | https://www.youtube.com/watch?v=Exemplo3 |

Curso 4: Segurança em Redes

| Título | Segurança em Redes |

| Descrição | Saiba como usar redes Wi-Fi com segurança, o que é VPN e como
navegar na internet sem riscos. |

| Tópicos | Wi-Fi público x privado, o que é VPN, navegação anônima,
cuidados com Bluetooth |

| Quiz | 5 perguntas sobre redes |

| Vídeo | https://www.youtube.com/watch?v=Exemplo4 |

Curso 5: Boas Práticas de Senhas

| Título | Boas Práticas de Senhas |

| Descrição | Crie senhas fortes e aprenda a gerenciá-las sem precisar
decorar tudo. |

| Tópicos | Como criar senhas fortes, o que é um gerenciador de senhas,
autenticação em dois fatores (2FA), dicas de segurança |

| Quiz | 5 perguntas sobre senhas |

| Vídeo | https://www.youtube.com/watch?v=Exemplo5 |

Curso 6: Como Identificar Golpes

| Título | Como Identificar Golpes |

| Descrição | Conheça os golpes mais comuns no Brasil: Pix falso, falso
sequestro, boleto falso, e muito mais. |

| Tópicos | Golpes mais comuns, sinais de alerta, como verificar antes de
fazer um pagamento, onde denunciar |

| Quiz | 5 perguntas sobre golpes |

| Vídeo | https://www.youtube.com/watch?v=Exemplo6 |

---

4. REQUISITOS NÃO FUNCIONAIS (Como o site DEVE se comportar)

# Requisito Descrição
20 Responsividade Funcionar perfeitamente em desktop, tablet e celular
(mobile-first)
21 Acessibilidade Contraste adequado, navegação por teclado, textos em
tamanho legível
22 Modo escuro Ativado por padrão (tema noturno)
23 Performance Carregar em menos de 3 segundos em conexão 4G
24 Sem necessidade de login Usar localStorage para salvar progresso
25 Compatibilidade Funcionar nos navegadores: Chrome, Firefox, Edge, Safari
(últimas 2 versões)
26 Código comentado Todos os arquivos com comentários em português
explicando o que faz cada seção

---

5. TECNOLOGIAS RECOMENDADAS

Camada Tecnologia Motivo
Front-end HTML5 + CSS3 + JavaScript puro Mais simples, não precisa de
frameworks para este projeto
Estilização CSS com variáveis customizadas Facilita mudança de tema (modo
escuro)
Ícones Font Awesome CDN Gratuito e fácil de usar
Fontes Google Fonts (Inter ou Poppins) Leitura confortável
Dados localStorage (navegador) Não exige backend, progresso salvo localmente
Hospedagem Vercel, Netlify ou GitHub Pages Gratuitos e simples

---

6. PALETA DE CORES

Uso Cor Código Hexadecimal
Fundo principal Azul escuro #0a1628
Fundo secundário Azul médio #111d33
Texto principal Branco #ffffff
Texto secundário Cinza claro #b0c4de
Cor primária (botões) Roxo #6c3bcb
Cor primária hover Roxo claro #8b5cf6
Cor de destaque Ciano #22d3ee
Sucesso (concluído) Verde #34d399
Alerta/erro Vermelho #ef4444

---

7. ESTRUTURA DE ARQUIVOS

```
cyber-chase/
│
├── index.html # Página inicial
├── cursos.html # Lista de todos os cursos
├── curso.html # Página individual do curso (usa parâmetro ?id=1)
├── quiz.html # Quiz geral
├── sobre.html # Página Sobre
├── contato.html # Página Contato
├── dashboard.html # Painel do usuário
│
├── css/
│ └── style.css # Estilos globais
│
├── js/
│ ├── main.js # Funcionalidades globais
│ ├── cursos.js # Lógica dos cursos
│ ├── quiz.js # Lógica dos quizzes
│ └── progresso.js # Gerenciamento do localStorage
│
├── assets/
│ ├── img/ # Imagens, ícones, logo
│ └── fonts/ # Fontes locais (se necessário)
│
└── data/
    └── cursos.json # Dados de todos os cursos (títulos, conteúdo, quizzes)
```

---

8. COMPORTAMENTOS ESPECÍFICOS

# Comportamento Descrição
27 Salvar progresso Ao concluir um curso, salvar no localStorage: {
cursoId: 1, concluido: true, data: "2026-08-23" }
28 Quiz reiniciável O usuário pode refazer o quiz quantas vezes quiser
29 Marcar curso como concluído Botão fica verde e muda para "✅ Curso
Concluído"
30 Scroll suave Animações suaves ao navegar entre seções
31 Modo de leitura Botão que aumenta fonte e muda contraste para idosos

---

9. CRITÉRIOS DE ACEITE (Como saber se ficou pronto)

# Critério
32 Todos os 6 cursos estão disponíveis com conteúdo completo
33 Cada curso tem seu próprio quiz com 5 perguntas
34 O progresso do usuário é salvo e recuperado ao recarregar a página
35 O site é totalmente funcional sem internet (exceto vídeos e fontes)
36 O design é consistente em todas as páginas
37 O site é responsivo (testado em 3 tamanhos de tela)
38 Nenhum erro no console do navegador

---

10. EXEMPLO DE DADOS (para o arquivo cursos.json)

```json
{
  "cursos": [
    {
      "id": 1,
      "titulo": "Introdução à Cibersegurança",
      "descricao_curta": "Entenda os conceitos básicos de segurança
digital.",
      "descricao_longa": "Neste curso você vai aprender o que é
cibersegurança...",
      "nivel": "Iniciante",
      "duracao": "15 min",
      "icone": "fa-shield-halved",
      "video": "https://www.youtube.com/embed/EXEMPLO",
      "conteudo": [
        "O que é cibersegurança?",
        "Principais ameaças digitais",
        "Por que você é um alvo?"
      ],
      "quiz": [
        {
          "pergunta": "O que é cibersegurança?",
          "opcoes": [
            "Um tipo de vírus",
            "Práticas para proteger dados digitais",
            "Um programa de computador",
            "Uma rede social"
          ],
          "resposta": 1,
          "explicacao": "Cibersegurança é o conjunto de práticas para
proteger sistemas, redes e dados contra ataques."
        }
      ]
    }
  ]
}
```

---

11. INSTRUÇÕES PARA O DEEPSEEK

IMPORTANTE: Com base nesta especificação, você deve:

1. Gerar todos os arquivos HTML, CSS e JavaScript necessários
2. Seguir rigorosamente a paleta de cores e a estrutura definida
3. Comentar todo o código em português
4. Garantir que os quizzes funcionem e o progresso seja salvo
5. Gerar um README.md com instruções de instalação e execução
6. Se algo não for possível, explicar a limitação e sugerir alternativa

---

12. LINKS PARA PESQUISA (para usar no conteúdo do site)

Tema Link
Aumento de ataques em 2025
https://ibsec.com.br/ataques-ciberneticos-globais-crescem-44-diz-estudo-de-2025/
Brasil líder na AL https://youtu.be/vgzv2kzqrb0?si=bPfjWJBHW8bLTGsT
Relatório CrowdStrike
https://go.crowdstrike.com/2026-global-threat-report-exec-summary-pt-br
Notícias sobre crimes cibernéticos no Brasil G1, Senado, CNN