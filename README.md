# LEQUARTTIÊ — Magasin de Mode

Site editorial para a **Lequarttiê**, boutique multimarcas de moda feminina e masculina em
Bento Gonçalves – RS. É uma **proposta comercial (demonstração)**, feita em Next.js 16 (App
Router), React 19, TypeScript, Tailwind CSS 4, GSAP, Motion e Lenis.

O site é um **catálogo com contato para consulta**: não tem checkout, preços nem estoque.
Cada look abre o WhatsApp oficial da loja com a referência da peça.

---

## Como rodar

```bash
npm install
cp .env.example .env.local   # preencha APIFY_API_TOKEN se for importar fotos
npm run dev                  # http://localhost:3000
```

| Comando                  | O que faz                                                    |
| ------------------------ | ------------------------------------------------------------ |
| `npm run dev`            | Servidor de desenvolvimento                                  |
| `npm run build`          | Build de produção (página 100% estática)                     |
| `npm run start`          | Serve o build                                                |
| `npm run lint`           | ESLint                                                       |
| `npm run typecheck`      | TypeScript sem gerar arquivos                                |
| `npm run apify:scrape`   | 1. Coleta posts e detalhes do perfil no Instagram (Apify)    |
| `npm run apify:prepare`  | 2. Analisa, classifica e pré-seleciona as fotos              |
| `npm run images:import`  | 3. Baixa, otimiza e publica as fotos selecionadas no site    |
| `npm run instagram:sync` | Executa as 3 etapas em sequência                             |

---

## Fotos do Instagram (Apify)

A importação fica **separada do site público**: os scripts em `/scripts` rodam localmente com o
token da Apify. O site lê só arquivos locais (`/public/images/lequarttie` e `/data/*.generated.json`),
então não depende das URLs temporárias do Instagram.

1. **Token**: crie em <https://console.apify.com/settings/integrations> e coloque em `.env.local`:
   ```
   APIFY_API_TOKEN=apify_api_xxx
   ```
   O token **nunca** vai para o frontend: só os scripts o leem, e `.env.local` está no `.gitignore`.

2. **Coleta**: `npm run apify:scrape` (opcional: `-- --limit 60`)
   - Usa o Actor oficial `apify/instagram-scraper`.
   - **Antes de executar, confere o input schema atual do Actor**. Se algum campo ou valor de
     `resultsType` não for aceito, o script para sem gastar créditos.
   - Faz duas execuções: `resultsType: "posts"` (100 posts) e `resultsType: "details"` (perfil).
   - Guarda o resultado bruto em `scripts/output/`, que fica fora do git.

3. **Pré-seleção**: `npm run apify:prepare`
   - Abre os carrosséis e dá uma nota a cada imagem (resolução, proporção vertical, curtidas e
     data). Imagens com texto ou de baixa resolução recebem marcação.
   - Sugere categorias pelas legendas: feminino, masculino, look, campanha, detalhe, loja e
     novidades.
   - Gera `scripts/output/contact-sheet.html`, uma **folha de contato** para revisão visual.
   - Gera `scripts/output/brand-signals.json`, com as menções, marcações e hashtags que podem
     indicar marcas. **São só indícios** e precisam ser confirmados com a loja.
   - Cria `scripts/selection.json` com cerca de 32 imagens pré-selecionadas.

4. **Revisão manual**: edite `scripts/selection.json`. A classificação automática é heurística,
   então confira principalmente o gênero de cada foto.
   ```jsonc
   {
     "authorization": { "status": "pending" },   // "granted" após autorização formal
     "items": [
       {
         "key": "Cx1AbC-0",                       // shortCode-índiceDoCarrossel
         "categories": ["feminino", "look", "novidades"],
         "alt": "Vestido midi off-white com sandália nude",
         "lookName": "Vestido midi em linho",     // opcional
         "brand": "",                             // somente se confirmada
         "featured": true                         // destaque no hero/lookbook
       }
     ]
   }
   ```

5. **Importação**: `npm run images:import`
   - Converte para WebP (até 2000 px) e gera um blur placeholder.
   - Salva em `public/images/lequarttie/<categoria>/<categoria>-NN.webp`.
   - Escreve `data/media.generated.json`, com metadados, legenda, URL original e status de
     autorização, e `data/looks.generated.json`, com os looks do catálogo.
   - Baixa a foto de perfil para `public/images/lequarttie/brand/profile.webp`.
   - Gera o relatório `scripts/output/import-report.json`, que lista o que foi importado e o que
     falhou.

> As URLs de imagem do Instagram expiram em poucos dias. Se a importação falhar, rode
> `apify:scrape` de novo.

### Autorização das imagens

As fotos pertencem à Lequarttiê e aos fotógrafos dela. Enquanto `authorization.status` for
`"pending"`:
- use o site **apenas como demonstração privada**;
- o rodapé mostra o aviso "Proposta de site — demonstração";
- mantenha `NEXT_PUBLIC_ALLOW_INDEXING=false`, que deixa o site com `noindex` e o `robots.txt`
  bloqueando tudo.

Depois da autorização formal, mude para `"granted"`, rode `npm run images:import` e só então
publique com indexação.

Enquanto não houver fotos importadas, o site mostra **espaços reservados editoriais** ("Foto em
breve") no mesmo enquadramento das fotografias.

---

## Onde editar o conteúdo

| Arquivo                     | Conteúdo                                                                        |
| --------------------------- | ------------------------------------------------------------------------------- |
| `data/site.ts`              | Nome, endereço, telefone/WhatsApp, horários, redes sociais e menu               |
| `data/looks.ts`             | Ajustes manuais nos looks (nome, marca, descrição, destaque, disponibilidade)   |
| `data/brands.ts`            | Marcas confirmadas. Vazio = seção oculta                                        |
| `data/reviews.ts`           | Avaliações reais com link da fonte. Vazio = seção oculta                        |
| `styles/globals.css`        | Paleta e tipografia (tokens `--color-*`, `--font-*`)                            |
| `components/ui/Wordmark.tsx`| Logotipo tipográfico provisório. Troque pelo arquivo oficial                    |

### Catálogo e integrações futuras

`lib/catalog.ts` define a interface `CatalogProvider`. Hoje o provider é local, com os dados de
`/data`. Para integrar Shopify, Nuvemshop, WooCommerce ou um sistema próprio, basta criar outro
provider que devolva `CatalogLook[]` e trocar a exportação `catalog`. Nenhuma integração
fictícia foi criada.

Campos de um look (`lib/types.ts`): `id`, `name`, `gender`, `isNew`, `brand`, `description`,
`mediaId`, `postUrl`, `featured`, `availability` (este último só se a loja informar).

---

## Estrutura

```
app/                 layout, página, robots, sitemap, OG image, ícone
components/layout/   Header, menu mobile, Preloader, SmoothScroll (Lenis+GSAP), Footer, barra de contato mobile
components/sections/ Hero, About, Feminine, Masculine, Lookbook, Editorial, News, Brands, Store, Reviews, CallToAction, Location
components/ui/       EditorialImage, ButtonLink, Reveal, SplitHeading, Parallax, Lightbox, SectionLabel, Wordmark
data/                dados institucionais e catálogo (inclui *.generated.json)
lib/                 tipos, mídia, catálogo, WhatsApp, SEO, GSAP
scripts/             pipeline Apify → seleção → importação
public/images/       imagens locais otimizadas
styles/              CSS global e tokens do Tailwind
```

## SEO, acessibilidade e performance

- Metadados completos, Open Graph (imagem gerada em `/opengraph-image`) e Twitter Card.
- JSON-LD `ClothingStore` com endereço, telefone, horários e redes sociais.
- `sitemap.xml` e `robots.txt`, controlados por `NEXT_PUBLIC_ALLOW_INDEXING`.
- `next/image` com AVIF/WebP, `sizes` responsivos, lazy loading, blur placeholder e preload
  da imagem do hero.
- `prefers-reduced-motion` desliga Lenis, parallax, reveals, a abertura e a troca automática do
  hero.
- Hero com botão de pausa, link "Pular para o conteúdo", foco visível, lightbox com teclado
  (Esc e setas) e devolução do foco.
- A página é pré-renderizada estaticamente (Cache Components).

## Publicação na Vercel

1. Suba o repositório para o GitHub e importe o projeto em <https://vercel.com/new>. O framework
   (Next.js) é detectado sozinho.
2. Em **Settings → Environment Variables**, configure:
   - `NEXT_PUBLIC_SITE_URL`: a URL final (ex.: `https://lequarttie.com.br`)
   - `NEXT_PUBLIC_ALLOW_INDEXING`: `false` na demonstração e `true` só após a aprovação
   - **Não** adicione `APIFY_API_TOKEN`: a importação roda localmente e as imagens vão
     versionadas no repositório.
3. Faça o deploy. Pela CLI: `npx vercel` (preview) e `npx vercel --prod`.

## Antes de publicar (checklist)

- [ ] Confirmar endereço, horários, telefone e WhatsApp com a loja
- [ ] Obter autorização formal para usar as fotos e marcar `"granted"`
- [ ] Revisar a classificação feminino/masculino em `scripts/selection.json`
- [ ] Trocar o logotipo tipográfico pelo arquivo oficial e ajustar a paleta
- [ ] Confirmar as marcas comercializadas e preencher `data/brands.ts`
- [ ] Adicionar avaliações reais com link da fonte em `data/reviews.ts`, se desejado
- [ ] Definir `NEXT_PUBLIC_SITE_URL` e `NEXT_PUBLIC_ALLOW_INDEXING=true`
