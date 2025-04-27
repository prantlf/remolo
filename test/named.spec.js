import { test, expect } from '@playwright/test'
import { rootURL, saveMessages } from './test-util'

test('named module alone', async ({ page }) => {
  const messages = saveMessages(page)
  await page.goto(`${rootURL}html/named-alone.html`)
  await expect(messages.length).toEqual(4)
  await expect(messages[0]).toEqual('Error: Module ultimate has not been defined')
  await expect(messages[1]).toEqual('Error: Module ultimate has not been loaded')
  await expect(messages[2]).toEqual('imported {"answer":42}')
  await expect(messages[3]).toEqual('exported {"answer":42}')
})

test('named module with dependencies', async ({ page }) => {
  const messages = saveMessages(page)
  await page.goto(`${rootURL}html/named-deps.html`)
  await expect(messages.length).toEqual(3)
  await expect(messages[0]).toEqual('imported {"ultimate":{"answer":42}} {"answer":42}')
  await expect(messages[1]).toEqual('exported {"ultimate":{"answer":42}}')
  await expect(messages[2]).toEqual('exported {"answer":42}')
})
