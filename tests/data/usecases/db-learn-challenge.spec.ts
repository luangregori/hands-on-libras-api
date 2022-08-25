import { DbLearnChallenges } from '@/data/usecases'
import { FindLearningInfoRepository } from '@/data/protocols'
import { LearningInfoModel } from '@/domain/models'

interface SutTypes{
  sut: DbLearnChallenges
  findLearningInfoRepositoryStub: FindLearningInfoRepository
}

const makeSut = (): SutTypes => {
  const findLearningInfoRepositoryStub = makeFindLearningInfoRepositoryStub()
  const sut = new DbLearnChallenges(findLearningInfoRepositoryStub)
  return {
    sut,
    findLearningInfoRepositoryStub
  }
}

const makeFindLearningInfoRepositoryStub = (): FindLearningInfoRepository => {
  class FindLearningInfoRepositoryStub implements FindLearningInfoRepository {
    async findByChallengeId (challengeId: string): Promise<LearningInfoModel[]> {
      return await Promise.resolve([makeFakeLearningInfo()])
    }
  }
  return new FindLearningInfoRepositoryStub()
}

const makeFakeLearningInfo = (): LearningInfoModel => ({
  id: 'any_id',
  challengeId: 'any_challenge_id',
  description: 'any_description',
  word: 'any_word'
})

describe('Lear Challenge UseCase', () => {
  test('Should call FindLearningInfoRepository with correct value', async () => {
    const { sut, findLearningInfoRepositoryStub } = makeSut()
    const findSpy = jest.spyOn(findLearningInfoRepositoryStub, 'findByChallengeId')
    await sut.learn('any_challenge_id')
    expect(findSpy).toHaveBeenCalledWith('any_challenge_id')
  })

  test('Should throws if FindLearningInfoRepository throws', async () => {
    const { sut, findLearningInfoRepositoryStub } = makeSut()
    jest.spyOn(findLearningInfoRepositoryStub, 'findByChallengeId').mockReturnValueOnce(Promise.reject(new Error()))
    const promise = sut.learn('any_challenge_id')
    await expect(promise).rejects.toThrow()
  })

  test('Should return the infos', async () => {
    const { sut } = makeSut()
    const infos = await sut.learn('any_challenge_id')
    expect(infos).toEqual([makeFakeLearningInfo()])
  })
})
