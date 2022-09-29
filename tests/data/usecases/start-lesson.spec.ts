import { DbStartLesson } from '@/data/usecases'
import { FindLessonByIdRepository, LoadChallengeResultsRepository } from '@/data/protocols'
import { StartLesson } from '@/domain/usecases'
import { ChallengeResultModel, LessonModel, StatusChallengeResult } from '@/domain/models'

interface SutTypes {
  sut: DbStartLesson
  findLessonByIdRepositoryStub: FindLessonByIdRepository
  loadChallengeResultsRepositoryStub: LoadChallengeResultsRepository
}

const makeSut = (): SutTypes => {
  const findLessonByIdRepositoryStub = makeFakeFindLessonByIdRepositoryStub()
  const loadChallengeResultsRepositoryStub = makeFakeLoadChallengeResultsRepositoryStub()
  const sut = new DbStartLesson(findLessonByIdRepositoryStub, loadChallengeResultsRepositoryStub)
  return {
    sut,
    findLessonByIdRepositoryStub,
    loadChallengeResultsRepositoryStub
  }
}

const makeFakeFindLessonByIdRepositoryStub = (): FindLessonByIdRepository => {
  class FindLessonByIdRepositoryStub implements FindLessonByIdRepository {
    async findById (challengeId: string): Promise<LessonModel> {
      return await Promise.resolve(makeFakeChallenge())
    }
  }
  return new FindLessonByIdRepositoryStub()
}

const makeFakeLoadChallengeResultsRepositoryStub = (): LoadChallengeResultsRepository => {
  class LoadChallengeResultsRepositoryStub implements LoadChallengeResultsRepository {
    async findOrCreate (accountId: string, challengeId: string): Promise<ChallengeResultModel> {
      return await Promise.resolve(makeFakeChallengeResultModel())
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

const makeFakeChallengeResultModel = (): ChallengeResultModel => ({
  id: 'any_id',
  accountId: 'any_account_id',
  lessonId: 'any_lesson_id',
  status: StatusChallengeResult.COMPLETED,
  score: 1,
  updatedAt: new Date(2022, 0, 0)
})

const makeFakeChallenge = (): LessonModel => ({
  id: 'valid_id',
  name: 'valid_name',
  description: 'valid_description',
  image_url: 'valid_image_url',
  categoryId: 'valid_category_id'
})

const makeFakeStartChallengeParams = (): StartLesson.Params => ({
  accountId: 'valid_account_id',
  lessonId: 'valid_challenge_id'
})

describe('DbStartChallenge UseCase', () => {
  test('Should call FindLessonByIdRepository with correct value', async () => {
    const { sut, findLessonByIdRepositoryStub } = makeSut()
    const findSpy = jest.spyOn(findLessonByIdRepositoryStub, 'findById')
    await sut.start(makeFakeStartChallengeParams())
    expect(findSpy).toHaveBeenCalledWith('valid_challenge_id')
  })

  test('Should throws if FindLessonByIdRepository throws', async () => {
    const { sut, findLessonByIdRepositoryStub } = makeSut()
    jest.spyOn(findLessonByIdRepositoryStub, 'findById').mockReturnValueOnce(Promise.reject(new Error()))
    const promise = sut.start(makeFakeStartChallengeParams())
    await expect(promise).rejects.toThrow()
  })

  test('Should call LoadChallengeResultsRepository with correct value', async () => {
    const { sut, loadChallengeResultsRepositoryStub } = makeSut()
    const findSpy = jest.spyOn(loadChallengeResultsRepositoryStub, 'findOrCreate')
    await sut.start(makeFakeStartChallengeParams())
    expect(findSpy).toHaveBeenCalledWith('valid_account_id', 'valid_challenge_id')
  })

  test('Should throws if LoadChallengeResultsRepository throws', async () => {
    const { sut, loadChallengeResultsRepositoryStub } = makeSut()
    jest.spyOn(loadChallengeResultsRepositoryStub, 'findOrCreate').mockReturnValueOnce(Promise.reject(new Error()))
    const promise = sut.start(makeFakeStartChallengeParams())
    await expect(promise).rejects.toThrow()
  })

  test('Should return StartChallenge.Result on success', async () => {
    const { sut } = makeSut()
    const result = await sut.start(makeFakeStartChallengeParams())
    expect(result.lessonInfo).toEqual(makeFakeChallenge())
    expect(result.userInfo).toEqual(makeFakeChallengeResultModel())
  })
})
