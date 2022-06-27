import { JwtAdapter } from '../../infra/criptography/jwt-adapter'
import { Middleware } from '../../presentation/protocols'
import { AuthUser } from '../../data/usecases/auth-user/auth-user-by-token'
import { AuthMiddleware } from '../../presentation/middlewares/auth-middleware'
import env from '../config/env'

export const makeAuthMiddleware = (): Middleware => {
  const jwtAdapter = new JwtAdapter(env.jwtSecret)
  const authUserByToken = new AuthUser(jwtAdapter)
  return new AuthMiddleware(authUserByToken)
}
