'use strict'

const puppeteer = require('puppeteer')

class BrowserInstance {
  constructor (browser) {
    this.browser = browser
    this.browserWSEndpoint = this.browser.wsEndpoint()
    this.browser.disconnect()
  }

  async connect () {
    return puppeteer.connect({
      browserWSEndpoint: this.browserWSEndpoint,
      ignoreHTTPSErrors: true
    })
  }

  async close () {
    return this.browser.close()
  }
}

const createBrowserInstance = async () => {
  const browser = await puppeteer.launch({
    ignoreDefaultArgs: true,
    headless: true,
    args: [
      '--headless',
      '--disable-web-security',
      '--allow-file-access-from-files',
      '--no-sandbox',
      '--disable-setuid-sandbox',
      '--disable-dev-shm-usage'
    ]
  })
  return new BrowserInstance(browser)
}

module.exports = {
  create: async () => createBrowserInstance()
}
