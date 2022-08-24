import { ChallengeModel } from '@/domain/models/challenge'

export interface FindChallengeByIdRepository {
  findById: (challengeId: string) => Promise<ChallengeModel>
}
