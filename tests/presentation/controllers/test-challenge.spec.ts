import { TestChallengeController } from '@/presentation/controllers'
import { badRequest, ok, serverError } from '@/presentation/helpers/http-helper'
import { MissingParamError, ServerError } from '@/presentation/errors'
import { TestChallenge } from '@/domain/usecases'

interface SutTypes {
  sut: TestChallengeController
  testChallengeStub: TestChallenge
}

const makeSut = (): SutTypes => {
  const testChallengeStub = makeLearnChallengeStub()
  const sut = new TestChallengeController(testChallengeStub)
  return {
    sut,
    testChallengeStub
  }
}

const makeLearnChallengeStub = (): TestChallenge => {
  class TestChallengeStub implements TestChallenge {
    async test (challengeId: string): Promise<TestChallenge.Result> {
      return await new Promise(resolve => resolve(makeFakeTestChallengeResult()))
    }
  }
  return new TestChallengeStub()
}

const makeFakeTestChallengeResult = (): TestChallenge.Result => ([{
  id: 'any_id',
  word: 'any_word',
  options: ['any_option'],
  challengeId: 'any_challenge_id'
}])

const makeFakeRequest = (): TestChallengeController.Request => ({
  challengeId: 'valid_id',
  accountId: 'valid_account_id'
})

describe('Test Challenge Controller', () => {
  test('Should return 400 if no challengeId is provided', async () => {
    const { sut } = makeSut()
    const request = {
      challengeId: null,
      accountId: 'valid_account_id'
    }
    const httpResponse = await sut.handle(request)
    expect(httpResponse).toEqual(badRequest(new MissingParamError('challengeId')))
  })

  test('Should call TestChallenge UseCase with correct values', async () => {
    const { sut, testChallengeStub } = makeSut()
    const testSpy = jest.spyOn(testChallengeStub, 'test')
    await sut.handle(makeFakeRequest())
    expect(testSpy).toHaveBeenCalledWith('valid_id')
  })

  test('Should return 500 if TestChallenge UseCase throws', async () => {
    const { sut, testChallengeStub } = makeSut()
    jest.spyOn(testChallengeStub, 'test').mockImplementationOnce(() => {
      throw new Error()
    })
    const httpResponse = await sut.handle(makeFakeRequest())
    expect(httpResponse).toEqual(serverError(new ServerError(null)))
  })

  test('Should return 200 if valid data is provided', async () => {
    const { sut } = makeSut()
    const httpResponse = await sut.handle(makeFakeRequest())
    expect(httpResponse).toEqual(ok(makeFakeTestChallengeResult()))
  })
})
