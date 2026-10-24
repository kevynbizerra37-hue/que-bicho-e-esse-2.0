// ═══════════════════════════════════════════════════════════════
//  LÓGICA DO JOGO
//  Os animais e o mapa ficam em js/dados.js. Este arquivo não conhece
//  nenhum animal pelo nome: quais deles vão para as cavernas é
//  sorteado a cada partida.
// ═══════════════════════════════════════════════════════════════

// Dimensões do mapa (ajustadas ao carregar a imagem)
let MAPA_W = 1536, MAPA_H = 1024;
// A imagem do mapa, guardada para o minimapa desenhar o cenário de verdade
let MAPA_IMG = null;

// ========= ESTADO =========
// Cada caverna tem 3 etapas — som, sombra e charada (setupP1/P2/P3),
// e cada etapa é sobre um animal DIFERENTE.
const FASES_POR_CAVERNA = 3;

const G = {
  screen:'intro',
  idx:0,                          // caverna em que a criança está
  fase:0,                         // etapa dentro da caverna (0,1,2)
  score:0, combo:0,
  ptsCaverna:0,                   // coroas ganhas na caverna em curso (ver responder)
  fases:[],                       // fases[caverna][etapa] = id do animal
  variantes:[],                   // 'sombra' ou 'traco' na 2a etapa de cada caverna
  pergunta:null,                  // pergunta de caracteristica em curso
  done:[],                        // índices das cavernas concluídas
  firstTry:true, muted:false, audio:null,
  etapa:0,                        // muda a cada troca de tela (ver showSc)
  travado:false,                  // já acertou; esperando a próxima etapa
  keys:{}, raf:null,
  px:MAPA.inicio.x, py:MAPA.inicio.y,
  vx:0, vy:0,
  camx:0, camy:0,
  _walkTimer:null,
  _somEl:null,                    // quem está mostrando "tocando agora"
  webAudio:{ctx:null, nodes:[]},
};

// Helpers
function totalCavernas(){ return MAPA.cavernas.length; }
function animaisDaCaverna(i){ return (G.fases[i]||[]).map(id=>ANIMAIS[id]).filter(Boolean); }
function animalDaFase(caverna, fase){ const c=G.fases[caverna]; return c ? ANIMAIS[c[fase]] : null; }
function animalAtual(){ return animalDaFase(G.idx, G.fase); }
function tudoCompleto(){ return G.done.length>=totalCavernas(); }
function cavernaAberta(i){ return i===0 || G.done.includes(i-1); }
// "a Arara", "o Tatu" — sem `artigo` na ficha, fala só o nome
function comArtigo(a){ return a.artigo ? `${a.artigo} ${a.nome}` : a.nome; }
// O desenho do bicho: a `imagem` da ficha quando houver, senão o emoji.
// A imagem mede 1em, então herda o tamanho que cada tela já dá ao emoji.
function figura(a){
  return a.imagem ? `<img class="fig" src="${a.imagem}" alt="" draggable="false">` : a.emoji;
}
// Carrega as imagens das fichas logo na abertura (a sombra não pisca ao
// aparecer) e, se alguma não abrir, aquele bicho volta a usar o emoji em
// vez de mostrar o ícone de imagem quebrada.
function conferirImagens(){
  todosAnimais().forEach(a=>{
    if(!a.imagem) return;
    const img=new Image();
    img.onerror=()=>{
      console.warn(`Imagem não encontrada: ${a.imagem} — ${a.nome} vai usar o emoji.`);
      a.imagem=null;
    };
    img.src=a.imagem;
  });
}

// ========= SORTEIO DAS CAVERNAS =========
// Cada caverna recebe 3 animais DIFERENTES entre si, um por etapa, e
// tudo muda a cada partida. As cavernas são idênticas por fora, então
// não dá para decorar nem deduzir o que vem pela frente.
//
// O "baralho" é o catálogo embaralhado; quando acaba, embaralha de novo.
// Isso espalha os animais por igual em vez de deixar alguns saírem toda
// hora e outros quase nunca.
const _chave = f => JSON.stringify(f);
function sortearFases(){
  const catalogo=todosAnimais().map(a=>a.id);
  const porCaverna=Math.min(FASES_POR_CAVERNA, catalogo.length);
  const anterior=_chave(G.fases);
  let sorteio=[];
  for(let tent=0;tent<10;tent++){
    let deck=[]; sorteio=[];
    for(let c=0;c<totalCavernas();c++){
      const daCaverna=[];
      while(daCaverna.length<porCaverna){
        if(!deck.length) deck=shuffle(catalogo);
        // pega o primeiro do baralho que ainda não saiu NESTA caverna
        const k=deck.findIndex(id=>!daCaverna.includes(id));
        if(k===-1){ deck=shuffle(catalogo); continue; }
        daCaverna.push(deck.splice(k,1)[0]);
      }
      sorteio.push(daCaverna);
    }
    if(_chave(sorteio)!==anterior) break;   // não repetir a partida anterior
  }
  G.fases=sorteio;
  // Cada caverna sorteia se a 2ª etapa será a sombra ou a pergunta de
  // característica. Com a narração ligada, varianteEtapa2() força a
  // pergunta — a sombra não é jogável sem enxergar.
  G.variantes=sortearVariantes();
  save();
}
function sortearVariantes(){
  return MAPA.cavernas.map(()=> Math.random()<0.5 ? 'sombra' : 'traco');
}
function varianteEtapa2(){
  if(VOZ.ligada) return 'traco';
  // Sem desenho próprio a sombra seria a de um emoji, às vezes genérico
  // demais (🐦 serve para qualquer passarinho): vai a pergunta no lugar
  const a=animalAtual();
  if(a && !a.imagem) return 'traco';
  return G.variantes[G.idx]==='traco' ? 'traco' : 'sombra';
}

// ========= SAVE / LOAD =========
function save(){
  try{
    localStorage.setItem('aq_score',G.score);
    localStorage.setItem('aq_done',JSON.stringify(G.done));
    localStorage.setItem('aq_fases',JSON.stringify(G.fases));
    localStorage.setItem('aq_variantes',JSON.stringify(G.variantes));
  }catch(e){}
}
function load(){
  try{
    const s=localStorage.getItem('aq_score');
    const d=localStorage.getItem('aq_done');
    const f=localStorage.getItem('aq_fases');
    if(s) G.score=parseInt(s)||0;
    // Só cavernas que existem e sem repetir: um número a mais aqui fazia
    // tudoCompleto() liberar a árvore antes da hora.
    if(d){
      const lista=JSON.parse(d);
      G.done=Array.isArray(lista)
        ? [...new Set(lista)].filter(i=>Number.isInteger(i) && i>=0 && i<totalCavernas())
        : [];
    }
    if(f){
      const ids=JSON.parse(f)||[];
      // Só reaproveita o sorteio salvo se os animais ainda existirem em
      // dados.js — senão o jogo quebraria depois de trocar o catálogo.
      // Matriz valida: uma linha por caverna, etapas distintas entre si
      // e todos os animais ainda existindo no catalogo.
      const valido = Array.isArray(ids) && ids.length===totalCavernas()
        && ids.every(c=>Array.isArray(c) && c.length===FASES_POR_CAVERNA
              && c.every(id=>ANIMAIS[id]) && new Set(c).size===c.length);
      if(valido) G.fases=ids;
    }
    const vs=JSON.parse(localStorage.getItem('aq_variantes')||'null');
    if(Array.isArray(vs) && vs.length===totalCavernas()
       && vs.every(v=>v==='sombra'||v==='traco')) G.variantes=vs;
  }catch(e){}
  if(G.fases.length!==totalCavernas()){
    G.fases=[]; G.done=[]; sortearFases();
  } else if(G.variantes.length!==totalCavernas()){
    // Save de antes das variantes existirem: sorteia só elas, sem apagar
    // as cavernas que a criança já fez.
    G.variantes=sortearVariantes();
    save();
  }
  G.fase=0;
}
function temProgresso(){ return G.done.length>0 || G.score>0; }
// "as 2 cavernas que você já fez e as 150 coroas"
function oQueSePerde(){
  const n=G.done.length, partes=[];
  if(n) partes.push(n===1 ? 'a caverna que você já fez' : `as ${n} cavernas que você já fez`);
  if(G.score) partes.push(`as ${G.score} coroas`);
  return partes.join(' e ');
}
// Continuar e Apagar só aparecem quando existe o que continuar ou apagar
function atualizarBotoesIntro(){
  const mostrar=temProgresso() ? 'block' : 'none';
  document.getElementById('btn-continue').style.display=mostrar;
  document.getElementById('btn-reset').style.display=mostrar;
}
// Um clique sem querer em "Apagar progresso" jogava tudo fora: agora pergunta
function resetGame(){
  if(!temProgresso()) return;
  perguntar({
    titulo:'Apagar o progresso?',
    texto:`Você vai perder ${oQueSePerde()}.`,
    sim:'Sim, apagar', nao:'Não, voltar',
    fala:'Aperte ENTER para voltar sem apagar, ou TAB e depois ENTER para apagar.',
    aoConfirmar:apagarProgresso,
  });
}
function apagarProgresso(){
  try{
    localStorage.removeItem('aq_score');
    localStorage.removeItem('aq_done');
    localStorage.removeItem('aq_fases');
    localStorage.removeItem('aq_variantes');
  }catch(e){}
  G.score=0; G.done=[]; G.idx=0; G.fase=0;
  G.px=MAPA.inicio.x; G.py=MAPA.inicio.y;
  sortearFases();
  atualizarBotoesIntro();
  feedback('Progresso apagado!', true);
}

// ========= CONFIRMAÇÃO =========
// "Tem certeza?" no estilo do jogo e narrado, no lugar do confirm() do
// navegador. O botão de desistir vem primeiro e já com o foco: um ENTER
// apressado nunca apaga nada.
function perguntar({titulo, texto, sim, nao, fala, aoConfirmar}){
  const m=document.getElementById('confmdf');
  const bSim=document.getElementById('conf-sim'), bNao=document.getElementById('conf-nao');
  document.getElementById('conf-titulo').textContent=titulo;
  document.getElementById('conf-txt').textContent=texto;
  bSim.textContent=sim; bNao.textContent=nao;
  const voltar=document.activeElement;
  const fechar=()=>{
    m.classList.remove('open');
    pararNarracao();
    // devolve o foco a quem abriu a pergunta, se ele ainda estiver na tela
    if(voltar && voltar.offsetParent && voltar.focus) voltar.focus();
  };
  bNao.onclick=fechar;
  bSim.onclick=()=>{ fechar(); aoConfirmar(); };
  bNao.onfocus=()=>{ if(!_focoProgramatico) narrar(nao, {guardar:false}); };
  bSim.onfocus=()=>{ if(!_focoProgramatico) narrar(sim, {guardar:false}); };
  m.classList.add('open');
  _focoProgramatico=true;
  try{ bNao.focus(); } finally { _focoProgramatico=false; }
  narrar(`${titulo} ${texto} ${fala}`);
}
// Com a janela aberta o Tab só alterna entre os dois botões: sem isto o
// foco escapava para os botões da tela de trás, escondidos pelo fundo escuro.
function prenderFocoNaConfirmacao(e){
  if(e.key!=='Tab') return;
  e.preventDefault();
  const bSim=document.getElementById('conf-sim'), bNao=document.getElementById('conf-nao');
  (document.activeElement===bNao ? bSim : bNao).focus();
}

// ========= NAVEGAÇÃO =========
function showSc(id){
  const prev=G.screen;
  if(prev==='p1' && id!=='p1') stopAnimalAudio();
  if(prev!==id) pararNarracao();      // não deixa a fala da tela anterior vazar
  document.querySelectorAll('.screen').forEach(s=>s.classList.remove('active'));
  document.getElementById('sc-'+id).classList.add('active');
  G.screen=id;
  G.etapa++; G.travado=false;
  document.getElementById('backbtn').style.display= ['p1','p2','p2t','p3','p4'].includes(id)?'block':'none';
  atualizarBotaoRepetir();
  if(id==='map' && prev!=='map') narrarMapa();
  if(prev!==id) focarTitulo(id);
}
// Ao trocar de tela, o foco ficava no botão da tela anterior, que sumiu:
// o leitor de tela (NVDA, TalkBack) se perdia e a criança não sabia que
// a fase tinha mudado. Agora o foco vai para o título da tela nova.
// Com a narração do jogo ligada quem cuida do foco é ela (focarPrimeiraOpcao).
function focarTitulo(id){
  if(VOZ.ligada) return;
  const t=document.querySelector('#sc-'+id+' h1[tabindex="-1"]');
  if(!t) return;
  _focoProgramatico=true;
  try{ t.focus({preventScroll:true}); } finally { _focoProgramatico=false; }
}

// No mapa a criança cega não tem como guiar o sapo pelo cenário, então
// com a narração ligada ela pode ir direto à próxima caverna com ENTER.
function narrarMapa(){
  if(!VOZ.ligada || fimAberto()) return;
  const prox=proximaCaverna();
  if(prox===null){
    narrar('Mapa. Você completou todas as cavernas! Aperte ENTER para ver o final.');
  } else {
    narrar(`Mapa. Você completou ${G.done.length} de ${totalCavernas()} cavernas. `
      +`Aperte ENTER para entrar na caverna ${prox+1}.`);
  }
}
function proximaCaverna(){
  for(let i=0;i<totalCavernas();i++){
    if(!G.done.includes(i) && cavernaAberta(i)) return i;
  }
  return null;
}

// ========= HUD =========
function updateHUD(){
  const el=document.getElementById('map-score-val');
  if(el) el.textContent=G.score;
  drawProg();
}
function addPts(n){ G.score+=n; save(); updateHUD(); }
// Quanto vale cada etapa: cheio no primeiro palpite, metade depois de errar
const PONTOS={ som:25, sombra:20, traco:20, charada:30, bonus:30 };

let _fbT=null;
function feedback(msg, ok){
  const el=document.getElementById('fbmsg');
  el.textContent=msg; el.className='fbm show '+(ok?'ok':'bad');
  if(_fbT) clearTimeout(_fbT);
  _fbT=setTimeout(()=>el.classList.remove('show'),1800);
}

// ========= ÁUDIO =========
function ensureAudioCtx(){
  if(!G.webAudio.ctx){
    try{ G.webAudio.ctx = new (window.AudioContext||window.webkitAudioContext)(); }
    catch(e){ G.webAudio.ctx = null; }
  }
  return G.webAudio.ctx;
}
function stopWebAudio(){
  G.webAudio.nodes.forEach(n=>{ try{ n.stop ? n.stop() : (n.gain && (n.gain.value=0)); }catch(e){} });
  G.webAudio.nodes=[];
}
// Só um elemento por vez mostra que está tocando: o orbe grande da fase
// ou o botão de som de um card.
function marcarTocando(el){
  if(G._somEl && G._somEl!==el) G._somEl.classList.remove('play');
  G._somEl = el || null;
  if(el) el.classList.add('play');
}
// Cada som tocado ganha um número; parar ou trocar o som muda o número,
// e os avisos atrasados do som antigo (fim, erro) passam a ser ignorados.
let _somId=0;
function stopAnimalAudio(){
  _somId++;
  if(G.audio){ try{ G.audio.pause(); G.audio.currentTime=0; }catch(e){} G.audio=null; }
  stopWebAudio();
  marcarTocando(null);
}
function playBeepSequence(seq=[{f:440,d:0.2}]){
  const ctx=ensureAudioCtx(); if(!ctx) return;
  if(ctx.state==='suspended') ctx.resume();
  let t=ctx.currentTime;
  seq.forEach(step=>{
    const osc=ctx.createOscillator(); const gain=ctx.createGain();
    osc.type='square'; osc.frequency.value=step.f;
    gain.gain.setValueAtTime(0.0001,t);
    gain.gain.exponentialRampToValueAtTime(0.2,t+0.02);
    gain.gain.exponentialRampToValueAtTime(0.0001,t+Math.max(0.05,step.d-0.02));
    osc.connect(gain).connect(ctx.destination);
    osc.start(t); osc.stop(t+step.d);
    G.webAudio.nodes.push(osc);
    t+=step.d+0.03;
  });
}
// Assinatura sonora de reserva, usada se o arquivo .mp3 falhar.
// As frequências vêm do campo `tom` do animal em dados.js.
function animalTone(animal){
  const tons = (animal && animal.tom && animal.tom.length) ? animal.tom : [440,660,440];
  return tons.map(f=>({f:f, d:0.18}));
}
// ═══════════════════════════════════════════════════════════════
//  CANAL ÚNICO DE ÁUDIO
// ═══════════════════════════════════════════════════════════════
//  TODO som do jogo passa por aqui — voz, mp3 do bicho e bipes de
//  reserva. Só um item toca por vez: quem entra interrompe o que
//  estava tocando, e numa sequência cada item espera o anterior
//  acabar de verdade (pelo evento de fim, não por tempo chutado).
const AUDIO = { fila:[], token:0, repetir:null };

function silenciarTudo(){
  AUDIO.token++;               // invalida os callbacks da sequência anterior
  AUDIO.fila=[];
  pararFala();
  stopAnimalAudio();
}

// itens: {fala}, {som, el}, {espera:ms}, {acao:fn} — nesta ordem.
// `repetivel` guarda a sequência inteira para o botão de repetir, para
// a criança ouvir de novo o enunciado, o som do bicho E as opções.
function tocarSequencia(itens, {repetivel=false}={}){
  silenciarTudo();
  const lista=(itens||[]).filter(Boolean);
  if(repetivel) AUDIO.repetir=lista.slice();
  AUDIO.fila=lista;
  seguirFila(AUDIO.token);
}
function seguirFila(meu){
  if(meu!==AUDIO.token) return;          // outra sequência assumiu o canal
  const item=AUDIO.fila.shift();
  if(!item) return;
  const seguir=()=>{ if(meu===AUDIO.token) seguirFila(meu); };
  if(item.fala!==undefined)   falarAgora(item.fala, item, seguir);
  else if(item.som)           tocarSomAgora(item.som, item.el, seguir);
  else if(item.espera)        setTimeout(seguir, item.espera);
  else if(item.acao){ item.acao(); seguir(); }
  else seguir();
}

// Algumas gravações passam de um minuto (a do macaco tem 70s). Todas
// começam no primeiro segundo, então 8s bastam para ouvir o bicho; depois
// disso o som abaixa e para, e a sequência segue.
const LIMITE_SOM_MS=8000;

// Toca UM som de animal e avisa quando ele realmente terminou.
function tocarSomAgora(animal, elVisual, aoFim){
  if(G.muted || !animal){ aoFim(); return; }
  const meu=++_somId;
  const vale=()=>meu===_somId;          // ninguém parou nem trocou este som
  marcarTocando(elVisual);
  let acabou=false, limite=null, reservaUsada=false;
  const fim=()=>{
    if(acabou) return; acabou=true;
    clearTimeout(limite);
    // Para o áudio de verdade: antes a sequência seguia e o som continuava
    // tocando por baixo da narração seguinte.
    if(vale()){
      if(G.audio){ try{ G.audio.pause(); }catch(_){} G.audio=null; }
      marcarTocando(null);
    }
    aoFim();
  };
  // Se o mp3 falhar, os bipes de reserva duram ~1s — só depois seguimos.
  // Não toca se o som já foi parado: pause() faz o play() pendente falhar
  // com AbortError, e aí os bipes saíam por cima do som seguinte.
  const reserva=()=>{
    if(acabou || reservaUsada || !vale()) return;
    reservaUsada=true;
    try{ playBeepSequence(animalTone(animal)); }catch(_){}
    setTimeout(fim,1100);
  };
  limite=setTimeout(()=>{
    const au=G.audio;
    if(!vale() || !au){ fim(); return; }
    let vol=1;
    const abaixa=setInterval(()=>{
      vol-=0.1;
      if(vol<=0 || !vale()){ clearInterval(abaixa); fim(); }
      else { try{ au.volume=vol; }catch(_){} }
    },40);
  }, LIMITE_SOM_MS);
  try{
    const au=new Audio(animal.som);
    G.audio=au;
    au.onended=fim;
    au.onerror=reserva;
    au.play().catch(reserva);
  }catch(e){ reserva(); }
}

// Toca o som de QUALQUER animal — o da fase, ou o de um card que a
// criança queira comparar antes de escolher. Interrompe o que tocava.
function tocarSom(animal, elVisual){
  if(G.travado) return;       // não corta o "acertou" nem a troca de etapa
  tocarSequencia([{som:animal, el:elVisual}]);
}
// Som do animal da fase atual (o orbe grande)
function playSound(){
  tocarSom(animalAtual(), document.getElementById('sound-orb'));
}
// ═══════════════════════════════════════════════════════════════
//  NARRAÇÃO / AUDIODESCRIÇÃO
// ═══════════════════════════════════════════════════════════════
//  Lê as telas em voz alta com a Web Speech API, para a criança cega.
//  O texto de cada animal vem do campo `audiodescricao` em dados.js.
//  Liga e desliga nas configurações; a escolha fica salva no navegador.
const VOZ = {
  ligada:false,
  velocidade:0.9,        // o padrão 1.0 é rápido demais para os pequenos
  voz:null,
  ultimo:'',             // último enunciado, para o botão de repetir
};
function vozDisponivel(){
  return typeof speechSynthesis!=='undefined' && typeof SpeechSynthesisUtterance!=='undefined';
}
// As vozes chegam de forma assíncrona no Chrome; por isso o onvoiceschanged.
function escolherVoz(){
  if(!vozDisponivel()) return;
  let vs=[];
  try{ vs=speechSynthesis.getVoices()||[]; }catch(e){ return; }
  VOZ.voz = vs.find(v=>/^pt[-_]br/i.test(v.lang))
         || vs.find(v=>/^pt/i.test(v.lang))
         || null;
}
// Fala UM texto e avisa quando terminou. Só o canal de áudio chama.
function falarAgora(texto, opts, aoFim){
  if(!VOZ.ligada || !vozDisponivel() || !texto){ aoFim(); return; }
  try{
    speechSynthesis.cancel();
    const u=new SpeechSynthesisUtterance(texto);
    u.lang='pt-BR'; u.rate=VOZ.velocidade; u.pitch=1.05;
    if(VOZ.voz) u.voice=VOZ.voz;
    let acabou=false, vigia=null;
    const fim=()=>{
      if(acabou) return; acabou=true;
      clearTimeout(vigia);
      if(VOZ._falando===u) VOZ._falando=null;
      aoFim();
    };
    u.onend=fim; u.onerror=fim;
    // O Chrome joga fora a fala que ninguém mais referencia e aí o onend
    // nunca chega; guardando aqui, ela vive até terminar.
    VOZ._falando=u;
    // Vigia: se mesmo assim o fim não vier (falas longas às vezes param
    // sozinhas), a sequência segue em vez de travar a criança na fase.
    vigia=setTimeout(fim, 4000 + texto.length*110/VOZ.velocidade);
    speechSynthesis.speak(u);
    if(opts.guardar!==false) VOZ.ultimo=texto;
  }catch(e){ aoFim(); }
}
// `guardar:false` para falas passageiras (foco, acerto/erro) que não
// devem virar o alvo do botão "repetir".
// Com a narração desligada não faz nada: antes ela silenciava o canal
// sem ter o que falar, e um Tab ou um clique errado cortava o som do bicho.
function narrar(texto, {guardar=true, aoTerminar=null}={}){
  if(!VOZ.ligada){ if(aoTerminar) aoTerminar(); return; }
  tocarSequencia([{fala:texto, guardar}, aoTerminar?{acao:aoTerminar}:null]);
}
function pararFala(){
  if(!vozDisponivel()) return;
  try{ speechSynthesis.cancel(); }catch(e){}
}
// Mantido pelo nome antigo: agora silencia o canal inteiro, não só a voz.
function pararNarracao(){ silenciarTudo(); }
function repetirNarracao(){
  if(G.travado) return;
  if(AUDIO.repetir && AUDIO.repetir.length){
    tocarSequencia(AUDIO.repetir.slice(), {repetivel:true});
  } else if(VOZ.ultimo){
    narrar(VOZ.ultimo);
  }
}
// Monta "Opção 1: arara. Opção 2: onça. ..." a partir do grid montado.
function listaDeOpcoes(gridId){
  const el=document.getElementById(gridId); if(!el) return '';
  const nomes=[...el.querySelectorAll('.optcard')].map(c=>c.dataset.nome).filter(Boolean);
  if(!nomes.length) return '';
  return 'Aperte o número da resposta. '
    + nomes.map((n,i)=>`${i+1}, ${n}`).join('. ')+'.';
}

// ========= CONFIGURAÇÕES =========
function toggleCfg(){
  const m=document.getElementById('cfgmdf');
  alternarJanela(m);
  if(m.classList.contains('open')) narrar('Configurações abertas.', {guardar:false});
}
// Abre ou fecha uma janela (ajuda, configurações) cuidando do foco: ao
// abrir ele entra na janela, ao fechar volta para o botão que a abriu.
// Antes o Tab continuava passeando pelos botões escondidos atrás dela.
function alternarJanela(m){
  const abrir=!m.classList.contains('open');
  m.classList.toggle('open', abrir);
  if(abrir){
    m._voltar=document.activeElement;
    const primeiro=m.querySelector('button, input, [tabindex="0"]');
    if(primeiro){ _focoProgramatico=true; try{ primeiro.focus(); } finally { _focoProgramatico=false; } }
  } else {
    const v=m._voltar; m._voltar=null;
    // getClientRects e não offsetParent: os botões fixos (💡, ⚙️) não têm offsetParent
    if(v && v.focus && v.getClientRects().length) v.focus();
  }
}
function fecharJanela(id){
  const m=document.getElementById(id);
  if(m.classList.contains('open')) alternarJanela(m);
}
// Tab e Shift+Tab dão a volta dentro da janela aberta
function prenderFoco(e){
  if(e.key!=='Tab') return;
  const m=e.currentTarget;
  const itens=[...m.querySelectorAll('button, input')].filter(el=>!el.disabled && el.getClientRects().length);
  if(!itens.length) return;
  const i=itens.indexOf(document.activeElement);
  const prox = e.shiftKey ? (i<=0 ? itens.length-1 : i-1) : (i===itens.length-1 ? 0 : i+1);
  e.preventDefault();
  itens[prox].focus();
}
function setNarracao(ligada){
  VOZ.ligada=!!ligada;
  salvarConfig();
  atualizarBotaoRepetir();
  if(VOZ.ligada){
    // O clique na caixa já é o gesto que o navegador exige para falar.
    narrar('Narração ligada. Aperte o número da resposta para escolher, '
      +'R para repetir a pergunta, e S para ouvir o bicho de novo.', {guardar:false});
  } else {
    pararNarracao();
  }
}
function setVelocidade(v){
  VOZ.velocidade=v;
  salvarConfig();
  marcarVelocidade();
  narrar('Velocidade da voz ajustada.', {guardar:false});
}
function setSons(ligados){
  G.muted=!ligados;
  salvarConfig();
  if(G.muted) stopAnimalAudio();
}
function marcarVelocidade(){
  document.querySelectorAll('.cfg-vel-btn').forEach(b=>{
    b.classList.toggle('sel', parseFloat(b.dataset.vel)===VOZ.velocidade);
  });
}
function atualizarBotaoRepetir(){
  const b=document.getElementById('repetirbtn'); if(!b) return;
  const naFase=['p1','p2','p2t','p3','p4'].includes(G.screen);
  b.style.display=(VOZ.ligada && naFase)?'block':'none';
}
function salvarConfig(){
  try{
    localStorage.setItem('aq_voz',JSON.stringify({ligada:VOZ.ligada, velocidade:VOZ.velocidade}));
    localStorage.setItem('aq_mudo',JSON.stringify(G.muted));
  }catch(e){}
}
function carregarConfig(){
  try{
    const v=JSON.parse(localStorage.getItem('aq_voz')||'null');
    if(v){
      VOZ.ligada=!!v.ligada;
      if(typeof v.velocidade==='number') VOZ.velocidade=v.velocidade;
    }
    const m=JSON.parse(localStorage.getItem('aq_mudo')||'null');
    if(typeof m==='boolean') G.muted=m;
  }catch(e){}
  const cn=document.getElementById('cfg-narracao'); if(cn) cn.checked=VOZ.ligada;
  const cs=document.getElementById('cfg-sons');     if(cs) cs.checked=!G.muted;
  marcarVelocidade();
  atualizarBotaoRepetir();
}

// ========= INTRO =========
function buildIntroBG(){
  const c=document.getElementById('intro-trees');
  if(!c) return;
  ['🌳','🌲','🌴','🌿','🌳','🌲','🌴','🌿','🌳','🌲','🌴','🌿'].forEach((t,i)=>{
    const d=document.createElement('div');
    d.className='intro-tree'; d.textContent=t;
    d.style.cssText=`left:${4+i*8.2}%;font-size:${28+Math.random()*24}px;opacity:${(.3+Math.random()*.35).toFixed(2)};animation-delay:${Math.random()*2}s`;
    c.appendChild(d);
  });
}

// "Jogar" com cavernas já feitas apagava tudo sem avisar (e ainda mantinha
// as coroas da partida anterior): agora pergunta antes.
function startGame(){
  if(temProgresso()){
    perguntar({
      titulo:'Começar do zero?',
      texto:`Você vai perder ${oQueSePerde()}. Para seguir de onde parou, escolha Continuar.`,
      sim:'Sim, começar do zero', nao:'Não, voltar',
      fala:'Aperte ENTER para voltar, ou TAB e depois ENTER para começar do zero.',
      aoConfirmar:comecarPartida,
    });
    return;
  }
  comecarPartida();
}
function comecarPartida(){
  // Partida nova: outro sorteio de animais e o placar volta a zero
  G.score=0; G.done=[]; G.idx=0; G.fase=0; sortearFases();
  G.px=MAPA.inicio.x; G.py=MAPA.inicio.y; G.vx=0; G.vy=0;
  aplicarTamanhoMapa();
  buildPortals(); positionPlayer(); snapCamera(true); drawMini(); updateHUD();
  showSc('map'); startLoop();
}
function continueGame(){
  aplicarTamanhoMapa();
  buildPortals(); positionPlayer(); snapCamera(true); drawMini(); updateHUD();
  showSc('map'); startLoop();
}

// ========= CAVERNAS =========
function buildPortals(){
  const cont=document.getElementById('portals');
  cont.querySelectorAll('.portal').forEach(p=>p.remove());

  MAPA.cavernas.forEach((pos,i)=>{
    const feito=G.done.includes(i); const aberta=cavernaAberta(i);
    // <button>: dá para chegar com o Tab e entrar com ENTER, e o leitor de
    // tela diz se a caverna está aberta, fechada ou já feita.
    const div=document.createElement('button');
    div.type='button';
    div.className='portal '+(feito?'don':aberta?'ulk':'lck');
    div.id='portal-'+i; div.style.left=pos.x+'px'; div.style.top=pos.y+'px'; div.dataset.idx=i;
    if(feito){
      const achados=animaisDaCaverna(i);
      div.innerHTML=`<span class="portal-emoji portal-trio">${achados.map(figura).join('')}</span>`
        +`<span class="portal-name">${achados.length} animais</span><span class="portal-star">⭐</span>`;
      div.setAttribute('aria-label',`Caverna ${i+1}, completa: ${achados.map(a=>a.nome).join(', ')}`);
      div.setAttribute('aria-disabled','true');
    } else {
      // Cavernas fechadas são todas iguais: nada aqui pode revelar o
      // animal, senão a criança já entra sabendo a resposta.
      div.innerHTML=`<span class="portal-emoji" aria-hidden="true">${aberta?'❓':'🔒'}</span><span class="portal-name">Caverna ${i+1}</span>`;
      div.setAttribute('aria-label', aberta ? `Caverna ${i+1}, aberta. Aperte ENTER para entrar.`
                                            : `Caverna ${i+1}, fechada. Termine a caverna ${i} primeiro.`);
      if(aberta) div.onclick=e=>{ e.stopPropagation(); enterLevel(i); };
      else div.setAttribute('aria-disabled','true');
    }
    div.addEventListener('focus',()=>{
      if(!_focoProgramatico) narrar(div.getAttribute('aria-label'), {guardar:false});
    });
    cont.appendChild(div);
  });

  const tp=document.getElementById('tree-portal');
  tp.style.left=MAPA.arvore.x+'px'; tp.style.top=MAPA.arvore.y+'px';
  tp.classList.toggle('unlocked', tudoCompleto());
  tp.onclick = tudoCompleto() ? mostrarFim : null;
  // A árvore só vira botão quando libera o final
  if(tudoCompleto()){
    tp.setAttribute('role','button'); tp.tabIndex=0;
    tp.setAttribute('aria-label','Árvore sagrada: ver o final');
    tp.removeAttribute('aria-hidden');
    tp.onkeydown=e=>{ if(e.key==='Enter'||e.key===' '){ e.preventDefault(); e.stopPropagation(); mostrarFim(); } };
  } else {
    tp.removeAttribute('role'); tp.removeAttribute('tabindex');
    tp.setAttribute('aria-hidden','true'); tp.onkeydown=null;
  }
}

// ========= PLAYER & CAMERA =========
function positionPlayer(){
  const pl=document.getElementById('player');
  pl.style.left=G.px+'px'; pl.style.top=G.py+'px';
}
function setPlayerMotion(pl, dx, dy, moving){
  if(!pl) return;
  pl.classList.toggle('walk', moving);
  if(!moving) return;
  pl.classList.remove('frog-up','frog-down','frog-left','frog-right','flip');
  if(Math.abs(dx)>Math.abs(dy)) pl.classList.add(dx<0?'frog-left':'frog-right');
  else pl.classList.add(dy<0?'frog-up':'frog-down');
}
// Tela maior que o mapa (monitor Full HD, projetor da sala): o mapa é
// ampliado até cobrir tudo. Sem isso sobrava uma faixa preta à direita
// e embaixo, com o placar e os botões boiando no vazio.
function escalaMapa(){ return Math.max(1, window.innerWidth/MAPA_W, window.innerHeight/MAPA_H); }
// Pedaço do mapa que cabe na tela, em pixels do mapa
function telaNoMapa(){ const esc=escalaMapa(); return {w:window.innerWidth/esc, h:window.innerHeight/esc, esc}; }
function snapCamera(immediate=false){
  const worldEl=document.getElementById('world'); if(!worldEl) return;
  const {w:vw, h:vh, esc}=telaNoMapa();
  const tx=Math.max(0,Math.min(MAPA_W-vw, G.px-vw/2));
  const ty=Math.max(0,Math.min(MAPA_H-vh, G.py-vh/2));
  if(immediate){
    G.camx=tx; G.camy=ty;
  } else {
    G.camx += (tx-G.camx)*0.18;
    G.camy += (ty-G.camy)*0.18;
  }
  worldEl.style.transform=`scale(${esc}) translate(${-G.camx}px,${-G.camy}px)`;
}

// ========= MINIMAP / PROGRESS =========
function drawMini(){
  const mm=document.getElementById('minimap'); if(!mm) return;
  const ctx=mm.getContext('2d'); const mw=mm.width, mh=mm.height;
  const sx=mw/MAPA_W, sy=mh/MAPA_H;
  ctx.clearRect(0,0,mw,mh);

  // O fundo é a própria imagem do mapa encolhida, então o minimapa
  // continua certo mesmo se o desenho do mapa mudar de novo.
  if(MAPA_IMG && MAPA_IMG.complete && MAPA_IMG.naturalWidth){
    ctx.drawImage(MAPA_IMG,0,0,mw,mh);
  } else {
    ctx.fillStyle='#2E7D32'; ctx.fillRect(0,0,mw,mh);
  }

  MAPA.cavernas.forEach((p,i)=>{
    const feito=G.done.includes(i);
    ctx.fillStyle = feito ? '#69F0AE' : cavernaAberta(i) ? '#FFD700' : '#607D8B';
    ctx.fillRect(p.x*sx-3,p.y*sy-3,6,6);
  });
  ctx.fillStyle = tudoCompleto() ? '#FFD700' : '#795548';
  ctx.fillRect(MAPA.arvore.x*sx-4,MAPA.arvore.y*sy-4,8,8);
  ctx.fillStyle='#fff'; ctx.fillRect(G.px*sx-4,G.py*sy-4,8,8);

  const {w:vw, h:vh}=telaNoMapa();
  ctx.strokeStyle='rgba(255,255,255,.45)'; ctx.lineWidth=1; ctx.strokeRect(G.camx*sx,G.camy*sy,vw*sx,vh*sy);
}
function drawProg(){
  const el=document.getElementById('prog-list'); if(!el) return;
  el.innerHTML=MAPA.cavernas.map((_,i)=>{
    const feito=G.done.includes(i);
    // Só mostra o nome depois de descoberto — antes seria entregar.
    const label=feito ? animaisDaCaverna(i).map(figura).join(' ') : `Caverna ${i+1}`;
    return `<div class="prog-item"><div class="prog-dot ${feito?'done':'todo'}"></div><span style="color:${feito?'#69F0AE':'#90A4AE'}">${label}</span></div>`;
  }).join('');
}

// ========= SÓ ANDAR PELA TRILHA =========
// A grade de js/trilhas.js diz quais pedaços do mapa são caminho de
// terra. Aqui ela vira uma lista de bits, lida uma vez só.
let _gradeTrilha;                            // undefined = ainda não tentou ler
function gradeTrilha(){
  if(_gradeTrilha!==undefined) return _gradeTrilha;
  if(typeof TRILHAS==='undefined' || !TRILHAS.bits) return (_gradeTrilha=null);
  try{
    const bruto=atob(TRILHAS.bits);
    const bytes=new Uint8Array(bruto.length);
    for(let i=0;i<bruto.length;i++) bytes[i]=bruto.charCodeAt(i);
    _gradeTrilha={bytes, colunas:TRILHAS.colunas, linhas:TRILHAS.linhas};
  }catch(e){
    // Sem a grade o jogo não trava: volta a andar por todo lado.
    _gradeTrilha=null;
  }
  return _gradeTrilha;
}
// (x,y) em pixels do mapa. O ponto que conta é o PÉ do sapo, porque o
// sprite é desenhado com translate(-50%,-100%) a partir de G.px/G.py.
function naTrilha(x,y){
  const g=gradeTrilha();
  if(!g) return true;                       // sem grade, anda livre
  const cx=Math.floor(x*g.colunas/MAPA_W);
  const cy=Math.floor(y*g.linhas/MAPA_H);
  if(cx<0||cy<0||cx>=g.colunas||cy>=g.linhas) return false;
  const i=cy*g.colunas+cx;
  return (g.bytes[i>>3] >> (7-(i&7)) & 1) === 1;
}

// ========= LOOP =========
// O passo é contado em "quadros de 60 Hz": num monitor de 120 ou 144 Hz
// o loop roda mais vezes por segundo e o sapo andava o dobro, passando
// direto das curvas. `q` diz quantos quadros de 60 Hz se passaram.
function startLoop(){
  if(G.raf) cancelAnimationFrame(G.raf);
  let antes=null;
  function loop(agora){
    // Limite de 3: voltando de outra aba, o sapo não dá um pulo enorme
    const q = antes===null ? 1 : Math.min(3, Math.max(0.25, (agora-antes)/(1000/60)));
    antes=agora;
    if(G.screen==='map' && !modalAberto()) movePlayer(q);
    G.raf=requestAnimationFrame(loop);
  }
  G.raf=requestAnimationFrame(loop);
}
// Quanto o sapo aceita escorregar de lado para dobrar uma curva, em
// pixels do mapa. A trilha vira o tempo todo, e a criança segura uma
// seta só: sem esta ajuda ela teria que acertar a diagonal exata bem em
// cima da quina, e o sapo parava em cada curva.
const AJUDA_CANTO=28;
// Até onde o sapo pode ir sem cair fora do desenho.
function limitarX(x){ return Math.max(40, Math.min(MAPA_W-40, x)); }
function limitarY(y){ return Math.max(80, Math.min(MAPA_H-40, y)); }

// Anda o quanto pedir, mas só onde dá para pisar. Se o sapo já estiver
// fora da trilha (mapa trocado, jogo antigo salvo), não o prende: deixa
// andar livre até ele voltar para o caminho.
function moverNaTrilha(dx, dy){
  if(!naTrilha(G.px, G.py)){
    G.px=limitarX(G.px+dx); G.py=limitarY(G.py+dy);
    return;
  }

  // De 1 em 1 pixel, cada eixo por si. Indo de uma vez só, o sapo parava
  // até 3 pixels antes da beirada e engatava em cada dente da grade de
  // 8 pixels; de pixel em pixel ele encosta na trilha e segue rente a
  // ela. É isto também que impede o arrasto no celular de atravessar o
  // mato de um salto.
  const passos=Math.max(1, Math.ceil(Math.max(Math.abs(dx), Math.abs(dy))));
  const ux=dx/passos, uy=dy/passos;
  let travouX=false, travouY=false;
  for(let i=0;i<passos;i++){
    if(ux && !travouX){
      const nx=limitarX(G.px+ux);
      if(naTrilha(nx, G.py)) G.px=nx; else travouX=true;
    }
    if(uy && !travouY){
      const ny=limitarY(G.py+uy);
      if(naTrilha(G.px, ny)) G.py=ny; else travouY=true;
    }
    if((!ux||travouX) && (!uy||travouY)) break;
  }

  // Bateu de frente segurando uma seta só: a trilha dobrou. Procura a
  // continuação ao lado e leva o sapo para lá.
  if(travouX && !uy) escorregarNaCurva(Math.sign(ux), 0);
  if(travouY && !ux) escorregarNaCurva(0, Math.sign(uy));
}

// Olha um quadradinho à frente, para os dois lados, e devolve o sapo um
// pixel na direção em que a trilha continua. Repetido a cada quadro, ele
// faz a curva sozinho sem sair do caminho de terra.
function escorregarNaCurva(sx, sy){
  const FRENTE=4;                           // logo depois da beirada onde bateu
  for(let d=2; d<=AJUDA_CANTO; d+=2){
    for(const lado of [-1, 1]){
      const alvoX=limitarX(G.px + sx*FRENTE + (sx?0:lado*d));
      const alvoY=limitarY(G.py + sy*FRENTE + (sy?0:lado*d));
      if(!naTrilha(alvoX, alvoY)) continue;
      const nx = sx ? G.px : limitarX(G.px+lado);
      const ny = sx ? limitarY(G.py+lado) : G.py;
      if(naTrilha(nx, ny)){ G.px=nx; G.py=ny; return; }
    }
  }
}

function movePlayer(q=1){
  let ix=0,iy=0;
  if(G.keys['ArrowLeft']||G.keys['a']||G.keys['A']) ix-=1;
  if(G.keys['ArrowRight']||G.keys['d']||G.keys['D']) ix+=1;
  if(G.keys['ArrowUp']||G.keys['w']||G.keys['W']) iy-=1;
  if(G.keys['ArrowDown']||G.keys['s']||G.keys['S']) iy+=1;

  const mag=Math.hypot(ix,iy);
  if(mag>0){ ix/=mag; iy/=mag; }

  // MAX é o passo do sapo por quadro: 2.2 dá uns 130 pixels por segundo,
  // um ritmo de caminhada que a criança consegue acompanhar e parar em
  // cima da caverna. ACC caiu junto para ele levar o mesmo tempinho até
  // engatar o passo, em vez de sair disparado do lugar parado.
  const ACC=0.25, FRICTION=0.78, MAX=2.2;
  G.vx=(G.vx||0)+ix*ACC*q;
  G.vy=(G.vy||0)+iy*ACC*q;
  // O freio é por eixo, e não só quando a criança larga tudo. Soltando a
  // seta de descer e segurando só a da direita, o sapo continuava caindo
  // para baixo de lado — ia parar no mato em vez de seguir a trilha.
  if(!ix) G.vx*=Math.pow(FRICTION,q);
  if(!iy) G.vy*=Math.pow(FRICTION,q);
  // Sobra de velocidade pequena demais para render pixel vira zero: é o
  // que deixa o sapo andando reto para a ajuda de curva reconhecer.
  if(Math.abs(G.vx)<0.05) G.vx=0;
  if(Math.abs(G.vy)<0.05) G.vy=0;
  const speed=Math.hypot(G.vx,G.vy);
  if(speed>MAX){ G.vx=(G.vx/speed)*MAX; G.vy=(G.vy/speed)*MAX; }
  if(Math.hypot(G.vx,G.vy)<0.05){
    G.vx=0; G.vy=0;
    setPlayerMotion(document.getElementById('player'),0,0,false);
    return;
  }

  // Cada eixo é testado sozinho: assim, ao esbarrar no mato de lado, o
  // sapo escorrega pela beirada da trilha em vez de travar de vez.
  moverNaTrilha(G.vx*q, G.vy*q);

  const pl=document.getElementById('player');
  pl.style.left=G.px+'px'; pl.style.top=G.py+'px';
  setPlayerMotion(pl,G.vx,G.vy,true);
  clearTimeout(G._walkTimer); G._walkTimer=setTimeout(()=>setPlayerMotion(pl,0,0,false),200);
  snapCamera(); drawMini(); checkNear();
}
// Só mexe no aviso quando o sapo chega perto ou se afasta. Recriado a cada
// quadro, ele reiniciava a animação e ficava parado enquanto o sapo andava.
function checkNear(){
  MAPA.cavernas.forEach((pos,i)=>{
    const pDiv=document.getElementById('portal-'+i); if(!pDiv) return;
    const dist=Math.hypot(G.px-pos.x,G.py-pos.y);
    const perto = dist<110 && cavernaAberta(i) && !G.done.includes(i);
    const oldH=pDiv.querySelector('.portal-hint');
    pDiv.classList.toggle('near', perto);
    if(perto && !oldH){
      const h=document.createElement('div'); h.className='portal-hint';
      h.textContent = G.toque ? '▶ Toque aqui' : '▶ Aperte E';
      pDiv.appendChild(h);
    } else if(!perto && oldH){
      oldH.remove();
    }
  });
}

// ========= ENTRAR NA CAVERNA =========
// Cada setupPx mostra a PRÓPRIA tela antes de começar o áudio. Trocar
// de tela silencia o canal; quando a troca vinha depois, ela cortava na
// hora a narração e o som do bicho que a etapa acabava de começar.
function enterLevel(i){
  if(!cavernaAberta(i) || G.done.includes(i)) return;
  G.idx=i; G.combo=0; G.ptsCaverna=0;
  // Sem isto o sapo voltava da caverna ainda deslizando com o embalo de antes
  G.keys={}; G.vx=0; G.vy=0;
  setupP1();
}

// ─────────────────────────────────────────────────────────────
//  GRID DE OPÇÕES — usado pelas 3 fases
// ─────────────────────────────────────────────────────────────
function buildOptions({grid, classe, decorar, comSom, filtro, onPick}){
  const alvo=animalAtual();
  // Os distratores saem do catálogo INTEIRO, não só dos animais
  // sorteados para esta partida — senão dava para acertar por eliminação.
  let pool=todosAnimais().filter(a=>a.id!==alvo.id);
  // A pergunta de característica exige distratores que NÃO tenham o
  // traço perguntado — senão haveria mais de uma resposta certa.
  if(filtro) pool=pool.filter(filtro);
  const outros=shuffle(pool).slice(0,3);
  const opts=shuffle([alvo,...outros]);
  const el=document.getElementById(grid); el.innerHTML='';
  el.setAttribute('role','group');
  el.setAttribute('aria-label','Escolha o animal');
  opts.forEach((opt,i)=>{
    // Cada opção é uma célula com dois botões LADO A LADO: a resposta e,
    // na fase do som, o alto-falante. Com um botão dentro do outro (HTML
    // inválido), o leitor de tela não enxergava o alto-falante e, ao
    // tentar apertá-lo, a criança podia acabar respondendo.
    const cel=document.createElement('div');
    cel.className='optcel';
    // <button> em vez de <div>: recebe foco, aceita ENTER e ESPAÇO e é
    // anunciado como botão. Sem isso a criança cega ouviria as opções
    // mas só conseguiria responder com o mouse.
    const card=document.createElement('button');
    card.type='button';
    card.className='optcard '+classe;
    card.dataset.nome=opt.nome;
    card.setAttribute('aria-label',`Opção ${i+1} de ${opts.length}: ${opt.nome}`);
    card.innerHTML=`<span class="c-emoji" aria-hidden="true">${figura(opt)}</span><span class="c-name">${opt.nome}</span>`;
    if(decorar) decorar(card,opt);
    card.onclick=()=>onPick(opt,card);
    card.addEventListener('focus',()=>{
      // O foco posto pelo programa não fala: a lista de opções acabou de
      // ser lida e a fala do foco entraria por cima dela.
      if(_focoProgramatico || G.travado) return;
      narrar(`Opção ${i+1} de ${opts.length}: ${opt.nome}`, {guardar:false});
    });
    cel.appendChild(card);
    if(comSom) cel.appendChild(botaoSom(opt));
    el.appendChild(cel);
  });
  ligarSetasDoGrid(el);
}
// Setas percorrem as opções em ciclo; Tab continua funcionando normal.
function ligarSetasDoGrid(el){
  if(el._setasLigadas) return;   // o grid é reaproveitado entre as fases
  el._setasLigadas=true;
  el.addEventListener('keydown',e=>{
    if(!['ArrowRight','ArrowDown','ArrowLeft','ArrowUp'].includes(e.key)) return;
    const cels=[...el.querySelectorAll('.optcel')];
    // o foco pode estar no alto-falante, ao lado do card na mesma célula
    const atual=document.activeElement && document.activeElement.closest
      ? document.activeElement.closest('.optcel') : null;
    const i=cels.indexOf(atual);
    if(i<0) return;
    e.preventDefault();
    const passo=(e.key==='ArrowRight'||e.key==='ArrowDown')?1:-1;
    cels[(i+passo+cels.length)%cels.length].querySelector('.optcard').focus();
  });
}
// Leva o foco para a primeira opção, para a criança já poder usar as
// setas. Só quando a narração está ligada, para não roubar o foco de quem
// está jogando com o mouse.
let _focoProgramatico=false;
function focarPrimeiraOpcao(gridId){
  if(!VOZ.ligada) return;
  const el=document.getElementById(gridId); if(!el) return;
  const primeiro=el.querySelector('.optcard');
  if(!primeiro || !primeiro.focus) return;
  _focoProgramatico=true;
  try{ primeiro.focus(); } finally { _focoProgramatico=false; }
}
// Grid da fase em que a criança está (p1grid, p2grid, p3grid)
function gridAtual(){
  if(G.screen==='p2t') return 'p2tgrid';
  return ['p1','p2','p3'].includes(G.screen) ? G.screen+'grid' : null;
}
// "Caverna 2 de 4, etapa 1 de 3" — quem não enxerga não tem a tela
// para saber onde está no percurso.
function ondeEstou(){
  return `Caverna ${G.idx+1} de ${totalCavernas()}, etapa ${G.fase+1} de ${FASES_POR_CAVERNA}.`;
}
// Alto-falante no canto do card: toca aquele animal sem escolher o card,
// para a criança comparar os sons antes de decidir.
function botaoSom(animal){
  const b=document.createElement('button');
  b.type='button';
  b.className='card-som';
  b.textContent='🔊';
  b.setAttribute('aria-label','Ouvir o som de '+animal.nome);
  b.onclick=e=>{ e.stopPropagation(); tocarSom(animal,b); };
  // O Tab passa por este botão entre um card e outro; sem esta fala a
  // criança cega caía num ponto mudo e achava que o jogo tinha parado.
  b.addEventListener('focus',()=>{
    if(_focoProgramatico || G.travado) return;
    narrar(`Ouvir o som de ${animal.nome}. Aperte ENTER.`, {guardar:false});
  });
  return b;
}
// Acerto/erro seguem o mesmo padrão nas 3 fases.
function responder(opt, card, pontos, msgOk, proxima){
  // Depois do acerto as opções ficam travadas até a próxima etapa: um
  // segundo clique somava os pontos de novo, e um clique errado cortava
  // a passagem de fase e deixava a criança presa com o card verde.
  if(G.travado) return;
  if(opt.id===animalAtual().id){
    G.travado=true;
    card.classList.add('ok');
    // As coroas da caverna só entram no placar quando ela termina (setupP4).
    // Somadas aqui, dava para acertar o som, voltar ao mapa, entrar de novo
    // e ganhar as mesmas coroas quantas vezes quisesse.
    const ganhou=G.firstTry?pontos:Math.round(pontos/2);
    G.ptsCaverna+=ganhou;
    G.combo++;
    feedback(`${msgOk} +${ganhou} 👑`,true);
    avancarDepoisDoAcerto(opt, proxima);
  } else {
    // A célula inteira treme, para o alto-falante acompanhar o card
    const cel=card.parentElement;
    card.classList.add('ng'); cel.classList.add('treme');
    G.firstTry=false; G.combo=0;
    feedback('Tente novamente! 🤔',false);
    narrar(`Não é ${comArtigo(opt)}. Tente de novo. Aperte R para ouvir a pergunta.`, {guardar:false});
    setTimeout(()=>{ card.classList.remove('ng'); cel.classList.remove('treme'); },600);
  }
}
// Com a voz ligada, a próxima etapa entra quando o "acertou" termina de
// ser dito. Mas a passagem não pode depender só do canal de áudio: se
// algo interromper a fala (ESC, as configurações), o prazo garante que
// o jogo siga. `G.etapa` muda a cada troca de tela, então quem voltou ao
// mapa e entrou de novo não é empurrado para a etapa seguinte.
function avancarDepoisDoAcerto(opt, proxima){
  const etapa=G.etapa;
  let foi=false;
  const ir=()=>{ if(foi || etapa!==G.etapa) return; foi=true; proxima(); };
  if(VOZ.ligada){
    tocarSequencia([{fala:`Acertou! Era ${comArtigo(opt)}.`, guardar:false},{acao:ir}]);
    setTimeout(ir, 6000);
  } else {
    setTimeout(ir, 900);
  }
}

// ========= FASE 1 — SOM =========
function setupP1(){
  G.fase=0; G.firstTry=true;
  showSc('p1');
  const animal=animalAtual();
  document.getElementById('p1-onoma').textContent=animal.onomatopeia||'???';
  montarLibras(document.getElementById('p1-libras'), animal);
  buildOptions({grid:'p1grid', classe:'p1card', comSom:true, onPick:(opt,card)=>{
    responder(opt,card,PONTOS.som,'Correto! 🎉',setupP2);
  }});

  // Enunciado → som do bicho → opções → foco. Um item de cada vez: cada
  // um só começa quando o anterior termina de verdade. Com a narração
  // desligada as falas e o foco não fazem nada e fica só o som do bicho;
  // a sequência é a mesma para o R repetir tudo se a voz for ligada aqui.
  tocarSequencia([
    {espera:400},
    {fala:`${ondeEstou()} Fase do som. O som deste animal é: ${animal.onomatopeia}. `
         +`Agora escute o bicho.`},
    {som:animal, el:document.getElementById('sound-orb')},
    {fala:listaDeOpcoes('p1grid'), guardar:false},
    {acao:()=>focarPrimeiraOpcao('p1grid')},
  ], {repetivel:true});
}

// Área de Libras: mostra o vídeo do sinal quando `libras` estiver
// preenchido em dados.js; senão, o aviso de "em breve".
// Para ativar, basta apontar o caminho do arquivo — nada muda aqui.
function montarLibras(box, animal){
  if(!box) return;
  box.innerHTML='';
  if(animal.libras){
    const v=document.createElement('video');
    v.src=animal.libras; v.autoplay=true; v.muted=true; v.loop=true;
    v.playsInline=true; v.setAttribute('playsinline','');
    box.appendChild(v);
  } else {
    const p=document.createElement('div');
    p.className='libras-aviso';
    p.textContent='🤟 Sinal em Libras em breve';
    box.appendChild(p);
  }
}

// ========= FASE 2 — DUAS VERSÕES =========
// A caverna sorteia entre a sombra e a pergunta de característica.
function setupP2(){
  G.fase=1; G.firstTry=true;
  if(varianteEtapa2()==='traco') setupP2Traco(); else setupP2Sombra();
}

// ── versão SOMBRA ──
function setupP2Sombra(){
  showSc('p2');
  const animal=animalAtual();
  document.getElementById('shadow-anim').innerHTML=figura(animal);
  // A sombra é só imagem: o leitor de tela lê a audiodescrição no lugar dela
  document.getElementById('shadow-desc').textContent='A sombra é assim: '+animal.audiodescricao;
  buildOptions({grid:'p2grid', classe:'p2card', decorar:(card,opt)=>{ card.style.background=opt.cor; }, onPick:(opt,card)=>{
    responder(opt,card,PONTOS.sombra,'Incrível! 🌟',setupP3);
  }});
  // A audiodescrição é o que substitui a sombra para quem não enxerga.
  tocarSequencia([
    {fala:`${ondeEstou()} Fase da sombra. A sombra é assim: ${animal.audiodescricao} `
        +`Que bicho é esse?`},
    {fala:listaDeOpcoes('p2grid'), guardar:false},
    {acao:()=>focarPrimeiraOpcao('p2grid')},
  ], {repetivel:true});
}

// ── versão PERGUNTA DE CARACTERÍSTICA ──
// Escolhe uma pergunta que o animal da etapa responde SIM, e monta as
// opções só com animais que respondem NÃO — senão a pergunta teria
// mais de uma resposta certa. Se nenhuma servir, cai na sombra.
function setupP2Traco(){
  const alvo=animalAtual();
  const temTraco=(a,t)=> !!(a && a.tracos && a.tracos[t]);
  const servem=shuffle(PERGUNTAS.filter(p=>
    temTraco(alvo,p.traco) &&
    todosAnimais().filter(a=>a.id!==alvo.id && !temTraco(a,p.traco)).length>=3
  ));
  const p=servem[0];
  if(!p){ setupP2Sombra(); return; }
  showSc('p2t');
  G.pergunta=p;
  document.getElementById('p2t-icone').textContent=p.icone;
  document.getElementById('p2t-pergunta').textContent=p.texto;
  buildOptions({grid:'p2tgrid', classe:'p2tcard',
    filtro:a=>!temTraco(a,p.traco),
    onPick:(opt,card)=>{
      responder(opt,card,PONTOS.traco,'Isso mesmo! 🌟',setupP3);
    }});
  tocarSequencia([
    {fala:`${ondeEstou()} ${p.texto}`},
    {fala:listaDeOpcoes('p2tgrid'), guardar:false},
    {acao:()=>focarPrimeiraOpcao('p2tgrid')},
  ], {repetivel:true});
}

// ========= FASE 3 — CHARADA =========
function setupP3(){
  G.fase=2; G.firstTry=true;
  showSc('p3');
  const texto=charadaDe(animalAtual());
  document.getElementById('p3-charada').textContent=texto;
  buildOptions({grid:'p3grid', classe:'p3card', onPick:(opt,card)=>{
    responder(opt,card,PONTOS.charada,'Você acertou a charada! 🧩',setupP4);
  }});
  tocarSequencia([
    {fala:`${ondeEstou()} Fase da charada. ${texto}`},
    {fala:listaDeOpcoes('p3grid'), guardar:false},
    {acao:()=>focarPrimeiraOpcao('p3grid')},
  ], {repetivel:true});
}

// Sorteia uma das charadas do animal, evitando repetir a última usada —
// a aula tem 20 minutos e as crianças repetem as fases.
// Aceita `charadas: [...]` ou um único `charada: '...'`.
const _ultimaCharada={};
function charadaDe(animal){
  const lista = animal.charadas || (animal.charada ? [animal.charada] : []);
  if(!lista.length) return 'Quem sou eu?';
  if(lista.length===1) return lista[0];
  let i;
  do{ i=Math.floor(Math.random()*lista.length); } while(i===_ultimaCharada[animal.id]);
  _ultimaCharada[animal.id]=i;
  return lista[i];
}

// ========= FASE 4 — CELEBRAÇÃO =========
// Celebra os 3 animais da caverna, nao um so: cada etapa foi sobre um
// animal diferente, entao a crianca descobriu tres.
function setupP4(){
  showSc('p4');
  const achados=animaisDaCaverna(G.idx);
  document.getElementById('p4-sub').textContent=
    `Você descobriu ${achados.length} animais!`;

  const cont=document.getElementById('p4-animais'); cont.innerHTML='';
  achados.forEach(a=>{
    const d=document.createElement('div');
    d.className='p4-animal';
    d.innerHTML=`<div class="p4a-emoji">${figura(a)}</div>`
      +`<div class="p4a-nome">${a.nome}</div>`
      +`<div class="p4a-som">${a.onomatopeia||''}</div>`;
    cont.appendChild(d);
  });

  const fatos=document.getElementById('p4-fatos'); fatos.innerHTML='';
  achados.forEach(a=>{
    const d=document.createElement('div');
    d.className='p4-fato';
    d.innerHTML=`<span class="p4f-emoji">${figura(a)}</span><span>${a.curiosidade}</span>`;
    fatos.appendChild(d);
  });

  // Marca a caverna antes de somar: addPts salva e redesenha o painel de
  // progresso, que ficava mostrando esta caverna como não feita.
  if(!G.done.includes(G.idx)) G.done.push(G.idx);
  const ganhas=G.ptsCaverna+PONTOS.bonus;
  G.ptsCaverna=0;
  addPts(ganhas);
  document.getElementById('p4-bonus').textContent=
    `👑 +${ganhas} coroas (${PONTOS.bonus} de bônus)`;

  // Confete: festa + os bichos do proprio catalogo, para continuar
  // certo depois de trocar os animais em dados.js.
  const cw=document.getElementById('confwrap'); cw.innerHTML='';
  const emojis=shuffle(['🎉','🎊','⭐','🌟','🎈','🏆','✨','🌿']
    .concat(todosAnimais().map(figura)));
  for(let i=0;i<28;i++){ const p=document.createElement('div'); p.style.cssText=`position:absolute;top:-60px;left:${Math.random()*100}%;font-size:${18+Math.random()*22}px;animation:conffall ${2+Math.random()*3}s ${Math.random()*2}s linear infinite`; p.innerHTML=emojis[i%emojis.length]; cw.appendChild(p); }

  const btn=document.getElementById('p4btn');
  if(tudoCompleto()){
    btn.textContent='🏆 Ver o final!'; btn.className='pbtn pbtn-gold';
    btn.onclick=mostrarFim;
  } else {
    btn.textContent='Próxima caverna ▶'; btn.className='pbtn pbtn-green';
    btn.onclick=nextAnimal;
  }

  // Sem enxergar, a criança não sabe que o jogo espera um botão: o fim da
  // narração diz o que fazer e já deixa o foco nele, para o ENTER valer.
  const seguir = tudoCompleto() ? 'ver o final' : 'voltar ao mapa';
  tocarSequencia([
    {fala:`Parabéns! Você descobriu ${achados.length} animais e ganhou ${ganhas} coroas. `
      + achados.map(a=>`${a.nome}. ${a.curiosidade}`).join(' ')},
    {fala:`Aperte ENTER para ${seguir}.`, guardar:false},
    {acao:()=>{ if(VOZ.ligada && G.screen==='p4') btn.focus(); }},
  ], {repetivel:true});
}
function nextAnimal(){ stopAnimalAudio(); buildPortals(); showSc('map'); drawMini(); updateHUD(); checkNear(); }

// ========= FINAL =========
function fimAberto(){ return document.getElementById('fim').classList.contains('show'); }
function mostrarFim(){
  document.getElementById('fim').classList.add('show');
  // Vindo da celebração, o mapa volta por trás do final. Com o final já
  // aberto, o narrarMapa fica quieto em vez de começar e ser cortado.
  if(G.screen!=='map'){ buildPortals(); showSc('map'); drawMini(); updateHUD(); }
  G.keys={}; G.vx=0; G.vy=0;
  // O placar da partida aparece aqui, antes do "Jogar de novo" zerá-lo
  document.getElementById('fim-score').textContent=G.score;
  tocarSequencia([
    {fala:'Você conseguiu! Parabéns! Você descobriu todos os animais das cavernas! '
      +`Você fez ${G.score} coroas! Jogue de novo: as cavernas vão guardar outros animais!`},
    {fala:'Aperte ENTER para jogar de novo.', guardar:false},
    {acao:()=>{ if(VOZ.ligada && fimAberto()) document.querySelector('#fim .pbtn').focus(); }},
  ], {repetivel:true});
}
function jogarDeNovo(){
  document.getElementById('fim').classList.remove('show');
  G.score=0; G.done=[]; G.idx=0; G.fase=0; sortearFases();
  G.px=MAPA.inicio.x; G.py=MAPA.inicio.y; G.vx=0; G.vy=0;
  buildPortals(); positionPlayer(); snapCamera(true); drawMini(); updateHUD();
  showSc('map');
  // já estava no mapa, então o showSc não narra sozinho
  narrarMapa();
  feedback('🎲 Outros animais nas cavernas!',true);
}

// ========= TECLADO =========
document.addEventListener('keydown',e=>{
  G.keys[tecla(e)]=true;

  // R repete a narração em qualquer tela
  if((e.key==='r'||e.key==='R') && VOZ.ligada && !ehCampoDeTexto(e.target)){
    e.preventDefault(); repetirNarracao(); return;
  }

  // ── Atalhos das fases ──
  // Sem enxergar, tabular até a opção certa é lento. Os números escolhem
  // direto, na mesma ordem em que a narração acabou de listá-las.
  const grid=gridAtual();
  if(grid && !ehCampoDeTexto(e.target) && !modalAberto()){
    const n=parseInt(e.key,10);
    if(n>=1 && n<=9){
      const itens=[...document.getElementById(grid).querySelectorAll('.optcard')];
      if(itens[n-1]){ e.preventDefault(); itens[n-1].click(); return; }
    }
    // S reouve o bicho da fase do som sem precisar achar o botão
    if((e.key==='s'||e.key==='S') && G.screen==='p1'){
      e.preventDefault(); playSound(); return;
    }
  }
  if(e.key==='Escape'){
    // ESC na confirmação é "não": fecha e devolve o foco, sem apagar nada
    if(document.getElementById('confmdf').classList.contains('open')){
      document.getElementById('conf-nao').click(); return;
    }
    fecharJanela('helpmdf');
    fecharJanela('cfgmdf');
    pararNarracao();
  }

  // Com a ajuda, as configurações ou o final abertos, o ENTER é do botão
  // em foco; o mapa por trás não pode entrar numa caverna ao mesmo tempo.
  // ENTER num botão focado (uma caverna, a ajuda) é dele, não do mapa
  // (só se ele estiver na tela: voltando da celebração, o foco fica no
  // botão da tela que sumiu, e o ENTER tem que continuar valendo no mapa)
  const enterNoBotao = e.key==='Enter' && e.target && e.target.tagName==='BUTTON'
    && e.target.getClientRects().length>0;
  if(G.screen==='map' && !modalAberto() && !enterNoBotao){
    if(e.key==='e'||e.key==='E'||e.key==='Enter'){
      let entrou=false;
      MAPA.cavernas.forEach((pos,i)=>{
        const dist=Math.hypot(G.px-pos.x,G.py-pos.y);
        if(dist<110 && cavernaAberta(i) && !G.done.includes(i)){ enterLevel(i); entrou=true; }
      });
      const td=Math.hypot(G.px-MAPA.arvore.x,G.py-MAPA.arvore.y);
      if(!entrou && td<140 && tudoCompleto()){ mostrarFim(); entrou=true; }
      // Com a narração ligada, ENTER vale de qualquer lugar do mapa: quem
      // não enxerga não tem como levar o sapo até a caverna.
      if(!entrou && VOZ.ligada){
        const prox=proximaCaverna();
        if(prox!==null) enterLevel(prox);
        else if(tudoCompleto()) mostrarFim();
      }
    }
    if(['ArrowLeft','ArrowRight','ArrowUp','ArrowDown',' '].includes(e.key)) e.preventDefault();
  }
});
function ehCampoDeTexto(el){
  if(!el || !el.tagName) return false;
  return ['INPUT','TEXTAREA','SELECT'].includes(el.tagName);
}
function modalAberto(){
  return fimAberto()
    || ['helpmdf','cfgmdf','confmdf'].some(id=>document.getElementById(id).classList.contains('open'));
}
// Letras sempre em minúscula: apertando A e soltando com o Shift já
// pressionado, o keyup chegava como 'A', o 'a' ficava marcado e o sapo
// andava sozinho para sempre.
function tecla(e){ return e.key && e.key.length===1 ? e.key.toLowerCase() : e.key; }
document.addEventListener('keyup',e=>{ G.keys[tecla(e)]=false; });
// Trocou de janela com a seta apertada: o keyup nunca chega aqui.
window.addEventListener('blur',()=>{ G.keys={}; });

// ========= TOUCH — MOVER NO MAPA =========
function addTouchMove(vpId){
  const vp=document.getElementById(vpId); if(!vp) return;
  // No celular não existe tecla E: o aviso da caverna passa a dizer "toque"
  vp.addEventListener('touchstart',e=>{ const t=e.touches[0]; G._tsx=t.clientX; G._tsy=t.clientY; G.toque=true; },{passive:true});
  vp.addEventListener('touchmove',e=>{
    const t=e.touches[0];
    const dx=(t.clientX-G._tsx)*.45, dy=(t.clientY-G._tsy)*.45;
    G._tsx=t.clientX; G._tsy=t.clientY;
    moverNaTrilha(dx, dy);
    const pl=document.getElementById('player');
    pl.style.left=G.px+'px'; pl.style.top=G.py+'px';
    setPlayerMotion(pl,dx,dy,true);
    snapCamera(); drawMini(); checkNear();
  },{passive:true});
  vp.addEventListener('touchend',()=>{ setPlayerMotion(document.getElementById('player'),0,0,false); },{passive:true});
}

// ========= MODAL AJUDA =========
function toggleHelp(){ alternarJanela(document.getElementById('helpmdf')); }

// ========= BACK BUTTON =========
document.getElementById('backbtn').onclick=()=>{ stopAnimalAudio(); buildPortals(); showSc('map'); checkNear(); };

// ========= UTILS =========
function shuffle(arr){ const a=[...arr]; for(let i=a.length-1;i>0;i--){ const j=Math.floor(Math.random()*(i+1)); [a[i],a[j]]=[a[j],a[i]]; } return a; }

// ========= TAMANHO DO MAPA (ajuste à imagem real) =========
function aplicarTamanhoMapa(){
  const url=MAPA.imagem;
  const img=new Image();
  img.onload=()=>{
    const wd=document.getElementById('world'); const pd=document.getElementById('portals');
    const wpx=img.naturalWidth||1536; const hpx=img.naturalHeight||1024;
    MAPA_IMG=img;
    wd.style.width=wpx+'px'; wd.style.height=hpx+'px';
    wd.style.backgroundImage=`url("${url}")`;
    wd.style.backgroundSize=wpx+'px '+hpx+'px';
    pd.style.width=wpx+'px'; pd.style.height=hpx+'px';
    MAPA_W=wpx; MAPA_H=hpx;
    // Reenquadrar câmera e minimapa quando a imagem carrega
    snapCamera(true); drawMini();
  };
  img.src=url;
}

// ========= INIT =========
window.addEventListener('DOMContentLoaded',()=>{
  load(); buildIntroBG();
  // O texto da ajuda conta as cavernas do mapa, em vez de trazer o
  // número escrito à mão: acrescentou uma caverna, o texto se ajusta.
  const totalAjuda=document.getElementById('help-total');
  if(totalAjuda) totalAjuda.textContent=totalCavernas();
  document.getElementById('backbtn').style.display='none';
  atualizarBotoesIntro();
  conferirImagens();
  document.getElementById('confmdf').addEventListener('keydown', prenderFocoNaConfirmacao);
  document.getElementById('helpmdf').addEventListener('keydown', prenderFoco);
  document.getElementById('cfgmdf').addEventListener('keydown', prenderFoco);
  addTouchMove('vp1');
  // Com o Tab numa caverna fora da tela, o navegador rolava o mapa por
  // conta própria e a câmera (que usa transform) ficava desalinhada.
  const vp=document.getElementById('vp1');
  vp.addEventListener('scroll',()=>{ vp.scrollLeft=0; vp.scrollTop=0; });
  document.addEventListener('contextmenu',e=>e.preventDefault());
  // Reenquadra na hora: com o sapo parado o loop não mexe na câmera, e
  // girar o celular deixava o mapa torto até a criança andar.
  window.addEventListener('resize',()=>{ if(G.screen==='map'){ snapCamera(true); drawMini(); } });
  G.toque = !!(window.matchMedia && matchMedia('(hover: none)').matches);

  // Narração: as vozes do navegador chegam de forma assíncrona
  carregarConfig();
  escolherVoz();
  if(vozDisponivel() && typeof speechSynthesis.addEventListener==='function'){
    speechSynthesis.addEventListener('voiceschanged', escolherVoz);
  }
  if(!vozDisponivel()){
    const cn=document.getElementById('cfg-narracao');
    if(cn){ cn.disabled=true; cn.checked=false; }
    const aviso=document.getElementById('cfg-sem-voz');
    if(aviso) aviso.style.display='block';
  }

  aplicarTamanhoMapa();
});
