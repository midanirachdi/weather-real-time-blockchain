# Nammumu — Weather Real-Time Blockchain

A real-time weather monitoring platform powered by IoT stations, a Vue.js dashboard, and Ethereum subscription payments.

## 📚 Documentation

Full project documentation lives in the **[docs/](./docs/)** folder:

- [Overview](./docs/overview.md) — architecture and how everything connects
- [Blockchain](./docs/blockchain.md) — smart contract and event watcher
- [IoT](./docs/iot.md) — Raspberry Pi weather station collector
- [Website](./docs/website.md) — Vue.js frontend and Express backend
- [API Reference](./docs/api.md) — REST endpoints and data models
- [Deployment](./docs/deployment.md) — Nginx, production URLs, and scaling

## 🗂️ Project Structure

| Folder              | Description                                       |
| ------------------- | ------------------------------------------------- |
| `BlockChain/`       | Solidity contract and Web3 event watcher          |
| `IOT/`              | Sense HAT weather data collector for Raspberry Pi |
| `ServersConfig/`    | Nginx reverse-proxy configuration                 |
| `Website/BackEnd/`  | Express REST API (port 3030)                      |
| `Website/frontend/` | Vue.js dashboard (port 8080)                      |

## 🚀 Getting Started

This guide walks through running every component of Nammumu on your local machine.

### ✅ Prerequisites

| Requirement | Notes |
|-------------|-------|
| **Node.js** | v10+ recommended |
| **MongoDB** | Atlas or local instance; update the connection URI in `Website/BackEnd/database_connector/connector.js` |
| **MetaMask** | Required for wallet login and subscription payments |
| **Raspberry Pi + Sense HAT** | Only needed for the IoT collector |

### 1. 🖥️ Backend (Express API)

```bash
cd Website/BackEnd
npm install
npm start
```

The server listens on `http://localhost:3030` (configurable via `PORT` environment variable).

On startup it connects to MongoDB using the URI in `database_connector/connector.js`. A bundled Atlas URI is included for reference — replace it with your own cluster before running locally. No `.env` file is required.

Verify it is running (an empty `[]` response still means the API is up):

```bash
curl http://localhost:3030/weatherData/
```

### 2. 🎨 Frontend (Vue.js Dashboard)

```bash
cd Website/frontend
npm install
npm run dev
```

The dev server starts at `http://localhost:8080`.

The Axios base URL is set to `http://localhost:3030/` in `src/main.js`. If your backend runs on a different host or port, update that line before starting the frontend.

#### 📦 Production build

```bash
npm run build
```

Output is written to `dist/`.

### 3. ⛓️ Blockchain Watcher

The watcher bridges on-chain payment events to the backend.

```bash
cd BlockChain/Watcher
npm install
node index.js
```

By default it connects to:

- **Ethereum RPC:** `http://parity.270bytes.com:8545/`
- **Contract:** `0x48a9ca6e6cc7e5664ccc746213b3e3e6bf88e23d`
- **Backend POST URL:** `http://backend.270bytes.com/api/transaction`

For local development, edit `index.js` to point the `SaveTransaction` URI at `http://localhost:3030/api/transaction`.

### 4. 🌡️ IoT Collector (Raspberry Pi)

```bash
cd IOT/sensehat-pi
npm install
node index.js
```

Requires a Raspberry Pi with a Sense HAT and the `node-sense-hat` native module.

The collector POSTs sensor data every 3 seconds. For local testing, change the URI in `index.js` from the production URL to:

```
http://localhost:3030/api/weatherData
```

#### ⚙️ Station configuration

Before a Pi can submit data through the IP-checked route (`POST /weatherData`), its IP must be registered in the `weather_station` collection via the admin panel at `/admin/weatherStations`.

The `/api/weatherData` POST endpoint accepts data from any source and is what the IoT script uses in production.

#### 📍 Customize location

Edit the hardcoded coordinates, country codes, and `state.oid` in `IOT/sensehat-pi/index.js` to match your station's geographic location.

### ⚡ Quick Start (Backend + Frontend only)

If you only need the dashboard without blockchain or IoT:

```bash
# Terminal 1 — Backend
cd Website/BackEnd && npm install && npm start

# Terminal 2 — Frontend
cd Website/frontend && npm install && npm run dev
```

Open `http://localhost:8080` in your browser.

### 🔌 Default Ports

| Service | Port |
|---------|------|
| Express API | 3030 |
| Vue dev server | 8080 |
| Parity node (production) | 8545 |

### 🔧 Troubleshooting

| Issue | Solution |
|-------|----------|
| Frontend cannot reach API | Confirm backend is running and `axios.defaults.baseURL` in `main.js` matches |
| Watcher not receiving events | Verify the Parity node is reachable and the contract address is correct |
| IoT POST fails | Use `/api/weatherData` for open access, or register the Pi IP for `/weatherData` |
| Map shows no data | Ensure weather readings exist in MongoDB (run the IoT collector or insert test data) |

### 👉 Next Steps

- [Overview](./docs/overview.md) — understand how components connect
- [API Reference](./docs/api.md) — explore available endpoints
- [Deployment](./docs/deployment.md) — production setup with Nginx
