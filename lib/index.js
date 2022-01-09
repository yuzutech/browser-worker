'use strict'

const { create: createBrowser } = require('./browser-instance')
const { Worker } = require('./worker')

/**
 * Browser worker based on Puppeteer.
 *
 * @module browser-worker
 */
module.exports = { Worker, createBrowser }
