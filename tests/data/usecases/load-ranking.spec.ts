import { DbLoadRanking } from '@/data/usecases'
import { LoadTestResultsRepository, FindAccountRepository } from '@/data/protocols'
import { AccountModel, StatusTestResult, TestResultModel } from '@/domain/models'
import { LoadRanking } from '@/domain/usecases'

const makeLoadTestResultsRepositoryStub = (): LoadTestResultsRepository => {
  class LoadTestResultsRepositoryStub implements LoadTestResultsRepository {
    async findByDate (date: Date): Promise<TestResultModel[]> {
      return await new Promise(resolve => resolve([makeFakeTestResultModel(), makeFakeTestResultModel('another_id')]))
    }

    async findOrCreate (accountId: string, challengeId: string): Promise<TestResultModel> {
      throw new Error('Method not implemented.')
    }

    async findByAccountId (accountId: string): Promise<TestResultModel[]> {
      throw new Error('Method not implemented.')
    }
  }
  return new LoadTestResultsRepositoryStub()
}

const makeFindAccountRepositoryStub = (): FindAccountRepository => {
  class FindAccountRepositoryStub implements FindAccountRepository {
    async findById (accountId: string): Promise<AccountModel> {
      return await new Promise(resolve => resolve(makeFakeAccount()))
    }

    async findByEmail (email: string): Promise<AccountModel> {
      throw new Error('Method not implemented.')
    }
  }
  return new FindAccountRepositoryStub()
}

const makeFakeTestResultModel = (accountId: string = 'any_account_id'): TestResultModel => ({
  id: 'any_id',
  accountId,
  challengeId: 'any_challenge_id',
  status: StatusTestResult.COMPLETED,
  score: Math.floor(Math.random() * 1000) + 1,
  updatedAt: new Date()
})

const makeFakeAccount = (): AccountModel => ({
  id: 'any_account_id',
  name: 'any_name',
  email: 'any_email',
  password: 'any_password'
})

interface SutTypes {
  sut: DbLoadRanking
  loadTestResultsRepositoryStub: LoadTestResultsRepository
  findAccountRepositoryStub: FindAccountRepository
}

const makeSut = (): SutTypes => {
  const findAccountRepositoryStub = makeFindAccountRepositoryStub()
  const loadTestResultsRepositoryStub = makeLoadTestResultsRepositoryStub()
  const sut = new DbLoadRanking(loadTestResultsRepositoryStub, findAccountRepositoryStub)
  return {
    sut,
    loadTestResultsRepositoryStub,
    findAccountRepositoryStub
  }
}

const makeFakeParams = (): LoadRanking.Params => ({
  days: 1
})

describe('DbLoadRanking UseCase', () => {
  beforeAll(() => {
    jest.useFakeTimers('modern').setSystemTime(new Date(2022, 6, 10))
  })

  test('Should call LoadTestResultsRepository with correct values', async () => {
    const { sut, loadTestResultsRepositoryStub } = makeSut()
    const findSpy = jest.spyOn(loadTestResultsRepositoryStub, 'findByDate')
    await sut.load(makeFakeParams())
    expect(findSpy).toHaveBeenCalledWith(new Date(2022, 6, 9))
  })

  test('Should throws if LoadTestResultsRepository throws', async () => {
    const { sut, loadTestResultsRepositoryStub } = makeSut()
    jest.spyOn(loadTestResultsRepositoryStub, 'findByDate').mockReturnValueOnce(Promise.reject(new Error()))
    const promise = sut.load(makeFakeParams())
    await expect(promise).rejects.toThrow()
  })

  test('Should call FindAccountRepository with correct values', async () => {
    const { sut, findAccountRepositoryStub } = makeSut()
    const findSpy = jest.spyOn(findAccountRepositoryStub, 'findById')
    await sut.load(makeFakeParams())
    expect(findSpy).toHaveBeenCalledWith('any_account_id')
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
