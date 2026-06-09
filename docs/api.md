# API Reference

The Express backend exposes REST endpoints for authentication, weather data, transactions, pricing, and geographic data. All endpoints are served from port **3030**.

Base URL (local): `http://localhost:3030`

## Database

**Engine:** MongoDB Atlas via Mongoose 5.7

**Database name:** `weather`

Connection is configured in `database_connector/connector.js`.

## Data Models

### User (`User` collection)

```javascript
{
  wallet_adr: String,       // required, unique — Ethereum address
  token_balance: Number,    // default 0 — API call tickets
  apiExpirationDate: Date,  // subscription expiry
  apiKey: String,           // UUID, generated on register
  username: String,         // auto-set to wallet_adr on save
  password: String,         // bcrypt hashed
  role: 'admin' | 'client'  // default 'client'
}
```

### Weather Data (`weather_data` collection)

```javascript
{
  coord: { lng, lat, state_code, country_code },
  sys: { country, sunrise, sunset },
  main: { temp, humidity, pressure },
  timestamp: Date,
  state: [ObjectId]         // ref → State
}
```

### Transaction (`transaction` collection)

```javascript
{
  sender_adr: String,
  contract_adr: String,
  selected_package: String,   // "Week" | "Month" | "Ticket"
  transaction_date: Date,
  purchase_amount: Number,
  price: {
    ticket_price: String,
    week_price: String,
    month_price: String
  }
}
```

### Weather Station (`weather_station` collection)

```javascript
{
  status: String,
  age: Number,
  ip_adr: String,
  coord: [{ lng, lat }],
  state: [ObjectId]           // ref → State
}
```

### Configuration (`Configuration` collection)

```javascript
{
  name: String,    // e.g. "ticket_price", "week_price_usd"
  value: Number
}
```

### Country

```javascript
{ name, isoCode, hmapCode, continent }
```

### State

```javascript
{ name, highChartKey, 'hc-a2', country: ObjectId }
```

---

## Authentication — `/auth`

| Method | Path | Body | Response |
|--------|------|------|----------|
| POST | `/auth/login` | `name`, `password` (form-urlencoded) | `{ message, token, userInfo }` + `Authorization` header |
| POST | `/auth/register` | `name`, `password`, `address` (wallet) | Same as login |
| POST | `/auth/sign` | `address`, `signature` (MetaMask) | JWT if wallet matches a DB user |
| GET | `/auth/refresh` | — | Empty token refresh stub |

**JWT details:**

- Secret: defined in `libs/jwtConfig.js`
- Expiry: `10080` seconds (~2.8 hours)
- Payload: `{ _id, username, role, apiKeyEXP, token_balance }`
- MetaMask sign message: `"270bytes weather"`

---

## Weather Data — `/weatherData` and `/api/weatherData`

Both route sets expose identical read endpoints. The difference is on POST:

| Route | POST behavior |
|-------|---------------|
| `/weatherData` | IP whitelist check against `weather_station` collection |
| `/api/weatherData` | Accepts all POST requests (used by IoT collector) |

### Read Endpoints

| Method | Path | Description |
|--------|------|-------------|
| GET | `/fullMap` | 24-hour aggregated world map data (temp, humidity, pressure heatmap arrays) |
| GET | `/fullMap/:country` | State-level aggregation for a country (ISO code) |
| GET | `/fullMap/:country/:state` | Last 10 readings for a specific state |
| GET | `/range/temp` | Filter by temperature range. Query: `mintemp`, `maxtemp` |
| GET | `/range/humidity` | Filter by humidity range. Query: `minHumidity`, `maxHumidity` |
| GET | `/range/pressure` | Filter by pressure range. Query: `minPressure`, `maxPressure` |
| GET | `/` | Last 10 weather readings |

### Write Endpoints

| Method | Path | Description |
|--------|------|-------------|
| POST | `/` | Save a weather reading (see route differences above) |

### Example: World Map Response

```json
{
  "hmap": {
    "temp": [["ie", 18.5], ["us", 22.1]],
    "Humidity": [["ie", 65.0], ["us", 55.3]],
    "pressure": [["ie", 1013.2], ["us", 1015.8]]
  },
  "weatherdata": [ ... ]
}
```

---

## Transactions — `/transaction` and `/api/transaction`

| Method | Path | Description |
|--------|------|-------------|
| GET | `/transaction` | List all transactions |
| GET | `/transaction/:id` | Get transaction by ID |
| POST | `/transaction` | Save transaction only (backoffice) |
| POST | `/api/transaction` | Save + **update user subscription** |
| DELETE | `/transaction/:id` | Remove transaction |

### Subscription Logic (`POST /api/transaction`)

The handler finds the user by `wallet_adr === sender_adr` and applies:

| `selected_package` | Effect |
|--------------------|--------|
| `"Month"` | Extend `apiExpirationDate` by 30 days |
| `"Week"` | Extend `apiExpirationDate` by 7 days |
| `"Ticket"` | `token_balance += 10` |

If `apiExpirationDate` is already in the past, it resets to today before extending.

---

## Pricing — `/api/price`

| Method | Path | Description |
|--------|------|-------------|
| GET | `/api/price/usd` | All config entries matching `price_usd` |
| GET | `/api/price/eth` | Config where name matches `_price` and value < 1 |
| GET | `/api/price/:plan` | ETH amount for a plan (converts USD via CryptoCompare) |
| GET | `/api/price/` | ETH price drift notification check |
| POST | `/api/price/:plan` | Update config value. Body: `{ newprice }` |

---

## Users — `/users`

| Method | Path | Description |
|--------|------|-------------|
| GET | `/users` | List all users |
| GET | `/users/:id` | Get user by ID |
| POST | `/users` | Create user |
| PUT | `/users/:id` | Full update (re-hashes password) |
| PUT | `/users/:id/TB` | Update `token_balance` only |
| PUT | `/users/:id/AEDANDTB` | Update expiration + token balance |
| PUT | `/users/:id/:AED` | Update `apiExpirationDate` only |
| DELETE | `/users/:id` | Remove user |

---

## Weather Stations — `/weatherStation`

| Method | Path | Description |
|--------|------|-------------|
| GET | `/weatherStation` | List all stations |
| GET | `/weatherStation/:id` | Get station by ID |
| POST | `/weatherStation` | Create station |
| PUT | `/weatherStation/:id` | Update status, age, IP, coords, state |
| DELETE | `/weatherStation/:id` | Remove station |

---

## Geography — `/country` and `/state`

| Method | Path | Description |
|--------|------|-------------|
| GET | `/country` | List countries `{ text, isoCode }` |
| GET | `/country/:idOrName` | Single country |
| GET | `/country/:country_name/states` | States for a country |
| GET | `/state/:name` | State by name with populated country |
| GET | `/state/gmap/:country/:state` | Google Geocoding proxy |

---

## Admin Test — `/test`

Requires JWT authentication and `admin` role.

| Method | Path | Description |
|--------|------|-------------|
| GET | `/test` | States with populated countries |
| GET | `/test/c` | All countries |
| GET | `/test/m` | Current user's transactions |

---

## Error Responses

| Status | Meaning |
|--------|---------|
| 404 | Resource not found |
| 500 | Server error (rendered via Twig error page) |

Weather station IP rejection:

```json
{ "error": "UnKnown Station" }
```
