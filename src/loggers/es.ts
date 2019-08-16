import { Transformer, LogData, ElasticsearchTransportOptions } from 'winston-elasticsearch'

export function extractMessage(data: LogData) {
  if (typeof data.message === 'string') {
    return data.message
  } else if (typeof data.message === 'object') {
    const keys = ['message']
    for (const key of keys) {
      if (typeof data.message[key] === 'string') {
        return data.message[key]
      }
    }
    return undefined
  } else {
    return `${data.message}`
  }
}

export function extractTimestamp(data: LogData) {
  if (typeof data.timestamp === 'string') {
    return data.timestamp
  } else {
    const now = new Date()
    return now.toISOString()
  }
}

export function extractFields(data: LogData) {
  const fields = typeof data.message === 'string' ? data.meta : { ...data.meta, ...data.message }
  delete fields['timestamp']
  return fields
}

export const defaultTransformer: Transformer = logData => ({
  severity: logData.level,
  message: extractMessage(logData),
  fields: extractFields(logData),
  '@timestamp': extractTimestamp(logData)
})

export const rootTransformer: Transformer = logData => {
  const fields = extractFields(logData)
  return {
    severity: logData.level,
    message: extractMessage(logData),
    '@timestamp': extractTimestamp(logData),
    ...fields
  }
}

export const defaultElasticsearchTransportOpts: ElasticsearchTransportOptions = {
  transformer: rootTransformer,
  clientOpts: {
    host: 'http://127.0.0.1:9200'
  }
}
