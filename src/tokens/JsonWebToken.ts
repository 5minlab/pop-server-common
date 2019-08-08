import jwt from 'jsonwebtoken'

type Secret = string | Buffer

export class JsonWebToken {
  private readonly secret: Secret

  constructor(secret: Secret) {
    this.secret = secret
  }

  public async verify(token: string) {
    return new Promise<object | string>((resolve, reject) => {
      jwt.verify(token, this.secret, (err, decoded) => {
        if (err) {
          reject(err)
        } else {
          resolve(decoded)
        }
      })
    })
  }

  public async decode(token: string) {
    return jwt.decode(token)
  }

  public async sign(payload: string | object) {
    return jwt.sign(payload, this.secret)
  }
}
