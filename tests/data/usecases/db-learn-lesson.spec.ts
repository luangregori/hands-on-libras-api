import { DbLearnLesson } from '@/data/usecases'
import { FindLearningInfoRepository } from '@/data/protocols'
import { LearningInfoModel } from '@/domain/models'

interface SutTypes{
  sut: DbLearnLesson
  findLearningInfoRepositoryStub: FindLearningInfoRepository
}

const makeSut = (): SutTypes => {
  const findLearningInfoRepositoryStub = makeFindLearningInfoRepositoryStub()
  const sut = new DbLearnLesson(findLearningInfoRepositoryStub)
  return {
    sut,
    findLearningInfoRepositoryStub
  }
}

const makeFindLearningInfoRepositoryStub = (): FindLearningInfoRepository => {
  class FindLearningInfoRepositoryStub implements FindLearningInfoRepository {
    async findByLessonId (lessonId: string): Promise<LearningInfoModel[]> {
      return await Promise.resolve([makeFakeLearningInfo()])
    }
  }
  return new FindLearningInfoRepositoryStub()
}

const makeFakeLearningInfo = (): LearningInfoModel => ({
  id: 'any_id',
  lessonId: 'any_lesson_id',
  description: 'any_description',
  word: 'any_word'
})

describe('Lear Challenge UseCase', () => {
  test('Should call FindLearningInfoRepository with correct value', async () => {
    const { sut, findLearningInfoRepositoryStub } = makeSut()
    const findSpy = jest.spyOn(findLearningInfoRepositoryStub, 'findByLessonId')
    await sut.learn('any_lesson_id')
    expect(findSpy).toHaveBeenCalledWith('any_lesson_id')
  })

  test('Should throws if FindLearningInfoRepository throws', async () => {
    const { sut, findLearningInfoRepositoryStub } = makeSut()
    jest.spyOn(findLearningInfoRepositoryStub, 'findByLessonId').mockReturnValueOnce(Promise.reject(new Error()))
    const promise = sut.learn('any_lesson_id')
    await expect(promise).rejects.toThrow()
  })

  test('Should return the infos', async () => {
    const { sut } = makeSut()
    const infos = await sut.learn('any_lesson_id')
    expect(infos).toEqual([makeFakeLearningInfo()])
  })
})
