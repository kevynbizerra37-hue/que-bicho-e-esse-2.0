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
//  As 8 primeiras foram geradas por IA (originais em alta resolução na pasta
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

  // ── NOVOS ANIMAIS (2.1) ──
  // As fichas já apontam para a imagem e o som com o nome do animal.
  // Enquanto a equipe de design não coloca os arquivos nas pastas, o jogo
  // usa o emoji no lugar do desenho e os bipes de `tom` no lugar do som,
  // e a 2ª etapa vira a pergunta de característica (a sombra de um emoji
  // genérico confundiria — o 🐦 do tucano parece qualquer passarinho).

  tucano: {
    id: 'tucano',
    nome: 'Tucano',
    artigo: 'o',
    emoji: '🐦',
    som: 'assets/sounds/tucano.mp3',
    tom: [698, 587, 698, 587, 523],
    onomatopeia: 'Rék-rék-rék!',
    charadas: [
      'Tenho um bico laranja enorme, maior que a minha cabeça, mas ele é levinho por dentro. Quem sou eu?',
      'Sou uma ave de penas pretas e peito branco, e uso meu bicão para pegar frutas na ponta dos galhos. Quem sou eu?',
      'Durmo com o bico escondido nas costas, debaixo das asas, e moro no buraco das árvores. Quem sou eu?',
    ],
    audiodescricao: 'Uma ave de penas pretas e peito branco, com um bico enorme, laranja e curvado.',
    libras: null,
    imagem: 'assets/images/animais/tucano.png',
    cor: 'linear-gradient(135deg,#FF6F00,#212121)',
    habitat: 'Cerrado',
    tracos: { penas:true, pelo:false, casco:false, voa:true, nada:false, sobe:true, comeFrutas:true, comeCarne:false, comeInsetos:true },
    curiosidade: 'O tucano-toco vive no Cerrado! 🌾 Seu bico gigante ajuda a soltar o calor do corpo.',
  },

  jacare: {
    id: 'jacare',
    nome: 'Jacaré',
    artigo: 'o',
    emoji: '🐊',
    som: 'assets/sounds/jacare.mp3',
    tom: [147, 131, 147, 110, 98],
    onomatopeia: 'Grrrom! Grrrom!',
    charadas: [
      'Tenho a boca comprida cheia de dentes, a pele dura cheia de placas e fico boiando parado no rio. Quem sou eu?',
      'Fico deitado no sol para me esquentar, e na água só deixo os olhos e o nariz de fora. Quem sou eu?',
      'Nasço de um ovo, tenho um rabo forte para nadar e sou parente dos dinossauros. Quem sou eu?',
    ],
    audiodescricao: 'Um réptil comprido e verde-escuro, de pele grossa com placas, boca longa cheia de dentes e rabo forte.',
    libras: null,
    imagem: 'assets/images/animais/jacare.png',
    cor: 'linear-gradient(135deg,#33691E,#1B5E20)',
    habitat: 'Pantanal',
    // casco: a pele dele tem placas de osso, como a do tatu
    tracos: { penas:false, pelo:false, casco:true, voa:false, nada:true, sobe:false, comeFrutas:false, comeCarne:true, comeInsetos:false },
    curiosidade: 'O jacaré-do-pantanal vive no Pantanal! 💧 A temperatura do ninho decide se o filhote será macho ou fêmea.',
  },

  preguica: {
    id: 'preguica',
    nome: 'Bicho-Preguiça',
    artigo: 'o',
    emoji: '🦥',
    som: 'assets/sounds/preguica.mp3',
    tom: [784, 698, 659, 587, 523],
    onomatopeia: 'Aiii... aiii...',
    charadas: [
      'Passo o dia pendurado de cabeça para baixo num galho e me mexo bem, bem devagarinho. Quem sou eu?',
      'Tenho unhas compridas como ganchos, durmo muitas horas por dia e só desço da árvore uma vez por semana. Quem sou eu?',
      'Meu pelo é tão parado que nasce uma plantinha verde nele, e eu como folhas lá no alto. Quem sou eu?',
    ],
    audiodescricao: 'Um animal peludo marrom-claro, de cara redonda e sorridente, pendurado num galho pelas unhas compridas.',
    libras: null,
    imagem: 'assets/images/animais/preguica.png',
    cor: 'linear-gradient(135deg,#A1887F,#5D4037)',
    habitat: 'Mata Atlântica',
    // nada: no chão é lenta, mas na água a preguiça nada muito bem
    tracos: { penas:false, pelo:true, casco:false, voa:false, nada:true, sobe:true, comeFrutas:false, comeCarne:false, comeInsetos:false },
    curiosidade: 'O bicho-preguiça vive na Mata Atlântica! 🌿 Ele é tão devagar que nascem algas verdes no seu pelo.',
  },

  loboguara: {
    id: 'loboguara',
    nome: 'Lobo-Guará',
    artigo: 'o',
    emoji: '🐺',
    som: 'assets/sounds/loboguara.mp3',
    tom: [330, 247, 330, 247, 196],
    onomatopeia: 'Uóóó! Uóóó!',
    charadas: [
      'Tenho o pelo laranja, as pernas pretas bem compridas e orelhas grandes para ouvir longe. Quem sou eu?',
      'Pareço uma raposa de perna de pau e adoro comer a fruta chamada lobeira. Quem sou eu?',
      'Ando sozinho de noite pelo campo, e minha foto já apareceu na nota de duzentos reais. Quem sou eu?',
    ],
    audiodescricao: 'Um animal parecido com um cachorro alto, de pelo laranja, pernas pretas e finas e orelhas grandes em pé.',
    libras: null,
    imagem: 'assets/images/animais/loboguara.png',
    cor: 'linear-gradient(135deg,#EF6C00,#3E2723)',
    habitat: 'Cerrado',
    tracos: { penas:false, pelo:true, casco:false, voa:false, nada:false, sobe:false, comeFrutas:true, comeCarne:true, comeInsetos:true },
    curiosidade: 'O lobo-guará vive no Cerrado! 🌾 Metade do que ele come são frutas, como a lobeira.',
  },

  boto: {
    id: 'boto',
    nome: 'Boto-Cor-de-Rosa',
    artigo: 'o',
    emoji: '🐬',
    som: 'assets/sounds/boto.mp3',
    tom: [1047, 1175, 1319, 1175, 1047],
    onomatopeia: 'Fiiiu! Clic-clic!',
    charadas: [
      'Sou cor-de-rosa, vivo no rio e não no mar, e respiro por um buraquinho no alto da cabeça. Quem sou eu?',
      'Tenho um focinho comprido e fino para pegar peixinhos no meio da água barrenta do rio. Quem sou eu?',
      'Pareço um golfinho, mas moro nos rios da Amazônia, e existe uma lenda famosa sobre mim. Quem sou eu?',
    ],
    audiodescricao: 'Um animal liso e cor-de-rosa, parecido com um golfinho, de focinho longo e fino, nadando no rio.',
    libras: null,
    imagem: 'assets/images/animais/boto.png',
    cor: 'linear-gradient(135deg,#F48FB1,#0277BD)',
    habitat: 'Rio Amazonas',
    // comeCarne: ele come peixes
    tracos: { penas:false, pelo:false, casco:false, voa:false, nada:true, sobe:false, comeFrutas:false, comeCarne:true, comeInsetos:false },
    curiosidade: 'O boto-cor-de-rosa vive nos rios da Amazônia! 🌊 Ele fica mais rosado quando está agitado.',
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
