/**
 * express集成nuxt
 */
const { Nuxt, Builder } = require('nuxt')
const bodyParser = require('body-parser')
const session = require('express-session')
const cookieParser = require('cookie-parser');
const app = require('express')()
let config = require('../nuxt.config.js')

// Body parser, to access `req.body`
app.use('/master/api/login', bodyParser.json())
app.use(cookieParser());

// Sessions to create `req.session`
app.use(session({
  secret: 'super-secret-key',
  resave: true,
  saveUninitialized: false,
  cookie: { maxAge: 600000 }
}))

// Import API Routes
app.use('/master/api/', require('./mock/login'))
app.use('/master/api/', require('./mock/menu'))

// We instantiate Nuxt.js with the options
config.isProd = process.env.NODE_ENV === 'production';
config.dev = !config.isProd;
const nuxt = new Nuxt(config)
// No build in production
if (config.dev) {
  const builder = new Builder(nuxt)
  builder.build()
}
app.use(nuxt.render)
app.listen(3100)
console.log('Server is listening on http://localhost:3100')