import { DbCompleteLearn } from '@/data/usecases'
import { UpdateTestResultRepository } from '@/data/protocols'
import { StatusTestResult, TestResultModel } from '@/domain/models'
import { CompleteLearn } from '@/domain/usecases'

interface SutTypes {
  sut: DbCompleteLearn
  updateTestResultRepositoryStub: UpdateTestResultRepository
}

const makeSut = (): SutTypes => {
  const updateTestResultRepositoryStub = makeUpdateTestResultRepositoryStub()
  const sut = new DbCompleteLearn(updateTestResultRepositoryStub)
  return {
    sut,
    updateTestResultRepositoryStub
  }
}

const makeUpdateTestResultRepositoryStub = (): UpdateTestResultRepository => {
  class UpdateTestResultRepositoryStub implements UpdateTestResultRepository {
    async update (testResultToUpdate: any): Promise<TestResultModel> {
      return await Promise.resolve(makeFakeTestResultModel())
    }
  }
  return new UpdateTestResultRepositoryStub()
}

const makeFakeTestResultModel = (): TestResultModel => ({
  id: 'any_id',
  accountId: 'any_account_id',
  challengeId: 'any_challenge_id',
  status: StatusTestResult.COMPLETED,
  score: 1
})

const makeFakeCompleteLearnParams = (): CompleteLearn.Params => ({
  accountId: 'valid_account_id',
  challengeId: 'valid_challenge_id'
})

describe('Complete Learn UseCase', () => {
  test('Should call UpdateTestResultRepositoryStub with correct value', async () => {
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

  test('Should return the infos', async () => {
    const { sut } = makeSut()
    const result = await sut.complete(makeFakeCompleteLearnParams())
    expect(result).toBeTruthy()
  })
})
