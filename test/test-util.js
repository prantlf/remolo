export const rootURL = new URL('.', import.meta.url)

export function saveMessages(page) {
  const messages = []
  page
    .on('console', message => {
      // console.log(message)
      messages.push(message.text().split('\n')[0])
    })
    .on('pageerror', error => console.warn(error))
  return messages
}
