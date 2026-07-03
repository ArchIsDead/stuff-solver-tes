const express = require('express');
const TurnstileSolver = require('./turnstile-solver');

const app = express();
app.use(express.json());

app.post('/api/solve', async (req, res) => {
  const { url, siteKey } = req.body;
  if (!url || !siteKey) return res.json({ status: false, error: 'url and siteKey required' });

  const solver = new TurnstileSolver({ record: false });
  try {
    const result = await solver.solve(url, siteKey);
    if (!result.success) return res.json({ status: false, error: result.error });
    return res.json({ status: true, token: { result: { token: result.token } } });
  } catch (err) {
    return res.json({ status: false, error: err.message });
  } finally {
    await solver.cleanup();
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`running on ${PORT}`));
