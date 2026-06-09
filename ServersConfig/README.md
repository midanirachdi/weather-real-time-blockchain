# ServersConfig

Nginx reverse-proxy configuration for running the Nammumu Express backend behind HTTPS with load balancing and caching.

## 📁 Files

| File | Description |
| --- | --- |
| `nginx/nodejs.conf` | Production-style config for `express.270bytes.com` |

## ⚙️ What it does

- Terminates TLS on port **443** and redirects HTTP (port 80) to HTTPS
- Load-balances `/webapp/` across two Node.js app servers using **ip_hash** (session affinity)
- Proxies WebSocket traffic on `/wstunnel/` with upgrade headers (the sample config uses `proxy_pass https://nodejs`; change to `http://nodejs` if your upstream speaks plain HTTP)
- Enables a shared proxy cache (`backcache`) for backend responses

## 🖥️ Upstream servers

The sample config targets two internal hosts:

```
192.168.33.11:3030
192.168.33.12:3030
```

Replace these with your actual backend IPs or hostnames before deploying.

## 🚀 Deployment

1. Install Nginx and place your TLS certificate and key (paths referenced in the config):
   - `ssl_certificate` → `/etc/nginx/ssl/certificate-name`
   - `ssl_certificate_key` → `/etc/nginx/ssl/private-key`

2. Copy or include `nginx/nodejs.conf` in your Nginx sites directory, for example:

```bash
sudo cp nginx/nodejs.conf /etc/nginx/sites-available/nammumu
sudo ln -s /etc/nginx/sites-available/nammumu /etc/nginx/sites-enabled/
sudo nginx -t && sudo systemctl reload nginx
```

3. Ensure the Express app listens on port **3030** on each upstream server (see `Website/BackEnd/bin/www`).

## 💻 Local development

This config is intended for production. For local work, run the backend and frontend directly — see [Website/README.md](../Website/README.md) and the [root README](../README.md).
