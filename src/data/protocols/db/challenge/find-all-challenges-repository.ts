import { ChallengeModel } from '@/domain/models/challenge'

export interface FindAllChallengesRepository{
  findAll: () => Promise<ChallengeModel[]>
}
