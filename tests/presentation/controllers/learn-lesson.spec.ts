import faker from 'faker'
import { LearnLessonController } from '@/presentation/controllers'
import { badRequest, ok, serverError } from '@/presentation/helpers/http-helper'
import { MissingParamError, ServerError } from '@/presentation/errors'
import { LearnLessonSpy } from '@/tests/presentation/mocks'
import { throwError } from '@/tests/domain/mocks'

interface SutTypes {
  sut: LearnLessonController
  learnLessonSpy: LearnLessonSpy
}

const makeSut = (): SutTypes => {
  const learnLessonSpy = new LearnLessonSpy()
  const sut = new LearnLessonController(learnLessonSpy)
  return {
    sut,
    learnLessonSpy
  }
}

const mockRequest = (): LearnLessonController.Request => ({
  lessonId: faker.datatype.uuid(),
  accountId: faker.datatype.uuid()
})

describe('Learn Lesson Controller', () => {
  test('Should return 400 if no lessonId is provided', async () => {
    const { sut } = makeSut()
    const request = {
      lessonId: null,
      accountId: faker.datatype.uuid()
    }
    const httpResponse = await sut.handle(request)
    expect(httpResponse).toEqual(badRequest(new MissingParamError('lessonId')))
  })

  test('Should call learnLesson UseCase with correct values', async () => {
    const { sut, learnLessonSpy } = makeSut()
    const startSpy = jest.spyOn(learnLessonSpy, 'learn')
    const request = mockRequest()
    await sut.handle(request)
    expect(startSpy).toHaveBeenCalledWith(request.lessonId)
  })

  test('Should return 500 if learnLesson UseCase throws', async () => {
    const { sut, learnLessonSpy } = makeSut()
    jest.spyOn(learnLessonSpy, 'learn').mockImplementationOnce(throwError)
    const httpResponse = await sut.handle(mockRequest())
    expect(httpResponse).toEqual(serverError(new ServerError(null)))
  })

  test('Should return 200 if valid data is provided', async () => {
    const { sut, learnLessonSpy } = makeSut()
    const httpResponse = await sut.handle(mockRequest())
    expect(httpResponse).toEqual(ok(learnLessonSpy.result))
  })
})
