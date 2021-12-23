export class ServerError extends Error {
  constructor () {
    super('Internar server error')
    this.name = 'ServerError'
  }
}
