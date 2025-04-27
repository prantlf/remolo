import { test, expect } from '@playwright/test'
import { rootURL, saveMessages } from './test-util'

test('module id and uri', async ({ page }) => {
  const messages = saveMessages(page)
  await page.goto(`${rootURL}html/module.html`)
  await expect(messages.length).toEqual(2)
  await expect(messages[0]).toEqual('id ultimate')
  const message = messages[1].replace(/file:\/\/\S+\/test\/html\/ultimate\.js/, 'file:ultimate.js')
  await expect(message).toEqual('uri file:ultimate.js')
})

test('module config', async ({ page }) => {
  const messages = saveMessages(page)
  await page.goto(`${rootURL}html/config.html`)
  await expect(messages.length).toEqual(2)
  await expect(messages[0]).toEqual('config {question: null, answer: 42}')
  await expect(messages[1]).toEqual('config {question: null, answer: 41}')
})
