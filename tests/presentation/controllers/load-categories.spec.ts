import { LoadCategoriesController } from '@/presentation/controllers'
import { LoadCategories } from '@/domain/usecases'
import { CategoryModel } from '@/domain/models/category'
import { ok, serverError, noContent } from '@/presentation/helpers/http-helper'
import { ServerError } from '@/presentation/errors'

const makeLoadCategoriesStub = (): LoadCategories => {
  class LoadCategoriesStub implements LoadCategories {
    async load (): Promise<LoadCategories.Result> {
      return await Promise.resolve([makeFakeCategory()])
    }
  }
  return new LoadCategoriesStub()
}

interface SutTypes{
  sut: LoadCategoriesController
  loadCategoriesStub: LoadCategories
}

const makeSut = (): SutTypes => {
  const loadCategoriesStub = makeLoadCategoriesStub()
  const sut = new LoadCategoriesController(loadCategoriesStub)
  return {
    sut,
    loadCategoriesStub
  }
}

const makeFakeCategory = (): CategoryModel => ({
  id: 'valid_id',
  name: 'valid_name'
})

const makeFakeRequest = (): any => ({})

describe('Load Categories Controller', () => {
  test('Should call LoadCategories', async () => {
    const { sut, loadCategoriesStub } = makeSut()
    const loadSpy = jest.spyOn(loadCategoriesStub, 'load')
    await sut.handle(makeFakeRequest())
    expect(loadSpy).toHaveBeenCalledWith()
  })

  test('Should return 500 if LoadCategories throws', async () => {
    const { sut, loadCategoriesStub } = makeSut()
    jest.spyOn(loadCategoriesStub, 'load').mockImplementationOnce(() => {
      throw new Error()
    })
    const httpResponse = await sut.handle(makeFakeRequest())
    expect(httpResponse).toEqual(serverError(new ServerError(null)))
  })

  test('Should return 204 if not exists any category', async () => {
    const { sut, loadCategoriesStub } = makeSut()
    jest.spyOn(loadCategoriesStub, 'load').mockImplementationOnce(async () => {
      return await Promise.resolve([])
    })
    const httpResponse = await sut.handle(makeFakeRequest())
    expect(httpResponse).toEqual(noContent())
  })

  test('Should return 200 if exists categories', async () => {
    const { sut } = makeSut()
    const httpResponse = await sut.handle(makeFakeRequest())
    expect(httpResponse).toEqual(ok([makeFakeCategory()]))
  })
})
