const express = require('express');
const consola = require('consola');
const bodyParser = require('body-parser')
const session = require('express-session')
const { Nuxt, Builder } = require('nuxt');
const app = express();
const host = process.env.HOST || '127.0.0.1';
const port = process.env.PORT || 3000;

app.set('port', port);
//enable trust proxy
app.enable('trust proxy');

// Body parser, to access `req.body`
// app.use('/master/api/login', bodyParser.json())

// Sessions to create `req.session`
app.use(session({
  secret: 'super-secret-key',
  resave: true,
  saveUninitialized: false,
  cookie: { maxAge: 3600000 }
}))

// Import API Routes
// app.use('/platform/api/', require('./api/login'))
app.use('/platform/api/', require('./api/menu'))

// Import and Set Nuxt.js options
let config = require('../nuxt.config.js');
config.dev = !(process.env.NODE_ENV === 'production');

async function start() {
  // Init Nuxt.js
  const nuxt = new Nuxt(config);

  // Build only in dev mode
  if (config.dev) {
    const builder = new Builder(nuxt);
    await builder.build();
  }

  // Give nuxt middleware to express
  app.use(nuxt.render);

  // Listen the server
  app.listen(port, host);
  consola.ready({
    message: `Server listening on http://${host}:${port}`,
    badge: true,
  });
}
start();
