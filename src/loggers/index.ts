import uuidv4 from 'uuid/v4'
import fs from 'fs-extra'
import path from 'path'
import dayjs from 'dayjs'
import { Client } from 'elasticsearch'

const toTimestamp = (now: Date) => now.getTime()

export interface LogDocument {
  type: string
}

export function convertLog(data: object) {
  const now = new Date()
  return {
    now,
    ts: toTimestamp(now),
    ...data
  }
}

type LogFunction = <T extends LogDocument>(doc: T) => Promise<void>

function stringifyLog(doc: object) {
  const line = JSON.stringify(doc)
  return line
}

async function sendToElasticsearch(elas: Client, index: string, body: object) {
  try {
    const result = await elas.create({
      id: uuidv4(),
      index,
      type: '_doc',
      body
    })
  } catch (err) {
    // TODO 실패 로그 어디로 남기지
    console.error(err)
  }
}

async function sendToFile(logpath: string, prefix: string, body: object) {
  const now = dayjs(new Date())
  const name = now.format(`${prefix}-YYYY-MM-DD.log`)
  const fp = path.resolve(logpath, name)
  const log = convertLog(body)
  const line = stringifyLog(log)
  await fs.appendFile(fp, line + '\n')
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
}
