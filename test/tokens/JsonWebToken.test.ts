import faker from 'faker'
import { JsonWebToken } from '../../src/tokens/JsonWebToken'

const secret = faker.random.alphaNumeric(8)

interface Token {
  a: number
  b: string
}

describe('JsonWebToken', () => {
  it('sign -> verify', async () => {
    const helper = new JsonWebToken(secret)
    const input: Token = {
      a: 123,
      b: 'foo'
    }
    const token = await helper.sign(input)
    const actual = await helper.verify(token)
    expect(actual).toMatchObject(input)
  })
})
