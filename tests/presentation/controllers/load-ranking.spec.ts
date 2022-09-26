import faker from 'faker'
import { LoadRankingController } from '@/presentation/controllers'
import { MissingParamError, ServerError } from '@/presentation/errors'
import { badRequest, ok, serverError } from '@/presentation/helpers/http-helper'
import { LoadRankingSpy } from '@/tests/presentation/mocks'
import { throwError } from '@/tests/domain/mocks'

interface SutTypes {
  sut: LoadRankingController
  loadRankingSpy: LoadRankingSpy
}

const makeSut = (): SutTypes => {
  const loadRankingSpy = new LoadRankingSpy()
  const sut = new LoadRankingController(loadRankingSpy)
  return {
    sut,
    loadRankingSpy
  }
}

const mockRequest = (): LoadRankingController.Request => ({
  accountId: faker.datatype.uuid(),
  days: faker.datatype.number()
})

describe('LoadRanking Controller', () => {
  test('Should return 400 if no days is provided', async () => {
    const { sut } = makeSut()
    const request = {
      days: null,
      accountId: faker.datatype.uuid()
    }
    const httpResponse = await sut.handle(request)
    expect(httpResponse).toEqual(badRequest(new MissingParamError('days')))
  })

  test('Should call LoadRanking UseCase with correct values', async () => {
    const { sut, loadRankingSpy } = makeSut()
    const loadSpy = jest.spyOn(loadRankingSpy, 'load')
    const request = mockRequest()
    await sut.handle(request)
    expect(loadSpy).toHaveBeenCalledWith({
      accountId: request.accountId,
      days: request.days
    })
  })

  test('Should return 500 if LoadRanking UseCase throws', async () => {
    const { sut, loadRankingSpy } = makeSut()
    jest.spyOn(loadRankingSpy, 'load').mockImplementationOnce(throwError)
    const httpResponse = await sut.handle(mockRequest())
    expect(httpResponse).toEqual(serverError(new ServerError(null)))
  })

  test('Should return 200 if valid data is provided', async () => {
    const { sut, loadRankingSpy } = makeSut()
    const httpResponse = await sut.handle(mockRequest())
    expect(httpResponse).toEqual(ok(loadRankingSpy.result))
  })
})
