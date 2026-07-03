const express = require('express');
const TurnstileSolver = require('./turnstile-solver');

const app = express();
app.use(express.json());

const RATE_LIMIT = {};
const MAX_REQUESTS = 10;
const WINDOW_MS = 60000;

app.use('/api/solve', (req, res, next) => {
  const ip = req.headers['x-forwarded-for'] || req.ip || 'unknown';
  if (!RATE_LIMIT[ip]) {
    RATE_LIMIT[ip] = { count: 1, reset: Date.now() + WINDOW_MS };
    return next();
  }
  if (Date.now() > RATE_LIMIT[ip].reset) {
    RATE_LIMIT[ip] = { count: 1, reset: Date.now() + WINDOW_MS };
    return next();
  }
  if (RATE_LIMIT[ip].count >= MAX_REQUESTS) {
    return res.status(429).json({ status: false, error: 'too many requests, slow down' });
  }
  RATE_LIMIT[ip].count++;
  next();
});

app.post('/api/solve', async (req, res) => {
  const { url, siteKey, mode } = req.body;

  if (!url || !siteKey) {
    return res.json({ status: false, token: null, error: 'url and siteKey required' });
  }

  const solver = new TurnstileSolver({ record: false });
  try {
    const result = await solver.solve(url, siteKey);
    if (!result.success) {
      return res.json({ status: false, token: null, error: result.error });
    }
    return res.json({
      status: true,
      token: {
        result: {
          token: result.token
        }
      }
    });
  } catch (err) {
    return res.json({ status: false, token: null, error: err.message });
  } finally {
    await solver.cleanup();
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`running on ${PORT}`));
