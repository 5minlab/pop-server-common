import fse from 'fs-extra'
import path from 'path'
import faker from 'faker'
import { LogSenderFactory } from '../../src/pop-server-common'
import { makeLogFileName } from '../../src/loggers/index'

const cat = faker.random.alphaNumeric(8)
const logpath = path.resolve(__dirname, `log-${cat}`)

beforeAll(async () => {
  await fse.mkdir(logpath)
})

afterAll(async () => {
  await fse.remove(logpath)
})

const factory = new LogSenderFactory(cat)

describe('makeLogFileName', () => {
  const prefix = 'game'
  const now = new Date(1564996889163)
  const actual = makeLogFileName(prefix, now)
  expect(actual).toBe('game-2019-08-05.log')
})

it('file', async () => {
  const sender = factory.file(logpath)
  await sender({ type: 'foo', text: 'hello' })
})

it('null', async () => {
  const sender = factory.null()
  await sender({ type: 'foo', text: 'hello' })
})

it('line', async () => {
  let data: string | null = null
  const writer = (line: string) => (data = line)

  const sender = factory.line(writer)
  await sender({ type: 'foo', text: 'hello' })
  expect(data).not.toBeNull()
})

it('demux', async () => {
  const data: Array<string | null> = [null, null]
  const writerA = (line: string) => (data[0] = line)
  const writerB = (line: string) => (data[1] = line)

  const sender = factory.demux([factory.line(writerA), factory.line(writerB)])
  await sender({ type: 'foo', text: 'hello' })
  expect(data[0]).not.toBeNull()
  expect(data[1]).not.toBeNull()
})
