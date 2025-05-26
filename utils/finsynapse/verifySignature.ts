import crypto from 'crypto'

export function verifySignature(signature: string | null, body: string): boolean {
  const secret = process.env.FINSYNAPSE_WEBHOOK_SECRET || ''
  const expected = crypto.createHmac('sha256', secret).update(body).digest('hex')
  return signature === expected
}
