import faker from 'faker'
import { LoadLessonsController } from '@/presentation/controllers'
import { ok, serverError } from '@/presentation/helpers/http-helper'
import { ServerError } from '@/presentation/errors'
import { LoadLessonsSpy } from '@/tests/presentation/mocks'
import { throwError } from '@/tests/domain/mocks'

interface SutTypes{
  sut: LoadLessonsController
  loadLessonSpy: LoadLessonsSpy
}

const makeSut = (): SutTypes => {
  const loadLessonSpy = new LoadLessonsSpy()
  const sut = new LoadLessonsController(loadLessonSpy)
  return {
    sut,
    loadLessonSpy
  }
}

const mockRequest = (): LoadLessonsController.Request => ({
  accountId: faker.datatype.uuid(),
  categoryId: faker.datatype.uuid()
})

describe('Load Lesson Controller', () => {
  test('Should call LoadChallenges with correct value', async () => {
    const { sut, loadLessonSpy } = makeSut()
    const loadSpy = jest.spyOn(loadLessonSpy, 'load')
    const request = mockRequest()
    await sut.handle(request)
    expect(loadSpy).toHaveBeenCalledWith(request.categoryId)
  })

  test('Should return 500 if LoadChallenges throws', async () => {
    const { sut, loadLessonSpy } = makeSut()
    jest.spyOn(loadLessonSpy, 'load').mockImplementationOnce(throwError)
    const httpResponse = await sut.handle(mockRequest())
    expect(httpResponse).toEqual(serverError(new ServerError(null)))
  })

  test('Should return 200 even not exists any challenge', async () => {
    const { sut, loadLessonSpy } = makeSut()
    jest.spyOn(loadLessonSpy, 'load').mockImplementationOnce(async () => {
      return await Promise.resolve([])
    })
    const httpResponse = await sut.handle(mockRequest())
    expect(httpResponse).toEqual(ok([]))
  })

  test('Should return 200 on success', async () => {
    const { sut, loadLessonSpy } = makeSut()
    const httpResponse = await sut.handle(mockRequest())
    expect(httpResponse).toEqual(ok(loadLessonSpy.result))
  })
})
