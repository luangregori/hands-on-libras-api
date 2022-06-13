import { CategoryModel } from '../../../domain/models/category'
import { LoadCategoriesController } from './load-categories'
import { LoadCategories, HttpRequest } from './load-categories-protocols'
import { ok, serverError, noContent } from '../../helpers/http-helper'
import { ServerError } from '../../errors'

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

const makeFakeRequest = (): HttpRequest => ({
  body: {}
})

describe('Load Categories Controller', () => {
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