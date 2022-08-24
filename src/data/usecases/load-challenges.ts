import { LoadChallenges } from '@/domain/usecases'
import { FindAllChallengesRepository, FindChallengesByCategoryIdRepository } from '@/data/protocols'

export class DbLoadChallenges implements LoadChallenges {
  constructor (
    private readonly findAllChallengesRepository: FindAllChallengesRepository,
    private readonly findChallengesByCategoryIdRepository: FindChallengesByCategoryIdRepository
  ) {}

  async load (categoryId?: string): Promise<LoadChallenges.Result> {
    return categoryId
      ? await this.findChallengesByCategoryIdRepository.findByCategoryId(categoryId)
      : await this.findAllChallengesRepository.findAll()
  }
}
