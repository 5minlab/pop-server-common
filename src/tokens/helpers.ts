import createError from 'http-errors'
import * as yup from 'yup'
import { JsonWebToken } from './JsonWebToken'

export function extractTokenString(opts: { line: string; prefix: string }) {
  const { line, prefix } = opts

  if (!line) {
    throw new createError.Unauthorized(`no token`)
  }

  if (!line.startsWith(prefix)) {
    throw new createError.Unauthorized(`token not found`)
  }

  const tokenStr = line.replace(prefix, '').trim()
  if (!tokenStr) {
    throw new createError.Unauthorized(`empty token`)
  }

  return tokenStr
}

export async function extractToken<T>(opts: {
  line: string
  prefix: string
  secret: string
  schema: yup.Schema<T>
}) {
  const { schema, secret } = opts

  // raw -> str
  const tokenStr = extractTokenString(opts)

  // str -> obj
  const tokenHelper = new JsonWebToken(secret)
  const obj = await tokenHelper.verify(tokenStr)

  // obj -> token
  try {
    const token = await schema.validate(obj)
    return token
  } catch (err) {
    throw createError(401, {
      message: err.message,
      name: 'InvalidAuthTokenError'
    })
  }
}
