import { adaptMiddleware } from '../adapters'
import { makeAuthMiddleware } from '../factories/auth-middleware'

export const auth = adaptMiddleware(makeAuthMiddleware())
