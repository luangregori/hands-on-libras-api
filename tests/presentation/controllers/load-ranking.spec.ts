import { LoadRankingController } from '@/presentation/controllers'
import { LoadRanking } from '@/domain/usecases'
import { MissingParamError, ServerError } from '@/presentation/errors'
import { badRequest, ok, serverError } from '@/presentation/helpers/http-helper'

interface SutTypes {
  sut: LoadRankingController
  loadRankingStub: LoadRanking
}

const makeSut = (): SutTypes => {
  const loadRankingStub = makeLoadRankingStub()
  const sut = new LoadRankingController(loadRankingStub)
  return {
    sut,
    loadRankingStub
  }
}

const makeLoadRankingStub = (): LoadRanking => {
  class LoadRankingStub implements LoadRanking {
    async load (params: LoadRanking.Params): Promise<any[]> {
      return await new Promise(resolve => resolve([makeFakeRanking()]))
    }
  }
  return new LoadRankingStub()
}

const makeFakeRanking = (): any => ({
  position: 0,
  name: 'any_name',
  score: 100
})

const makeFakeRequest = (): LoadRankingController.Request => ({
  accountId: 'valid_account_id',
  days: 7
})

describe('LoadRanking Controller', () => {
  test('Should return 400 if no days is provided', async () => {
    const { sut } = makeSut()
    const request = {
      days: null,
      accountId: 'valid_account_id'
    }
    const httpResponse = await sut.handle(request)
    expect(httpResponse).toEqual(badRequest(new MissingParamError('days')))
  })

  test('Should call LoadC=Ranking UseCase with correct values', async () => {
    const { sut, loadRankingStub } = makeSut()
    const loadSpy = jest.spyOn(loadRankingStub, 'load')
    await sut.handle(makeFakeRequest())
    expect(loadSpy).toHaveBeenCalledWith({
      accountId: 'valid_account_id',
      days: 7
    })
  })

  test('Should return 500 if LoadRanking UseCase throws', async () => {
    const { sut, loadRankingStub } = makeSut()
    jest.spyOn(loadRankingStub, 'load').mockImplementationOnce(() => {
      throw new Error()
    })
    const httpResponse = await sut.handle(makeFakeRequest())
    expect(httpResponse).toEqual(serverError(new ServerError(null)))
  })

  test('Should return 200 if valid data is provided', async () => {
    const { sut } = makeSut()
    const httpResponse = await sut.handle(makeFakeRequest())
    expect(httpResponse).toEqual(ok([makeFakeRanking()]))
  })
})
