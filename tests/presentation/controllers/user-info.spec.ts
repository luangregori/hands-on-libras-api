import faker from 'faker'
import { UserInfoController } from '@/presentation/controllers'
import { ok, serverError } from '@/presentation/helpers/http-helper'
import { ServerError } from '@/presentation/errors'
import { LoadUserInfoSpy } from '@/tests/presentation/mocks'
import { throwError } from '@/tests/domain/mocks'

interface SutTypes {
  sut: UserInfoController
  loadUserInfoSPy: LoadUserInfoSpy
}

const makeSut = (): SutTypes => {
  const loadUserInfoSPy = new LoadUserInfoSpy()
  const sut = new UserInfoController(loadUserInfoSPy)
  return {
    sut,
    loadUserInfoSPy
  }
}

const mockRequest = (): UserInfoController.Request => ({
  accountId: faker.datatype.uuid()
})

describe('User Info Controller', () => {
  test('Should call LoadUserInfo with correct valuesS', async () => {
    const { sut, loadUserInfoSPy } = makeSut()
    const loadSpy = jest.spyOn(loadUserInfoSPy, 'load')
    const request = mockRequest()
    await sut.handle(request)
    expect(loadSpy).toHaveBeenCalledWith(request.accountId)
  })

  test('Should return 500 if LoadUserInfo throws', async () => {
    const { sut, loadUserInfoSPy } = makeSut()
    jest.spyOn(loadUserInfoSPy, 'load').mockImplementationOnce(throwError)
    const httpResponse = await sut.handle(mockRequest())
    expect(httpResponse).toEqual(serverError(new ServerError(null)))
  })

  test('Should return 200 if valid data is provided', async () => {
    const { sut, loadUserInfoSPy } = makeSut()
    const httpResponse = await sut.handle(mockRequest())
    expect(httpResponse).toEqual(ok(loadUserInfoSPy.result))
  })
})
