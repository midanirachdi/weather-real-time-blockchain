# IOT

Raspberry Pi weather station collector for Nammumu. Reads temperature, humidity, and pressure from a [Sense HAT](https://www.raspberrypi.com/products/sense-hat/) and POSTs readings to the Express backend every 3 seconds.

## 🗂️ Structure

| Path | Description |
| --- | --- |
| `sensehat-pi/` | Node.js collector (`index.js`, `package.json`) |
| `sensehat-pi/RTIMULib.ini` | IMU / sensor calibration config for the Sense HAT |

## ✅ Requirements

- Raspberry Pi with Sense HAT attached
- Node.js v10+ recommended
- Network access to the backend API

## 🚀 Setup

```bash
cd IOT/sensehat-pi
npm install
node index.js
```

The collector runs on a **3-second** interval and sends JSON payloads shaped like OpenWeather-style weather objects (coordinates, `main.temp` / `humidity` / `pressure`, timestamp, and a linked state document).

## ⚙️ Configuration

Edit the constants at the top of `sensehat-pi/index.js`:

| Field | Purpose |
| --- | --- |
| `coord` | Station latitude, longitude, and country/state codes |
| `state.oid` | MongoDB ObjectId of the state this station belongs to |
| `sys` | Display metadata (country code, sunrise/sunset) |
| `uri` in `SenseHatData()` | Backend URL (default: `http://express.270bytes.com:3030/api/weatherData`) |

For local development, set the URI to `http://localhost:3030/api/weatherData` and ensure the state `oid` matches a record in your database.

## 🔄 Data flow

```
Sense HAT sensors → index.js → POST /api/weatherData → MongoDB → Vue dashboard
```

## 📚 Related docs

- [Architecture overview](../docs/overview.md)
- [Getting started](../README.md#getting-started)
- Backend ingest route: `Website/BackEnd/api/weatherData.js`
