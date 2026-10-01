// Focused catalog, editor, product link, preview and share verification.
require("./browser-test.cjs")
  .run({ assetsOnly: true })
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  });
