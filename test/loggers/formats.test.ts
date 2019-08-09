import { enumerateErrorFormat } from '../../src/loggers/formats'
import { TransformableInfo } from 'logform'

const message = 'sample-message'
const name = 'sample-name'
const e = new Error(message)
e.name = name

describe('enumerateErrorFormat', () => {
  it('info.message', () => {
    const f = enumerateErrorFormat()
    const info = f.transform({ level: 'info', message: e as any }) as any
    expect(info.message.message).toBe(message)
    expect(typeof info.message.stack).toBe('string')
  })

  it('info', () => {
    const f = enumerateErrorFormat()
    const info = f.transform(e as any) as TransformableInfo
    expect(info.message).toBe(message)
    expect(typeof info.stack).toBe('string')
  })
})
