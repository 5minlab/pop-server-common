import uuidv4 from 'uuid/v4'
import fse from 'fs-extra'
import path from 'path'
import dayjs from 'dayjs'
import { Client } from '@elastic/elasticsearch'

const toTimestamp = (now: Date) => now.getTime()

export interface LogDocument {
  type: string
}

function convertLog(data: object) {
  const now = new Date()
  return {
    now,
    ts: toTimestamp(now),
    ...data
  }
}

export type LogFunction = <T extends LogDocument>(doc: T) => Promise<void>

function stringifyLog(doc: object) {
  const line = JSON.stringify(doc)
  return line
}

async function sendToElasticsearch(elas: Client, index: string, body: object) {
  const result = await elas.create({
    id: uuidv4(),
    index,
    type: '_doc',
    body
  })
}

export function makeLogFileName(prefix: string, now: Date) {
  const nowObj = dayjs(now)
  const nowStr = nowObj.format('YYYY-MM-DD')
  const name = `${prefix}-${nowStr}.log`
  return name
}

async function sendToFile(logpath: string, prefix: string, body: object) {
  const filename = makeLogFileName(prefix, new Date())
  const fp = path.join(logpath, filename)
  const log = convertLog(body)
  const line = stringifyLog(log)
  await fse.appendFile(fp, line + '\n')
}

async function sendToWriter(writer: (line: string) => void, prefix: string, body: object) {
  const log = convertLog(body)
  const line = stringifyLog(log)
  writer(`${prefix}: ${line}`)
}

export class LogSenderFactory {
  private readonly category: string

  constructor(category: string) {
    this.category = category
  }

  public es(elas: Client): LogFunction {
    return async doc => {
      const log = convertLog(doc)
      await sendToElasticsearch(elas, this.category, log)
    }
  }

  public file(logpath: string): LogFunction {
    return async doc => {
      const log = convertLog(doc)
      await sendToFile(logpath, this.category, log)
    }
  }

  public line(writer: (line: string) => void): LogFunction {
    return async doc => {
      const log = convertLog(doc)
      await sendToWriter(writer, this.category, log)
    }
  }

  public null(): LogFunction {
    return async doc => {
      // 로그 테스트하는데 test spy같은거까지 심을 필요 있을까
      // 실행만 되고 로그는 무시하도록 일단 구현
    }
  }

  public demux(functions: LogFunction[]): LogFunction {
    return async doc => {
      const tasks = functions.map(fn => fn(doc))
      await Promise.all(tasks)
    }
  }
}
