import faker from 'faker'
import * as yup from 'yup'
import { extractToken, extractTokenString } from '../../src/tokens/helpers'
import { JsonWebToken } from '../../src/tokens/JsonWebToken'

const prefix = 'Bearer '
const token = faker.random.alphaNumeric(16)
const secret = faker.random.alphaNumeric(8)

describe('extractTokenString', () => {
  it('error', () => {
    const cases = [``, `${token}`, `invalid ${token}`, 'Bearer', 'Bearer ', 'Bearer     ']
    for (const line of cases) {
      expect(() => extractTokenString({ line, prefix })).toThrowError(``)
    }
  })

  it('ok', () => {
    const cases = [`Bearer ${token}`, `Bearer ${token} `, `Bearer  ${token}`]
    for (const line of cases) {
      const actual = extractTokenString({ line, prefix })
      expect(actual).toBe(token)
    }
  })
})

interface Token {
  data: string
}

const schema = yup.object().shape({
  data: yup.string().required()
})

describe('extractToken', () => {
  const tokenHelper = new JsonWebToken(secret)

  it('error', async () => {
    const invalidToken = await tokenHelper.sign({ other: 1234 })
    await expect(
      extractToken({
        line: `Bearer ${invalidToken}`,
        prefix,
        schema,
        secret
      })
    ).rejects.toThrowError()
  })

  it('ok', async () => {
    const input: Token = { data: 'foo' }
    const validToken = await tokenHelper.sign(input)
    const actual = await extractToken({
      line: `Bearer ${validToken}`,
      prefix,
      schema,
      secret
    })
    expect(actual).toMatchObject(input)
  })
})
