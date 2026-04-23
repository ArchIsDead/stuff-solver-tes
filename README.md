# 🔓 Cloudflare Turnstile Solver

Solver Cloudflare Turnstile otomatis menggunakan Puppeteer dengan stealth plugin. Mendukung multi-thread, proxy rotation, dan custom user-agent.

## ✨ Fitur

- Solve Cloudflare Turnstile secara otomatis
- Browser pool (multi-thread) untuk concurrent solving
- Support proxy rotation dari file `data/proxies.txt`
- Custom user-agent dari file `data/useragents.txt` atau fallback otomatis
- Output token dalam format JSON
- CLI-friendly, bisa diintegrasikan ke script lain

## 📦 Instalasi

```bash
npm install puppeteer-extra puppeteer-extra-plugin-stealth
```

## 🚀 Penggunaan

### CLI

```bash
node turnstile-solver.js --url <url> --sitekey <sitekey> [options]
```

**Contoh:**

```bash
# Basic
node turnstile-solver.js --url https://example.com --sitekey 0x4AAAAAAA...

# Headless + proxy + 3 thread
node turnstile-solver.js --url https://example.com --sitekey 0x4AAAAAAA... --headless --proxy --threads 3

# Dengan action parameter
node turnstile-solver.js --url https://example.com --sitekey 0x4AAAAAAA... --action login
```

### Options

| Flag | Deskripsi | Default |
|------|-----------|---------|
| `--url` | URL target (wajib) | - |
| `--sitekey` | Sitekey Turnstile (wajib) | - |
| `--action` | Action parameter widget | - |
| `--threads` | Jumlah browser di pool | `1` |
| `--headless` | Jalankan browser headless | `false` |
| `--proxy` | Aktifkan proxy rotation | `false` |

### Output

```json
{
  "success": true,
  "creator": "XAi Community",
  "token": "0.eyJhbGci...",
  "time": 4.231
}
```

Kalau gagal:

```json
{
  "success": false,
  "error": "Token not received",
  "time": 30.012
}
```

## 📁 Struktur File Opsional

```
data/
├── proxies.txt      # satu proxy per baris (format: http://host:port atau http://user:pass@host:port)
└── useragents.txt   # satu user-agent per baris
```

Kalau file-file ini tidak ada, solver tetap jalan pakai fallback UA bawaan dan tanpa proxy.

### Contoh `proxies.txt`

```
http://123.45.67.89:8080
http://user:pass@98.76.54.32:3128
```

### Contoh `useragents.txt`

```
Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/124.0 Safari/537.36
Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 Chrome/123.0 Safari/537.36
```

## 🔧 Penggunaan sebagai Module

```js
const { TurnstileSolver } = require('./turnstile-solver');

const solver = new TurnstileSolver({
  headless: true,
  threads: 2,
  useProxy: false,
});

await solver.initialize();

const result = await solver.solve('https://example.com', '0x4AAAAAAA...');
console.log(result);

await solver.cleanup();
```

## ⚙️ Cara Kerja

1. Solver inject HTML Turnstile widget ke URL target menggunakan request interception
2. Browser membuka halaman dan menunggu widget Cloudflare load
3. Solver klik widget, lalu polling token setiap 1 detik (maks 30 detik)
4. Token dikembalikan dalam format JSON beserta waktu solve

## 📋 Requirements

- Node.js >= 18
- Chromium (otomatis diinstall oleh Puppeteer)

## ⚠️ Disclaimer

Tool ini dibuat untuk keperluan edukasi dan testing. Penggunaan untuk bypass proteksi tanpa izin pemilik situs adalah tanggung jawab pengguna sepenuhnya.
