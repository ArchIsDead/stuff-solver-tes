const { solveCloudflare } = require('./cloudflare-solver');
const TurnstileSolver      = require('./turnstile-solver');

// Cloudflare challenge
async function runCloudflare() {
  const result = await solveCloudflare({
    url: 'https://example.com',
    headless: false,
    timeout: 60,
  });
  console.log(result);
}

// Turnstile
async function runTurnstile() {
  const solver = new TurnstileSolver({ record: true });
  try {
    const res = await solver.solve('https://www.waifu2x.net', '0x4AAAAAABqlY7DKXMzoS81U');
    console.log(res);
  } finally {
    await solver.cleanup();
  }
}

(async () => {
  // await runCloudflare();
  await runTurnstile();
})();
