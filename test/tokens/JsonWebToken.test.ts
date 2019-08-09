import faker from 'faker'
import { JsonWebToken } from '../../src/tokens/JsonWebToken'

const secret = faker.random.alphaNumeric(8)

interface Token {
  a: number
  b: string
}

describe('JsonWebToken', () => {
  const helper = new JsonWebToken(secret)

  it('sign -> verify/decode', async () => {
    const input: Token = {
      a: 123,
      b: 'foo'
    }
    const token = await helper.sign(input)
    expect(await helper.verify(token)).toMatchObject(input)
    expect(helper.decode(token)).toMatchObject(input)
  })

  it('verify fail', async () => {
    await expect(helper.verify('invalid-token')).rejects.toThrowError()
  })

  it('decode fail', () => {
    const actual = helper.decode('invalid-token')
    expect(actual).toBeNull()
  })
})
