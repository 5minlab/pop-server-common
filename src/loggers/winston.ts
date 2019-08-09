import winston from 'winston'

import Elasticsearch, {
  Transformer,
  ElasticsearchTransportOptions,
  LogData
} from 'winston-elasticsearch'

import { DailyRotateFileTransportOptions } from 'winston-daily-rotate-file'

import { ConsoleTransportOptions, FileTransportOptions } from 'winston/lib/winston/transports'

function extractMessage(data: LogData) {
  if (typeof data.message === 'string') {
    return data.message
  } else if (data.message === 'object') {
    const keys = ['message', 'type', 'msg', 'ty']
    for (const key of keys) {
      if (typeof data.message[key] === 'string') {
        return data.message[key]
      }
    }
    return 'empty'
  } else {
    return data.message
  }
}

function extractTimestamp(data: LogData) {
  if (typeof data.timestamp === 'string') {
    return data.timestamp
  } else {
    const now = new Date()
    return now.toISOString()
  }
}

function extractFields(data: LogData) {
  const fields = typeof data.message === 'string' ? data.meta : { ...data.meta, ...data.message }
  delete fields['timestamp']
  return fields
}

const transformer: Transformer = logData => {
  const timestamp = extractTimestamp(logData)
  const message = extractMessage(logData)
  const fields = extractFields(logData)

  return {
    '@timestamp': timestamp,
    message: message,
    severity: logData.level,
    fields: fields
  }
}

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

export class TransportFactory {
  private readonly factory = new TransportOptionFactory()

  public es(opts: ElasticsearchTransportOptions) {
    return new Elasticsearch(this.factory.es(opts))
  }

  public console(opts: ConsoleTransportOptions) {
    return new winston.transports.Console(this.factory.console(opts))
  }

  public file(opts: FileTransportOptions) {
    return new winston.transports.File(this.factory.file(opts))
  }
}
