import { StartChallengeController } from '@/presentation/controllers'
import { StartChallenge } from '@/domain/usecases'
import { MissingParamError, ServerError } from '@/presentation/errors'
import { badRequest, ok, serverError } from '@/presentation/helpers/http-helper'
import { StatusTestResult } from '@/domain/models'

interface SutTypes {
  sut: StartChallengeController
  startChallengeStub: StartChallenge
}

const makeSut = (): SutTypes => {
  const startChallengeStub = makeStartChallengeStub()
  const sut = new StartChallengeController(startChallengeStub)
  return {
    sut,
    startChallengeStub
  }
}

const makeStartChallengeStub = (): StartChallenge => {
  class StartChallengeStub implements StartChallenge {
    async start (params: StartChallenge.Params): Promise<StartChallenge.Result> {
      return await new Promise(resolve => resolve(makeFakeStartChallengeResult()))
    }
  }
  return new StartChallengeStub()
}

const makeFakeStartChallengeResult = (): StartChallenge.Result => ({
  challengeInfo: {
    id: 'valid_id',
    name: 'valid_name',
    description: 'valid_description',
    image_url: 'valid_image',
    categoryId: 'valid_category_id'
  },
  userInfo: {
    id: 'valid_id',
    accountId: 'valid_account_id',
    challengeId: 'valid_challenge_id',
    status: StatusTestResult.COMPLETED,
    score: 0,
    updatedAt: new Date(2022, 0, 0)
  }
})

const makeFakeRequest = (): StartChallengeController.Request => ({
  challengeId: 'valid_id',
  accountId: 'valid_account_id'
})

describe('StartChallenge Controller', () => {
  test('Should return 400 if no challengeId is provided', async () => {
    const { sut } = makeSut()
    const request = {
      challengeId: null,
      accountId: 'valid_account_id'
    }
    const httpResponse = await sut.handle(request)
    expect(httpResponse).toEqual(badRequest(new MissingParamError('challengeId')))
  })

  test('Should call StartChallenge UseCase with correct values', async () => {
    const { sut, startChallengeStub } = makeSut()
    const startSpy = jest.spyOn(startChallengeStub, 'start')
    await sut.handle(makeFakeRequest())
    expect(startSpy).toHaveBeenCalledWith({
      challengeId: 'valid_id',
      accountId: 'valid_account_id'
    })
  })

  test('Should return 500 if StartChallenge UseCase throws', async () => {
    const { sut, startChallengeStub } = makeSut()
    jest.spyOn(startChallengeStub, 'start').mockImplementationOnce(() => {
      throw new Error()
    })
    const httpResponse = await sut.handle(makeFakeRequest())
    expect(httpResponse).toEqual(serverError(new ServerError(null)))
  })

  test('Should return 200 if valid data is provided', async () => {
    const { sut } = makeSut()
    const httpResponse = await sut.handle(makeFakeRequest())
    expect(httpResponse).toEqual(ok(makeFakeStartChallengeResult()))
  })
})
