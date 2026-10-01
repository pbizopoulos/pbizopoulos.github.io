// Serve the repository, then run node prm/validate-renderer.cjs [URL].
// PLAYWRIGHT_MODULE and CHROME_PATH select existing installations.
// INTERIOR_BACKEND=webgl explicitly checks the compatibility backend.
// INTERIOR_SCREENSHOTS writes PNGs from GPU render-target readback.
require("./browser-test.cjs")
  .run()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  });
