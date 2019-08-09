import { format } from 'winston'

// https://github.com/winstonjs/winston/issues/1338#issuecomment-403289827
export const enumerateErrorFormat = format((info: any) => {
  if (info.message instanceof Error) {
    info.message = Object.assign(
      {
        message: info.message.message,
        stack: info.message.stack
      },
      info.message
    )
  }

  if (info instanceof Error) {
    return Object.assign(
      {
        message: info.message,
        stack: info.stack
      },
      info
    )
  }

  return info
})

export const winstonFormats = {
  enumerateErrorFormat
}
