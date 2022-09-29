import { DbLoadRanking } from '@/data/usecases'
import { LoadChallengeResultsRepository, FindAccountRepository } from '@/data/protocols'
import { AccountModel, StatusChallengeResult, ChallengeResultModel } from '@/domain/models'
import { LoadRanking } from '@/domain/usecases'

const makeLoadChallengeResultsRepositoryStub = (): LoadChallengeResultsRepository => {
  class LoadChallengeResultsRepositoryStub implements LoadChallengeResultsRepository {
    async findByDate (date: Date): Promise<ChallengeResultModel[]> {
      return await new Promise(resolve => resolve([makeFakeChallengeResultModel(), makeFakeChallengeResultModel('another_id')]))
    }

    async findOrCreate (accountId: string, lessonId: string): Promise<ChallengeResultModel> {
      throw new Error('Method not implemented.')
    }

    async findByAccountId (accountId: string): Promise<ChallengeResultModel[]> {
      throw new Error('Method not implemented.')
    }
  }
  return new LoadChallengeResultsRepositoryStub()
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

const makeFakeChallengeResultModel = (accountId: string = 'any_account_id'): ChallengeResultModel => ({
  id: 'any_id',
  accountId,
  lessonId: 'any_lesson_id',
  status: StatusChallengeResult.COMPLETED,
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
  loadChallengeResultsRepositoryStub: LoadChallengeResultsRepository
  findAccountRepositoryStub: FindAccountRepository
}

const makeSut = (): SutTypes => {
  const findAccountRepositoryStub = makeFindAccountRepositoryStub()
  const loadChallengeResultsRepositoryStub = makeLoadChallengeResultsRepositoryStub()
  const sut = new DbLoadRanking(loadChallengeResultsRepositoryStub, findAccountRepositoryStub)
  return {
    sut,
    loadChallengeResultsRepositoryStub,
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

  test('Should call LoadChallengeResultsRepository with correct values', async () => {
    const { sut, loadChallengeResultsRepositoryStub } = makeSut()
    const findSpy = jest.spyOn(loadChallengeResultsRepositoryStub, 'findByDate')
    await sut.load(makeFakeParams())
    expect(findSpy).toHaveBeenCalledWith(new Date(2022, 6, 9))
  })

  test('Should throws if LoadChallengeResultsRepository throws', async () => {
    const { sut, loadChallengeResultsRepositoryStub } = makeSut()
    jest.spyOn(loadChallengeResultsRepositoryStub, 'findByDate').mockReturnValueOnce(Promise.reject(new Error()))
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
