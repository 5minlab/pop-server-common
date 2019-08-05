import fse from 'fs-extra'
import path from 'path'
import faker from 'faker'
import { LogSenderFactory } from '../../src/pop-server-common'

const cat = faker.random.alphaNumeric(8)
const logpath = path.resolve(__dirname, `log-${cat}`)

beforeAll(async () => {
  await fse.mkdir(logpath)
})

afterAll(async () => {
  await fse.remove(logpath)
})

const factory = new LogSenderFactory(cat)

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
