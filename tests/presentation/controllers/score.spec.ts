import faker from 'faker'
import { ScoreController } from '@/presentation/controllers'
import { ok, serverError } from '@/presentation/helpers/http-helper'
import { ServerError } from '@/presentation/errors'
import { LoadUserScoreSpy } from '@/tests/presentation/mocks'
import { throwError } from '@/tests/domain/mocks'

interface SutTypes {
  sut: ScoreController
  loadUserScoreSpy: LoadUserScoreSpy
}

const makeSut = (): SutTypes => {
  const loadUserScoreSpy = new LoadUserScoreSpy()
  const sut = new ScoreController(loadUserScoreSpy)
  return {
    sut,
    loadUserScoreSpy
  }
}

const mockRequest = (): ScoreController.Request => ({
  accountId: faker.datatype.uuid()
})

describe('Score Controller', () => {
  test('Should call LoadUserScore', async () => {
    const { sut, loadUserScoreSpy } = makeSut()
    const loadSpy = jest.spyOn(loadUserScoreSpy, 'load')
    const request = mockRequest()
    await sut.handle(request)
    expect(loadSpy).toHaveBeenCalledWith(request.accountId)
  })

  test('Should return 500 if LoadUserScore throws', async () => {
    const { sut, loadUserScoreSpy } = makeSut()
    jest.spyOn(loadUserScoreSpy, 'load').mockImplementationOnce(throwError)
    const httpResponse = await sut.handle(mockRequest())
    expect(httpResponse).toEqual(serverError(new ServerError(null)))
  })

  test('Should return 200 if load score successfully', async () => {
    const { sut, loadUserScoreSpy } = makeSut()
    const httpResponse = await sut.handle(mockRequest())
    expect(httpResponse).toEqual(ok(loadUserScoreSpy.result))
  })
})
