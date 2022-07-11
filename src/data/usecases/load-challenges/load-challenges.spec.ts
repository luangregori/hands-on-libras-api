import { DbLoadChallenges } from './load-challenges'
import { ChallengeModel, FindAllChallengesRepository, FindChallengesByCategoryIdRepository } from './load-challenges-protocols'

interface SutTypes {
  sut: DbLoadChallenges
  findAllChallengesRepositoryStub: FindAllChallengesRepository
  findChallengesByCategoryIdRepositoryStub: FindChallengesByCategoryIdRepository
}

const makeSut = (): SutTypes => {
  const findAllChallengesRepositoryStub = makeFakeFindAllChallengesRepository()
  const findChallengesByCategoryIdRepositoryStub = makeFindChallengesByCategoryIdRepositoryStub()
  const sut = new DbLoadChallenges(findAllChallengesRepositoryStub, findChallengesByCategoryIdRepositoryStub)
  return {
    sut,
    findAllChallengesRepositoryStub,
    findChallengesByCategoryIdRepositoryStub
  }
}

const makeFakeFindAllChallengesRepository = (): FindAllChallengesRepository => {
  class FindAllChallengesRepositoryStub implements FindAllChallengesRepository {
    async findAll (): Promise<ChallengeModel[]> {
      return await Promise.resolve([makeFakeChallenge()])
    }
  }
  return new FindAllChallengesRepositoryStub()
}

const makeFindChallengesByCategoryIdRepositoryStub = (): FindChallengesByCategoryIdRepository => {
  class FindChallengesByCategoryIdRepositoryStub implements FindChallengesByCategoryIdRepository {
    async findByCategoryId (categoryId: string): Promise<ChallengeModel[]> {
      return await Promise.resolve([makeFakeChallenge()])
    }
  }
  return new FindChallengesByCategoryIdRepositoryStub()
}

const makeFakeChallenge = (): ChallengeModel => ({
  id: 'valid_id',
  name: 'valid_name',
  description: 'valid_description',
  image_url: 'valid_image_url',
  categoryId: 'valid_category_id'
})

describe('DbLoadChallenges UseCase', () => {
  test('Should call FindChallengesByCategoryIdRepository with correct value', async () => {
    const { sut, findChallengesByCategoryIdRepositoryStub } = makeSut()
    const findSpy = jest.spyOn(findChallengesByCategoryIdRepositoryStub, 'findByCategoryId')
    await sut.load('any_category_id')
    expect(findSpy).toHaveBeenCalledWith('any_category_id')
  })

  test('Should throws if FindChallengesByCategoryIdRepository throws', async () => {
    const { sut, findChallengesByCategoryIdRepositoryStub } = makeSut()
    jest.spyOn(findChallengesByCategoryIdRepositoryStub, 'findByCategoryId').mockReturnValueOnce(Promise.reject(new Error()))
    const promise = sut.load('any_category_id')
    await expect(promise).rejects.toThrow()
  })

  test('Should call FindAllChallengesRepository if no exists categoryId', async () => {
    const { sut, findAllChallengesRepositoryStub } = makeSut()
    const findSpy = jest.spyOn(findAllChallengesRepositoryStub, 'findAll')
    await sut.load()
    expect(findSpy).toHaveBeenCalledWith()
  })

  test('Should throws if FindAllChallengesRepository throws', async () => {
    const { sut, findAllChallengesRepositoryStub } = makeSut()
    jest.spyOn(findAllChallengesRepositoryStub, 'findAll').mockReturnValueOnce(Promise.reject(new Error()))
    const promise = sut.load()
    await expect(promise).rejects.toThrow()
  })

  test('Should return the categories', async () => {
    const { sut } = makeSut()
    const categories = await sut.load()
    expect(categories).toEqual([makeFakeChallenge()])
  })
})
