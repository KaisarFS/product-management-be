const app = require('./app');
const config = require('./config');
require('./db/pool');

app.listen(config.port, () => {
  // eslint-disable-next-line no-console
  console.log(`API server listening on port ${config.port}`);
});

