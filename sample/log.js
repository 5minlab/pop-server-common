const winston = require('winston');
const winstonDaily = require('winston-daily-rotate-file');
const winstonElasticsearch = require('winston-elasticsearch');
const mylogger = require('../dist/lib/loggers');

const { format } = winston;
const { combine, timestamp, label, printf } = format;
const { TransportOptionFactory } = mylogger;

const factory = new TransportOptionFactory();

const loggerJson = winston.createLogger({
  level: 'info',
  format: format.combine(
    format.timestamp(),
    format.json(),
  ),
  // format: winston.format.json(),
  defaultMeta: { service: 'sample' },
  transports: [
    new winstonDaily(factory.daily({
      filename: 'json-%DATE%.log',
    })),
    new winstonElasticsearch(factory.es({
      indexPrefix: 'sample-json',
    })),
  ],
  exceptionHandlers: [
    new winston.transports.File(factory.file({
      filename: 'exception-json.log',
      handleExceptions: true,
    })),
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
    new winstonDaily(factory.daily({
      filename: 'line-%DATE%.log',
    })),
    new winstonElasticsearch(factory.es({
      indexPrefix: 'sample-line',
    })),
  ],
  exceptionHandlers: [
    new winston.transports.File(factory.file({
      filename: 'exception-line.log',
      handleExceptions: true,
    })),
  ],
})

if (process.env.NODE_ENV !== 'production') {
  const opts = factory.console({
    handleExceptions: true,
  });
  loggerJson.add(new winston.transports.Console(opts));
  loggerLine.add(new winston.transports.Console(opts));
}

loggerJson.info('sample-json', {
  ty: 'foo',
  num: `${Math.floor(Math.random() * 1000)}`,
});
loggerLine.info('this is sample line');

try {
  throw new Error('sample error');
} catch (err) {
  // TODO
}

throw new Error('sample uncatched error');
