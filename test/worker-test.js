/* eslint-env mocha */
'use strict'

const path = require('path')

const { expect } = require('./harness')

const { create } = require('../lib/browser-instance')
const { Worker } = require('../lib/worker')

describe('process()', () => {
  let browserInstance

  beforeEach(async () => {
    browserInstance = await create()
  })

  afterEach(async () => {
    await browserInstance.close()
  })

  it('should throw an exception when timeout is exceeded!', async () => {
    const worker = new Worker(browserInstance)
    let cleanupPromises = []
    // process exceeds timeout, should throw an exception
    try {
      const result = await worker.process(async (page) => {
        cleanupPromises.push(new Promise((resolve) => page.on('close', () => resolve({ name: 'pageClosed' }))))
        cleanupPromises.push(new Promise((resolve) => page.browser().on('disconnected', () => resolve({ name: 'browserDisconnected' }))))
        await page.goto(`file://${path.join(__dirname, 'fixtures', 'hello.html')}`)
        return page.evaluate(async () => {
          await new Promise(function (resolve) { setTimeout(resolve, 6000) })
          return 'foo'
        })
      }, 5000)
      expect.fail('should throw an exception when timeout is exceeded!')
    } catch (err) {
      // OK
    } finally {
      const events = await Promise.all(cleanupPromises)
      expect(events.map(e => e.name)).to.have.members(['pageClosed', 'browserDisconnected'])
    }
  })

  it('should process a task', async () => {
    const worker = new Worker(browserInstance)
    let cleanupPromises = []
    try {
      const result = await worker.process(async (page) => {
        cleanupPromises.push(new Promise((resolve) => page.on('close', () => resolve({ name: 'pageClosed' }))))
        cleanupPromises.push(new Promise((resolve) => page.browser().on('disconnected', () => resolve({ name: 'browserDisconnected' }))))
        await page.goto(`file://${path.join(__dirname, 'fixtures', 'hello.html')}`)
        return page.evaluate(async () => {
          return document.getElementById('title').textContent
        })
      })
      expect(result).to.equal('Hey!')
    } finally {
      const events = await Promise.all(cleanupPromises)
      expect(events.map(e => e.name)).to.have.members(['pageClosed', 'browserDisconnected'])
    }
  })
})
