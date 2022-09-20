import { DbTestChallenge } from '@/data/usecases'
import { UpdateTestResultRepository, LoadTestQuestionRepository, LoadTestResultsRepository } from '@/data/protocols'
import { StatusTestResult, TestQuestionModel, TestResultModel } from '@/domain/models'
import { TestChallenge } from '@/domain/usecases'

interface SutTypes {
  sut: DbTestChallenge
  loadTestResultsRepositoryStub: LoadTestResultsRepository
  updateTestResultRepositoryStub: UpdateTestResultRepository
  loadTestQuestionRepositoryStub: LoadTestQuestionRepository
}

const makeSut = (): SutTypes => {
  const loadTestResultsRepositoryStub = makeLoadTestResultsRepositoryStub()
  const updateTestResultRepositoryStub = makeUpdateTestResultRepositoryStub()
  const loadTestQuestionRepositoryStub = makeLoadTestQuestionRepositoryStub()
  const sut = new DbTestChallenge(loadTestResultsRepositoryStub, updateTestResultRepositoryStub, loadTestQuestionRepositoryStub)
  return {
    sut,
    loadTestResultsRepositoryStub,
    updateTestResultRepositoryStub,
    loadTestQuestionRepositoryStub
  }
}

const makeLoadTestResultsRepositoryStub = (): LoadTestResultsRepository => {
  class LoadTestResultsRepositoryStub implements LoadTestResultsRepository {
    async findOrCreate (accountId: string, challengeId: string): Promise<TestResultModel> {
      return await Promise.resolve(makeFakeTestResultModel())
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
    async update (accountId: string, challengeId: string, testResultToUpdate: any): Promise<TestResultModel> {
      return await Promise.resolve(makeFakeTestResultModel())
    }
  }
  return new UpdateTestResultRepositoryStub()
}

const makeLoadTestQuestionRepositoryStub = (): LoadTestQuestionRepository => {
  class LoadTestQuestionRepositoryStub implements LoadTestQuestionRepository {
    async findByChallengeId (challengeId: string): Promise<TestQuestionModel[]> {
      return await Promise.resolve(makeFakeTestQuestionModel())
    }
  }
  return new LoadTestQuestionRepositoryStub()
}

const makeFakeTestResultModel = (): TestResultModel => ({
  id: 'any_id',
  accountId: 'any_account_id',
  challengeId: 'any_challenge_id',
  status: StatusTestResult.LEARNED,
  score: 100,
  updatedAt: fakeDate
})

const makeFakeTestQuestionModel = (): TestQuestionModel[] => ([
  {
    id: 'any_id',
    word: 'any_word',
    challengeId: 'any_challenge_id',
    options: ['any_option_1', 'any_option_2', 'any_option_3', 'any_option_4']
  }
])

const makeFakeTestChallengeParams = (): TestChallenge.Params => ({
  accountId: 'any_account_id',
  challengeId: 'any_challenge_id'
})

const fakeDate = new Date(2022, 6, 9)

describe('Test Challenge UseCase', () => {
  beforeAll(() => {
    jest.useFakeTimers('modern').setSystemTime(fakeDate)
  })

  test('Should call LoadTestResultsRepository with correct values', async () => {
    const { sut, loadTestResultsRepositoryStub } = makeSut()
    const updateSpy = jest.spyOn(loadTestResultsRepositoryStub, 'findOrCreate')
    await sut.test(makeFakeTestChallengeParams())
    expect(updateSpy).toHaveBeenCalledWith('any_account_id', 'any_challenge_id')
  })

  test('Should call UpdateTestResultRepository with correct values', async () => {
    const { sut, updateTestResultRepositoryStub } = makeSut()
    const updateSpy = jest.spyOn(updateTestResultRepositoryStub, 'update')
    await sut.test(makeFakeTestChallengeParams())
    expect(updateSpy).toHaveBeenCalledWith('any_account_id', 'any_challenge_id', {
      accountId: 'any_account_id',
      challengeId: 'any_challenge_id',
      id: 'any_id',
      score: 100,
      status: 'tested',
      updatedAt: fakeDate
    })
  })

  test('Should not update the status if already completed', async () => {
    const { sut, loadTestResultsRepositoryStub, updateTestResultRepositoryStub } = makeSut()
    jest.spyOn(loadTestResultsRepositoryStub, 'findOrCreate').mockReturnValueOnce(Promise.resolve({
      id: 'any_id',
      accountId: 'any_account_id',
      challengeId: 'any_challenge_id',
      status: StatusTestResult.COMPLETED,
      score: 100,
      updatedAt: fakeDate
    }))
    const updateSpy = jest.spyOn(updateTestResultRepositoryStub, 'update')
    await sut.test(makeFakeTestChallengeParams())
    expect(updateSpy).toHaveBeenCalledWith('any_account_id', 'any_challenge_id', {
      accountId: 'any_account_id',
      challengeId: 'any_challenge_id',
      id: 'any_id',
      score: 100,
      status: 'completed',
      updatedAt: fakeDate
    })
  })

  test('Should throws if UpdateTestResultRepository throws', async () => {
    const { sut, updateTestResultRepositoryStub } = makeSut()
    jest.spyOn(updateTestResultRepositoryStub, 'update').mockReturnValueOnce(Promise.reject(new Error()))
    const promise = sut.test(makeFakeTestChallengeParams())
    await expect(promise).rejects.toThrow()
  })

  test('Should call LoadTestQuestionRepository with correct value', async () => {
    const { sut, loadTestQuestionRepositoryStub } = makeSut()
    const findSpy = jest.spyOn(loadTestQuestionRepositoryStub, 'findByChallengeId')
    await sut.test(makeFakeTestChallengeParams())
    expect(findSpy).toHaveBeenCalledWith('any_challenge_id')
  })

  test('Should throws if LoadTestQuestionRepository throws', async () => {
    const { sut, loadTestQuestionRepositoryStub } = makeSut()
    jest.spyOn(loadTestQuestionRepositoryStub, 'findByChallengeId').mockReturnValueOnce(Promise.reject(new Error()))
    const promise = sut.test(makeFakeTestChallengeParams())
    await expect(promise).rejects.toThrow()
  })

  test('Should return the questions', async () => {
    const { sut } = makeSut()
    const questions = await sut.test(makeFakeTestChallengeParams())
    expect(questions).toEqual(makeFakeTestQuestionModel())
  })
})
