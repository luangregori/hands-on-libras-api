import { CompleteTestController } from '@/presentation/controllers'
import { badRequest, ok, serverError } from '@/presentation/helpers/http-helper'
import { MissingParamError, ServerError } from '@/presentation/errors'
import { CompleteTest } from '@/domain/usecases'

interface SutTypes {
  sut: CompleteTestController
  completeTestStub: CompleteTest
}

const makeSut = (): SutTypes => {
  const completeTestStub = makeCompleteTestStub()
  const sut = new CompleteTestController(completeTestStub)
  return {
    sut,
    completeTestStub
  }
}

const makeCompleteTestStub = (): CompleteTest => {
  class CompleteLearnStub implements CompleteTest {
    async complete (completeTestParams: CompleteTest.Params): Promise<boolean> {
      return await new Promise(resolve => resolve(true))
    }
  }
  return new CompleteLearnStub()
}

const makeFakeRequest = (): CompleteTestController.Request => ({
  challengeId: 'valid_id',
  accountId: 'valid_account_id',
  lives: '3'
})

describe('Complete Test Controller', () => {
  test('Should return 400 if no challengeId is provided', async () => {
    const { sut } = makeSut()
    const request = {
      challengeId: null,
      accountId: 'valid_account_id',
      lives: '3'
    }
    const httpResponse = await sut.handle(request)
    expect(httpResponse).toEqual(badRequest(new MissingParamError('challengeId')))
  })

  test('Should return 400 if no lives is provided', async () => {
    const { sut } = makeSut()
    const request = {
      challengeId: 'valid_id',
      accountId: 'valid_account_id',
      lives: null
    }
    const httpResponse = await sut.handle(request)
    expect(httpResponse).toEqual(badRequest(new MissingParamError('lives')))
  })

  test('Should pass validation if lives = 0', async () => {
    const { sut, completeTestStub } = makeSut()
    const request = {
      challengeId: 'valid_id',
      accountId: 'valid_account_id',
      lives: '0'
    }
    const completeSpy = jest.spyOn(completeTestStub, 'complete')
    await sut.handle(request)
    expect(completeSpy).toHaveBeenCalled()
  })

  test('Should call CompleteTest UseCase with correct values', async () => {
    const { sut, completeTestStub } = makeSut()
    const completeSpy = jest.spyOn(completeTestStub, 'complete')
    await sut.handle(makeFakeRequest())
    expect(completeSpy).toHaveBeenCalledWith({
      challengeId: 'valid_id',
      accountId: 'valid_account_id',
      lives: 3
    })
  })

  test('Should return 500 if CompleteTest UseCase throws', async () => {
    const { sut, completeTestStub } = makeSut()
    jest.spyOn(completeTestStub, 'complete').mockImplementationOnce(() => {
      throw new Error()
    })
    const httpResponse = await sut.handle(makeFakeRequest())
    expect(httpResponse).toEqual(serverError(new ServerError(null)))
  })

  test('Should return 200 if valid data is provided', async () => {
    const { sut } = makeSut()
    const httpResponse = await sut.handle(makeFakeRequest())
    expect(httpResponse).toEqual(ok())
  })
})
