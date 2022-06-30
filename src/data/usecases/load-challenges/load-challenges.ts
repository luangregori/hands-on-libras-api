import { LoadChallenges, FindAllChallengesRepository, FindChallengesByCategoryIdRepository } from './load-challenges-protocols'

export class DbLoadChallenges implements LoadChallenges {
  constructor (
    private readonly findAllChallengesRepository: FindAllChallengesRepository,
    private readonly findChallengesByCategoryIdRepository: FindChallengesByCategoryIdRepository
  ) {}

  async load (categoryId?: string): Promise<LoadChallenges.Result> {
    return categoryId
      ? await this.findChallengesByCategoryIdRepository.findbyId(categoryId)
      : await this.findAllChallengesRepository.findAll()
  }
}
