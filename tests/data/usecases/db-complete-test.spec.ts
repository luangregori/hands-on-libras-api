import { DbCompleteTest } from '@/data/usecases'
import { LoadTestResultsRepository, UpdateTestResultRepository } from '@/data/protocols'
import { StatusTestResult, TestResultModel } from '@/domain/models'
import { CompleteTest } from '@/domain/usecases'

interface SutTypes {
  sut: DbCompleteTest
  loadTestResultsRepositoryStub: LoadTestResultsRepository
  updateTestResultRepositoryStub: UpdateTestResultRepository
}

const makeSut = (): SutTypes => {
  const updateTestResultRepositoryStub = makeUpdateTestResultRepositoryStub()
  const loadTestResultsRepositoryStub = makeLoadTestResultsRepositoryStub()
  const sut = new DbCompleteTest(loadTestResultsRepositoryStub, updateTestResultRepositoryStub)
  return {
    sut,
    loadTestResultsRepositoryStub,
    updateTestResultRepositoryStub
  }
}

const makeLoadTestResultsRepositoryStub = (): LoadTestResultsRepository => {
  class LoadTestResultsRepositoryStub implements LoadTestResultsRepository {
    async findOrCreate (accountId: string, challengeId: string): Promise<TestResultModel> {
      return await new Promise(resolve => resolve(makeFakeTestResultModel()))
    }

    async findByDate (date: Date): Promise<TestResultModel[]> {
      throw new Error('Method not implemented.')
    }

    async findByAccountId (accountId: string): Promise<TestResultModel[]> {
      throw new Error('Method not implemented.')
    }
  }
  return new LoadTestResultsRepositoryStub()
}

const makeUpdateTestResultRepositoryStub = (): UpdateTestResultRepository => {
  class UpdateTestResultRepositoryStub implements UpdateTestResultRepository {
    async update (testResultToUpdate: any): Promise<TestResultModel> {
      return await Promise.resolve(makeFakeTestResultModel())
    }
  }
  return new UpdateTestResultRepositoryStub()
}

const makeFakeTestResultModel = (status = StatusTestResult.TESTED): TestResultModel => ({
  id: 'any_id',
  accountId: 'any_account_id',
  challengeId: 'any_challenge_id',
  status,
  score: 10,
  updatedAt: new Date()
})

const makeFakeCompleteLearnParams = (lives = 3): CompleteTest.Params => ({
  accountId: 'valid_account_id',
  challengeId: 'valid_challenge_id',
  lives
})

const fakeDate = new Date(2022, 6, 9)

describe('Complete Learn UseCase', () => {
  beforeAll(() => {
    jest.useFakeTimers('modern').setSystemTime(fakeDate)
  })

  test('Should not call UpdateTestResultRepositoryStub if STATUS == COMPLETED', async () => {
    const { sut, loadTestResultsRepositoryStub, updateTestResultRepositoryStub } = makeSut()
    const updateSpy = jest.spyOn(updateTestResultRepositoryStub, 'update')
    jest.spyOn(loadTestResultsRepositoryStub, 'findOrCreate').mockReturnValueOnce(Promise.resolve(makeFakeTestResultModel(StatusTestResult.COMPLETED)))
    await sut.complete(makeFakeCompleteLearnParams())
    expect(updateSpy).toHaveBeenCalledTimes(0)
  })

  test('Should call LoadTestResultsRepositoryStub with correct values', async () => {
    const { sut, loadTestResultsRepositoryStub } = makeSut()
    const findSpy = jest.spyOn(loadTestResultsRepositoryStub, 'findOrCreate')
    await sut.complete(makeFakeCompleteLearnParams())
    expect(findSpy).toHaveBeenCalledWith('valid_account_id', 'valid_challenge_id')
  })

  test('Should call UpdateTestResultRepositoryStub if STATUS = TESTED and lives = 0', async () => {
    const { sut, updateTestResultRepositoryStub } = makeSut()
    const updateSpy = jest.spyOn(updateTestResultRepositoryStub, 'update')
    await sut.complete(makeFakeCompleteLearnParams(0))
    expect(updateSpy).toHaveBeenCalledWith('valid_account_id', 'valid_challenge_id', {
      accountId: 'any_account_id',
      challengeId: 'any_challenge_id',
      id: 'any_id',
      score: 10,
      status: 'learned',
      updatedAt: fakeDate
    })
  })

  test('Should call UpdateTestResultRepositoryStub if STATUS = TESTED and lives = 3', async () => {
    const { sut, updateTestResultRepositoryStub } = makeSut()
    const updateSpy = jest.spyOn(updateTestResultRepositoryStub, 'update')
    await sut.complete(makeFakeCompleteLearnParams())
    expect(updateSpy).toHaveBeenCalledWith('valid_account_id', 'valid_challenge_id', {
      accountId: 'any_account_id',
      challengeId: 'any_challenge_id',
      id: 'any_id',
      score: 100,
      status: 'completed',
      updatedAt: fakeDate
    })
  })

  test('Should call UpdateTestResultRepositoryStub if STATUS = TESTED and lives != 0|3', async () => {
    const { sut, updateTestResultRepositoryStub } = makeSut()
    const updateSpy = jest.spyOn(updateTestResultRepositoryStub, 'update')
    await sut.complete(makeFakeCompleteLearnParams(2))
    expect(updateSpy).toHaveBeenCalledWith('valid_account_id', 'valid_challenge_id', {
      accountId: 'any_account_id',
      challengeId: 'any_challenge_id',
      id: 'any_id',
      score: 70,
      status: 'tested',
      updatedAt: fakeDate
    })
  })

  test('Should throws if UpdateTestResultRepositoryStub throws', async () => {
    const { sut, updateTestResultRepositoryStub } = makeSut()
    jest.spyOn(updateTestResultRepositoryStub, 'update').mockReturnValueOnce(Promise.reject(new Error()))
    const promise = sut.complete(makeFakeCompleteLearnParams())
    await expect(promise).rejects.toThrow()
  })

  test('Should throws if LoadTestResultsRepositoryStub throws', async () => {
    const { sut, loadTestResultsRepositoryStub } = makeSut()
    jest.spyOn(loadTestResultsRepositoryStub, 'findOrCreate').mockReturnValueOnce(Promise.reject(new Error()))
    const promise = sut.complete(makeFakeCompleteLearnParams())
    await expect(promise).rejects.toThrow()
  })

  test('Should return the infos', async () => {
    const { sut } = makeSut()
    const result = await sut.complete(makeFakeCompleteLearnParams())
    expect(result).toBeTruthy()
  })
})
