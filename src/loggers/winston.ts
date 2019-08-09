import { ElasticsearchTransportOptions } from 'winston-elasticsearch'

import { DailyRotateFileTransportOptions } from 'winston-daily-rotate-file'

import { ConsoleTransportOptions, FileTransportOptions } from 'winston/lib/winston/transports'

import { defaultElasticsearchTransportOpts } from './es'

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
