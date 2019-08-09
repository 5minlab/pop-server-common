const winston = require('winston');
const winstonDaily = require('winston-daily-rotate-file');
const mylogger = require('../dist/lib/loggers');

const { format } = winston;
const { combine, timestamp, label, printf } = format;
const { TransportOptionFactory, TransportFactory } = mylogger;

const optionFactory = new TransportOptionFactory();
const factory = new TransportFactory();

const loggerJson = winston.createLogger({
  level: 'info',
  format: format.combine(
    format.timestamp(),
    format.json(),
  ),
  // format: winston.format.json(),
  defaultMeta: { service: 'sample' },
  transports: [
    new winstonDaily(optionFactory.daily({
      filename: 'json-%DATE%.log',
    })),
    factory.es({
      indexPrefix: 'sample-json',
    }),
  ],
  exceptionHandlers: [
    factory.file({
      filename: 'exception-json.log',
      handleExceptions: true,
    }),
  ],
});


const myFormat = printf(({ level, message, label, timestamp }) => {
  return `${timestamp} [${label}] ${level}: ${message}`;
});

const loggerLine = winston.createLogger({
  level: 'info',
  format: combine(
    // format.colorize(),
    label({ label: 'line' }),
    timestamp(),
    myFormat
  ),
  defaultMeta: { service: 'sample' },
  transports: [
    new winstonDaily(optionFactory.daily({
      filename: 'line-%DATE%.log',
    })),
    factory.es({
      indexPrefix: 'sample-line',
    }),
  ],
  exceptionHandlers: [
    factory.file({
      filename: 'exception-line.log',
      handleExceptions: true,
    }),
  ],
})

if (process.env.NODE_ENV !== 'production') {
  const opts = {
    handleExceptions: true,
  };
  loggerJson.add(factory.console(opts));
  loggerLine.add(factory.console(opts));
}

loggerJson.info('sample-json', {
  ty: 'foo',
  num: `${Math.floor(Math.random() * 1000)}`,
});
loggerLine.info('this is sample line');

throw new Error('sample error');
