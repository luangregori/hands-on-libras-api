import faker from 'faker'
import { CompleteChallengeController } from '@/presentation/controllers'
import { badRequest, ok, serverError } from '@/presentation/helpers/http-helper'
import { MissingParamError, ServerError } from '@/presentation/errors'
import { CompleteChallengeSpy, CheckAchievementsSpy } from '@/tests/presentation/mocks'
import { throwError } from '@/tests/domain/mocks'

interface SutTypes {
  sut: CompleteChallengeController
  completeChallengeSpy: CompleteChallengeSpy
  checkAchievementsSpy: CheckAchievementsSpy
}

const makeSut = (): SutTypes => {
  const checkAchievementsSpy = new CheckAchievementsSpy()
  const completeChallengeSpy = new CompleteChallengeSpy()
  const sut = new CompleteChallengeController(completeChallengeSpy, checkAchievementsSpy)
  return {
    sut,
    completeChallengeSpy,
    checkAchievementsSpy
  }
}

const mockRequest = (): CompleteChallengeController.Request => ({
  lessonId: faker.datatype.uuid(),
  accountId: faker.datatype.uuid(),
  lives: faker.datatype.number().toString()
})

describe('Complete Challenge Controller', () => {
  test('Should return 400 if no lessonId is provided', async () => {
    const { sut } = makeSut()
    const request = {
      lessonId: null,
      accountId: faker.datatype.uuid(),
      lives: '3'
    }
    const httpResponse = await sut.handle(request)
    expect(httpResponse).toEqual(badRequest(new MissingParamError('lessonId')))
  })

  test('Should return 400 if no lives is provided', async () => {
    const { sut } = makeSut()
    const request = {
      lessonId: faker.datatype.uuid(),
      accountId: faker.datatype.uuid(),
      lives: null
    }
    const httpResponse = await sut.handle(request)
    expect(httpResponse).toEqual(badRequest(new MissingParamError('lives')))
  })

  test('Should pass validation if lives = 0', async () => {
    const { sut, completeChallengeSpy } = makeSut()
    const request = {
      lessonId: faker.datatype.uuid(),
      accountId: faker.datatype.uuid(),
      lives: '0'
    }
    const completeSpy = jest.spyOn(completeChallengeSpy, 'complete')
    await sut.handle(request)
    expect(completeSpy).toHaveBeenCalled()
  })

  test('Should call CompleteChallenge UseCase with correct values', async () => {
    const { sut, completeChallengeSpy } = makeSut()
    const completeSpy = jest.spyOn(completeChallengeSpy, 'complete')
    const request = mockRequest()
    await sut.handle(request)
    expect(completeSpy).toHaveBeenCalledWith({
      lessonId: request.lessonId,
      accountId: request.accountId,
      lives: Number(request.lives)
    })
  })

  test('Should return 500 if CompleteChallenge UseCase throws', async () => {
    const { sut, completeChallengeSpy } = makeSut()
    jest.spyOn(completeChallengeSpy, 'complete').mockImplementationOnce(throwError)
    const httpResponse = await sut.handle(mockRequest())
    expect(httpResponse).toEqual(serverError(new ServerError(null)))
  })

  test('Should return 200 if valid data is provided', async () => {
    const { sut } = makeSut()
    const httpResponse = await sut.handle(mockRequest())
    expect(httpResponse).toEqual(ok())
  })
})
