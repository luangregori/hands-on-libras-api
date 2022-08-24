import env from '@/main/config/env'
import { JwtAdapter } from '@/infra/criptography/jwt-adapter'
import { Middleware } from '@/presentation/protocols'
import { AuthUser } from '@/data/usecases'
import { AuthMiddleware } from '@/presentation/middlewares'

export const makeAuthMiddleware = (): Middleware => {
  const jwtAdapter = new JwtAdapter(env.jwtSecret)
  const authUserByToken = new AuthUser(jwtAdapter)
  return new AuthMiddleware(authUserByToken)
}
