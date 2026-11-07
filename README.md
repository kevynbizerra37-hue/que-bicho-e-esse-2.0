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
- Ilustrações próprias dos 8 primeiros animais no lugar dos emojis.
- Funciona sem internet: a fonte vem junto com o jogo.
- Layout ajustado para notebook, monitor Full HD, projetor e celular.

## O que mudou na 2.1

- **Pontuação:** as coroas de uma caverna só entram no placar quando ela termina. Antes dava para acertar a 1ª etapa, voltar ao mapa e entrar de novo para ganhar as mesmas coroas várias vezes. A celebração mostra quantas coroas a caverna rendeu.
- **Movimento:** o sapo anda na mesma velocidade em qualquer monitor (em telas de 120/144 Hz ele andava o dobro e passava direto das curvas) e não volta da caverna deslizando.
- **Acessibilidade:** as cavernas viraram botões (Tab + ENTER, e o leitor de tela diz se estão abertas ou fechadas); ao trocar de fase o foco vai para o título; a ajuda e as configurações prendem o foco e devolvem ao fechar; a sombra tem descrição para leitor de tela; quem ativa "reduzir movimento" no sistema fica sem animações piscando.
- **5 animais novos:** tucano, jacaré, bicho-preguiça, lobo-guará e boto-cor-de-rosa.

### Para a equipe de design: arquivos que faltam

Os animais novos já estão no jogo usando emoji e um bipe no lugar do desenho e do som. Basta colocar os arquivos **com estes nomes exatos** nas pastas (sem mexer no código):

| Animal | Desenho (`assets/images/animais/`) | Som (`assets/sounds/`) |
|---|---|---|
| Tucano | `tucano.png` | `tucano.mp3` |
| Jacaré | `jacare.png` | `jacare.mp3` |
| Bicho-preguiça | `preguica.png` | `preguica.mp3` |
| Lobo-guará | `loboguara.png` | `loboguara.mp3` |
| Boto-cor-de-rosa | `boto.png` | `boto.mp3` |

Desenho: PNG quadrado (512×512), **fundo transparente** (a fase da sombra pinta o desenho de preto). Som: MP3 com o bicho logo no começo; o jogo toca só os primeiros 8 segundos. Enquanto um animal não tiver desenho, a 2ª etapa dele é sempre a pergunta (penas, pelo, voa…), e não a sombra.

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
