import { LoadChallengesController } from './load-challenges'
import { LoadChallenges } from './load-challenges-protocols'
import { ChallengeModel } from '@/domain/models/challenge'
import { ok, serverError, noContent } from '@/presentation/helpers/http-helper'
import { ServerError } from '@/presentation/errors'

interface SutTypes{
  sut: LoadChallengesController
  loadChallengesStub: LoadChallenges
}

const makeSut = (): SutTypes => {
  const loadChallengesStub = makeLoadChallengesStub()
  const sut = new LoadChallengesController(loadChallengesStub)
  return {
    sut,
    loadChallengesStub
  }
}

const makeLoadChallengesStub = (): LoadChallenges => {
  class LoadChallengesStub implements LoadChallenges {
    async load (): Promise<LoadChallenges.Result> {
      return await Promise.resolve([makeFakeChallenge()])
    }
  }
  return new LoadChallengesStub()
}

const makeFakeChallenge = (): ChallengeModel => ({
  id: 'valid_id',
  name: 'valid_name',
  description: 'valid_description',
  image_url: 'valid_image_url',
  categoryId: 'valid_category_id'
})

const makeFakeRequest = (): any => ({
  categoryId: 'valid_category_id'
})

describe('Load Challenges Controller', () => {
  test('Should call LoadChallenges with correct value', async () => {
    const { sut, loadChallengesStub } = makeSut()
    const loadSpy = jest.spyOn(loadChallengesStub, 'load')
    await sut.handle(makeFakeRequest())
    expect(loadSpy).toHaveBeenCalledWith('valid_category_id')
  })

  test('Should return 500 if LoadChallenges throws', async () => {
    const { sut, loadChallengesStub } = makeSut()
    jest.spyOn(loadChallengesStub, 'load').mockImplementationOnce(() => {
      throw new Error()
    })
    const httpResponse = await sut.handle(makeFakeRequest())
    expect(httpResponse).toEqual(serverError(new ServerError(null)))
  })

  test('Should return 204 if not exists any challenge', async () => {
    const { sut, loadChallengesStub } = makeSut()
    jest.spyOn(loadChallengesStub, 'load').mockImplementationOnce(async () => {
      return await Promise.resolve([])
    })
    const httpResponse = await sut.handle(makeFakeRequest())
    expect(httpResponse).toEqual(noContent())
  })

  test('Should return 200 if exists challenges', async () => {
    const { sut } = makeSut()
    const httpResponse = await sut.handle(makeFakeRequest())
    expect(httpResponse).toEqual(ok([makeFakeChallenge()]))
  })
})
