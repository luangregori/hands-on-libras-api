export class ServerError extends Error {
  constructor (stack?: string) {
    super('Internar server error')
    this.name = 'ServerError'
    this.stack = stack
  }
}
