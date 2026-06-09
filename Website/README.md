# Website

The Nammumu web stack: an **Express** REST API backed by MongoDB and a **Vue.js** dashboard for public weather maps, admin tools, and Ethereum subscription management.

## 🗂️ Structure

| Folder | Stack | Port | Role |
| --- | --- | --- | --- |
| `BackEnd/` | Express, Mongoose, Passport/JWT | **3030** | REST API, auth, weather & transaction data |
| `frontend/` | Vue 2, Vuetify, Web3 | **8080** | Public site and back-office UI |

## 🖥️ BackEnd

The backend manages weather readings, stations, countries/states, users, and blockchain transactions.

```bash
cd Website/BackEnd
npm install
npm start
```

The server binds to `0.0.0.0:3030` (override with the `PORT` environment variable).

### 🗄️ Database

MongoDB is configured in `BackEnd/database_connector/connector.js`. A bundled Atlas URI is included for reference — replace it with your own cluster before starting the API.

### 🛣️ Main routes

| Prefix | Purpose |
| --- | --- |
| `/api/weatherData` | Ingest and query weather readings (used by IoT collector) |
| `/api/transaction` | Record subscription payments (used by blockchain Watcher) |
| `/api/price` | Subscription pricing |
| `/auth` | Login, register, MetaMask sign-in |
| `/weatherData` | Front-office weather map endpoints; `POST /` is IP-checked (station must be registered) |
| `/weatherStation`, `/country`, `/state`, `/transaction`, `/users` | Back-office CRUD |

The IoT collector uses `/api/weatherData` in production, which accepts POSTs without an IP check. CORS is enabled globally; JWT protects admin-only routes such as `/test`.

## 🎨 FrontEnd

Vue dashboard built on the Vuely admin template. Talks to the API at `http://localhost:3030/` (see `frontend/src/main.js`).

```bash
cd Website/frontend
npm install
npm run dev
```

Open [http://localhost:8080](http://localhost:8080). For production builds, run `npm run build` and serve the `dist/` output.

See [frontend/README.md](./frontend/README.md) for frontend-specific scripts and structure.

## 🔄 End-to-end flow

```
IoT collector ──POST──► /api/weatherData ──► MongoDB ──GET──► Vue maps
Blockchain Watcher ──POST──► /api/transaction ──► MongoDB ──GET──► Admin UI
User wallet ──pay──► Smart contract ──event──► Watcher
```

## 📚 Related docs

- [Architecture overview](../docs/overview.md)
- [Getting started](../README.md#getting-started)
- [Frontend README](./frontend/README.md)
- [BlockChain](../BlockChain/README.md) · [IoT](../IOT/README.md)
