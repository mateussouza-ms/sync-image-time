# Sincronização de horários de fotos
## :information_source: Sobre o projeto
Ao fotografar um evento com duas ou mais câmeras, o processo de juntar as fotos de todas câmeras após o evento pode se tornar doloroso. 
O problema é que, caso o horário configurado nas câmeras estejam pelo menos alguns minutos diferentes, ordenar as fotos pode tomar várias horas de trabalho.
Este programa foi desenvolvido com a finalidade de sincronizar automaticamente o horário das fotos e gerar uma grande economia de tempo, trabalho e esforço. 
<br/> <br/> 
## :computer: Funcionamento do Programa
O programa funciona da seguinte maneira:
  1. Primeiro, salve as fotos em uma pasta separada para cada câmera em seu computador;
  2. Analise as fotos de duas pastas até encontrar duas fotos, uma de cada pasta, que foram tiradas no mesmo momento;
  3. Após ter identificado as duas fotos, execute o programa;
  4. Ao ser executado, o programa irá abrir uma janela para você selecionar as fotos identifacdas nos passos anteriores. 
  <br/><b>OBS.:</b> A janela é aberta duas vezes, uma para cada foto. Quando a janela abrir a primeria vez, selecione a foto de uma das pastas e, na segunda vez, selecione a foto da outra pasta.
  5. Após selecionadas, o programa irá identificar a diferencça de horário entre as fotos;
  6. O programa irá idenficar a pasta que contém menor quantidade de fotos;
  7. O programa irá alterar o horário de todas a fotos da pasta identificada no passo anterior, de acordo com a diferença de tempo identificada entre as duas fotos selecionadas.
  8. As fotos modificadas são salvas na mesma pasta das fotos originais, porém com um prefixo específio no nome do arquivo.
  9. Finalmente, basta juntar as fotos modificadas com as fotos da outra câmera e ordená-las pela data em que foram criadas.
<br/> <br/> 
## 🛠 Principais tecnologias utilizadas
![NodeJS](https://img.shields.io/badge/NodeJS-14.0.0-green)
<br/> <br/> 
## :ballot_box_with_check: Requisitos para executar o programa
  1. Ter instalado o NodeJS, versão 14.0.0 ou superior. 
<br/> <br/> 
## :arrow_forward: Como executar o programa
1. Abrir o terminal e navegar até a pasta do projeto;
2. Executar o comando, `node .`
