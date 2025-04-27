import { test, expect } from '@playwright/test'
import { rootURL, saveMessages } from './test-util'

test('missing module', async ({ page }) => {
  const messages = saveMessages(page)
  await page.goto(`${rootURL}html/missing.html`)
  await expect(messages.length).toEqual(2)
  const message = messages[1].replace(/file:\/\/\S+\/test\/html\/missing\.js/, 'file:missing.js')
  await expect(message).toEqual('mising Error: Loading missing from file:missing.js failed')
})

test('failing module', async ({ page }) => {
  const messages = saveMessages(page)
  await page.goto(`${rootURL}html/failing.html`)
  await expect(messages.length).toEqual(1)
  await expect(messages[0]).toEqual('failing Error: Module failing has not been defined')
})

test('empty module', async ({ page }) => {
  const messages = saveMessages(page)
  await page.goto(`${rootURL}html/empty.html`)
  await expect(messages.length).toEqual(1)
  await expect(messages[0]).toEqual('empty Error: Module empty has not been defined')
})
