import { test, expect } from '@playwright/test'
import { rootURL, saveMessages } from './test-util'

test('single named module', async ({ page }) => {
  const messages = saveMessages(page)
  await page.goto(`${rootURL}html/unnamed-single.html`)
  await expect(messages.length).toEqual(3)
  await expect(messages[0]).toEqual('Error: Module ultimate has not been defined')
  await expect(messages[1]).toEqual('imported {"answer":42}')
  await expect(messages[2]).toEqual('exported {"answer":42}')
})

test('named module with flat dependencies', async ({ page }) => {
  const messages = saveMessages(page)
  await page.goto(`${rootURL}html/unnamed-flat.html`)
  await expect(messages.length).toEqual(5)
  await expect(messages[0]).toEqual('Error: Module galaxy has not been defined')
  await expect(messages[1]).toEqual('Error: Module ultimate has not been defined')
  await expect(messages[2]).toEqual('imported {"ultimate":{"answer":42}} {"answer":42}')
  await expect(messages[3]).toEqual('exported {"ultimate":{"answer":42}}')
  await expect(messages[4]).toEqual('exported {"answer":42}')
})

test('named module with relative dependencies', async ({ page }) => {
  const messages = saveMessages(page)
  await page.goto(`${rootURL}html/unnamed-relative.html`)
  await expect(messages.length).toEqual(5)
  await expect(messages[0]).toEqual('Error: Module galaxy-relative has not been defined')
  await expect(messages[1]).toEqual('Error: Module ultimate has not been defined')
  await expect(messages[2]).toEqual('imported {"ultimate":{"answer":42}}')
  await expect(messages[3]).toEqual('exported {"ultimate":{"answer":42}}')
  await expect(messages[4]).toEqual('exported {"answer":42}')
})

test('named module with nested absolute dependencies', async ({ page }) => {
  const messages = saveMessages(page)
  await page.goto(`${rootURL}html/unnamed-nested-absolute.html`)
  await expect(messages.length).toEqual(5)
  await expect(messages[0]).toEqual('Error: Module galaxy-nested-absolute has not been defined')
  await expect(messages[1]).toEqual('Error: Module galaxy/ultimate has not been defined')
  await expect(messages[2]).toEqual('imported {"ultimate":{"answer":41}}')
  await expect(messages[3]).toEqual('exported {"ultimate":{"answer":41}}')
  await expect(messages[4]).toEqual('exported {"answer":41}')
})

test('named module with nested relative dependencies', async ({ page }) => {
  const messages = saveMessages(page)
  await page.goto(`${rootURL}html/unnamed-nested-relative.html`)
  await expect(messages.length).toEqual(5)
  await expect(messages[0]).toEqual('Error: Module galaxy-nested-relative has not been defined')
  await expect(messages[1]).toEqual('Error: Module galaxy/ultimate has not been defined')
  await expect(messages[2]).toEqual('imported {"ultimate":{"answer":41}}')
  await expect(messages[3]).toEqual('exported {"ultimate":{"answer":41}}')
  await expect(messages[4]).toEqual('exported {"answer":41}')
})
