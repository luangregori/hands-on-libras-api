import { CompleteLearnController } from '@/presentation/controllers'
import { badRequest, ok, serverError } from '@/presentation/helpers/http-helper'
import { MissingParamError, ServerError } from '@/presentation/errors'
import { CompleteLearn } from '@/domain/usecases'

interface SutTypes {
  sut: CompleteLearnController
  completeLearnStub: CompleteLearn
}

const makeSut = (): SutTypes => {
  const completeLearnStub = makeCompleteLearnStub()
  const sut = new CompleteLearnController(completeLearnStub)
  return {
    sut,
    completeLearnStub
  }
}

const makeCompleteLearnStub = (): CompleteLearn => {
  class CompleteLearnStub implements CompleteLearn {
    async complete (completeLearnParams: CompleteLearn.Params): Promise<boolean> {
      return await new Promise(resolve => resolve(true))
    }
  }
  return new CompleteLearnStub()
}

const makeFakeRequest = (): CompleteLearnController.Request => ({
  challengeId: 'valid_id',
  accountId: 'valid_account_id'
})

describe('Complete Learn Controller', () => {
  test('Should return 400 if no challengeId is provided', async () => {
    const { sut } = makeSut()
    const request = {
      challengeId: null,
      accountId: 'valid_account_id'
    }
    const httpResponse = await sut.handle(request)
    expect(httpResponse).toEqual(badRequest(new MissingParamError('challengeId')))
  })

  test('Should call CompleteLearn UseCase with correct values', async () => {
    const { sut, completeLearnStub } = makeSut()
    const completeSpy = jest.spyOn(completeLearnStub, 'complete')
    await sut.handle(makeFakeRequest())
    expect(completeSpy).toHaveBeenCalledWith({
      challengeId: 'valid_id',
      accountId: 'valid_account_id'
    })
  })

  test('Should return 500 if CompleteLearn UseCase throws', async () => {
    const { sut, completeLearnStub } = makeSut()
    jest.spyOn(completeLearnStub, 'complete').mockImplementationOnce(() => {
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
