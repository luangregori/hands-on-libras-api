import { DbCompleteLearn } from '@/data/usecases'
import { LoadChallengeResultsRepository, UpdateChallengeResultRepository } from '@/data/protocols'
import { StatusChallengeResult, ChallengeResultModel } from '@/domain/models'
import { CompleteLearn } from '@/domain/usecases'

interface SutTypes {
  sut: DbCompleteLearn
  loadChallengeResultsRepositoryStub: LoadChallengeResultsRepository
  updateChallengeResultRepositoryStub: UpdateChallengeResultRepository
}

const makeSut = (): SutTypes => {
  const updateChallengeResultRepositoryStub = makeUpdateChallengeResultRepositoryStub()
  const loadChallengeResultsRepositoryStub = makeLoadChallengeResultsRepositoryStub()
  const sut = new DbCompleteLearn(loadChallengeResultsRepositoryStub, updateChallengeResultRepositoryStub)
  return {
    sut,
    loadChallengeResultsRepositoryStub,
    updateChallengeResultRepositoryStub
  }
}

const makeLoadChallengeResultsRepositoryStub = (): LoadChallengeResultsRepository => {
  class LoadChallengeResultsRepositoryStub implements LoadChallengeResultsRepository {
    async findOrCreate (accountId: string, lessonId: string): Promise<ChallengeResultModel> {
      return await new Promise(resolve => resolve(makeFakeChallengeResultModel()))
    }

    async findByDate (date: Date): Promise<ChallengeResultModel[]> {
      throw new Error('Method not implemented.')
    }

    async findByAccountId (accountId: string): Promise<ChallengeResultModel[]> {
      throw new Error('Method not implemented.')
    }
  }
  return new LoadChallengeResultsRepositoryStub()
}

const makeUpdateChallengeResultRepositoryStub = (): UpdateChallengeResultRepository => {
  class UpdateChallengeResultRepositoryStub implements UpdateChallengeResultRepository {
    async update (testResultToUpdate: any): Promise<ChallengeResultModel> {
      return await Promise.resolve(makeFakeChallengeResultModel())
    }
  }
  return new UpdateChallengeResultRepositoryStub()
}

const makeFakeChallengeResultModel = (status = StatusChallengeResult.STARTED): ChallengeResultModel => ({
  id: 'any_id',
  accountId: 'any_account_id',
  lessonId: 'any_lesson_id',
  status,
  score: 0,
  updatedAt: new Date()
})

const makeFakeCompleteLearnParams = (): CompleteLearn.Params => ({
  accountId: 'valid_account_id',
  lessonId: 'valid_lesson_id'
})

describe('Complete Learn UseCase', () => {
  test('Should call LoadChallengeResultsRepositoryStub with correct values', async () => {
    const { sut, loadChallengeResultsRepositoryStub } = makeSut()
    const findSpy = jest.spyOn(loadChallengeResultsRepositoryStub, 'findOrCreate')
    await sut.complete(makeFakeCompleteLearnParams())
    expect(findSpy).toHaveBeenCalledWith('valid_account_id', 'valid_lesson_id')
  })

  test('Should call UpdateChallengeResultRepositoryStub if STATUS = STARTED', async () => {
    const { sut, updateChallengeResultRepositoryStub } = makeSut()
    const updateSpy = jest.spyOn(updateChallengeResultRepositoryStub, 'update')
    await sut.complete(makeFakeCompleteLearnParams())
    expect(updateSpy).toHaveBeenCalledTimes(1)
  })

  test('Should not call UpdateChallengeResultRepositoryStub if STATUS != STARTED', async () => {
    const { sut, loadChallengeResultsRepositoryStub, updateChallengeResultRepositoryStub } = makeSut()
    const updateSpy = jest.spyOn(updateChallengeResultRepositoryStub, 'update')
    jest.spyOn(loadChallengeResultsRepositoryStub, 'findOrCreate').mockReturnValueOnce(Promise.resolve(makeFakeChallengeResultModel(StatusChallengeResult.LEARNED)))
    await sut.complete(makeFakeCompleteLearnParams())
    expect(updateSpy).toHaveBeenCalledTimes(0)
  })

  test('Should call UpdateChallengeResultRepositoryStub with correct values', async () => {
    const { sut, updateChallengeResultRepositoryStub } = makeSut()
    const findSpy = jest.spyOn(updateChallengeResultRepositoryStub, 'update')
    await sut.complete(makeFakeCompleteLearnParams())
    expect(findSpy).toHaveBeenCalledWith('valid_account_id', 'valid_lesson_id', { score: 10, status: 'learned' })
  })

  test('Should throws if UpdateChallengeResultRepositoryStub throws', async () => {
    const { sut, updateChallengeResultRepositoryStub } = makeSut()
    jest.spyOn(updateChallengeResultRepositoryStub, 'update').mockReturnValueOnce(Promise.reject(new Error()))
    const promise = sut.complete(makeFakeCompleteLearnParams())
    await expect(promise).rejects.toThrow()
  })

  test('Should throws if LoadChallengeResultsRepositoryStub throws', async () => {
    const { sut, loadChallengeResultsRepositoryStub } = makeSut()
    jest.spyOn(loadChallengeResultsRepositoryStub, 'findOrCreate').mockReturnValueOnce(Promise.reject(new Error()))
    const promise = sut.complete(makeFakeCompleteLearnParams())
    await expect(promise).rejects.toThrow()
  })

  test('Should return the infos', async () => {
    const { sut } = makeSut()
    const result = await sut.complete(makeFakeCompleteLearnParams())
    expect(result).toBeTruthy()
  })
})
