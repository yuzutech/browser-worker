'use strict'

const config = {
  require: __filename,
  spec: resolveSpec(),
  timeout: 10 * 60 * 1000
}

if (process.env.npm_config_watch) config.watch = true

function resolveSpec () {
  const spec = process.argv[2]
  return spec && !spec.startsWith('-') ? spec : 'test/**/*-test.js'
}

module.exports = config
