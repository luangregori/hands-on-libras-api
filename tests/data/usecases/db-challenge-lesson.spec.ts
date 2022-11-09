import { DbChallengeLesson } from '@/data/usecases'
import { UpdateChallengeResultRepository, LoadChallengeQuestionRepository, LoadChallengeResultsRepository } from '@/data/protocols'
import { StatusChallengeResult, ChallengeQuestionModel, ChallengeResultModel } from '@/domain/models'
import { ChallengeLesson } from '@/domain/usecases'

interface SutTypes {
  sut: DbChallengeLesson
  loadChallengeResultsRepositoryStub: LoadChallengeResultsRepository
  updateChallengeResultRepositoryStub: UpdateChallengeResultRepository
  loadChallengeQuestionRepositoryStub: LoadChallengeQuestionRepository
}

const makeSut = (): SutTypes => {
  const loadChallengeResultsRepositoryStub = makeLoadChallengeResultsRepositoryStub()
  const updateChallengeResultRepositoryStub = makeUpdateChallengeResultRepositoryStub()
  const loadChallengeQuestionRepositoryStub = makeLoadChallengeQuestionRepositoryStub()
  const sut = new DbChallengeLesson(loadChallengeResultsRepositoryStub, updateChallengeResultRepositoryStub, loadChallengeQuestionRepositoryStub)
  return {
    sut,
    loadChallengeResultsRepositoryStub,
    updateChallengeResultRepositoryStub,
    loadChallengeQuestionRepositoryStub
  }
}

const makeLoadChallengeResultsRepositoryStub = (): LoadChallengeResultsRepository => {
  class LoadChallengeResultsRepositoryStub implements LoadChallengeResultsRepository {
    async findOrCreate (accountId: string, lessonId: string): Promise<ChallengeResultModel> {
      return await Promise.resolve(makeFakeChallengeResultModel())
    }

    async findByDate (date: Date): Promise<ChallengeResultModel[]> {
      throw new Error('Method not implemented.')
    }

    async findByDateAndAccountId (date: Date, accountId: string): Promise<ChallengeResultModel[]> {
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
    async update (accountId: string, lessonId: string, testResultToUpdate: any): Promise<ChallengeResultModel> {
      return await Promise.resolve(makeFakeChallengeResultModel())
    }
  }
  return new UpdateChallengeResultRepositoryStub()
}

const makeLoadChallengeQuestionRepositoryStub = (): LoadChallengeQuestionRepository => {
  class LoadChallengeQuestionRepositoryStub implements LoadChallengeQuestionRepository {
    async findByLessonId (lessonId: string): Promise<ChallengeQuestionModel[]> {
      return await Promise.resolve(makeFakeChallengeQuestionModel())
    }
  }
  return new LoadChallengeQuestionRepositoryStub()
}

const makeFakeChallengeResultModel = (): ChallengeResultModel => ({
  id: 'any_id',
  accountId: 'any_account_id',
  lessonId: 'any_lesson_id',
  status: StatusChallengeResult.LEARNED,
  score: 100,
  updatedAt: fakeDate
})

const makeFakeChallengeQuestionModel = (): ChallengeQuestionModel[] => ([
  {
    id: 'any_id',
    word: 'any_word',
    lessonId: 'any_lesson_id',
    options: ['any_option_1', 'any_option_2', 'any_option_3', 'any_option_4']
  }
])

const makeFakeChallengeLessonParams = (): ChallengeLesson.Params => ({
  accountId: 'any_account_id',
  lessonId: 'any_lesson_id'
})

const fakeDate = new Date(2022, 6, 9)

describe('Test Challenge UseCase', () => {
  beforeAll(() => {
    jest.useFakeTimers('modern').setSystemTime(fakeDate)
  })

  test('Should call LoadChallengeResultsRepository with correct values', async () => {
    const { sut, loadChallengeResultsRepositoryStub } = makeSut()
    const updateSpy = jest.spyOn(loadChallengeResultsRepositoryStub, 'findOrCreate')
    await sut.test(makeFakeChallengeLessonParams())
    expect(updateSpy).toHaveBeenCalledWith('any_account_id', 'any_lesson_id')
  })

  test('Should call UpdateChallengeResultRepository with correct values', async () => {
    const { sut, updateChallengeResultRepositoryStub } = makeSut()
    const updateSpy = jest.spyOn(updateChallengeResultRepositoryStub, 'update')
    await sut.test(makeFakeChallengeLessonParams())
    expect(updateSpy).toHaveBeenCalledWith('any_account_id', 'any_lesson_id', {
      accountId: 'any_account_id',
      lessonId: 'any_lesson_id',
      id: 'any_id',
      score: 100,
      status: 'tested',
      updatedAt: fakeDate
    })
  })

  test('Should not update the status if already completed', async () => {
    const { sut, loadChallengeResultsRepositoryStub, updateChallengeResultRepositoryStub } = makeSut()
    jest.spyOn(loadChallengeResultsRepositoryStub, 'findOrCreate').mockReturnValueOnce(Promise.resolve({
      id: 'any_id',
      accountId: 'any_account_id',
      lessonId: 'any_lesson_id',
      status: StatusChallengeResult.COMPLETED,
      score: 100,
      updatedAt: fakeDate
    }))
    const updateSpy = jest.spyOn(updateChallengeResultRepositoryStub, 'update')
    await sut.test(makeFakeChallengeLessonParams())
    expect(updateSpy).toHaveBeenCalledWith('any_account_id', 'any_lesson_id', {
      accountId: 'any_account_id',
      lessonId: 'any_lesson_id',
      id: 'any_id',
      score: 100,
      status: 'completed',
      updatedAt: fakeDate
    })
  })

  test('Should throws if UpdateChallengeResultRepository throws', async () => {
    const { sut, updateChallengeResultRepositoryStub } = makeSut()
    jest.spyOn(updateChallengeResultRepositoryStub, 'update').mockReturnValueOnce(Promise.reject(new Error()))
    const promise = sut.test(makeFakeChallengeLessonParams())
    await expect(promise).rejects.toThrow()
  })

  test('Should call LoadChallengeQuestionRepository with correct value', async () => {
    const { sut, loadChallengeQuestionRepositoryStub } = makeSut()
    const findSpy = jest.spyOn(loadChallengeQuestionRepositoryStub, 'findByLessonId')
    await sut.test(makeFakeChallengeLessonParams())
    expect(findSpy).toHaveBeenCalledWith('any_lesson_id')
  })

  test('Should throws if LoadChallengeQuestionRepository throws', async () => {
    const { sut, loadChallengeQuestionRepositoryStub } = makeSut()
    jest.spyOn(loadChallengeQuestionRepositoryStub, 'findByLessonId').mockReturnValueOnce(Promise.reject(new Error()))
    const promise = sut.test(makeFakeChallengeLessonParams())
    await expect(promise).rejects.toThrow()
  })

  test('Should return the questions', async () => {
    const { sut } = makeSut()
    const questions = await sut.test(makeFakeChallengeLessonParams())
    expect(questions).toEqual(makeFakeChallengeQuestionModel())
  })
})
