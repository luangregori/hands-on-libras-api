import { LearnChallengeController } from '@/presentation/controllers'
import { badRequest, ok, serverError } from '@/presentation/helpers/http-helper'
import { MissingParamError, ServerError } from '@/presentation/errors'
import { LearnChallenge } from '@/domain/usecases'

interface SutTypes {
  sut: LearnChallengeController
  learnChallengeStub: LearnChallenge
}

const makeSut = (): SutTypes => {
  const learnChallengeStub = makeLearnChallengeStub()
  const sut = new LearnChallengeController(learnChallengeStub)
  return {
    sut,
    learnChallengeStub
  }
}

const makeLearnChallengeStub = (): LearnChallenge => {
  class LearnChallengeStub implements LearnChallenge {
    async learn (challengeId: string): Promise<LearnChallenge.Result> {
      return await new Promise(resolve => resolve(makeFakeLearnChallengeResult()))
    }
  }
  return new LearnChallengeStub()
}

const makeFakeLearnChallengeResult = (): LearnChallenge.Result => ({
  id: 'any_id',
  description: 'any_description',
  word: 'any_word',
  challengeId: 'any_challenge_id'
})

const makeFakeRequest = (): LearnChallengeController.Request => ({
  challengeId: 'valid_id',
  accountId: 'valid_account_id'
})

describe('Learn Challenge Controller', () => {
  test('Should return 400 if no challengeId is provided', async () => {
    const { sut } = makeSut()
    const request = {
      challengeId: null,
      accountId: 'valid_account_id'
    }
    const httpResponse = await sut.handle(request)
    expect(httpResponse).toEqual(badRequest(new MissingParamError('challengeId')))
  })

  test('Should call LearnChallenge UseCase with correct values', async () => {
    const { sut, learnChallengeStub } = makeSut()
    const startSpy = jest.spyOn(learnChallengeStub, 'learn')
    await sut.handle(makeFakeRequest())
    expect(startSpy).toHaveBeenCalledWith('valid_id')
  })

  test('Should return 500 if LearnChallenge UseCase throws', async () => {
    const { sut, learnChallengeStub } = makeSut()
    jest.spyOn(learnChallengeStub, 'learn').mockImplementationOnce(() => {
      throw new Error()
    })
    const httpResponse = await sut.handle(makeFakeRequest())
    expect(httpResponse).toEqual(serverError(new ServerError(null)))
  })

  test('Should return 200 if valid data is provided', async () => {
    const { sut } = makeSut()
    const httpResponse = await sut.handle(makeFakeRequest())
    expect(httpResponse).toEqual(ok(makeFakeLearnChallengeResult()))
  })
})
