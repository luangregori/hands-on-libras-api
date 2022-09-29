import { DbLoadLessons } from '@/data/usecases'
import { FindAllLessonsRepository, FindLessonsByCategoryIdRepository } from '@/data/protocols'
import { LessonModel } from '@/domain/models'

interface SutTypes {
  sut: DbLoadLessons
  findAllLessonsRepositoryStub: FindAllLessonsRepository
  findLessonsByCategoryIdRepositoryStub: FindLessonsByCategoryIdRepository
}

const makeSut = (): SutTypes => {
  const findAllLessonsRepositoryStub = makeFakeFindAllLessonsRepository()
  const findLessonsByCategoryIdRepositoryStub = makeFindLessonsByCategoryIdRepositoryStub()
  const sut = new DbLoadLessons(findAllLessonsRepositoryStub, findLessonsByCategoryIdRepositoryStub)
  return {
    sut,
    findAllLessonsRepositoryStub,
    findLessonsByCategoryIdRepositoryStub
  }
}

const makeFakeFindAllLessonsRepository = (): FindAllLessonsRepository => {
  class FindAllLessonsRepositoryStub implements FindAllLessonsRepository {
    async findAll (): Promise<LessonModel[]> {
      return await Promise.resolve([makeFakeChallenge()])
    }
  }
  return new FindAllLessonsRepositoryStub()
}

const makeFindLessonsByCategoryIdRepositoryStub = (): FindLessonsByCategoryIdRepository => {
  class FindLessonsByCategoryIdRepositoryStub implements FindLessonsByCategoryIdRepository {
    async findByCategoryId (categoryId: string): Promise<LessonModel[]> {
      return await Promise.resolve([makeFakeChallenge()])
    }
  }
  return new FindLessonsByCategoryIdRepositoryStub()
}

const makeFakeChallenge = (): LessonModel => ({
  id: 'valid_id',
  name: 'valid_name',
  description: 'valid_description',
  image_url: 'valid_image_url',
  categoryId: 'valid_category_id'
})

describe('DbLoadLessons UseCase', () => {
  test('Should call FindLessonsByCategoryIdRepository with correct value', async () => {
    const { sut, findLessonsByCategoryIdRepositoryStub } = makeSut()
    const findSpy = jest.spyOn(findLessonsByCategoryIdRepositoryStub, 'findByCategoryId')
    await sut.load('any_category_id')
    expect(findSpy).toHaveBeenCalledWith('any_category_id')
  })

  test('Should throws if FindLessonsByCategoryIdRepository throws', async () => {
    const { sut, findLessonsByCategoryIdRepositoryStub } = makeSut()
    jest.spyOn(findLessonsByCategoryIdRepositoryStub, 'findByCategoryId').mockReturnValueOnce(Promise.reject(new Error()))
    const promise = sut.load('any_category_id')
    await expect(promise).rejects.toThrow()
  })

  test('Should call FindAllLessonsRepository if no exists categoryId', async () => {
    const { sut, findAllLessonsRepositoryStub } = makeSut()
    const findSpy = jest.spyOn(findAllLessonsRepositoryStub, 'findAll')
    await sut.load()
    expect(findSpy).toHaveBeenCalledWith()
  })

  test('Should throws if FindAllLessonsRepository throws', async () => {
    const { sut, findAllLessonsRepositoryStub } = makeSut()
    jest.spyOn(findAllLessonsRepositoryStub, 'findAll').mockReturnValueOnce(Promise.reject(new Error()))
    const promise = sut.load()
    await expect(promise).rejects.toThrow()
  })

  test('Should return the categories', async () => {
    const { sut } = makeSut()
    const categories = await sut.load()
    expect(categories).toEqual([makeFakeChallenge()])
  })
})
