import { DbTestChallenge } from '@/data/usecases'
import { UpdateTestResultRepository, LoadTestQuestionRepository } from '@/data/protocols'
import { StatusTestResult, TestQuestionModel, TestResultModel } from '@/domain/models'
import { TestChallenge } from '@/domain/usecases'

interface SutTypes {
  sut: DbTestChallenge
  updateTestResultRepositoryStub: UpdateTestResultRepository
  loadTestQuestionRepositoryStub: LoadTestQuestionRepository
}

const makeSut = (): SutTypes => {
  const updateTestResultRepositoryStub = makeUpdateTestResultRepositoryStub()
  const loadTestQuestionRepositoryStub = makeLoadTestQuestionRepositoryStub()
  const sut = new DbTestChallenge(updateTestResultRepositoryStub, loadTestQuestionRepositoryStub)
  return {
    sut,
    updateTestResultRepositoryStub,
    loadTestQuestionRepositoryStub
  }
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
  updatedAt: new Date()
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

describe('Test Challenge UseCase', () => {
  test('Should call UpdateTestResultRepository with correct values', async () => {
    const { sut, updateTestResultRepositoryStub } = makeSut()
    const updateSpy = jest.spyOn(updateTestResultRepositoryStub, 'update')
    await sut.test(makeFakeTestChallengeParams())
    expect(updateSpy).toHaveBeenCalledWith('any_account_id', 'any_challenge_id', { status: 'tested' })
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
