import faker from 'faker'
import { LoadCategoriesController } from '@/presentation/controllers'
import { ok, serverError, noContent } from '@/presentation/helpers/http-helper'
import { ServerError } from '@/presentation/errors'
import { LoadCategoriesSpy } from '@/tests/presentation/mocks'
import { throwError } from '@/tests/domain/mocks'

interface SutTypes {
  sut: LoadCategoriesController
  loadCategoriesSPy: LoadCategoriesSpy
}

const makeSut = (): SutTypes => {
  const loadCategoriesSPy = new LoadCategoriesSpy()
  const sut = new LoadCategoriesController(loadCategoriesSPy)
  return {
    sut,
    loadCategoriesSPy
  }
}

const mockRequest = (): LoadCategoriesController.Request => ({
  accountId: faker.datatype.uuid()
})

describe('Load Categories Controller', () => {
  test('Should call LoadCategories', async () => {
    const { sut, loadCategoriesSPy } = makeSut()
    const loadSpy = jest.spyOn(loadCategoriesSPy, 'load')
    await sut.handle(mockRequest())
    expect(loadSpy).toHaveBeenCalledWith()
  })

  test('Should return 500 if LoadCategories throws', async () => {
    const { sut, loadCategoriesSPy } = makeSut()
    jest.spyOn(loadCategoriesSPy, 'load').mockImplementationOnce(throwError)
    const httpResponse = await sut.handle(mockRequest())
    expect(httpResponse).toEqual(serverError(new ServerError(null)))
  })

  test('Should return 204 if not exists any category', async () => {
    const { sut, loadCategoriesSPy } = makeSut()
    jest.spyOn(loadCategoriesSPy, 'load').mockImplementationOnce(async () => {
      return await Promise.resolve([])
    })
    const httpResponse = await sut.handle(mockRequest())
    expect(httpResponse).toEqual(noContent())
  })

  test('Should return 200 if exists categories', async () => {
    const { sut, loadCategoriesSPy } = makeSut()
    const httpResponse = await sut.handle(mockRequest())
    expect(httpResponse).toEqual(ok(loadCategoriesSPy.result))
  })
})
