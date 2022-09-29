import faker from 'faker'
import { ChallengeLessonController } from '@/presentation/controllers'
import { badRequest, ok, serverError } from '@/presentation/helpers/http-helper'
import { MissingParamError, ServerError } from '@/presentation/errors'
import { ChallengeLessonSpy } from '@/tests/presentation/mocks'
import { throwError } from '@/tests/domain/mocks'

interface SutTypes {
  sut: ChallengeLessonController
  challengeLessonSpy: ChallengeLessonSpy
}

const makeSut = (): SutTypes => {
  const challengeLessonSpy = new ChallengeLessonSpy()
  const sut = new ChallengeLessonController(challengeLessonSpy)
  return {
    sut,
    challengeLessonSpy
  }
}

const mockRequest = (): ChallengeLessonController.Request => ({
  lessonId: faker.datatype.uuid(),
  accountId: faker.datatype.uuid()
})

describe('Challenge Lesson Controller', () => {
  test('Should return 400 if no lessonId is provided', async () => {
    const { sut } = makeSut()
    const request = {
      lessonId: null,
      accountId: faker.datatype.uuid()
    }
    const httpResponse = await sut.handle(request)
    expect(httpResponse).toEqual(badRequest(new MissingParamError('lessonId')))
  })

  test('Should call ChallengeLesson UseCase with correct values', async () => {
    const { sut, challengeLessonSpy } = makeSut()
    const testSpy = jest.spyOn(challengeLessonSpy, 'test')
    const request = mockRequest()
    await sut.handle(request)
    expect(testSpy).toHaveBeenCalledWith({
      accountId: request.accountId,
      lessonId: request.lessonId
    })
  })

  test('Should return 500 if ChallengeLesson UseCase throws', async () => {
    const { sut, challengeLessonSpy } = makeSut()
    jest.spyOn(challengeLessonSpy, 'test').mockImplementationOnce(throwError)
    const httpResponse = await sut.handle(mockRequest())
    expect(httpResponse).toEqual(serverError(new ServerError(null)))
  })

  test('Should return 200 if valid data is provided', async () => {
    const { sut, challengeLessonSpy } = makeSut()
    const httpResponse = await sut.handle(mockRequest())
    expect(httpResponse).toEqual(ok(challengeLessonSpy.result))
  })
})
