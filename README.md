# Domo Consultoria — Frontend (React)

Interface em **React (Vite) + Recharts** que consome a API (FastAPI) e desenha o
dashboard: seletor de empresas, KPIs, diagnóstico automático e gráficos por indicador.

## Pré-requisitos

- **Node.js** instalado (versão 18 ou superior).
- A **API rodando** em http://127.0.0.1:8000 (a pasta `domo-api`, com o `uvicorn` no ar).

## Como rodar (desenvolvimento)

Abra o terminal **nesta pasta** (`domo-web`) e rode:

```
npm install
npm run dev
```

O Vite vai mostrar um endereço, normalmente **http://localhost:5173**.
Abra esse endereço no navegador. (Mantenha a API rodando no outro terminal.)

> São dois servidores ao mesmo tempo: a API na porta 8000 e o site na 5173.
> Precisa de dois terminais abertos — um para cada.

## Estrutura

```
domo-web/
├── index.html
├── package.json
├── vite.config.js
└── src/
    ├── main.jsx              # ponto de entrada
    ├── App.jsx               # estado, busca na API e layout geral
    ├── api.js                # endereço e chamadas da API
    ├── styles.css            # estilos (paleta Domo, tema claro/escuro)
    └── components/
        ├── Sidebar.jsx       # busca + filtro de setor + lista de empresas
        ├── Header.jsx        # marca Domo + empresa + botão de tema
        ├── Cards.jsx         # KPI e bloco de diagnóstico
        └── IndicatorCard.jsx # cartão de indicador com mini gráfico
```

## Configuração para o deploy (Fase 3)

No deploy, o site precisa saber a URL pública da API (no Render).
Crie um arquivo `.env` com:

```
VITE_API_URL=https://sua-api.onrender.com
```

Sem esse arquivo, ele usa `http://127.0.0.1:8000` (desenvolvimento local).
