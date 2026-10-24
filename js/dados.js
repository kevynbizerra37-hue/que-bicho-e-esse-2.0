// ═══════════════════════════════════════════════════════════════
//  DADOS DO JOGO — FONTE ÚNICA
// ═══════════════════════════════════════════════════════════════
//  PARA ADICIONAR OU TROCAR UM ANIMAL:
//    basta escrever a ficha dele em ANIMAIS (copie uma de modelo).
//  O jogo sorteia quais animais vão para as cavernas a cada partida,
//  entao nao existe lista fixa para manter em dia.
//
//  IMPORTANTE: escreva os textos em capitalização normal.
//  A caixa alta vem do CSS (text-transform), porque leitores de tela
//  soletram letra por letra palavras escritas em maiúsculo no HTML.
//
//  `artigo` é 'o' ou 'a': a narração diz "era a arara", "era o tatu".
//
//  `imagem` (opcional) troca o emoji por um desenho de verdade — nem todo
//  bicho tem emoji (o tatu usa o do ouriço, a capivara o do castor).
//  Use PNG com FUNDO TRANSPARENTE, quadrado (uns 512x512), dentro de
//  assets/images/animais/. Ex.: imagem: 'assets/images/animais/tatu.png'
//  A fase da sombra pinta a imagem de preto: com fundo branco ela vira
//  um quadrado preto. Sem imagem (null), o jogo usa o `emoji`, que
//  continua valendo como reserva se o arquivo sumir.
//  As 8 atuais foram geradas por IA (originais em alta resolução na pasta
//  imagens-originais/, fora do jogo), recortadas com a mesma margem e
//  reduzidas para 512px.
//
//  `libras` (opcional) é o vídeo do sinal, ex.: 'assets/videos/libras/tatu.mp4'.
//
//  `charadas` é uma lista: o jogo sorteia uma a cada partida e evita
//  repetir a mesma duas vezes seguidas. Pode ter quantas você quiser
//  (com uma só também funciona).
// ═══════════════════════════════════════════════════════════════

const ANIMAIS = {

  arara: {
    id: 'arara',
    nome: 'Arara',
    artigo: 'a',
    emoji: '🦜',
    som: 'assets/sounds/arara.mp3',
    tom: [880, 660, 990, 660, 880],
    onomatopeia: 'Aráááá! Aráááá!',
    charadas: [
      'Tenho penas azuis e amarelas bem coloridas, um bico grande e curvo, e voo bem alto entre as árvores. Quem sou eu?',
      'Sou uma ave bem colorida, adoro comer frutas e castanhas, e faço meu ninho no buraco dos troncos. Quem sou eu?',
      'Grito bem alto na floresta, tenho asas grandes e uma cauda comprida cheia de penas. Quem sou eu?',
    ],
    audiodescricao: 'Um pássaro grande de penas azuis nas costas e amarelas na barriga, com bico preto curvo.',
    libras: null,
    imagem: 'assets/images/animais/arara.png',
    cor: 'linear-gradient(135deg,#1565C0,#FFD700)',
    habitat: 'Floresta Amazônica',
    tracos: { penas:true, pelo:false, casco:false, voa:true, nada:false, sobe:true, comeFrutas:true, comeCarne:false, comeInsetos:false },
    curiosidade: 'A arara vive na Floresta Amazônica! 🌳 Ela ama árvores altíssimas e frutas tropicais.',
  },

  onca: {
    id: 'onca',
    nome: 'Onça',
    artigo: 'a',
    emoji: '🐆',
    som: 'assets/sounds/onca.mp3',
    tom: [220, 220, 196, 174, 220],
    onomatopeia: 'Rrroooar! Grrrr!',
    charadas: [
      'Meu pelo é amarelo cheio de pintinhas pretas, tenho garras bem fortes e ando sempre bem quietinha. Quem sou eu?',
      'Sou o maior gato selvagem das Américas, sei nadar muito bem e caço sozinha. Quem sou eu?',
      'Tenho bigodes compridos, dentes bem afiados, e minhas patas não fazem nenhum barulho no chão. Quem sou eu?',
    ],
    audiodescricao: 'Um felino grande de pelo amarelo coberto de manchas pretas arredondadas.',
    libras: null,
    imagem: 'assets/images/animais/onca.png',
    cor: 'linear-gradient(135deg,#FFD700,#FF8F00)',
    habitat: 'Pantanal',
    tracos: { penas:false, pelo:true, casco:false, voa:false, nada:true, sobe:true, comeFrutas:false, comeCarne:true, comeInsetos:false },
    curiosidade: 'A onça-pintada caça no Pantanal! 💧 É o maior felino das Américas.',
  },

  flamingo: {
    id: 'flamingo',
    nome: 'Flamingo',
    artigo: 'o',
    emoji: '🦩',
    som: 'assets/sounds/flamingo.mp3',
    tom: [523, 659, 784, 659, 523],
    onomatopeia: 'Gá-gá-gá!',
    charadas: [
      'Sou todo cor-de-rosa, tenho pernas bem compridas e fininhas, e durmo em pé numa perna só. Quem sou eu?',
      'Meu pescoço é comprido e curvado como um S, e eu procuro comida com a cabeça dentro da água. Quem sou eu?',
      'Vivo em bando perto da água rasa e fiquei todo rosa por causa daquilo que eu como. Quem sou eu?',
    ],
    audiodescricao: 'Uma ave rosa de pescoço comprido e curvo, em pé sobre pernas finas e altas.',
    libras: null,
    imagem: 'assets/images/animais/flamingo.png',
    cor: 'linear-gradient(135deg,#FF8F00,#E53935)',
    habitat: 'Mata Atlântica',
    tracos: { penas:true, pelo:false, casco:false, voa:true, nada:true, sobe:false, comeFrutas:false, comeCarne:false, comeInsetos:false },
    curiosidade: 'O flamingo habita a Mata Atlântica! 🌿 Sua cor rosa vem dos alimentos que ele come.',
  },

  macaco: {
    id: 'macaco',
    nome: 'Macaco',
    artigo: 'o',
    emoji: '🐵',
    som: 'assets/sounds/macaco.mp3',
    tom: [392, 440, 494, 440, 392],
    onomatopeia: 'Uh-uh! Ah-ah!',
    charadas: [
      'Tenho pelo marrom, mãos parecidas com as suas e um rabo comprido para me pendurar nos galhos. Quem sou eu?',
      'Pulo de árvore em árvore, adoro frutas e sei usar pedrinhas para quebrar comida dura. Quem sou eu?',
      'Tenho cinco dedos em cada mão igual a você, e vivo em grupo lá no alto das árvores. Quem sou eu?',
    ],
    audiodescricao: 'Um animal peludo marrom, de rosto pequeno e cauda longa, sentado num galho.',
    libras: null,
    imagem: 'assets/images/animais/macaco.png',
    cor: 'linear-gradient(135deg,#FF8F00,#6D4C41)',
    habitat: 'Floresta Amazônica',
    tracos: { penas:false, pelo:true, casco:false, voa:false, nada:false, sobe:true, comeFrutas:true, comeCarne:false, comeInsetos:true },
    curiosidade: 'O macaco-prego vive na Floresta Amazônica! 🌳 Ele usa pedras para quebrar cocos.',
  },

  mico: {
    id: 'mico',
    nome: 'Mico-Leão',
    artigo: 'o',
    emoji: '🦁',
    som: 'assets/sounds/mico.mp3',
    tom: [660, 784, 988, 784, 660],
    onomatopeia: 'Piu-piu-piiii!',
    charadas: [
      'Sou pequenininho e todo dourado, com uma juba ao redor do rosto igualzinha à de um leão. Quem sou eu?',
      'Caibo quase na palma da mão, meu pelo brilha alaranjado no sol e eu moro na mata perto do mar. Quem sou eu?',
      'Sou um macaquinho bem raro, tenho rabo comprido e o pelo cor de ouro. Quem sou eu?',
    ],
    audiodescricao: 'Um macaquinho pequeno de pelo dourado brilhante, com muito pelo em volta da cara.',
    libras: null,
    imagem: 'assets/images/animais/mico.png',
    cor: 'linear-gradient(135deg,#FFD700,#FF8F00)',
    habitat: 'Mata Costeira',
    tracos: { penas:false, pelo:true, casco:false, voa:false, nada:false, sobe:true, comeFrutas:true, comeCarne:false, comeInsetos:true },
    curiosidade: 'O mico-leão-dourado vive na Mata Costeira! 🌿 É um dos animais mais ameaçados do Brasil.',
  },

  tatu: {
    id: 'tatu',
    nome: 'Tatu',
    artigo: 'o',
    emoji: '🦔',
    som: 'assets/sounds/tatu.mp3',
    tom: [196, 220, 247, 220, 196],
    onomatopeia: 'Funf! Funf!',
    charadas: [
      'Carrego uma casquinha dura nas costas, tenho unhas fortes para cavar e me enrolo como uma bolinha. Quem sou eu?',
      'Faço buracos no chão para morar, minha armadura me protege e meu focinho é bem pontudo. Quem sou eu?',
      'Ando devagar pertinho do chão, uso minha carapaça de escudo e procuro formiguinhas para comer. Quem sou eu?',
    ],
    audiodescricao: 'Um bichinho baixo coberto por uma carapaça marrom de placas duras, com focinho pontudo.',
    libras: null,
    imagem: 'assets/images/animais/tatu.png',
    cor: 'linear-gradient(135deg,#8D6E63,#5D4037)',
    habitat: 'Caatinga',
    tracos: { penas:false, pelo:false, casco:true, voa:false, nada:false, sobe:false, comeFrutas:false, comeCarne:false, comeInsetos:true },
    curiosidade: 'O tatu vive na Caatinga! 🌵 Sua armadura de osso o protege dos predadores.',
  },

  capivara: {
    id: 'capivara',
    nome: 'Capivara',
    artigo: 'a',
    emoji: '🦫',
    som: 'assets/sounds/capivara.mp3',
    tom: [262, 330, 392, 330, 262],
    onomatopeia: 'Uíc-uíc!',
    charadas: [
      'Sou o maior roedor do mundo, tenho pelo marrom meio durinho e adoro tomar banho no rio. Quem sou eu?',
      'Pareço um porquinho-da-índia gigante, meus dentes da frente nunca param de crescer e eu nado muito bem. Quem sou eu?',
      'Vivo em grupo perto da água, como capim e fico horas dentro do rio só com o nariz de fora. Quem sou eu?',
    ],
    audiodescricao: 'Um roedor grande e gordinho, de pelo marrom curto, focinho quadrado e orelhas pequenas.',
    libras: null,
    imagem: 'assets/images/animais/capivara.png',
    cor: 'linear-gradient(135deg,#795548,#4E342E)',
    habitat: 'Manguezal',
    tracos: { penas:false, pelo:true, casco:false, voa:false, nada:true, sobe:false, comeFrutas:true, comeCarne:false, comeInsetos:false },
    curiosidade: 'A capivara vive nos Manguezais! 💦 É o maior roedor do mundo!',
  },

  tartaruga: {
    id: 'tartaruga',
    nome: 'Tartaruga',
    artigo: 'a',
    emoji: '🐢',
    som: 'assets/sounds/tartaruga.mp3',
    tom: [330, 294, 262, 294, 330],
    onomatopeia: 'Pfff... (sopro)',
    charadas: [
      'Levo a minha casa nas costas, tenho nadadeiras no lugar das patas e nado bem devagarinho no mar. Quem sou eu?',
      'Meu casco é duro e arredondado, eu ponho meus ovos na areia da praia e volto sempre ao mesmo lugar. Quem sou eu?',
      'Nado no fundo do mar usando quatro remos, e posso viver muitos e muitos anos. Quem sou eu?',
    ],
    audiodescricao: 'Um animal de casco verde arredondado, com quatro nadadeiras abertas como remos.',
    libras: null,
    imagem: 'assets/images/animais/tartaruga.png',
    cor: 'linear-gradient(135deg,#006064,#0277BD)',
    habitat: 'Oceano Atlântico',
    tracos: { penas:false, pelo:false, casco:true, voa:false, nada:true, sobe:false, comeFrutas:false, comeCarne:false, comeInsetos:false },
    curiosidade: 'A tartaruga-marinha nada no Oceano Atlântico! 🌊 Ela volta à mesma praia onde nasceu para desovar.',
  },

    caranguejo: {
    id: 'caranguejo',
    nome: 'Caranguejo',
    artigo: 'o',
    emoji: '🦀',
    som: null,   // quando tiver o áudio: 'assets/sounds/caranguejo.mp3'
    tom: [700, 520, 700, 520, 700],
    onomatopeia: 'Clac! Clac!',
    charadas: [
      'Ando de lado, tenho duas pinças bem fortes e uma casca dura que me protege. Quem sou eu?',
      'Moro em buracos na lama do manguezal, tenho dez patas e meus olhos ficam em cima de hastinhas. Quem sou eu?',
      'Meu esqueleto fica do lado de fora do corpo e eu troco de casca quando fico grande. Quem sou eu?',
    ],
    audiodescricao: 'Um bichinho de corpo redondo e achatado, coberto por uma casca dura, com duas pinças grandes na frente, olhos em cima de hastes e várias patas finas nas laterais.',
    libras: null,
    imagem: 'assets/images/animais/caranguejo.svg',   // ou .png, se você converter
    cor: 'linear-gradient(135deg,#FF7043,#BF360C)',
    habitat: 'Manguezal',
    tracos: { penas:false, pelo:false, casco:true, voa:false, nada:false, sobe:false, comeFrutas:false, comeCarne:false, comeInsetos:false },
    curiosidade: 'O caranguejo vive no Manguezal! 🦀 Ele tem o esqueleto por fora do corpo e troca de casca quando cresce.',
  },

};

// ═══════════════════════════════════════════════════════════════
//  PERGUNTAS DE CARACTERÍSTICA
// ═══════════════════════════════════════════════════════════════
//  Uma das duas versões da 2ª etapa da caverna (a outra é a sombra).
//  Cada pergunta olha UM traço: o animal certo tem, os outros três não.
//
//  Para criar uma pergunta nova: acrescente o traço em `tracos` de
//  TODOS os animais e uma linha aqui. O jogo só usa a pergunta quando
//  existirem pelo menos 3 animais sem aquele traço, senão a pergunta
//  teria mais de uma resposta certa.
const PERGUNTAS = [
  // Corpo — o mais concreto para a idade: a criança associa ao que já tocou
  { traco:'penas',       icone:'🪶',  texto:'Qual destes animais tem PENAS?' },
  { traco:'pelo',        icone:'🧸',  texto:'Qual destes animais tem PELO?' },
  { traco:'casco',       icone:'🛡️',  texto:'Qual destes animais tem uma CASCA dura?' },
  // Movimento — fácil de dramatizar na sala
  { traco:'voa',         icone:'🕊️',  texto:'Qual destes animais VOA?' },
  { traco:'nada',        icone:'🌊',  texto:'Qual destes animais NADA?' },
  { traco:'sobe',        icone:'🌳',  texto:'Qual destes animais SOBE nas árvores?' },
  // Alimentação
  { traco:'comeFrutas',  icone:'🍌',  texto:'Qual destes animais come FRUTAS?' },
  { traco:'comeCarne',   icone:'🥩',  texto:'Qual destes animais come CARNE?' },
  { traco:'comeInsetos', icone:'🐜',  texto:'Qual destes animais come INSETOS?' },
];

// ═══════════════════════════════════════════════════════════════
//  O MAPA
// ═══════════════════════════════════════════════════════════════
//  As cavernas guardam só a posição — qual animal mora em cada uma é
//  sorteado a cada partida (ver sortearFases em game.js). Por isso as
//  quatro são idênticas por fora: nada revela o animal antes de entrar.
//  Para mudar o desenho do mapa, troque `imagem` e as coordenadas.
//  As coordenadas são em pixels da imagem (mapa_20.0.png: 1536x1024) e
//  o jogo as usa direto, sem escala — se trocar a imagem por outra de
//  tamanho diferente, reveja também estes números.
const MAPA = {
  nome: 'Fauna Brasileira',
  badge: '🌿',
  imagem: 'assets/images/mapa_20.0.png',
  // A árvore do final fica na árvore grande do centro, logo ao lado do lago
  arvore: { x: 655, y: 495 },
  // O sapo nasce EM CIMA da trilha, logo abaixo da árvore — como ele só
  // anda pelo caminho de terra (ver js/trilhas.js), nascer no mato o
  // deixaria preso. Mudou o início de lugar? Confira se caiu na trilha.
  inicio: { x: 676, y: 556 },
  // As seis cavernas ficam ao longo da trilha, em volta do mapa, na
  // ordem em que a criança as libera: elas abrem uma de cada vez e este
  // é o caminho mais curto de uma para a outra, no sentido horário.
  // Todas estão a menos de 110px do caminho de terra, que é a distância
  // em que aparece o aviso "Aperte E". As de cima ficam um pouco abaixo
  // da borda e as de baixo um pouco acima, para o aviso não sumir atrás
  // do placar nem do minimapa.
  cavernas: [
    { x: 100,  y: 235 },   // clareira de areia, canto de cima à esquerda
    { x: 740,  y: 265 },   // curva da trilha no meio de cima
    { x: 1390, y: 250 },   // trilha à direita do lago, canto de cima à direita
    { x: 1200, y: 845 },   // trilha ao lado da cachoeira, canto de baixo à direita
    { x: 670,  y: 880 },   // trilha do meio de baixo
    { x: 145,  y: 810 },   // trilha à beira do lago, canto de baixo à esquerda
  ],
};

// Catálogo inteiro — de onde saem tanto os animais sorteados para as
// cavernas quanto os distratores das opções.
function todosAnimais() {
  return Object.values(ANIMAIS);
}
