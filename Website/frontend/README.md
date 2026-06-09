# Frontend (Vue.js)

Nammumu dashboard and public weather UI. Built with **Vue 2**, **Vuetify**, and **Web3** for MetaMask-based login and subscription payments.

Based on the [Vuely](https://themeforest.net/item/vuely-vuejs-admin-template) admin template, customized for weather maps, station management, and transaction history.

## ✅ Requirements

- Node.js v10+ recommended
- Running Express backend on port **3030** (see [Website overview](../README.md))

## 💻 Development

```bash
npm install
npm run dev
```

The dev server runs at [http://localhost:8080](http://localhost:8080) with hot reload. Host and port can be overridden via `config/index.js` or environment variables.

## 📦 Production build

```bash
npm run build
```

Output is written to `dist/`. Serve those static files behind Nginx or your preferred host; proxy API calls to the backend.

Optional bundle analysis:

```bash
npm run build --report
```

## 🔗 API connection

Axios is configured in `src/main.js`:

```js
axios.defaults.baseURL = 'http://localhost:3030/';
```

Change this when pointing at a staging or production API.

## 🗺️ Key areas

| Path | Description |
| --- | --- |
| `src/views/FrontOffice/` | Public home, world map, place listings |
| `src/views/BackOffice/` | Admin: users, stations, transactions, pricing |
| `src/views/session/` | Login and registration (including MetaMask sign) |
| `src/router/index.js` | Route definitions and navigation guards |
| `config/index.js` | Dev server host, port, and build paths |

## 📜 Scripts

| Command | Description |
| --- | --- |
| `npm run dev` | Start webpack dev server |
| `npm start` | Alias for `npm run dev` |
| `npm run build` | Production build |
| `npm run lint` | ESLint on `src/` and unit tests |
| `npm test` | Run Karma unit tests |

## 📚 Related docs

- [Website overview](../README.md)
- [Architecture overview](../../docs/overview.md)
- [Getting started](../../README.md#getting-started)
