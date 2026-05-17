const TurnstileSolver = require('./');

(async () => {
  const solver = new TurnstileSolver({
    record: true,          // aktifkan recording
    recordDir: './recordings',
    timeout: 60000,
  });

  // pakai sitekey eksplisit
  const res = await solver.solve("https://www.waifu2x.net",
      "0x4AAAAAABqlY7DKXMzoS81U");
  console.log(res);

  // atau langsung dari halaman (auto-detect)
  // const res = await solver.solve('https://target.com');

  await solver.cleanup();
})();
