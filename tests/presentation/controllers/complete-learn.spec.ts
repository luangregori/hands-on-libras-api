import faker from 'faker'
import { CompleteLearnController } from '@/presentation/controllers'
import { badRequest, ok, serverError } from '@/presentation/helpers/http-helper'
import { MissingParamError, ServerError } from '@/presentation/errors'
import { CompleteLearnSpy, CheckAchievementsSpy } from '@/tests/presentation/mocks'
import { throwError } from '@/tests/domain/mocks'

interface SutTypes {
  sut: CompleteLearnController
  completeLearnSpy: CompleteLearnSpy
  checkAchievementsSpy: CheckAchievementsSpy
}

const makeSut = (): SutTypes => {
  const completeLearnSpy = new CompleteLearnSpy()
  const checkAchievementsSpy = new CheckAchievementsSpy()
  const sut = new CompleteLearnController(completeLearnSpy, checkAchievementsSpy)
  return {
    sut,
    completeLearnSpy,
    checkAchievementsSpy
  }
}

const mockRequest = (): CompleteLearnController.Request => ({
  lessonId: faker.datatype.uuid(),
  accountId: faker.datatype.uuid()
})

describe('Complete Learn Controller', () => {
  test('Should return 400 if no challengeId is provided', async () => {
    const { sut } = makeSut()
    const request = {
      lessonId: null,
      accountId: faker.datatype.uuid()
    }
    const httpResponse = await sut.handle(request)
    expect(httpResponse).toEqual(badRequest(new MissingParamError('lessonId')))
  })

  test('Should call CompleteLearn UseCase with correct values', async () => {
    const { sut, completeLearnSpy } = makeSut()
    const completeSpy = jest.spyOn(completeLearnSpy, 'complete')
    const request = mockRequest()
    await sut.handle(request)
    expect(completeSpy).toHaveBeenCalledWith({
      lessonId: request.lessonId,
      accountId: request.accountId
    })
  })

  test('Should return 500 if CompleteLearn UseCase throws', async () => {
    const { sut, completeLearnSpy } = makeSut()
    jest.spyOn(completeLearnSpy, 'complete').mockImplementationOnce(throwError)
    const httpResponse = await sut.handle(mockRequest())
    expect(httpResponse).toEqual(serverError(new ServerError(null)))
  })

  test('Should return 200 if valid data is provided', async () => {
    const { sut } = makeSut()
    const httpResponse = await sut.handle(mockRequest())
    expect(httpResponse).toEqual(ok())
  })
})
