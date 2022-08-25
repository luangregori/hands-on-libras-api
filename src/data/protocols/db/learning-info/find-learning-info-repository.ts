import { LearningInfoModel } from '@/domain/models'

export interface FindLearningInfoRepository {
  findByChallengeId: (challengeId: string) => Promise<LearningInfoModel[]>
}
