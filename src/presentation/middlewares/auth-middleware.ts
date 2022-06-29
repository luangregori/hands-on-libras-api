import { AccessDeniedError } from '@/presentation/errors'
import { forbidden, ok, serverError } from '@/presentation/helpers/http-helper'
import { Middleware, HttpResponse } from '@/presentation/protocols'
import { AuthUserByToken } from '@/domain/usecases/auth-user-by-token'

export class AuthMiddleware implements Middleware {
  constructor (
    private readonly authUserByToken: AuthUserByToken
  ) {}

  async handle (request: AuthMiddleware.Request): Promise<HttpResponse> {
    try {
      const { accessToken } = request
      if (accessToken) {
        const accountId = await this.authUserByToken.auth(accessToken)
        if (accountId) {
          return ok({ accountId: accountId.id })
        }
      }
      return forbidden(new AccessDeniedError())
    } catch (error) {
      return serverError(error)
    }
  }
}

export namespace AuthMiddleware {
  export interface Request {
    accessToken?: string
  }
}
