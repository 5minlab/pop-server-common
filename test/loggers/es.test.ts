import {
  extractFields,
  extractMessage,
  extractTimestamp,
  defaultTransformer,
  rootTransformer
} from '../../src/loggers/es'

import { LogData } from 'winston-elasticsearch'

describe('extractMessage', () => {
  const common = {
    level: 'info',
    meta: {}
  }
  const message = 'hello'

  it('string', () => {
    const data: LogData = {
      ...common,
      message
    }
    expect(extractMessage(data)).toBe(message)
  })

  it('object - found', () => {
    const data: LogData = {
      ...common,
      message: { message }
    }
    expect(extractMessage(data)).toBe(message)
  })

  it('object - not found', () => {
    const data: LogData = {
      ...common,
      message: { foo: 'bar' }
    }
    expect(extractMessage(data)).toBeUndefined()
  })

  it('number', () => {
    const data: LogData = {
      ...common,
      message: 123
    }
    expect(extractMessage(data)).toBe('123')
  })
})

describe('extractTimestamp', () => {
  const common = {
    message: 'todo',
    level: 'info',
    meta: {}
  }
  it('found', () => {
    const data: LogData = {
      ...common,
      timestamp: 'timestamp'
    }
    expect(typeof extractTimestamp(data)).toBe('string')
  })
  it('not found', () => {
    const data: LogData = {
      ...common
    }
    expect(typeof extractTimestamp(data)).toBe('string')
  })
})

describe('extractFields', () => {
  const common = {
    level: 'info'
  }
  it('message - string', () => {
    const data: LogData = {
      ...common,
      message: 'hello',
      meta: {
        a: 1,
        timestamp: 'timestamp'
      }
    }
    expect(extractFields(data)).toEqual({ a: 1 })
  })

  it('no message', () => {
    const data: LogData = {
      ...common,
      message: {
        a: 1,
        timestamp: 'timestamp'
      },
      meta: {
        b: 2
      }
    }
    expect(extractFields(data)).toEqual({ a: 1, b: 2 })
  })
})

describe('defaultTransformer', () => {
  it('message - string', () => {
    const input: LogData = {
      timestamp: '2019-09-30T05:09:08.282Z',
      message: 'Some message',
      level: 'info',
      meta: {
        method: 'GET',
        url: '/sitemap.xml'
      }
    }
    const expected = {
      '@timestamp': '2019-09-30T05:09:08.282Z',
      message: 'Some message',
      severity: 'info',
      fields: {
        method: 'GET',
        url: '/sitemap.xml'
      }
    }
    expect(defaultTransformer(input)).toEqual(expected)
  })

  it('message - object', () => {
    const input: LogData = {
      timestamp: '2019-09-30T05:09:08.282Z',
      level: 'info',
      meta: {
        method: 'GET',
        url: '/sitemap.xml'
      },
      message: {
        foo: 'bar'
      }
    }
    const expected = {
      '@timestamp': '2019-09-30T05:09:08.282Z',
      severity: 'info',
      fields: {
        method: 'GET',
        url: '/sitemap.xml',
        foo: 'bar'
      }
    }
    expect(defaultTransformer(input)).toEqual(expected)
  })
})

describe('rootTransformer', () => {
  it('message - string', () => {
    const input: LogData = {
      timestamp: '2019-09-30T05:09:08.282Z',
      message: 'Some message',
      level: 'info',
      meta: {
        method: 'GET',
        url: '/sitemap.xml'
      }
    }
    const expected = {
      '@timestamp': '2019-09-30T05:09:08.282Z',
      message: 'Some message',
      severity: 'info',
      method: 'GET',
      url: '/sitemap.xml'
    }
    expect(rootTransformer(input)).toEqual(expected)
  })

  it('message - object', () => {
    const input: LogData = {
      timestamp: '2019-09-30T05:09:08.282Z',
      level: 'info',
      meta: {
        method: 'GET',
        url: '/sitemap.xml'
      },
      message: {
        foo: 'bar'
      }
    }
    const expected = {
      '@timestamp': '2019-09-30T05:09:08.282Z',
      severity: 'info',
      method: 'GET',
      url: '/sitemap.xml',
      foo: 'bar'
    }
    expect(rootTransformer(input)).toEqual(expected)
  })
})
