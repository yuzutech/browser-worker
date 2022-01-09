'use strict'

const puppeteer = require('puppeteer')

class Worker {
  /**
   * @param browserInstance {BrowserInstance}
   */
  constructor (browserInstance) {
    this.browserInstance = browserInstance
  }

  async process (taskFn, timeout = 30000) {
    const browser = await this.browserInstance.connect()
    const page = await browser.newPage()
    // Workaround for timeouts/zombies is to kill after a given time
    const cleanupTask = setTimeout(() => this.close(page), timeout)
    try {
      return await taskFn(page)
    } finally {
      clearTimeout(cleanupTask)
      this.close(page)
    }
  }

  async close (page) {
    try {
      await page.close()
    } catch (e) {
      if (e.message !== 'Protocol error: Connection closed. Most likely the page has been closed.' && e.message !== 'Protocol error (Target.closeTarget): Target closed.') {
        console.warn('Unable to close the page', e)
      }
    }
    try {
      const browser = page.browser()
      await browser.disconnect()
    } catch (e) {
      console.warn('Unable to disconnect from the browser', e)
    }
  }
}

module.exports = { Worker }
