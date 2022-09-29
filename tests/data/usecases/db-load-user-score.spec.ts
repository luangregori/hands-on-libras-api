import { DbLoadUserScore } from '@/data/usecases'
import { LoadChallengeResultsRepository } from '@/data/protocols'
import { StatusChallengeResult, ChallengeResultModel } from '@/domain/models'

interface SutTypes {
  sut: DbLoadUserScore
  loadChallengeResultsRepositoryStub: LoadChallengeResultsRepository
}

const makeSut = (): SutTypes => {
  const loadChallengeResultsRepositoryStub = makeLoadChallengeResultsRepositoryStub()
  const sut = new DbLoadUserScore(loadChallengeResultsRepositoryStub)
  return {
    sut,
    loadChallengeResultsRepositoryStub
  }
}

const makeLoadChallengeResultsRepositoryStub = (): LoadChallengeResultsRepository => {
  class LoadChallengeResultsRepositoryStub implements LoadChallengeResultsRepository {
    async findByAccountId (accountId: string): Promise<any[]> {
      return await Promise.resolve([makeFakeChallengeResultModel()])
    }

    async findOrCreate (accountId: string, lessonId: string): Promise<any> {
      throw new Error('Method not implemented.')
    }

    async findByDate (date: Date): Promise<any[]> {
      throw new Error('Method not implemented.')
    }
  }
  return new LoadChallengeResultsRepositoryStub()
}

const makeFakeChallengeResultModel = (): ChallengeResultModel => ({
  id: 'any_id',
  accountId: 'any_account_id',
  lessonId: 'any_challenge_id',
  status: StatusChallengeResult.COMPLETED,
  score: 100,
  updatedAt: new Date()
})

describe('DbLoadUserScore UseCase', () => {
  test('Should call LoadChallengeResultsRepository', async () => {
    const { sut, loadChallengeResultsRepositoryStub } = makeSut()
    const findSpy = jest.spyOn(loadChallengeResultsRepositoryStub, 'findByAccountId')
    await sut.load('any_account_id')
    expect(findSpy).toHaveBeenCalledWith('any_account_id')
  })

  test('Should throws if LoadChallengeResultsRepository throws', async () => {
    const { sut, loadChallengeResultsRepositoryStub } = makeSut()
    jest.spyOn(loadChallengeResultsRepositoryStub, 'findByAccountId').mockReturnValueOnce(Promise.reject(new Error()))
    const promise = sut.load('any_account_id')
    await expect(promise).rejects.toThrow()
  })

  test('Should return the sum of the score', async () => {
    const { sut } = makeSut()
    const sum = await sut.load('any_account_id')
    expect(sum).toEqual(100)
  })
})
