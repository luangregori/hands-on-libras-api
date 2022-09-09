import { DbLoadRanking } from '@/data/usecases'
import { LoadTestResultsRepository } from '@/data/protocols'
import { StatusTestResult, TestResultModel } from '@/domain/models'
import { LoadRanking } from '@/domain/usecases'

const makeLoadTestResultsRepositoryStub = (): LoadTestResultsRepository => {
  class LoadTestResultsRepositoryStub implements LoadTestResultsRepository {
    async findByDate (accountId: string, date: Date): Promise<TestResultModel[]> {
      return await new Promise(resolve => resolve([makeFakeTestResultModel(), makeFakeTestResultModel()]))
    }

    async findOrCreate (accountId: string, challengeId: string): Promise<TestResultModel> {
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
  score: Math.floor(Math.random() * 1000) + 1,
  updatedAt: new Date()
})

interface SutTypes{
  sut: DbLoadRanking
  loadTestResultsRepositoryStub: LoadTestResultsRepository
}

const makeSut = (): SutTypes => {
  const loadTestResultsRepositoryStub = makeLoadTestResultsRepositoryStub()
  const sut = new DbLoadRanking(loadTestResultsRepositoryStub)
  return {
    sut,
    loadTestResultsRepositoryStub
  }
}

const makeFakeParams = (): LoadRanking.Params => ({
  accountId: 'any_account_id',
  days: 1
})

describe('DbLoadRanking UseCase', () => {
  test('Should call LoadTestResultsRepository with correct values', async () => {
    const { sut, loadTestResultsRepositoryStub } = makeSut()
    const findSpy = jest.spyOn(loadTestResultsRepositoryStub, 'findByDate')
    await sut.load(makeFakeParams())
    expect(findSpy).toHaveBeenCalledTimes(1)
  })

  test('Should throws if LoadTestResultsRepository throws', async () => {
    const { sut, loadTestResultsRepositoryStub } = makeSut()
    jest.spyOn(loadTestResultsRepositoryStub, 'findByDate').mockReturnValueOnce(Promise.reject(new Error()))
    const promise = sut.load(makeFakeParams())
    await expect(promise).rejects.toThrow()
  })

  test('Should return the ranking sorted by score', async () => {
    const { sut } = makeSut()
    const ranking = await sut.load(makeFakeParams())
    expect(ranking[0].position).toBeLessThan(ranking[1].position)
    expect(ranking[0].score).toBeGreaterThan(ranking[1].score)
    expect(ranking[0].name).toBeDefined()
    expect(ranking[1].name).toBeDefined()
  })
})
