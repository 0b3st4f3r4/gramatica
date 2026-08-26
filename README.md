# Gramática do Movimento — página estática

Esta é uma edição digital estática e responsiva do manuscrito, construída com React, Vite, `react-markdown`, `remark-gfm` e Mermaid.

## Desenvolvimento

```bash
pnpm install
pnpm dev
```

## Build estático

```bash
pnpm build
```

O diretório gerado em `dist/public` pode ser publicado por uma hospedagem estática. Para GitHub Pages, ajuste a propriedade `base` do Vite caso o repositório seja servido em um subcaminho (`/<nome-do-repositorio>/`).

## Conteúdo

O manuscrito-fonte está em `client/src/content/gramatica-do-movimento.md`. A navegação é gerada a partir de seus headings de segundo e terceiro níveis, e os blocos `mermaid` são renderizados no navegador.

## PDF em formato de livro

O arquivo `downloads/gramatica-do-movimento-livro.pdf` acompanha a versão publicada no GitHub. A abertura da página oferece um link direto para sua leitura ou download.
