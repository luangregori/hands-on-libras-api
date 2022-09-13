import { DbLoadUserScore } from '@/data/usecases'
import { LoadTestResultsRepository } from '@/data/protocols'
import { StatusTestResult, TestResultModel } from '@/domain/models'

interface SutTypes {
  sut: DbLoadUserScore
  loadTestResultsRepositoryStub: LoadTestResultsRepository
}

const makeSut = (): SutTypes => {
  const loadTestResultsRepositoryStub = makeLoadTestResultsRepositoryStub()
  const sut = new DbLoadUserScore(loadTestResultsRepositoryStub)
  return {
    sut,
    loadTestResultsRepositoryStub
  }
}

const makeLoadTestResultsRepositoryStub = (): LoadTestResultsRepository => {
  class LoadTestResultsRepositoryStub implements LoadTestResultsRepository {
    async findByAccountId (accountId: string): Promise<any[]> {
      return await Promise.resolve([makeFakeTestResultModel()])
    }

    async findOrCreate (accountId: string, challengeId: string): Promise<any> {
      throw new Error('Method not implemented.')
    }

    async findByDate (date: Date): Promise<any[]> {
      throw new Error('Method not implemented.')
    }
  }
  return new LoadTestResultsRepositoryStub()
}

const makeFakeTestResultModel = (): TestResultModel => ({
  id: 'any_id',
  accountId: 'any_account_id',
  challengeId: 'any_challenge_id',
  status: StatusTestResult.COMPLETED,
  score: 100,
  updatedAt: new Date()
})

describe('DbLoadUserScore UseCase', () => {
  test('Should call LoadTestResultsRepository', async () => {
    const { sut, loadTestResultsRepositoryStub } = makeSut()
    const findSpy = jest.spyOn(loadTestResultsRepositoryStub, 'findByAccountId')
    await sut.load('any_account_id')
    expect(findSpy).toHaveBeenCalledWith('any_account_id')
  })

  test('Should throws if LoadTestResultsRepository throws', async () => {
    const { sut, loadTestResultsRepositoryStub } = makeSut()
    jest.spyOn(loadTestResultsRepositoryStub, 'findByAccountId').mockReturnValueOnce(Promise.reject(new Error()))
    const promise = sut.load('any_account_id')
    await expect(promise).rejects.toThrow()
  })

  test('Should return the sum of the score', async () => {
    const { sut } = makeSut()
    const sum = await sut.load('any_account_id')
    expect(sum).toEqual(100)
  })
})
