import { ScoreController } from '@/presentation/controllers'
import { LoadUserScore } from '@/domain/usecases'
import { ok, serverError } from '@/presentation/helpers/http-helper'
import { ServerError } from '@/presentation/errors'

interface SutTypes {
  sut: ScoreController
  loadUserScoreStub: LoadUserScore
}

const makeSut = (): SutTypes => {
  const loadUserScoreStub = makeLoadUserScoreStub()
  const sut = new ScoreController(loadUserScoreStub)
  return {
    sut,
    loadUserScoreStub
  }
}

const makeLoadUserScoreStub = (): LoadUserScore => {
  class LoadUserScoreStub implements LoadUserScore {
    async load (): Promise<number> {
      return await Promise.resolve(1000)
    }
  }
  return new LoadUserScoreStub()
}

const makeFakeRequest = (): any => ({
  accountId: 'any_account_id'
})

describe('Score Controller', () => {
  test('Should call LoadUserScore', async () => {
    const { sut, loadUserScoreStub } = makeSut()
    const loadSpy = jest.spyOn(loadUserScoreStub, 'load')
    await sut.handle(makeFakeRequest())
    expect(loadSpy).toHaveBeenCalledWith('any_account_id')
  })

  test('Should return 500 if LoadUserScore throws', async () => {
    const { sut, loadUserScoreStub } = makeSut()
    jest.spyOn(loadUserScoreStub, 'load').mockImplementationOnce(() => {
      throw new Error()
    })
    const httpResponse = await sut.handle(makeFakeRequest())
    expect(httpResponse).toEqual(serverError(new ServerError(null)))
  })

  test('Should return 200 if load score successfully', async () => {
    const { sut } = makeSut()
    const httpResponse = await sut.handle(makeFakeRequest())
    expect(httpResponse).toEqual(ok(1000))
  })
})
