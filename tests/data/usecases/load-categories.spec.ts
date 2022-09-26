import { DbLoadCategories } from '@/data/usecases'
import { FindAllCategoriesRepository } from '@/data/protocols'
import { CategoryModel } from '@/domain/models'

const makeFakeFindAllCategoriesRepository = (): FindAllCategoriesRepository => {
  class FindAllCategoriesRepositoryStub implements FindAllCategoriesRepository {
    async findAll (): Promise<CategoryModel[]> {
      return await Promise.resolve([makeFakeCategory()])
    }
  }
  return new FindAllCategoriesRepositoryStub()
}

const makeFakeCategory = (): CategoryModel => ({
  id: 'any_id',
  name: faker.name.findName()
})

interface SutTypes{
  sut: DbLoadCategories
  findAllCategoriesRepositoryStub: FindAllCategoriesRepository
}

const makeSut = (): SutTypes => {
  const findAllCategoriesRepositoryStub = makeFakeFindAllCategoriesRepository()
  const sut = new DbLoadCategories(findAllCategoriesRepositoryStub)
  return {
    sut,
    findAllCategoriesRepositoryStub
  }
}

describe('DbLoadCategories UseCase', () => {
  test('Should call FindAllCategoriesRepository', async () => {
    const { sut, findAllCategoriesRepositoryStub } = makeSut()
    const findSpy = jest.spyOn(findAllCategoriesRepositoryStub, 'findAll')
    await sut.load()
    expect(findSpy).toHaveBeenCalledWith()
  })

  test('Should throws if FindAllCategoriesRepository throws', async () => {
    const { sut, findAllCategoriesRepositoryStub } = makeSut()
    jest.spyOn(findAllCategoriesRepositoryStub, 'findAll').mockReturnValueOnce(Promise.reject(new Error()))
    const promise = sut.load()
    await expect(promise).rejects.toThrow()
  })

  test('Should return the categories', async () => {
    const { sut } = makeSut()
    const categories = await sut.load()
    expect(categories).toEqual([makeFakeCategory()])
  })
})
