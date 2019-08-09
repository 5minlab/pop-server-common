import { Transformer, ElasticsearchTransportOptions, LogData } from 'winston-elasticsearch'

import { DailyRotateFileTransportOptions } from 'winston-daily-rotate-file'

import { ConsoleTransportOptions, FileTransportOptions } from 'winston/lib/winston/transports'

export function extractMessage(data: LogData) {
  if (typeof data.message === 'string') {
    return data.message
  } else if (typeof data.message === 'object') {
    const keys = ['message', 'type', 'msg', 'ty']
    for (const key of keys) {
      if (typeof data.message[key] === 'string') {
        return data.message[key]
      }
    }
    return 'empty'
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

export const transformer: Transformer = logData => ({
  severity: logData.level,
  message: extractMessage(logData),
  fields: extractFields(logData),
  '@timestamp': extractTimestamp(logData)
})

const defaultElasticsearchTransportOpts: ElasticsearchTransportOptions = {
  transformer,
  clientOpts: {
    host: 'http://127.0.0.1:9200'
  }
}

const defaultDailyRotateFileTransportOpts: DailyRotateFileTransportOptions = {
  filename: 'application-%DATE%.log',
  datePattern: 'YYYY-MM-DD-HH',
  json: true,
  zippedArchive: true,
  maxSize: '20m',
  maxFiles: '14d'
}

const defaultConsoleTransportOpts: ConsoleTransportOptions = {}

const defaultFileTransportOpts: FileTransportOptions = {}

export class TransportOptionFactory {
  public es(opts: ElasticsearchTransportOptions) {
    return { ...defaultElasticsearchTransportOpts, ...opts }
  }

  public daily(opts: DailyRotateFileTransportOptions) {
    return { ...defaultDailyRotateFileTransportOpts, ...opts }
  }

  public console(opts: ConsoleTransportOptions) {
    return { ...defaultConsoleTransportOpts, ...opts }
  }

  public file(opts: FileTransportOptions) {
    return { ...defaultFileTransportOpts, ...opts }
  }
}
