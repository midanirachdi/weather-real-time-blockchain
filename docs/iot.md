# IoT — Weather Station Collector

The IoT component runs on a Raspberry Pi equipped with a Sense HAT. It reads environmental sensors and streams weather data to the backend API every 3 seconds.

## Location

```
IOT/sensehat-pi/
├── index.js        # Main collector script
├── package.json    # Dependencies
└── RTIMULib.ini    # IMU sensor configuration
```

## Hardware Requirements

| Component | Details |
|-----------|---------|
| **Raspberry Pi** | Any model with I2C support |
| **Sense HAT** | Provides temperature, humidity, and pressure sensors |
| **Network** | Pi must reach the backend API (local or production) |

## Dependencies

```json
{
  "node-sense-hat": "0.0.2",
  "request": "^2.85.0"
}
```

Install on the Pi:

```bash
cd IOT/sensehat-pi
npm install
```

## Sensor Configuration

`RTIMULib.ini` configures the Sense HAT IMU:

| Setting | Value |
|---------|-------|
| IMU type | 6 (LSM9DS1) |
| Pressure sensor | LPS25H |
| Humidity sensor | HTS221 |
| Fusion algorithm | Kalman |
| I2C bus | 1 |

## How It Works

1. Initializes the Sense HAT IMU via `node-sense-hat`.
2. Every **3 seconds**, calls `IMU.getValue()` to read `temperature`, `humidity`, and `pressure`.
3. Wraps readings in a JSON payload (OpenWeatherMap-compatible shape).
4. POSTs the payload to the backend.

### Data Payload

```javascript
{
  coord: {
    lng: -7.36,
    lat: 53.99,
    state_code: "cn",
    country_code: "ie"
  },
  sys: {
    country: "IE",
    sunrise: "07:10 AM",
    sunset: "08:00 PM"
  },
  main: {
    temp: 18.432,      // from Sense HAT, 3 decimal places
    humidity: 65.100,
    pressure: 1013.250
  },
  state: { oid: "5ab94b9205e4eb8522c4afdc" },  // MongoDB State ObjectId
  timestamp: "2024-01-15T10:30:00.000Z"
}
```

Coordinates, country codes, and the `state.oid` are **hardcoded** in `index.js`. Update these values to match your station's location before deployment.

## Data Transmission

| Setting | Production Value |
|---------|-------------------|
| URL | `http://express.270bytes.com:3030/api/weatherData` |
| Method | `POST` |
| Content-Type | `application/json` |

The collector uses `/api/weatherData`, which accepts POST requests without IP validation. An alternative route at `/weatherData` requires the sender's IP to be registered in the `weather_station` collection.

### Local Development

Change the URI in `index.js`:

```javascript
uri: 'http://localhost:3030/api/weatherData'
```

## Running the Collector

```bash
node index.js
```

On success, the console logs the latest `main` sensor values from each response.

For persistent operation, use a process manager like `pm2` or a systemd service:

```bash
pm2 start index.js --name weather-station
pm2 save
```

## Station Registration

Before a station can use the IP-checked route (`POST /weatherData`), an admin must register it:

1. Log in as admin and navigate to `/admin/weatherStations`.
2. Create a new station with the Pi's public IP address, coordinates, and associated state.
3. The backend checks `weather_station.ip_adr` against the request IP on each POST to `/weatherData`.

Unknown IPs receive `{"error": "UnKnown Station"}`.

## Customizing a Station

Edit these fields in `index.js` for each deployment:

| Field | Description |
|-------|-------------|
| `coord.lng`, `coord.lat` | Geographic coordinates |
| `coord.state_code` | State/province code (e.g. `"cn"` for Connacht) |
| `coord.country_code` | ISO country code (e.g. `"ie"`) |
| `sys.country` | Country name |
| `state.oid` | MongoDB `State` document ObjectId |

Find the correct `state.oid` by querying the backend:

```bash
curl http://localhost:3030/state/<state-name>
```

## Troubleshooting

| Issue | Solution |
|-------|----------|
| `Could not read sensor data` | Verify Sense HAT is seated correctly and I2C is enabled (`raspi-config`) |
| POST returns connection error | Check network connectivity and that the backend is running |
| Data not appearing on map | Confirm `state.oid` matches a valid State document and `country_code` is correct |
| `UnKnown Station` error | Register the Pi IP in admin panel, or use `/api/weatherData` instead |
