import { ChallengeModel } from '@/domain/models/challenge'

export interface FindChallengeByIdRepository {
  find: (challengeId: string) => Promise<ChallengeModel>
}
