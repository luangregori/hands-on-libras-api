import { AuthUserByToken } from '../../domain/usecases/auth-user-by-token'
import { AccessDeniedError } from '../errors'
import { forbidden, ok, serverError } from '../helpers/http-helper'
import { AuthMiddleware } from './auth-middleware'

interface SutTypes{
  sut: AuthMiddleware
  authUserByTokenStub: AuthUserByToken
}

const makeAuthUserByTokenStub = (): AuthUserByToken => {
  class AuthUserByTokenStub implements AuthUserByToken {
    async auth (accesToken: string): Promise<AuthUserByToken.Result> {
      return await Promise.resolve({ id: 'any_id' })
    }
  }
  return new AuthUserByTokenStub()
}

const makeSut = (): SutTypes => {
  const authUserByTokenStub = makeAuthUserByTokenStub()
  const sut = new AuthMiddleware(authUserByTokenStub)
  return {
    sut,
    authUserByTokenStub
  }
}

const mockRequest = (): AuthMiddleware.Request => ({
  accessToken: 'any_token'
})

describe('Auth Middleware', () => {
  test('Should return 403 if no x-access-token exists in headers', async () => {
    const { sut } = makeSut()
    const httpResponse = await sut.handle({})
    expect(httpResponse).toEqual(forbidden(new AccessDeniedError()))
  })

  test('Should call AuthUserByToken with correct accessToken', async () => {
    const { sut, authUserByTokenStub } = makeSut()
    const authSpy = jest.spyOn(authUserByTokenStub, 'auth')
    const httpRequest = mockRequest()
    await sut.handle(mockRequest())
    expect(authSpy).toHaveBeenCalledWith(httpRequest.accessToken)
  })

  test('Should return 403 if AuthUserByToken returns null', async () => {
    const { sut, authUserByTokenStub } = makeSut()
    jest.spyOn(authUserByTokenStub, 'auth').mockReturnValueOnce(Promise.resolve(null))
    const httpResponse = await sut.handle(mockRequest())
    expect(httpResponse).toEqual(forbidden(new AccessDeniedError()))
  })

  test('Should return 500 if AuthUserByToken throws', async () => {
    const { sut, authUserByTokenStub } = makeSut()
    jest.spyOn(authUserByTokenStub, 'auth').mockReturnValueOnce(Promise.reject(new Error()))
    const httpResponse = await sut.handle(mockRequest())
    expect(httpResponse).toEqual(serverError(new Error()))
  })

  test('Should return 200 if AuthUserByToken returns an account Id', async () => {
    const { sut } = makeSut()
    const httpResponse = await sut.handle(mockRequest())
    expect(httpResponse).toEqual(ok({
      accountId: 'any_id'
    }))
  })
})
