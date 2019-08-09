import { TransportOptionFactory } from '../../src/loggers/winston'

describe('TransportOptionFactory', () => {
  const factory = new TransportOptionFactory()
  it('ok', () => {
    factory.console({})
    factory.es({})
    factory.daily({})
    factory.file({})
  })
})
