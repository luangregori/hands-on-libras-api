export class EmailAlreadyRegisteredError extends Error {
  constructor () {
    super('This email is already registered')
    this.name = 'EmailAlreadyRegisteredError'
  }
}
