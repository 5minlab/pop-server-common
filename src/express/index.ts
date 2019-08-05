import _ from 'lodash'
import { Request, RequestHandler } from 'express'
import createErrors from 'http-errors'

export const methodNotAllowedHandler: RequestHandler = (req, res) => {
  throw new createErrors.MethodNotAllowed()
}

// query같은 경우 key=string, value=string인걸 알지만
// express.Request에 있던 타입 그대로 갖다붙임
interface SimpleRequest {
  body: Request['body']
  query: Request['query']
  params: Request['params']
  // TODO files는 express-upload가 있을때만 유효
  // files: Request['files'];
}

// TODO T의 내부 타입을 보고 분기할수 있으면 좋겠다
// req.body가 string으로 들어와도 T에 number로 선언한것은 number가 되면 좋겠다
export const getRequestContext = <T>(req: SimpleRequest): T => {
  const list: Array<Request['body'] | Request['query'] | Request['params']> = []
  if (!_.isEmpty(req.body)) {
    list.push(req.body)
  }
  if (!_.isEmpty(req.query)) {
    list.push(req.query)
  }
  if (!_.isEmpty(req.params)) {
    list.push(req.params)
  }

  let body: { [P in keyof T]?: any } = {}
  for (const x of list) {
    body = { ...body, ...x }
  }

  return body as Required<T>
}
