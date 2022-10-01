import faker from 'faker'
import { UserInfoController } from '@/presentation/controllers'
import { ok, serverError } from '@/presentation/helpers/http-helper'
import { ServerError } from '@/presentation/errors'
import { LoadUserInfoSpy, LoadUserScoreSpy } from '@/tests/presentation/mocks'
import { throwError } from '@/tests/domain/mocks'

interface SutTypes {
  sut: UserInfoController
  loadUserInfoSpy: LoadUserInfoSpy
  loadUserScoreSpy: LoadUserScoreSpy
}

const makeSut = (): SutTypes => {
  const loadUserInfoSpy = new LoadUserInfoSpy()
  const loadUserScoreSpy = new LoadUserScoreSpy()
  const sut = new UserInfoController(loadUserInfoSpy, loadUserScoreSpy)
  return {
    sut,
    loadUserInfoSpy,
    loadUserScoreSpy
  }
}

const mockRequest = (): UserInfoController.Request => ({
  accountId: faker.datatype.uuid()
})

describe('User Info Controller', () => {
  test('Should call LoadUserInfo with correct valuesS', async () => {
    const { sut, loadUserInfoSpy } = makeSut()
    const loadSpy = jest.spyOn(loadUserInfoSpy, 'load')
    const request = mockRequest()
    await sut.handle(request)
    expect(loadSpy).toHaveBeenCalledWith(request.accountId)
  })

  test('Should return 500 if LoadUserInfo throws', async () => {
    const { sut, loadUserInfoSpy } = makeSut()
    jest.spyOn(loadUserInfoSpy, 'load').mockImplementationOnce(throwError)
    const httpResponse = await sut.handle(mockRequest())
    expect(httpResponse).toEqual(serverError(new ServerError(null)))
  })

  test('Should return 200 if valid data is provided', async () => {
    const { sut, loadUserInfoSpy, loadUserScoreSpy } = makeSut()
    const httpResponse = await sut.handle(mockRequest())
    expect(httpResponse).toEqual(ok({
      userInfo: loadUserInfoSpy.result,
      userScore: loadUserScoreSpy.result
    }))
  })
})
