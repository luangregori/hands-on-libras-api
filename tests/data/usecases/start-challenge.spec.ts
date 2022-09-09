import { DbStartChallenge } from '@/data/usecases'
import { FindChallengeByIdRepository, LoadTestResultsRepository } from '@/data/protocols'
import { StartChallenge } from '@/domain/usecases'
import { TestResultModel, ChallengeModel, StatusTestResult } from '@/domain/models'

interface SutTypes {
  sut: DbStartChallenge
  findChallengeByIdRepositoryStub: FindChallengeByIdRepository
  loadTestResultsRepositoryStub: LoadTestResultsRepository
}

const makeSut = (): SutTypes => {
  const findChallengeByIdRepositoryStub = makeFakeFindChallengeByIdRepositoryStub()
  const loadTestResultsRepositoryStub = makeFakeLoadTestResultsRepositoryStub()
  const sut = new DbStartChallenge(findChallengeByIdRepositoryStub, loadTestResultsRepositoryStub)
  return {
    sut,
    findChallengeByIdRepositoryStub,
    loadTestResultsRepositoryStub
  }
}

const makeFakeFindChallengeByIdRepositoryStub = (): FindChallengeByIdRepository => {
  class FindChallengeByIdRepositoryStub implements FindChallengeByIdRepository {
    async findById (challengeId: string): Promise<ChallengeModel> {
      return await Promise.resolve(makeFakeChallenge())
    }
  }
  return new FindChallengeByIdRepositoryStub()
}

const makeFakeLoadTestResultsRepositoryStub = (): LoadTestResultsRepository => {
  class LoadTestResultsRepositoryStub implements LoadTestResultsRepository {
    async findOrCreate (accountId: string, challengeId: string): Promise<TestResultModel> {
      return await Promise.resolve(makeFakeTestResultModel())
    }

    async findByDate (date: Date): Promise<TestResultModel[]> {
      throw new Error('Method not implemented.')
    }
  }
  return new LoadTestResultsRepositoryStub()
}

const makeFakeTestResultModel = (): TestResultModel => ({
  id: 'any_id',
  accountId: 'any_account_id',
  challengeId: 'any_challenge_id',
  status: StatusTestResult.COMPLETED,
  score: 1,
  updatedAt: new Date(2022, 0, 0)
})

const makeFakeChallenge = (): ChallengeModel => ({
  id: 'valid_id',
  name: 'valid_name',
  description: 'valid_description',
  image_url: 'valid_image_url',
  categoryId: 'valid_category_id'
})

const makeFakeStartChallengeParams = (): StartChallenge.Params => ({
  accountId: 'valid_account_id',
  challengeId: 'valid_challenge_id'
})

describe('DbStartChallenge UseCase', () => {
  test('Should call FindChallengeByIdRepository with correct value', async () => {
    const { sut, findChallengeByIdRepositoryStub } = makeSut()
    const findSpy = jest.spyOn(findChallengeByIdRepositoryStub, 'findById')
    await sut.start(makeFakeStartChallengeParams())
    expect(findSpy).toHaveBeenCalledWith('valid_challenge_id')
  })

  test('Should throws if FindChallengeByIdRepository throws', async () => {
    const { sut, findChallengeByIdRepositoryStub } = makeSut()
    jest.spyOn(findChallengeByIdRepositoryStub, 'findById').mockReturnValueOnce(Promise.reject(new Error()))
    const promise = sut.start(makeFakeStartChallengeParams())
    await expect(promise).rejects.toThrow()
  })

  test('Should call LoadTestResultsRepository with correct value', async () => {
    const { sut, loadTestResultsRepositoryStub } = makeSut()
    const findSpy = jest.spyOn(loadTestResultsRepositoryStub, 'findOrCreate')
    await sut.start(makeFakeStartChallengeParams())
    expect(findSpy).toHaveBeenCalledWith('valid_account_id', 'valid_challenge_id')
  })

  test('Should throws if LoadTestResultsRepository throws', async () => {
    const { sut, loadTestResultsRepositoryStub } = makeSut()
    jest.spyOn(loadTestResultsRepositoryStub, 'findOrCreate').mockReturnValueOnce(Promise.reject(new Error()))
    const promise = sut.start(makeFakeStartChallengeParams())
    await expect(promise).rejects.toThrow()
  })

  test('Should return StartChallenge.Result on success', async () => {
    const { sut } = makeSut()
    const result = await sut.start(makeFakeStartChallengeParams())
    expect(result.challengeInfo).toEqual(makeFakeChallenge())
    expect(result.userInfo).toEqual(makeFakeTestResultModel())
  })
})
