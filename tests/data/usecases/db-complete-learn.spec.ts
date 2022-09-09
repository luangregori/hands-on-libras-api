import { DbCompleteLearn } from '@/data/usecases'
import { LoadTestResultsRepository, UpdateTestResultRepository } from '@/data/protocols'
import { StatusTestResult, TestResultModel } from '@/domain/models'
import { CompleteLearn } from '@/domain/usecases'

interface SutTypes {
  sut: DbCompleteLearn
  loadTestResultsRepositoryStub: LoadTestResultsRepository
  updateTestResultRepositoryStub: UpdateTestResultRepository
}

const makeSut = (): SutTypes => {
  const updateTestResultRepositoryStub = makeUpdateTestResultRepositoryStub()
  const loadTestResultsRepositoryStub = makeLoadTestResultsRepositoryStub()
  const sut = new DbCompleteLearn(loadTestResultsRepositoryStub, updateTestResultRepositoryStub)
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

const makeFakeTestResultModel = (status = StatusTestResult.STARTED): TestResultModel => ({
  id: 'any_id',
  accountId: 'any_account_id',
  challengeId: 'any_challenge_id',
  status,
  score: 1,
  updatedAt: new Date()
})

const makeFakeCompleteLearnParams = (): CompleteLearn.Params => ({
  accountId: 'valid_account_id',
  challengeId: 'valid_challenge_id'
})

describe('Complete Learn UseCase', () => {
  test('Should call LoadTestResultsRepositoryStub with correct values', async () => {
    const { sut, loadTestResultsRepositoryStub } = makeSut()
    const findSpy = jest.spyOn(loadTestResultsRepositoryStub, 'findOrCreate')
    await sut.complete(makeFakeCompleteLearnParams())
    expect(findSpy).toHaveBeenCalledWith('valid_account_id', 'valid_challenge_id')
  })

  test('Should call UpdateTestResultRepositoryStub if STATUS = STARTED', async () => {
    const { sut, updateTestResultRepositoryStub } = makeSut()
    const updateSpy = jest.spyOn(updateTestResultRepositoryStub, 'update')
    await sut.complete(makeFakeCompleteLearnParams())
    expect(updateSpy).toHaveBeenCalledTimes(2)
  })

  test('Should not call UpdateTestResultRepositoryStub if STATUS != STARTED', async () => {
    const { sut, loadTestResultsRepositoryStub, updateTestResultRepositoryStub } = makeSut()
    const updateSpy = jest.spyOn(updateTestResultRepositoryStub, 'update')
    jest.spyOn(loadTestResultsRepositoryStub, 'findOrCreate').mockReturnValueOnce(Promise.resolve(makeFakeTestResultModel(StatusTestResult.LEARNED)))
    await sut.complete(makeFakeCompleteLearnParams())
    expect(updateSpy).toHaveBeenCalledTimes(0)
  })

  test('Should call UpdateTestResultRepositoryStub with correct values', async () => {
    const { sut, updateTestResultRepositoryStub } = makeSut()
    const findSpy = jest.spyOn(updateTestResultRepositoryStub, 'update')
    await sut.complete(makeFakeCompleteLearnParams())
    expect(findSpy).toHaveBeenCalledWith('valid_account_id', 'valid_challenge_id', 'status', 'learned')
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
