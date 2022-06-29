import { adaptMiddleware } from '@/main/adapters'
import { makeAuthMiddleware } from '@/main/factories/auth-middleware'

export const auth = adaptMiddleware(makeAuthMiddleware())
