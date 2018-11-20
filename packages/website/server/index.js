const express = require('express')
const consola = require('consola')
const { Nuxt, Builder } = require('nuxt')
const app = express()
const host = process.env.HOST || '127.0.0.1'
const port = process.env.PORT || 3000

app.set('port', port)

// Import and Set Nuxt.js options
let config = require('../nuxt.config.js')
config.dev = !(process.env.NODE_ENV === 'production')

async function start() {
  // Init Nuxt.js
  const nuxt = new Nuxt(config)

  // Build only in dev mode
  if (config.dev) {
    const builder = new Builder(nuxt)
    await builder.build()

    // Give nuxt middleware to express
    app.use(nuxt.render)
  } else {
    // Give nuxt middleware to express
    app.use((req, res) => {
      res.set('Cache-Control', 'public, max-age=300, s-maxage=300');

      return new Promise((resolve, reject) => {
        nuxt.render(req, res, promise => {
          promise.then(resolve).catch(reject);
        });
      });
    })
  }


  // Listen the server
  // if (config.dev) {
  //   app.listen(port, host)
  // } else {
  //   app.listen();
  // }

  app.listen(port, host)
  consola.ready({
    message: `Server listening on http://${host}:${port}`,
    badge: true
  })
}
start()
