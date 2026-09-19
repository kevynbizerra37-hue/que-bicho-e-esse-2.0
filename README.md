# 🐸 Que Bicho É Esse? — versão 2.0

Jogo educativo para crianças pequenas descobrirem animais brasileiros pelo **som**, pela **sombra** e por **charadas**. Dá para jogar só com o teclado e com narração em voz alta, então crianças cegas também conseguem jogar.

**▶ [Jogar agora](https://kevynbizerra37-hue.github.io/que-bicho-e-esse-2.0/)** · [Versão inicial](https://github.com/kevynbizerra37-hue/projeto-que-bicho-e-esse)

## Como jogar

- O sapo explorador anda pelas trilhas do mapa: setas ou WASD no teclado, ou arrastando o dedo no celular.
- Cada uma das 6 cavernas tem 3 etapas, cada uma com um animal diferente:
  1. **Som**: escute o bicho e escolha quem é.
  2. **Sombra** ou **pergunta**: descubra pela silhueta, ou responda "qual destes animais voa?".
  3. **Charada**: leia a pista e adivinhe.
- Complete as 6 cavernas e vá até a árvore do centro do mapa.
- Cada partida sorteia outros animais para as cavernas.

**Jogando pelo som:** em ⚙️, ligue a *Narração em voz alta*. As teclas **1 a 4** escolhem a resposta, **R** repete a pergunta, **S** toca o som do bicho de novo, e **ENTER** no mapa entra na próxima caverna.

## O que há de novo na 2.0

- Um mapa só, com trilhas: o sapo anda pelo caminho de terra. São 6 cavernas, e os animais são sorteados a cada partida.
- Três etapas por caverna, com charadas e perguntas de característica (penas, pelo, voa, nada…).
- Narração completa e jogo inteiro pelo teclado.
- Ilustrações próprias dos 8 animais no lugar dos emojis.
- Funciona sem internet: a fonte vem junto com o jogo.
- Layout ajustado para notebook, monitor Full HD, projetor e celular.

## Rodar no computador

Baixe o projeto (**Code → Download ZIP**), descompacte e abra o `index.html` no Chrome, Edge ou Firefox. Não precisa instalar nada.

## Para quem for mexer no jogo

| O quê | Onde |
|---|---|
| Animais: nome, som, charadas, audiodescrição, características, imagem | `js/dados.js`. Para adicionar um animal, copie uma ficha. |
| Imagens dos animais | `assets/images/animais/`, em PNG 512×512 com fundo transparente |
| Posição das cavernas e da árvore | `MAPA`, em `js/dados.js` |
| Trilhas por onde o sapo anda | `js/trilhas.js`, gerado por `ferramentas/gerar-trilhas.html` quando o mapa muda |
| Lógica do jogo | `js/game.js` |

## Créditos

- Fonte [Fredoka](https://fonts.google.com/specimen/Fredoka), licença SIL Open Font License (`assets/fonts/OFL.txt`).
- Ilustrações dos animais geradas com inteligência artificial.
