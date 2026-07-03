# Mirante — Web (Frontend)

Interface em **React (Vite)** que consome a [API do Mirante](https://github.com/claudio-42/mirante-api) e apresenta um **mapa interativo** com as empresas cobertas. Ao clicar em uma empresa no mapa, abre um painel de análise financeira completo: KPIs, diagnóstico automático, indicadores de liquidez e endividamento, e demonstrativos contábeis (DRE, Balanço Patrimonial).

🔗 Deploy: [mirante-web.vercel.app](https://mirante-web.vercel.app)

## Funcionalidades

- **Mapa interativo** das empresas cobertas, com dados geográficos vindos da API (`/api/mapa`)
- Ao clicar numa empresa: **KPIs** e **diagnóstico executivo** gerados automaticamente
- **Indicadores** de liquidez e endividamento, com série histórica em gráfico
- **Demonstrativos contábeis**: DRE, Balanço Patrimonial (BP) e DFC
- Busca e filtro de empresas por setor
- Tema claro/escuro

## Stack

- **React 19 + Vite** — base da aplicação
- **Recharts** — gráficos dos indicadores
- **d3-geo** — projeção geográfica usada no mapa
- **Framer Motion** — transições e animações
- **oxlint** — lint

## Pré-requisitos

- **Node.js** 18 ou superior
- A [API (mirante-api)](https://github.com/claudio-42/mirante-api) rodando — localmente em `http://127.0.0.1:8000`, ou apontada via variável de ambiente (veja abaixo)

## Como rodar (desenvolvimento)

```bash
git clone https://github.com/claudio-42/mirante-web.git
cd mirante-web
npm install
npm run dev
```

O Vite vai mostrar um endereço, normalmente **http://localhost:5173**. Abra esse endereço no navegador.

> São dois servidores ao mesmo tempo: a API na porta 8000 e o site na 5173. Precisa de dois terminais abertos — um para cada.

## Configuração para deploy

Em produção, o site precisa saber a URL pública da API. Crie um arquivo `.env` na raiz com:

```
VITE_API_URL=https://sua-api.onrender.com
```

Sem esse arquivo, ele usa `http://127.0.0.1:8000` (desenvolvimento local).

## Estrutura (resumo)

```
mirante-web/
├── index.html
├── package.json
├── vite.config.js
├── public/
└── src/
    ├── main.jsx        # ponto de entrada
    ├── App.jsx          # estado, busca na API e layout geral
    ├── api.js            # endereço e chamadas da API
    ├── styles.css        # estilos (tema claro/escuro)
    └── components/
        ├── Sidebar.jsx    # busca + filtro de setor + lista de empresas
        ├── Header.jsx      # marca Mirante + empresa selecionada + botão de tema
        ├── Cards.jsx        # KPIs e bloco de diagnóstico
        └── IndicatorCard.jsx # cartão de indicador com mini gráfico
```

> Não consegui listar o conteúdo de `src/components` diretamente pelo GitHub (bloqueado para leitura automática). Se o mapa e os demonstrativos (DRE/BP) estiverem em arquivos com nomes diferentes dos listados acima, me avisa os nomes reais que eu ajusto essa árvore.

## Próximos passos

- **Deploy da API** em produção (Render), apontando `VITE_API_URL` para ela.
- Ampliar a cobertura de empresas conforme a API for evoluindo.

---

Projeto pessoal desenvolvido por [claudio-42](https://github.com/claudio-42).
