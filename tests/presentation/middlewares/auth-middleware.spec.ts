import faker from 'faker'
import { AuthMiddleware } from '@/presentation/middlewares/auth-middleware'
import { AccessDeniedError } from '@/presentation/errors'
import { forbidden, ok, serverError } from '@/presentation/helpers/http-helper'
import { AuthUserByTokenSpy } from '@/tests/presentation/mocks'

interface SutTypes{
  sut: AuthMiddleware
  authUserByTokenSpy: AuthUserByTokenSpy
}

const makeSut = (): SutTypes => {
  const authUserByTokenSpy = new AuthUserByTokenSpy()
  const sut = new AuthMiddleware(authUserByTokenSpy)
  return {
    sut,
    authUserByTokenSpy
  }
}

const mockRequest = (): AuthMiddleware.Request => ({
  accessToken: faker.datatype.uuid()
})

describe('Auth Middleware', () => {
  test('Should return 403 if no x-access-token exists in headers', async () => {
    const { sut } = makeSut()
    const httpResponse = await sut.handle({})
    expect(httpResponse).toEqual(forbidden(new AccessDeniedError()))
  })

  test('Should call AuthUserByToken with correct accessToken', async () => {
    const { sut, authUserByTokenSpy } = makeSut()
    const authSpy = jest.spyOn(authUserByTokenSpy, 'auth')
    const request = mockRequest()
    await sut.handle(request)
    expect(authSpy).toHaveBeenCalledWith(request.accessToken)
  })

  test('Should return 403 if AuthUserByToken returns null', async () => {
    const { sut, authUserByTokenSpy } = makeSut()
    jest.spyOn(authUserByTokenSpy, 'auth').mockReturnValueOnce(Promise.resolve(null))
    const httpResponse = await sut.handle(mockRequest())
    expect(httpResponse).toEqual(forbidden(new AccessDeniedError()))
  })

  test('Should return 500 if AuthUserByToken throws', async () => {
    const { sut, authUserByTokenSpy } = makeSut()
    jest.spyOn(authUserByTokenSpy, 'auth').mockReturnValueOnce(Promise.reject(new Error()))
    const httpResponse = await sut.handle(mockRequest())
    expect(httpResponse).toEqual(serverError(new Error()))
  })

  test('Should return 200 if AuthUserByToken returns an account Id', async () => {
    const { sut, authUserByTokenSpy } = makeSut()
    const httpResponse = await sut.handle(mockRequest())
    expect(httpResponse).toEqual(ok({ accountId: authUserByTokenSpy.result.id }))
  })
})
