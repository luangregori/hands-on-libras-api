import { ScoreController } from '@/presentation/controllers'
import { LoadAccountScore } from '@/domain/usecases'
import { ok, serverError } from '@/presentation/helpers/http-helper'
import { ServerError } from '@/presentation/errors'

interface SutTypes {
  sut: ScoreController
  loadAccountScoreStub: LoadAccountScore
}

const makeSut = (): SutTypes => {
  const loadAccountScoreStub = makeLoadAccountScoreStub()
  const sut = new ScoreController(loadAccountScoreStub)
  return {
    sut,
    loadAccountScoreStub
  }
}

const makeLoadAccountScoreStub = (): LoadAccountScore => {
  class LoadAccountScoreStub implements LoadAccountScore {
    async load (): Promise<number> {
      return await Promise.resolve(1000)
    }
  }
  return new LoadAccountScoreStub()
}

const makeFakeRequest = (): any => ({
  accountId: 'any_account_id'
})

describe('Score Controller', () => {
  test('Should call LoadAccountScore', async () => {
    const { sut, loadAccountScoreStub } = makeSut()
    const loadSpy = jest.spyOn(loadAccountScoreStub, 'load')
    await sut.handle(makeFakeRequest())
    expect(loadSpy).toHaveBeenCalledWith('any_account_id')
  })

  test('Should return 500 if LoadAccountScore throws', async () => {
    const { sut, loadAccountScoreStub } = makeSut()
    jest.spyOn(loadAccountScoreStub, 'load').mockImplementationOnce(() => {
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
