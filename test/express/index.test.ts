import * as yup from 'yup'
import { getRequestContext, sanitizeRequestContext } from '../../src/express'

interface Body {
  ival: number
  bval: boolean
  sval: string
}

const schema = yup.object().shape<Body>({
  ival: yup.number().required(),
  bval: yup.boolean().required(),
  sval: yup.string().required()
})

const ival = 123
const bval = true
const sval = 'foo'

describe('getRequestConext', () => {
  it('all', () => {
    const req = {
      body: { ival },
      params: { bval },
      query: { sval }
    }
    const actual = getRequestContext(req)
    expect(actual).toEqual({ ival, bval, sval })
  })

  it('none', () => {
    const req = {
      body: {},
      params: {},
      query: {}
    }
    const actual = getRequestContext(req)
    expect(actual).toEqual({})
  })
})

describe('sanitizeRequestContext', () => {
  const valid: Body = { ival, bval, sval }

  it('ok', async () => {
    const req = {
      body: { ival: ival.toString() },
      params: { bval: bval.toString() },
      query: { sval }
    }
    expect(await sanitizeRequestContext(req, schema)).toMatchObject(valid)
  })

  it('validate fail', async () => {
    const req = {
      body: { ival: '1234' },
      params: { bval },
      query: { sval }
    }
    expect(await sanitizeRequestContext(req, schema)).not.toMatchObject(valid)
  })
})
