import faker from 'faker'
import { StartLessonController } from '@/presentation/controllers'
import { MissingParamError, ServerError } from '@/presentation/errors'
import { badRequest, ok, serverError } from '@/presentation/helpers/http-helper'
import { StartLessonSpy } from '@/tests/presentation/mocks'
import { throwError } from '@/tests/domain/mocks'

interface SutTypes {
  sut: StartLessonController
  startLessonSpy: StartLessonSpy
}

const makeSut = (): SutTypes => {
  const startLessonSpy = new StartLessonSpy()
  const sut = new StartLessonController(startLessonSpy)
  return {
    sut,
    startLessonSpy
  }
}

const mockRequest = (): StartLessonController.Request => ({
  lessonId: faker.random.uuid(),
  accountId: faker.random.uuid()
})

describe('StartLesson Controller', () => {
  test('Should return 400 if no lessonId is provided', async () => {
    const { sut } = makeSut()
    const request = {
      lessonId: null,
      accountId: faker.datatype.uuid()
    }
    const httpResponse = await sut.handle(request)
    expect(httpResponse).toEqual(badRequest(new MissingParamError('lessonId')))
  })

  test('Should call StartLesson UseCase with correct values', async () => {
    const { sut, startLessonSpy } = makeSut()
    const startSpy = jest.spyOn(startLessonSpy, 'start')
    const request = mockRequest()
    await sut.handle(request)
    expect(startSpy).toHaveBeenCalledWith({
      lessonId: request.lessonId,
      accountId: request.accountId
    })
  })

  test('Should return 500 if StartLesson UseCase throws', async () => {
    const { sut, startLessonSpy } = makeSut()
    jest.spyOn(startLessonSpy, 'start').mockImplementationOnce(throwError)
    const httpResponse = await sut.handle(mockRequest())
    expect(httpResponse).toEqual(serverError(new ServerError(null)))
  })

  test('Should return 200 if valid data is provided', async () => {
    const { sut, startLessonSpy } = makeSut()
    const httpResponse = await sut.handle(mockRequest())
    expect(httpResponse).toEqual(ok(startLessonSpy.result))
  })
})
