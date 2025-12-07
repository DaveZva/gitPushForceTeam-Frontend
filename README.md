# Cat Show Frontend

## Lokální spuštění
```bash
# 1. Nainstalovat dependencies
npm install

# 2. Spustit dev server
npm run dev

# 3. Otevřít v prohlížeči
http://localhost:5173
```

## Environment Variables

| Variable | Default | Popis |
|----------|---------|-------|
| VITE_API_URL | http://localhost:8080/api | Backend API URL |

## Spuštění Webhooku
stripe listen --forward-to localhost:8080/api/v1/payments/webhook

## Build pro produkci
```bash
npm run build
# Výstup v složce dist/
```
