/* eslint-env mocha */
/* global fetch */
'use strict'

const path = require('path')

const { expect } = require('./harness')

const { create } = require('../lib/browser-instance')

describe('connect()', () => {
  it('should create and connect to a headless browser', async () => {
    const browserInstance = await create()
    const browser = await browserInstance.connect()
    try {
      const page = await browser.newPage()
      await page.goto(`file://${path.join(__dirname, 'fixtures', 'hello.html')}`)
      const text = await page.evaluate(() => {
        return document.getElementById('title').textContent
      })
      expect(text).to.equal('Hey!')
    } finally {
      await browser.close()
      await browserInstance.close()
    }
  })

  it('should allow HTTPS requests from file:// protocol', async () => {
    const browserInstance = await create()
    const browser = await browserInstance.connect()
    try {
      const page = await browser.newPage()
      await page.goto(`file://${path.join(__dirname, 'fixtures', 'hello.html')}`)
      const response = await page.evaluate(async () => {
        return fetch('https://httpbin.org/post', {
          method: 'POST',
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ key: 'value' })
        }).then(response => response.json())
      })
      expect(response.json).to.deep.equal({ key: 'value' })
      expect(response.url).to.equal('https://httpbin.org/post')
    } finally {
      await browser.close()
    }
  })

  it('should connect multiple times', async () => {
    const browserInstance = await create()
    const browser1 = await browserInstance.connect()
    const browser2 = await browserInstance.connect()
    try {
      const page1 = await browser1.newPage()
      const page2 = await browser2.newPage()
      await page1.goto(`file://${path.join(__dirname, 'fixtures', 'hello.html')}`)
      await page2.goto(`file://${path.join(__dirname, 'fixtures', 'hello.html')}`)
      const title = await page1.evaluate(() => {
        return document.getElementById('title').textContent
      })
      const subtitle = await page2.evaluate(() => {
        return document.getElementById('subtitle').textContent
      })
      expect(title).to.equal('Hey!')
      expect(subtitle).to.equal('How are you today?')
    } finally {
      await browser1.close()
      await browser2.close()
      await browserInstance.close()
    }
  })
})
