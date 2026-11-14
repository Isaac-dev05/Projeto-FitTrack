# FitTrack
Site de acompanhamento de treinos em HTML, CSS e JavaScript, sem dependências.

## Executar
Na pasta do projeto, execute `python -m http.server 8080 --bind 127.0.0.1` e acesse http://127.0.0.1:8080.

## Funcionalidades
- Diário com nome, data, duração e exclusão de treinos.
- Meta de 1 a 7 dias por semana, contados de segunda a domingo, sem duplicar treinos do mesmo dia.
- Histórico e meta salvos no localStorage deste navegador.
- Cronômetro de descanso com pausa, retomada e reinício.
- Navegação corrigida, estilos responsivos e suporte a movimento reduzido.

Os registros não sincronizam entre dispositivos e são perdidos ao limpar os dados do navegador. Cadastro, login e contato são demonstrativos: não enviam dados nem armazenam senhas. Autenticação e envio de mensagens dependem de uma futura integração com servidor.

## Verificação
Execute `node tracker.test.cjs`. Os testes exercitam a lógica com um DOM simulado; não substituem a verificação visual em navegador.
