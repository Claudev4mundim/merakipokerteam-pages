# pages.merakipokerteam.com.br

Projeto principal das páginas da Meraki Poker Team na Cloudflare Pages (projeto `merakipokerteam`). Tem a página base e
encaminha cada subpasta para o projeto da LP, que continua no repositório dela:

| Endereço | Vem de | Repositório |
|---|---|---|
| https://pages.merakipokerteam.com.br/ | `site/index.html` (página base, com os links das LPs) | este |
| https://pages.merakipokerteam.com.br/quiz/ | https://meraki-poker-quiz.pages.dev | `Claudev4mundim/meraki-poker-quiz` |
| https://pages.merakipokerteam.com.br/mentoria/ | https://merika-poker-lp.pages.dev | `Claudev4mundim/merika-poker-lp` |

Uma mudança numa LP é feita no repositório dela; ao publicar lá, ela aparece aqui também, sem deploy deste projeto.

## Como funciona

- `site/`: arquivos estáticos (página base, 404, `_headers`, logo e fontes). É o diretório publicado.
- `functions/quiz/[[path]].js` e `functions/mentoria/[[path]].js`: recebem tudo de `/quiz` e `/mentoria` e chamam
  `lib/encaminhar.js`, que:
  - redireciona `/quiz` para `/quiz/` (308), mantendo `?utm_...`;
  - busca `/quiz/<resto>` em `https://meraki-poker-quiz.pages.dev/<resto>` com o mesmo método, cabeçalhos e corpo (o
    POST do formulário do quiz passa por aqui) e devolve a resposta como veio, com os cabeçalhos da LP (`noindex`,
    cache, segurança);
  - corrige o `Location` dos redirecionamentos da LP para ficar dentro da subpasta (`/privacidade/` vira
    `/quiz/privacidade/`).

As LPs usam endereços relativos (`assets/...`, `api/desafio-lead`), por isso funcionam na raiz do pages.dev e na
subpasta. **Numa LP encaminhada, não use endereço começando com `/`**: ele aponta para a raiz deste domínio, fora da LP.

Para uma nova LP em `/<nome>/`: criar `functions/<nome>/[[path]].js` igual aos dois que existem, com o endereço
pages.dev da LP, e um card em `site/index.html`.

## Cloudflare Pages

| Campo (Settings → Build) | Valor |
|---|---|
| Framework preset | None |
| Build command | (vazio) |
| Build output directory | `site` |
| Production branch | `main` |

Domínio: `pages.merakipokerteam.com.br`, com CNAME `pages` → `merakipokerteam.pages.dev` no DNS do registro.br.

## Testar localmente

```bash
npx wrangler pages dev site   # http://localhost:8788
```
