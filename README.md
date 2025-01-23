# [undershows.com.br](https://undershows.com.br)
Projeto para divulgar shows e festivais underground no Brasil.

## :wrench: Instalação
Devido a um conflito de dependências entre `@astrojs/image` e `astro`, é necessário instalar as dependências com a flag `--legacy-peer-deps`:
```bash
npm install --legacy-peer-deps
```

## :woman_technologist: Rodando o projeto localmente
Dentro da pasta do projeto, crie o arquivo `.env` se ainda não o tiver:
```bash
cp .env.example .env
```

Inicie a aplicação com o comando abaixo:
```bash
npm run dev
```

A aplicação deve responder no endereço [http://localhost:3000](http://localhost:3000).

## :raised_hand: Contribuindo
Para contribuir com pôsters de shows e festivais, existem duas formas.

### Abrindo um pull request no GitHub

1. Dê um fork no projeto;
2. Adicione a imagem do pôster à pasta `public/images/posters`;
3. Adicione as informações do show/festival ao arquivo do estado onde vai acontecer. Por exemplo, para adicionar um show da cidade de Belém, editamos o arquivo `src/content/state/pa.md`, que é onde ficam os shows do estado do Pará, e adicionamos ao final do arquivo (antes de `---`) as seguintes informações:
```yml
  - poster: NOME_DO_POSTER_QUE_ACABOU_DE_ADICIONAR.jpg
    city: Belém
    date: '30/03/2023 19:00'
```

4. Faça o commit das suas alterações e abra um pull request pra gente. ;)

### Mande um e-mail pra gente!
Caso você não esteja familiarizado(a) com o GitHub, não tem problema, você pode nos mandar seu rolê pelo e-mail [undershowsbr@gmail.com](mailto:undershowsbr@gmail.com).

Não esqueça de anexar seu pôster no corpo do e-mail e mandar as seguintes informações:
```
Cidade e estado de onde vai acontecer o rolê:
Data/horário:
```

_Ps:_ É recomendado que as imagens dos pôsters tenham as dimensões de **600px** de largura e **800px** de altura.
