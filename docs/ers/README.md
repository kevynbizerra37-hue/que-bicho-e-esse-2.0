# Documentação: ERS do Que Bicho É Esse? 2.0

Especificação de Requisitos de Software (ERS) do jogo, no modelo de Manual do Sistema do curso de ADS da Fatec, baseado na norma IEEE 830.

| Arquivo | O que é |
|---|---|
| [ERS_Que_Bicho_E_Esse_2.0.pdf](ERS_Que_Bicho_E_Esse_2.0.pdf) | Versão para leitura, que abre direto no GitHub |
| [ERS_Que_Bicho_E_Esse_2.0.docx](ERS_Que_Bicho_E_Esse_2.0.docx) | A mesma ERS, editável no Word |
| [diagramas/](diagramas/) | Fontes dos diagramas UML da ERS (Mermaid, Graphviz e SVG) |

- **Versão do jogo documentada:** `main` de 06/11/2026 (commit `c968a67`), já com a revisão 2.1 dos PRs #16, #18 e #19.
- **Atualizada em:** 07/11/2026.
- **Autores:** Kevyn Luciano Bizerra Oliveira e Tiago Gonçalves de Paulo.

## O que tem na ERS

1. **Introdução:** propósito, escopo, definições e referências, com as habilidades da BNCC Computação trabalhadas (EI03CO01, EI03CO02 e EI03CO06).
2. **Descrição geral:** estudo de viabilidade, funções do sistema (F_B, F_F e F_S), usuários, restrições, requisitos não funcionais e requisitos adiados.
3. **Requisitos específicos:** telas do jogo, interfaces, os 10 casos de uso (UC01 a UC10) com diagramas de atividades e de sequência, e o modelo conceitual.
4. **Projeto de software:** diagramas de interação e de classes, dados gravados no navegador, pacotes e modelo navegacional.

Fecham o documento os apêndices (implantação e alternativas rejeitadas) e os anexos (referências e Manual do Usuário).

## Ao abrir no Word

O Word pergunta se deve atualizar os campos do documento. Responda **Sim** para o sumário acertar os números de página.

## Pendências registradas na ERS (item 2.5)

- Desenhos e sons do tucano, do jacaré, do bicho-preguiça, do lobo-guará e do boto-cor-de-rosa. Até lá, o jogo mostra o emoji e toca bipes.
- Caranguejo: a imagem já está em `assets/images/animais/Caranguejo.png`, mas o animal ficou fora do `js/dados.js` na revisão 2.1.
- Vídeos em Libras, pontuação de 0 a 100, bônus por acertos seguidos, histórico entre partidas e painel pedagógico.

## Como atualizar

1. Edite o `.docx` no Word.
2. Exporte o PDF com o mesmo nome (**Arquivo → Salvar como → PDF**).
3. Envie os dois arquivos juntos, seguindo o [CONTRIBUTING.md](../../CONTRIBUTING.md).

Para mudar um diagrama, edite o arquivo dele em `diagramas/` e gere a imagem de novo: os `.mmd` no [Mermaid Live](https://mermaid.live), os `.dot` com o Graphviz (`dot -Tpng arquivo.dot -o arquivo.png`). O `casos-de-uso.svg` abre em qualquer navegador ou no Inkscape. Depois, troque a figura no `.docx` e exporte o PDF de novo.
