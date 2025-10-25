# Cat Show Frontend

## Lokální spuštění (bez Dockeru)
```bash
# 1. Nainstalovat dependencies
npm install

# 2. Spustit dev server
npm run dev

# 3. Otevřít v prohlížeči
http://localhost:5173
```

## Docker spuštění
```bash
# Z root složky projektu
docker-compose up frontend
```

## Environment Variables

| Variable | Default | Popis |
|----------|---------|-------|
| VITE_API_URL | http://localhost:8080/api | Backend API URL |

## Build pro produkci
```bash
npm run build
# Výstup v složce dist/
```
