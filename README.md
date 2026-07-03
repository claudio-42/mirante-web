# Mirante Web

Interface em React do Mirante: uma plataforma para explorar indicadores financeiros de companhias abertas da B3 (dados CVM/DFP). Uma landing page com mapa interativo do Brasil permite escolher a empresa; ao selecioná-la, um dashboard com abas apresenta KPIs, gráficos e um diagnóstico automático por aspecto financeiro.

**Demo ao vivo:** https://mirante-web.vercel.app

> Hospedado na Vercel. Os dados vêm da API (Render) e do banco (Neon), ambos em plano gratuito que hiberna quando ocioso; a primeira carga pode levar de 30 a 60 segundos.

Este projeto faz parte de um sistema em três camadas:

- **Pipeline de dados (CVM):** [bigdata_for_finance](https://github.com/claudio-42/bigdata_for_finance)
- **API (FastAPI):** [mirante-api](https://github.com/claudio-42/mirante-api) — fornece os dados a este front
- **Front-end (este repositório):** consome a API e desenha a interface

---

## Funcionalidades

- **Landing com mapa interativo do Brasil:** cada empresa é um ponto na sede, com busca por nome/CNPJ, filtro por setor e zoom (scroll ou pinça).
- **Dashboard por empresa, em abas:** Visão Geral, Liquidez, Endividamento, Margens e Rentabilidade, Atividade e Ciclos, Fleuriet, e os demonstrativos Balanço, DRE e DFC.
- **Diagnóstico automático:** leitura textual dos indicadores, cruzando tendências e o contexto do setor da empresa (sem uso de IA).
- **Tema claro/escuro.**

---

## Tecnologias

React (Vite), Recharts (gráficos), d3-geo (projeção do mapa), Framer Motion (animações). Deploy na Vercel.

---

## Como rodar localmente

**Pré-requisitos:** Node.js 18+ e uma instância da API rodando (a versão publicada em [mirante-api](https://github.com/claudio-42/mirante-api), ou uma local).

1. Instale as dependências:
   ```bash
   npm install
   ```
2. Crie um arquivo `.env` na raiz apontando para a API (sem barra no final):
   ```
   VITE_API_URL=https://mirante-api.onrender.com
   ```
   (Para uma API local, use `http://127.0.0.1:8000`.)
3. Rode em modo de desenvolvimento:
   ```bash
   npm run dev
   ```
4. Acesse o endereço que o Vite exibir (normalmente `http://localhost:5173`).

---

## Estrutura

```
mirante-web/
├── src/
│   ├── components/
│   │   ├── Landing.jsx          Landing (mapa, busca, filtros)
│   │   ├── BrazilMap.jsx        Mapa do Brasil com zoom e pontos
│   │   ├── DashboardTabs.jsx    Abas da análise por empresa
│   │   ├── DemonstrativoTab.jsx Tabelas de BP/DRE/DFC
│   │   ├── Sidebar.jsx          Seletor de empresas
│   │   ├── Header.jsx           Cabeçalho e tema
│   │   ├── Cards.jsx            KPIs e blocos de diagnóstico
│   │   ├── IndicatorCard.jsx    Cartão de indicador com mini gráfico
│   │   └── ThemeToggle.jsx      Alternador de tema
│   ├── data/brazil-states.json  GeoJSON do Brasil (simplificado)
│   ├── api.js                   Chamadas à API
│   ├── format.js               Formatação de valores
│   ├── styles.css              Estilos e paleta
│   ├── App.jsx
│   └── main.jsx
├── index.html
├── package.json
├── vite.config.js
├── .gitignore
└── README.md
```

---

## Deploy (Vercel)

A Vercel detecta o Vite automaticamente. A única configuração necessária é a variável de ambiente:

- **`VITE_API_URL`** = URL pública da API (sem barra no final).

---

*Parte do projeto Mirante, desenvolvido a partir da disciplina de Big Data for Finance. Dados públicos da CVM; finalidade acadêmica, não constitui recomendação de investimento.*
