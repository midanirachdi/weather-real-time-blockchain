# Website

The website consists of two projects: an Express REST API backend and a Vue.js 2 dashboard frontend.

## Project Structure

```
Website/
├── BackEnd/          # Express API (port 3030)
│   ├── app.js        # Application entry and route mounting
│   ├── bin/www       # HTTP server
│   ├── api/          # Public API routes (/api/*)
│   ├── routes/       # Backoffice and frontoffice routes
│   ├── models/       # Mongoose schemas
│   └── libs/         # Authentication helpers
└── frontend/         # Vue.js dashboard (port 8080)
    ├── src/
    │   ├── views/    # Page components
    │   ├── router/   # Vue Router config
    │   ├── utils/    # Contract config, helpers
    │   └── main.js   # App bootstrap
    └── config/       # Webpack dev server config
```

## Backend — Express API

### Entry Point

`app.js` configures middleware and mounts all routes. The HTTP server in `bin/www` listens on `0.0.0.0:3030`.

### Middleware

| Middleware | Purpose |
|------------|---------|
| `cors()` | Cross-origin requests |
| `body-parser` | JSON and URL-encoded body parsing |
| `passport` | JWT authentication |
| `morgan` | Request logging |

### Route Mounting

| Mount Path | Module | Auth |
|------------|--------|------|
| `/` | `routes/index.js` | None |
| `/users` | `routes/backOffice/user.js` | None |
| `/weatherData` | `routes/frontOffice/weatherData.js` | None (IP check on POST) |
| `/weatherStation` | `routes/backOffice/weatherStation.js` | None |
| `/transaction` | `routes/backOffice/transaction.js` | None |
| `/auth` | `routes/login/login.js` | None |
| `/api/weatherData` | `api/weatherData.js` | None |
| `/api/transaction` | `api/transaction.js` | None |
| `/api/price` | `api/price.js` | None |
| `/country` | `routes/backOffice/country.js` | None |
| `/state` | `routes/backOffice/state.js` | None |
| `/test` | `api/testcountry.js` | JWT + admin role |

### Key Dependencies

| Package | Version | Purpose |
|---------|---------|---------|
| express | 4.15 | Web framework |
| mongoose | 5.7 | MongoDB ODM |
| passport-jwt | 4.0 | JWT authentication |
| bcrypt | 1.0 | Password hashing |
| jsonwebtoken | 8.2 | Token generation |
| ethjs / ethereumjs-util | — | MetaMask signature verification |

### Configuration

The only supported environment variable is `PORT` (defaults to `3030`). MongoDB connection URI and JWT secret are defined in source files.

## Frontend — Vue.js Dashboard

Built on the **Vuely** admin template with Vuetify 1.x material design components.

### Dev Server

```bash
cd Website/frontend
npm install
npm run dev    # http://localhost:8080
```

Webpack dev server config is in `config/index.js`.

### Production Build

```bash
npm run build  # output → dist/
```

### API Connection

Axios is configured in `src/main.js`:

```javascript
axios.defaults.baseURL = 'http://localhost:3030/';
```

Update this for production deployments.

### Authentication

Uses `@websanova/vue-auth` with:

- **Token storage:** `localStorage` + cookies
- **Token header:** `Authorization: Bearer <token>`
- **Roles:** `client`, `admin`

Two login methods:

1. **Password** — `POST /auth/login` with username and password
2. **MetaMask** — Sign the message `"270bytes weather"` and `POST /auth/sign` with address and signature

### Web3 Integration

`web3@0.20.0` connects to MetaMask for:

- Wallet-based login
- Sending ETH payments to the `Nummum` contract on `/pricing`
- Admin price updates on `/admin/pricing`

Contract address and ABI are in `src/utils/configContract.js`.

## Key Views

### Public

| Route | Component | Description |
|-------|-----------|-------------|
| `/` | `FrontOffice/home.vue` | Landing page |
| `/session/login` | `session/Login.vue` | Password and MetaMask login |
| `/session/sign-up` | `session/SignUp.vue` | User registration |

### Client (auth required)

| Route | Component | Description |
|-------|-----------|-------------|
| `/map` | `FrontOffice/worldMap.vue` | World heatmap (Highcharts) |
| `/map/:country` | `FrontOffice/countryMap.vue` | Country/state drill-down |
| `/pricing` | `FrontOffice/pricing.vue` | Subscription plans via MetaMask |

### Admin

| Route | Component | Description |
|-------|-----------|-------------|
| `/admin/userlist` | `BackOffice/userList.vue` | User CRUD |
| `/admin/pricing` | `BackOffice/Price.vue` | On-chain and DB price management |
| `/admin/weatherStations` | `BackOffice/WeatherStation.vue` | Station registration |
| `/admin/transactions` | `BackOffice/Transaction.vue` | Payment history |

## External Services

The frontend integrates with several third-party APIs:

| Service | Used For |
|---------|----------|
| Highcharts (`code.highcharts.com`) | Map GeoJSON for heatmaps |
| CryptoCompare (`min-api.cryptocompare.com`) | Live ETH/USD exchange rate |
| Google Geocoding (via backend `/state/gmap`) | State coordinate lookup |

## Subscription Gate

On `/map`, the frontend checks the logged-in user's subscription status:

- If `token_balance === 0` **and** `apiExpirationDate` is expired → redirect to `/pricing`
- Admin users are redirected to `/admin/userlist`

## Running Locally

```bash
# Terminal 1
cd Website/BackEnd && npm start

# Terminal 2
cd Website/frontend && npm run dev
```

Open `http://localhost:8080`.

See [API Reference](./api.md) for endpoint details and [Getting Started](../README.md#getting-started) for full setup instructions.
