import crypto = require('crypto')

export function encrypt(input: string | Record<string, unknown>): string {
  if (typeof input === 'object') input = JSON.stringify(input)

  const cipher = crypto.createCipheriv('aes-256-cbc', process.env.CIPHER_KEY, process.env.CIPHER_IV)
  let crypted = cipher.update(input, 'utf-8', 'hex')
  crypted += cipher.final('hex')

  return crypted
}

export function decrypt(input: string): string {
  const decipher = crypto.createDecipheriv('aes-256-cbc', process.env.CIPHER_KEY, process.env.CIPHER_IV)
  let decrypted = decipher.update(input, 'hex', 'utf8')
  decrypted += decipher.final('utf8')

  return decrypted
}
