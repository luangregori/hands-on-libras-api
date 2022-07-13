export interface Encrypter {
  encrypt: (payload: any, expiresIn: number) => Promise<string>
  verify: (token: string) => Promise<Encrypter.Payload>
}

export namespace Encrypter {
  export interface Payload {
    id: string
    email: string
    iat: number
    exp: number
  }
}
